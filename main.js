const { BrowserWindow, app, ipcMain, dialog, Menu, Notification, shell } = require("electron");
const path = require("path");
const url = require("url");

let devEnv = 'development'
let proEnv = 'production'

let win, win1;

let tournamentObjPassed = undefined;

process.env.NODE_ENV = devEnv;

let windowsOptions = [{
    label: 'Full Screen',
    click() {
        toggleFullScreen();
    },
    accelerator: 'CommandOrControl + Shift + F'
}]

if (process.env.NODE_ENV == devEnv) {
    windowsOptions.push({
        label: 'OpenDevTools',
        click() {
            win.webContents.openDevTools();
        },
        accelerator: 'CommandOrControl + Shift + I'
    });
    windowsOptions.push({
        label: 'Reload',
        click() {
            win.webContents.reload();
        },
        accelerator: 'CommandOrControl + Shift + R'
    });
}

var currentPageID = -1;

const windowTemplate = {
    show: false,
    webPreferences: {
        nodeIntegration: true
    }
}

const windowTemplateSplash = {
    transparent : true,
    frame : false,
    show: false,
    webPreferences: {
        nodeIntegration: true
    }
}

const menuTemplate = [{
    label: '&Action',
    submenu: [
        {
            label: 'Go to Home',
            click() {
                if (currentPageID > 0) {
                    gotoHome();
                }
            },
            accelerator: 'CommandOrControl + Shift + H'
        },
        { type: 'separator' },
        {
            label: 'Exit',
            click() {
                app.quit();
            },
            accelerator: 'CommandOrControl + Q'
        },
    ]
},
{
    label: '&View',
    submenu: [
        {
            label: 'Home Page Style',
            submenu:[{
                label: "Black Major",
                click() {
                    if (currentPageID == 0) {
                        sendDataToChild('parent-call', 'change-style', 'assets/css/qz_data_viewer_1.css');
                    }
                }
            },{
                label: "White Major",
                click() {
                    if (currentPageID == 0) {
                        sendDataToChild('parent-call', 'change-style', 'assets/css/qz_data_viewer_2.css');
                    }
                }
            }]
        },
        {
            label: 'Tournament Page Style',
            submenu:[{
                label: "Fire theme",
                click() {
                    if (currentPageID == 1) {
                        sendDataToChild('parent-call', 'change-style',
                        ['../assets/css/brax/brax_css_1.css', '../assets/css/brax/brax_modal_1.css']);
                    }
                }
            },{
                label: "Snowy theme",
                click() {
                    if (currentPageID == 1) {
                        sendDataToChild('parent-call', 'change-style', 
                        ['../assets/css/brax/brax_css_2.css', '../assets/css/brax/brax_modal_2.css']);
                    }
                }
            }]
        },
    ]
},
{
    label: '&Windows',
    submenu: windowsOptions
},
{
    label: '&Help',
    submenu: [
        {
            label: 'About',
            submenu: [{
                label:"Author",
                submenu: [{
                    label:"Name: Mohammad Zaid Quaraishi"
                },{
                    label:"Email: mzq7080@gmail.com"
                },{
                    label:"Origin: Lucknow, UP, India"
                },{
                    label:"Github",
                    submenu: [{
                        label:"github.com/Qzoz",
                        click() {
                            shell.openExternal('https://github.com/Qzoz').catch(err => {console.log(err)});
                        }
                    }]
                }]
            },{
                label:"Application",
                click() {
                    shell.openExternal('https://github.com/Qzoz/T_BraxGenApp').catch(err => {console.log(err)});
                }
            }]
        },{
            label:"Report Issues",
            click() {
                shell.openExternal('https://github.com/Qzoz/T_BraxGenApp/issues').catch(err => {console.log(err)});
            }
        },
        { type: 'separator' },
        {
            label: 'Force Exit',
            click() {
                app.exit(0);
            },
            accelerator: 'CommandOrControl + Shift + Q'
        }
    ]
}]

const imagefileFilters = [
    { name: 'png', extensions: ['png'] },
    { name: 'jpeg/jpg', extensions: ['jpg'] }
]

const savefileFilters = [
    { name: 'HTML', extensions: ['html','htm'] },
    { name: 'CSV', extensions: ['csv'] }
]

function createWindow() {
    win1 = new BrowserWindow(windowTemplateSplash);
    win1.loadURL(url.format({
        pathname: path.join(__dirname, '/ui/QzSplash/splash_screen.html'),
        protocol: 'file:',
        slashes: true
    }));
    currentPageID = -1;
    win1.maximize();
    win1.setResizable(false);

    win1.on('close', () => {win1=null});
    win1.once('ready-to-show', () => {win1.show();});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {app.quit()});

function toggleFullScreen(){
    if (win.isFullScreen()) {
        win.setFullScreen(false);
    }
    else {
        win.setFullScreen(true);
    }
}

function startApp() {
    win = new BrowserWindow(windowTemplate);
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
    win.setResizable(true);
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/ui/QzTournament/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    currentPageID = 0;

    win.on('close', function () {
        sendDataToChild("parent-call", "close-db");
        setTimeout(()=>{win=null}, 1500);
    });
    win.once('ready-to-show', () => {
        win.show();
        win1.close();
        win.maximize();
    })
}

function gotoHome(){
    if (showConfirmMessage('Sure To Leave The Tournament')){
        setTimeout(()=>{
            win.loadURL(url.format({
                pathname: path.join(__dirname, '/ui/QzTournament/index.html'),
                protocol: 'file:',
                slashes: true
            }));
            currentPageID = 0;
        }, 1000);
    }
}

function startTournamentBrax(t_obj) {
    tournamentObjPassed = t_obj;
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/ui/QzBrax/brax_pages/brax_main.html'),
        protocol: 'file:',
        slashes: true
    }));
    currentPageID = 1;
}

function saveFileAs() {
    return dialog.showSaveDialogSync(win, {
        filters: savefileFilters,
        properties: ['showOverwriteConfirmation']
    });
}

function selectFile() {
    dialog.showOpenDialog(win, {
        filters: imagefileFilters,
        properties: ['openFile']
    }).then((result) => {
        if (!result.canceled) {
            sendDataToChild("parent-call", "file-open", result.filePaths[0]);
        }
        else {
            sendDataToChild("parent-call", "file-open", "Not Selected");
        }
    }).catch((error) => {
        sendDataToChild("parent-call", "file-open", "Not Selected");
        showErrorMessage("select-file", error);
    })
}


function sendDataToChild(tag, type, msg) {
    try {
        win.webContents.send(tag, [type, msg]);
    } catch (error) {
        showErrorMessage('send-data', error);
    }
}

ipcMain.on("child-call", (e, msg) => {

    if (msg[0] == "file-open") {
        selectFile();
    }
    else if (msg[0] == "start-tournament") {
        startTournamentBrax(msg[1]);
    }
    else if (msg[0] == "get-tournament") {
        sendDataToChild("parent-call", 'init', tournamentObjPassed);
    }
    else if (msg[0] == "file-save") {
        e.returnValue = saveFileAs();
    }
    else if (msg[0] == 'start-app') {
        startApp();
    }
})

ipcMain.on('show-message', (e, msg) => {
    showInfoMessage(msg);
});

ipcMain.on('show-error', (e, msg) => {
    try {
        showErrorMessage(msg[0], msg[1]);
    } catch (error) {
        showErrorMessage("show-error", error.toString());
    }
});

ipcMain.on('show-confirm', (e, msg) => {
    try {
        e.returnValue = showConfirmMessage(msg);
    } catch (error) {
        showErrorMessage("show-error", error.toString());
        e.returnValue = false;
    }
});

ipcMain.on('show-notify', (e, msg) => {
    try {
        showNotification(msg);
    } catch (error) {
        showErrorMessage("show-error", error.toString());
    }
});


function showConfirmMessage(messageToConfirm) {
    var index = dialog.showMessageBoxSync(win, {
        type: "question",
        title: "Confirmation Message",
        message: messageToConfirm,
        buttons: ["Confirm", "Cancel"]
    });
    if (index == 0) {
        return true;
    }
    else {
        return false;
    }
}

function showInfoMessage(infoMessage) {
    dialog.showMessageBox(win, { type: "info", buttons: [], message: infoMessage.toString() });
}

function showErrorMessage(fromFunc, errMessage) {
    dialog.showErrorBox('Error in -> ' + fromFunc, errMessage.toString());
}

function  showNotification(msg){
    let not = new Notification();
    not.title = "Brax Gen App"
    not.body = msg;
    not.show();
}