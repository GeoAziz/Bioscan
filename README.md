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
- [Firebase](https://firebase.google.com/) (Authentication, Firestore, App Hosting)
- [Genkit](https://firebase.google.com/docs/genkit) for AI functionality

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- A Google Cloud project with the Vertex AI API enabled.
- A Firebase project.

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
   You will also need to authenticate with Google Cloud for Genkit to work. Run the following command and follow the instructions:
   ```bash
   gcloud auth application-default login
   ```

### Running the Development Server

To run the app locally:
```bash
npm run dev
```
Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

## Build and Deployment

This application is configured for deployment with **Firebase App Hosting**.

1. **Build the application for production:**
   ```bash
   npm run build
   ```
   This command will lint your code and check for TypeScript errors before creating an optimized production build.

2. **Deploy to Firebase:**
   Follow the [Firebase App Hosting deployment guide](https://firebase.google.com/docs/app-hosting/deploy-nextjs) to connect your GitHub repository and set up automatic deployments. The `apphosting.yaml` file is already configured for this.
