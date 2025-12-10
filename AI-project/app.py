
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv  
from config.settings import Config
from routes.health import health_bp
from routes.detection import detection_bp
from routes.nutrition import nutrition_bp
from routes.foods import foods_bp


load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    

    CORS(app, origins=["*"])
    

    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(detection_bp, url_prefix='/api')
    app.register_blueprint(nutrition_bp, url_prefix='/api')
    app.register_blueprint(foods_bp, url_prefix='/api')

    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )