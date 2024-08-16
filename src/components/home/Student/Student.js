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
    const db = getDatabase(app);
    const quesDB = ref(db, "posts/questions");
    const snapshot = await get(quesDB);
    if (snapshot.exists()) {
      const questions = Object.entries(snapshot.val()).map(
        ([key, question]) => ({
          id: key, // Ensure each question has an identifier
          ...question,
        })
      );
      setQuestionArray(questions);
    } else {
      console.error("Error fetching questions");
    }
  };

  const fetchAnswers = async () => {
    const db = getDatabase(app);
    const ansDB = ref(db, "posts/survayanswers");
    const snapshot = await get(ansDB);
    if (snapshot.exists()) {
      setAnswerArray(Object.values(snapshot.val()));
    } else {
      console.error("Error fetching answers");
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
                    ([questionKey, answer], answerIndex) => {
                      // Find the corresponding question by matching question text
                      const question = questionArray.find((q) =>
                        Object.values(q).some(
                          (questionData) =>
                            questionData.questionText === answer.questionText
                        )
                      );

                      return (
                        <li key={answerIndex} className="text-gray-700">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">
                              {answer.questionText || "Unknown Question"}
                            </span>
                            <div className="text-gray-600 mt-1">
                              <span>Answer Selected: </span>"
                              {answer.selectedAnswer}"
                            </div>
                            {/* Check for additional input */}
                            {answer.additionalInput && (
                              <div className="mt-2 p-2 border border-gray-300 rounded bg-gray-50">
                                <span className="font-bold">
                                  Additional Input:
                                </span>
                                <p>{answer.additionalInput}</p>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    }
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
