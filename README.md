# Memo

A React Native app built with Expo.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android emulator/device
- `npm run ios` - Start the app on iOS simulator/device
- `npm run web` - Start the app in web browser

### Development

- The main app code is in `App.js`
- Assets are stored in the `assets/` directory
- Configuration is in `app.json`

### Building for Production

To build your app for production:

```bash
expo build:android  # For Android
expo build:ios      # For iOS
```

## Project Structure

```
├── App.js          # Main app component
├── app.json        # Expo configuration
├── package.json    # Dependencies and scripts
├── assets/         # Images, fonts, and other assets
└── node_modules/   # Installed dependencies
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo CLI Commands](https://docs.expo.dev/workflow/expo-cli/)