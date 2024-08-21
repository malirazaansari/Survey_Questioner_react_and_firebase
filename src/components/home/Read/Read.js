import React, { useState, useEffect } from "react";
import app from "../../../firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer as PieResponsiveContainer,
} from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  ResponsiveContainer as BarResponsiveContainer,
} from "recharts";

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

              const submissionCountRef = ref(
                db,
                `posts/surveys/${surveyKey}/submissionCount`
              );
              const submissionCountSnapshot = await get(submissionCountRef);

              const submittedCount = submissionCountSnapshot.exists()
                ? submissionCountSnapshot.val().count || 0
                : 0;

              return {
                surveyKey,
                name: survey.name || "Unnamed Survey",
                questions,
                submittedCount,
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
        setAnalyticsData({});
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error.message);
      setAnalyticsData({});
    }
  };

  useEffect(() => {
    fetchSurveyData();
    fetchAnalyticsData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B57EDC"];

  const barChartData = surveyArray.map((survey) => ({
    name: survey.name,
    submissionCount: survey.submittedCount,
  }));

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

            <div className="w-full mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Survey Submission Counts
              </h2>
              <BarResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <BarTooltip />
                  <Bar dataKey="submissionCount" fill="#82ca9d" />
                </BarChart>
              </BarResponsiveContainer>
            </div>

            <div className="space-y-6">
              {surveyArray.length > 0 ? (
                surveyArray.map((survey, surveyIndex) => (
                  <div key={surveyIndex}>
                    <h3 className="text-xl font-semibold mb-2">
                      {survey.name} - ({survey.submittedCount}{" "}
                      {survey.submittedCount === 1
                        ? "submission"
                        : "submissions"}
                      )
                    </h3>
                    {survey.questions.map((item, index) => {
                      const analytics =
                        analyticsData[survey.surveyKey]?.[item.questionText] ||
                        {};
                      const pieData = item.options
                        .map((option, idx) => ({
                          name: option,
                          value: analytics[option]?.count || 0,
                        }))
                        .filter(({ value }) => value > 0);

                      return (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg shadow-md mb-4"
                        >
                          <p className="text-lg font-semibold mb-2">
                            <strong>Question {index + 1}:</strong>{" "}
                            {item.questionText}
                          </p>
                          <ul className="list-disc list-inside pl-4">
                            {item.options
                              .map((option, idx) => ({
                                option,
                                count: analytics[option]?.count || 0,
                              }))
                              .filter(({ count }) => count > 0)
                              .map(({ option, count }, idx) => (
                                <li key={idx} className="text-gray-700">
                                  Option {idx + 1}: {option} - ({count}{" "}
                                  {count === 1 ? "submission" : "submissions"})
                                </li>
                              ))}
                          </ul>
                          {pieData.length > 0 && (
                            <div className="mt-4 bg-slate-200 rounded">
                              <PieResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                  <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                      `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {pieData.map((entry, idx) => (
                                      <Cell
                                        key={`cell-${idx}`}
                                        fill={COLORS[idx % COLORS.length]}
                                      />
                                    ))}
                                  </Pie>
                                  <PieTooltip />
                                </PieChart>
                              </PieResponsiveContainer>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
