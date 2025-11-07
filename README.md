# React + Vite + WalletConnect

This project is a React application built with Vite and integrated with WalletConnect for seamless wallet connections on both mobile and desktop.

## Features

- ✅ Works on Mobile & Desktop
- ✅ Multiple wallet options (MetaMask, WalletConnect, Coinbase, etc.)
- ✅ QR Code scanning for mobile
- ✅ Deep linking support
- ✅ Modern UI with responsive design

## Setup Instructions

### 1. Get Your WalletConnect Project ID

1. Go to [https://cloud.reown.com](https://cloud.reown.com)
2. Create a new project or use an existing one
3. Copy your Project ID

### 2. Configure Your Project ID

Open `src/config/walletConnect.js` and replace `YOUR_PROJECT_ID` with your actual WalletConnect Project ID:

```javascript
export const projectId = 'your-actual-project-id-here'
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## How It Works

- **Desktop**: Users can connect via browser extensions (MetaMask, etc.) or scan a QR code with their mobile wallet
- **Mobile**: Users can connect directly through their mobile wallet apps via deep linking or by scanning a QR code

## Project Structure

```
src/
├── config/
│   └── walletConnect.js    # WalletConnect configuration
├── App.jsx                  # Main app component with wallet UI
├── App.css                  # Styling
├── main.jsx                 # Entry point with providers
└── index.css                # Global styles
```

## Technologies Used

- React 19
- Vite 7
- Wagmi 2
- Viem 2
- @web3modal/wagmi 5
- @tanstack/react-query 5

## License

MIT
