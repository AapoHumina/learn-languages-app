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
      
    const handleSubmit = (id, event) => {
        event.preventDefault();
        alert(`Submitted for word ID ${id}: ${inputs[id] || ""}`);
        // Add logic to handle the submitted data, e.g., API call
        const points = getPoints(id);
        setScore((prevScore) => prevScore + points);
      };

    const getPoints = (id) => {
        const matchedWords = words.find(w => w.id === id);
        if (inputs[id] == matchedWords.english_word) {
            return 1; // Return the input if it exists
        } else {
            return 0; // Return this if no input exists
        }
    };

    
    //The fetch() method starts the process of fetching a resource from a server.
    //The fetch() method returns a Promise that resolves to a Response object.
    useEffect(() => {
      const apiUrl = `/api/worddb`;
      fetch(apiUrl)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`Error: ${response.statusText}`);
          }
          return response.json();
      })
      .then((data) => setWords(data))
    }, []);

    return (
    <div>
      <h1>Sanat</h1> 
      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
       <div style={{ flex: 1 }}>
        <h2>Ensimmäinen sana lista</h2>
       <ul style={{ listStyleType: "none", padding: 0 }}>
        {words.map((word) => (
          <li key={word.id}
              style={{
                background: "#f7bd49",
                margin: "60px 0",
                padding: "10px",
                borderRadius: "24px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
          >
           {word.finnish_word}
          </li>
        ))}
      </ul>
      </div>
      <div style={{ flex: 1 }}>
      <h3>Toinen sana lista</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {words.map((word) => (
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
                <inputs type="submit" value="Submit" />
              </form>
          </li>
        ))}
      </ul>
      </div>
      </div>
      <h1>Pisteet {score}</h1> 
      <div>
        <h2>Entered Inputs:</h2>
        <ul>
          {words.map((word) => (
            <li key={word.id}>
              {word.finnish_word} - {inputs[word.id] || 'No input yet' } {" ------"}
              {getPoints(word.id) === 1 ? "Correct" : "Incorrect"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentPage;