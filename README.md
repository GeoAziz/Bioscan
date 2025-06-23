# BioScan: AI-Powered Biometric Monitoring

BioScan is a Next.js application that provides a real-time, holographic dashboard for monitoring patient vitals. It leverages Genkit AI to deliver intelligent triage, health summaries, and recommendations.

## Features

- **Real-time Vitals Dashboard:** View key metrics like heart rate, temperature, and blood pressure at a glance.
- **Interactive Holographic View:** A futuristic, interactive model of the human body.
- **AI-Powered Analysis:**
  - **Emergency Triage:** Get instant recommendations and priority levels for critical situations.
  - **Timeline Summarization:** Generate AI summaries of health trends over time.
  - **Proactive Health Tips:** Receive AI-driven health recommendations based on the latest data.
- **User Authentication:** Secure login system powered by Firebase Authentication.
- **Persistent Data:** User and patient data is stored securely in Firebase Firestore.
- **Settings Management:** Users can manage their profile and notification preferences.

## Tech Stack

- [Next.js](https://nextjs.org/) (with App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- [Genkit](https://firebase.google.com/docs/genkit) for AI functionality
- [Vercel](https://vercel.com/) for Hosting

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- A Google Cloud project with the Vertex AI API enabled.
- A Firebase project.
- A free Vercel account.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd <repository-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the project and add your Firebase project configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
   You will also need a `google-application-credentials.json` file in the root of your project for the AI to work locally.

### Running the Development Server

To run the app locally:
```bash
npm run dev
```
Open your development URL in your browser to see the result.

## Build and Deployment to Vercel

This application is ready for deployment on **Vercel's** free "Hobby" plan.

### **Step 1: Push to GitHub**
Make sure your latest code is pushed to a GitHub repository.

### **Step 2: Deploy Firestore Rules (One-Time Setup)**
Your `firestore.rules` file contains the security rules for your database. You only need to deploy this once. Make sure you have the Firebase CLI installed (`npm install -g firebase-tools`) and are logged in (`firebase login`), then run:
```bash
firebase deploy --only firestore:rules
```

### **Step 3: Import Project to Vercel**

1.  Go to your Vercel dashboard.
2.  Click **"Add New..." > "Project"**.
3.  Find and **"Import"** your project's GitHub repository.

### **Step 4: Configure Environment Variables**
Vercel will auto-detect that this is a Next.js project. You just need to provide your secret keys.

1.  In the configuration screen, expand the **"Environment Variables"** section.
2.  Add the following variables, copying the values from your local `.env` file:
    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`
3.  Add one more crucial variable for the AI to work on the server:
    - **Name:** `GOOGLE_APPLICATION_CREDENTIALS`
    - **Value:** Open your `google-application-credentials.json` file, copy the *entire content*, and paste it into the "Value" field on Vercel.

### **Step 5: Deploy!**
Click the **"Deploy"** button. Vercel will build your project and provide you with a live URL. From now on, every time you `git push` to your main branch, Vercel will automatically deploy the update for you.
