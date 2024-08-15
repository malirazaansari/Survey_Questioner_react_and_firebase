import React, { useState } from "react";
import app from "../../../firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";

export default function Student() {
  let [questionArray, setquestionArray] = useState([]);

  const fetchData = async () => {
    const db = getDatabase(app);
    const quesDB = ref(db, "posts/survayanswers");
    const snapshot = await get(quesDB);
    if (snapshot.exists()) {
      setquestionArray(Object.values(snapshot.val()));
    } else {
      alert("error");
    }
  };

  return (
    <div className="flex justify-center items-center m-12 p-12 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Submitted Answers
        </h1>
        <button
          className="w-full px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-6"
          onClick={fetchData}
        >
          Display Submitted Answers
        </button>
        <div className="space-y-6">
          {questionArray.length > 0 ? (
            questionArray.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md">
                <p className="text-xl font-semibold mb-2">
                  <strong>Student:</strong> {item.studentName}
                </p>
                <ol className="list-decimal list-inside pl-6 space-y-2">
                  {Object.values(item.answers).length > 0 ? (
                    Object.values(item.answers).map((answer, answerIndex) => (
                      <li key={answerIndex} className="text-gray-700">
                        {answer}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No answers available</li>
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
