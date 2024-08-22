import React from "react";
import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header";
import Home from "./components/home";

import { AuthProvider } from "./contexts/authContext";
// import { useRoutes } from "react-router-dom";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Write from "./components/home/Write/Write";
import Read from "./components/home/Read/Read";
import StudentSurvay from "./components/home/StudentSurvay/StudentSurvay";
import Student from "./components/home/Student/Student";
function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/StudentSurvay"];

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
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <div className="App">
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/" element={<Login />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Write" element={<Write />}></Route>
          <Route path="/Read" element={<Read />}></Route>
          <Route path="/Student" element={<Student />}></Route>
          <Route path="/StudentSurvay" element={<StudentSurvay />}></Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
