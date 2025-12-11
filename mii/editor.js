indexButtons()

function indexButtons(){
    for (let i = 0; i < document.getElementsByTagName("button").length; i++) {
        const element = document.getElementsByTagName("button")[i];
        element.setAttribute("onmouseover", 'playSound("../assets/sfx/press.wav")')
        element.setAttribute("onmousedown", '; playSound("../assets/sfx/press.wav")')
    }
}

function playSound(path){
    console.log(`Playing sound: ${path}`)
    var a = document.createElement("audio")
    a.src = path
    a.pause()
    a.currentTime = 0
    a.play()
}

function openEditor(){
    document.getElementById("beforeEditor").setAttribute("fade", "")
    document.getElementById("beforeEditor").onanimationend = () => {
        document.getElementById("beforeEditor").remove()
        var n = document.createElement("div")
        n.id = "editor"
            var div = document.createElement("div")
            n.append(div)
            div2 = document.createElement("div")
            div2.id = "a"
            n.append(div2)
        document.body.append(n)
        playMusic("assets/sfx/settings-main.wav")
    }
}

function playMusic(src){
    // var actx = new (AudioContext || webkitAudioContext)(),
    //     audioData, srcNode;

    // // Load some audio (CORS need to be allowed or we won't be able to decode the data)
    // fetch(src, {mode: "cors"}).then(function(resp) {return resp.arrayBuffer()}).then(decode);

    // // Decode the audio file, then start the show
    // function decode(buffer) {
    // actx.decodeAudioData(buffer, playLoop);
    // }

    // // Sets up a new source node as needed as stopping will render current invalid
    // function playLoop(abuffer) {
    // if (!audioData) audioData = abuffer;  // create a reference for control buttons
    // srcNode = actx.createBufferSource();  // create audio source
    //     srcNode.buffer = abuffer;             // use decoded buffer
    //     srcNode.connect(actx.destination);    // create output
    //     srcNode.loop = true;                  // takes care of perfect looping
    //     srcNode.start();                      // play...
    // }
    document.getElementsByTagName("audio").src = src
    document.getElementsByTagName("audio").play()
}