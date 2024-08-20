import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const { currentUser } = useAuth();

  return (
    <nav className="flex flex-wrap items-center justify-between w-full p-4 bg-gray-800 text-white shadow-lg fixed top-0 z-20">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-blue-400">
          {userLoggedIn && (
            <>
              Hi{" "}
              {currentUser.displayName
                ? currentUser.displayName
                : currentUser.email}
              .
            </>
          )}
        </span>
        {userLoggedIn && (
          <span className="ml-4 text-lg font-bold text-yellow-500">
            <Link to={"/home"}>Admin page</Link>
          </span>
        )}
      </div>
      {userLoggedIn && (
        <button
          onClick={() => {
            doSignOut().then(() => {
              navigate("/login");
            });
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition duration-300"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Header;
