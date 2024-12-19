# filepath: /path/to/fastapi_server.py

from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import pickle

# Load the model and preprocessing pipeline
model = pickle.load(open("models/solar_power_model_linreg.pkl", "rb"))
pipeline = pickle.load(open("models/preprocessing_pipeline.pkl", "rb"))

app = FastAPI()

#date, temp, weather, wind, humidity
class InputData(BaseModel):
    date: str
    temp: float
    weather: str
    wind: float
    humidity: float

@app.post("/predict")
def predict(data: InputData):
    # Convert input data to DataFrame
    input_df = pd.DataFrame([data.dict()])

    # Preprocess the input data
    prepared_data = pipeline.transform(input_df)

    # Make prediction
    prediction = model.predict(prepared_data)

    return {"prediction": prediction[0]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)