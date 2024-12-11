import { useMemo } from 'react'
import { isEmpty, last } from 'lodash'
import { useRouter } from 'next/router'

import type {
  IBasicDataFeed,
  LibrarySymbolInfo,
} from '../../../public/js/charting_library/charting_library'
import {
  datafeedConfig,
  datafeedDefaultInterval,
  symbolInfoConfig,
} from '@/config/datafeed'
import { useLocalStorage } from '@/hooks/use-storage'
import { useTokenQuery } from '@/views/token/hooks/use-token-query'
import { formatInterval, parsePricescale } from '@/utils/chart'
import { useWebsocket } from '@/hooks/use-websocket'
import {
  DatafeedEmitEvents,
  DatafeedOnEvents,
  DatafeedCache,
  DatafeedCandles,
} from './datafeed-types'
import { useLruMap } from '@/hooks/use-lru-map'
import { apiUrl } from '@/config/url'
import { Routes } from '@/routes'
import { joinPaths } from '@/utils'
import { useChainInfo } from '@/hooks/use-chain-info'

export const useDatafeed = () => {
  const router = useRouter()
  const { chainName, tokenAddr } = useTokenQuery()
  const { native } = useChainInfo(chainName)
  const cache = useLruMap<DatafeedCache>()
  const ws = useWebsocket<DatafeedOnEvents, DatafeedEmitEvents>(
    `${apiUrl.ws}/v2/coin/candles`,
    { shouldReconnect: () => router.pathname === Routes.TokenPage }
  )
  const displayedUnit = useMemo<Record<keyof DatafeedCandles, string>>(
    () => ({
      master: native?.symbol || '',
      usd: 'USD',
    }),
    [native]
  )

  const { getStorage, setStorage } = useLocalStorage()
  const interval = getStorage('chart_interval') || datafeedDefaultInterval

  const createDatafeed = (unit: keyof DatafeedCandles) => {
    return {
      onReady: (onReadyCallback) => {
        setTimeout(() => onReadyCallback(datafeedConfig))
      },
      searchSymbols: (_, __, ___, ____) => {},
      resolveSymbol: async (symbolName, onResolve, onError, extension) => {
        ws.on('candles', ({ data }) => {
          const bars = data[unit]
          const lastBar = last(bars)
          const symbolInfo: LibrarySymbolInfo = {
            ...symbolInfoConfig,
            name: symbolName,
            full_name: joinPaths(symbolName, displayedUnit[unit]),
            description: joinPaths(symbolName, displayedUnit[unit]),
            pricescale: parsePricescale(lastBar?.open),
          }

          cache.set('bars', bars)
          cache.set('lastBar', lastBar)
          onResolve(symbolInfo)
        })
        ws.emit('listen', { chain: chainName, token: tokenAddr, interval })
      },
      getBars: async (symbolInfo, resolution, period, onResult, onError) => {
        const interval = formatInterval(resolution)

        if (period.firstDataRequest) {
          const cachedBars = cache.get('bars') || []
          const cachedInterval = getStorage('chart_interval')

          // Have cached bars & interval no change, use cache
          if (!isEmpty(cachedBars) && cachedInterval === interval) {
            onResult(cachedBars, { noData: false })
            return
          }

          ws.on('candles', ({ data }) => {
            const bars = data[unit]

            if (!isEmpty(bars)) cache.set('lastBar', last(bars))
            setStorage('chart_interval', interval)
            onResult(bars, { noData: isEmpty(data) })
          })
          ws.emit('unlisten', null)
          ws.emit('listen', {
            interval,
            token: tokenAddr,
            chain: chainName,
          })
          return
        }

        ws.on('candles', ({ data, extra }) => {
          const bars = data[unit]

          if (!isEmpty(bars)) cache.set('lastBar', last(bars))
          onResult(bars, { noData: !extra?.hasmore })
        })
        ws.emit('history', { start: period.from, end: period.to })
      },
      subscribeBars: (_, resolution, onTick, uid, onRest) => {
        ws.on('update', ({ data }) => {
          for (const bar of data.data[unit]) {
            const lastTime = cache.get('lastBar')?.time || 0
            if (bar.time < lastTime) return // We can't update old bar

            onTick(bar)
            cache.set('lastBar', bar)
          }
        })
      },
      unsubscribeBars: (uid) => {},
    } as IBasicDataFeed
  }

  const removeDatafeed = () => {}

  return {
    isConnected: ws.isOpen,
    createDatafeed,
    removeDatafeed,
  }
}
