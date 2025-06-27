import streamlit as st
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import gzip
import shutil
import os

# Configure Streamlit page
st.set_page_config(
    page_title="Pollen Grain Classifier",
    page_icon="🌸",
    layout="wide"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        text-align: center;
        color: #2E8B57;
        font-size: 3rem;
        margin-bottom: 2rem;
    }
    .prediction-box {
        background-color: #f0f8f0;
        padding: 20px;
        border-radius: 10px;
        border-left: 5px solid #2E8B57;
        margin: 20px 0;
    }
    .confidence-bar {
        background-color: #e0e0e0;
        border-radius: 10px;
        overflow: hidden;
        margin: 10px 0;
    }
    .confidence-fill {
        background-color: #2E8B57;
        height: 20px;
        text-align: center;
        line-height: 20px;
        color: white;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_resource
def load_model_and_classes():
    """Load the model and class mapping with caching for better performance"""
    try:
        # Check if compressed model exists and decompress if needed
        if os.path.exists("pollen_classifier_model.keras.gz") and not os.path.exists("pollen_classifier_model.keras"):
            st.info("Decompressing model file...")
            with gzip.open("pollen_classifier_model.keras.gz", "rb") as f_in:
                with open("pollen_classifier_model.keras", "wb") as f_out:
                    shutil.copyfileobj(f_in, f_out)
            st.success("Model decompressed successfully!")

        # Load model
        model = tf.keras.models.load_model('pollen_classifier_model.keras')
        
        # Load class mapping
        with open('class_mapping.json', 'r') as f:
            class_names = json.load(f)
        
        return model, class_names
    except Exception as e:
        st.error(f"Error loading model or class mapping: {str(e)}")
        return None, None

def preprocess_image(image):
    """Preprocess the uploaded image for model prediction"""
    try:
        # Convert to RGB if image has alpha channel
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        
        # Resize to model input size
        image = image.resize((224, 224))
        
        # Convert to numpy array and normalize
        image_array = np.array(image) / 255.0
        
        # Add batch dimension
        return np.expand_dims(image_array, axis=0)
    except Exception as e:
        st.error(f"Error preprocessing image: {str(e)}")
        return None

def get_top_predictions(predictions, class_names, top_k=3):
    """Get top k predictions with confidence scores"""
    # Get indices of top predictions
    top_indices = np.argsort(predictions[0])[::-1][:top_k]
    
    results = []
    for idx in top_indices:
        class_name = class_names.get(str(idx), f"Class {idx}")
        confidence = predictions[0][idx] * 100
        results.append((class_name, confidence))
    
    return results

# Main UI
st.markdown('<h1 class="main-header">🌸 Pollen Grain Classifier</h1>', unsafe_allow_html=True)

st.markdown("""
<div style="text-align: center; margin-bottom: 2rem;">
    <p style="font-size: 1.2rem; color: #666;">
        Upload an image of a pollen grain to identify its type using our AI model
    </p>
</div>
""", unsafe_allow_html=True)

# Load model and classes
model, class_names = load_model_and_classes()

if model is None or class_names is None:
    st.error("Failed to load the model or class mapping. Please check your files.")
    st.stop()

# Create two columns for layout
col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("📤 Upload Image")
    uploaded_file = st.file_uploader(
        "Choose a pollen grain image", 
        type=["jpg", "png", "jpeg"],
        help="Upload a clear image of a pollen grain for classification"
    )
    
    if uploaded_file:
        try:
            image = Image.open(uploaded_file)
            st.image(image, caption='Uploaded Image', use_column_width=True)
            
            # Add image info
            st.info(f"Image size: {image.size[0]} x {image.size[1]} pixels")
            
        except Exception as e:
            st.error(f"Error loading image: {str(e)}")
            image = None
    else:
        image = None

with col2:
    st.subheader("🔍 Classification Results")
    
    if image is not None:
        with st.spinner("Analyzing pollen grain..."):
            # Preprocess image
            input_image = preprocess_image(image)
            
            if input_image is not None:
                try:
                    # Make prediction
                    predictions = model.predict(input_image, verbose=0)
                    
                    # Get top predictions
                    top_predictions = get_top_predictions(predictions, class_names, top_k=3)
                    
                    # Display main prediction
                    main_class, main_confidence = top_predictions[0]
                    
                    st.markdown(f"""
                    <div class="prediction-box">
                        <h3 style="color: #2E8B57; margin-bottom: 10px;">🎯 Primary Classification</h3>
                        <h2 style="color: #1a5c3a; margin: 0;">{main_class.title()}</h2>
                        <p style="font-size: 1.1rem; margin: 5px 0;">Confidence: {main_confidence:.1f}%</p>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    # Display confidence bar
                    st.markdown(f"""
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: {main_confidence}%;">
                            {main_confidence:.1f}%
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    # Display top 3 predictions
                    st.subheader("📊 Top 3 Predictions")
                    for i, (class_name, confidence) in enumerate(top_predictions):
                        icon = "🥇" if i == 0 else "🥈" if i == 1 else "🥉"
                        st.write(f"{icon} **{class_name.title()}**: {confidence:.1f}%")
                        
                        # Progress bar for each prediction
                        st.progress(confidence / 100)
                    
                except Exception as e:
                    st.error(f"Error during prediction: {str(e)}")
            else:
                st.error("Failed to preprocess the image.")
    else:
        st.info("👆 Upload an image to see classification results")

# Sidebar with information
st.sidebar.header("ℹ️ About")
st.sidebar.markdown("""
**Pollen Grain Classifier** uses deep learning to identify different types of pollen grains.

**Supported Classes:**
""")

# Display all available classes in sidebar
if class_names:
    for idx, class_name in class_names.items():
        st.sidebar.write(f"• {class_name.title()}")

st.sidebar.markdown("""
---
**Tips for best results:**
- Use clear, well-lit images
- Ensure the pollen grain is the main subject
- Avoid blurry or low-resolution images
- JPG, PNG, and JPEG formats are supported
""")

# Footer
st.markdown("""
---
<div style="text-align: center; color: #666; padding: 20px;">
    <p>🌸 Pollen Grain Classifier | Powered by TensorFlow & Streamlit</p>
</div>
""", unsafe_allow_html=True)