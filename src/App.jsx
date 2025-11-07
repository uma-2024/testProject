import { useEffect, useRef, useState } from 'react'
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
  const connectionAttemptRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setIsMobile(mobile)
    
    // Check if we're returning from a wallet connection attempt
    const wasConnecting = sessionStorage.getItem('walletConnecting') === 'true'
    if (wasConnecting && mobile) {
      // Clear the flag
      sessionStorage.removeItem('walletConnecting')
      
      // Poll for connection status when page becomes visible
      const checkConnection = () => {
        if (!document.hidden && isConnected) {
          // Connection successful, user is back
          window.focus()
        }
      }
      
      // Check immediately
      checkConnection()
      
      // Also check when page becomes visible
      document.addEventListener('visibilitychange', checkConnection)
      
      return () => {
        document.removeEventListener('visibilitychange', checkConnection)
      }
    }
  }, [isConnected])

  // Listen to Web3Modal events for connection
  useWeb3ModalEvents({
    events: {
      CONNECT: () => {
        if (isMobile) {
          // Store that we're attempting connection
          sessionStorage.setItem('walletConnecting', 'true')
          
          // Try to redirect back after a delay
          setTimeout(() => {
            // Try multiple methods to bring app back to foreground
            window.focus()
            
            // For iOS, try to open the app URL
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              // Create a hidden link and click it to try to bring browser back
              const link = document.createElement('a')
              link.href = window.location.href
              link.style.display = 'none'
              document.body.appendChild(link)
              
              setTimeout(() => {
                link.click()
                document.body.removeChild(link)
              }, 1000)
            }
          }, 2000)
        }
      },
    },
  })

  // Handle mobile redirect after successful connection
  useEffect(() => {
    // Check if we just connected (wasn't connected before, but now is)
    if (isConnected && !wasConnectedRef.current && address) {
      wasConnectedRef.current = true
      connectionAttemptRef.current = false
      
      // Clear connection attempt flag
      sessionStorage.removeItem('walletConnecting')
      
      if (isMobile) {
        // Multiple attempts to bring app back to foreground
        const redirectAttempts = [
          () => window.focus(),
          () => {
            // Try to reload if still hidden
            if (document.hidden) {
              setTimeout(() => {
                window.location.reload()
              }, 500)
            }
          },
          () => {
            // For iOS, try to open the app URL again
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              const currentUrl = window.location.href
              window.location.href = currentUrl
            }
          }
        ]
        
        // Execute redirect attempts with delays
        redirectAttempts.forEach((attempt, index) => {
          setTimeout(attempt, 1000 * (index + 1))
        })
      }
    }
    
    // Reset when disconnected
    if (!isConnected) {
      wasConnectedRef.current = false
    }
  }, [isConnected, address, isMobile])

  // Listen for page visibility changes (when user returns from wallet app)
  useEffect(() => {
    if (!isMobile) return

    const handleVisibilityChange = () => {
      // When page becomes visible and we're connected, ensure we're focused
      if (!document.hidden && isConnected && address) {
        window.focus()
        
        // Scroll to top to ensure user sees the connected state
        window.scrollTo(0, 0)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Also listen for focus events
    window.addEventListener('focus', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleVisibilityChange)
    }
  }, [isMobile, isConnected, address])

  // Store connection attempt when opening modal
  const handleOpenModal = () => {
    if (isMobile) {
      sessionStorage.setItem('walletConnecting', 'true')
    }
    open()
  }

  return (
    <>
      <div className="container">
        <h1>WalletConnect Demo</h1>
        <p className="subtitle">Connect your wallet on mobile or desktop</p>
        
        {!isConnected ? (
          <div className="card">
            <button onClick={handleOpenModal} className="connect-button">
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
