import pickle
import os

MODEL_PATH = "mlops/models/model.pkl"

def predict(text):
    if not os.path.exists(MODEL_PATH):
        return "⚠️ Model not trained yet"

    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    value = len(text)
    prediction = model.predict([[value]])

    if prediction[0] == 1:
        return "⚠️ Possible plant issue detected"
    else:
        return "✅ Plant looks healthy"