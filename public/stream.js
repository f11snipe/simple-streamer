window.onload = () => {
    document.getElementById('start').onclick = () => {
        init();
        document.getElementById('start').style.display = 'none';
        document.getElementById('video').style.display = 'block';
        document.getElementById('chat-wrapper').style.opacity = '0.65';
        document.getElementById('guest-wrapper').style.opacity = '0.65';
    }

    document.getElementById('sendMessage').onclick = () => {
        const message = document.getElementById('message').value;

        sendMessage({ name: 'STREAM', message });
    };
}

async function sendMessage(payload) {
    const { data } = await axios.post('/chat', payload);
    console.log('sendMessage', payload, data);
}

async function init() {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
            width: 1920,
            height: 1080,
        }
    });
    document.getElementById("video").srcObject = stream;
    const peer = createPeer();
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
}


function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            },
            {
                urls: "turn:18.207.91.238:3478",
                username: 'sss',
                credential: 'getstreamed',
            }
        ]
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        secret: localStorage.getItem('streamSecret'),
        sdp: peer.localDescription
    };

    const { data } = await axios.post('/broadcast', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}


