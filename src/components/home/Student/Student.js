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
    <div className="flex justify-center items-center m-12 p-12 mx-0 bg-gray-100 h-full w-full">
      <div className="flex justify-center items-center flex-col ">
        <button
          className="flex justify-center align-center px-6  py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          onClick={fetchData}
        >
          Display Submitted Answers
        </button>
        <ul>
          {questionArray.map((item, index) => (
            <li key={index}>
              {item.studentName}:
              <ul>
                {Object.values(item.answers).map((answer, answerIndex) => (
                  <li key={answerIndex}>{answer}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
