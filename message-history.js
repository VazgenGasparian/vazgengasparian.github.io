const messageHistory = [];
let messageHistoryIndex = messageHistory.length;

function onKeyUpDown(sendFiel, key) {
    if(key==='ArrowUp') messageHistoryIndex = Math.max(messageHistoryIndex-1, 0);
    if(key==='ArrowDown') messageHistoryIndex = Math.min(messageHistoryIndex+1, messageHistory.length-1);
    if((key==='ArrowUp' || key==='ArrowDown')){
        if(messageHistory[messageHistoryIndex]) sendField.value = messageHistory[messageHistoryIndex];
    } else {
        //messageHistoryIndex = messageHistory.length;
    }
}

function addToMessageHistory(data){
    messageHistory.push(data);
    messageHistoryIndex = messageHistory.length;
}