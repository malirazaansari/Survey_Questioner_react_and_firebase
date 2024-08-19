import React, { Component } from "react";
import { ref, onValue, set, update, increment } from "firebase/database";
import { database } from "../../firebase/firebase";
import { v1 as uuidv1 } from "uuid";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: uuidv1(),
      studentName: "",
      answers: {},
      isSubmitted: false,
      surveys: [],
      questions: [],
      selectedSurveyId: null,
    };

    this.studentNameSubmit = this.studentNameSubmit.bind(this);
    this.surveySubmit = this.surveySubmit.bind(this);
    this.answerSelected = this.answerSelected.bind(this);
    this.additionalInputChanged = this.additionalInputChanged.bind(this);
    this.fetchSurveys = this.fetchSurveys.bind(this);
    this.fetchQuestions = this.fetchQuestions.bind(this);
    this.selectSurvey = this.selectSurvey.bind(this);
  }

  componentDidMount() {
    this.fetchSurveys();
  }

  fetchSurveys() {
    const surveysRef = ref(database, "posts/surveys");

    onValue(surveysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const surveys = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name,
        }));
        this.setState({ surveys });
      } else {
        console.log("No surveys available.");
      }
    });
  }

  fetchQuestions(surveyId) {
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
        this.setState({ questions });
      } else {
        console.log("No questions available.");
      }
    });
  }

  selectSurvey(surveyId) {
    this.setState({ selectedSurveyId: surveyId });
    this.fetchQuestions(surveyId);
  }

  studentNameSubmit(event) {
    event.preventDefault();
    const name = this.nameInput.value;
    this.setState({ studentName: name });
  }

  surveySubmit(event) {
    event.preventDefault();
    const { uid, studentName, answers, selectedSurveyId, questions } =
      this.state;

    for (let i = 0; i < questions.length; i++) {
      const answerKey = `ans${i + 1}_${selectedSurveyId}`;
      if (!answers[answerKey] || !answers[answerKey].selectedAnswer) {
        alert(`Please answer question ${i + 1}.`);
        return;
      }
    }

    const allAnswers = {};
    const updates = {};

    questions.forEach((question, index) => {
      const answerKey = `ans${index + 1}_${selectedSurveyId}`;
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
            updates[`/analytics/${selectedSurveyId}/${questionText}/${ans}`] = {
              count: increment(1),
            };
          });
        }
      } else {
        updates[
          `/analytics/${selectedSurveyId}/${questionText}/${selectedAnswer}`
        ] = {
          count: increment(1),
        };
      }
    });

    set(ref(database, `posts/survayanswers/${uid}/${selectedSurveyId}`), {
      studentName,
      answers: allAnswers,
    })
      .then(() => update(ref(database), updates))
      .then(() => this.setState({ isSubmitted: true }))
      .catch((error) => console.error("Error submitting survey:", error));
  }

  answerSelected(event, questionIndex) {
    const { value, type, checked } = event.target;
    const { selectedSurveyId } = this.state;
    const answerKey = `ans${questionIndex + 1}_${selectedSurveyId}`;

    this.setState((prevState) => ({
      answers: {
        ...prevState.answers,
        [answerKey]: {
          ...prevState.answers[answerKey],
          selectedAnswer:
            type === "checkbox"
              ? prevState.answers[answerKey]?.selectedAnswer
                ? checked
                  ? [...prevState.answers[answerKey].selectedAnswer, value]
                  : prevState.answers[answerKey].selectedAnswer.filter(
                      (v) => v !== value
                    )
                : [value]
              : value,
        },
      },
    }));
  }

  additionalInputChanged(event, questionIndex) {
    const { value } = event.target;
    const { selectedSurveyId } = this.state;
    const answerKey = `ans${questionIndex + 1}_${selectedSurveyId}`;

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
    const { studentName, isSubmitted, surveys, questions, selectedSurveyId } =
      this.state;

    let nameContent;
    let surveysContent;
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
      if (!selectedSurveyId) {
        surveysContent = (
          <div>
            <h1 className="text-3xl font-bold mb-4">Select a Survey</h1>
            <ul>
              {surveys.map((survey) => (
                <li key={survey.id} className="mb-2">
                  <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => this.selectSurvey(survey.id)}
                  >
                    {survey.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      } else {
        questionsContent = (
          <div>
            <h1 className="text-3xl font-bold mb-4">
              Here are some questions.
            </h1>
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
                    {question.options.map((option) => (
                      <div className="w-1/2 px-4 mb-4" key={option.key}>
                        <input
                          type={
                            question.allowsMultipleAnswers
                              ? "checkbox"
                              : "radio"
                          }
                          id={`q${index}_opt${option.key}`}
                          name={`q${index}`}
                          value={option.value}
                          checked={
                            question.allowsMultipleAnswers
                              ? (
                                  this.state.answers[
                                    `ans${index + 1}_${selectedSurveyId}`
                                  ]?.selectedAnswer || []
                                ).includes(option.value)
                              : this.state.answers[
                                  `ans${index + 1}_${selectedSurveyId}`
                                ]?.selectedAnswer === option.value
                          }
                          onChange={(e) => this.answerSelected(e, index)}
                        />
                        <label
                          className="ml-2"
                          htmlFor={`q${index}_opt${option.key}`}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))}
                  </div>
                  {question.requiresAdditionalInput && (
                    <div>
                      <label className="block text-lg font-bold mb-2">
                        Additional Input:
                      </label>
                      <input
                        type="text"
                        value={
                          this.state.answers[
                            `ans${index + 1}_${selectedSurveyId}`
                          ]?.additionalInput || ""
                        }
                        onChange={(e) => this.additionalInputChanged(e, index)}
                        className="text-lg p-2 w-full border border-gray-300 rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
              <button
                className="mt-4 bg-orange-500 hover:bg-orange-700 w-48 text-white font-bold py-2 px-4 rounded w-full"
                type="submit"
              >
                Submit Survey
              </button>
            </form>
          </div>
        );
      }
    } else if (isSubmitted) {
      nameContent = (
        <div className="max-w-md mx-auto p-8 bg-green-100 shadow-md rounded">
          <h1 className="text-3xl font-bold mb-4 text-green-600">
            Thank you for taking the survey!
          </h1>
        </div>
      );
    }

    return (
      <div className="p-5">
        {nameContent}
        {surveysContent}
        {questionsContent}
      </div>
    );
  }
}

export default User;
