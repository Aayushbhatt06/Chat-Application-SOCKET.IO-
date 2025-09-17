import React from "react";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Home from "./Components/Home";
import ProtectedRoute from "./Auth/ProtectedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
