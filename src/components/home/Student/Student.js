// import React, { useState } from "react";
// import app from "../../../firebase/firebase";
// import { getDatabase, ref, get } from "firebase/database";

// export default function Student() {
//   let [questionArray, setquestionArray] = useState([]);

//   const fetchData = async () => {
//     const db = getDatabase(app);
//     const quesDB = ref(db, "posts/survayanswers");
//     const snapshot = await get(quesDB);
//     if (snapshot.exists()) {
//       setquestionArray(Object.values(snapshot.val()));
//     } else {
//       alert("error");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center m-12 p-12 bg-gray-100 min-h-screen">
//       <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Submitted Answers
//         </h1>
//         <button
//           className="w-full px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-6"
//           onClick={fetchData}
//         >
//           Display Submitted Answers
//         </button>
//         <div className="space-y-6">
//           {questionArray.length > 0 ? (
//             questionArray.map((item, index) => (
//               <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md">
//                 <p className="text-xl font-semibold mb-2">
//                   <strong>Student:</strong> {item.studentName}
//                 </p>
//                 <ol className="list-decimal list-inside pl-6 space-y-2">
//                   {Object.values(item.answers).length > 0 ? (
//                     Object.values(item.answers).map((answer, answerIndex) => (
//                       <li key={answerIndex} className="text-gray-700">
//                         {answer}
//                       </li>
//                     ))
//                   ) : (
//                     <li className="text-gray-500">No answers available</li>
//                   )}
//                 </ol>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center">No answers to display</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import app from "../../../firebase/firebase";
// import { getDatabase, ref, get } from "firebase/database";

// export default function Student() {
//   const [questionArray, setQuestionArray] = useState([]);
//   const [answerArray, setAnswerArray] = useState([]);

//   useEffect(() => {
//     fetchQuestions();
//     fetchAnswers();
//   }, []);

//   const fetchQuestions = async () => {
//     const db = getDatabase(app);
//     const quesDB = ref(db, "posts/questions");
//     const snapshot = await get(quesDB);
//     if (snapshot.exists()) {
//       const questions = Object.entries(snapshot.val()).map(
//         ([key, question]) => ({
//           id: key, // Ensure each question has an identifier
//           ...question,
//         })
//       );
//       setQuestionArray(questions);
//     } else {
//       console.error("Error fetching questions");
//     }
//   };

//   const fetchAnswers = async () => {
//     const db = getDatabase(app);
//     const ansDB = ref(db, "posts/survayanswers");
//     const snapshot = await get(ansDB);
//     if (snapshot.exists()) {
//       setAnswerArray(Object.values(snapshot.val()));
//     } else {
//       console.error("Error fetching answers");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center m-12 p-12 bg-gray-100 min-h-screen">
//       <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Submitted Answers
//         </h1>
//         <div className="space-y-6">
//           {answerArray.length > 0 ? (
//             answerArray.map((item, index) => (
//               <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md">
//                 <p className="text-xl font-semibold mb-2">
//                   <strong>Student Name:</strong> {item.studentName}
//                 </p>
//                 <ol className="list-decimal list-inside pl-6 space-y-2">
//                   {Object.entries(item.answers).map(
//                     ([questionKey, answer], answerIndex) => (
//                       <li key={answerIndex} className="text-gray-700">
//                         {/* <span className="font-bold text-gray-900">
//                           {questionArray.find((q) => q.id === questionKey)
//                             ?.questionText || "Unknown Question"}
//                         </span> */}
//                         <div className="text-gray-600">
//                           <span>AnswerSelected: </span>"{answer}"
//                         </div>
//                       </li>
//                     )
//                   )}
//                 </ol>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center">No answers to display</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import app from "../../../firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";

export default function Student() {
  const [questionArray, setQuestionArray] = useState([]);
  const [answerArray, setAnswerArray] = useState([]);

  useEffect(() => {
    fetchQuestions();
    fetchAnswers();
  }, []);

  const fetchQuestions = async () => {
    try {
      const db = getDatabase(app);
      const quesDB = ref(db, "posts/questions");
      const snapshot = await get(quesDB);
      if (snapshot.exists()) {
        const questions = snapshot.val();
        // Convert questions into an array with key as id
        const questionsArray = Object.entries(questions).map(
          ([key, value]) => ({
            id: key,
            questionText: value.questionText,
          })
        );
        setQuestionArray(questionsArray);
      } else {
        console.error("No questions found");
      }
    } catch (error) {
      console.error("Error fetching questions:", error.message);
    }
  };

  const fetchAnswers = async () => {
    try {
      const db = getDatabase(app);
      const ansDB = ref(db, "posts/survayanswers");
      const snapshot = await get(ansDB);
      if (snapshot.exists()) {
        setAnswerArray(Object.values(snapshot.val()));
      } else {
        console.error("No answers found");
      }
    } catch (error) {
      console.error("Error fetching answers:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center m-12 p-12 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Submitted Answers
        </h1>
        <div className="space-y-6">
          {answerArray.length > 0 ? (
            answerArray.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md">
                <p className="text-xl font-semibold mb-2">
                  <strong>Student Name:</strong> {item.studentName}
                </p>
                <ol className="list-decimal list-inside pl-6 space-y-2">
                  {Object.entries(item.answers).map(
                    ([questionKey, answer], answerIndex) => (
                      <li key={answerIndex} className="text-gray-700">
                        <span className="font-bold text-gray-900">
                          {questionArray.find((q) => q.id === questionKey)
                            ?.questionText || "Unknown Question"}
                        </span>
                        <div className="text-gray-600">
                          <span>Answer Selected: </span>"{answer}"
                        </div>
                      </li>
                    )
                  )}
                </ol>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No answers to display</p>
          )}
        </div>
      </div>
    </div>
  );
}
