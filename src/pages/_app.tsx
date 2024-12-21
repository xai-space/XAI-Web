'use-client'

import Head from 'next/head'
import { Buffer } from 'buffer'
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import 'react-photo-view/dist/react-photo-view.css'
import 'react-markdown-editor-lite/lib/index.css'
import 'md-editor-rt/lib/style.css'

import NProgress from 'nprogress'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/layouts/app'
import { Router } from 'next/router'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  ;(global as any).Buffer = Buffer

  const getLayout = Component.getLayout ?? ((page) => page)

  Router.events.on('routeChangeStart', () => NProgress.start())
  Router.events.on('routeChangeComplete', () => NProgress.done())
  Router.events.on('routeChangeError', () => NProgress.done())

  return (
    <>
      <Head>
        <title>XAI</title>
        <meta name="referrer" content="no-referrer" />
        <meta
          name="keywords"
          content="meme, XAI, memecoin, crypto, web3, blockchain"
        />
        <meta
          name="description"
          content="XAI is a unique memecoin launch platform driven by AI."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>

      <AppProviders>
        <AppLayout>{getLayout(<Component {...pageProps} />)}</AppLayout>
      </AppProviders>
      <ProgressBar height="4px" color="#8400FFFF" />
    </>
  )
}
