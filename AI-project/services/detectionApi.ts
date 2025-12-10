const API_BASE_URL = 'http://192.168.68.57:5000';

export const detectFood = async (imageUri: string) => {
  try {
    console.log("Processing image URI:", imageUri);

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'food.jpg',
    } as any);

    console.log("Sending request to backend...");
    const response = await fetch(`${API_BASE_URL}/api/detect`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Server responded with error:', result);
      throw new Error(result.error || 'Detection failed');
    }

    console.log("Detection successful:", result);
    return result;
    
  } catch (error) {
    console.error('Detection API error:', error);
    throw new Error('network error');
  }
};