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
        setResult(<h4>Data extracted successfully. You can now go to the forms.</h4>);
        setExtractedData(data); // Store extracted data
      } else if (data.error) {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(<h4>An error occurred. Please try again.</h4>);
    }
  };

  // Pass extracted data when navigating to the forms
  const goToDiabetesForm = () => navigate('/form', { state: { extractedData } });
  const goToHeartDiseaseForm = () => navigate('/form2', { state: { extractedData } });

  return (
    <div>
      <h4>Upload a report image to Extract Form Data</h4>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*,.pdf" onChange={handleImageChange} required />
        <button type="submit">Upload</button>
      </form>

      {result && <div>{result}</div>}

      {/* Only show buttons after data extraction */}
      {extractedData && (
        <form>
          <div>
            <button onClick={goToDiabetesForm}>Go to Diabetes Form</button>
            <button onClick={goToHeartDiseaseForm}>Go to Heart Disease Form</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ImageUpload;
