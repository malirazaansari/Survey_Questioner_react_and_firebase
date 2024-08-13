import React, { useState } from "react";
import app from "../../../firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";

export default function Read() {
  let [questionArray, setquestionArray] = useState([]);

  const fetchData = async () => {
    const db = getDatabase(app);
    const quesDB = ref(db, "posts/questions");
    const snapshot = await get(quesDB);
    if (snapshot.exists()) {
      setquestionArray(Object.values(snapshot.val()));
    } else {
      alert("error");
    }
    // const snapshot = await get(ref(db, 'posts/questions'));
    // snapshot.forEach((childSnapshot) => {
    //     const childKey = childSnapshot.key;
    //     const childData = childSnapshot.val();
    //     console.log(childKey, childData);
    // });
  };

  return (
    <div>
      <button onClick={fetchData}>Display Added Questions</button>
      <ul>
        {questionArray.map((item, index) => (
          <li key={index}>
            {item.question1}: {item.question2}: {item.question3}:{" "}
            {item.question4}: {item.question5}
          </li>
        ))}
      </ul>
    </div>
  );
}
