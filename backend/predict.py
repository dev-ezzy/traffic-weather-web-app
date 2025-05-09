from flask import Blueprint, request, jsonify
import joblib
import os
import requests
import numpy as np
from datetime import datetime
from tensorflow.keras.models import load_model

predict_route = Blueprint('predict_route', __name__)

# --- Model paths ---
BASE_PATH = "/home/ezra/Desktop/IGP/Traffic--Weather-analysis/sarima_models"
LSTM_MODELS = {
    "currentSpeed": "currentSpeed_best_model.h5",
    "currentTravelTime": "currentTravelTime_best_model.h5"
}
SARIMA_MODELS = {
    "freeFlowSpeed": "sarima_freeFlowSpeed.pkl",
    "freeFlowTravelTime": "sarima_freeFlowTravelTime.pkl"
}

# --- Load models ---
lstm_models = {}
lstm_scalers = {}
for target, file in LSTM_MODELS.items():
    model_path = os.path.join(BASE_PATH, file)
    scaler_path = os.path.join(BASE_PATH, f"{target}_scaler.gz")
    from tensorflow.keras.losses import MeanSquaredError
    lstm_models[target] = load_model(model_path, compile=False)
    lstm_scalers[target] = joblib.load(scaler_path)

sarima_models = {}
for target, file in SARIMA_MODELS.items():
    sarima_models[target] = joblib.load(os.path.join(BASE_PATH, file))

# --- Fetch weather ---
def get_weather_features_for_datetime(date_str, time_str, lat=51.455, lon=-2.587):
    try:
        target_dt = datetime.fromisoformat(f"{date_str}T{time_str}")
        date_only = target_dt.strftime('%Y-%m-%d')
        hour_str = target_dt.strftime('%H:00')
        target_iso = f"{date_only}T{hour_str}"

        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}"
            f"&hourly=temperature_2m,relative_humidity_2m,surface_pressure,cloud_cover,wind_speed_10m"
            f"&start_date={date_only}&end_date={date_only}&timezone=auto"
        )

        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        hourly = data.get("hourly", {})
        if target_iso not in hourly["time"]:
            raise ValueError(f"No weather data for time {target_iso}")
        idx = hourly["time"].index(target_iso)
        return [[
            hourly["temperature_2m"][idx],
            hourly["relative_humidity_2m"][idx],
            hourly["surface_pressure"][idx],
            hourly["cloud_cover"][idx],
            hourly["wind_speed_10m"][idx]
        ]]
    except Exception as e:
        print("Error fetching weather data:", str(e))
        return None

# --- Categorize ---
def categorize_prediction(value, target):
    if target == "currentSpeed":
        return "Fast" if value < 10 else "Moderate" if value < 25 else "Heavy"
    elif target == "currentTravelTime":
        return "Short" if value < 8 else "Average" if value < 15 else "Long"
    elif target == "freeFlowSpeed":
        return "Normal" if value < 20 else "Busy" if value < 40 else "Congested"
    elif target == "freeFlowTravelTime":
        return "Quick" if value < 5 else "Typical" if value < 10 else "Delayed"
    return "Unknown"

# --- Prediction route ---
@predict_route.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    date = data.get("date")
    time = data.get("time")
    targets_requested = data.get("targets") or list(lstm_models.keys()) + list(sarima_models.keys())

    if not date or not time:
        return jsonify({"error": "Missing date or time"}), 400

    exog_input = get_weather_features_for_datetime(date, time)
    if exog_input is None:
        return jsonify({"error": "Failed to fetch weather data"}), 500

    results = {}
    for target in targets_requested:
        try:
            if target in lstm_models:
                model = lstm_models[target]
                scaler = lstm_scalers[target]
                full_input = np.concatenate(([0], exog_input[0])).reshape(1, -1)
                scaled_input = scaler.transform(full_input).reshape(1, 1, -1)
                pred_scaled = model.predict(scaled_input, verbose=0)[0][0]
                target_min, target_max = scaler.data_min_[0], scaler.data_max_[0]
                pred = pred_scaled * (target_max - target_min) + target_min
            elif target in sarima_models:
                pred = sarima_models[target].forecast(steps=1, exog=exog_input)[0]
            else:
                results[target] = {"error": "Model not found"}
                continue

            pred = max(0, float(pred))
            results[target] = {
                "value": round(pred, 2),
                "category": categorize_prediction(pred, target)
            }
        except Exception as e:
            results[target] = {"error": str(e)}

    return jsonify({
        "timestamp": datetime.utcnow().isoformat(),
        "predictions": results
    })
