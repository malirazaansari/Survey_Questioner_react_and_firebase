import React, { useState, useEffect } from "react";
import app from "../../../firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";

export default function Read() {
  const [surveyArray, setSurveyArray] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});

  // const fetchSurveyData = async () => {
  //   try {
  //     const db = getDatabase(app);
  //     const surveysRef = ref(db, "posts/surveys");
  //     const snapshot = await get(surveysRef);

  //     if (snapshot.exists()) {
  //       const data = snapshot.val();
  //       if (data) {
  //         const surveys = await Promise.all(
  //           Object.keys(data).map(async (surveyKey) => {
  //             const survey = data[surveyKey];
  //             const questionsRef = ref(
  //               db,
  //               `posts/surveys/${surveyKey}/questions`
  //             );
  //             const questionsSnapshot = await get(questionsRef);
  //             const questionsData = questionsSnapshot.exists()
  //               ? questionsSnapshot.val()
  //               : {};

  //             const questions = Object.keys(questionsData).map(
  //               (questionKey) => {
  //                 const questionData = questionsData[questionKey];
  //                 return {
  //                   questionText:
  //                     questionData.questionText || "No question text provided",
  //                   options: questionData.options || [],
  //                 };
  //               }
  //             );

  //             const surveyAnswersRef = ref(
  //               db,
  //               `posts/survayanswers/${surveyKey}`
  //             );
  //             const surveyAnswersSnapshot = await get(surveyAnswersRef);
  //             const submittedCount = surveyAnswersSnapshot.exists()
  //               ? Object.keys(surveyAnswersSnapshot.val()).length
  //               : 0;

  //             return {
  //               surveyKey,
  //               name: survey.name || "Unnamed Survey",
  //               questions,
  //               submittedCount,
  //             };
  //           })
  //         );

  //         setSurveyArray(surveys);
  //       } else {
  //         alert("No surveys found");
  //       }
  //     } else {
  //       alert("No surveys found");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching survey data:", error.message);
  //   }
  // };
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

              // Fetch the submission count for this survey
              const submissionCountRef = ref(
                db,
                `posts/surveys/${surveyKey}/submissionCount`
              );
              const submissionCountSnapshot = await get(submissionCountRef);

              // Log the submission count snapshot for debugging
              console.log(
                "Submission Count Snapshot:",
                submissionCountSnapshot.val()
              );

              const submittedCount = submissionCountSnapshot.exists()
                ? submissionCountSnapshot.val().count || 0
                : 0;

              // Log the survey key and submitted count for debugging
              console.log(`Survey Key: ${surveyKey}`);
              console.log(`Submitted Count: ${submittedCount}`);

              return {
                surveyKey,
                name: survey.name || "Unnamed Survey",
                questions,
                submittedCount,
              };
            })
          );

          console.log("Surveys fetched:", surveys);
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
              {surveyArray.length > 0 ? (
                surveyArray.map((survey, surveyIndex) => (
                  <div key={surveyIndex}>
                    <h3 className="text-xl font-semibold mb-2">
                      {survey.name} - {survey.submittedCount}{" "}
                      {survey.submittedCount === 1 ? "response" : "responses"}
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
        </div>
      </div>
    </div>
  );
}
