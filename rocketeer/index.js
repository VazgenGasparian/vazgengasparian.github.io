window.state = 'waiting';
window.countDownTime = 5;
window.countDownTimer = window.countDownTime;
window.placedBet = 0;
window.playingBet = 0;
window.multiplier = 1;

window.increDecrementButtonAction = (amount, min, max) => {
    let val = Number(document.getElementById('bet').value);
    val+=amount;
    if(val < min) val = min;
    if(val > max) val = max;
    val = val.toFixed(2);
    document.getElementById('bet').value = val;
}

window.placeBetButtonAction = () => {
    if(window.playingBet === 0) {
        if(window.placedBet === 0){
            window.placedBet = Math.min(Number(document.getElementById('balance').value), Number(document.getElementById('bet').value));
            document.getElementById('balance').value = (Math.max(document.getElementById('balance').value - document.getElementById('bet').value,0)).toFixed(2);

        } else {
            document.getElementById('balance').value = (Number(document.getElementById('balance').value) + window.placedBet).toFixed(2);
            window.placedBet = 0;
        }
    } else {
        document.getElementById('balance').value = (Number(document.getElementById('balance').value) + window.playingBet * multiplier).toFixed(2);
        window.playingBet = 0;
    }
}

window.setBetValue = (val) => {
    document.getElementById('bet').value = val;
}

setInterval(()=> {
    const multiplierDiv = document.getElementById('multiplierDiv');
    multiplierDiv.innerText = ''+multiplier.toFixed(2)+'x';
}, 100);

let lastFrameTime = performance.now();
const loop = function() {
    if(document.getElementById('multiplyCheck').checked){
        multiplier *= document.getElementById('exponent').value;
    }
    document.getElementById('countDownDiv').style.width = (countDownTimer/countDownTime*100)+'%';
    document.getElementById('stateDiv').innerText = window.state;
    document.getElementById('placeBet').innerText = (window.playingBet === 0)
        ? (            (window.placedBet===0)
                ? 'Bet ' +document.getElementById('bet').value+' USD'
                : 'Cancel'
        )
        : (
            'Cash Out ' +(playingBet * multiplier).toFixed(2) +' USD'
        )

    const currentTime = performance.now();
    const deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    switch (window.state) {
        case 'waiting':
            window.countDownTimer -= deltaTime;
            if (window.countDownTimer <= 0) {
                window.countDownTimer = 0;
                window.playingBet = window.placedBet;
                window.placedBet = 0;
                window.state = 'flying';
            }
            break;
        case 'flying':
            document.getElementById('multiplyCheck').checked = true;
            if (Math.random() < Number(document.getElementById('flyChance').value)) {
                window.state = 'escaped';
                window.playingBet = 0;
                window.escapedTimer = 3;

            }
            break;
        case 'escaped':
            document.getElementById('multiplyCheck').checked = false;
            window.escapedTimer -= deltaTime;
            if (window.escapedTimer <= 0) {
                window.countDownTimer = window.countDownTime;
                window.multiplier = 1;
                window.state = 'waiting';
            }
            break;
    }
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
