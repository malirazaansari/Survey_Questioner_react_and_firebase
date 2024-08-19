import React, { useState, useEffect } from "react";
import app from "../../../firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";

export default function Read() {
  const [surveyArray, setSurveyArray] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});

  const fetchSurveyData = async () => {
    try {
      const db = getDatabase(app);
      const surveysRef = ref(db, "posts/surveys");
      const snapshot = await get(surveysRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          const surveys = await Promise.all(
            Object.keys(data).map(async (surveyKey) => {
              const survey = data[surveyKey];
              const questionsRef = ref(
                db,
                `posts/surveys/${surveyKey}/questions`
              );
              const questionsSnapshot = await get(questionsRef);
              const questionsData = questionsSnapshot.exists()
                ? questionsSnapshot.val()
                : {};

              const questions = Object.keys(questionsData).map(
                (questionKey) => {
                  const questionData = questionsData[questionKey];
                  return {
                    questionText:
                      questionData.questionText || "No question text provided",
                    options: questionData.options || [],
                  };
                }
              );

              return {
                surveyKey,
                name: survey.name || "Unnamed Survey",
                questions,
              };
            })
          );

          setSurveyArray(surveys);
        } else {
          alert("No surveys found");
        }
      } else {
        alert("No surveys found");
      }
    } catch (error) {
      console.error("Error fetching survey data:", error.message);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const db = getDatabase(app);
      const analyticsRef = ref(db, "analytics");
      const snapshot = await get(analyticsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setAnalyticsData(data);
      } else {
        console.log("No analytics data found.");
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
    }
  };

  useEffect(() => {
    fetchSurveyData();
    fetchAnalyticsData();
  }, []);

  return (
    <div className="flex justify-center items-center m-12 p-12 bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Survey Questions & Analytics
        </h1>
        <div className="flex space-x-6">
          <div className="w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Survey Questions</h2>
            <div className="space-y-6">
              {surveyArray.length > 0 ? (
                surveyArray.map((survey, surveyIndex) => (
                  <div key={surveyIndex}>
                    <h3 className="text-xl font-semibold mb-2">
                      {survey.name}
                    </h3>
                    {survey.questions.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg shadow-md mb-4"
                      >
                        <p className="text-lg font-semibold mb-2">
                          <strong>Question {index + 1}:</strong>{" "}
                          {item.questionText}
                        </p>
                        <ul className="list-disc list-inside pl-4">
                          {item.options.length > 0 ? (
                            item.options.map((option, idx) => (
                              <li key={idx} className="text-gray-700">
                                Option {idx + 1}: {option}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500">
                              No options available
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No surveys to display
                </p>
              )}
            </div>
          </div>

          <div className="w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Survey Analytics</h2>
            <div className="space-y-6">
              {Object.keys(analyticsData).length > 0 ? (
                Object.entries(analyticsData).map(
                  ([surveyKey, questions], surveyIndex) => (
                    <div key={surveyIndex}>
                      <h3 className="text-xl font-semibold mb-2">
                        {surveyArray.find(
                          (survey) => survey.surveyKey === surveyKey
                        )?.name || `Survey ${surveyIndex + 1}`}
                      </h3>
                      {Object.entries(questions).map(
                        ([questionText, options], questionIndex) => (
                          <div
                            key={questionIndex}
                            className="p-4 bg-gray-50 rounded-lg shadow-md mb-4"
                          >
                            <p className="text-lg font-semibold mb-2">
                              <strong>Question:</strong> {questionText}
                            </p>
                            <ul className="list-disc list-inside pl-4">
                              {Object.entries(options).map(
                                ([option, { count }], idx) => (
                                  <li key={idx} className="text-gray-700">
                                    {option}: {count}{" "}
                                    {count === 1 ? "time" : "times"}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )
                      )}
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
