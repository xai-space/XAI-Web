import { userApi } from '@/api/user'
import { FollowItem, UserCategory } from '@/api/user/types'
import { useUserStore } from '@/stores/use-user-store'
import { useInfiniteScroll } from 'ahooks'
import { useRef, useState } from 'react'

interface Result {
    list: FollowItem[]
    noMore: boolean
}

export const useUserFollowingList = (isAgent: boolean) => {
    const ref = useRef<HTMLDivElement>(null)
    const { otherUserInfo, agentInfo } = useUserStore()
    const [agentFollows, setAgentFollows] = useState<FollowItem[]>()
    const [userFollows, setUserFollows] = useState<FollowItem[]>()
    const [category, setCategory] = useState(UserCategory.User)
    const [followType, setFollowType] = useState(UserCategory.User)

    const getFollows = async (): Promise<Result> => {

        if (!otherUserInfo?.user_id) {
            return {
                list: [],
                noMore: false
            }
        }

        const follows = category === UserCategory.User ? userFollows : agentFollows

        const page = Math.floor((follows?.length || 0) / 20) + 1
        const { data } = await userApi.getFollows({
            user_id: isAgent ? agentInfo?.agent_id : otherUserInfo?.user_id,
            limit: 20,
            page,
            category,
        })

        if (category === UserCategory.User) {
            setUserFollows(data)
        } else {
            setAgentFollows(data)
        }

        return {
            list: data,
            noMore: data.length < 20,
        }
    }

    const { loading, loadingMore, } = useInfiniteScroll(getFollows, {
        target: ref.current,
        isNoMore: (data) => !!data?.noMore,
    })

    const clearFollows = () => {
        setAgentFollows([])
        setUserFollows([])
    }

    return {
        ref,
        agentFollows,
        userFollows,
        setCategory,
        loading, loadingMore, clearFollows,
        followType,
        setFollowType,
        setUserFollows,
        setAgentFollows
    }
}