"""
Food detection endpoints,Flask Routing
"""
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from services.roboflow_service import RoboflowService

detection_bp = Blueprint('detection', __name__)

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@detection_bp.route('/detect', methods=['POST'])
def detect_food():

    try:
        print("request.files:", request.files)
        print("request.form:", request.form)
       
        if 'image' not in request.files:
            return jsonify({
                'success': False, 
                'error': 'No image file provided',
                'message': 'Please upload an image file'
            }), 400
        
        file = request.files['image']
        

        if file.filename == '':
            return jsonify({
                'success': False, 
                'error': 'No file selected',
                'message': 'Please select an image file'
            }), 400
        

        if not allowed_file(file.filename):
            return jsonify({
                'success': False,  
                'error': 'Invalid file type',
                'message': 'Please upload a PNG, JPG, JPEG, or GIF file'
            }), 400
        

        filename = secure_filename(file.filename)
        upload_folder = 'uploads'
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        

        raw_detection_result = RoboflowService.detect_food(file_path) 
        
 
        formatted_result = RoboflowService.format_detection_results(raw_detection_result)
        

        os.remove(file_path)
        
        return jsonify(formatted_result), 200  
        
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': 'Detection failed',
            'message': str(e)
        }), 500