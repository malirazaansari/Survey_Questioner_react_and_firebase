import React from "react";
import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header";
import Home from "./components/home";

import { AuthProvider } from "./contexts/authContext";
// import { useRoutes } from "react-router-dom";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Write from "./components/home/Write/Write";
import Read from "./components/home/Read/Read";
function App() {
  // const routesArray = [
  //   {
  //     path: "*",
  //     element: <Login />,
  //   },
  //   {
  //     path: "/login",
  //     element: <Login />,
  //   },
  //   {
  //     path: "/register",
  //     element: <Register />,
  //   },
  //   {
  //     path: "/home",
  //     element: <Home />,
  //   },
  // ];
  // let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      {/* <div className="w-full h-screen flex flex-col">{routesElement}</div> */}
      <div className="App">
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Write />}></Route>
          <Route path="/Write" element={<Write />}></Route>
          <Route path="/Read" element={<Read />}></Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
