# Task Tracker Mobile

Expo React Native client for the Task Tracker API.

## Setup

```bash
cd mobile
npm install
cp .env.example .env
npm start
```

## Environment

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

Use the correct backend URL for your device:

- iOS simulator: `http://localhost:5000`
- Android emulator: `http://10.0.2.2:5000`
- Physical phone: `http://<your-computer-lan-ip>:5000`

## Scripts

- `npm start` - start Expo
- `npm run android` - start Expo for Android
- `npm run ios` - start Expo for iOS
- `npm run web` - start Expo for web

## App Flow

- Login and signup screens store the JWT in `expo-secure-store`
- The auth provider restores the token on app launch
- The Axios client attaches `Authorization: Bearer <token>`
- The tasks screen uses TanStack Query for fetching, refresh, and mutations
- Logout clears the secure token and query cache
- Web testing stores the token in localStorage because SecureStore is native-only

## Features

- Signup and login
- Persisted session
- Create, edit, complete/uncomplete, and delete tasks
- Attach one image or file to a task
- Filter tasks by all, pending, and completed
- Pull-to-refresh, loading, error, and empty states

## Demo Video

Demo video placeholder: add a walkthrough link here.
