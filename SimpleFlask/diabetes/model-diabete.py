import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report

# Load the dataset
data = pd.read_csv("diabetes_dataset.csv")

# Handle missing values (replace 'No Info' with NaN and then drop)
data.replace('No Info', pd.NA, inplace=True)
data.dropna(inplace=True)

# Encode categorical features
label_encoders = {}
for column in ['gender', 'smoking_history']:
    le = LabelEncoder()
    data[column] = le.fit_transform(data[column])
    label_encoders[column] = le

# Separate features and target
X = data.drop('diabetes', axis=1)
y = data['diabetes']

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Initialize and train KNN model
knn = KNeighborsClassifier(n_neighbors=5)  # Specify number of neighbors
knn.fit(X_train, y_train)

# Evaluate the model
y_pred = knn.predict(X_test)
print("Model performance on test set:")
print(classification_report(y_test, y_pred))

# Save the model and preprocessor
with open('knn_model.pkl', 'wb') as model_file:
    pickle.dump(knn, model_file)

with open('scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)

# Save label encoders
for column, le in label_encoders.items():
    with open(f'{column}_encoder.pkl', 'wb') as le_file:
        pickle.dump(le, le_file)
