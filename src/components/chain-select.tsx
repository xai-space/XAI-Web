import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { IoIosMore } from 'react-icons/io'
import {
  useDynamicContext,
  useSwitchNetwork,
} from '@dynamic-labs/sdk-react-core'
import { toast } from 'sonner'

import { useTranslation } from 'react-i18next'
import { useChainId, useSwitchChain } from 'wagmi'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useChainsStore } from '@/stores/use-chains-store'
import { ChainData } from '@/api/chain/type'
import { Network } from '@/enums/contract'
import { utilLang } from '@/utils/lang'
import { useDynamicWallet } from '@/hooks/dynamic/use-dynamic-wallet'
import { staticUrl } from '@/config/url'

interface Props extends Omit<ComponentProps<typeof RadioGroup>, 'onChange'> {
  onChange?: (chain: ChainData) => void
}

export const ChainSelect = forwardRef<HTMLDivElement, Props>((p, ref) => {
  const { className, defaultValue, value, onChange, onValueChange, ...props } =
    p
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { loadingChains, chains, evmChainsMap, chainsMap } = useChainsStore()
  const chainId = useChainId()
  const switchNetwork = useSwitchNetwork()
  const { primaryWallet, setShowDynamicUserProfile } = useDynamicContext()
  const { currentNetwork } = useDynamicWallet()

  const isSelected = useMemo(() => {
    console.log(chains, 'chains')

    const idx = chains?.findIndex((c) => {
      return false
      // const v = value || defaultValue || chainId.toString()
      // return v === c.id || v === c.name
    })
    return idx > 6
  }, [chains, value, defaultValue])

  const isChainSelected = (c: Partial<ChainData>) => {
    const v = value || defaultValue || chainId.toString()
    return v === c.id
  }

  const handleSwitchWarning = (chainName: string) => {
    setShowDynamicUserProfile(true)
    toast.warning(utilLang.replace(t('switch_wallet'), [chainName]))
  }

  const switchChain = (c: ChainData | undefined) => {
    if (!primaryWallet) return toast.warning(t('wallet.err.connect'))
    if (!c) return

    if (Network.Evm === c.network_type) {
      // Check current network
      if (currentNetwork !== Network.Evm) {
        return handleSwitchWarning(c.id)
      }

      switchNetwork({ wallet: primaryWallet!, network: Number(c.id) })
        .then(() => {
          onChange?.(c)
        })
        .catch()
    } else if (Network.Svm === c.network_type) {
      // check current network
      if (currentNetwork !== Network.Svm) {
        return handleSwitchWarning(c.id)
      }

      onChange?.(c)
    } else {
      onChange?.(c)
    }
  }

  useEffect(() => {
    const strId = chainId.toString()
    const chain = evmChainsMap[strId]

    if (isChainSelected({ id: strId }) && chain) {
      onChange?.(chain)
    }
  }, [evmChainsMap])

  if (loadingChains) return <div>{t('loading')}</div>

  return (
    <RadioGroup
      ref={ref}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className={cn(
        'flex w-max gap-0 border-2 rounded-md overflow-hidden flex-wrap max-w-[300px] max-sm:w-max',
        props.disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {chains.slice(0, 7)?.map((c, i) => (
        <RadioGroupItem
          key={c.id}
          value={c.id}
          title={c.id}
          className={cn(
            'flex items-center justify-center min-w-9 p-0 min-h-8',
            chains.length - 1 !== i && 'border-r-2 border-black',
            isChainSelected(c) && 'bg-secondary-foreground'
          )}
          onClick={() => switchChain(c)}
        >
          <img
            src={`${staticUrl}${c.logo_url?.slice(1)}`}
            alt={c.id}
            className="w-7 h-7 rounded-full"
          />
        </RadioGroupItem>
      ))}

      {chains.length > 7 && (
        <div
          className={cn(
            'w-9 flex justify-center items-center cursor-pointer hover:bg-gray-100',
            isSelected && 'bg-white text-white hover:bg-white/50'
          )}
          onClick={() => setOpen(true)}
        >
          <Select
            open={open}
            onOpenChange={setOpen}
            value={value}
            onValueChange={(v) => {
              setOpen(false)
              switchChain(evmChainsMap[v])
            }}
            disabled={props.disabled}
          >
            <SelectTrigger
              showArrow={false}
              className="!border-0 !rounded-none !p-0 !translate-x-0 !translate-y-0 flex justify-center items-center h-8"
            >
              {isSelected ? (
                <img
                  src={`${staticUrl}${
                    evmChainsMap[value || defaultValue || '']?.logo_url
                  }`}
                  alt="chain"
                  className="w-6 h-6 bg-black"
                />
              ) : (
                <IoIosMore size={28} />
              )}
            </SelectTrigger>
            <SelectContent className="min-w-2">
              {chains.slice(7)?.map((c) => (
                <SelectItem
                  key={c.id}
                  value={c.id}
                  showCheck={false}
                  isActive={isChainSelected(c)}
                  className={cn(isChainSelected(c) && 'mb-1 hover:!bg-black')}
                  title={c.id}
                >
                  <img
                    src={`${staticUrl}${c.logo_url}`}
                    alt={c.id}
                    className="w-6 h-6"
                  />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </RadioGroup>
  )
})
