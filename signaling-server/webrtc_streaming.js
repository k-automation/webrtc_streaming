
class WebRTCStreaming {
    constructor () {}

    initialize(url_signaling_server, secret_key, use_stun, video_element, audio_element) {
        this.pc = null;
        this.url_signaling_server = url_signaling_server;
        this.secret_key = secret_key;
        this.use_stun = use_stun;
        this.video_element = video_element;
        this.audio_element = audio_element;
    }

    negotiate() {
        let me = this;
        this.pc.addTransceiver('video', {
            direction: 'recvonly'
        });
        this.pc.addTransceiver('audio', {
            direction: 'recvonly'
        });
        return this.pc.createOffer().then(function(offer) {
            return me.pc.setLocalDescription(offer);
        }).then(function() {
            // wait for ICE gathering to complete
            return new Promise(function(resolve) {
                if (me.pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    function checkState() {
                        if (me.pc.iceGatheringState === 'complete') {
                            me.pc.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    }
                    me.pc.addEventListener('icegatheringstatechange', checkState);
                }
            });
        }).then(function() {
            var offer = me.pc.localDescription;
            let socket = io.connect(me.url_signaling_server);
    
            socket.on("connect", () => {
                socket.emit("join_room", {
                    "room_id": me.secret_key,
                    "offer": {
                        sdp: offer.sdp,
                        type: offer.type,
                    }
                });
            });
    
            socket.on("offer", (answer) => {
                console.log("viewer received this offer: ");
                console.log(JSON.stringify(answer));
                me.pc.setRemoteDescription(answer);
            });
    
        });
    }

    start() {
        var config = {
            sdpSemantics: 'unified-plan'
        };
    
        if (this.use_stun) {
            config.iceServers = [{
                urls: ['stun:stun.l.google.com:19302']
            }];
        }
    
        this.pc = new RTCPeerConnection(config);
    
        // connect audio / video
        let me = this;
        this.pc.addEventListener('track', function(evt) {
            if (evt.track.kind == 'video') {
                me.video_element.srcObject = evt.streams[0];
            } else {
                me.audio_element.srcObject = evt.streams[0];
            }
        });
    
        this.negotiate();
    }

    stop() {
        // close peer connection
        let me = this;
        setTimeout(function() {
            me.pc.close();
        }, 500);
    }
}

