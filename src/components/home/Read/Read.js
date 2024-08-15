// import React, { useState } from "react";
// import app from "../../../firebase/firebase";
// import { getDatabase, ref, get } from "firebase/database";

// export default function Read() {
//   let [questionArray, setquestionArray] = useState([]);

//   const fetchData = async () => {
//     const db = getDatabase(app);
//     const quesDB = ref(db, "posts/questions");
//     const snapshot = await get(quesDB);
//     if (snapshot.exists()) {
//       setquestionArray(Object.values(snapshot.val()));
//     } else {
//       alert("error");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center m-12 p-12 mx-0 bg-gray-100 h-full w-full">
//       <div className="flex justify-center items-center flex-col ">
//         <button
//           className="flex justify-center align-center px-6  py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
//           onClick={fetchData}
//         >
//           Display Added Questions
//         </button>
//         <ul>
//           {questionArray.map((item, index) => (
//             <li key={index}>
//               {item.question1}: {item.question2}: {item.question3}:{" "}
//               {item.question4}: {item.question5}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import app from "../../../firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";

export default function Read() {
  let [questionArray, setQuestionArray] = useState([]);

  const fetchData = async () => {
    try {
      const db = getDatabase(app);
      const quesDB = ref(db, "posts/questions");
      const snapshot = await get(quesDB);

      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Fetched data:", data); // Log the entire data object

        if (data) {
          // Transform data into an array of questions
          const questions = Object.keys(data)
            .map((key) => {
              const question = data[key];
              const questionKeys = Object.keys(question);

              return questionKeys.map((questionKey) => {
                const questionData = question[questionKey];
                return {
                  questionText:
                    questionData.questionText || "No question text provided",
                  options: questionData.options || [],
                };
              });
            })
            .flat(); // Flatten array if needed

          console.log("Formatted Questions:", questions); // Log formatted questions
          setQuestionArray(questions);
        } else {
          alert("No questions found");
        }
      } else {
        alert("No questions found");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  return (
    <div className="flex justify-center items-center m-12 p-12 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Survey Questions
        </h1>
        <button
          className="w-full px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-6"
          onClick={fetchData}
        >
          Display Added Questions
        </button>
        <div className="space-y-6">
          {questionArray.length > 0 ? (
            questionArray.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md">
                <p className="text-xl font-semibold mb-2">
                  <strong>Question {index + 1}:</strong> {item.questionText}
                </p>
                <ul className="list-disc list-inside pl-4">
                  {item.options.length > 0 ? (
                    item.options.map((option, idx) => (
                      <li key={idx} className="text-gray-700">
                        Option {idx + 1}: {option}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No options available</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No questions to display</p>
          )}
        </div>
      </div>
    </div>
  );
}
