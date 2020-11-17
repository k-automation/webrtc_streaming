import cv2
import numpy as np
from webrtc_streaming import start_streaming

"""
    This example:
        - Connect to signaling server and wait for viewers who know the secret key

    This custom video capture generates an white noise streaming
"""


class MyOwnVideoCapture:
    def __init__(self):
        pass

    def read(self):
        return True, np.random.randint(
            255, size=(720, 1280, 3), dtype=np.uint8)


start_streaming(signaling_server="https://webrtc-signaling-server-demo.herokuapp.com",
                secret_key="my_webcam_123",
                video_capture=MyOwnVideoCapture())
