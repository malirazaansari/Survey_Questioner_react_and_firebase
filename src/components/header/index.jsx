// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/authContext";
// import { doSignOut } from "../../firebase/auth";

// const Header = () => {
//   const navigate = useNavigate();
//   const { userLoggedIn } = useAuth();
//   const { currentUser } = useAuth();
//   return (
//     <nav className="flex flex-row gap-x-12  w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center  bg-gray-200">
//       {userLoggedIn ? (
//         <>
//           <div className=" text-2xl font-bold  text-blue-600">
//             Hi{" "}
//             {currentUser.displayName
//               ? currentUser.displayName
//               : currentUser.email}
//             , you are now logged in.
//           </div>
//           <div className="text-red-500 place-content-start text-xl font-bold text-left">
//             Admin Page
//           </div>
//           <button
//             onClick={() => {
//               doSignOut().then(() => {
//                 navigate("/login");
//               });
//             }}
//             className="text-sm text-blue-600 underline mx-2 text-right"
//           >
//             Logout
//           </button>
//         </>
//       ) : (
//         <>
//           {/* <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
//                         <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link> */}
//         </>
//       )}
//     </nav>
//   );
// };

// export default Header;

import React from "react";
import { useNavigate } from "react-router-dom";
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
              , you are logged in.
            </>
          )}
        </span>
        {userLoggedIn && (
          <span className="ml-4 text-lg font-bold text-yellow-500">
            Admin Page
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
