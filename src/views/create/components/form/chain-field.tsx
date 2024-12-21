import { useEffect } from 'react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { fmt } from '@/utils/fmt'
import { ChainSelect } from '@/components/chain-select'
import { useCreateTokenContext } from '@/contexts/create-token'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useDynamicWallet } from '@/hooks/dynamic/use-dynamic-wallet'

export const ChainField = () => {
  const { form, formFields } = useCreateTokenContext()
  // const { chainId = 0 } = useAccount()
  const { chainsInfo } = useDynamicWallet()
  const { chainName, id } = useChainInfo(form.watch('chainName'))

  // Default select.
  useEffect(() => {
    if (!chainsInfo) return

    form.setValue('chainName', chainsInfo.id)
  }, [chainsInfo])

  return (
    <FormField
      control={form.control}
      name={formFields.chainName}
      render={({ field }) => (
        <FormItem className="mt-0">
          <FormLabel className="mt-0 font-bold">*{fmt.withChain(id)}</FormLabel>
          <FormControl>
            <ChainSelect
              defaultValue={id}
              value={field.value}
              onChange={(c) => {
                console.log(c)

                field.onChange(c.id)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
