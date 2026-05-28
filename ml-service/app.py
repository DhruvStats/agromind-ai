from fastapi import FastAPI
from pydantic import BaseModel
from mlops.inference.predict import predict
from mlops.monitoring.monitor import log_prediction

app = FastAPI()

class InputData(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "✅ ML Service Running"}

@app.post("/predict")
def get_prediction(data: InputData):
    result = predict(data.text)

    # ✅ log prediction
    log_prediction(data.text, result)

    return {
        "input": data.text,
        "result": result
    }