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