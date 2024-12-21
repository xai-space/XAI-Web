import { userApi } from '@/api/user'
import { FollowItem, UserCategory } from '@/api/user/types'
import { useUserStore } from '@/stores/use-user-store'
import { useMutation } from '@tanstack/react-query'
import { useInfiniteScroll } from 'ahooks'
import { useEffect, useRef, useState } from 'react'

interface Result {
    list: FollowItem[]
    noMore: boolean
}

export const useUserFollowerList = (isAgent: boolean) => {
    const ref = useRef<HTMLDivElement>(null)
    const { userInfo, otherUserInfo, agentInfo } = useUserStore()
    const [agentFollowers, setAgentFollowers] = useState<FollowItem[]>()
    const [userFollowers, setUserFollowers] = useState<FollowItem[]>()
    const [category, setCategory] = useState(UserCategory.User)
    const [followType, setFollowType] = useState(UserCategory.User)

    const getFollowers = async (): Promise<Result> => {

        if (!otherUserInfo?.user_id) {
            return {
                list: [],
                noMore: false
            }
        }

        const follows = category === UserCategory.User ? userFollowers : agentFollowers

        const page = Math.floor((follows?.length || 0) / 20) + 1
        const { data } = await userApi.getFollowers({
            user_id: isAgent ? agentInfo?.agent_id : otherUserInfo?.user_id,
            category: category,
            page: page,
            limit: 20,
        })

        if (category === UserCategory.User) {
            setUserFollowers(data)
        } else {
            setAgentFollowers(data)
        }

        return {
            list: data,
            noMore: data.length < 20,
        }
    }

    const { loading, loadingMore, } = useInfiniteScroll(getFollowers, {
        target: ref.current,
        isNoMore: (data) => !!data?.noMore,
    })

    const clearFollows = () => {
        setAgentFollowers([])
        setUserFollowers([])
    }


    return {
        ref,
        agentFollowers,
        userFollowers,
        setCategory,
        loading, loadingMore, clearFollows,
        followType,
        setFollowType,
        setAgentFollowers,
        setUserFollowers,
    }
}