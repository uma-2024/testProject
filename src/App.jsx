import { useAccount, useDisconnect, useBalance, useWalletClient, usePublicClient, useChainId } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import BuyTokens from './components/BuyTokens.jsx'
import './App.css'

function App() {
  const { open } = useWeb3Modal()
  const { address, isConnected, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const chainId = useChainId()

  return (
    <>
      <div className="container">
        <h1>WalletConnect Demo</h1>
        <p className="subtitle">Connect your wallet on mobile or desktop</p>
        
        {!isConnected ? (
          <div className="card">
            <button onClick={() => open()} className="connect-button">
              Connect Wallet
            </button>
            <p className="info">
              Click to connect your wallet. Works on both mobile and desktop!
            </p>
          </div>
        ) : (
          <div className="card connected">
            <div className="wallet-info">
              <h2>Wallet Connected</h2>
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">{address}</span>
              </div>
              {balance && (
                <div className="info-row">
                  <span className="label">Balance:</span>
                  <span className="value">
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </span>
                </div>
              )}
              {chainId && (
                <div className="info-row">
                  <span className="label">Chain ID:</span>
                  <span className="value">{chainId}</span>
                </div>
              )}
              {connector && (
                <div className="info-row">
                  <span className="label">Connector:</span>
                  <span className="value">{connector.name}</span>
                </div>
              )}
              
              <div className="section-divider">
                <h3>Signer (Wallet Client)</h3>
                {walletClient ? (
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span className="value success">✓ Available</span>
                  </div>
                ) : (
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span className="value error">✗ Not Available</span>
                  </div>
                )}
                {walletClient && (
                  <>
                    <div className="info-row">
                      <span className="label">Account:</span>
                      <span className="value">{walletClient.account?.address || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Chain ID:</span>
                      <span className="value">{walletClient.chain?.id || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Chain Name:</span>
                      <span className="value">{walletClient.chain?.name || 'N/A'}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="section-divider">
                <h3>Provider (Public Client)</h3>
                {publicClient ? (
                  <>
                    <div className="info-row">
                      <span className="label">Status:</span>
                      <span className="value success">✓ Available</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Chain ID:</span>
                      <span className="value">{publicClient.chain?.id || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Chain Name:</span>
                      <span className="value">{publicClient.chain?.name || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">RPC URLs:</span>
                      <span className="value">
                        {publicClient.chain?.rpcUrls?.default?.http?.join(', ') || 'N/A'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span className="value error">✗ Not Available</span>
                  </div>
                )}
              </div>

              <button onClick={() => disconnect()} className="disconnect-button">
                Disconnect
              </button>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="card buy-card">
            <BuyTokens />
          </div>
        )}

        <div className="features">
          <h3>Features</h3>
          <ul>
            <li>✅ Works on Mobile & Desktop</li>
            <li>✅ Multiple wallet options</li>
            <li>✅ QR Code scanning for mobile</li>
            <li>✅ Deep linking support</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
