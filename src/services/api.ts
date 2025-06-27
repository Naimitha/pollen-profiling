import { UploadResponse } from '../types';

// Mock ML model predictions for Brazilian Savannah (Cerrado) pollen grains
const pollenPredictions = [
  {
    class: 'Anadenanthera colubrina',
    confidence: 0.92,
    probabilities: {
      'Anadenanthera colubrina': 0.92,
      'Mimosa pudica': 0.04,
      'Acacia polyphylla': 0.03,
      'Inga vera': 0.01
    }
  },
  {
    class: 'Byrsonima verbascifolia',
    confidence: 0.89,
    probabilities: {
      'Byrsonima verbascifolia': 0.89,
      'Byrsonima coccolobifolia': 0.06,
      'Byrsonima crassa': 0.03,
      'Heteropterys byrsonimifolia': 0.02
    }
  },
  {
    class: 'Curatella americana',
    confidence: 0.94,
    probabilities: {
      'Curatella americana': 0.94,
      'Davilla elliptica': 0.03,
      'Doliocarpus dentatus': 0.02,
      'Tetracera breyniana': 0.01
    }
  },
  {
    class: 'Dipteryx alata',
    confidence: 0.87,
    probabilities: {
      'Dipteryx alata': 0.87,
      'Bowdichia virgilioides': 0.07,
      'Platypodium elegans': 0.04,
      'Machaerium acutifolium': 0.02
    }
  },
  {
    class: 'Eugenia dysenterica',
    confidence: 0.91,
    probabilities: {
      'Eugenia dysenterica': 0.91,
      'Psidium guajava': 0.05,
      'Campomanesia adamantium': 0.03,
      'Myrcia bella': 0.01
    }
  },
  {
    class: 'Hancornia speciosa',
    confidence: 0.88,
    probabilities: {
      'Hancornia speciosa': 0.88,
      'Aspidosperma tomentosum': 0.06,
      'Himatanthus obovatus': 0.04,
      'Tabernaemontana hystrix': 0.02
    }
  },
  {
    class: 'Kielmeyera coriacea',
    confidence: 0.93,
    probabilities: {
      'Kielmeyera coriacea': 0.93,
      'Kielmeyera speciosa': 0.04,
      'Calophyllum brasiliense': 0.02,
      'Vismia guianensis': 0.01
    }
  },
  {
    class: 'Mauritia flexuosa',
    confidence: 0.96,
    probabilities: {
      'Mauritia flexuosa': 0.96,
      'Syagrus oleracea': 0.02,
      'Attalea speciosa': 0.01,
      'Acrocomia aculeata': 0.01
    }
  },
  {
    class: 'Qualea grandiflora',
    confidence: 0.90,
    probabilities: {
      'Qualea grandiflora': 0.90,
      'Qualea parviflora': 0.05,
      'Vochysia thyrsoidea': 0.03,
      'Salvertia convallariodora': 0.02
    }
  },
  {
    class: 'Stryphnodendron adstringens',
    confidence: 0.85,
    probabilities: {
      'Stryphnodendron adstringens': 0.85,
      'Dimorphandra mollis': 0.08,
      'Plathymenia reticulata': 0.05,
      'Enterolobium gummiferum': 0.02
    }
  },
  {
    class: 'Tabebuia aurea',
    confidence: 0.89,
    probabilities: {
      'Tabebuia aurea': 0.89,
      'Handroanthus ochraceus': 0.06,
      'Cybistax antisyphilitica': 0.03,
      'Jacaranda brasiliana': 0.02
    }
  },
  {
    class: 'Vellozia squamata',
    confidence: 0.92,
    probabilities: {
      'Vellozia squamata': 0.92,
      'Barbacenia flava': 0.04,
      'Vellozia compacta': 0.03,
      'Barbacenia purpurea': 0.01
    }
  }
];

const getRandomPollenPrediction = () => {
  return pollenPredictions[Math.floor(Math.random() * pollenPredictions.length)];
};

export const uploadImageForPrediction = async (file: File): Promise<UploadResponse> => {
  try {
    // Simulate network delay for realistic ML processing experience
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file (JPG, PNG, WebP)');
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image file is too large. Please upload an image smaller than 10MB');
    }

    // Get a random mock pollen prediction
    const prediction = getRandomPollenPrediction();

    return {
      success: true,
      prediction: {
        class: prediction.class,
        confidence: prediction.confidence,
        probabilities: prediction.probabilities
      }
    };

  } catch (error) {
    console.error('Error processing pollen image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred during pollen analysis'
    };
  }
};

// For production use with your actual ML model server, replace the above mock implementation with:
/*
const API_BASE_URL = 'http://localhost:5000'; // Your ML model server URL

export const uploadImageForPrediction = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      // Add any required headers for your ML server
      headers: {
        // 'Authorization': 'Bearer your-token-here', // if authentication is required
        // 'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ML server error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      prediction: {
        class: data.class,
        confidence: data.confidence,
        probabilities: data.probabilities
      }
    };

  } catch (error) {
    console.error('Error uploading image to ML server:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect to ML model server'
    };
  }
};
*/