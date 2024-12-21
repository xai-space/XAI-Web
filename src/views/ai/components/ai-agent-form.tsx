import { FormTextareaField } from '@/components/form-field'
import { FormInputField } from '@/components/form-input-field'
import { FormSelectField } from '@/components/form-select-field'
import ImageUpload from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { createField, useFields } from '@/hooks/use-fields'
import { useUploadImage } from '@/hooks/use-upload-image'
import { isEmpty } from 'lodash'
import { nanoid } from 'nanoid'
import {
  DOMAttributes,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { IoAdd } from 'react-icons/io5'
import { toast } from 'sonner'
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md'
import { RiNftFill } from 'react-icons/ri'
import { apiUrl, staticUrl } from '@/config/url'
import { aiApi } from '@/api/ai'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { defaultAgentLogo, loadingSVG } from '@/config/link'
import { defaultUserId } from '@/config/base'
import { useAIAgentStore } from '@/stores/use-chat-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { TokenType } from '@/enums/token'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Input from '@/components/input'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
const formFields = {
  logo: 'logo',
  name: 'name',
  description: 'description',
  greeting: 'greeting',
  isPublic: 'isPublic',
  logoIdentify: 'logoIdentify',
} as const
import { NftAgentDialog, NftInfo } from './nft-agent-dialog'
import { UploadImageRes, otherApi } from '@/api/other'
import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core'
import { useUserStore } from '@/stores/use-user-store'

interface Props {
  isCreate: boolean
}

export const AIAgentForm = ({ isCreate }: Props) => {
  const { t } = useTranslation()
  const inputId = useMemo(nanoid, [])
  const { agentInfo, setAgentInfo } = useAIAgentStore()
  const [nftInfo, setNftInfo] = useState<NftInfo>()

  const { userInfo } = useUserStore()

  const router = useRouter()

  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [submiting, setSubmiting] = useState(false)
  const [open, setOpen] = useState(false)

  const validateInput = (v: string) => v.trim().length !== 0

  const formSchema = z.object({
    [formFields.logo]: z.string().refine(validateInput, require),
    [formFields.name]: z.string().refine(validateInput, require),
    [formFields.description]: z.string().refine(validateInput, require),
    [formFields.isPublic]: z.string().refine(validateInput, require),
    [formFields.logoIdentify]: z.string().refine(validateInput, require),
    [formFields.greeting]: z.string().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [formFields.logo]: !isCreate ? agentInfo?.logo : '',
      [formFields.name]: !isCreate ? agentInfo?.name : '',
      [formFields.description]: !isCreate ? agentInfo?.description : '',
      [formFields.greeting]: !isCreate ? agentInfo?.greeting : '',
      [formFields.isPublic]: !isCreate
        ? `${Number(agentInfo?.is_public)}` || '1'
        : '1',
      [formFields.logoIdentify]: isCreate
        ? agentInfo?.logo_identify || '0'
        : '0',
    },
  })

  let {
    isUploading,
    blobUrl,
    onChangeUpload,
    onSubmitImg,
    clearFile,
    onUrlUpload,
  } = useUploadImage({
    inputEl: inputRef.current,
    showToast: false,
  })

  const SelectPermission = [
    {
      value: '0',
      label: <div>{t('only.self')}</div>,
    },
    {
      value: '1',
      label: <div>{t('everyone.visible')}</div>,
    },
  ]

  const onSubmit = async () => {
    try {
      setSubmiting(true)
      let url: UploadImageRes[] | undefined

      if (form.getValues('logoIdentify') === '0') {
        url = await onSubmitImg()
      } else {
        url = await onUrlUpload(nftInfo?.url!)
      }

      const sendData = isCreate ? aiApi.createAgent : aiApi.updateAgent

      const { data } = await sendData({
        name: form.getValues('name'),
        is_public: form.getValues('isPublic') || '',
        logo: url?.[0]?.url || '',
        greeting: form.getValues('greeting') || '',
        instructions: [],
        description: form.getValues('description'),
        logo_identify: form.getValues('logoIdentify') || '',
        agent_id: !isCreate ? agentInfo?.agent_id : undefined,
      })

      if (isCreate) {
        router.replace(`${Routes.AIChat}/${data.agent_id}`)
        toast.success(t('create.agent.success'))
      } else {
        router.back()
        toast.success(t('edit.agent.success'))
      }

      form.reset()
      clearFile()
    } catch (e: any) {
      toast.warning(t('create.agent.errpr') + e.toString())
    } finally {
      setSubmiting(false)
    }
  }

  const submitDisable = () => {
    if (isCreate) {
      return (
        isEmpty(form.getValues('logo')?.trim()) ||
        isEmpty(form.getValues('name')?.trim()) ||
        isEmpty(form.getValues('description')?.trim()) ||
        isUploading ||
        submiting
      )
    }

    return (
      isEmpty(form.getValues('name')?.trim()) ||
      isEmpty(form.getValues('description')?.trim()) ||
      isUploading ||
      submiting
    )
  }

  const submintText = () => {
    if (isCreate) {
      return submiting ? t('submiting') : t('create.agent')
    }
    return submiting ? t('saving') : t('save.agent')
  }

  const getLogoUrl = (logoValue: string) => {
    if (!logoValue) return defaultAgentLogo
    if (logoValue.startsWith('data:')) return logoValue
    if (logoValue.startsWith('http')) return logoValue

    return `${staticUrl}${logoValue}`
  }

  useEffect(() => {
    const agentId = router.query.id
    console.log(agentInfo, typeof agentId === 'string', !isCreate)

    if (!agentInfo && typeof agentId === 'string' && !isCreate) {
      aiApi.getAgentInfo(agentId).then(({ data }) => {
        setAgentInfo(data)
        form.setValue('name', data.name || '')
        form.setValue('logo', data.logo || '')
        form.setValue('description', data.description || '')
        form.setValue('greeting', data.greeting || '')
        // form.setValue('isPublic', data.)
      })
    }
  }, [router.query.id, agentInfo])

  useEffect(() => {
    if (blobUrl.length) {
      console.log('blobUrl List', blobUrl)

      form.setValue('logo', blobUrl?.[0])
    }
  }, [blobUrl])

  if (!isCreate && !agentInfo) {
    return <img src={loadingSVG} width={60} height={60} />
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="flex flex-col w-full px-[20%] max-sm:px-[5%]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name={formFields?.logo}
          render={(field) => (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="relative cursor-pointer w-[100px] mx-auto">
                  <img
                    src={getLogoUrl(field.field.value!)}
                    alt="Logo"
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] object-cover border-white border rounded-full"
                  />
                  <div className="absolute right-0 bottom-0 flex justify-center items-center rounded-full bg-[#616fd6]">
                    <IoAdd size={32} color="#ffffff"></IoAdd>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="flex items-center space-x-[5px]"
                  onClick={() => {
                    inputRef.current?.click()
                    form.setValue('logoIdentify', '0')
                  }}
                >
                  <MdOutlinePhotoSizeSelectActual size={20} />
                  <span>{t('local.upload')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center space-x-[5px]"
                  onClick={() => {
                    form.setValue('logoIdentify', '1')
                    setOpen(true)
                  }}
                >
                  <RiNftFill size={20} color="#FFBC58FF" />
                  <span className="text-[#FFBC58FF]">
                    {t('use.nft.profile')}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        ></FormField>
        <ImageUpload
          id={inputId}
          ref={inputRef}
          onChange={onChangeUpload}
          className="hidden ml-2"
        />

        <FormField
          control={form?.control}
          name={formFields?.name!}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="mt-0 font-bold">{t('name')}*</FormLabel>
              <FormControl className="w-full">
                <Input
                  placeholder={t('name.input')}
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={form?.control}
          name={formFields?.description!}
          render={({ field }) => (
            <FormItem className="w-full mt-2">
              <FormLabel className="mt-0 font-bold">
                {t('description')}*
              </FormLabel>
              <FormControl className="w-full">
                {/* <Textarea {...field} placeholder={t('description.input')} /> */}
                <TextareaAutosize
                  {...field}
                  placeholder={t('description.input')}
                  className="p-2 border-2 border-input rounded-sm resize-none min-h-24 text-sm focus:shadow-[0_0_5px_3px_#A4C9EC!important] bg-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={form?.control}
          name={formFields?.greeting!}
          render={({ field }) => (
            <FormItem className="w-full mt-2">
              <FormLabel className="mt-0 font-bold">
                {t('welcome,msg')}
              </FormLabel>
              <FormControl className="w-full">
                <Input
                  placeholder={t('welcome.input')}
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={form?.control}
          name={formFields?.isPublic!}
          render={({ field }) => (
            <FormItem className="w-full mt-2">
              <FormLabel className="mt-0 font-bold">
                {t('power.settting')}
              </FormLabel>
              <FormControl className="w-full">
                <Select
                  {...field}
                  defaultValue={'1'}
                  onValueChange={(v) => {
                    form.setValue('isPublic', v)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SelectPermission?.map((data) => {
                      return (
                        <SelectItem key={data.value} value={data.value}>
                          {data.label}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        {/* <FormSelectField
          id={isPublicId}
          label={t('power.settting')}
          disabled={submiting}
          defaultValue={'1'}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => onChange(e, 'logoIdentify')}
          data={SelectPermission}
        /> */}

        <Button
          type="submit"
          className="mt-5 !mx-auto w-full"
          disabled={submitDisable()}
        >
          {submintText()}
        </Button>
        <NftAgentDialog
          open={open}
          nftInfo={nftInfo}
          setOpen={setOpen}
          setNftInfo={(info) => {
            setNftInfo(info)
            form.setValue('logo', info.url)
          }}
        ></NftAgentDialog>
      </form>
    </Form>
  )
}
