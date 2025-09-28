// src/pages/LoginPage.jsx

import { auth, googleProvider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        `}
      </style>
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center p-8 max-w-sm w-full">
          <h1 className="text-8xl font-['Special_Elite'] font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Writ...
          </h1>
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-8">
            Your elegant space for notes.
          </p>
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 px-4 py-3 bg-surface-light dark:bg-surface-dark border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <FcGoogle size={24} />
            <span className="text-text-primary-light dark:text-text-primary-dark font-medium">
              Sign in with Google
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
