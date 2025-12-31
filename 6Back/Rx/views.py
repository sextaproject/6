from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .predictor import predict_xray

@csrf_exempt 
def analyze_xray(request):
    if request.method == 'POST':
        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image provided'}, status=400)
        
        image_file = request.FILES['image']
        
        try:
            result = predict_xray(image_file)
            
            # Check if our logic returned an internal error (like invalid image)
            if "error" in result:
                # Map known errors to appropriate HTTP codes
                error_code = result.get("error")
                if error_code in ("INVALID_IMAGE", "INVALID_IMAGE_FILE"):
                    status_code = 400
                elif error_code in ("MODEL_LOAD_FAILED", "PREDICTION_FAILED"):
                    status_code = 500
                else:
                    status_code = 400
                return JsonResponse(result, status=status_code)
                
            return JsonResponse(result)
        
        except Exception as e:
            print(f"Server Error: {e}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)