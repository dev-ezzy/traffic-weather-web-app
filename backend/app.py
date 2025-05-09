from flask import Flask
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

from predict import predict_route  # imported route
from fetch_data import auto_refresh  # import auto-refresh function
from api_routes import api_routes



app = Flask(__name__)
CORS(app)

# Register prediction route
app.register_blueprint(predict_route)
app.register_blueprint(api_routes)
# Scheduler for auto-refreshing every 20 minutes
scheduler = BackgroundScheduler()
scheduler.add_job(func=auto_refresh, trigger="interval", minutes=20)
scheduler.start()

atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    app.run(debug=True)

