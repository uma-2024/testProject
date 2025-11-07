import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { mainnet, sepolia } from 'wagmi/chains'

// Get projectId from https://cloud.reown.com
export const projectId = 'YOUR_PROJECT_ID' // Replace with your WalletConnect Project ID

// Create a metadata object - this is used for WalletConnect
const metadata = {
  name: 'TestProject',
  description: 'React Vite App with WalletConnect',
  url: 'https://localhost:5173', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: [mainnet, sepolia], // you can add more chains here
  projectId,
  metadata,
  enableWalletConnect: true, // Optional - defaults to true
  enableInjected: true, // Optional - defaults to true
  enableEIP6963: true, // Optional - defaults to true
  enableCoinbase: false, // Disable Coinbase
})

// Wallet IDs for MetaMask and Trust Wallet (featured wallets)
// Note: MetaMask will automatically show via injected providers (EIP6963)
// Trust Wallet will show via WalletConnect
// featuredWalletIds only prioritizes these wallets, it doesn't restrict the list
// All wallets will be available on mobile through "All Wallets" button
// You can find wallet IDs at: https://explorer.walletconnect.com/
const featuredWalletIds = [
  'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask (for WalletConnect)
  'c87ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // Trust Wallet
]

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional - defaults to false
  featuredWalletIds, // Feature MetaMask and Trust Wallet prominently (doesn't restrict other wallets)
  allWallets: 'SHOW', // Show "All Wallets" button everywhere to ensure all wallets are accessible on mobile
  enableAccountView: true,
  enableNetworkView: true,
})

