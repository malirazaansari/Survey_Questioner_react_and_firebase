// import React, { useState } from "react";
// import app from "../../../firebase/firebase";
// import { getDatabase, ref, get } from "firebase/database";

// export default function Read() {
//   let [questionArray, setQuestionArray] = useState([]);

//   const fetchData = async () => {
//     try {
//       const db = getDatabase(app);
//       const quesDB = ref(db, "posts/questions");
//       const snapshot = await get(quesDB);

//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         console.log("Fetched data:", data); // Log the entire data object

//         if (data) {
//           // Transform data into an array of questions
//           const questions = Object.keys(data)
//             .map((key) => {
//               const question = data[key];
//               const questionKeys = Object.keys(question);

//               return questionKeys.map((questionKey) => {
//                 const questionData = question[questionKey];
//                 return {
//                   questionText:
//                     questionData.questionText || "No question text provided",
//                   options: questionData.options || [],
//                 };
//               });
//             })
//             .flat(); // Flatten array if needed

//           console.log("Formatted Questions:", questions); // Log formatted questions
//           setQuestionArray(questions);
//         } else {
//           alert("No questions found");
//         }
//       } else {
//         alert("No questions found");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//     }
//   };
//   return (
//     <div className="flex justify-center items-center m-12 p-12 bg-gray-100 min-h-screen">
//       <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Survey Questions
//         </h1>
//         <button
//           className="w-full px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-6"
//           onClick={fetchData}
//         >
//           Display Added Questions
//         </button>
//         <div className="space-y-6">
//           {questionArray.length > 0 ? (
//             questionArray.map((item, index) => (
//               <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md">
//                 <p className="text-xl font-semibold mb-2">
//                   <strong>Question {index + 1}:</strong> {item.questionText}
//                 </p>
//                 <ul className="list-disc list-inside pl-4">
//                   {item.options.length > 0 ? (
//                     item.options.map((option, idx) => (
//                       <li key={idx} className="text-gray-700">
//                         Option {idx + 1}: {option}
//                       </li>
//                     ))
//                   ) : (
//                     <li className="text-gray-500">No options available</li>
//                   )}
//                 </ul>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center">No questions to display</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import app from "../../../firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";

export default function Read() {
  let [questionArray, setQuestionArray] = useState([]);
  let [analyticsData, setAnalyticsData] = useState({});

  const fetchData = async () => {
    try {
      const db = getDatabase(app);
      const quesDB = ref(db, "posts/questions");
      const snapshot = await get(quesDB);

      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
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
            .flat();
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

  const fetchAnalyticsData = async () => {
    try {
      const db = getDatabase(app);
      const answersDB = ref(db, "posts/survayanswers");
      const snapshot = await get(answersDB);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const stats = {};

        // Analyze the data to count option selections
        Object.values(data).forEach((submission) => {
          Object.values(submission.answers).forEach((answer, index) => {
            const questionText = answer.questionText;
            const selectedAnswer = answer.selectedAnswer;

            if (!stats[questionText]) {
              stats[questionText] = {};
            }

            if (!stats[questionText][selectedAnswer]) {
              stats[questionText][selectedAnswer] = 0;
            }

            stats[questionText][selectedAnswer]++;
          });
        });

        setAnalyticsData(stats);
      } else {
        console.log("No survey answers found.");
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAnalyticsData();
  }, []);

  return (
    <div className="flex justify-center items-center m-12 p-12 bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Survey Questions & Analytics
        </h1>
        <div className="flex space-x-6">
          {/* Questions Section */}
          <div className="w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Survey Questions</h2>
            <button
              className="w-full px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-6"
              onClick={fetchData}
            >
              Display Added Questions
            </button>
            <div className="space-y-6">
              {questionArray.length > 0 ? (
                questionArray.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg shadow-md"
                  >
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
                <p className="text-gray-500 text-center">
                  No questions to display
                </p>
              )}
            </div>
          </div>

          {/* Analytics Section */}
          <div className="w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Survey Analytics</h2>
            <div className="space-y-6">
              {Object.keys(analyticsData).length > 0 ? (
                Object.entries(analyticsData).map(
                  ([question, options], index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg shadow-md"
                    >
                      <p className="text-xl font-semibold mb-2">
                        <strong>Question:</strong> {question}
                      </p>
                      <ul className="list-disc list-inside pl-4">
                        {Object.entries(options).map(([option, count], idx) => (
                          <li key={idx} className="text-gray-700">
                            {option}: {count} {count === 1 ? "time" : "times"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )
              ) : (
                <p className="text-gray-500 text-center">
                  No analytics data available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
