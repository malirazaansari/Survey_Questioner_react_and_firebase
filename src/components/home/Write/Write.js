import React, { useState } from "react";
import app from "../../../firebase/firebase";
import { getDatabase, ref, set, push } from "firebase/database";

export default function Write() {
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: [
        { label: "Option 1", value: "" },
        { label: "Option 2", value: "" },
        { label: "Option 3", value: "" },
        { label: "Option 4", value: "" },
      ],
      showAddOptionButton: true,
      requiresAdditionalInput: false, // New field to track if an additional input is required
    },
  ]);

  const handleInputChange = (event, index, field) => {
    const newQuestions = [...questions];
    if (field.includes("options")) {
      const optionIndex = field.split(".")[1];
      newQuestions[index].options[optionIndex].value = event.target.value;
    } else {
      newQuestions[index][field] = event.target.value;
    }
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: [
          { label: "Option 1", value: "" },
          { label: "Option 2", value: "" },
          { label: "Option 3", value: "" },
          { label: "Option 4", value: "" },
        ],
        showAddOptionButton: true,
        requiresAdditionalInput: false, // Default value
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push({
      label: `Option ${newQuestions[index].options.length + 1}`,
      value: "",
    });
    newQuestions[index].showAddOptionButton = false;
    setQuestions(newQuestions);
  };

  const handleSaveData = async () => {
    try {
      const db = getDatabase(app);
      const newPostKey = push(ref(db, "posts/questions")).key;

      for (let i = 0; i < questions.length; i++) {
        const questionKey = `question${i + 1}`;
        const questionData = {
          questionText: questions[i].question,
          options: questions[i].options.map((option) => option.value),
          requiresAdditionalInput: questions[i].requiresAdditionalInput,
        };

        await set(
          ref(db, `posts/questions/${newPostKey}/${questionKey}`),
          questionData
        );
      }

      alert("Questions and options saved successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-white rounded shadow-md mt-12">
      <h1 className="text-2xl font-semibold mb-6 text-center">Add Questions</h1>
      {questions.map((question, index) => (
        <div key={index} className="space-y-4">
          <label className="block text-lg font-medium text-gray-700">
            {`Question ${index + 1}:`}
          </label>
          <input
            type="text"
            className="w-full p-2 border border-sky-500 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={question.question}
            onChange={(e) => handleInputChange(e, index, "question")}
          />
          <div className="space-y-4">
            <ol className="grid grid-cols-2 gap-4">
              {question.options.map((option, optionIndex) => (
                <li key={optionIndex} className="font-medium text-gray-600">
                  {option.label}
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={option.value}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        index,
                        `options.${optionIndex}.value`
                      )
                    }
                  />
                </li>
              ))}
            </ol>
            {question.showAddOptionButton && (
              <button
                className="text-blue-500 text-sm font-semibold mt-2"
                onClick={() => handleAddOption(index)}
              >
                + Add a 5th option
              </button>
            )}
            <div>
              <input
                type="checkbox"
                checked={question.requiresAdditionalInput}
                onChange={(e) =>
                  handleInputChange(e, index, "requiresAdditionalInput")
                }
              />
              <label className="ml-2 text-gray-700">
                Include an additional input field if this option is selected
              </label>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => handleRemoveQuestion(index)}
          >
            Remove Question
          </button>
        </div>
      ))}
      <br />
      <button
        className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
        onClick={handleAddQuestion}
      >
        Add Another Question
      </button>
      <button
        className="ml-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        onClick={handleSaveData}
      >
        Save
      </button>
    </div>
  );
}
