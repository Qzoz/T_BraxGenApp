const {ipcRenderer} = require('electron');

setTimeout(openSplachAction, 500);

function openSplachAction() {
    setTimeout(function() {
        document.getElementById('qz_splash_container').style.width = '100%';
        setTimeout(function(){
            document.getElementsByClassName('qz_author')[0].style.display = 'block';
            document.getElementById('qz_splash_content').style.display = "block";
            document.getElementById('qz_splash_content').classList.add('qz_anim_slow_up');
            setTimeout(function(){
                document.getElementById('proceed').classList.add('qz_anim_slow_up');
                document.getElementById('proceed').style.display = 'block';
            }, 4800);
        }, 1200);
    }, 1200);
}


function closeSplashAction (elem) {
    elem.classList.remove('qz_anim_slow_up');
    elem.classList.add('qz_anim_slow_down');
    setTimeout(function(){
        elem.style.display = 'none';
    }, 1200);
    setTimeout(function(){
        document.getElementsByClassName('qz_author')[0].style.display = 'none';
        document.getElementById('qz_splash_content').classList.remove('qz_anim_slow_up');
        document.getElementById('qz_splash_content').classList.add('qz_anim_slow_down');
        setTimeout(function(){
            document.getElementById('qz_splash_content').style.display = "none";
            document.getElementById('qz_splash_container').style.left = "100%";
            document.getElementById('qz_splash_container').style.width = "0px";
            setTimeout(function(){
                ipcRenderer.send('child-call', ['start-app']);
            }, 1200);
        }, 1200);
    }, 1600);
}