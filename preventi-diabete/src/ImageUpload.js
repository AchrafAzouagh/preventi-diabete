import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [extractedData, setExtractedData] = useState(null); // Store extracted data
  const navigate = useNavigate(); // React Router hook for navigation

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://ec2-18-201-180-167.eu-west-1.compute.amazonaws.com:5000/extract_from_image', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (Object.keys(data).length > 0) {
        setResult(<h4>Les données ont été extraites avec succès. Vous pouvez maintenant accéder aux formulaires.</h4>);
        setExtractedData(data); // Store extracted data
      } else if (data.error) {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(<h4>Une erreur est survenue. Veuillez réessayer.</h4>);
    }
  };

  // Pass extracted data when navigating to the forms
  const goToDiabetesForm = () => navigate('/form', { state: { extractedData } });
  const goToHeartDiseaseForm = () => navigate('/form2', { state: { extractedData } });

  return (
    <div className="container">
      <h4>Charger une image ou un fichier pdf du rapport pour extraire les données</h4>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*,.pdf" onChange={handleImageChange} required />
        <button type="submit">Charger</button>
      </form>

      {result && <div>{result}</div>}

      {/* Only show buttons after data extraction */}
      {extractedData && (
        <form>
          <div>
            <button onClick={goToDiabetesForm}>Accéder au formulaire du diabète</button>
            <button onClick={goToHeartDiseaseForm}>Accéder au formulaire des maladies cardiovasculaires</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ImageUpload;
