window.onload = () => {
    document.getElementById('view').onclick = () => {
        const name = document.getElementById('name').value;

        if (name && name.trim().length > 2) {
            init();
            document.getElementById('register').style.display = 'none';
            document.getElementById('video').style.display = 'block';
            document.getElementById('details').style.opacity = '1';
            document.getElementById('chat-wrapper').style.opacity = '0.65';
            document.getElementById('guest-wrapper').style.opacity = '0.65';
        } else {
            alert('Please enter at least 3 characters');
        }
    };

    document.getElementById('sendMessage').onclick = () => {
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;

        sendMessage({ name, message });
    };
}

async function sendMessage(payload) {
    const { data } = await axios.post('/chat', payload);
    console.log('sendMessage', payload, data);
    document.getElementById('message').value = '';
}

async function init() {
    const peer = createPeer();
    peer.addTransceiver("video", { direction: "recvonly" })
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
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const name = document.getElementById('name').value;
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription,
        name
    };

    const { data } = await axios.post('/consumer', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}

function handleTrackEvent(e) {
    document.getElementById("video").srcObject = e.streams[0];
};

