import React, { Component } from "react";
import app from "../../firebase/firebase";
import firebase from "firebase/compat/app";
var uuid = require("uuid");

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
      .ref("studentSurway/" + this.state.uid)
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
        <div>
          <h1>Hey! Please enter Your name.</h1>
          <form onSubmit={this.studentNameSubmit}>
            <input
              className="sname"
              type="text"
              placeholder="Enter your name"
              ref={(input) => (this.nameInput = input)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    } else if (
      this.state.studentName !== "" &&
      this.state.isSubmitted == false
    ) {
      name = (
        <div>
          <h1>Welcome {this.state.studentName} to our surway</h1>
        </div>
      );
      questions = (
        <div>
          <h1>Here are some quetions.</h1>
          <form onSubmit={this.surveySubmit}>
            <div className="card">
              <label>What do you like Most?</label>
              <br />
              <input
                type="radio"
                name="ans1"
                value="sports"
                onChange={this.answerSelected}
              />
              sports
              <input
                type="radio"
                name="ans1"
                value="Technology"
                onChange={this.answerSelected}
              />
              Tachnology
              <input
                type="radio"
                name="ans1"
                value="Movies"
                onChange={this.answerSelected}
              />
              Movies
              <input
                type="radio"
                name="ans1"
                value="Study"
                onChange={this.answerSelected}
              />
              Study
            </div>

            <div className="card">
              <label>Which Programming Language to you like Most?</label>
              <br />
              <input
                type="radio"
                name="ans2"
                value="JavaScript"
                onChange={this.answerSelected}
              />
              JavaScript
              <input
                type="radio"
                name="ans2"
                value="Dotnet"
                onChange={this.answerSelected}
              />
              Dotnet
              <input
                type="radio"
                name="ans2"
                value="Python"
                onChange={this.answerSelected}
              />
              Python
              <input
                type="radio"
                name="ans2"
                value="Dart"
                onChange={this.answerSelected}
              />
              Dart
            </div>

            <div className="card">
              <label>Which sports do you play?</label>
              <br />
              <input
                type="radio"
                name="ans3"
                value="Cricket"
                onChange={this.answerSelected}
              />
              Cricket
              <input
                type="radio"
                name="ans3"
                value="Football"
                onChange={this.answerSelected}
              />
              Football
              <input
                type="radio"
                name="ans3"
                value="Bedminton"
                onChange={this.answerSelected}
              />
              Bedminton
              <input
                type="radio"
                name="ans3"
                value="Table_Tennis"
                onChange={this.answerSelected}
              />
              Table_Tennis
            </div>

            <div className="card">
              <label>Favorite Place to visit?</label>
              <br />
              <input
                type="radio"
                name="ans4"
                value="London"
                onChange={this.answerSelected}
              />
              London
              <input
                type="radio"
                name="ans4"
                value="Paris"
                onChange={this.answerSelected}
              />
              Paris
              <input
                type="radio"
                name="ans4"
                value="NewYork"
                onChange={this.answerSelected}
              />
              NewYork
              <input
                type="radio"
                name="ans4"
                value="Chicago"
                onChange={this.answerSelected}
              />
              Chicago
            </div>

            <div className="card">
              <label>YOu are?</label>
              <br />
              <input
                type="radio"
                name="ans5"
                value="Student"
                onChange={this.answerSelected}
              />
              Student
              <input
                type="radio"
                name="ans5"
                value="Looking_for_Job"
                onChange={this.answerSelected}
              />
              Looking for Job
              <input
                type="radio"
                name="ans5"
                value="Employed"
                onChange={this.answerSelected}
              />
              Employed
              <input
                type="radio"
                name="ans5"
                value="none"
                onChange={this.answerSelected}
              />
              none
            </div>
            <input className="feedback-button" type="submit" value="submit" />
          </form>
        </div>
      );
    } else if (
      this.state.studentName !== "" &&
      this.state.isSubmitted == true
    ) {
      name = (
        <div>
          <h1>
            Thank You! "{this.state.studentName}" for submitting your answers.
          </h1>
        </div>
      );
    }

    return (
      <div>
        {name}
        ===================
        {questions}
      </div>
    );
  }
}

export default User;
