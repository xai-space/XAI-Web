import { ImagePreview } from '@/components/image-preview'
import { staticUrl } from '@/config/url'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Props {
  images?: string[]
}

export const ArticleImages = ({ images }: Props) => {
  const [show, setShow] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  if (!images?.length) return <></>

  return (
    <>
      <div
        className={cn(
          'grid mt-2 p-0 justify-between items-center gap-1 rounded-md overflow-hidden cursor-pointer',
          `grid-cols-${images.length}`
        )}
      >
        {images.map((url) => {
          return (
            <img
              key={url}
              src={`${staticUrl}${url}`}
              alt="image"
              className={cn(
                'w-full h-full object-cover max-w-max max-h-max',
                images.length === 1 ? 'rounded-md' : ''
              )}
              onClick={() => {
                setShow(true)
                setImageUrl(url)
              }}
            />
          )
        })}
      </div>
      <ImagePreview
        open={show}
        onOpenChange={setShow}
        imageUrl={imageUrl}
      ></ImagePreview>
    </>
  )
}
