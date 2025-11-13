from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .ml_model import predict_image


class WastePredictView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('image')
        if not file_obj:
            print("No image received in request")
            return JsonResponse({"error": "No image received"}, status=400)

        # Run prediction
        start_time,end_time,label, scores = predict_image(file_obj)

        # Print response details to terminal
        print("\n================= NEW PREDICTION =================")
        print(f"Image Name      : {file_obj.name}")
        print(f"Predicted Class : {label}")
        print(f"Confidence Scores: {scores}")
        print(f"interfrence :{end_time-start_time:.4f}secs")
        print("=================================================\n")

        # Send JSON response to client
        return JsonResponse({
            "predicted_class": label,
            "confidence_scores": scores,
            # "interfernce" :{end_time-start_time:.4f}secs)

        })
