// Modules to control application life and create native browser window
const {app, remote, BrowserWindow} = require('electron')
const path = require('path')
let mWin = 0;
const mX = 1050;
function newNote() {

  const BrowserWindow = remote.BrowserWindow;

  var win = new BrowserWindow({ 
    width: 150,
    height: 300,
    backgroundColor: '#2e2c29',
    frame: false,
    movable: true,});
  
  // and load the index.html of the app.
  win.loadFile('index.html');

}


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 200,
    backgroundColor: '#2e2c29',
    frame: false,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
   return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  let notes = await loadNotes();
  console.log(notes);
  
  
  notes.forEach(v => {
    
    let win = createWindow();
    var xv = mX - 310*Math.floor(mWin/3);
    var yv = Math.round(210*(mWin%3));
    var obj = {};
    obj.x = xv;
    obj.y = yv;
    win.setBounds(obj);
    win.webContents.on('did-finish-load', () => {
     win.webContents.send('create', v);
    });
    mWin+=1;
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


async function loadNotes() {
  var MongoClient = require('mongodb').MongoClient;
  let db = await MongoClient.connect("mongodb://localhost:27017/notesDB");
     
  return db.collection('notes').find().toArray();

     //Write databse Insert/Update/Query code here..
}