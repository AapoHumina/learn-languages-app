import React, { useState, useEffect } from "react";

const TeacherPage = () => {
    const [words, setWords] = useState([]);
    const [editWord, setEditWord] = useState(null);
    const [newFinnishWordAdd, setNewFinnishWordAdd] = useState("");
    const [newEnglishWordAdd, setNewEnglishWordAdd] = useState("");
    const [newFinnishWordEdit, setNewFinnishWordEdit] = useState("");  
    const [newEnglishWordEdit, setNewEnglishWordEdit] = useState("");
    
    // Handle the Edit button click to set the word to edit
    const handleEditClick = (word) => {
      setEditWord(word);
      setNewFinnishWordEdit(word.finnish_word);
      setNewEnglishWordEdit(word.english_word);
    };

    // Handle updating the word
    const handleUpdateWord = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/worddb/${editWord}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            finnish_word: newFinnishWordEdit,
            english_word: newEnglishWordEdit,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update word: ${response.statusText}`);
        }

        // Update the word in the state immediately after a successful update
        setWords((prevWords) =>
          prevWords.map((word) =>
            word.id === editWord.id
              ? { ...word, finnish_word: newFinnishWordEdit, english_word: newEnglishWordEdit }
              : word
          )
        );

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
        const response = await fetch(`http://localhost:3000/api/worddb/${id}`, {
          method: 'DELETE',
        });

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
      const apiUrl = `/api/worddb`; 
      const newWord = {
        finnish_word: newFinnishWordAdd,
        english_word: newEnglishWordAdd,
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newWord),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

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
    
    //fetch database of wordpairs from backend
    useEffect(() => {
      const apiUrl = `/api/worddb`;
        fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => setWords(data))
        .catch((error) => console.log(error))
    }, []);

    //variable for mapping out all the wordpairs in db
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
              <button
                onClick={() => handleEditClick(word)}
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
              <button
                onClick={() => deleteWordpair(word.id)}
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
        {editWord && (
            <div>
              <h2>Muokkaa Sanaparia</h2>
              <label>
                Suomi sana:
                <input
                  type="text"
                  value={newFinnishWordEdit || ""}
                  onChange={(e) => setNewFinnishWordEdit(e.target.value)}
                />
              </label>
              <br />
              <label>
                Englanti sana:
                <input
                  type="text"
                  value={newEnglishWordEdit || ""}
                  onChange={(e) => setNewEnglishWordEdit(e.target.value)}
                />
              </label>
              <br />
              <button onClick={handleUpdateWord}>Päivitä</button>
            </div>
          )}
        <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <ul style={{ listStyleType: "none", padding: 0 }}>{listItems}</ul>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div>
            <h2>Lisää uusi sanapari</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addWord();
              }}
            >
              <div>
                <label>
                  Suomi sana:
                  <input
                    type="text"
                    value={newFinnishWordAdd}
                    onChange={(e) => setNewFinnishWordAdd(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Englanti sana:
                  <input
                    type="text"
                    value={newEnglishWordAdd}
                    onChange={(e) => setNewEnglishWordAdd(e.target.value)}
                    required
                  />
                </label>
              </div>
              <button type="submit">Lisää</button>
            </form>
          </div>
        </div>
      </div>
  )
};

export default TeacherPage;