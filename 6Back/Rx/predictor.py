import os
import inspect
import numpy as np
from PIL import Image
from django.conf import settings

# --- 1. COMPATIBILITY LOADER (Keep this, it works great) ---
_CUSTOM_OBJECTS = {}
try:
    import tensorflow as tf  
    from tensorflow import keras as tfk 
    class DepthwiseConv2DCompat(tfk.layers.DepthwiseConv2D):
        # Drop legacy/unknown args such as `groups`
        def __init__(self, *args, groups=None, **kwargs):
            kwargs.pop("groups", None)
            super().__init__(*args, **kwargs)
    _CUSTOM_OBJECTS.update({
        "Functional": tfk.Model,
        "Sequential": tfk.Sequential,
        "DepthwiseConv2D": DepthwiseConv2DCompat,
    })
except Exception:
    tf = None; tfk = None  

def _call_loader(loader_fn, path):
    sig = inspect.signature(loader_fn)
    kwargs = {"compile": False}
    if "safe_mode" in sig.parameters: kwargs["safe_mode"] = False
    if "custom_objects" in sig.parameters: kwargs["custom_objects"] = _CUSTOM_OBJECTS
    return loader_fn(path, **kwargs)

def _load_model_compat(path):
    if not os.path.exists(path): raise FileNotFoundError(f"Missing: {path}")
    
    # Priority: TensorFlow Keras
    last_err = None
    if tfk:
        try:
            return _call_loader(tfk.models.load_model, path)
        except Exception as err:
            last_err = err
            print(f"[ModelLoad] tf.keras load_model failed: {err}")
            import traceback; traceback.print_exc()
    
    # Fallback: Standalone Keras
    try:
        import keras
        return _call_loader(keras.models.load_model, path)
    except Exception as err:
        last_err = err if last_err is None else last_err
        print(f"[ModelLoad] keras load_model failed: {err}")
        import traceback; traceback.print_exc()
    
    raise RuntimeError(f"Could not load {path}. Last error: {last_err}")

# --- 2. PREDICTOR LOGIC ---
_diagnosis_model = None

def get_model():
    global _diagnosis_model
    # Pointing to your NEW DenseNet model
    model_path = os.path.join(settings.BASE_DIR, 'Rx', 'ml_models', 'local_chest_xray.h5')
    
    if _diagnosis_model is None:
        print(f"🏥 Loading DenseNet Model from: {model_path}...")
        _diagnosis_model = _load_model_compat(model_path)
        
    return _diagnosis_model

def preprocess_image(image_file):
    """
    Standardize image for DenseNet121.
    Input: Image file
    Output: (1, 224, 224, 3) Array with 0-255 values
    """
    img = Image.open(image_file)
    if img.mode != "RGB": img = img.convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict_xray(image_file):
    try:
        model = get_model()
        img_array = preprocess_image(image_file)
        
        # PREDICTION
        diagnosis_score = model.predict(img_array)[0][0]
        
        # THRESHOLD: 0.50 (Standard) because your Sensitivity is already 96%
        is_pneumonia = diagnosis_score > 0.50
        
        # Calculate Display Confidence
        # If score is 0.9 -> 90% Pneumonia
        # If score is 0.1 -> 90% Normal (1.0 - 0.1)
        if is_pneumonia:
            confidence = diagnosis_score
            label = "PNEUMONIA"
        else:
            confidence = 1.0 - diagnosis_score
            label = "NORMAL"
            
        return {
            "diagnosis": label,
            "confidence": float(confidence),
            "raw_score": float(diagnosis_score),
            "sensitivity_warning": "High Sensitivity Mode" # Tag for the UI
        }

    except Exception as e:
        # Log full stack trace to server console for easier debugging
        import traceback
        traceback.print_exc()
        return {"error": "PREDICTION_FAILED", "message": str(e)}
    

    
# import os
# import inspect
# import numpy as np
# from PIL import Image
# from django.conf import settings

# # --- 1. COMPATIBILITY LOADER SETUP ---
# # This block ensures we can load the model regardless of whether 
# # the server is running TensorFlow or Standalone Keras.
# _CUSTOM_OBJECTS = {}

# try:
#     import tensorflow as tf  
#     from tensorflow import keras as tfk 
#     _CUSTOM_OBJECTS.update({
#         "Functional": tfk.Model,
#         "Sequential": tfk.Sequential,
#     })
# except Exception:
#     tf = None  
#     tfk = None  

# def _call_loader(loader_fn, path, custom_objects=None):
#     """
#     Helper to call load_model with safe arguments for different Keras versions.
#     """
#     sig = inspect.signature(loader_fn)
#     kwargs = {"compile": False} # valid for inference, prevents optimizer warnings
    
#     if "safe_mode" in sig.parameters:
#         kwargs["safe_mode"] = False
#     if custom_objects and "custom_objects" in sig.parameters:
#         kwargs["custom_objects"] = custom_objects
        
#     return loader_fn(path, **kwargs)

# def _load_model_compat(path):
#     """
#     Tries multiple ways to load the model to handle version mismatches.
#     """
#     if not os.path.exists(path):
#         raise FileNotFoundError(f"Model file not found at: {path}")

#     loaders = []
    
#     # Priority 1: TensorFlow Keras (standard for .h5)
#     if tfk:
#         loaders.append(("tf.keras.models.load_model", lambda: _call_loader(tfk.models.load_model, path, _CUSTOM_OBJECTS)))

#     # Priority 2: Standalone Keras (backup)
#     try:
#         import keras 
#         if hasattr(keras, "saving"):
#             loaders.append(("keras.saving.load_model", lambda: _call_loader(keras.saving.load_model, path, _CUSTOM_OBJECTS)))
#         loaders.append(("keras.models.load_model", lambda: _call_loader(keras.models.load_model, path, _CUSTOM_OBJECTS)))
#     except Exception:
#         pass

#     last_err = None
#     for name, loader in loaders:
#         try:
#             model = loader()
#             print(f"✅ [Model Loader] Successfully loaded '{os.path.basename(path)}' via {name}")
#             return model
#         except Exception as err:
#             last_err = err
#             print(f"⚠️ [Model Loader] {name} failed: {err}")

#     raise RuntimeError(f"Could not load model at {path}. Last error: {last_err}")


# # --- 2. MODEL MANAGEMENT ---

# _filter_model = None
# _diagnosis_model = None

# def get_models():
#     """
#     Loads your specific .h5 models into memory.
#     """
#     global _filter_model, _diagnosis_model
    
#     models_dir = os.path.join(settings.BASE_DIR, 'Rx', 'ml_models')
    
#     # A. Load Filter Model (The Gatekeeper)
#     if _filter_model is None:
#         filter_path = os.path.join(models_dir, 'FILTER-MODEL.keras')
#         try:
#             print(f"🔄 Loading Filter Model from: {filter_path}...")
#             _filter_model = _load_model_compat(filter_path)
#         except Exception as e:
#             print(f"⚠️ Warning: Filter model failed to load. Skipping filter step. Error: {e}")
#             _filter_model = "DISABLED" 
        
#     # B. Load Diagnosis Model (Your NEW Local Model)
#     if _diagnosis_model is None:
#         # POINTING DIRECTLY TO YOUR NEW LOCAL MODEL
#         diagnosis_path = os.path.join(models_dir, 'local_chest_xray.h5')

#         try:
#             print(f"🔄 Loading Diagnosis Model from: {diagnosis_path}...")
#             _diagnosis_model = _load_model_compat(diagnosis_path)
#         except Exception as e:
#             # Fallback only if necessary, but we expect the local one to work
#             print(f"❌ Critical: Diagnosis model load failed: {e}")
#             raise RuntimeError(f"Diagnosis model load failed: {e}")
        
#     return _filter_model, _diagnosis_model


# def preprocess_image(image_file):
#     """
#     Prepares image for MobileNetV2.
#     1. RGB Conversion
#     2. Resize to 224x224
#     3. No manual normalization (Model has Rescaling layer)
#     """
#     img = Image.open(image_file)
    
#     if img.mode != "RGB":
#         img = img.convert("RGB")
    
#     # MobileNetV2 standard input size
#     img = img.resize((224, 224))
    
#     img_array = np.array(img)
#     img_array = np.expand_dims(img_array, axis=0) # Shape: (1, 224, 224, 3)
    
#     return img_array


# def predict_xray(image_file):
#     try:
#         filter_model, diagnosis_model = get_models()
#     except Exception as e:
#         return {
#             "error": "MODEL_LOAD_FAILED",
#             "message": f"Server could not load AI models: {e}"
#         }

#     try:
#         img_array = preprocess_image(image_file)
#     except Exception as e:
#         return {
#             "error": "INVALID_IMAGE_FILE",
#             "message": f"Unable to process image file: {e}"
#         }

#     # 1. RUN FILTER (If available)
#     if filter_model and filter_model != "DISABLED":
#         try:
#             is_xray_score = filter_model.predict(img_array)[0][0]
#             # Assuming 0=Not Xray, 1=Is Xray. Adjust threshold if needed.
#             if is_xray_score < 0.1: 
#                 return {
#                     "error": "INVALID_IMAGE",
#                     "message": "This image does not appear to be a Chest X-ray.",
#                     "debug_score": float(is_xray_score)
#                 }
#         except Exception as e:
#             print(f"Filter prediction error (ignoring): {e}")

#     # 2. RUN DIAGNOSIS
#     try:
#         diagnosis_score = diagnosis_model.predict(img_array)[0][0]
        
#         # Sigmoid Output: 0.0 to 1.0
#         # 0.0 = Normal, 1.0 = Pneumonia
#         is_pneumonia = diagnosis_score > 0.5
        
#         # Calculate confidence
#         if is_pneumonia:
#             confidence = diagnosis_score
#         else:
#             confidence = 1.0 - diagnosis_score
        
#         return {
#             "diagnosis": "PNEUMONIA" if is_pneumonia else "NORMAL",
#             "confidence": float(confidence),
#             "raw_score": float(diagnosis_score)
#         }
#     except Exception as e:
#         return {
#             "error": "PREDICTION_FAILED",
#             "message": f"AI Inference failed: {e}"
#         }