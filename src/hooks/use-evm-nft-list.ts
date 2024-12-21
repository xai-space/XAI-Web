import { Asset, NFTListRes, NetworkNFTList } from "@/api/nft"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { useEffect, useState } from "react"
import { isAddress } from "viem"

export const useEvmNftList = () => {
    const [evmNftList, setNetworkNftList] = useState<NetworkNFTList[]>([])
    const { primaryWallet } = useDynamicContext()

    const [loading, setLoading] = useState(false)

    const getEVMNFTList = async () => {
        const address = primaryWallet?.address
        setLoading(true)
        const { data } = await (await fetch(`https://restapi.nftscan.com/api/v2/assets/chain/${address}?chain=eth;bnb;polygon;arbitrum;optimism;zksync;linea;avalanche;fantom`, {
            headers: {
                'X-API-KEY': 'zoDxKTSDDE2ELEm5SjWhpNsx'
            }
        })).json() as NFTListRes<NetworkNFTList>


        const collectionAssets = data.map((item) => {
            item.collection_assets = item.collection_assets.filter((assets) => {
                return assets.contract_name && assets.items_total >= 1000 && assets.floor_price
            })
            return item
        })

        setNetworkNftList(collectionAssets)
        setLoading(false)
    }

    useEffect(() => {
        if (primaryWallet?.address && isAddress(primaryWallet.address)) {
            getEVMNFTList()
        }
    }, [primaryWallet])

    return {
        evmNftList,
        loading,
    }
}