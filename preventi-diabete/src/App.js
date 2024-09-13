import { useState } from 'react';
import Form from './Form';
import HeartDiseaseForm from './Form2';
import './App.css';

function App() {
    const [showHeartDiseaseForm, setShowHeartDiseaseForm] = useState(false);

    const handleSwitchForm = () => {
        setShowHeartDiseaseForm(!showHeartDiseaseForm);
    };

    return (
        <div className="app">
          <main className="App-main">
            <button onClick={handleSwitchForm}>
                {showHeartDiseaseForm ? 'Switch to Diabetes Form' : 'Switch to Heart Disease Form'}
            </button>
            <div className={`form-container ${showHeartDiseaseForm ? 'slide-left' : 'slide-right'}`}>
                {showHeartDiseaseForm ? <HeartDiseaseForm /> : <Form />}
            </div>
          </main>
        </div>
    );
}

export default App;
