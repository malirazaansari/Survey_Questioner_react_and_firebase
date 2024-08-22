import React from "react";
import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header";
import Home from "./components/home";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes, useLocation } from "react-router-dom";

import Write from "./components/home/Write/Write";
import Read from "./components/home/Read/Read";
import StudentSurvay from "./components/home/StudentSurvay/StudentSurvay";
import Student from "./components/home/Student/Student";

const routesArray = [
  {
    path: "*",
    element: <Login />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/Write",
    element: <Write />,
  },
  {
    path: "/Read",
    element: <Read />,
  },
  {
    path: "/Student",
    element: <Student />,
  },
  {
    path: "/StudentSurvay",
    element: <StudentSurvay />,
  },
];

function App() {
  const routesElement = useRoutes(routesArray);
  const location = useLocation();
  const hideHeaderRoutes = ["/StudentSurvay"];

  return (
    <AuthProvider>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <div className="App">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
