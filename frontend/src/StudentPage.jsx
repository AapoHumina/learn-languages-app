import { useState, useEffect } from 'react'
import React from "react";

const StudentPage = () => {
    const [words, setWords] = useState([]);   // State to store the list of word pairs
    const [inputs, setInputs] = useState({}); // State for storing student inputs
    const [score, setScore] = useState(0);    // State for storing score

    // Update input value for each word
    const handleChange = (id, value) => {
        setInputs((prevInputs) => ({
          ...prevInputs,
          [id]: value, // Update the input value for the specific word pair
        }));
      };
      
    // Alerting about submitting word and then raising points if right
    const handleSubmit = (id, event) => {
        event.preventDefault(); // Prevent page reload on form submission
        alert(`Vastasit kohtaan ${id}: ${inputs[id] || ""}`); // Alert with the input value
        const points = getPoints(id); // Get points based on the input
        setScore((prevScore) => prevScore + points); // Update the score
      };

    // Check if the input matches the correct English word
    const getPoints = (id) => {
        const matchedWords = words.find(w => w.id === id);  // Find the word pair by id
        if (inputs[id] == matchedWords.english_word) {      // Check if the input matches the correct word
            return 1; // Correct answer 
        } else {
            return 0; // Incorrect answer
        }
    };

    // fetch the database of word pairs from the backend 
    useEffect(() => {
      const apiUrl = `/api/worddb`; // API URL to fetch words
        fetch(apiUrl)
        .then((response) => response.json())  // Parse the JSON response
        .then((data) => setWords(data))       // Set the fetched words into state
        .catch((error) => console.log(error)) // Log error if fetching fails
    }, []);

    // Map through the word pairs and create a list of Finnish words
    const listItemsFinnish = words.map((word) => (
      <li style={{
                background: "#f7bd49",
                margin: "60px 0",
                padding: "10px",
                borderRadius: "24px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}key={word.id}>{word.finnish_word}</li>
    ));

    // Map through the word pairs and create a list of forms for English answers
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
                    value={inputs[word.id] || ""} // Display the current input value for the word pair
                    onChange={(e) => handleChange(word.id, e.target.value)} // Update the input value
                  />
                </label>
                <input type="submit" value="Vastaa" />
              </form>
          </li>
    ));

    return (
    <div>
      <h1>Kielien opiskelua</h1>

      {/* Display Finnish words */}
      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h2>Suomi sanat</h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>{listItemsFinnish}</ul>
        </div>

        {/* Display English word input forms */}
      <div style={{ flex: 1 }}>
        <h2>Englanti sanat</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>{listItemsEnglish}</ul>
      </div>
      </div>

      {/* Display score */}
      <h1>Pisteet {score}</h1>

      {/* Button to reset score */}
      <button type="button" onClick={() => setScore(0)}>Nollaa pisteet</button>
    </div>
    );
  };

export default StudentPage;