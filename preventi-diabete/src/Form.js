import { useState } from 'react';
import './Form.css';

function Form() {
   const [form, setForm] = useState({
      gender: "",
      age: "",
      hypertension: "",
      heart_disease: "",
      smoking_history: "",
      bmi: "",
      HbA1c_level: "",
      blood_glucose_level: ""
   });

   const [loading, setLoading] = useState(false);
   const [result, setResult] = useState("");

   // Handles form submission and sends the data to the Flask backend as JSON
   const handleSubmit = (event) => {
      event.preventDefault();

      // Prepare the JSON data
      const data = {
         gender: form.gender,
         age: form.age,
         hypertension: form.hypertension,
         heart_disease: form.heart_disease,
         smoking_history: form.smoking_history,
         bmi: form.bmi,
         HbA1c_level: form.HbA1c_level,
         blood_glucose_level: form.blood_glucose_level
      };

      setLoading(true);

      // Send JSON data to the Flask backend
      fetch('http://localhost:5000/predict_diabetes', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data)
      })      
      .then(response => response.json())
      .then(data => {
         if (data.prediction) {
            setResult(data.prediction);
         } else if (data.error) {
            setResult(`Error: ${data.error}`);
         }
         setLoading(false);
      })
      .catch(error => {
         setResult('An error occurred. Please try again.');
         setLoading(false);
      });
   };

   // Handles input changes
   const onChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setForm({ ...form, [name]: value });
   };

   // Clears the form and result
   const handleClear = () => {
      setForm({
         gender: "",
         age: "",
         hypertension: "",
         heart_disease: "",
         smoking_history: "",
         bmi: "",
         HbA1c_level: "",
         blood_glucose_level: ""
      });

      setResult("");
   };

   return (
      <form onSubmit={handleSubmit}>
         <h4>Diabetes Prediction Model</h4>
         <p>Enter your medical details to predict the probability of diabetes.</p>

         <select name="gender" value={form.gender} onChange={onChange} required disabled={loading}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
         </select>

         <input type="number" name="age" value={form.age} onChange={onChange} placeholder="Age" min="0" max="120" required disabled={loading} />

         <select name="hypertension" value={form.hypertension} onChange={onChange} required disabled={loading}>
            <option value="">Select Hypertension</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
         </select>

         <select name="heart_disease" value={form.heart_disease} onChange={onChange} required disabled={loading}>
            <option value="">Select Heart Disease</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
         </select>

         <select name="smoking_history" value={form.smoking_history} onChange={onChange} required disabled={loading}>
            <option value="">Select Smoking History</option>
            <option value="never">Never</option>
            <option value="former">Former</option>
            <option value="current">Current</option>
            <option value="not current">Not Current</option>
            <option value="ever">Ever</option>
            <option value="No Info">No Info</option>
         </select>

         <input type="number" name="bmi" value={form.bmi} onChange={onChange} placeholder="Body Mass Index (BMI)" min="0" step="0.1" required disabled={loading} />
         <input type="number" name="HbA1c_level" value={form.HbA1c_level} onChange={onChange} placeholder="HbA1c Level" min="0" step="0.1" required disabled={loading} />
         <input type="number" name="blood_glucose_level" value={form.blood_glucose_level} onChange={onChange} placeholder="Blood Glucose Level" min="0" step="1" required disabled={loading} />

         <button type="submit" disabled={loading}>{loading ? "Predicting..." : "Submit"}</button>

         {result && <span onClick={handleClear}>Clear Prediction</span>}
         {result && <div className="result">{result}</div>}
      </form>
   );
}

export default Form;
