# Solar Panel Forecasting FastAPI Server

This FastAPI server serves a machine learning model that predicts solar panel power output based on weather data.

## Setup Instructions

### 1. Clone the Repository

First, clone the repository to your local machine:

```sh
git clone <repository_url>
cd solar-panel-forecasting/server

python -m venv myenv
myenv\Scripts\activate

## Install the dependencies

pip install -r requirements.txt

## Run the app

uvicorn main:app --reload

## Input

{
  "date": "2023-10-01",
  "temp": 25.0,
  "weather": "sunny",
  "wind": 5.0,
  "humidity": 60.0
}

## Output

{
  "prediction": 123.45
}

curl -X 'POST' \
  'http://127.0.0.1:8000/predict' \
  -H 'Content-Type: application/json' \
  -d '{
  "date": "2023-10-01",
  "temp": 25.0,
  "weather": "sunny",
  "wind": 5.0,
  "humidity": 60.0
}'
```

### Setup Node.js Server

```sh
cd solar-panel-forecasting/node server

npm install

node server.js
```

### Get 15 days 

```sh
curl -X 'GET' \
  'http://localhost:3000/forecast
```