import { User } from "lucide-react";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SingUp/SignUp";
import PostDetails from "./pages/PostDetails/PostDetails";
import Profile from "./pages/Profile/profile";
import NotFound from "./pages/NotFound/NotFound";
import RootLayout from "./components/Layout/Layout";
import { Toaster } from "sonner";
import UserProvider from "./context/User.context";
import ProtectedRoute from "./components/protectedRoute/protectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: `/`,

      element: <RootLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },

        {
          path: `/post/:id`,
          element: (
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: `/profile`,
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: `*`,
          element: <NotFound />,
        },
      ],
    },

    {
      path: `/SignUp`,
      element: <SignUp />,
    },
    {
      path: `/login`,
      element: <Login />,
    },
  ]);
  return (
    <>
      <UserProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </UserProvider>
    </>
  );
}

export default App;
