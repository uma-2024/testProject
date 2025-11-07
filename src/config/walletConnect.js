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
  enableCoinbase: true, // Optional - defaults to true
})

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - defaults to false
})

