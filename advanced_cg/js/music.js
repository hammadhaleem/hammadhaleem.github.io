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


function set_max_x_y_z(Vector_point){
        if (Vector_point.x > max_x){
            max_x = Vector_point.x;
        }

        if (Vector_point.y > max_y){
            max_y = Vector_point.y;
        }


        if (Vector_point.z > max_z){
            max_z = Vector_point.z;
        }
}