import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report

# Load the dataset
data = pd.read_csv("Heart-disease.csv")

# Handle missing values (if any)
data.dropna(inplace=True)

# Encode categorical features (if any)
label_encoders = {}
for column in ['Sex', 'Chest pain type', 'FBS over 120', 'EKG results', 'Exercise angina', 'Slope of ST', 'Thallium']:
    le = LabelEncoder()
    data[column] = le.fit_transform(data[column])
    label_encoders[column] = le

# Separate features and target
X = data.drop('Heart Disease', axis=1)
y = data['Heart Disease']

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Initialize and train the Random Forest model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")
print(classification_report(y_test, y_pred))

# Save the model, scaler, and encoders
with open('heart_disease_model.pkl', 'wb') as model_file:
    pickle.dump(model, model_file)

with open('heart_disease_scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)

# Save label encoders
for column, le in label_encoders.items():
    with open(f'{column}_encoder.pkl', 'wb') as le_file:
        pickle.dump(le, le_file)
