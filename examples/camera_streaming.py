import cv2
from webrtc_streaming import start_streaming

"""
    This example:
        - Connect to signaling server and wait for viewers who know the secret key

    If video_capture arg is not provided, it will use cv2.VideoCapture(-1) by default
"""

start_streaming(signaling_server="https://webrtc-signaling-server-demo.herokuapp.com",
                secret_key="my_webcam_123")
