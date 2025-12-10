# AI Food Recognition Backend

A Python Flask backend server for the AI Food Recognition mobile app. This server provides APIs for food detection using Roboflow, nutrition data from USDA Food Data Central, and data persistence with Firebase Firestore.

## Features

- **Food Detection**: AI-powered food identification using Roboflow pre-trained models
- **Nutrition Data**: Comprehensive nutrition information from USDA Food Data Central API                                                                       
- **RESTful APIs**: Clean, documented endpoints for mobile app integration
- **CORS Support**: Configured for Expo React Native frontend


## API Endpoints

### Health Check
- `GET /api/health` - Returns server status

### Food Detection
- `POST /api/detect` - Upload image for AI food detection

### Nutrition Data
- `GET /api/nutrition/search?query=<food_name>` - Search USDA nutrition database
- `GET /api/nutrition/fdc/<fdc_id>` - Get detailed nutrition by FDC ID

### Food Logging
- `POST /api/foods/log` - Save food entry to user log
- `GET /api/foods/history?user_id=<id>` - Get the user's food history

## Setup Instructions
### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run Development Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

