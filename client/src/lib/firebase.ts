import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "dequan-m.firebaseapp.com",
  projectId: "dequan-m",
  storageBucket: "dequan-m.firebasestorage.app",
  messagingSenderId: "562809278262",
  appId: "1:562809278262:web:7f763a60969761ba3d2d97",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export default app;
