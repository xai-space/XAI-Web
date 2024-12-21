import { t } from 'i18next'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { LuRefreshCcw } from 'react-icons/lu'

import {
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { Input } from '@/components/input'
import { aiApi } from '@/api/ai'
import { Button } from '@/components/ui/button'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useCreateTokenContext } from '@/contexts/create-token'
import ConnectWallet from '@/components/connect-wallet'
import { staticUrl } from '@/config/url'
import { isArray } from 'lodash'

let memeLogoSign = new AbortController()

export const LogoField = () => {
  const { form, formFields, onChangeUpload } = useCreateTokenContext()
  const { loadingLogo, setLoadingLogo } = useAimemeInfoStore()
  const { playGuaGua } = useAudioPlayer()
  const inputRef = useRef<HTMLInputElement>(null)

  // TODO: check for connect
  // const { checkForConnect } = useCheckAccount()

  const createLogo = (e: any) => {
    e.stopPropagation()
    e.preventDefault()

    return toast.warning('还在开发中...')

    // if (!walletIsConnected()) return
    if (form.getValues(formFields?.fullname) === '') {
      toast.warning(t('need.base.info.warning'))
      return
    }
    setLoadingLogo(true)
  }

  const fetchMemeLogo = () => {
    memeLogoSign.abort()
    memeLogoSign = new AbortController()
    aiApi
      .getMemeImage(
        {
          name: form.getValues(formFields.fullname)! as string,
          description: form.getValues(formFields.description)! as string,
        },
        memeLogoSign.signal
      )
      .then(({ data }) => {
        if (data) {
          form.setValue(formFields.logo, data?.images?.[0])
        }
      })
      .finally(() => {
        setLoadingLogo(false)
      })

    // TODO: wait for api
    setLoadingLogo(false)
    return form.setValue(
      formFields.logo,
      'https://cc01.plusai.io/user-content/file-UKiNDTyWgLBKReCNoBwR9b?se=2024-11-26T02%3A22%3A18Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dce4662d4-8957-4e7e-b8f6-facff6d93f36.webp&sig=FRMJRzKjs4yPvIVpdKk9It0QBNzICP0Ro4PRLdN2nZo%3D'
    )
  }

  useEffect(() => {
    if (loadingLogo) {
      playGuaGua()
      fetchMemeLogo()
    }
  }, [loadingLogo])

  useEffect(() => {
    return () => {
      memeLogoSign.abort('')
    }
  }, [])

  return (
    <div>
      <FormField
        control={form?.control}
        name={formFields?.logo!}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div
                className={cn(
                  'relative flex',
                  'border-2 rounded-md overflow-hidden',
                  'w-[150px] h-[150px]'
                )}
              >
                {loadingLogo ? (
                  <div
                    className={cn(
                      'absolute top-0 left-0 flex flex-col items-center justify-end w-full h-full p-2',
                      !field.value && !loadingLogo ? 'justify-center' : ''
                    )}
                  >
                    <img
                      src="/images/logo-loading.png"
                      alt="logo"
                      className="w-[60%] h-[60%] object-cover"
                    />
                    <div className="mt-2 px-3 text-sm text-center">
                      {t('ai.createing.logo')}
                    </div>
                  </div>
                ) : field.value ? (
                  <div>
                    <img
                      src={`${staticUrl}${field.value}` as string}
                      alt="logo"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'absolute top-0 left-0 flex flex-col items-center justify-end w-full h-full p-2',
                      !field.value && !loadingLogo ? 'justify-center' : ''
                    )}
                  >
                    <div className=" text-center">
                      <div className="mb-4 text-gray-400">{t('meme.logo')}</div>
                      <span>{t('click.upload')}</span>
                    </div>
                  </div>
                )}
                <Input
                  placeholder={t('logo.placeholder')}
                  type="file"
                  className="h-full opacity-0"
                  inputClassName="h-full w-full absolute top-0 left-0 cursor-pointer z-10"
                  ref={inputRef}
                  onChange={async (e) => {
                    try {
                      const url = await onChangeUpload(e, true)
                      console.log('url', url)
                      if (isArray(url)) form.setValue('logo', url[0].url)
                    } catch (error) {
                      console.log(error)
                    } finally {
                      if (inputRef.current) inputRef.current.value = ''
                    }
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />

            {!loadingLogo ? (
              <ConnectWallet>
                <Button className="mt-2 mb-2" onClick={createLogo}>
                  <LuRefreshCcw className="mr-1" />
                  {t('create.ai.logo')}
                </Button>
              </ConnectWallet>
            ) : null}
          </FormItem>
        )}
      />
    </div>
  )
}
