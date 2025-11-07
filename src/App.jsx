import { useEffect, useRef } from 'react'
import { useAccount, useDisconnect, useBalance, useWalletClient, usePublicClient, useChainId } from 'wagmi'
import { useWeb3Modal, useWeb3ModalEvents } from '@web3modal/wagmi/react'
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
  const wasConnectedRef = useRef(false)
  
  // Listen to Web3Modal events for connection
  useWeb3ModalEvents({
    events: {
      CONNECT: () => {
        // Handle mobile redirect after successful connection
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        
        if (isMobile) {
          // Delay to ensure connection is fully established
          setTimeout(() => {
            // Try to bring the app back to foreground
            window.focus()
            
            // For iOS, try to redirect back to the app
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              // Use a small delay and then try to redirect
              setTimeout(() => {
                // This helps bring the browser back to foreground
                if (document.hidden) {
                  window.location.reload()
                }
              }, 500)
            }
          }, 1500)
        }
      },
    },
  })

  // Handle mobile redirect after successful connection
  useEffect(() => {
    // Check if we just connected (wasn't connected before, but now is)
    if (isConnected && !wasConnectedRef.current && address) {
      wasConnectedRef.current = true
      
      // Check if we're on mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      
      if (isMobile) {
        // Small delay to ensure connection is fully established
        setTimeout(() => {
          // Try to bring the app back to foreground
          window.focus()
          
          // For iOS Safari, try to redirect back to the app
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // Check if page is hidden (user is in wallet app)
            if (document.hidden) {
              // Try to redirect back
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            }
          }
        }, 2000)
      }
    }
    
    // Reset when disconnected
    if (!isConnected) {
      wasConnectedRef.current = false
    }
  }, [isConnected, address])

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
