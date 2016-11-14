
var music_list = [
  'http://hammadhaleem.com/advanced_cg/music/kenney_floreat_irrational.mp3',
  'http://hammadhaleem.com/advanced_cg/music/dark_chant_master.mp3',
];

function loadAudioBuffer(url) {
    // Load asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        context.decodeAudioData(
            request.response,
            function(b) {
                audioBuffer = b;
                finishLoad();  // add in the slider, etc. now that we've loaded the audio
            },

            function(buffer) {
                console.log("Error decoding human voice!");
            }
        );
    }

    request.send();
}

function initAudio() {
    context = new AudioContext();

    source = context.createBufferSource();
    analyser = context.createAnalyser();
    analyser.fftSize = 2048;

    // Connect audio processing graph
    source.connect(analyser);
    analyser.connect(context.destination);

    loadAudioBuffer(music_list[0]);
}

function draw() {
    analyserView1.doFrequencyAnalysis();
    window.requestAnimationFrame(draw);
}

function finishLoad() {
    source.buffer = audioBuffer;
    source.loop = true;
    source.start(0.0);

    window.requestAnimationFrame(draw);
}
