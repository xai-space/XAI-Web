import { useEffect, useState } from "react"

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { Asset, NFTInfo, NFTListRes, NetworkNFTList } from "@/api/nft";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { PublicKey } from "@metaplex-foundation/js";


export const useSolNFTList = (nftListRef: React.RefObject<HTMLDivElement>) => {
    const [solList, setSolList] = useState<NetworkNFTList[]
    >([])
    let limit = 20
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const { primaryWallet } = useDynamicContext()

    const umi = createUmi(
        'https://maximum-crimson-spring.solana-mainnet.quiknode.pro/a6dab9a89e264894d6e1b914715a09b4befce3f6'
    ).use(dasApi())


    const getSolanaNFTAsset = async () => {
        // const owner = publicKey('2Whhi93Ckub7Sc9DViCLTpKS4bdDy9zv3ctxEJAa7J6D')
        // console.log('owner');

        // // if (list.length % limit != 0) {
        // //     return {
        // //         list,
        // //         noMore: list.length !== limit
        // //     }
        // // }

        // const page = Math.floor(list.length / limit) + 1

        // // @ts-ignore
        // // const { items } = await umi.rpc.getAssetsByOwner({
        // //     owner,
        // //     limit,
        // //     page
        // // }) as DasApiAssetList

        // const { data } = await (await fetch(`https://restapi.nftscan.com/api/v2/assets/chain/${address}?chain=eth;bnb;polygon;arbitrum;optimism;zksync;linea;avalanche;fantom`, {
        //     headers: {
        //         'X-API-KEY': 'zoDxKTSDDE2ELEm5SjWhpNsx'
        //     }
        // })).json() as NFTListRes<NFTInfo>


        // const list = {
        //     chain: 'sol',
        //     exceed_max_items: false,
        //     collection_assets: data
        // } as NetworkNFTList

        // setList(list)
        // return {
        //     list,
        //     noMore: items.length !== limit
        // }
    }

    // const { data, loading, loadingMore, mutate } = useInfiniteScroll(getSolanaNFTAsset, {
    //     target: nftListRef.current,
    //     isNoMore: (d) => d?.noMore == true
    // })

    const getNFTList = async () => {
        setLoading(true)
        const address = primaryWallet?.address

        // getSolanaNFTAsset()
        const { data } = await (await fetch(`https://solanaapi.nftscan.com/api/sol/account/own/all/${address}?show_attribute=false`, {
            headers: {
                'X-API-KEY': 'zoDxKTSDDE2ELEm5SjWhpNsx'
            }
        })).json() as NFTListRes<NFTInfo>

        console.log('Solana NFT DATA', data);

        const checkAssets = (item: Asset) => {
            return item.mint_price
        }

        const collectionAssets = data.filter((item) => {
            return !!item.logo_url && item.items_total >= 1000 && item.collection && item.description && item.logo_url
        })

        if (collectionAssets.length) {
            setSolList([{
                chain: 'sol',
                exceed_max_items: false,
                collection_assets: collectionAssets
            }])
        }
        setLoading(false)
    }

    useEffect(() => {
        try {
            if (primaryWallet?.address && PublicKey.isOnCurve(primaryWallet.address)) {
                getNFTList()
            }
        } catch (error) {
            console.log('error', error);
        }
    }, [primaryWallet])

    return {
        solList,
        getNFTList,
        setSolList,
        // data,
        loading,
        loadingMore,
    }
}