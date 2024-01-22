const textDiv = document.getElementById('textDiv');
const tentativeLeft = document.getElementById('tentativeLeft');
const tentativeRight = document.getElementById('tentativeRight');
const textContentDiv = document.getElementById('textContentDiv');
const scrollIndicator = document.getElementById('scrollIndicator');
const pingButton = document.getElementById('pingButton');
const sendField = document.getElementById('sendField');

let myId;
const peer = new Peer();


function connect(){
    let conn = peer.connect(document.getElementById('peerIdField').value);
    conn.on('open', function() {
        onConn(conn);
    });
}

peer.on('open', function(id) {
    myId=id;
    // console.log('My peer ID is: ' + id);
    document.getElementById('myId').value= id;
    document.getElementById('myLink').value= window.location.href+'?'+id;
    if(searchParams.length>0) {
        document.getElementById('peerIdField').value=searchParams[0];
        connect();
    }
});



scrollIndicator.onclick=()=>{
    textDiv.scrollTo(0, textDiv.scrollHeight);
    scrollIndicator.hidden=true;
}
textDiv.onscroll=()=>{
    scrollIndicator.hidden = (textDiv.scrollHeight-textDiv.scrollTop-textDiv.clientHeight)<200;
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
            pong(pingButton);
        }
    }
}

function send(conn, tentative = false) {
    if( !tentative && sendField.value === "") return;

    // Send messages
    const data = sendField.value;
    if(!tentative){
        addToMessageHistory(data);
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
    sendPing(pingButton, conn, Math.random()*250);

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
        if(['ArrowUp', 'ArrowDown'].includes(event.key))onKeyUpDown(sendField, event.key);
        send(conn, event.key !== 'Enter');
    }
}
peer.on('connection', function(conn) {
    // console.log(conn);
    onConn(conn);
});

document.getElementById('connectToButton').onclick=()=>connect();

