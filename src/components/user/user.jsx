// import React, { useState, useEffect, useRef } from "react";
// import { ref, onValue, set, update, increment } from "firebase/database";
// import { database } from "../../firebase/firebase";
// import { v1 as uuidv1 } from "uuid";

// const User = () => {
//   const [uid] = useState(uuidv1());
//   const [studentName, setStudentName] = useState("");
//   const [studentEmail, setStudentEmail] = useState("");
//   const [answers, setAnswers] = useState({});
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [surveys, setSurveys] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [selectedSurveyId, setSelectedSurveyId] = useState(null);
//   const nameInputRef = useRef(null);
//   const emailInputRef = useRef(null);

//   useEffect(() => {
//     fetchSurveys();
//   }, []);

//   const fetchSurveys = () => {
//     const surveysRef = ref(database, "posts/surveys");

//     onValue(surveysRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const surveys = Object.keys(data).map((key) => ({
//           id: key,
//           name: data[key].name,
//         }));
//         setSurveys(surveys);
//       } else {
//         console.log("No surveys available.");
//       }
//     });
//   };

//   const fetchQuestions = (surveyId) => {
//     const questionsRef = ref(database, `posts/surveys/${surveyId}/questions`);

//     onValue(questionsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const questions = Object.keys(data).map((key) => ({
//           questionText: data[key].questionText,
//           options: Object.keys(data[key].options || []).map((optKey) => ({
//             value: data[key].options[optKey],
//             key: optKey,
//           })),
//           requiresAdditionalInput: data[key].requiresAdditionalInput || false,
//           allowsMultipleAnswers: data[key].allowsMultipleAnswers || false,
//         }));
//         setQuestions(questions);
//       } else {
//         console.log("No questions available.");
//       }
//     });
//   };

//   const selectSurvey = (surveyId) => {
//     setSelectedSurveyId(surveyId);
//     fetchQuestions(surveyId);
//   };

//   const studentNameSubmit = (event) => {
//     event.preventDefault();
//     const name = nameInputRef.current.value;
//     const email = emailInputRef.current.value;
//     if (!name || !email) {
//       alert("Please fill in both your name and email.");
//       return;
//     }
//     setStudentName(name);
//     setStudentEmail(email);
//   };

//   const surveySubmit = (event) => {
//     event.preventDefault();

//     for (let i = 0; i < questions.length; i++) {
//       const answerKey = `ans${i + 1}_${selectedSurveyId}`;
//       if (!answers[answerKey] || !answers[answerKey].selectedAnswer) {
//         alert(`Please answer question ${i + 1}.`);
//         return;
//       }
//     }

//     const allAnswers = {};
//     const updates = {};

//     questions.forEach((question, index) => {
//       const answerKey = `ans${index + 1}_${selectedSurveyId}`;
//       const selectedAnswer = answers[answerKey]?.selectedAnswer || "";
//       const additionalInput = answers[answerKey]?.additionalInput || "";
//       const questionText = question.questionText;

//       allAnswers[answerKey] = {
//         selectedAnswer,
//         additionalInput,
//         questionText,
//       };

//       if (question.allowsMultipleAnswers) {
//         if (Array.isArray(selectedAnswer)) {
//           selectedAnswer.forEach((ans) => {
//             updates[`/analytics/${selectedSurveyId}/${questionText}/${ans}`] = {
//               count: increment(1),
//             };
//           });
//         }
//       } else {
//         updates[
//           `/analytics/${selectedSurveyId}/${questionText}/${selectedAnswer}`
//         ] = {
//           count: increment(1),
//         };
//       }
//     });

//     set(ref(database, `posts/survayanswers/${uid}/${selectedSurveyId}`), {
//       studentName,
//       studentEmail,
//       answers: allAnswers,
//     })
//       .then(() => {
//         return update(
//           ref(database, `posts/surveys/${selectedSurveyId}/submissionCount`),
//           {
//             count: increment(1),
//           }
//         );
//       })
//       .then(() => update(ref(database), updates))
//       .then(() => setIsSubmitted(true))
//       .catch((error) => console.error("Error submitting survey:", error));
//   };

//   const answerSelected = (event, questionIndex) => {
//     const { value, type, checked } = event.target;
//     const answerKey = `ans${questionIndex + 1}_${selectedSurveyId}`;

//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [answerKey]: {
//         ...prevAnswers[answerKey],
//         selectedAnswer:
//           type === "checkbox"
//             ? prevAnswers[answerKey]?.selectedAnswer
//               ? checked
//                 ? [...prevAnswers[answerKey].selectedAnswer, value]
//                 : prevAnswers[answerKey].selectedAnswer.filter(
//                     (v) => v !== value
//                   )
//               : [value]
//             : value,
//       },
//     }));
//   };

//   const additionalInputChanged = (event, questionIndex) => {
//     const { value } = event.target;
//     const answerKey = `ans${questionIndex + 1}_${selectedSurveyId}`;

//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [answerKey]: {
//         ...prevAnswers[answerKey],
//         additionalInput: value,
//       },
//     }));
//   };

//   let nameContent;
//   let surveysContent;
//   let questionsContent;

//   if (!studentName && !isSubmitted) {
//     nameContent = (
//       <div className="max-w-md mx-auto p-8 bg-blue shadow-md rounded">
//         <h1 className="text-3xl font-bold mb-4">
//           Hey! Please enter your name and email.
//         </h1>
//         <form
//           className="flex flex-col justify-center items-center"
//           onSubmit={studentNameSubmit}
//         >
//           <input
//             className="text-3xl p-5 w-50 p-4 pl-10 text-lg text-gray-700 border border-gray-300 rounded mb-4"
//             type="text"
//             placeholder="Enter your name"
//             ref={nameInputRef}
//           />
//           <input
//             className="text-3xl p-5 w-50 p-4 pl-10 text-lg text-gray-700 border border-gray-300 rounded mb-4"
//             type="email"
//             placeholder="Enter your email"
//             ref={emailInputRef}
//           />
//           <button
//             className="mt-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-36"
//             type="submit"
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//     );
//   } else if (studentName && !isSubmitted) {
//     if (!selectedSurveyId) {
//       surveysContent = (
//         <div>
//           <h1 className="text-3xl font-bold mb-4">Select a Survey</h1>
//           <ul>
//             {surveys.map((survey) => (
//               <li
//                 key={survey.id}
//                 className="mb-2"
//               >
//                 <button
//                   className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
//                   onClick={() => selectSurvey(survey.id)}
//                 >
//                   {survey.name}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       );
//     } else {
//       questionsContent = (
//         <div>
//           <h1 className="text-3xl font-bold mb-4">Here are some questions.</h1>
//           <form onSubmit={surveySubmit}>
//             {questions.map((question, index) => (
//               <div
//                 key={index}
//                 className="max-w-md p-5 bg-white shadow-md mx-auto opacity-100 text-black leading-49 border border-gray-300 rounded-lg"
//               >
//                 <label className="block text-lg font-bold mb-2">
//                   Question {index + 1}: {question.questionText}
//                 </label>
//                 <div className="flex flex-wrap -mx-4 mb-4">
//                   {question.options.map((option) => (
//                     <div
//                       className="w-1/2 px-4 mb-4"
//                       key={option.key}
//                     >
//                       <input
//                         type={
//                           question.allowsMultipleAnswers ? "checkbox" : "radio"
//                         }
//                         id={`q${index}_opt${option.key}`}
//                         name={`q${index}`}
//                         value={option.value}
//                         checked={
//                           question.allowsMultipleAnswers
//                             ? (
//                                 answers[`ans${index + 1}_${selectedSurveyId}`]
//                                   ?.selectedAnswer || []
//                               ).includes(option.value)
//                             : answers[`ans${index + 1}_${selectedSurveyId}`]
//                                 ?.selectedAnswer === option.value
//                         }
//                         onChange={(e) => answerSelected(e, index)}
//                       />
//                       <label
//                         className="ml-2"
//                         htmlFor={`q${index}_opt${option.key}`}
//                       >
//                         {option.value}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//                 {question.requiresAdditionalInput && (
//                   <div>
//                     <label className="block text-lg font-bold mb-2">
//                       Why you choose this option. any reason?:
//                     </label>
//                     <input
//                       type="text"
//                       value={
//                         answers[`ans${index + 1}_${selectedSurveyId}`]
//                           ?.additionalInput || ""
//                       }
//                       onChange={(e) => additionalInputChanged(e, index)}
//                       className="text-lg p-2 w-full border border-gray-300 rounded"
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}
//             <button
//               className="mt-4 bg-orange-500 hover:bg-orange-700 w-48 text-white font-bold py-2 px-4 rounded w-48"
//               type="submit"
//             >
//               Submit Survey
//             </button>
//           </form>
//         </div>
//       );
//     }
//   } else if (isSubmitted) {
//     nameContent = (
//       <div className="max-w-md mx-auto p-8 bg-blue shadow-md rounded">
//         <h1 className="text-3xl font-bold mb-4">
//           Thank you for submitting the survey!
//         </h1>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-8">
//       {nameContent}
//       {surveysContent}
//       {questionsContent}
//     </div>
//   );
// };

// export default User;

import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, set, update, increment } from "firebase/database";
import { database } from "../../firebase/firebase";
import { v1 as uuidv1 } from "uuid";

const User = () => {
  const [uid, setUid] = useState(null);

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [submittedSurveys, setSubmittedSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = () => {
    const surveysRef = ref(database, "posts/surveys");

    onValue(surveysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const surveys = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name,
        }));
        setSurveys(surveys);
        fetchSubmittedSurveys(uid);
      } else {
        console.log("No surveys available.");
      }
    });
  };

  const fetchSubmittedSurveys = (userId) => {
    if (!userId) return;

    const submissionsRef = ref(database, `posts/survayanswers/${userId}`);

    onValue(submissionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const submittedSurveyIds = Object.keys(data).filter(
          (key) => key !== "studentName" && key !== "studentEmail"
        );
        const submissions = submittedSurveyIds.map((id) => ({
          id,
          answers: data[id].answers,
        }));
        setPreviousSubmissions(submissions);
      }
    });
  };

  const fetchQuestions = (surveyId) => {
    const questionsRef = ref(database, `posts/surveys/${surveyId}/questions`);

    onValue(questionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const questions = Object.keys(data).map((key) => ({
          questionText: data[key].questionText,
          options: Object.keys(data[key].options || []).map((optKey) => ({
            value: data[key].options[optKey],
            key: optKey,
          })),
          requiresAdditionalInput: data[key].requiresAdditionalInput || false,
          allowsMultipleAnswers: data[key].allowsMultipleAnswers || false,
        }));
        setQuestions(questions);
      } else {
        console.log("No questions available.");
      }
    });
  };

  const selectSurvey = (survey) => {
    setSelectedSurvey(survey);
    fetchQuestions(survey.id);
  };

  const studentNameSubmit = (event) => {
    event.preventDefault();
    const name = nameInputRef.current.value;
    const email = emailInputRef.current.value;
    if (!name || !email) {
      alert("Please fill in both your name and email.");
      return;
    }

    const usersRef = ref(database, "posts/survayanswers");
    onValue(usersRef, (snapshot) => {
      let existingUserId = null;
      const data = snapshot.val();

      if (data) {
        for (const [userId, userInfo] of Object.entries(data)) {
          if (
            userInfo.studentName === name &&
            userInfo.studentEmail === email
          ) {
            existingUserId = userId;
            break;
          }
        }
      }

      if (existingUserId) {
        setStudentName(name);
        setStudentEmail(email);
        setUid(existingUserId);
        fetchSubmittedSurveys(existingUserId);
      } else {
        const newUserId = uuidv1();
        set(ref(database, `posts/survayanswers/${newUserId}`), {
          studentName: name,
          studentEmail: email,
        })
          .then(() => {
            setStudentName(name);
            setStudentEmail(email);
            setUid(newUserId);
            fetchSurveys();
          })
          .catch((error) => console.error("Error creating new user:", error));
      }
    });
  };

  const surveySubmit = (event) => {
    event.preventDefault();

    if (!selectedSurvey) {
      alert("Please select a survey.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const answerKey = `ans${i + 1}_${selectedSurvey.id}`;
      if (!answers[answerKey] || !answers[answerKey].selectedAnswer) {
        alert(`Please answer question ${i + 1}.`);
        return;
      }
    }

    const allAnswers = {};
    const updates = {};

    questions.forEach((question, index) => {
      const answerKey = `ans${index + 1}_${selectedSurvey.id}`;
      const selectedAnswer = answers[answerKey]?.selectedAnswer || "";
      const additionalInput = answers[answerKey]?.additionalInput || "";
      const questionText = question.questionText;

      allAnswers[answerKey] = {
        selectedAnswer,
        additionalInput,
        questionText,
      };

      if (question.allowsMultipleAnswers) {
        if (Array.isArray(selectedAnswer)) {
          selectedAnswer.forEach((ans) => {
            updates[`/analytics/${selectedSurvey.id}/${questionText}/${ans}`] =
              {
                count: increment(1),
              };
          });
        }
      } else {
        updates[
          `/analytics/${selectedSurvey.id}/${questionText}/${selectedAnswer}`
        ] = {
          count: increment(1),
        };
      }
    });

    const userSurveyRef = ref(
      database,
      `posts/survayanswers/${uid}/${selectedSurvey.id}`
    );
    set(userSurveyRef, {
      answers: allAnswers,
    })
      .then(() => {
        return update(
          ref(database, `posts/surveys/${selectedSurvey.id}/submissionCount`),
          {
            count: increment(1),
          }
        );
      })
      .then(() => update(ref(database), updates))
      .then(() => setIsSubmitted(true))
      .catch((error) => console.error("Error submitting survey:", error));
  };

  const answerSelected = (event, questionIndex) => {
    const { value, type, checked } = event.target;
    const answerKey = `ans${questionIndex + 1}_${selectedSurvey.id}`;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [answerKey]: {
        ...prevAnswers[answerKey],
        selectedAnswer:
          type === "checkbox"
            ? prevAnswers[answerKey]?.selectedAnswer
              ? checked
                ? [...prevAnswers[answerKey].selectedAnswer, value]
                : prevAnswers[answerKey].selectedAnswer.filter(
                    (v) => v !== value
                  )
              : [value]
            : value,
      },
    }));
  };

  const additionalInputChanged = (event, questionIndex) => {
    const { value } = event.target;
    const answerKey = `ans${questionIndex + 1}_${selectedSurvey.id}`;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [answerKey]: {
        ...prevAnswers[answerKey],
        additionalInput: value,
      },
    }));
  };

  let nameContent;
  let surveysContent;
  let questionsContent;
  let previousSubmissionsContent;

  if (!studentName && !isSubmitted) {
    nameContent = (
      <div className="max-w-md mx-auto p-8 bg-blue shadow-md rounded">
        <h1 className="text-3xl font-bold mb-4">
          Hey! Please enter your name and email.
        </h1>
        <form
          className="flex flex-col justify-center items-center"
          onSubmit={studentNameSubmit}
        >
          <input
            className="text-3xl p-5 w-50 p-4 pl-10 text-lg text-gray-700 border border-gray-300 rounded mb-4"
            type="text"
            placeholder="Enter your name"
            ref={nameInputRef}
          />
          <input
            className="text-3xl p-5 w-50 p-4 pl-10 text-lg text-gray-700 border border-gray-300 rounded mb-4"
            type="email"
            placeholder="Enter your email"
            ref={emailInputRef}
          />
          <button
            className="mt-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-36"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    );
  } else if (studentName && !isSubmitted) {
    if (previousSubmissions.length > 0) {
      previousSubmissionsContent = (
        <div>
          <h2 className="text-2xl font-bold mb-4">Previous Submissions</h2>
          <ul>
            {previousSubmissions.map((submission) => (
              <li
                key={submission.id}
                className="mb-4"
              >
                <div className="bg-gray-400 p-4 rounded shadow">
                  <h3 className="text-xl font-semibold">
                    Survey ID: {submission.id}
                  </h3>
                  {Object.keys(submission.answers).map((key, index) => {
                    const answer = submission.answers[key];
                    const selectedAnswer = Array.isArray(answer.selectedAnswer)
                      ? answer.selectedAnswer
                      : [answer.selectedAnswer];

                    return (
                      <div
                        key={index}
                        className="mb-2"
                      >
                        <p className="font-medium">Question {index + 1}:</p>
                        <p>Selected Answers: {selectedAnswer.join(", ")}</p>
                        {answer.additionalInput && (
                          <p>Additional Input: {answer.additionalInput}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (surveys.length > 0) {
      surveysContent = (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Surveys</h2>
          <ul>
            {surveys.map((survey) => (
              <li
                key={survey.id}
                className="mb-4"
              >
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => selectSurvey(survey)}
                >
                  {survey.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (questions.length > 0) {
      questionsContent = (
        <div>
          <h2 className="text-2xl font-bold mb-4">Survey Questions</h2>
          <form onSubmit={surveySubmit}>
            {questions.map((question, index) => (
              <div
                key={index}
                className="mb-4"
              >
                <p className="text-lg font-semibold">{question.questionText}</p>
                {question.options.map((option) => (
                  <div
                    key={option.key}
                    className="flex items-center mb-2"
                  >
                    <input
                      type={
                        question.allowsMultipleAnswers ? "checkbox" : "radio"
                      }
                      id={`${question.key}_${option.key}`}
                      name={`question_${index}`}
                      value={option.value}
                      onChange={(event) => answerSelected(event, index)}
                    />
                    <label
                      htmlFor={`${question.key}_${option.key}`}
                      className="ml-2"
                    >
                      {option.value}
                    </label>
                  </div>
                ))}
                {question.requiresAdditionalInput && (
                  <div className="mt-2">
                    <textarea
                      rows="3"
                      placeholder="Additional input"
                      onChange={(event) => additionalInputChanged(event, index)}
                      className="w-full border border-gray-300 rounded p-2"
                    />
                  </div>
                )}
              </div>
            ))}
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      );
    }
  } else if (isSubmitted) {
    nameContent = (
      <p className="text-xl font-semibold">Survey submitted successfully!</p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {nameContent}
      {surveysContent}
      {questionsContent}
      {previousSubmissionsContent}
    </div>
  );
};

export default User;
