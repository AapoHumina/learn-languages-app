import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [words, setWords] = useState([]);
  const [inputs, setInputs] = useState({});

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
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
       <div>
        <h2>Ensimmäinen sana lista</h2>
       <ul style={{ listStyleType: "none", padding: 0 }}>
        {words.map((word) => (
          <li key={word.id}
              style={{
                background: "#f7bd49",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
          >
          Suomi: {word.finnish_word}
          </li>
        ))}
      </ul>
      </div>
      <div>
      <h3>Toinen sana lista</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {words.map((word) => (
          <li key={word.id}
              style={{
                background: "#f7bd49",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "8px",
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
                <input type="submit" value="Submit" />
              </form>
          </li>
        ))}
      </ul>
      </div>
      </div>
    </div>
  )
}

export default App

// D: {word.id} Suomi sana: {word.finnish_word} Englanti sana: {word.english_word}