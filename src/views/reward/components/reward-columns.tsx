import { type ColumnDef } from '@tanstack/react-table'
import { t } from 'i18next'
import dayjs from 'dayjs'

import { RewardItem } from '@/api/invite/types'
import { Img } from '@/components/img'
import { DiamondIcon } from '@/components/diamond-icon'
import { fmt } from '@/utils/fmt'
import { useChainInfo } from '@/hooks/use-chain-info'
import { RewardInfoRes } from '@/api/reward/types'

enum RewardType {
  Token = 1,
  Diamond,
}

// Must be function, because i18n.
const rewardSource: Record<keyof RewardInfoRes, () => string> = {
  buy: () => t('reward.buy'),
  sell: () => t('reward.sell'),
  create: () => t('reward.create'),
  graduated: () => t('reward.graduated'),
  join_community: () => t('reward.join-community'),
  trade: () => t('reward.trade'),
  answer_question: () => t('reward.answer-question'),
}

export const rewardColumns: ColumnDef<RewardItem>[] = [
  {
    accessorKey: 'earned',
    header: () => t('earned'),
    cell: ({ row }) => {
      const { earned, category } = row.original
      const { chain } = useChainInfo(row.original.chain)

      return (
        <div className="flex items-center space-x-1">
          <span>{fmt.decimals(earned)}</span>
          {category === RewardType.Diamond ? (
            <DiamondIcon size={20} />
          ) : (
            <Img src={chain?.logo} alt="logo" className="w-5" />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'time',
    header: () => t('time'),
    cell: ({ row }) => dayjs(row.original.time).format('YYYY-MM-DD HH:mm'),
  },
  {
    accessorKey: 'username',
    header: () => t('username'),
    cell: ({ row }) => (
      <span className={row.original.is_self ? 'text-blue-600' : ''}>
        {row.original.username}
      </span>
    ),
  },
  {
    accessorKey: 'flag',
    header: () => t('reward.source'),
    cell: ({ row }) =>
      rewardSource[row.original.flag]?.() || t('reward.unknown'),
  },
]
