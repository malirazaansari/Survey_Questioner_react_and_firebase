// import React, { Component } from "react";
// import app from "../../firebase/firebase";
// import { getDatabase, ref, onValue, set } from "firebase/database";
// import firebase from "firebase/compat/app";
// var uuid = require("uuid");

// class User extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       uid: uuid.v1(),
//       studentName: "",
//       answers: {
//         ans1: "",
//         ans2: "",
//         ans3: "",
//         ans4: "",
//         ans5: "",
//       },
//       isSubmitted: false,
//     };
//     this.studentNameSubmit = this.studentNameSubmit.bind(this);
//     this.surveySubmit = this.surveySubmit.bind(this);
//     this.answerSelected = this.answerSelected.bind(this);
//   }

//   studentNameSubmit(event) {
//     event.preventDefault();
//     var name = this.nameInput.value;
//     this.setState({ studentName: name }, function () {
//       console.log(this.state);
//     });
//   }

//   surveySubmit(event) {
//     event.preventDefault();
//     firebase(app)
//       .database()
//       .ref("studentSurway/" + this.state.uid)
//       .set({
//         studentName: this.state.studentName,
//         answers: this.state.answers,
//       })
//       .then(() => {
//         this.setState({ isSubmitted: true });
//       })
//       .catch((error) => {
//         console.error("Error submitting survey:", error);
//       });
//     // this.setState({ isSubmitted: true });
//   }
//   answerSelected(event) {
//     var answers = this.state.answers;

//     if (event.target.name == "ans1") {
//       answers.ans1 = event.target.value;
//     } else if (event.target.name == "ans2") {
//       answers.ans2 = event.target.value;
//     } else if (event.target.name == "ans3") {
//       answers.ans3 = event.target.value;
//     } else if (event.target.name == "ans4") {
//       answers.ans4 = event.target.value;
//     } else if (event.target.name == "ans5") {
//       answers.ans5 = event.target.value;
//     }
//     this.setState({ answers: answers }, function () {
//       console.log(this.state);
//     });
//   }
import React, { Component } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
var uuid = require("uuid");

const firebaseConfig = {
  apiKey: "AIzaSyDNt8JbuC1e87ZUB3DJMUmNkAUjSFqiLRo",
  authDomain: "surway-complete-project.firebaseapp.com",
  databaseURL:
    "https://surway-complete-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "surway-complete-project",
  storageBucket: "surway-complete-project.appspot.com",
  messagingSenderId: "667821375242",
  appId: "1:667821375242:web:956e4f42b8f1cda70344f3",
  measurementId: "G-R6HWN39XB8",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: uuid.v1(),
      studentName: "",
      answers: {
        ans1: "",
        ans2: "",
        ans3: "",
        ans4: "",
        ans5: "",
      },
      isSubmitted: false,
    };
    this.studentNameSubmit = this.studentNameSubmit.bind(this);
    this.surveySubmit = this.surveySubmit.bind(this);
    this.answerSelected = this.answerSelected.bind(this);
  }

  studentNameSubmit(event) {
    event.preventDefault();
    var name = this.nameInput.value;
    this.setState({ studentName: name }, function () {
      console.log(this.state);
    });
  }

  surveySubmit(event) {
    event.preventDefault();
    firebase
      .database()
      .ref("posts/survayanswers/" + this.state.uid)
      .set({
        studentName: this.state.studentName,
        answers: this.state.answers,
      })
      .then(() => {
        this.setState({ isSubmitted: true });
      })
      .catch((error) => {
        console.error("Error submitting survey:", error);
      });
    // this.setState({ isSubmitted: true });
  }
  answerSelected(event) {
    var answers = this.state.answers;

    if (event.target.name == "ans1") {
      answers.ans1 = event.target.value;
    } else if (event.target.name == "ans2") {
      answers.ans2 = event.target.value;
    } else if (event.target.name == "ans3") {
      answers.ans3 = event.target.value;
    } else if (event.target.name == "ans4") {
      answers.ans4 = event.target.value;
    } else if (event.target.name == "ans5") {
      answers.ans5 = event.target.value;
    }
    this.setState({ answers: answers }, function () {
      console.log(this.state);
    });
  }

  render() {
    var name = "";
    var questions = "";

    if (this.state.studentName == "" && this.state.isSubmitted == false) {
      name = (
        <div className="max-w-md mx-auto p-8 bg-blue shadow-md rounded">
          <h1 className="text-3xl font-bold mb-4">
            Hey! Please enter Your name.
          </h1>
          <form onSubmit={this.studentNameSubmit}>
            <input
              className="text-3xl p-5 w-50 p-4 pl-10 text-lg text-gray-700 border border-gray-300 rounded"
              type="text"
              placeholder="Enter your name"
              ref={(input) => (this.nameInput = input)}
            />
            <button
              className="mt-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      );
    } else if (
      this.state.studentName !== "" &&
      this.state.isSubmitted == false
    ) {
      name = (
        <div>
          <h1 className="text-3xl font-bold mb-4">
            Welcome {this.state.studentName} to our surway
          </h1>
        </div>
      );
      questions = (
        <div>
          <h1 className="text-3xl font-bold mb-4">Here are some quetions.</h1>
          <form onSubmit={this.surveySubmit}>
            <div className="max-w-md p-5 bg-white shadow-md mx-auto opacity-100 text-black leading-49">
              <label className="block text-lg font-bold mb-2">
                Question 1: What do you like Most?
              </label>
              <br />
              <div className="flex flex-wrap -mx-4">
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans1"
                    value="sports"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Sports</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans1"
                    value="Technology"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Technology</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans1"
                    value="Movies"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Movies</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans1"
                    value="Study"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Study</span>
                </div>
              </div>
            </div>

            <div className="max-w-md p-5 bg-white shadow-md mx-auto opacity-100 text-black leading-49">
              <label className="block text-lg font-bold mb-2">
                Question 2: Which Programming Language to you like Most?
              </label>
              <br />
              <div className="flex flex-wrap -mx-4">
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans2"
                    value="JavaScript"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">JavaScript</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans2"
                    value="Dotnet"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Dotnet</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans2"
                    value="Python"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Python</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans2"
                    value="Dart"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Dart</span>
                </div>
              </div>
            </div>

            <div className="max-w-md p-5 bg-white shadow-md mx-auto opacity-100 text-black leading-49">
              <label className="block text-lg font-bold mb-2">
                Question 3: Which sports do you play?
              </label>
              <br />
              <div className="flex flex-wrap -mx-4">
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans3"
                    value="Cricket"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Cricket</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans3"
                    value="Football"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Football</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans3"
                    value="Bedminton"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Bedminton</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans3"
                    value="Table_Tennis"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Table Tennis</span>
                </div>
              </div>
            </div>

            <div className="max-w-md p-5 bg-white shadow-md mx-auto opacity-100 text-black leading-49">
              <label className="block text-lg font-bold mb-2">
                Question 4: Favorite Place to visit?
              </label>
              <br />
              <div className="flex flex-wrap -mx-4">
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans4"
                    value="London"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">London</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans4"
                    value="Paris"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Paris</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans4"
                    value="NewYork"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">NewYork</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans4"
                    value="Chicago"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Chicago</span>
                </div>
              </div>
            </div>

            <div className="max-w-md p-5 bg-white shadow-md mx-auto opacity-100 text-black leading-49">
              <label className="block text-lg font-bold mb-2">
                Question 5: You are?
              </label>
              <br />
              <div className="flex flex-wrap -mx-4">
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans5"
                    value="Student"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Student</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans5"
                    value="Looking_for_Job"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Looking for Job</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans5"
                    value="Employed"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">Employed</span>
                </div>
                <div className="w-1/2 px-4 mb-4">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ans5"
                    value="none"
                    onChange={this.answerSelected}
                  />
                  <span className="text-gray-700">none</span>
                </div>
              </div>
            </div>
            <input
              className="@apply inline-block cursor-pointer mx-2 mb-0 mr-0 px-5 py-3 border-0 font-bold rounded my-2 text-lg text-white bg-gradient-to-b from-orange-400 to-orange-600 shadow-md;"
              type="submit"
              value="submit"
            />
          </form>
        </div>
      );
    } else if (
      this.state.studentName !== "" &&
      this.state.isSubmitted == true
    ) {
      name = (
        <div>
          <h1 className="text-3xl font-bold mb-4">
            Thank You! "{this.state.studentName}" for submitting your answers.
          </h1>
        </div>
      );
    }

    return (
      <div>
        {name}
        ==========================
        {questions}
      </div>
    );
  }
}

export default User;
