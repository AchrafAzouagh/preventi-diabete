from flask import Flask, request, jsonify
import pandas as pd
import pickle
from flask_cors import CORS

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

model = pickle.load(open("testing5.pkl", "rb"))

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.json
        input_1 = float(data['1'])
        input_two = float(data['2'])
        input_three = float(data['3'])
        input_four = float(data['4'])
        input_five = float(data['5'])
        input_six = float(data['6'])
        input_seven = float(data['7'])
        input_eight = float(data['8'])
        
        # Create a DataFrame from the inputs
        setup_df = pd.DataFrame([pd.Series([input_1, input_two, input_three, input_four, input_five, input_six, input_seven, input_eight])])
        
        # Predict using the model
        diabetes_prediction = model.predict_proba(setup_df)
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
