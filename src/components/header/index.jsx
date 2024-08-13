import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const { currentUser } = useAuth();
  return (
    <nav className="flex flex-row gap-x-12  w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center  bg-gray-200">
      {userLoggedIn ? (
        <>
          <div className=" text-2xl font-bold  text-blue-600">
            Hi{" "}
            {currentUser.displayName
              ? currentUser.displayName
              : currentUser.email}
            , you are now logged in.
          </div>
          <div className="text-red-500 place-content-start text-xl font-bold text-left">
            Admin Page
          </div>
          <button
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
              });
            }}
            className="text-sm text-blue-600 underline mx-2 text-right"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          {/* <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                        <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link> */}
        </>
      )}
    </nav>
  );
};

export default Header;
