import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import to access location state
import './Form.css';

function HeartDiseaseForm() {
   const location = useLocation(); // Hook to access location state
   const extractedData = location.state?.extractedData || {}; // Optional: Get extracted data or set empty object if not provided

   const [form, setForm] = useState({
      age: "",
      sex: "",
      chest_pain_type: "",
      bp: "",
      cholesterol: "",
      fbs: "",
      ekg_results: "",
      max_hr: "",
      exercise_angina: "",
      st_depression: "",
      slope_of_st: "",
      num_vessels: "",
      thallium: ""
   });

   const [loading, setLoading] = useState(false);
   const [result, setResult] = useState("");

   // Populate form fields with extracted data when the component mounts (if data is available)
   useEffect(() => {
      if (Object.keys(extractedData).length > 0) {
         setForm({
            age: extractedData.age || "",
            sex: extractedData.sex === 1 ? "Male" : extractedData.sex === 0 ? "Female" : "", // Convert numeric sex to string
            chest_pain_type: extractedData.chest_pain_type !== undefined ? extractedData.chest_pain_type.toString() : "",
            bp: extractedData.blood_pressure || "",
            cholesterol: extractedData.cholesterol || "",
            fbs: extractedData.fbs !== undefined ? extractedData.fbs.toString() : "",
            ekg_results: extractedData.ekg_results || "",
            max_hr: extractedData.max_heart_rate || "",
            exercise_angina: extractedData.exercise_angina !== undefined ? extractedData.exercise_angina.toString() : "",
            st_depression: extractedData.st_depression || "",
            slope_of_st: extractedData.st_slope !== undefined ? extractedData.st_slope.toString() : "",
            num_vessels: extractedData.vessels || "",
            thallium: extractedData.thallium !== undefined ? extractedData.thallium.toString() : ""
         });
      }
   }, [extractedData]); // Only populate when extractedData changes or is passed

   // Handles form submission and sends the data to the Flask backend as JSON
   const handleSubmit = (event) => {
      event.preventDefault();

      const data = {
         age: parseFloat(form.age),
         sex: form.sex === "Male" ? 1 : 0, // Convert sex to numeric
         chest_pain_type: parseInt(form.chest_pain_type), // Ensure this matches the backend
         bp: parseFloat(form.bp),
         cholesterol: parseFloat(form.cholesterol),
         fbs: parseInt(form.fbs),
         ekg_results: parseInt(form.ekg_results),
         max_hr: parseFloat(form.max_hr),
         exercise_angina: parseInt(form.exercise_angina),
         st_depression: parseFloat(form.st_depression),
         slope_of_st: parseInt(form.slope_of_st),
         num_vessels: parseInt(form.num_vessels),
         thallium: parseInt(form.thallium)
      };

      setLoading(true);

      // Send JSON data to the Flask backend for heart disease prediction
      fetch('http://ec2-18-201-180-167.eu-west-1.compute.amazonaws.com:5000/predict_heart_disease', {
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
         age: "",
         sex: "",
         chest_pain_type: "",
         bp: "",
         cholesterol: "",
         fbs: "",
         ekg_results: "",
         max_hr: "",
         exercise_angina: "",
         st_depression: "",
         slope_of_st: "",
         num_vessels: "",
         thallium: ""
      });

      setResult("");
   };

   return (
      <form onSubmit={handleSubmit}>
         <h4>Heart Disease Prediction Model</h4>
         <p>Enter your medical details to predict the probability of heart disease.</p>

         <input type="number" name="age" value={form.age} onChange={onChange} placeholder="Age" min="0" max="120" required disabled={loading} />

         {/* Ensure the sex matches "Male" or "Female" */}
         <select name="sex" value={form.sex} onChange={onChange} required disabled={loading}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
         </select>

         {/* Ensure chest_pain_type matches the dropdown */}
         <select name="chest_pain_type" value={form.chest_pain_type} onChange={onChange} required disabled={loading}>
            <option value="">Select Chest Pain Type</option>
            <option value="0">Typical Angina</option>
            <option value="1">Atypical Angina</option>
            <option value="2">Non-Anginal Pain</option>
            <option value="3">Asymptomatic</option>
         </select>

         <input type="number" name="bp" value={form.bp} onChange={onChange} placeholder="Blood Pressure" min="0" step="0.1" required disabled={loading} />
         <input type="number" name="cholesterol" value={form.cholesterol} onChange={onChange} placeholder="Cholesterol" min="0" step="0.1" required disabled={loading} />

         {/* Ensure fbs matches "0" or "1" */}
         <select name="fbs" value={form.fbs} onChange={onChange} required disabled={loading}>
            <option value="">Fasting Blood Sugar &gt; 120 mg/dl?</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
         </select>

         <input type="number" name="ekg_results" value={form.ekg_results} onChange={onChange} placeholder="EKG Results" min="0" step="0.1" required disabled={loading} />
         <input type="number" name="max_hr" value={form.max_hr} onChange={onChange} placeholder="Maximum Heart Rate" min="0" required disabled={loading} />

         {/* Ensure exercise_angina matches "0" or "1" */}
         <select name="exercise_angina" value={form.exercise_angina} onChange={onChange} required disabled={loading}>
            <option value="">Exercise-Induced Angina?</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
         </select>

         <input type="number" name="st_depression" value={form.st_depression} onChange={onChange} placeholder="ST Depression" min="0" step="0.1" required disabled={loading} />

         <select name="slope_of_st" value={form.slope_of_st} onChange={onChange} required disabled={loading}>
            <option value="">Slope of ST Segment</option>
            <option value="0">Upsloping</option>
            <option value="1">Flat</option>
            <option value="2">Downsloping</option>
         </select>

         <input type="number" name="num_vessels" value={form.num_vessels} onChange={onChange} placeholder="Number of Major Vessels" min="0" max="4" required disabled={loading} />
         <select name="thallium" value={form.thallium} onChange={onChange} required disabled={loading}>
            <option value="">Select Thallium Stress Test Result</option>
            <option value="0">Normal</option>
            <option value="1">Fixed Defect</option>
            <option value="2">Reversible Defect</option>
         </select>

         <button type="submit" disabled={loading}>{loading ? "Predicting..." : "Submit"}</button>

         {result && <span onClick={handleClear}>Clear Prediction</span>}
         {result && <div className="result">{result}</div>}
      </form>
   );
}

export default HeartDiseaseForm;
