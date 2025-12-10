"""
Roboflow API service for food detection using pre-trained model
(using direct HTTPS request instead of inference-sdk)
"""

import os
import requests

class RoboflowService:
    

    @staticmethod
    def detect_food(image_path):

        try:
            api_key = os.getenv("ROBOFLOW_API_KEY")
            model_id = os.getenv("ROBOFLOW_MODEL_ID")
            version = os.getenv("ROBOFLOW_VERSION")

            if not all([api_key, model_id, version]):
                raise ValueError("Missing Roboflow API configuration. Check your .env file.")


            api_url = f"https://serverless.roboflow.com/{model_id}/{version}?api_key={api_key}"


            with open(image_path, "rb") as img_file:
                response = requests.post(api_url, files={"file": img_file})

            if response.status_code != 200:
                return {
                    "error": f"Roboflow API Error {response.status_code}: {response.text}",
                    "predictions": [],
                    "image": {"width": 0, "height": 0}
                }

            result = response.json()


            if "predictions" not in result:
                result["predictions"] = []

            return result

        except Exception as e:
            return {
                "error": str(e),
                "predictions": [],
                "image": {"width": 0, "height": 0}
            }

    @staticmethod
    def format_detection_results(raw_results):

        if 'error' in raw_results:
            return raw_results

        predictions = raw_results.get('predictions', [])
        detected_foods = []

        for pred in predictions:
            detected_foods.append({
                "name": pred.get('class', 'unknown'),
                "confidence": round(pred.get('confidence', 0) * 100, 2),
                "bbox": {
                    "x": pred.get('x', 0),
                    "y": pred.get('y', 0),
                    "width": pred.get('width', 0),
                    "height": pred.get('height', 0)
                }
            })

        detected_foods.sort(key=lambda x: x['confidence'], reverse=True)

        return {
            "success": True,
            "detected_foods": detected_foods,
            "total_detections": len(detected_foods),
            "image_info": raw_results.get('image', {})
        }
