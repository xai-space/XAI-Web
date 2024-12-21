export interface CoinCreateReq {
    chain: string
    name: string
    symbol: string
    description: string
    image: string
    posters: string[]
    twitter: string
    telegram: string
    website: string
    coin_type: number
}
export interface CoinCreateRes {
    id: string
    chain: string
    name: string
    symbol: string
    description: string
    image: string
    posters: string[]
    twitter: string
    telegram: string
    website: string
    whitepaper: string
    creator_user: string
    bonding_curve: string
    factory: string
    airdrop: string
    max_supply: string
    total_supply: string
    version: {
        token: string
        bonding_curve: string
        airdrop: string
    }
}