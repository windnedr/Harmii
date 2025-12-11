document.addEventListener("scroll", (event) => {
    // alert(window.scrollY)
    lastKnownScrollPosition = window.scrollY;
    document.body.style = `background-position-y: ${-lastKnownScrollPosition / 2}px, 0`;
});

var connected = false
var muspitch = 1
var username = "HarmoniiUser"
var username = localStorage.getItem("username")
var miivoices = {
    path: "assets/sfx/mii/",
    length: 15,
    conditions: [{
        string: "ok",
        id: 2
    }]
}
var miiAPI = "https://mii-unsecure.ariankordi.net/miis/image.png?data="
var websocket
var lastWSerror
onscroll = (event) => { }

//stolen
const escapeHtml = unsafe => {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

function popup(type) {
    if (type == "close"){
        document.getElementById("popupbg").remove()
        stopMusic()
    } else {
        var bg = document.createElement("div")
        bg.id = "popupbg"
        bg.className = "popupbg"
            var btn = document.createElement("button")
            btn.id = "back"
            btn.innerText = "Close"
            btn.setAttribute("onclick", `popup("close"); stopMusic()`)
            bg.appendChild(btn)
        var popup = document.createElement("div")
        popup.className = "popup"

        if (type == "settings"){
            playMusic("assets/sfx/settings-main.wav")
            var pdiv = document.createElement("div")
            pdiv.className = "settings"
                var name = document.createElement("input")
                name.type = "text"
                name.placeholder = "Username"
                name.id = "usrnam"
                name.value = localStorage.getItem("username")
                pdiv.append(name)

                var mcdimg = document.createElement("img")
                mcdimg.id = "mcdimg"
                mcdimg.src = `https://mii-unsecure.ariankordi.net/miis/image.png?data=${localStorage.getItem("char")}`
                mcdimg.style = `background-color: ${localStorage.getItem("char/color")}`
                mcdimg.className = "mcdimg"
                pdiv.append(mcdimg)

                var edtbtn = document.createElement("button")
                edtbtn.innerText = "Edit Mii"
                edtbtn.className = "small"
                edtbtn.setAttribute("onclick", 'popup("close"); popup("char")')
                pdiv.append(edtbtn)

                var accbtn = document.createElement("button")
                accbtn.innerText = "That's me!"
                accbtn.setAttribute("onclick", 'localStorage.setItem("username", document.getElementById("usrnam").value); username = document.getElementById("usrnam").value; popup("close");')
                pdiv.append(accbtn)
            popup.append(pdiv)
        }
        if (type == "char"){
            playMusic("assets/sfx/settings-mii.wav")
            var pdiv = document.createElement("div")
            pdiv.className = "settings"
                var mcdimg = document.createElement("img")
                mcdimg.id = "mcdimg"
                mcdimg.src = `https://mii-unsecure.ariankordi.net/miis/image.png?data=${localStorage.getItem("char")}`
                mcdimg.style = `background-color: ${localStorage.getItem("char/color")}`
                mcdimg.className = "mcdimg"

                pdiv.append(mcdimg)

                var mcdlab = document.createElement("label")
                mcdlab.innerText = "Character ID: "
                pdiv.append(mcdlab)
                var mcd = document.createElement("input")
                mcd.type = "text"
                mcd.setAttribute("onchange", "charprev()")
                mcd.placeholder = "Mii data"
                mcd.id = "charID"
                mcd.value = localStorage.getItem("char")
                pdiv.append(mcd)

                var collab = document.createElement("label")
                collab.innerText = "Color:"
                    var col = document.createElement("input")
                    col.type = "color"
                    col.style = "display: none; width: 0; height: 0; opacity: 0;"
                    col.setAttribute("onchange", "charprev()")
                    col.id = "charCol"
                    col.value = localStorage.getItem("char/color")
                    collab.append(col)
                    var fill = document.createElement("div")
                    fill.id = "colorfillin"
                    fill.style = `background-color: ${localStorage.getItem("char/color")}`
                    collab.append(fill)
                pdiv.append(collab)

                var accbtn = document.createElement("button")
                accbtn.innerText = "That's me!"
                accbtn.setAttribute("onclick", 'localStorage.setItem("char", document.getElementById("charID").value); localStorage.setItem("char/color", document.getElementById("charCol").value); popup("close"); popup("settings")')
                pdiv.append(accbtn)
            popup.append(pdiv)
        } if (type = "roomErr"){
            var pdiv = document.createElement("div")
            pdiv.className = "settings"
                var title = document.createElement("h1")
                title.innerText = `An error occurred D:`
                var p = document.createElement("p")
                p.innerText = `${lastWSerror}`

                pdiv.append(title)
                pdiv.append(p)
            popup.append(pdiv)
        } if (type = "roomcClose"){
            var pdiv = document.createElement("div")
            pdiv.className = "settings"
                var title = document.createElement("h1")
                title.innerText = `Room closed D:`
                var p = document.createElement("p")
                p.innerText = `${lastWSerror}`

                pdiv.append(title)
                pdiv.append(p)
            popup.append(pdiv)
        }

        bg.append(popup)
        document.body.append(bg)
    }

    indexButtons()
}
function charprev(){
    document.getElementById("mcdimg").src = `https://mii-unsecure.ariankordi.net/miis/image.png?data=${document.getElementById("charID").value}`
    document.getElementById("mcdimg").style = `background-color: ${document.getElementById("charCol").value}`
    document.getElementById("colorfillin").style = `background-color: ${document.getElementById("charCol").value}`
}

function connectToWebsocket(wsurl){
    loadScreenInit()
    websocket = new WebSocket(wsurl);
    websocket.onopen = (e) => {
        websocket.send("&&j-" + username);
    }
    websocket.onmessage = (e) => {
        var scrollScreen = false
        if (Math.abs(chatScreen().scrollHeight - chatScreen().clientHeight - chatScreen().scrollTop) <= 1){
            scrollScreen = true
        }
        if (!connected){
            document.body.addEventListener("keyup", (e) => {
                if (e.key == "Enter") {
                    sendMessage()
                }
            })
            loadScreenRemove(1)
        }
        chatScreen()
        connected = true
        var j = JSON.parse(e.data)
        if (j.username == "&&HarmonyServer"){
            if (j.message.includes(" joined the room!")){
                playSound("assets/sfx/enter.wav")
            }
            if (j.message.includes(" left the room.")){
                playSound("assets/sfx/leave.wav")
            }

            displayMessage("server", j.message, j.username, {})
        } else {
            playSound(miivoices.path + Math.floor(Math.random() * miivoices.length + 1) + ".wav")
            if (j.username == username){
                displayMessage("you", j.message, j.username, j.char)
            } else {
                if (j.char){
                    displayMessage("nyou", j.message, j.username, j.char)
                } else {
                    displayMessage("nyou", j.message, j.username, {
                        data: "0800400308040402020c0301060406020a0000000000000804000a0100214004000214031304170d04000a040109",
                        background: "#880044ff"
                    })
                }
            }
        }
        if (scrollScreen){
            chatScreen().scrollBy({top: 100, behavior: "instant"});
        }
    }

    websocket.onclose = (e) => {
        loadScreenRemove(2)
        connected = false
        popup("roomClosed");
    }
    websocket.addEventListener("error", (event) => {
        lastWSerror = event
        popup("roomErr");
    });
}
function sendMessage(){
    var j = {
        username: username,
        message: document.getElementById("bartxt").value,
        char: {
            data: localStorage.getItem("char"),
            background: localStorage.getItem("char/color")
        },
    }
    document.getElementById("bartxt").value = ""
    websocket.send(JSON.stringify(j))
}
function checkAndScroll(){
    var cdDOM = chatScreen()
}

function loadScreenInit(){
    var bg = document.createElement("div")
    bg.id = "loaddiv"
    bg.className = "popupbg"
    var spinner = document.createElement("img")
    spinner.src = "assets/load.svg"
    spinner.id = "spinner"
    bg.append(spinner)

    document.body.append(bg)
}
function loadScreenRemove(status){
    if (document.getElementById("loaddiv")){
        document.getElementById("loaddiv").remove()
    }
    if (status == 1){
        playSound("assets/sfx/conn.wav")
    }
    if (status == 2){
        playSound("assets/sfx/disc.wav")
    }
}
function chatScreen(){
    if (document.getElementById("chatdiv")){
        return document.getElementById("chatdiv");
    } else {
        console.log("Couldn't find chat screen; Creating new...")
        var cd = document.createElement("div")
        cd.id = "chatdiv"
        cd.onscroll = (event) => {
            var cdDOM = chatScreen()
            cdDOM.style = `background-position-y: ${-cdDOM.scrollTop / 2}px, 0;`
        }
            var msgcont = document.createElement("div")
            msgcont.id = "msgcont"
            cd.append(msgcont)
        var msgbar = document.createElement("div")
        msgbar.id = "msgbar"
            var bar = document.createElement("input")
            bar.type = "text"
            bar.placeholder = "Type away!"
            bar.id = "bartxt"
            msgbar.append(bar)
            var btn = document.createElement("button")
            btn.innerText = ">"
            btn.setAttribute("onclick", 'sendMessage()')
            msgbar.append(btn)
        cd.append(msgbar)
        

        document.body.style = "overflow: hidden;"
        document.body.append(cd)
        indexButtons()
        return document.getElementById("chatdiv");
    }
}
function displayMessage(type, message, username, charInfo){
    var payload = document.createElement("div")
    payload.id = "message"
    if (type == "server"){
        payload.className = "server"
        payload.append(message) 
    }
    if (type == "nyou"){
        payload.className = "nyou"
        var nameplate = document.createElement("p")
            nameplate.className = "username"
            nameplate.innerText = username
        var m = document.createElement("p")
            m.className = "message"
            m.innerHTML = stylizeText(escapeHtml(message))
        payload.append(m) 
        payload.append(nameplate) 
    }
    if (type == "you"){
        payload.className = "you"
        var d = document.createElement("div")
            var nameplate = document.createElement("p")
                nameplate.className = "username"
                nameplate.innerText = username
            var m = document.createElement("p")
                m.className = "message"
                m.innerHTML = stylizeText(escapeHtml(message))
                d.append(m)
            // var char = document.createElement("img")
            //     char.src = `${miiAPI}${charInfo.data}`
            //     char.style = `background-color: ${char.background}; height: 32px;`
            //     char.className = "mcdimg"
            //     d.append(char)
        
        payload.append(d) 
        payload.append(nameplate) 
    }
    document.getElementById("msgcont").append(payload)
}

function indexButtons(){
    for (let i = 0; i < document.getElementsByTagName("button").length; i++) {
        const element = document.getElementsByTagName("button")[i];
        element.setAttribute("onmouseover", 'playSound("assets/sfx/press.wav")')
        element.setAttribute("onmousedown", '; playSound("assets/sfx/press.wav")')
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
function playMusic(path){
    document.getElementById("mus").src = path
    document.getElementById("mus").pause()
    document.getElementById("mus").currentTime = 0
    document.getElementById("mus").setAttribute("loop", "")
    document.getElementById("mus").play()
}
var s
function stopMusic(){
    // s = setInterval(changemuspitch, 1)
    document.getElementById("mus").pause()
}
function changemuspitch(){
    muspitch -= 0.01
    if (muspitch <= 0){
        muspitch = 1
        document.getElementById("mus").pause()
        clearInterval(s)
    }
    document.getElementById("mus").mozPreservesPitch = false;
    document.getElementById("mus").preservesPitch = false;
    document.getElementById("mus").playbackRate = muspitch;
    document.getElementById("mus").volume = muspitch;

    
}
function stylizeText(text){
  var t = text.split(" ")
  var arr = []
  for (let i = 0; i < t.length; i++) {
    const element = t[i];
    var final = element
    // <e:http://example.com/>
    if (element.includes("&lt;e:")){
      console.log(element)
      var url = element.replace("&lt;e:", "").replace("&gt;", "")
      final = `<img class="emoji" src=${url}>`
    }
    // <img:http://example.com>
    if (element.includes("&lt;img:")){
      console.log(element)
      var url = element.replace("&lt;img:", "").replace("&gt;", "")
      final = `<img class="full" src=${url}>`
    }
    arr.push(final)
  }
  var fin = arr.join(' ')
  return fin
}
indexButtons()