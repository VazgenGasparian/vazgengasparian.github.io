
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