import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [locations, setLocations] = useState([]);

//The fetch() method starts the process of fetching a resource from a server.
//The fetch() method returns a Promise that resolves to a Response object.
useEffect(() => {
  const apiUrl = `/api/locations`;
  fetch(apiUrl)
  .then((response) => {
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
  })
  .then((data) => setLocations(data))
}, []);

  return (
    <div>
      <h1>Locations</h1>
       <ul style={{ listStyleType: "none", padding: 0 }}>
        {locations.map((location) => (
          <li key={location.id}
              style={{
                background: "#f7bd49",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
          >
          ID: {location.id}, Latitude: {location.latitude}, Longitude: {location.longitude}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
