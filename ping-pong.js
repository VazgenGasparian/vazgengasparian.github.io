
let ping = 0;

function setPingButton(pingButton){
    pingButton.innerText = ping.toFixed(0).padStart(3,'0')+'ms';
    const hue = ((999-ping)/1000*120).toFixed();
    pingButton.style.backgroundColor="hsl("+hue+",100%,50%)";
}


function sendPing(pingButton, conn, dt){
    ping=Math.min(ping*0.812345679+(ping+dt)*(1-0.812345679), 999);
    setPingButton(pingButton);
    conn.send('{}');
    const rand=  Math.random()*250;
    setTimeout(()=>{
        sendPing(pingButton, conn, rand);
    }, rand);
}

function pong(pingButton){
    ping=ping*0.812345679;
    setPingButton(pingButton);
    pongSound();
}