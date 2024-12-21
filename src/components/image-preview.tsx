import { staticUrl } from '@/config/url'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface Props {
  open: boolean
  imageUrl: string
  onOpenChange: (open: boolean) => void
}

export const ImagePreview = ({ open, onOpenChange, imageUrl }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      contentProps={{
        className: 'px-8 max-w-[95vw] w-max',
      }}
    >
      <div className="pt-3">
        <img src={staticUrl + imageUrl} alt="Image" className="rounded-md" />
      </div>
    </Dialog>
  )
}
