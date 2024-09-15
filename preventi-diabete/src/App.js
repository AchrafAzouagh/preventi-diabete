import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Form from './Form'; // Diabetes Form
import HeartDiseaseForm from './Form2'; // Heart Disease Form
import ImageUpload from './ImageUpload';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul className="navbar-list">
            <li className="navbar-item"><Link to="/upload" className="navbar-link">Chargement d'Image</Link></li>
            <li className="navbar-item"><Link to="/form" className="navbar-link">Formulaire Diabète</Link></li>
            <li className="navbar-item"><Link to="/form2" className="navbar-link">Formulaire Maladie Cardiaque</Link></li>
          </ul>
        </nav>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<ImageUpload />} />
            <Route path="/upload" element={<ImageUpload />} />
            <Route path="/form" element={<Form />} />
            <Route path="/form2" element={<HeartDiseaseForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
