# AI Food Recognition Backend

A Python Flask backend server for the AI Food Recognition mobile app. This server provides APIs for food detection using Roboflow, nutrition data from USDA Food Data Central, and data persistence with Firebase Firestore.

## Features

- **Food Detection**: AI-powered food identification using Roboflow pre-trained models
- **Nutrition Data**: Comprehensive nutrition information from USDA Food Data Central API
- **Data Persistence**: User food logs and history stored in Firebase Firestore
- **RESTful APIs**: Clean, documented endpoints for mobile app integration
- **CORS Support**: Configured for Expo React Native frontend
- **Docker Support**: Containerized deployment ready

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
- `GET /api/foods/history?user_id=<id>` - Get user's food history

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required API keys:
- **Roboflow API Key**: Get from [Roboflow](https://roboflow.com/)
- **USDA API Key**: Get from [USDA Food Data Central](https://fdc.nal.usda.gov/api-guide.html)
- **Firebase Credentials**: Get from [Firebase Console](https://console.firebase.google.com/)

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Development Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 4. Docker Deployment

```bash
# Build image
docker build -t food-ai-backend .

# Run container
docker run -p 5000:5000 --env-file .env food-ai-backend
```

## Project Structure

```
├── app.py                 # Main Flask application
├── config/
│   ├── __init__.py
│   └── settings.py        # Configuration settings
├── routes/
│   ├── __init__.py
│   ├── health.py          # Health check endpoint
│   ├── detection.py       # Food detection endpoints
│   ├── nutrition.py       # Nutrition data endpoints
│   └── foods.py           # Food logging endpoints
├── services/
│   ├── __init__.py
│   ├── roboflow_service.py    # Roboflow API integration
│   ├── usda_service.py        # USDA API integration
│   └── firebase_service.py    # Firebase Firestore integration
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
└── README.md            # This file
```

## Implementation Status

The backend is structured and ready for integration. Each service contains TODO comments with implementation guidance:

- **Roboflow Service**: Ready for your pre-trained food detection model
- **USDA Service**: Ready for nutrition data integration
- **Firebase Service**: Ready for user data persistence

## Next Steps

1. **Get API Keys**: Sign up for Roboflow, USDA, and Firebase accounts
2. **Implement Services**: Replace TODO placeholders with actual API calls
3. **Test Integration**: Connect with your React Native frontend
4. **Deploy**: Use Docker for production deployment

## Security Notes

- All API keys should be stored in environment variables
- Firebase service account credentials should be kept secure
- Consider implementing authentication middleware for production use
- Add rate limiting for API endpoints in production

## Support

This backend is designed to work seamlessly with the React Native frontend you already have. The API structure matches exactly what your mobile app expects.