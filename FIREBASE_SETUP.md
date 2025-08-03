# Firebase Setup Guide

This guide will help you set up Firebase to replace MongoDB in your WalletWave application.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "walletwave")
4. Follow the setup wizard
5. Note your **Project ID** - you'll need this for the environment variables

## 2. Enable Firestore Database

1. In your Firebase project console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (you can secure it later)
4. Select a location for your database
5. Click "Done"

## 3. Generate Service Account Key

1. In Firebase console, go to Project Settings (gear icon)
2. Click on "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. **Important**: Keep this file secure and never commit it to version control

## 4. Set Up Environment Variables

1. Copy the `env.example` file to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your Firebase configuration:

   ```env
   # Replace with your actual Firebase project ID
   FIREBASE_PROJECT_ID=your-actual-project-id
   
   # Replace with your service account key JSON (as a single line)
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
   ```

3. For the `FIREBASE_SERVICE_ACCOUNT_KEY`, you need to:
   - Open the downloaded JSON file
   - Copy the entire JSON content
   - Paste it as a single line in the `.env` file
   - Make sure to escape any quotes properly

## 5. Install Dependencies

```bash
npm install firebase-admin
npm uninstall mongoose
```

## 6. Test the Connection

Run your application:

```bash
npm run dev
```

You should see "✅ Firebase connected" in the console if everything is set up correctly.

## 7. Firebase Collections Structure

Your Firestore database will have these collections:

- **masterWallets**: Stores master wallet information
- **dedicatedAddresses**: Stores dedicated address information
- **transactions**: Stores transaction records

## 8. Security Rules (Optional)

For production, set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Add your security rules here
    match /{document=**} {
      allow read, write: if false; // Restrict access
    }
  }
}
```

## 9. Local Development with Firebase Emulator (Optional)

For local development, you can use Firebase emulators:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase in your project:
   ```bash
   firebase init emulators
   ```

3. Start the emulators:
   ```bash
   firebase emulators:start
   ```

4. Add to your `.env`:
   ```env
   FIREBASE_EMULATOR_HOST=localhost
   FIRESTORE_EMULATOR_HOST=localhost:8080
   ```

## 10. Migration from MongoDB

If you have existing MongoDB data, you'll need to:

1. Export your MongoDB data
2. Transform the data to match the new Firebase structure
3. Import the data into Firestore

## Troubleshooting

- **"Firebase not initialized"**: Make sure your service account key is properly formatted
- **"Project not found"**: Verify your `FIREBASE_PROJECT_ID` is correct
- **Permission denied**: Check your service account has the necessary permissions

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | Yes |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Service account JSON key | Yes |
| `REDIS_URL` | Redis connection URL | No (if using Redis) |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port | No | 