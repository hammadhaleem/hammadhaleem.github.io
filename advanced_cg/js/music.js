var music_list = [
    'http://hammadhaleem.com/advanced_cg/music/kenney_floreat_irrational.mp3',
    'http://hammadhaleem.com/advanced_cg/music/dark_chant_master.mp3',
];

function init_audio() {

    // init the library
    var webaudio = new WebAudio();
    // create a sound
    sound = webaudio.createSound();
    // load sound.wav and play it
    sound.load(music_list[0], function(sound) {
        sound.play();
    });
    if (sound)
        music_is_active = true;

}
