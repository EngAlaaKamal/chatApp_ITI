console.log("Welcome to the chat app");
const apptitle = document.getElementById("apptitle");
const content_div = document.getElementById('content');
const send_button = document.getElementById('send_button');
const message_input = document.getElementById('message');
const username = prompt("Please enter your username: ");

apptitle.innerHTML = `Chat App ${username}`;

const ws = new WebSocket('ws://localhost:8000');  

ws.onopen = function () {
    const data = {
        name: username,
        login: true
    };
    this.send(JSON.stringify(data));
};

ws.onmessage = function (event) {
    const message_content = JSON.parse(event.data);
    content_div.innerHTML += `<h3>${message_content.content}</h3>`;
};

send_button.addEventListener('click', function (event) {
    const usermessage = message_input.value;
    const data = {
        name: username,
        body: usermessage
    };
    ws.send(JSON.stringify(data));
    message_input.value = '';
});

ws.onerror = function (event) {
    content_div.innerHTML += `<h2 style="color:red;">Error connecting to server</h2>`;
};
