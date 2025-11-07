import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, parseUnits } from 'viem'
import { PRESALE_ABI, PRESALE_CONTRACT_ADDRESS } from '../config/contract.js'

function BuyTokens() {
  const [ethAmount, setEthAmount] = useState('')
  const [usdcAmount, setUsdcAmount] = useState('')
  const [usdtAmount, setUsdtAmount] = useState('')
  const [referrer, setReferrer] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('eth') // 'eth', 'usdc', 'usdt'

  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Read current phase
  const { data: currentPhase } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: PRESALE_ABI,
    functionName: 'currentPhase',
  })

  const handleBuyWithETH = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      alert('Please enter a valid ETH amount')
      return
    }

    try {
      await writeContract({
        address: PRESALE_CONTRACT_ADDRESS,
        abi: PRESALE_ABI,
        functionName: 'buyWithETH',
        args: [referrer || '0x0000000000000000000000000000000000000000'],
        value: parseEther(ethAmount),
      })
    } catch (err) {
      console.error('Error buying with ETH:', err)
    }
  }

  const handleBuyWithUSDC = async () => {
    if (!usdcAmount || parseFloat(usdcAmount) <= 0) {
      alert('Please enter a valid USDC amount')
      return
    }

    try {
      // USDC has 6 decimals
      const amount = parseUnits(usdcAmount, 6)
      await writeContract({
        address: PRESALE_CONTRACT_ADDRESS,
        abi: PRESALE_ABI,
        functionName: 'buyWithUSDC',
        args: [amount, referrer || '0x0000000000000000000000000000000000000000'],
      })
    } catch (err) {
      console.error('Error buying with USDC:', err)
    }
  }

  const handleBuyWithUSDT = async () => {
    if (!usdtAmount || parseFloat(usdtAmount) <= 0) {
      alert('Please enter a valid USDT amount')
      return
    }

    try {
      // USDT has 6 decimals
      const amount = parseUnits(usdtAmount, 6)
      await writeContract({
        address: PRESALE_CONTRACT_ADDRESS,
        abi: PRESALE_ABI,
        functionName: 'buyWithUSDT',
        args: [amount, referrer || '0x0000000000000000000000000000000000000000'],
      })
    } catch (err) {
      console.error('Error buying with USDT:', err)
    }
  }

  const handleBuy = () => {
    if (paymentMethod === 'eth') {
      handleBuyWithETH()
    } else if (paymentMethod === 'usdc') {
      handleBuyWithUSDC()
    } else if (paymentMethod === 'usdt') {
      handleBuyWithUSDT()
    }
  }

  return (
    <div className="buy-section">
      <h3>Buy Tokens</h3>
      
      {currentPhase !== undefined && (
        <div className="info-row">
          <span className="label">Current Phase:</span>
          <span className="value">{currentPhase?.toString() || 'N/A'}</span>
        </div>
      )}

      <div className="payment-method-selector">
        <label>Payment Method:</label>
        <div className="payment-buttons">
          <button
            className={paymentMethod === 'eth' ? 'payment-btn active' : 'payment-btn'}
            onClick={() => setPaymentMethod('eth')}
          >
            ETH
          </button>
          <button
            className={paymentMethod === 'usdc' ? 'payment-btn active' : 'payment-btn'}
            onClick={() => setPaymentMethod('usdc')}
          >
            USDC
          </button>
          <button
            className={paymentMethod === 'usdt' ? 'payment-btn active' : 'payment-btn'}
            onClick={() => setPaymentMethod('usdt')}
          >
            USDT
          </button>
        </div>
      </div>

      <div className="input-group">
        <label>
          Amount ({paymentMethod.toUpperCase()}):
        </label>
        <input
          type="number"
          step="0.000001"
          placeholder={`Enter ${paymentMethod.toUpperCase()} amount`}
          value={
            paymentMethod === 'eth' ? ethAmount :
            paymentMethod === 'usdc' ? usdcAmount :
            usdtAmount
          }
          onChange={(e) => {
            if (paymentMethod === 'eth') setEthAmount(e.target.value)
            else if (paymentMethod === 'usdc') setUsdcAmount(e.target.value)
            else setUsdtAmount(e.target.value)
          }}
          className="amount-input"
        />
      </div>

      <div className="input-group">
        <label>
          Referrer Address (Optional):
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={referrer}
          onChange={(e) => setReferrer(e.target.value)}
          className="referrer-input"
        />
      </div>

      <button
        onClick={handleBuy}
        disabled={isPending || isConfirming}
        className="buy-button"
      >
        {isPending
          ? 'Confirming...'
          : isConfirming
          ? 'Processing...'
          : `Buy with ${paymentMethod.toUpperCase()}`}
      </button>

      {error && (
        <div className="error-message">
          Error: {error.message}
        </div>
      )}

      {isConfirmed && (
        <div className="success-message">
          ✓ Transaction confirmed! Hash: {hash?.slice(0, 10)}...
        </div>
      )}

      {hash && (
        <div className="transaction-hash">
          Transaction Hash: {hash}
        </div>
      )}
    </div>
  )
}

export default BuyTokens

