"""
USDA Food Data Central API service for nutrition information
"""
import requests
from dotenv import load_dotenv
from config.settings import Config


load_dotenv()

class USDAService:
    

    BASE_URL = Config.USDA_BASE_URL or "https://api.nal.usda.gov/fdc/v1"

    @staticmethod
    def search_foods(query, limit=10):
        """
        Search for foods in USDA database
        """
        api_key = Config.USDA_API_KEY
        if not api_key:
            raise ValueError("Missing USDA_API_KEY in .env")

        url = f"{USDAService.BASE_URL}/foods/search"
        params = {
            "api_key": api_key,
            "query": query,
            "pageSize": limit,
            "dataType": ["Foundation", "SR Legacy"]
        }

        response = requests.get(url, params=params)
        if response.status_code != 200:
            raise Exception(f"USDA search failed: {response.status_code}")

        data = response.json()
        foods = data.get("foods", [])

        return {
            "foods": [
                {
                    "fdc_id": food["fdcId"],
                    "description": food.get("description", ""),
                    "data_type": food.get("dataType", ""),
                }
                for food in foods
            ],
            "total_hits": data.get("totalHits", 0)
        }

    @staticmethod
    def get_food_by_fdc_id(fdc_id):

        api_key = Config.USDA_API_KEY
        if not api_key:
            raise ValueError("Missing USDA_API_KEY in .env")

        url = f"{USDAService.BASE_URL}/food/{fdc_id}"
        params = {"api_key": api_key}

        response = requests.get(url, params=params)
        if response.status_code != 200:
            raise Exception(f"USDA detail failed: {response.status_code}")

        data = response.json()

        nutrients = {}
        for nutrient in data.get("foodNutrients", []):
            name = nutrient.get("nutrient", {}).get("name", "")
            value = nutrient.get("amount", 0)
            if name == "Energy":
                nutrients["calories"] = value
            elif name == "Protein":
                nutrients["protein"] = value
            elif name == "Total lipid (fat)":
                nutrients["fat"] = value
            elif name == "Carbohydrate, by difference":
                nutrients["carbs"] = value
            elif name == "Fiber, total dietary":
                nutrients["fiber"] = value
            elif name == "Sugars, total including NLEA":
                nutrients["sugar"] = value
            elif name == "Sodium, Na":
                nutrients["sodium"] = value

        return {
            "fdc_id": fdc_id,
            "description": data.get("description", ""),
            "nutrients": nutrients,
            "serving_size": 100,
            "serving_unit": "g"
        }

    @staticmethod
    def classify_food_type(food_name):

        food_name_lower = food_name.lower()
        
        food_categories = {
        
            'fresh_fruits': [
                'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 
                'raspberry', 'mango', 'pineapple', 'watermelon', 'melon', 'peach',
                'pear', 'plum', 'cherry', 'kiwi', 'lemon', 'lime', 'avocado'
            ],
           
            'fresh_vegetables': [
                'carrot', 'broccoli', 'tomato', 'cucumber', 'lettuce', 'spinach',
                'kale', 'cabbage', 'onion', 'garlic', 'potato', 'sweet potato',
                'bell pepper', 'chili', 'mushroom', 'celery', 'asparagus'
            ],
          
            'bakery': [
                'croissant', 'strudel', 'pie', 'bread', 'muffin', 'cake', 'cookie',
                'biscuit', 'pastry', 'donut', 'bagel', 'roll', 'bun'
            ],
          
            'beverages': [
                'juice', 'smoothie', 'milk', 'tea', 'coffee', 'soda', 'water',
                'lemonade', 'shake', 'drink', 'beverage'
            ],
         
            'meat': [
                'chicken', 'beef', 'pork', 'steak', 'bacon', 'sausage', 'ham',
                'turkey', 'duck', 'lamb', 'veal'
            ],
          
            'seafood': [
                'salmon', 'tuna', 'shrimp', 'prawn', 'crab', 'lobster', 'fish',
                'cod', 'tilapia', 'sardine', 'oyster', 'clam'
            ],
           
            'dairy': [
                'cheese', 'yogurt', 'butter', 'cream', 'ice cream', 'custard'
            ],
           
            'grains': [
                'rice', 'pasta', 'noodle', 'oatmeal', 'cereal', 'quinoa', 'barley',
                'bread', 'toast'
            ],
         
            'nuts_seeds': [
                'almond', 'walnut', 'peanut', 'cashew', 'pecan', 'seed', 'nut'
            ],
          
            'processed': [
                'babyfood', 'canned', 'frozen', 'sauce', 'ketchup', 'mayonnaise',
                'chip', 'cracker', 'popcorn'
            ],
           
            'desserts': [
                'chocolate', 'candy', 'sweet', 'dessert', 'pudding'
            ]
        }
        
    
        for category, keywords in food_categories.items():
            for keyword in keywords:
                if keyword in food_name_lower:
                    return category
        
        return 'unknown'

    @staticmethod
    def find_best_match(food_name, search_results):
 
        food_type = USDAService.classify_food_type(food_name)
        food_name_lower = food_name.lower().strip()
        

        matching_strategies = {
            'fresh_fruits': {
                'priority_keywords': ['raw', 'fresh', 'with skin'],
                'exclude_keywords': ['pie', 'strudel', 'croissant', 'babyfood', 'juice', 'sauce', 'canned', 'frozen'],
                'prefer_foundation': True,
                'description': '新鲜水果'
            },
            'fresh_vegetables': {
                'priority_keywords': ['raw', 'fresh'],
                'exclude_keywords': ['canned', 'frozen', 'sauce', 'babyfood'],
                'prefer_foundation': True,
                'description': '新鲜蔬菜'
            },
            'bakery': {
                'priority_keywords': [],  
                'exclude_keywords': ['babyfood'],
                'prefer_foundation': False,  
                'description': '烘焙食品'
            },
            'beverages': {
                'priority_keywords': ['juice', 'beverage', 'drink'],
                'exclude_keywords': ['babyfood'],
                'prefer_foundation': True,
                'description': '饮料'
            },
            'meat': {
                'priority_keywords': ['raw', 'fresh', 'lean'],
                'exclude_keywords': ['babyfood', 'canned'],
                'prefer_foundation': True,
                'description': '肉类'
            },
            'seafood': {
                'priority_keywords': ['raw', 'fresh'],
                'exclude_keywords': ['babyfood', 'canned'],
                'prefer_foundation': True,
                'description': '海鲜'
            },
            'dairy': {
                'priority_keywords': [],  
                'exclude_keywords': ['babyfood'],
                'prefer_foundation': True,
                'description': '乳制品'
            },
            'grains': {
                'priority_keywords': ['cooked', 'boiled'],
                'exclude_keywords': ['babyfood'],
                'prefer_foundation': True,
                'description': '谷物主食'
            },
            'nuts_seeds': {
                'priority_keywords': ['raw', 'unsalted'],
                'exclude_keywords': ['babyfood'],
                'prefer_foundation': True,
                'description': '坚果种子'
            },
            'processed': {
                'priority_keywords': [],  
                'exclude_keywords': ['babyfood'],  
                'prefer_foundation': False,
                'description': '加工食品'
            },
            'desserts': {
                'priority_keywords': [],  
                'exclude_keywords': ['babyfood'],
                'prefer_foundation': False,
                'description': '甜点'
            },
            'unknown': {
                'priority_keywords': ['raw', 'fresh'],
                'exclude_keywords': ['babyfood'],
                'prefer_foundation': True,
                'description': '未知类型'
            }
        }
        
        strategy = matching_strategies.get(food_type, matching_strategies['unknown'])
        
        scored_foods = []
        
        for food in search_results:
            description = food.get("description", "").lower()
            score = 0

            if food_name_lower in description:
                score += 20  
            elif any(word in description for word in food_name_lower.split()):
                score += 10  
            
    
            for keyword in strategy['priority_keywords']:
                if keyword in description:
                    score += 5
    
            for exclude in strategy['exclude_keywords']:
                if exclude in description and exclude not in food_name_lower:
                    score -= 10
            
            if strategy['prefer_foundation'] and food.get("data_type") == "Foundation":
                score += 3
            elif not strategy['prefer_foundation'] and food.get("data_type") == "SR Legacy":
                score += 2
            
 
            if food_type in ['fresh_fruits', 'fresh_vegetables']:
                if 'babyfood' in description:
                    score -= 15
                if any(word in description for word in ['pie', 'strudel', 'croissant']):
                    score -= 12
            
            scored_foods.append({
                'food': food,
                'score': score,
                'description': description
            })
        
 
        scored_foods.sort(key=lambda x: x['score'], reverse=True)
        
        print(f"食物分类: {strategy['description']}, 搜索: '{food_name}'")
        print(f"best :")
        for i, item in enumerate(scored_foods[:3]):
            print(f"  {i+1}. {item['description']} (score: {item['score']})")
        

        valid_matches = [item for item in scored_foods if item['score'] > 5]
        
        if valid_matches:
            best_match = valid_matches[0]['food']
            print(f"final: {best_match['description']}")
            return best_match
        else:
            print(f"did not find match")
            return None

    @staticmethod
    def get_single_food_nutrition(food_name):

        print(f"search: '{food_name}'")
        

        search_results = USDAService.search_foods(food_name, limit=25)
        foods = search_results.get("foods", [])
        
        if not foods:
            print(f"No related food found: '{food_name}'")
            return {"error": f"No food found for '{food_name}'"}
        

        best_match = USDAService.find_best_match(food_name, foods)
        
        if not best_match:
            print(f"No suitable match found: '{food_name}'")
            return {"error": f"No suitable match found for '{food_name}'"}
        

        try:
            food_detail = USDAService.get_food_by_fdc_id(best_match["fdc_id"])
            nutrients = food_detail.get("nutrients", {})
            
            print(f"Final choice: {best_match['description']}")
            print(f"data: {nutrients.get('calories', 'N/A')} calories")
            
            return {
                "name": best_match["description"],
                "calories": nutrients.get("calories", 0),
                "protein": nutrients.get("protein", 0),
                "fat": nutrients.get("fat", 0),
                "carbs": nutrients.get("carbs", 0),
                "fiber": nutrients.get("fiber", 0),
                "sugar": nutrients.get("sugar", 0),
                "sodium": nutrients.get("sodium", 0),
                "confidence": "smart_match",
                "data_type": best_match.get("data_type", ""),
                "selected_description": best_match["description"]
            }
        except Exception as e:
            print(f"fail: {e}")
            return {"error": f"Failed to get nutrition data: {e}"}

    @staticmethod
    def get_simple_nutrition(food_name):
 

        standard_foods = {

        "apple": {"calories": 52, "protein": 0.3, "fat": 0.2, "carbs": 14, "fiber": 2.4, "sugar": 10, "sodium": 1},
        "banana": {"calories": 89, "protein": 1.1, "fat": 0.3, "carbs": 23, "fiber": 2.6, "sugar": 12, "sodium": 1},
        "orange": {"calories": 47, "protein": 0.9, "fat": 0.1, "carbs": 12, "fiber": 2.4, "sugar": 9, "sodium": 0},
        "strawberry": {"calories": 32, "protein": 0.7, "fat": 0.3, "carbs": 8, "fiber": 2.0, "sugar": 4.9, "sodium": 1},
        "grape": {"calories": 69, "protein": 0.7, "fat": 0.2, "carbs": 18, "fiber": 0.9, "sugar": 16, "sodium": 2},
        "watermelon": {"calories": 30, "protein": 0.6, "fat": 0.2, "carbs": 8, "fiber": 0.4, "sugar": 6, "sodium": 1},
        "pineapple": {"calories": 50, "protein": 0.5, "fat": 0.1, "carbs": 13, "fiber": 1.4, "sugar": 10, "sodium": 1},
        "mango": {"calories": 60, "protein": 0.8, "fat": 0.4, "carbs": 15, "fiber": 1.6, "sugar": 14, "sodium": 1},
        "peach": {"calories": 39, "protein": 0.9, "fat": 0.3, "carbs": 10, "fiber": 1.5, "sugar": 8, "sodium": 0},
        "pear": {"calories": 57, "protein": 0.4, "fat": 0.1, "carbs": 15, "fiber": 3.1, "sugar": 10, "sodium": 1},
        "kiwi": {"calories": 61, "protein": 1.1, "fat": 0.5, "carbs": 15, "fiber": 3.0, "sugar": 9, "sodium": 3},
        "blueberry": {"calories": 57, "protein": 0.7, "fat": 0.3, "carbs": 14, "fiber": 2.4, "sugar": 10, "sodium": 1},
        "raspberry": {"calories": 52, "protein": 1.2, "fat": 0.7, "carbs": 12, "fiber": 6.5, "sugar": 4.4, "sodium": 1},
        "avocado": {"calories": 160, "protein": 2.0, "fat": 15, "carbs": 9, "fiber": 7, "sugar": 0.7, "sodium": 7},
    

        "carrot": {"calories": 41, "protein": 0.9, "fat": 0.2, "carbs": 10, "fiber": 2.8, "sugar": 5, "sodium": 69},
        "broccoli": {"calories": 34, "protein": 2.8, "fat": 0.4, "carbs": 7, "fiber": 2.6, "sugar": 1.7, "sodium": 33},
        "tomato": {"calories": 18, "protein": 0.9, "fat": 0.2, "carbs": 4, "fiber": 1.2, "sugar": 2.6, "sodium": 5},
        "cucumber": {"calories": 15, "protein": 0.7, "fat": 0.1, "carbs": 3.6, "fiber": 0.5, "sugar": 1.7, "sodium": 2},
        "lettuce": {"calories": 15, "protein": 1.4, "fat": 0.2, "carbs": 2.9, "fiber": 1.3, "sugar": 0.8, "sodium": 28},
        "spinach": {"calories": 23, "protein": 2.9, "fat": 0.4, "carbs": 3.6, "fiber": 2.2, "sugar": 0.4, "sodium": 79},
        "potato": {"calories": 77, "protein": 2.0, "fat": 0.1, "carbs": 17, "fiber": 2.2, "sugar": 0.8, "sodium": 6},
        "sweet potato": {"calories": 86, "protein": 1.6, "fat": 0.1, "carbs": 20, "fiber": 3.0, "sugar": 4.2, "sodium": 55},
        "onion": {"calories": 40, "protein": 1.1, "fat": 0.1, "carbs": 9, "fiber": 1.7, "sugar": 4.2, "sodium": 4},
        "bell pepper": {"calories": 31, "protein": 1.0, "fat": 0.3, "carbs": 6, "fiber": 2.1, "sugar": 4.2, "sodium": 4},
        "mushroom": {"calories": 22, "protein": 3.1, "fat": 0.3, "carbs": 3.3, "fiber": 1.0, "sugar": 2.0, "sodium": 5},
        "cauliflower": {"calories": 25, "protein": 1.9, "fat": 0.3, "carbs": 5, "fiber": 2.0, "sugar": 1.9, "sodium": 30},
        "cabbage": {"calories": 25, "protein": 1.3, "fat": 0.1, "carbs": 6, "fiber": 2.5, "sugar": 3.2, "sodium": 18},
    

        "chicken breast": {"calories": 165, "protein": 31, "fat": 3.6, "carbs": 0, "fiber": 0, "sugar": 0, "sodium": 74},
        "beef": {"calories": 250, "protein": 26, "fat": 15, "carbs": 0, "fiber": 0, "sugar": 0, "sodium": 72},
        "pork": {"calories": 242, "protein": 25, "fat": 14, "carbs": 0, "fiber": 0, "sugar": 0, "sodium": 62},
        "salmon": {"calories": 208, "protein": 20, "fat": 13, "carbs": 0, "fiber": 0, "sugar": 0, "sodium": 59},
        "tuna": {"calories": 184, "protein": 30, "fat": 6, "carbs": 0, "fiber": 0, "sugar": 0, "sodium": 50},
        "egg": {"calories": 155, "protein": 13, "fat": 11, "carbs": 1.1, "fiber": 0, "sugar": 1.1, "sodium": 124},
        "tofu": {"calories": 76, "protein": 8, "fat": 4.8, "carbs": 1.9, "fiber": 0.3, "sugar": 0.0, "sodium": 7},
    

        "milk": {"calories": 42, "protein": 3.4, "fat": 1.0, "carbs": 5.0, "fiber": 0, "sugar": 5.0, "sodium": 44},
        "yogurt": {"calories": 59, "protein": 3.5, "fat": 0.4, "carbs": 7.0, "fiber": 0, "sugar": 7.0, "sodium": 36},
        "cheese": {"calories": 402, "protein": 25, "fat": 33, "carbs": 1.3, "fiber": 0, "sugar": 0.5, "sodium": 621},
        "butter": {"calories": 717, "protein": 0.9, "fat": 81, "carbs": 0.1, "fiber": 0, "sugar": 0.1, "sodium": 11},
    

        "rice": {"calories": 130, "protein": 2.7, "fat": 0.3, "carbs": 28, "fiber": 0.4, "sugar": 0.1, "sodium": 1},
        "bread": {"calories": 265, "protein": 9, "fat": 3.2, "carbs": 49, "fiber": 2.7, "sugar": 5.0, "sodium": 491},
        "pasta": {"calories": 131, "protein": 5, "fat": 1.1, "carbs": 25, "fiber": 1.8, "sugar": 0.6, "sodium": 1},
        "oatmeal": {"calories": 68, "protein": 2.4, "fat": 1.4, "carbs": 12, "fiber": 1.7, "sugar": 0.5, "sodium": 49},
    

        "almond": {"calories": 579, "protein": 21, "fat": 50, "carbs": 22, "fiber": 12.5, "sugar": 4.4, "sodium": 1},
        "walnut": {"calories": 654, "protein": 15, "fat": 65, "carbs": 14, "fiber": 6.7, "sugar": 2.6, "sodium": 2},
        "peanut": {"calories": 567, "protein": 26, "fat": 49, "carbs": 16, "fiber": 8.5, "sugar": 4.7, "sodium": 18},
    

        "coffee": {"calories": 1, "protein": 0.1, "fat": 0.0, "carbs": 0.0, "fiber": 0, "sugar": 0.0, "sodium": 2},
        "tea": {"calories": 1, "protein": 0.0, "fat": 0.0, "carbs": 0.3, "fiber": 0, "sugar": 0.0, "sodium": 4},
    

        "pizza": {"calories": 266, "protein": 11, "fat": 10, "carbs": 33, "fiber": 2.3, "sugar": 3.6, "sodium": 598},
        "hamburger": {"calories": 295, "protein": 17, "fat": 14, "carbs": 30, "fiber": 1.8, "sugar": 5.0, "sodium": 414},
        "french fries": {"calories": 312, "protein": 3.4, "fat": 15, "carbs": 41, "fiber": 3.8, "sugar": 0.3, "sodium": 210},
    

        "chocolate": {"calories": 546, "protein": 4.9, "fat": 31, "carbs": 61, "fiber": 7.0, "sugar": 48, "sodium": 24},
        "ice cream": {"calories": 207, "protein": 3.5, "fat": 11, "carbs": 24, "fiber": 0.7, "sugar": 21, "sodium": 80},
}
        
        food_lower = food_name.lower().strip()
        
        if food_lower in standard_foods:
            print(f"Use standard values: {food_name}")
            nutrients = standard_foods[food_lower]
            return {
                "name": food_name.title(),
                "calories": nutrients["calories"],
                "protein": nutrients["protein"],
                "fat": nutrients["fat"],
                "carbs": nutrients["carbs"],
                "fiber": nutrients["fiber"],
                "sugar": nutrients["sugar"],
                "sodium": nutrients["sodium"],
                "confidence": "standard"
            }
        

        try:
            result = USDAService.get_single_food_nutrition(food_name)
            
            if "error" in result:
                print(f"If smart matching fails, use the average method: {food_name}")

                return USDAService.get_nutrition_by_name_fallback(food_name)
            
            return result
            
        except Exception as e:
            print(f"Error in obtaining nutritional data {food_name}: {e}")

            return {
                "name": food_name,
                "calories": 100,
                "protein": 5.0,
                "fat": 2.0,
                "carbs": 15.0,
                "fiber": 2.0,
                "sugar": 8.0,
                "sodium": 50.0,
                "confidence": "estimated"
            }

    @staticmethod
    def get_nutrition_by_name_fallback(food_name):
        try:
            result = USDAService.get_nutrition_by_name(food_name)
            
            if "error" in result:
                return {
                    "name": food_name,
                    "calories": 100,
                    "protein": 5.0,
                    "fat": 2.0,
                    "carbs": 15.0,
                    "fiber": 2.0,
                    "sugar": 8.0,
                    "sodium": 50.0,
                    "confidence": "estimated"
                }
            
            nutrients = result.get("nutrients", {})
            
            return {
                "name": result.get("name", food_name),
                "calories": nutrients.get("calories", 0),
                "protein": nutrients.get("protein", 0),
                "fat": nutrients.get("fat", 0),
                "carbs": nutrients.get("carbs", 0),
                "fiber": nutrients.get("fiber", 0),
                "sugar": nutrients.get("sugar", 0),
                "sodium": nutrients.get("sodium", 0),
                "confidence": f"average_of_{result.get('samples_count', 0)}"
            }
        except Exception as e:
            print(f"error: {e}")
            return {
                "name": food_name,
                "calories": 100,
                "protein": 5.0,
                "fat": 2.0,
                "carbs": 15.0,
                "fiber": 2.0,
                "sugar": 8.0,
                "sodium": 50.0,
                "confidence": "estimated"
            }

    @staticmethod
    def get_nutrition_by_name(food_name):

        print(f"search: '{food_name}'")
    

        food_name = food_name.lower().strip()
    
        search_results = USDAService.search_foods(food_name, limit=50)
        foods = search_results.get("foods", [])
    
        print(f" Find {len(foods)} results to use for averaging.")
    
        if not foods:
            return {"error": f"No food found for '{food_name}'"}
    
 
        filtered_foods = []
        for food in foods:
            description = food.get("description", "").lower()
        
       
            avoid_keywords = ['croissant', 'strudel', 'juice', 'butter', 'pie', 'sauce', 'nuggets', 'breaded']
            if any(bad in description for bad in avoid_keywords):
                continue
            
            filtered_foods.append(food)
    
        print(f"After filtering: {len(filtered_foods)} relevant results")
    

        if not filtered_foods:
            filtered_foods = foods
            print("No relevant results were found; the average was calculated using all results.")
    

        all_nutrients = {
            'calories': [],
            'protein': [],
            'fat': [],
            'carbs': [],
            'fiber': [],
            'sugar': [],
            'sodium': []
        }
    
        valid_count = 0
    
        for food in filtered_foods[:20]:  
            try:
             
                food_detail = USDAService.get_food_by_fdc_id(food["fdc_id"])
                nutrients = food_detail.get("nutrients", {})
            
            
                if nutrients.get("calories", 0) > 0:  
                    for key in all_nutrients.keys():
                        value = nutrients.get(key, 0)
                        if value > 0:  
                            all_nutrients[key].append(value)
                
                    valid_count += 1
                    print(f"add: {food['description']} - calories: {nutrients.get('calories', 'N/A')}")
                
            except Exception as e:
                print(f"faill {food['description']}: {e}")
                continue
    
        print(f" yes {valid_count} ")
    

        avg_nutrients = {}
        for key, values in all_nutrients.items():
            if values:
                avg_nutrients[key] = round(sum(values) / len(values), 1)
            else:
                avg_nutrients[key] = 0
    
  
        return {
            "name": food_name.title(),
            "description": f"Average of {valid_count} {food_name} varieties",
            "nutrients": avg_nutrients,
            "samples_count": valid_count,
            "confidence": "average"
        }