window.onload = () => {
    document.getElementById('view').onclick = () => {
        init();
        const name = document.getElementById('name').value;
        alert(`Welcome to the party, ${name}`);
        document.getElementById('register').style.display = 'none';
        document.getElementById('video').style.display = 'block';
    }
}

async function init() {
    const peer = createPeer();
    peer.addTransceiver("video", { direction: "recvonly" })
}

function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    const { data } = await axios.post('/consumer', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}

function handleTrackEvent(e) {
    document.getElementById("video").srcObject = e.streams[0];
};

