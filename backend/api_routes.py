from flask import Blueprint, request, jsonify
import pandas as pd


api_routes = Blueprint('api_routes', __name__)

# Dummy example, replace with actual API or database logic
@api_routes.route("/weather-history", methods=["GET"])
def weather_history():
    start = pd.to_datetime(request.args.get("start"))
    end = pd.to_datetime(request.args.get("end"))
    df = pd.read_csv("weather_data.csv", parse_dates=["date"])
    df = df[(df["date"] >= start) & (df["date"] <= end)]
    return jsonify(df.to_dict(orient="records"))

@api_routes.route("/traffic-history", methods=["GET"])
def traffic_history():
    start = pd.to_datetime(request.args.get("start"))
    end = pd.to_datetime(request.args.get("end"))
    df = pd.read_csv("traffic_data.csv", parse_dates=["date"])
    df = df[(df["date"] >= start) & (df["date"] <= end)]
    return jsonify(df.to_dict(orient="records"))