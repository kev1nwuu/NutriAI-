
from flask import Blueprint, request, jsonify
from services.firebase_service import FirebaseService

foods_bp = Blueprint('foods', __name__)

@foods_bp.route('/foods/log', methods=['POST'])
def log_food():
    """
    Save food entry to user's log
    
    Expects JSON:
        {
            "user_id": "string",
            "food_name": "string",
            "calories": number,
            "carbs": number,
            "protein": number,
            "fat": number,
            "fiber": number,
            "sugar": number,
            "sodium": number,
            "meal": "Breakfast|Lunch|Dinner|Snack",
            "serving_size": number,
            "date": "ISO date string"
        }
    
    Returns:
        - JSON with saved food entry including generated ID
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No data provided',
                'message': 'Please provide food entry data'
            }), 400
        

        required_fields = ['user_id', 'food_name', 'calories', 'meal']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}',
                    'message': f'Please provide {field}'
                }), 400
        

        saved_entry = FirebaseService.save_food_entry(data)
        
        return jsonify(saved_entry), 201
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to save food entry',
            'message': str(e)
        }), 500

@foods_bp.route('/foods/history', methods=['GET'])
def get_food_history():

    try:
        user_id = request.args.get('user_id')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        limit = request.args.get('limit', 50, type=int)
        
        if not user_id:
            return jsonify({
                'error': 'Missing user_id parameter',
                'message': 'Please provide a user ID'
            }), 400
        

        food_history = FirebaseService.get_food_history(
            user_id, start_date, end_date, limit
        )
        
        return jsonify(food_history), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to fetch food history',
            'message': str(e)
        }), 500