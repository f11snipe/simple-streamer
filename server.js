const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const LocalStorage = require('node-localstorage').LocalStorage;
const webrtc = require("wrtc");
const localStorage = new LocalStorage('./scratch');

const getCache = (key, val) => {
    try {
        const cached = localStorage.getItem(key);

        if (cached) {
            return JSON.parse(cached);
        }

        return val;
    } catch (err) {
        return val;
    }
};

const putCache = (key, val) => {
    return localStorage.setItem(key, JSON.stringify(val));
};

let senderStream;
const history = getCache('history', []);
const consumers = getCache('consumers', []);

setInterval(() => {
    putCache('history', history);
    putCache('consumers', consumers);
}, 2000);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/info", async (req, res) => {
    res.json({
        history,
        consumers
    });
});

app.post("/chat", async ({ body }, res) => {
    const { message, name } = body;

    if (message && name) {
        history.push({
            time: Date.now(),
            name,
            message
        });

        res.json({ success: true, message: 'Message Sent' });
    } else {
        res.json({ success: false, message: 'Unable to send message' });
    }
});

app.post("/consumer", async ({ body }, res) => {
    const { name } = body;
    if (name) consumers.push({ name, time: Date.now() });
    const peer = new webrtc.RTCPeerConnection({
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
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

app.post('/broadcast', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
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
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
};


app.listen(5000, () => console.log('server started'));