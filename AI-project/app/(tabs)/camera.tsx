import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import {
  Camera,
  FlipHorizontal,
  Zap,
  X,
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { detectFood } from '../../services/detectionApi';


import { useNutritionLog } from '../../hooks/NutritionLogContext';

interface NutritionInfo {
  name: string;
  calories: number | string;
  carbs: number | string;
  protein: number | string;
  fat: number | string;
  fiber: number | string;
  sugar: number | string;
  sodium: number | string;
  confidence?: number;
  recognized: boolean;
}

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionInfo | null>(null);
  const [showResults, setShowResults] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // ⭐ 从全局 Context 里拿到 addEntry
  const { addEntry } = useNutritionLog();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Camera size={64} color="#10B981" strokeWidth={1.5} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionMessage}>
          We need your permission to access the camera to scan and identify food items.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setIsAnalyzing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      console.log('📸 Photo captured:', {
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
      });

      if (!photo?.uri) {
        throw new Error('Failed to capture image');
      }

      const result = await detectFood(photo.uri);
      console.log('🔥 Detection result:', result);

      if (result.success && result.detected_foods.length > 0) {
        const detectedFood = result.detected_foods[0];

        // 调用后端营养接口
        const nutritionResponse = await fetch(
          'http://192.168.68.57:5000/api/nutrition/by-name',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              food_name: detectedFood.name,
            }),
          }
        );

        if (nutritionResponse.ok) {
          const nutritionJson = await nutritionResponse.json();
          console.log('Nutrition data:', nutritionJson);

          setNutritionData({
            name: nutritionJson.name || detectedFood.name,
            calories: nutritionJson.calories ?? '—',
            carbs: nutritionJson.carbs ?? '—',
            protein: nutritionJson.protein ?? '—',
            fat: nutritionJson.fat ?? '—',
            fiber: nutritionJson.fiber ?? '—',
            sugar: nutritionJson.sugar ?? '—',
            sodium: nutritionJson.sodium ?? '—',
            confidence: detectedFood.confidence,
            recognized: true,
          });
        } else {
          
          setNutritionData({
            name: detectedFood.name,
            calories: '—',
            carbs: '—',
            protein: '—',
            fat: '—',
            fiber: '—',
            sugar: '—',
            sodium: '—',
            confidence: detectedFood.confidence,
            recognized: true,
          });
        }
      } else {
        setNutritionData({
          name: 'Food Not Recognized',
          calories: '—',
          carbs: '—',
          protein: '—',
          fat: '—',
          fiber: '—',
          sugar: '—',
          sodium: '—',
          recognized: false,
        });
      }

      setShowResults(true);
    } catch (error) {
      console.error('Error:', error);
      setNutritionData({
        name: 'Recognition Failed',
        calories: '—',
        carbs: '—',
        protein: '—',
        fat: '—',
        fiber: '—',
        sugar: '—',
        sodium: '—',
        recognized: false,
      });
      setShowResults(true);
    } finally {
      setIsAnalyzing(false);
    }
  };


  const handleSaveToLog = () => {
    if (nutritionData && nutritionData.recognized) {

      const toNumber = (value: number | string) =>
        typeof value === 'number' ? value : Number(value) || 0;

        addEntry({
          name: nutritionData.name,
          calories: Number(nutritionData.calories) || 0,
          carbs: Number(nutritionData.carbs) || 0,
          protein: Number(nutritionData.protein) || 0,
          fat: Number(nutritionData.fat) || 0,
        });

      Alert.alert('Saved', `${nutritionData.name} has been added to your log.`);
    }

    setShowResults(false);
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Food Scanner</Text>
        <Text style={styles.subtitle}>Point your camera at food to analyze</Text>
      </View>


      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanInstruction}>Center the food item in the frame</Text>
          </View>
        </CameraView>
      </View>


      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
          <FlipHorizontal size={24} color="#374151" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
          onPress={takePicture}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <Camera size={32} color="#FFFFFF" strokeWidth={2} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Zap size={24} color="#374151" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* analyzing overlay */}
      {isAnalyzing && (
        <View style={styles.analyzingOverlay}>
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.analyzingText}>Analyzing food...</Text>
            <Text style={styles.analyzingSubtext}>
              Our AI is identifying the nutrition content
            </Text>
          </View>
        </View>
      )}

      {/* MODAL */}
      <Modal
        visible={showResults}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowResults(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              {nutritionData?.recognized ? (
                <CheckCircle size={24} color="#10B981" strokeWidth={2} />
              ) : (
                <AlertCircle size={24} color="#EF4444" strokeWidth={2} />
              )}
              <Text style={styles.modalTitle}>
                {nutritionData?.recognized ? 'Food Identified' : 'Not Recognized'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowResults(false)}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {nutritionData && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.foodHeader}>
                <Text style={styles.foodName}>{nutritionData.name}</Text>
                {nutritionData.recognized && (
                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceText}>
                      {nutritionData.confidence}% confident
                    </Text>
                    <View
                      style={[
                        styles.confidenceBadge,
                        {
                          backgroundColor:
                            nutritionData.confidence && nutritionData.confidence >= 90
                              ? '#10B981'
                              : '#F59E0B',
                        },
                      ]}
                    />
                  </View>
                )}
              </View>

              <View style={styles.caloriesCard}>
                <Text style={styles.caloriesValue}>{nutritionData.calories}</Text>
                <Text style={styles.caloriesLabel}>calories per 100g</Text>
              </View>

              <View style={styles.nutritionDetails}>
                <Text style={styles.nutritionSectionTitle}>Nutrition Facts</Text>
                <View style={styles.macroCards}>
                  <View style={styles.macroCard}>
                    <Text style={styles.macroCardValue}>{nutritionData.carbs}g</Text>
                    <Text style={styles.macroCardLabel}>Carbs</Text>
                  </View>
                  <View style={styles.macroCard}>
                    <Text style={styles.macroCardValue}>{nutritionData.protein}g</Text>
                    <Text style={styles.macroCardLabel}>Protein</Text>
                  </View>
                  <View style={styles.macroCard}>
                    <Text style={styles.macroCardValue}>{nutritionData.fat}g</Text>
                    <Text style={styles.macroCardLabel}>Fat</Text>
                  </View>
                </View>

                <View style={styles.detailedNutrition}>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Fiber</Text>
                    <Text style={styles.nutritionValue}>{nutritionData.fiber}g</Text>
                  </View>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Sugar</Text>
                    <Text style={styles.nutritionValue}>{nutritionData.sugar}g</Text>
                  </View>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Sodium</Text>
                    <Text style={styles.nutritionValue}>{nutritionData.sodium}mg</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setShowResults(false)}
            >
              <Text style={styles.secondaryButtonText}>Scan Again</Text>
            </TouchableOpacity>

            {nutritionData?.recognized && (
              <TouchableOpacity style={styles.primaryButton} onPress={handleSaveToLog}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.primaryButtonText}>Add to track</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: '#10B981',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scanInstruction: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 30,
    backgroundColor: '#F9FAFB',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    margin: 40,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  foodHeader: {
    paddingVertical: 24,
  },
  foodName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  confidenceBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  caloriesCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#10B981',
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  nutritionDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nutritionSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  macroCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  macroCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  macroCardLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailedNutrition: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#374151',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 12,
  },
  primaryGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
