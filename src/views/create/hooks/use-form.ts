import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUploadImage } from '@/hooks/use-upload-image'
import { t } from 'i18next'

import { useDeploy } from './use-deploy'
import { useChainsStore } from '@/stores/use-chains-store'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { Marketing } from '@/api/token/types'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { TokenType } from '@/enums/token'
import { marketingSchema } from '@/components/marketing-field'
import { useChainInfo } from '@/hooks/use-chain-info'
import { parseMediaUrl } from '@/utils'
import { CoinApi } from '@/api/coin'
import { staticUrl } from '@/config/url'

export const formFields = {
  fullname: 'fullname',
  symbol: 'symbol',
  description: 'description',
  twitter: 'twitter',
  telegram: 'telegram',
  website: 'website',
  chainName: 'chainName',
  logo: 'logo',
  poster: 'poster',
  coinType: 'coinType',
  marketing: 'marketing',
} as const

const require = {
  message: t('fields.required'),
}

const validateInput = (v: string) => v.trim().length !== 0

const isWebsite = (v?: string) => {
  if (!v) return true

  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
    'i'
  )
  return !!pattern.test(v)
}

const formSchema = z
  .object({
    [formFields.fullname]: z.string().refine(validateInput, require),
    [formFields.symbol]: z.string().refine(validateInput, require),
    [formFields.description]: z.string().refine(validateInput, require),
    [formFields.twitter]: z.string().optional(),
    [formFields.telegram]: z.string().optional(),
    [formFields.website]: z
      .string()
      .optional()
      .refine(isWebsite, {
        message: t('url.error'),
      }),
    [formFields.chainName]: z.string().refine(validateInput, require),
    [formFields.logo]: z.string().refine(validateInput, require),
    [formFields.poster]: z.array(z.string()).optional(),
    [formFields.coinType]: z.number(),
    buyAmount: z.string().optional(),
  })
  .merge(marketingSchema)

export const useCreateTokenForm = () => {
  const { formInfo } = useAimemeInfoStore()
  const { checkForChain } = useCheckAccount()
  const { evmChainsMap, loadingChains } = useChainsStore()
  const { url, onChangeUpload } = useUploadImage()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [formFields.fullname]: formInfo?.name || '',
      [formFields.symbol]: formInfo?.symbol || '',
      [formFields.description]: formInfo?.description || '',
      [formFields.twitter]: '',
      [formFields.telegram]: '',
      [formFields.website]: '',
      [formFields.chainName]: '',
      [formFields.logo]: '',
      [formFields.poster]: [],
      [formFields.coinType]: TokenType.Normal,
      [formFields.marketing]: [],
      buyAmount: '',
    },
  })
  const chainName = form.watch('chainName')
  const { chain } = useChainInfo(chainName)
  const deployResults = useDeploy(chainName)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!(await form.trigger())) return

    // TODO: Modified after having new library
    // if (!checkForConnect()) return
    // if (!(await checkForChain(evmChainsMap[values.chainName]?.id))) return

    if (deployResults.isDeploying) return

    // Submit the token information to the back end first to create an Agent.

    deployResults.deploy({
      name: values.fullname! as string,
      symbol: values.symbol! as string,
      description: values.description! as string,
      image: `${staticUrl}${values.logo}`,
      chain: values.chainName as string,
      twitter: parseMediaUrl('x', values.twitter),
      telegram: parseMediaUrl('tg', values.telegram),
      website: parseMediaUrl('website', values.website),
      coin_type: values.coinType as number,
      posters: values.poster as string[],
      buyAmount: values.buyAmount || '0',
      // Below only used for frontend.
      // marketing: values.marketing as Marketing[],
    })
  }

  return {
    url,
    form,
    formFields,
    formSchema,
    loadingChains: loadingChains,
    reserveSymbol: chain?.master_symbol,
    onSubmit,
    onChangeUpload,
    ...deployResults,
  }
}
