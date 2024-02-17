const sleep = ms => new Promise(r => setTimeout(r, ms));

let listening = false;
const startButton = document.getElementById('start');
const output = document.getElementById('output');
output.innerHTML = '';
output.innerHTML += '<code class="log">Initializing...</code>';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = continuous.checked;
recognition.lang = lang.value;
recognition.interimResults = false;
recognition.maxAlternatives = 1;


continuous.oninput = e => {recognition.continuous = continuous.checked; readyLog()}
lang.oninput = e => {recognition.lang = lang.value; readyLog()}

function start() {
    recognition.start();
    startButton.innerHTML = 'STOP';
    startButton.classList.add('rec')
    header.classList.add('rec')

    listening = true;
}

function stop() {
    // recognition.abort();
    recognition.stop();
    startButton.innerHTML = 'START';
    
    startButton.classList.remove('rec')
    header.classList.remove('rec')
    listening = false;
}

async function restart() {
    output.innerHTML += '<div><code class="log">    RESTART</code>' + `<small>${now(lang.value)}</small></div>`;
    scrollEnd()
    stop();
    await sleep(1);
    start();
}

startButton.addEventListener('click', event => {
    (listening == false) ? start() : stop()

});

console.dir(recognition);

readyLog()

recognition.onstart = event => {
    console.log('recognition started');
    output.innerHTML += '<div><code class="log">🔍 recognition started</code>' + `<small>${now(lang.value)}</small></div>`;
    scrollEnd()
};

recognition.onaudiostart = event => {
    console.log('audiostart');
    output.innerHTML += '<div><code  class="log">🔊 audio started</code>' + `<small>${now(lang.value)}</small></div>`;
    scrollEnd()
};

recognition.onsoundstart = event => {
    console.log('soundstart');
    output.innerHTML += '<div><code class="log">🎵 sound started</code>' + `<small>${now(lang.value)}</small></div>`;
    scrollEnd()
};

recognition.onspeechstart = event => {
    console.log('speechstart');
    output.innerHTML += '<div><code class="log">🗣 speech started</code>' + `<small>${now(lang.value)}</small></div>`;
    scrollEnd()
};

recognition.onspeechend = event => {
    console.log('speechend');
    output.innerHTML += '<div><code class="log">🗣 speech ended</code>' + `<small>${now(lang.value)}</small></div>`;
    recognition.stop();
    scrollEnd()
    if (listening) start();

};

recognition.onsoundend = event => {
    console.log('soundend');
    output.innerHTML += '<div><code class="log">🎵 sound ended</code>' + `<small>${now(lang.value)}</small></div>`;
    scrollEnd()
    if (listening) start();

};

recognition.onaudioend = event => {
    console.log('audioend');
    output.innerHTML += '<div><code class="log">🔊 audio ended</code>' + `<small>${now(lang.value)}</small></div>`;
    scrollEnd()
    // if (listening) restart();
    if (listening) start();
};

recognition.onend = event => {
    console.log('recognition stopped');
    output.innerHTML += '<div><code class="log">🔍 recognition stopped</code>' + `<small>${now(lang.value)}</small></div>`;
    scrollEnd()
    if (listening) start();

};

recognition.onresult = event => {
    let transcript = event.results[0][0].transcript;
    let confidence = event.results[0][0].confidence;

    output.innerHTML += '<code class="ok">' + transcript + '</code>';
    output.innerHTML += '<div><code class="log">confidence: ' + confidence + '</code>' + `<small>${now(lang.value)}</small></div>`;
    scrollEnd()
};

recognition.onerror = event => {
    console.log('Error: occurred in recognition: ' + event.error);
    output.innerHTML += '<div><code  class="error">ERROR: ' + event.error + '</code>' + `<small>${now(lang.value)}</small></div>`;
    scrollEnd()
};

//
// `<span>${now(lang.value)}</span>`
//
function now(locale) {
    const date = new Date();
    const opt = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        fractionalSecondDigits: 3
    };
    return date.toLocaleTimeString(locale, opt);
}

function scrollEnd() {
    output.scrollTop = output.scrollHeight;
}

function readyLog() {
    output.innerHTML += '<div><code class="log">READY </code>' + `<small>${now(lang.value)}</small></div>`;

    output.innerHTML += `<div><code class="log">Lang: ${recognition.lang} </code><small>${now(lang.value)}</small></div>`

    output.innerHTML += `<div><code class="log">Continuous: ${recognition.continuous} </code><small>${now(lang.value)}</small></div>`

    scrollEnd()
}