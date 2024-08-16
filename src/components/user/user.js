import React, { Component } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { v1 as uuidv1 } from "uuid";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: uuidv1(),
      studentName: "",
      answers: {},
      additionalInputs: {},
      isSubmitted: false,
      questions: [],
    };
    this.studentNameSubmit = this.studentNameSubmit.bind(this);
    this.surveySubmit = this.surveySubmit.bind(this);
    this.answerSelected = this.answerSelected.bind(this);
    this.additionalInputChanged = this.additionalInputChanged.bind(this);
    this.fetchQuestions = this.fetchQuestions.bind(this);
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  fetchQuestions() {
    const questionsRef = ref(database, "posts/questions");

    onValue(questionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const questions = [];

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            for (const qKey in data[key]) {
              if (data[key].hasOwnProperty(qKey)) {
                questions.push({
                  questionText: data[key][qKey].questionText,
                  options: Object.values(data[key][qKey].options || []),
                  requiresAdditionalInput:
                    data[key][qKey].requiresAdditionalInput || false,
                });
              }
            }
          }
        }

        this.setState({ questions });
      } else {
        console.log("No questions available.");
      }
    });
  }

  studentNameSubmit(event) {
    event.preventDefault();
    const name = this.nameInput.value;
    this.setState({ studentName: name });
  }

  surveySubmit(event) {
    event.preventDefault();
    const { uid, studentName, answers, questions } = this.state;

    for (let i = 0; i < questions.length; i++) {
      const answerKey = `ans${i + 1}`;
      if (!answers[answerKey] || !answers[answerKey].selectedAnswer) {
        alert(`Please answer question ${i + 1}.`);
        return;
      }
    }

    const allAnswers = {};
    questions.forEach((question, index) => {
      const answerKey = `ans${index + 1}`;
      allAnswers[answerKey] = {
        selectedAnswer: answers[answerKey]?.selectedAnswer || "",
        additionalInput: answers[answerKey]?.additionalInput || "",
        questionText: question.questionText,
      };
    });

    set(ref(database, "posts/survayanswers/" + uid), {
      studentName,
      answers: allAnswers,
    })
      .then(() => this.setState({ isSubmitted: true }))
      .catch((error) => console.error("Error submitting survey:", error));
  }

  answerSelected(event, questionIndex) {
    const { value } = event.target;
    const answerKey = `ans${questionIndex + 1}`;

    this.setState((prevState) => ({
      answers: {
        ...prevState.answers,
        [answerKey]: {
          ...prevState.answers[answerKey],
          selectedAnswer: value,
        },
      },
    }));
  }

  additionalInputChanged(event, questionIndex) {
    const { value } = event.target;
    const answerKey = `ans${questionIndex + 1}`;

    this.setState((prevState) => ({
      answers: {
        ...prevState.answers,
        [answerKey]: {
          ...prevState.answers[answerKey],
          additionalInput: value,
        },
      },
    }));
  }

  render() {
    const { studentName, isSubmitted, questions } = this.state;

    let nameContent;
    let questionsContent;

    if (!studentName && !isSubmitted) {
      nameContent = (
        <div className="max-w-md mx-auto p-8 bg-blue shadow-md rounded">
          <h1 className="text-3xl font-bold mb-4">
            Hey! Please enter Your name.
          </h1>
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={this.studentNameSubmit}
          >
            <input
              className="text-3xl p-5 w-50 p-4 pl-10 text-lg text-gray-700 border border-gray-300 rounded"
              type="text"
              placeholder="Enter your name"
              ref={(input) => (this.nameInput = input)}
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
      nameContent = (
        <h1 className="text-3xl font-bold mb-4">
          Welcome {studentName} to our survey
        </h1>
      );

      questionsContent = (
        <div>
          <h1 className="text-3xl font-bold mb-4">Here are some questions.</h1>
          <form onSubmit={this.surveySubmit}>
            {questions.map((question, index) => (
              <div
                key={index}
                className="max-w-md p-5 bg-white shadow-md mx-auto opacity-100 text-black leading-49 border border-gray-300 rounded-lg"
              >
                <label className="block text-lg font-bold mb-2">
                  Question {index + 1}: {question.questionText}
                </label>
                <div className="flex flex-wrap -mx-4 mb-4">
                  {question.options.map((option, optionIndex) => (
                    <div className="w-1/2 px-4 mb-4" key={optionIndex}>
                      <input
                        type="radio"
                        className="mr-2"
                        name={`ans${index + 1}`}
                        value={option}
                        onChange={(e) => this.answerSelected(e, index)}
                      />
                      <span className="text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
                {question.requiresAdditionalInput && (
                  <div className="mt-4">
                    <label className="block text-md font-medium mb-2">
                      Any reason:
                    </label>
                    <input
                      type="text"
                      placeholder="Add any comments here..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 text-gray-800"
                      value={
                        this.state.answers[`ans${index + 1}`]
                          ?.additionalInput || ""
                      }
                      onChange={(e) => this.additionalInputChanged(e, index)}
                    />
                  </div>
                )}
              </div>
            ))}
            <input
              className="inline-block cursor-pointer mx-2 mb-0 mr-0 px-5 py-3 border-0 font-bold rounded my-2 text-lg text-white bg-gradient-to-b from-orange-400 to-orange-600 shadow-md;"
              type="submit"
              value="Submit"
            />
          </form>
        </div>
      );
    } else if (studentName && isSubmitted) {
      nameContent = (
        <h1 className="text-3xl font-bold mb-4">
          Thank You! "{studentName}" for submitting your answers.
        </h1>
      );
    }

    return (
      <div>
        {nameContent}
        ==========================
        {questionsContent}
      </div>
    );
  }
}

export default User;
