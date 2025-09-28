import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // This fires after Firebase confirms the auth state
    });

    // Cleanup the subscription on unmount
    return unsubscribe;
  }, []);

  // THE FIX: We must provide the `loading` state in the context's value
  // so that other components (like our router) can use it.
  const value = {
    currentUser,
    loading, // Added loading to the value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

// // src/context/AuthContext.jsx

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth } from "../firebase/config";
// import { onAuthStateChanged } from "firebase/auth";

// // Create the context
// const AuthContext = createContext();

// // Create the provider component
// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true); // To handle the initial auth state check

//   useEffect(() => {
//     // onAuthStateChanged is a listener that fires whenever the auth state changes.
//     // It returns an `unsubscribe` function that we can use to clean up.
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//       setLoading(false); // Auth state has been confirmed, we can now render the app
//     });

//     // Cleanup the subscription when the component unmounts
//     return unsubscribe;
//   }, []); // The empty dependency array ensures this runs only once

//   const value = {
//     currentUser,
//   };

//   // We don't render the app until the auth state has been determined
//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// // Create a custom hook for easy access
// export const useAuth = () => useContext(AuthContext);
