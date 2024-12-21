import { Network } from "@/enums/contract"

export interface ChainData {
  id: string
  logo_url: string
  is_testnet: boolean
  rpc_url: string
  network_type: Network
  evm_id: string
  master_address: string
  master_symbol: string
  master_decimals: number
  is_active: boolean
  scanner: {
    address: string | null
    transaction: string | null
    block: string | null
  }
}
