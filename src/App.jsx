import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { currentUser, loading } = useAuth();

  // THE FIX: We wait for the loading state from the AuthContext to be false
  // before we render any routes. This prevents the redirect-to-login race condition.
  if (loading) {
    // You can replace this with a nice loading spinner component
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex justify-center items-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* If logged in, redirect from /login to dashboard */}
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        {/* Add a catch-all or 404 route if desired */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

// // src/App.jsx

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import LoginPage from "./pages/LoginPage";
// import DashboardPage from "./pages/DashboardPage";
// import SharedBoardPage from "./pages/SharedBoardPage";

// // This component protects routes that require authentication
// const PrivateRoute = ({ children }) => {
//   const { currentUser } = useAuth();
//   // If a user is logged in, show the page. Otherwise, redirect to the login page.
//   return currentUser ? children : <Navigate to="/login" />;
// };

// function AppRoutes() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/share/:shareCode" element={<SharedBoardPage />} />
//         <Route
//           path="/"
//           element={
//             <PrivateRoute>
//               <DashboardPage />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// // We wrap our AppRoutes in the AuthProvider so the `useAuth` hook works
// function App() {
//   return (
//     <AuthProvider>
//       <AppRoutes />
//     </AuthProvider>
//   );
// }

// export default App;

// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <div>
// //         <a href="https://vite.dev" target="_blank">
// //           <img src={viteLogo} className="logo" alt="Vite logo" />
// //         </a>
// //         <a href="https://react.dev" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>
// //       <h1>Vite + React</h1>
// //       <div className="card">
// //         <button onClick={() => setCount((count) => count + 1)}>
// //           count is {count}
// //         </button>
// //         <p>
// //           Edit <code>src/App.jsx</code> and save to test HMR
// //         </p>
// //       </div>
// //       <p className="read-the-docs">
// //         Click on the Vite and React logos to learn more
// //       </p>
// //     </>
// //   )
// // }

// // export default App
