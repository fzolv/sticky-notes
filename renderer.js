
var {ObjectId} = require('mongodb'); 
var objectId;

var newNoteButton = document.getElementById('newNote');
var closeNoteButton = document.getElementById('closeNote');
var saveNoteButton = document.getElementById('saveNote');
var deleteNoteButton = document.getElementById('deleteNote');

require('electron').ipcRenderer.on('create', function(event, note) {
  loadNote(note);
});
newNoteButton.addEventListener('click', function () {
  newNote();
});
closeNoteButton.addEventListener('click',closeNote);
saveNoteButton.addEventListener('click',saveNote);
deleteNoteButton.addEventListener('click',deleteNote);

function loadNote(o) {
  if(o!=null || o._id==null){
    objectId = o._id;
    document.getElementById("note-title").innerHTML = o.content.title;
    document.getElementById("body-text").innerHTML = o.content.body;
  }
}
function newNote() {
  console.log("Called newNote.");
  const remote = require('electron').remote;
  const BrowserWindow = remote.BrowserWindow;
  var win = new BrowserWindow({ 
    width: 300,
    height: 200,
    backgroundColor: '#2e2c29',
    frame: false,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }});

// and load the index.html of the app.

  win.loadFile('index.html');

}

function closeNote() {
  const remote = require('electron').remote;
  let w = remote.getCurrentWindow();
  w.close();
  
}

async function saveNote() {
  console.log("saveNote called");
  
  var title = document.getElementById("note-title").innerHTML;
  var body = document.getElementById("body-text").innerHTML;

  var MongoClient = require('mongodb').MongoClient;
  let db = await MongoClient.connect("mongodb://localhost:27017/notesDB");
  if(objectId != null && objectId.id!=null) {
    let buf = Buffer.from(objectId.id);
    objectId.id = buf;
    let op = await db.collection('notes').findOneAndUpdate({"_id": objectId}, {'content': {'title': title, 'body': body}});
  } else {
    let op = await db.collection('notes').insertOne({'content': {'title': title, 'body': body}});
  }
  db.close();
}

async function deleteNote() {
  console.log("deleteNote called");


  var MongoClient = require('mongodb').MongoClient;
  let db = await MongoClient.connect("mongodb://localhost:27017/notesDB");
  if(objectId != null && objectId.id!=null) {
    let buf = Buffer.from(objectId.id);
    objectId.id = buf;
    let op = await db.collection('notes').removeOne({"_id": objectId});
  }
  db.close();
  closeNote();
}