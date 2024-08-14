import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="gap-x-6 gap-y-0 flex flex-wrap grid-rows-2 -mx-3 -mt-0 mx-auto w-full">
        <div className="bg-[#434bdf] p-0 w-full ">
          <div className="flex justify-center items-center h-screen min-h-screen p-6 w-full text-center text-white relative bg-gradient-to-b from-transparent to-gray-900">
            <div className="flex flex-col block isolate justify-center items-center">
              <figure className="mb-4">
                <img
                  src="https://www.ansonika.com/wilio/img/info_graphic_1.svg"
                  alt=""
                />
              </figure>
              <h2 className="text-white text-2xl mb-4 font-normal">
                Survey Page
              </h2>
              <p className="text-sm opacity-80 mb-6">
                Tation argumentum et usu, dicit viderer evertitur te has. Eu
                dictas concludaturque usu, facete detracto patrioque an per,
                lucilius pertinacia eu vel. Adhuc invidunt duo ex. Eu tantas
                dolorum ullamcorper qui.
              </p>
              <div className="flex gap-3">
                <button className="inline-block cursor-pointer mx-2 mb-0 px-5 py-3 border-0 font-bold text-lg text-white bg-gradient-to-b from-blue-400 to-blue-600 shadow-md">
                  <Link to={"/Write"}>Add Questions</Link>
                </button>
                <button className="inline-block cursor-pointer mx-2 mb-0 px-5 py-3 border-0 font-bold text-lg text-white bg-gradient-to-b from-blue-400 to-blue-600 shadow-md">
                  <Link to={"/Read"}>Veiw Added Questions</Link>
                </button>
                <button className="inline-block cursor-pointer mx-2 mb-0 px-5 py-3 border-0 font-bold text-lg text-white bg-gradient-to-b from-blue-400 to-blue-600 shadow-md">
                  <Link to={"/StudentSurvay"}>Veiw Survays Questions</Link>
                </button>
                <button className="inline-block cursor-pointer mx-2 mb-0 px-5 py-3 border-0 font-bold text-lg text-white bg-gradient-to-b from-blue-400 to-blue-600 shadow-md">
                  <Link to={"/Student"}>Veiw Submits</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
