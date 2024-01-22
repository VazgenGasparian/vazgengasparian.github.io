const search = window.location.search;
const spr = (search.length>0) ? window.location.search.split('?') : [];
const searchParams = spr.length > 0 ? spr[1].split('&') : [];
console.log(searchParams);


document.getElementById('copyButton').onclick=()=> {
    let copyText = document.getElementById("myId");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
}
document.getElementById('copyLinkButton').onclick=()=>{
    let copyText = document.getElementById("myLink");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
    // alert("Copied the text: " + copyText.value);
}
document.getElementById('pasteButton').onclick=()=>{
    navigator.clipboard.readText().then((text)=>{
        document.getElementById("peerIdField").value=text;
        // alert("pasted the text: " + text);
    });

}

let ping = 0;
const pingButton = document.getElementById('pingButton');
function setPingButton(){
    pingButton.innerText = ping.toFixed(0).padStart(3,'0')+'ms';
    const hue = ((999-ping)/1000*120).toFixed();
    pingButton.style.backgroundColor="hsl("+hue+",100%,50%)";
}

function connect(){
    let conn = peer.connect(document.getElementById('peerIdField').value);
    conn.on('open', function() {
        onConn(conn);
    });
}


let myId;
const peer = new Peer();
peer.on('open', function(id) {
    myId=id;
    console.log('My peer ID is: ' + id);
    document.getElementById('myId').value= id;
    document.getElementById('myLink').value= window.location.href+'?'+id;
    if(searchParams.length>0) {
        document.getElementById('peerIdField').value=searchParams[0];
        connect();
    }

});

const textDiv = document.getElementById('textDiv');
const tentativeLeft = document.getElementById('tentativeLeft');
const tentativeRight = document.getElementById('tentativeRight');
const textContentDiv = document.getElementById('textContentDiv');
const scrollIndicator = document.getElementById('scrollIndicator');
scrollIndicator.onclick=()=>{
    textDiv.scrollTo(0, textDiv.scrollHeight);
    scrollIndicator.hidden=true;
}
textDiv.onscroll=()=>{
    scrollIndicator.hidden = (textDiv.scrollHeight-textDiv.scrollTop-textDiv.clientHeight)<200;
}

function sendPing(conn, dt){
    ping=Math.min(ping*0.812345679+(ping+dt)*(1-0.812345679), 999);
    setPingButton();
    conn.send('{}');
    const rand=  Math.random()*250;
    setTimeout(()=>{
        sendPing(conn, rand);
    }, rand);
}

function pong(){
    ping=ping*0.812345679;
    setPingButton();
    pongSound();
}

function handleDataMessage(data){
    // console.log('Received', data);
    const obj = JSON.parse(data);

    switch(obj.type){
        case 'data':{
            if(obj.tentative) {
                tentativeLeft.innerHTML=obj.data;
                tentativeLeft.hidden=(!obj.data || obj.data==="");
                typeSound();
            } else{
                textContentDiv.innerHTML += `<div class="bubble left-bubble" >` + obj.data + `</div>`;
                tentativeLeft.hidden=true;
                sendSound();
            }
            if((textDiv.scrollHeight-textDiv.scrollTop-textDiv.clientHeight)<200) {
                textDiv.scrollTo(0, textDiv.scrollHeight);
            } else {
                scrollIndicator.hidden = false;
            }
        }
        default:{
            pong();
        }
    }
}

const sendField = document.getElementById('sendField');

const messageHistory = [];
let messageHistoryIndex = messageHistory.length;

function send(conn, tentative = false) {
    if( !tentative && sendField.value === "") return;


    // Send messages
    const data = sendField.value;
    if(!tentative){
        messageHistory.push(data);
        messageHistoryIndex = messageHistory.length;
    }
    // console.log(data);
    conn.send(JSON.stringify({
        type:'data',
        tentative: tentative,
        data: data
    }));

    if(!tentative) {
        textContentDiv.innerHTML += `<div class="bubble right-bubble" >` + data + `</div>`;
        sendField.value = "";
        textDiv.scrollTo(0, textDiv.scrollHeight);
        sendField.focus();
    }
    tentativeRight.hidden=sendField.value==="";
    tentativeRight.innerHTML=sendField.value;
}

function onConn(conn) {
    console.log('onCOnn');
    sendPing(conn, Math.random()*250);

    conn.on('data', (data)=>handleDataMessage(data));
    document.getElementById('myIdDiv').style.display = 'none';
    document.getElementById('myLinkDiv').style.display = 'none';
    // document.getElementById('myId').disabled = true;
    // document.getElementById('copyButton').hidden = true;
    document.getElementById('connectDiv').style.display = 'none';
    document.getElementById('connectedDiv').style.display = 'inherit';
    document.getElementById('sendDiv').style.display = 'block';
    document.getElementById('peerId').value = conn.peer;


    document.getElementById('sendButton').onclick = ()=>send(conn, false);
    document.getElementById('sendField').onkeydown = (event) => {

    }
    document.getElementById('sendField').onkeyup = (event) => {
        if(event.key==='ArrowUp') messageHistoryIndex = Math.max(messageHistoryIndex-1, 0);
        if(event.key==='ArrowDown') messageHistoryIndex = Math.min(messageHistoryIndex+1, messageHistory.length-1);
        if((event.key==='ArrowUp' || event.key==='ArrowDown')){
            if(messageHistory[messageHistoryIndex]) sendField.value = messageHistory[messageHistoryIndex];
        } else {
            //messageHistoryIndex = messageHistory.length;
        }
        // console.log(event);
        send(conn, event.key !== 'Enter');
    }
}
peer.on('connection', function(conn) {
    console.log(conn);
    onConn(conn);
});





document.getElementById('connectToButton').onclick=()=>connect();

function pongSound() {
    var snd = new Audio("data:audio/wav;base64,UklGRvYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YdIAAAB+AQwDvgMNBC8EPgREBEUERARCBD8EPAQ4BCgEGAQIBPgD5wPWA8UDtAOjA5EDfwNuA1wDSgM4AyYDFAMCA+8C3QLLArkCpgKUAoICcAJeAkwCOgIoAhcCBQL0AeMB0QHAAbABnwGPAX8BbwFfAU8BQAExASIBFAEGAfgA6gDdANAAwwC3AKsAnwCUAIkAfgB0AGoAYABXAE4ARgA+ADYALwAoACIAHAAWABEADAAIAAQAAQD+//v/+f/3//b/9f/0//T/9f/1//f/+P/6//3/AAA="
    );        snd.play();
}
function sendSound() {
    var snd = new Audio("data:audio/wav;base64,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"
    );        snd.play();
}
function typeSound() {
    var snd = new Audio("data:audio/wav;base64,UklGRvYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YdIAAADYEcwjOiqWKmQn5iHOGpYSoglOAPP26O1+5WDel9hO1KTRqdBa0ajTddeW3NXi8emn8az5twF+Cb0QNhe0HAshHCTVJS8mMCXsIn8fExvVFf0PwwljAxn9Hfej8djs4+jg5ePj9eIU4zbkR+Yr6b/s3PBX9QH6sP41A2sHLAtbDuIQsBK9EwkUmxOAEswQlw79Cx4JGQYNAxkAWf3j+sz4Ivft9TP18PQe9bH1nPbL9yz5qvow/Kv9Cv89ADsB+wF5ArcCtwKCAiECogETAYMAAAA="

    );        snd.play();
}
//https://dopiaza.org/tools/datauri/index.php
//https://sfxr.me/

const pongSoundAudio = {
    "oldParams": true,
    "wave_type": 2,
    "p_env_attack": 0,
    "p_env_sustain": 0.010650664216556442,
    "p_env_punch": 0,
    "p_env_decay": 0.030481519081001895,
    "p_base_freq": 0.185,
    "p_freq_limit": 0,
    "p_freq_ramp": -0.02464002586613301,
    "p_freq_dramp": 0,
    "p_vib_strength": 0,
    "p_vib_speed": 0,
    "p_arp_mod": 0,
    "p_arp_speed": 0,
    "p_duty": 1,
    "p_duty_ramp": 0,
    "p_repeat_speed": 0,
    "p_pha_offset": 0,
    "p_pha_ramp": 0,
    "p_lpf_freq": 1,
    "p_lpf_ramp": 0,
    "p_lpf_resonance": 0,
    "p_hpf_freq": 0.9779854417720638,
    "p_hpf_ramp": 0,
    "sound_vol": 0.59,
    "sample_rate": 44100,
    "sample_size": 16,
    "p_vib_delay": null
};

const sendSoundAudio = {
    "oldParams": true,
    "wave_type": 2,
    "p_env_attack": -0.020927237553133526,
    "p_env_sustain": 0.057381145226296934,
    "p_env_punch": 0.025941197250850007,
    "p_env_decay": 0.06900518173369946,
    "p_base_freq": 0.436,
    "p_freq_limit": 0,
    "p_freq_ramp": 0.09130241350702992,
    "p_freq_dramp": 0.01824458012741286,
    "p_vib_strength": -0.012527099802734861,
    "p_vib_speed": 0.028895518374173448,
    "p_arp_mod": 0.03485359095321754,
    "p_arp_speed": -0.09889331107055338,
    "p_duty": 1.0143778248152502,
    "p_duty_ramp": -0.050754032092864734,
    "p_repeat_speed": 0.094207700211494,
    "p_pha_offset": -0.007967664900331212,
    "p_pha_ramp": -0.110425600712027,
    "p_lpf_freq": 1.0038676853591362,
    "p_lpf_ramp": 0.054300559196102126,
    "p_lpf_resonance": 0.056233767577508295,
    "p_hpf_freq": 0.8617164529738174,
    "p_hpf_ramp": 0.03451145954983263,
    "sound_vol": 0.776,
    "sample_rate": 44100,
    "sample_size": 16,
    "p_vib_delay": null
};

const typeSoundAudio = {
    "oldParams": true,
    "wave_type": 2,
    "p_env_attack": 0,
    "p_env_sustain": 0.010650664216556442,
    "p_env_punch": 0,
    "p_env_decay": 0.030481519081001895,
    "p_base_freq": 0.61,
    "p_freq_limit": 0,
    "p_freq_ramp": -0.02464002586613301,
    "p_freq_dramp": 0,
    "p_vib_strength": 0,
    "p_vib_speed": 0,
    "p_arp_mod": 0,
    "p_arp_speed": 0,
    "p_duty": 1,
    "p_duty_ramp": 0,
    "p_repeat_speed": 0,
    "p_pha_offset": 0,
    "p_pha_ramp": 0,
    "p_lpf_freq": 1,
    "p_lpf_ramp": 0,
    "p_lpf_resonance": 0,
    "p_hpf_freq": 0.9779854417720638,
    "p_hpf_ramp": 0,
    "sound_vol": 0.647,
    "sample_rate": 44100,
    "sample_size": 16
};