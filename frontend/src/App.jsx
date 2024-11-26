import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

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
  .catch((err) => setError(err.message));
}, []);

  return (
    <div>
      <h1>Locations</h1>
      <ul>
        {locations.map((location) => (
          <li key={location.id}>{location.latitude} {location.longitude}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
