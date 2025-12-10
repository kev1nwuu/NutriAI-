
from flask import Blueprint, request, jsonify
from services.usda_service import USDAService

nutrition_bp = Blueprint('nutrition', __name__)

@nutrition_bp.route('/nutrition/search', methods=['GET'])
def search_nutrition():
    """
    Search for food nutrition data by query string
    """
    try:
        query = request.args.get('query')
        limit = request.args.get('limit', 10, type=int)
        
        if not query:
            return jsonify({
                'error': 'Missing query parameter',
                'message': 'Please provide a food name to search for'
            }), 400
        

        search_results = USDAService.search_foods(query, limit)
        return jsonify(search_results), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Search failed',
            'message': str(e)
        }), 500


@nutrition_bp.route('/nutrition/fdc/<fdc_id>', methods=['GET'])
def get_nutrition_by_fdc_id(fdc_id):

    try:
        if not fdc_id:
            return jsonify({
                'error': 'Missing FDC ID',
                'message': 'Please provide a valid FDC ID'
            }), 400
        
        nutrition_data = USDAService.get_food_by_fdc_id(fdc_id)
        return jsonify(nutrition_data), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to fetch nutrition data',
            'message': str(e)
        }), 500


@nutrition_bp.route('/nutrition/by-name', methods=['POST'])
def get_nutrition_by_name():

    try:
        data = request.get_json()
        if not data or "food_name" not in data:
            return jsonify({
                'error': 'Missing food_name',
                'message': 'Please provide a valid food_name in JSON body'
            }), 400

        food_name = data["food_name"]
        

        nutrition_data = USDAService.get_simple_nutrition(food_name)
        

        if "error" in nutrition_data:
            return jsonify({
                'error': 'Not found',
                'message': f"No nutrition data found for {food_name}"
            }), 404

        return jsonify(nutrition_data), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to fetch nutrition data',
            'message': str(e)
        }), 500