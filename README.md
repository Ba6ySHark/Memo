# Memo

A React Native app built with Expo featuring beautiful login and signup screens with glass-like UI elements.

## Features

- **Beautiful Glass-like UI** - Modern design with blur effects and gradients
- **Dark Theme** - Elegant black background with purple/blue accent colors
- **Login Screen** - Email and password authentication with validation
- **Signup Screen** - Full registration form with password confirmation
- **Responsive Design** - Works perfectly on all screen sizes
- **Form Validation** - Real-time input validation and error handling
- **Loading States** - Smooth loading animations during authentication

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
- Login screen is in `screens/LoginScreen.js`
- Signup screen is in `screens/SignupScreen.js`
- Assets are stored in the `assets/` directory
- Configuration is in `app.json`

### UI Features

- **Glass-like Input Fields** - Blur effects with transparent backgrounds
- **Gradient Buttons** - Beautiful purple to blue gradient buttons
- **Decorative Elements** - Subtle background circles for visual appeal
- **Smooth Animations** - Loading states and transitions
- **Keyboard Handling** - Proper keyboard avoidance for better UX

### Building for Production

To build your app for production:

```bash
expo build:android  # For Android
expo build:ios      # For iOS
```

## Project Structure

```
├── App.js                    # Main app component with navigation
├── screens/
│   ├── LoginScreen.js        # Login screen with glass-like UI
│   └── SignupScreen.js       # Signup screen with form validation
├── app.json                  # Expo configuration
├── package.json              # Dependencies and scripts
├── assets/                   # Images, fonts, and other assets
└── node_modules/             # Installed dependencies
```

## Dependencies

- **React Navigation** - For screen navigation
- **Expo Linear Gradient** - For gradient backgrounds and buttons
- **Expo Blur** - For glass-like blur effects
- **React Native Screens** - For better screen performance
- **React Native Safe Area Context** - For safe area handling

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Expo CLI Commands](https://docs.expo.dev/workflow/expo-cli/)