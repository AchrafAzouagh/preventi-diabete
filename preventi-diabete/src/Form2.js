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
         <h4>Modèle de Prédiction des Maladies Cardiaques</h4>
         <p>Entrez vos détails médicaux pour prédire la probabilité de maladie cardiaque.</p>
   
         <input type="number" name="age" value={form.age} onChange={onChange} placeholder="Âge" min="0" max="120" required disabled={loading} />
   
         {/* Assurez-vous que le sexe correspond à "Homme" ou "Femme" */}
         <select name="sex" value={form.sex} onChange={onChange} required disabled={loading}>
            <option value="">Sélectionner le Genre</option>
            <option value="Male">Homme</option>
            <option value="Female">Femme</option>
         </select>
   
         {/* Assurez-vous que le type de douleur thoracique correspond au menu déroulant */}
         <select name="chest_pain_type" value={form.chest_pain_type} onChange={onChange} required disabled={loading}>
            <option value="">Sélectionner le Type de Douleur Thoracique</option>
            <option value="0">Angine Typique</option>
            <option value="1">Angine Atypique</option>
            <option value="2">Douleur Non-Anginale</option>
            <option value="3">Asymptomatique</option>
         </select>
   
         <input type="number" name="bp" value={form.bp} onChange={onChange} placeholder="Pression Artérielle" min="0" step="0.1" required disabled={loading} />
         <input type="number" name="cholesterol" value={form.cholesterol} onChange={onChange} placeholder="Cholestérol" min="0" step="0.1" required disabled={loading} />
   
         {/* Assurez-vous que fbs correspond à "0" ou "1" */}
         <select name="fbs" value={form.fbs} onChange={onChange} required disabled={loading}>
            <option value="">Sucre Sanguin à Jeun &gt; 120 mg/dl?</option>
            <option value="0">Non</option>
            <option value="1">Oui</option>
         </select>
   
         <input type="number" name="ekg_results" value={form.ekg_results} onChange={onChange} placeholder="Résultats EKG" min="0" step="0.1" required disabled={loading} />
         <input type="number" name="max_hr" value={form.max_hr} onChange={onChange} placeholder="Fréquence Cardiaque Maximale" min="0" required disabled={loading} />
   
         {/* Assurez-vous que exercise_angina correspond à "0" ou "1" */}
         <select name="exercise_angina" value={form.exercise_angina} onChange={onChange} required disabled={loading}>
            <option value="">Angine Induite par l'Exercice?</option>
            <option value="0">Non</option>
            <option value="1">Oui</option>
         </select>
   
         <input type="number" name="st_depression" value={form.st_depression} onChange={onChange} placeholder="Dépression ST" min="0" step="0.1" required disabled={loading} />
   
         <select name="slope_of_st" value={form.slope_of_st} onChange={onChange} required disabled={loading}>
            <option value="">Pente du Segment ST</option>
            <option value="0">Montante</option>
            <option value="1">Plate</option>
            <option value="2">Descendante</option>
         </select>
   
         <input type="number" name="num_vessels" value={form.num_vessels} onChange={onChange} placeholder="Nombre de Vaisseaux Principaux" min="0" max="4" required disabled={loading} />
         <select name="thallium" value={form.thallium} onChange={onChange} required disabled={loading}>
            <option value="">Sélectionner le Résultat du Test de Stress au Thallium</option>
            <option value="0">Normal</option>
            <option value="1">Défaut Fixe</option>
            <option value="2">Défaut Réversible</option>
         </select>
   
         <button type="submit" disabled={loading}>{loading ? "Prédiction en cours..." : "Soumettre"}</button>
   
         {result && <span onClick={handleClear}>Effacer la Prédiction</span>}
         {result && <div className="result">{result}</div>}
      </form>
   );   
}

export default HeartDiseaseForm;
