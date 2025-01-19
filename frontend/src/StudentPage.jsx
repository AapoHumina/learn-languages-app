import { useState, useEffect } from 'react'
import React from "react";

const StudentPage = () => {
    const [words, setWords] = useState([]);
    const [inputs, setInputs] = useState({});
    const [score, setScore] = useState(0);

    const handleChange = (id, value) => {
        setInputs((prevInputs) => ({
          ...prevInputs,
          [id]: value,
        }));
      };
      
    // alerting about submitting word and then raising points if right
    const handleSubmit = (id, event) => {
        event.preventDefault();
        alert(`Vastasit kohtaan ${id}: ${inputs[id] || ""}`);
        // Add logic to handle the submitted data, e.g., API call
        const points = getPoints(id);
        setScore((prevScore) => prevScore + points);
      };

    //if inputted word matches word in db, get a point
    const getPoints = (id) => {
        const matchedWords = words.find(w => w.id === id);
        if (inputs[id] == matchedWords.english_word) {
            return 1; // Return the input if it exists
        } else {
            return 0; // Return this if no input exists
        }
    };

    //fetch database of wordpairs from backend
    useEffect(() => {
      const apiUrl = `/api/worddb`;
        fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => setWords(data))
        .catch((error) => console.log(error))
    }, []);

    //variable for mapping out all the finnish words in db
    const listItemsFinnish = words.map((word) => (
      <li style={{
                background: "#f7bd49",
                margin: "60px 0",
                padding: "10px",
                borderRadius: "24px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}key={word.id}>{word.finnish_word}</li>
    ));

    //variable for mapping out forms in db
    const listItemsEnglish = words.map((word) => (
      <li key={word.id}
              style={{
                background: "#f7bd49",
                margin: "30px 0",
                padding: "10px",
                borderRadius: "24px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
          >
          <form onSubmit={(e) => handleSubmit(word.id, e)}>
                <label>
                  Anna sana Englanniksi:
                  <input
                    type="text"
                    value={inputs[word.id] || ""}
                    onChange={(e) => handleChange(word.id, e.target.value)}
                  />
                </label>
                <input type="submit" value="Vastaa" />
              </form>
          </li>
    ));

    return (
    <div>
      <h1>Kielien opiskelua</h1>
      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h2>Suomi sanat</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>{listItemsFinnish}</ul>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Englanti sanat</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>{listItemsEnglish}</ul>
        </div>
      </div>
      <h1>Pisteet {score}</h1>
      <button type="button" onClick={() => setScore(0)}>Nolla pisteet:</button>
    </div>
    );
  };

export default StudentPage;