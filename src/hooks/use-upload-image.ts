import React, { useState } from 'react'
import { first, isArray } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { UploadImageRes, otherApi } from '@/api/other'
import { reportException } from '@/errors'
import { ApiCode } from '@/api/types'

interface Options {
  inputEl?: HTMLInputElement | null
  maxFile?: number
  showToast?: boolean
  onSuccess?: (url: UploadImageRes[]) => void
  onError?: (reason: string) => void
  onFinally?: () => void
}

export const useUploadImage = (options?: Options) => {
  const { inputEl, maxFile = 1, showToast = true, onSuccess, onError, onFinally } = options || {}
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const [blobUrl, setBlobUrl] = useState<(string)[]>([])
  const isMultifile = maxFile > 1

  const {
    data,
    isPending: isUploading,
    mutateAsync,
    reset,
  } = useMutation({
    mutationKey: [otherApi.uploadImage.name],
    mutationFn: isMultifile ? otherApi.uploadImages : otherApi.uploadImage,
    onMutate: () => showToast && toast.loading(t('uploading')),
    onSettled: (_, __, ___, id) => {
      id && toast.dismiss(id)
      onFinally?.()
    },
    onError: (e: Response & Error) => {
      clearFile()
      onError?.(e.message)
      const msg =
        e.status === ApiCode.TooLarge ? t('upload.too-large') : e.message
      toast.error(t('upload.failed') + ' ' + msg)
    },
    onSuccess: ({ data }) => {
      showToast && toast.success(t('upload.success'))
      onSuccess?.(Array.isArray(data) ? data : [data])
    },
  })

  const onChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>, isUpload: boolean = false) => {
    // Cannot to upload image if not logged in.
    // if (!getStorage('token')) {
    //   e.preventDefault()
    //   clearFile()
    //   toast.error(t('login-before'))
    //   return
    // }


    const newFiles = e.target.files!


    if (!_checkCount(newFiles.length)) return

    const blobList: string[] = []
    const fileList = []

    for (let i = 0; i < newFiles.length; i++) {
      const reader = new FileReader()
      const file = newFiles[i]
      console.log(file);

      reader.onload = (event) => {
        const result = event.target?.result
        if (typeof result === 'string') {
          blobList.push(result)
          setBlobUrl(blobUrl.concat(blobList))
        }
      }
      fileList.push(file)
      reader.readAsDataURL(file)
    }

    setFiles(files.concat(fileList))


    if (isUpload) {
      // clear files
      files.splice(0, files.length)
      return await onSubmitImg(fileList)
    }
  }

  const onSubmitImg = async (_files?: File[]) => {

    if (_files?.length) {
      files.push(..._files)
    }

    const formData = new FormData()

    if (!files?.length) return

    if (!isMultifile) {
      formData.append('file', files[0]);
    } else {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], `${Math.random()}${files[i].name}`
        );
      }
    }


    try {
      const { data } = await mutateAsync(formData)

      console.log("Image Data: ", data);

      return isArray(data) ? data : [data]

    } catch (err) {
      reportException(err)
    }
  }

  const onUrlUpload = async (url: string | string[]) => {
    const formData = new FormData()
    formData.append(isMultifile ? 'urls' : 'url', isArray(url) ? JSON.stringify(url) : url)

    try {
      const { data } = await mutateAsync(formData)
      return isArray(data) ? data : [data]
    } catch (err) {
      reportException(err)
    }
  }

  const closeItem = (i: number) => {
    reset()
    if (inputEl) inputEl.value = ''
    if (blobUrl.length) {
      blobUrl.splice(i, i + 1)
      setBlobUrl([...blobUrl])
    }
    if (files) {
      files.splice(i, i + 1)
      setFiles([...files])
    }
  }

  const clearFile = () => {
    reset()
    if (files) setFiles([])
    if (blobUrl.length) setBlobUrl([])
    if (inputEl) inputEl.value = ''
  }

  const _checkCount = (newFiles: number = 0) => {
    const num = newFiles + files.length

    if (num > maxFile && maxFile != 1) {
      toast.warning(t('max.file.warn').replace('$1', `${maxFile}`))
      return false;
    }

    return true
  }


  const checkCount = () => {
    const num = files.length
    if (num >= maxFile) {
      toast.warning(t('max.file.warn').replace('$1', `${maxFile}`))
      return false;
    }
    return true
  }

  return {
    url: !data ? data : isArray(data.data) ? data.data : [data.data],
    files,
    blobUrl,
    isUploading,
    onChangeUpload,
    onUrlUpload,
    onSubmitImg,
    clearFile,
    checkCount,
    closeItem
  }
}
