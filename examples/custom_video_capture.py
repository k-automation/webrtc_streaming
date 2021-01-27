import cv2
import sys
import numpy as np
from webrtc_streaming import start_streaming

"""
    This example:
        - Connect to signaling server and wait for viewers who know the secret key

    This custom video capture generates an white noise streaming.
    If video_capture arg is not provided, it will use cv2.VideoCapture(-1) by default.
"""


args = sys.argv
assert len(args) == 2, "No secret key provided or more arguments were given than expected"
secret_key = args[1]

class MyOwnVideoCapture:
    def __init__(self):
        pass

    def read(self):
        return True, np.random.randint(
            255, size=(720, 1280, 3), dtype=np.uint8)


start_streaming(signaling_server="https://webrtc-signaling-server-demo.herokuapp.com",
                secret_key=secret_key,
                video_capture=MyOwnVideoCapture())
