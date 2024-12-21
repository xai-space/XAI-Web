import { type ComponentProps } from 'react'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import {
  RainbowKitProvider,
  lightTheme,
  type Locale,
} from '@rainbow-me/rainbowkit'
import i18n from 'i18next'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'

import i18nConfig from '@/i18n'
import { wagmiConfig } from '@/config/wagmi'
import { SolanaProvider } from '@/packages/react-sol'
import { solConfig } from '@/config/sol'
import { dynamicConfig } from '@/config/dynamic'

export const queryClient = new QueryClient()

export const AppProviders = ({ children }: ComponentProps<'div'>) => {
  return (
    <NextThemeProvider attribute="class" defaultTheme="dark">
      <I18nextProvider i18n={i18nConfig}>
        <DynamicContextProvider theme={'dark'} settings={dynamicConfig}>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <SolanaProvider
                connection={{
                  endpoint: solConfig.endpoint,
                  config: { commitment: 'confirmed' },
                }}
                wallet={{ wallets: solConfig.wallets, autoConnect: true }}
              >
                <DynamicWagmiConnector>
                  <RainbowKitProvider
                    modalSize="compact"
                    locale={i18n.language as Locale}
                    theme={lightTheme({
                      accentColor: 'black',
                      accentColorForeground: 'white',
                      borderRadius: 'medium',
                    })}
                  >
                    {children}
                  </RainbowKitProvider>
                </DynamicWagmiConnector>
              </SolanaProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </DynamicContextProvider>
      </I18nextProvider>
    </NextThemeProvider>
  )
}

export default AppProviders
