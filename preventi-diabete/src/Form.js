import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import to access location state
import './Form.css';

function Form() {
   const location = useLocation(); // Hook to access location state
   const extractedData = location.state?.extractedData || {}; // Optional: Get extracted data or set an empty object if not provided

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

   // Populate form fields with extracted data when component mounts (if data is available)
   useEffect(() => {
      if (Object.keys(extractedData).length > 0) {
         setForm({
            gender: extractedData.gender || "",
            age: extractedData.age || "",
            hypertension: extractedData.hypertension || "",
            heart_disease: extractedData.heart_disease || "",
            smoking_history: extractedData.smoking_history || "",
            bmi: extractedData.bmi || "",
            HbA1c_level: extractedData.HbA1c_level || "",
            blood_glucose_level: extractedData.blood_glucose_level || ""
         });
      }
   }, [extractedData]); // Only populate when extractedData changes or is passed

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
      fetch('http://ec2-18-201-180-167.eu-west-1.compute.amazonaws.com/predict_diabetes', {
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
         <h4>Modèle de Prédiction du Diabète</h4>
         <p>Entrez vos détails médicaux pour prédire la probabilité de diabète.</p>
   
         <select name="gender" value={form.gender} onChange={onChange} required disabled={loading}>
            <option value="">Sélectionner le Genre</option>
            <option value="Male">Homme</option>
            <option value="Female">Femme</option>
         </select>
   
         <input type="number" name="age" value={form.age} onChange={onChange} placeholder="Âge" min="0" max="120" required disabled={loading} />
   
         <select name="hypertension" value={form.hypertension} onChange={onChange} required disabled={loading}>
            <option value="">Sélectionner Hypertension</option>
            <option value="0">Non</option>
            <option value="1">Oui</option>
         </select>
   
         <select name="heart_disease" value={form.heart_disease} onChange={onChange} required disabled={loading}>
            <option value="">Sélectionner Maladie Cardiaque</option>
            <option value="0">Non</option>
            <option value="1">Oui</option>
         </select>
   
         <select name="smoking_history" value={form.smoking_history} onChange={onChange} required disabled={loading}>
            <option value="">Sélectionner l'Historique de Tabagisme</option>
            <option value="never">Jamais</option>
            <option value="former">Ancien</option>
            <option value="current">Actuel</option>
            <option value="not current">Non Actuel</option>
            <option value="ever">Un jour</option>
            <option value="No Info">Pas d'Information</option>
         </select>
   
         <input type="number" name="bmi" value={form.bmi} onChange={onChange} placeholder="Indice de Masse Corporelle (IMC)" min="0" step="0.1" required disabled={loading} />
         <input type="number" name="HbA1c_level" value={form.HbA1c_level} onChange={onChange} placeholder="Niveau HbA1c" min="0" step="0.1" required disabled={loading} />
         <input type="number" name="blood_glucose_level" value={form.blood_glucose_level} onChange={onChange} placeholder="Niveau de Glucose Sanguin" min="0" step="1" required disabled={loading} />
   
         <button type="submit" disabled={loading}>{loading ? "Prédiction en cours..." : "Soumettre"}</button>
   
         {result && <span onClick={handleClear}>Effacer la Prédiction</span>}
         {result && <div className="result">{result}</div>}
      </form>
   );   
}

export default Form;
