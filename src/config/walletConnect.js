import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { mainnet, sepolia } from 'wagmi/chains'

// Get projectId from https://cloud.reown.com
export const projectId = '9aced30cb7c70da7e0a7b4129fbd0a8f'

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
  enableWalletConnect: true, // Enable WalletConnect for mobile wallets
  enableInjected: true, // Enable injected providers (MetaMask, etc.)
  enableEIP6963: true, // Enable EIP6963 for better wallet detection
  enableCoinbase: true, // Enable Coinbase for better mobile support
})

// Note: MetaMask will automatically show via injected providers (EIP6963)
// All wallets will be available on mobile and desktop
// No restrictions - all wallets from WalletConnect registry will be shown

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional - defaults to false
  // No featuredWalletIds or includeWalletIds - show all wallets
  allWallets: 'SHOW', // Show "All Wallets" button everywhere
  enableAccountView: true,
  enableNetworkView: true,
})

