import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

# ✅ Create simple training dataset
data = {
    "text": [
        "leaf yellow",
        "plant dry",
        "healthy plant",
        "green leaves",
        "brown leaves",
        "strong crop"
    ],
    "label": [1, 1, 0, 0, 1, 0]
}

df = pd.DataFrame(data)

# Feature = length of text
X = df["text"].apply(len).values.reshape(-1, 1)
y = df["label"]

# ✅ Train model
model = RandomForestClassifier()
model.fit(X, y)

# ✅ Ensure models folder exists
os.makedirs("mlops/models", exist_ok=True)

# ✅ Save model
with open("mlops/models/model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved successfully")