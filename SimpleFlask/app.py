from flask import Flask, request, jsonify
import pandas as pd
import pickle
import numpy as np
from flask_cors import CORS # type: ignore
import Image
import pytesseract
import os
import re
import fitz  # PyMuPDF

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

# Load models and preprocessors
general_model = pickle.load(open("diabetes/diabetes_model.pkl", "rb"))
heart_disease_model = pickle.load(open("heartdisease/heart_disease_model.pkl", "rb"))

# Load preprocessors for diabetes model 
scaler = pickle.load(open("diabetes/scaler.pkl", "rb"))
gender_encoder = pickle.load(open("diabetes/gender_encoder.pkl", "rb"))
smoking_history_encoder = pickle.load(open("diabetes/smoking_history_encoder.pkl", "rb"))

# Load preprocessors for heart disease model
heart_disease_scaler = pickle.load(open("heartdisease/heart_disease_scaler.pkl", "rb"))

# Load label encoders for heart disease model
sex_encoder = pickle.load(open("heartdisease/se.pkl", "rb"))
chest_pain_encoder = pickle.load(open("heartdisease/chest_pain_encoder.pkl", "rb"))
exercise_angina_encoder = pickle.load(open("heartdisease/exercise_angina_encoder.pkl", "rb"))
slope_of_st_encoder = pickle.load(open("heartdisease/slope_of_st_encoder.pkl", "rb"))
thallium_encoder = pickle.load(open("heartdisease/thallium_encoder.pkl", "rb"))

@app.route('/')
def index():
    return app.send_static_file('index.html')

# Example function to parse the medical data
def parse_medical_data(text):
    parsed_data = {}
    # This pattern will match any value between ":" and ";"
    pattern = r":\s*([^;]+);"
    matches = re.findall(pattern, text)
    
    # List of feature names (assuming order matches the values in text)
    feature_names = [
        'blood_pressure', 'cholesterol', 'fbs', 'ekg_results',
        'max_heart_rate', 'exercise_angina', 'st_depression', 'st_slope',
        'vessels', 'thallium', 'hypertension', 'bmi', 'HbA1c_level', 'blood_glucose_level'
    ]
    
    for i, value in enumerate(matches):
        if i < len(feature_names):
            parsed_data[feature_names[i]] = value.strip()
    
    return parsed_data

@app.route('/extract_from_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"})

    if file:
        # Define the upload folder path
        upload_folder = 'uploads'

        # Check if the directory exists, if not, create it
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        # Create the file path
        filepath = os.path.join(upload_folder, file.filename)

        # Save the file to the uploads directory
        file.save(filepath)

        # Check if the file is a PDF or an image
        if file.filename.lower().endswith('.pdf'):
            # Handle PDF file using PyMuPDF (fitz)
            text = extract_text_from_pdf(filepath)
        else:
            # Handle image file using Pillow and pytesseract
            text = extract_text_from_image(filepath)

        # Parse the text to extract medical data
        parsed_data = parse_medical_data(text)

        # Return the parsed data as a JSON response
        return jsonify(parsed_data)


def extract_text_from_image(image_path):
    """
    Extract text from an image using pytesseract.
    """
    img = Image.open(image_path)
    return pytesseract.image_to_string(img)


def extract_text_from_pdf(pdf_path):
    """
    Extract text from a PDF file using PyMuPDF (fitz).
    """
    text = ""
    pdf_document = fitz.open(pdf_path)  # Open the PDF document

    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)  # Load each page
        text += page.get_text("text")  # Extract text from the page

    pdf_document.close()
    return text

@app.route('/predict_diabetes', methods=['POST'])
def predict_diabetes():
    try:
        data = request.json

        # Extract and preprocess the features
        gender = gender_encoder.transform([data['gender']])
        age = float(data['age'])
        hypertension = int(data['hypertension'])
        heart_disease = int(data['heart_disease'])
        smoking_history = smoking_history_encoder.transform([data['smoking_history']])
        bmi = float(data['bmi'])
        HbA1c_level = float(data['HbA1c_level'])
        blood_glucose_level = float(data['blood_glucose_level'])

        # Prepare the features as an array
        features = pd.DataFrame([pd.Series([gender, age, hypertension, heart_disease, smoking_history, bmi, HbA1c_level, blood_glucose_level])])

        # Scale the features
        features_scaled = scaler.transform(features)

        # Predict using the model
        diabetes_prediction = general_model.predict_proba(features_scaled)
        probability = '{0:.{1}f}'.format(diabetes_prediction[0][1], 2)
        probability_percentage = float(probability) * 100

        # Prepare the response message
        if probability_percentage > 50:
            message = f'You have a {probability_percentage:.2f}% chance of having diabetes based on our model.'
        else:
            message = f'You have a {probability_percentage:.2f}% chance of having diabetes. This is considered low but consult a doctor for medical advice.'

        return jsonify({
            'prediction': message
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

@app.route('/predict_heart_disease', methods=['POST'])
def predict_heart_disease():
    try:
        data = request.json
        
        # Ensure you extract and preprocess the features
        age = float(data['age'])
        sex = int(data['sex'])  # Convert categorical to numeric
        chest_pain = int(data['chest_pain_type'])  # Convert categorical to numeric
        bp = float(data['bp'])
        cholesterol = float(data['cholesterol'])
        fbs = int(data['fbs'])
        ekg_results = int(data['ekg_results'])
        max_hr = float(data['max_hr'])
        exercise_angina = int(data['exercise_angina'])  # Convert categorical to numeric
        st_depression = float(data['st_depression'])
        slope_of_st = int(data['slope_of_st'])  # Convert categorical to numeric
        num_vessels = int(data['num_vessels'])
        thallium = int(data['thallium'])  # Convert categorical to numeric

        # Prepare the features as an array
        features = pd.DataFrame([pd.Series([age, sex, chest_pain, bp, cholesterol, fbs, ekg_results, max_hr, exercise_angina, st_depression, slope_of_st, num_vessels, thallium])])

        # Scale the features
        features_scaled = heart_disease_scaler.transform(features)

        # Make prediction
        heart_disease_prediction = heart_disease_model.predict_proba(features_scaled)
        probability = '{0:.{1}f}'.format(heart_disease_prediction[0][1], 2)
        probability_percentage = float(probability) * 100
        
        # Prepare the response message
        if probability_percentage > 50:
            message = f'You have a {probability_percentage:.2f}% chance of having a heart disease based on our model.'
        else:
            message = f'You have a {probability_percentage:.2f}% chance of having a heart disease. This is considered low but consult a doctor for medical advice.'

        return jsonify({
            'prediction': message
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
