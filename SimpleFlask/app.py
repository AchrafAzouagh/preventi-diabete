from flask import Flask, request, jsonify
import pandas as pd
import pickle
import numpy as np
from flask_cors import CORS # type: ignore

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

# Load models and preprocessors
general_model = pickle.load(open("diabetes/knn_model.pkl", "rb"))
heart_disease_model = pickle.load(open("heartdisease/heart_disease_model.pkl", "rb"))

# Load preprocessors for general model (diabetes)
scaler = pickle.load(open("diabetes/scaler.pkl", "rb"))
gender_encoder = pickle.load(open("diabetes/gender_encoder.pkl", "rb"))
smoking_history_encoder = pickle.load(open("diabetes/smoking_history_encoder.pkl", "rb"))

# Load preprocessors for heart disease model
heart_disease_scaler = pickle.load(open("heartdisease/heart_disease_scaler.pkl", "rb"))

# Load label encoders for heart disease model
sex_encoder = pickle.load(open("heartdisease/sex_encoder.pkl", "rb"))
chest_pain_encoder = pickle.load(open("heartdisease/chest_pain_encoder.pkl", "rb"))
exercise_angina_encoder = pickle.load(open("heartdisease/exercise_angina_encoder.pkl", "rb"))
slope_of_st_encoder = pickle.load(open("heartdisease/slope_of_st_encoder.pkl", "rb"))
thallium_encoder = pickle.load(open("heartdisease/thallium_encoder.pkl", "rb"))

@app.route('/')
def index():
    return app.send_static_file('index.html')

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
