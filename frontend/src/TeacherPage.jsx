import React, { useState, useEffect } from "react";

const TeacherPage = () => {
    // State hooks for managing the words and input fields
    const [words, setWords] = useState([]);                             // Holds the list of word pairs
    const [editWord, setEditWord] = useState(null);                     // Holds the wordpair currently being edited
    const [newFinnishWordAdd, setNewFinnishWordAdd] = useState("");     // Input for new Finnish word (add)
    const [newEnglishWordAdd, setNewEnglishWordAdd] = useState("");     // Input for new English word (add)
    const [newFinnishWordEdit, setNewFinnishWordEdit] = useState("");   // Input for editing Finnish word
    const [newEnglishWordEdit, setNewEnglishWordEdit] = useState("");   // Input for editing English word
    
    // Handle the Edit button click to set the word to edit
    const handleEditClick = (word) => {
      setEditWord(word); // Set the word to be edited
      setNewFinnishWordEdit(word.finnish_word); // Set the Finnish word to the edit input
      setNewEnglishWordEdit(word.english_word); // Set the English word to the edit input
    };

    // Handle updating the word
    const handleUpdateWord = async () => {
      try {
        // Sending PUT request to update the word in the backend
        const response = await fetch(`/api/worddb/${editWord.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            finnish_word: newFinnishWordEdit, // Updated Finnish word
            english_word: newEnglishWordEdit, // Updated English word
          }),
        });
        
        // If the response is not successful, throw an error
        if (!response.ok) {
          throw new Error(`Failed to update word: ${response.statusText}`);
        }

        // Update the word in the state immediately after a successful update
        setWords((prevWords) => //prevWords is the previous words state
          prevWords.map((word) =>
            word.id === editWord.id
              ? { ...word, finnish_word: newFinnishWordEdit, english_word: newEnglishWordEdit }
              : word
          )
        );
        
        /*
        setWords((prevWords) => {
          return prevWords.map((word) => {
            if (word.id === editWord.id) {
              // If the word id matches the one being edited, return a new object with updated values
              const updatedWord = { 
                ...word, 
                finnish_word: newFinnishWordEdit, 
                english_word: newEnglishWordEdit 
              };
              return updatedWord;
            } else {
              // Otherwise, return the word unchanged
              return word;
            }
          });
        });
        */


        // Reset the edit form and clear input fields after update
        setEditWord(null);
        setNewFinnishWordEdit('');
        setNewEnglishWordEdit('');
      } catch (error) {
        console.error('Failed to update word:', error);
      }
    };

    // Handle deleting a word
    const deleteWordpair = async (id) => {
      try {
        // Sending DELETE request to remove the word from the backend
        const response = await fetch(`/api/worddb/${id}`, {
          method: 'DELETE',
        });

        // If the response is not successful, throw an error
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Remove the deleted word from the state
        setWords(words.filter((word) => word.id !== id));
      } catch (error) {
        console.error('Failed to delete word:', error);
      }
    };

    // Handle adding a new wordpair
    const addWord = async () => {
      const apiUrl = `/api/worddb`; // API URL for adding a word
      const newWord = {
        finnish_word: newFinnishWordAdd, // New Finnish word
        english_word: newEnglishWordAdd, // New English word
      };

      try {
        // Sending POST request to add the new word to the backend
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newWord),
        });

        // If the response is not successful, throw an error
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Get the newly added word from the response
        const addedWord = await response.json();

        // Update the words state with the new word
        setWords((prevWords) => [...prevWords, addedWord]);

        // Clear input fields
        setNewFinnishWordAdd("");
        setNewEnglishWordAdd("");
      } catch (error) {
        console.error("Failed to add word:", error);
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

    // Map through all the word pairs in the state to display them in a list
    // &nbsp; is for spacing purposes
    const listItems = words.map((word) => (
      <li style={{
                background: "#f7bd49",
                margin: "60px 0",
                padding: "10px",
                borderRadius: "24px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}key={word.id}>{word.finnish_word}{" - - - - - "}{word.english_word}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {/* Edit button */}
              <button
                onClick={() => handleEditClick(word)} // Trigger the edit function when clicked
                style={{
                  background: '#18a227',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '35px',
                  cursor: 'pointer',
                }}
              >
                Muokkaa
              </button>
              {/* Delete button */}
              <button
                onClick={() => deleteWordpair(word.id)} // Trigger the delete function when clicked
                style={{
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Poista
              </button>
        </li>
    ));


    return (
    <div>
        <h1>Kaikki sanaparit</h1>
        {editWord && ( // If a word is being edited, show the edit form
            <div>
              <h2>Muokkaa Sanaparia</h2>
              <label>
                Suomi sana:
                <input
                  type="text"
                  value={newFinnishWordEdit || ""} // Set the value of the input to the current Finnish word
                  onChange={(e) => setNewFinnishWordEdit(e.target.value)} // Update state on input change
                />
              </label>
              <br />
              <label>
                Englanti sana:
                <input
                  type="text"
                  value={newEnglishWordEdit || ""} // Set the value of the input to the current English word
                  onChange={(e) => setNewEnglishWordEdit(e.target.value)} // Update the state on input change
                />
              </label>
              <br />
              <button onClick={handleUpdateWord}>Päivitä</button> {/* Update button */}
            </div>
          )}
        <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <ul style={{ listStyleType: "none", padding: 0 }}>{listItems}</ul> {/* Display word pairs in a list */}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div>
            <h2>Lisää uusi sanapari</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload on form submission
                addWord();          // Call the addWord function
              }}
            >
              <div>
                <label>
                  Suomi sana:
                  <input
                    type="text"
                    value={newFinnishWordAdd} // Set the value of the input to the Finnish word to add
                    onChange={(e) => setNewFinnishWordAdd(e.target.value)} // Update state on input change
                    required // Make the input required
                  />
                </label>
              </div>
              <div>
                <label>
                  Englanti sana:
                  <input
                    type="text"
                    value={newEnglishWordAdd} // Set the value of the input to the English word to add
                    onChange={(e) => setNewEnglishWordAdd(e.target.value)} // Update state on input change
                    required // Make the input required
                  />
                </label>
              </div>
              <button type="submit">Lisää</button> {/* Submit button */}
            </form>
          </div>
        </div>
      </div>
  )
};

export default TeacherPage;