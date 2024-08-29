import React, { useState, useEffect } from "react";
import app from "../../../firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";

export default function Student() {
  const [answerArray, setAnswerArray] = useState([]);

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      const db = getDatabase(app);
      const ansDB = ref(db, "posts/survayanswers");
      const snapshot = await get(ansDB);

      if (snapshot.exists()) {
        const answersData = snapshot.val();
        const allAnswers = [];

        for (const surveyId in answersData) {
          if (answersData.hasOwnProperty(surveyId)) {
            const surveyAnswers = answersData[surveyId];
            for (const answerId in surveyAnswers) {
              if (surveyAnswers.hasOwnProperty(answerId)) {
                allAnswers.push(surveyAnswers[answerId]);
              }
            }
          }
        }

        setAnswerArray(allAnswers);
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
                  <div>
                    <strong>Student Name:</strong> {item.studentName}
                  </div>
                  <div>
                    <strong>Student Email:</strong>{" "}
                    {item.studentEmail ? (
                      item.studentEmail
                    ) : (
                      <span className="text-red-600">Old survey done</span>
                    )}
                  </div>
                </p>
                <ol className="list-decimal list-inside pl-6 space-y-2">
                  {Object.entries(item.answers).map(
                    ([questionKey, answer], answerIndex) => (
                      <li key={answerIndex} className="text-gray-700">
                        <span className="font-bold text-gray-900">
                          {answer.questionText || "Unknown Question"}
                        </span>
                        <div className="text-gray-600 mt-1">
                          <span>Answer Selected: </span>
                          {Array.isArray(answer.selectedAnswer)
                            ? answer.selectedAnswer.join(", ")
                            : answer.selectedAnswer}
                        </div>
                        {answer.additionalInput && (
                          <div className="mt-2 p-2 border border-gray-300 rounded bg-gray-50">
                            <span className="font-bold">Additional Input:</span>
                            <p>{answer.additionalInput}</p>
                          </div>
                        )}
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
