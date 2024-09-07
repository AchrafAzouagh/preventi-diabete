from flask import Flask, request, jsonify, render_template
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
        input_1 = float(request.form['1'])
        input_two = float(request.form['2'])
        input_three = float(request.form['3'])
        input_four = float(request.form['4'])
        input_five = float(request.form['5'])
        input_six = float(request.form['6'])
        input_seven = float(request.form['7'])
        input_eight = float(request.form['8'])
        
        setup_df = pd.DataFrame([pd.Series([input_1, input_two, input_three, input_four, input_five, input_six, input_seven, input_eight])])
        diabetes_prediction = model.predict_proba(setup_df)
        probability = '{0:.{1}f}'.format(diabetes_prediction[0][1], 2)
        probability_percentage = float(probability) * 100
        
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
    app.run(debug=True)
