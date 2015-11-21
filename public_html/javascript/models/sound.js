//window.AudioContext = window.AudioContext || window.webkitAudioContext;
//var audioContext = new AudioContext();
//
//var sound = function (options) {
//        // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
//     
//
//
//        var that = this;
//        that.url = options.url;
//        that.loop = options.loop || false;
//        that.loopStart = options.loopStart || 0;
//        that.loopEnd = options.loopEnd || "auto";
//        that.buffer = null;
//        that.ready = false;
//        that.loaded = options.callback || null;
//        that.source = null;
//        that.currentTime = 0;
//        that.paused = false;
//        that.playing = false;
//        that.volume = options.volume || 0.5;
//        that.allowMultipleInstances = options.allowMultipleInstances || false;
//
//        this.play = function () {
//
//            if (that.ready) {
//                if (that.playing && !that.allowMultipleInstances) {
//                    that.source.stop();
//                }
//
//                that.source = audioContext.createBufferSource(); // creates a sound source
//                that.source.buffer = that.buffer;           // tell the source which sound to play
//               // that.source.connect(context.destination);   // connect the source to the context's destination (the speakers)
//                that.source.loop = that.loop;
//                that.source.loopStart = that.loopStart;
//                that.source.loopEnd = that.loopEnd;
//               
//
//                // Create a gain node.
//                var gainNode = audioContext.createGain();
//                // Connect the source to the gain node.
//                that.source.connect(gainNode);
//                // Connect the gain node to the destination.
//                gainNode.connect(audioContext.destination);
//                // Reduce the volume.
//                gainNode.gain.value = that.volume;
//
//
//
//                if (that.paused) {
//                    that.paused = false;
//                    that.source.start(0, that.currentTime); //play after 0s delay, offset of last time
//                }
//                else {
//                    that.source.start(0); // play now
//                }
//                that.playing = true;
//
//                that.source.onended = function () {
//                    if (!that.source.loop) {
//                        that.playing = false;
//                    }
//                }
//
//            }
//            else {
//                console.log("WARNING: you tried to play an audio file before it was loaded.")
//            }
//
//         
//        }
//        this.stop = function () {
//            that.source.stop();
//        }
//        this.pause = function () {
//            that.paused = true;
//            // console.log(that.source)
//            that.currentTime = that.source.context.currentTime;
//            //  console.log(that.currentTime)
//            that.source.stop();
//        }
//
//        var request = new XMLHttpRequest();
//        request.open('GET', that.url, true);
//        request.responseType = 'arraybuffer';
//        // Decode asynchronously
//        request.onload = function () {
//            audioContext.decodeAudioData(request.response, function (bufffer) {
//                that.buffer = bufffer;
//                //console.log(that.buffer)
//                if (that.loopEnd == "auto") {
//                    that.loopEnd = that.buffer.duration;
//                }
//                that.ready = true;
//                if (that.loaded)
//                    that.loaded();
//
//            }, function (e, v, t) {
//                console.log("error", e, v, t)
//            });
//        }
//        request.send();
//    }
//
//var sound_dot = new sound({
//    url: "sounds/dot.mp3",
//    volume: 0.2,
//    allowMultipleInstances:true   
//});
//var sound_dot2 = new sound({
//    url: "sounds/dot2.mp3",
//    volume: 0.2,
//    allowMultipleInstances: true
//});
//
//var sound_pacman_background1 = new sound({
//    url: "sounds/pacman_background1.mp3",
//    loop: true,
//    loopEnd: 1.999
//});
//var sound_pacman_power1 = new sound({
//    url: "sounds/pacman_power1.mp3",
//    loop: true
//});
//var sound_pacman_death = new sound({
//    url: "sounds/pacman_death.mp3"  
//});
//var sound_pacman_getghost = new sound({
//    url: "sounds/pacman_getghost.mp3",
//    allowMultipleInstances: true
//});
//
