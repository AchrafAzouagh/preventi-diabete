import { useState } from 'react';
import './Form.css';

function Form() {
   const [form, setForm] = useState({
      pregnancies: "",
      glucose: "",
      blood_presure: "",
      skin_thickness: "",
      insulin_level: "",
      bmi: "",
      diabetes_pedigree: "",
      age: ""
   });

   const [loading, setLoading] = useState(false);
   const [result, setResult] = useState("");

   // Handles form submission and sends the data to the Flask backend as JSON
   const handleSubmit = (event) => {
      event.preventDefault();

      // Prepare the JSON data
      const data = {
         1: form.pregnancies,
         2: form.glucose,
         3: form.blood_presure,
         4: form.skin_thickness,
         5: form.insulin_level,
         6: form.bmi,
         7: form.diabetes_pedigree,
         8: form.age
      };

      setLoading(true);

      // Send JSON data to the Flask backend
      fetch('http://ec2-108-129-87-235.eu-west-1.compute.amazonaws.com:5000/predict', {
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
         pregnancies: "",
         glucose: "",
         blood_presure: "",
         skin_thickness: "",
         insulin_level: "",
         bmi: "",
         diabetes_pedigree: "",
         age: ""
      });

      setResult("");
   };

   return (
      <form onSubmit={handleSubmit}>
         <h4>Diabetes Prediction Model</h4>
         <p>Enter your medical details to predict the probability of diabetes.</p>

         <input type="number" name="pregnancies" value={form.pregnancies} onChange={onChange} placeholder="Number of Pregnancies" required disabled={loading} />
         <input type="number" name="glucose" value={form.glucose} onChange={onChange} placeholder="Glucose Level" required disabled={loading} />
         <input type="number" name="blood_presure" value={form.blood_presure} onChange={onChange} placeholder="Blood Pressure" required disabled={loading} />
         <input type="number" name="skin_thickness" value={form.skin_thickness} onChange={onChange} placeholder="Skin Thickness" required disabled={loading} />
         <input type="number" name="insulin_level" value={form.insulin_level} onChange={onChange} placeholder="Insulin Level" required disabled={loading} />
         <input type="number" name="bmi" value={form.bmi} onChange={onChange} placeholder="Body Mass Index (BMI)" required disabled={loading} />
         <input type="number" name="diabetes_pedigree" value={form.diabetes_pedigree} onChange={onChange} placeholder="Diabetes Pedigree Function" required disabled={loading} />
         <input type="number" name="age" value={form.age} onChange={onChange} placeholder="Age" required disabled={loading} />

         <button type="submit" disabled={loading}>{loading ? "Predicting..." : "Submit"}</button>

         {result && <span onClick={handleClear}>Clear Prediction</span>}
         {result && <div className="result">{result}</div>}
      </form>
   );
}

export default Form;
