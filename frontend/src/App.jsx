import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StudentPage from "./StudentPage"; 
import TeacherPage from "./TeacherPage"; 

function App() {

  return (
    <div>
      <Router>
        <nav style={navStyle}>
          <ul style={navListStyle}>
            <li style={navItemStyle}>
              <Link to="/" style={linkStyle}>Sanaopiskelu sivu</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/second" style={linkStyle}>Opettajan sivu</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<StudentPage />} />
          <Route path="/second" element={<TeacherPage />} />
        </Routes>
      </Router>
    </div>
  );
};

// CSS-in-JS tyylit
const navStyle = {
  backgroundColor: '#333',
  padding: '10px 20px',
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 1000,
};

const navListStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: 0,
  margin: 0,
  listStyleType: 'none',
};

const navItemStyle = {
  margin: '0 20px',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: 'bold',
};


export default App
