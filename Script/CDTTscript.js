
function loadTest() {
    testArea.load();
}

var testArea = {
    canvas : document.createElement("canvas"),
    load : function() {
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.after(this.canvas, document.body.childNodes[0]);
        document.getElementById('CDTTtest').style.display = "block";
        document.getElementById('mainButton').style.display = "none"
    }
}

/* Language Dropdown list */
var select = document.getElementById("languageDropDownList");
var optionsLanguage = ["EN_CA", "FR_CA"];

for(var i = 0; i < optionsLanguage.length; i++) {
    var opt = optionsLanguage[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

/* Talker Dropdown list */
var select = document.getElementById("talkerDropDownList");
var optionsTalker = ["Female", "Male"];

for(var i = 0; i < optionsTalker.length; i++) {
    var opt = optionsTalker[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

/* List # Dropdown list */
var select = document.getElementById("listDropDownList");
var optionsList = ["01", "02", "03", "04"];

for(var i = 0; i < optionsList.length; i++) {
    var opt = optionsList[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

/* Masker Dropdown list */
var select = document.getElementById("maskerDropDownList");
var optionsMasker = ["SSNOISE"];

for(var i = 0; i < optionsMasker.length; i++) {
    var opt = optionsMasker[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

/* Test mode Dropdown list */
var select = document.getElementById("testModeDropDownList");
var optionsTestMode = ["Fix Level", "Adapt Speech Level"];

for(var i = 0; i < optionsTestMode.length; i++) {
    var opt = optionsTestMode[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

/* Test ear Dropdown list */
var select = document.getElementById("testEarDropDownList");
var optionsTestEar = ["Left", "Right", "Binaural", "Antiphase"];

for(var i = 0; i < optionsTestEar.length; i++) {
    var opt = optionsTestEar[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

/* Triplet Type Dropdown list */
var select = document.getElementById("tripletTypeDropDownList");
var optionsTripletType = ["Triplet"];

for(var i = 0; i < optionsTripletType.length; i++) {
    var opt = optionsTripletType[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

/** Check if the Test in quiet checkbox is selected, if yes, disable the masker drop down list */
function testInQuiet(obj) {
    if (document.getElementById("testInQuiet").checked == true) {
        document.getElementById("maskerDropDownList").disabled =true;
    } else {
        document.getElementById("maskerDropDownList").disabled = false;
    }
}

let bNotReadyForAnswer = true;
/** 
 * This function is called when the start button is clicked.
 */
function startTest(){
    disableTestParameters(true);
    //openModal(true);
    alert("Please make sure the system volume is set to 100%");
    // Check if the Stop btn is displayed or not
    // var btnStopTest = document.getElementById('btnStopTest');
    // if (btnStopTest.style.display == "none") {
    //     btnStopTest.style.display = "block";
    // }

    // grab all values selected from the combo boxes and from the textboxes
    let language = document.getElementById("languageDropDownList").value;
    let talker = document.getElementById("talkerDropDownList").value;
    let list = document.getElementById("listDropDownList").value;
    let masker = document.getElementById("maskerDropDownList").value;
    let mode = document.getElementById("testModeDropDownList").value;
    let testEar = document.getElementById("testEarDropDownList").value;
    let speechLevel = document.getElementById("speechLevelTextBox").value;
    let maskerLevel = document.getElementById("maskerLevelTextBox").value;
    let btestQuiet;
    if (document.getElementById("testInQuiet").checked == true) {
        btestQuiet = true;
    } else {
        btestQuiet = false;
    }
    let tripletType = document.getElementById("tripletTypeDropDownList").value;
   
    // create a new class
    var cdtt = new CDTT(language, talker, list, masker, mode, testEar, speechLevel, maskerLevel, btestQuiet, tripletType);
    enableKeyboard("visible");
    cdtt.show();
    //cdtt.getWavFolder(language, talker, list);
    cdtt.getListOfFile(language, talker, list)
    // Get the list of folders that holds the wav files
    //cdtt.getListOfFile();
    //cdtt.getWavList();
    // _getAllFilesFromFolder.filesystem();

    //_getAllFilesFromFolder("https://github.com/MelinaRochon/DTT/applicationFiles/SOUNDFILES/List_Creation/Triplet_List-01-EN_CA-Female/.git");
    //var _getAllFilesFromFolder = function(dir) {

}
/*function _getAllFilesFromFolder(dir) {
    var filesystem = "https://github.com/MelinaRochon/DTT/applicationFiles/SOUNDFILES/List_Creation/";
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file))
        } else results.push(file);

    });
    
    console.log("results : " + results);
    return results;

}*/

function stopTest() {
    disableTestParameters(false);
    enableKeyboard("hidden");

    // Clear keyboard
    let clearKeyboard = document.getElementById("inputUserText").value;
    clearKeyboard = "";
    updateTextFieldKeyboard(clearKeyboard);
}

function keypadDigitListener(val) {

    // Check if text area is already at max length or at min length
    /*let userAnswer = document.getElementById("inputUserText").value;
    let tempAnswer = userAnswer + "" + val;
    
    updateTextFieldKeyboard(tempAnswer);*/
    let userAnswer = document.getElementById("inputUserText").value + val;
    //     document.getElementById("inputUserText").value = document.getElementById("inputUserText").value + val;
    updateTextFieldKeyboard(userAnswer);
}

function updateTextFieldKeyboard(answer) {
    let bDisableDelete = false;
    let bDisableSubmit = true;

    if (answer.length > 3) {
        answer = answer.substring(0, 3);
        //console.log("answer.length>3");
    }

    if (answer.length == 0) {

        // Disable delete button
        bDisableDelete = true;
        //console.log("answer.length=0");
    } else if (answer.length == 3) {
        //console.log("answer.length=3");
        // Enable the submit button
        bDisableSubmit = false;
        
    }

    // The current answer replaces the text area value 
    document.getElementById("inputUserText").value = answer;
    //console.log("continue : length is " + answer.length);
    
    
    
    
    // If the audio is done playing and all 3 numbers are entered on keypad,
    // then enable the submit button, otherwise, disable
    if (bDisableSubmit== false && bNotReadyForAnswer == false) {
        document.getElementById("btnSubmit").disabled = false;
    } else {
        document.getElementById("btnSubmit").disabled = true;

    }
    
    // Enable/disable GUI buttons
    document.getElementById("btnDelete").disabled = bDisableDelete;
    document.getElementById("inputUserText").disabled = (!bDisableSubmit); 
    document.getElementById("btn0").disabled = !bDisableSubmit;
    document.getElementById("btn1").disabled = !bDisableSubmit;
    document.getElementById("btn2").disabled = !bDisableSubmit;
    document.getElementById("btn3").disabled = !bDisableSubmit;
    document.getElementById("btn4").disabled = !bDisableSubmit;
    document.getElementById("btn5").disabled = !bDisableSubmit;
    document.getElementById("btn6").disabled = !bDisableSubmit;
    document.getElementById("btn7").disabled = !bDisableSubmit;
    document.getElementById("btn8").disabled = !bDisableSubmit;
    document.getElementById("btn9").disabled = !bDisableSubmit;
}


/**
 * beforeinput event fires before the input's value is changed. 
 * Checks if the data is the input contains disallowed characters, and if so, 
 * stops the chain. 
 */
var validNumber = new RegExp("^[0-9]*$");
document.getElementById("inputUserText").addEventListener("beforeinput", function(event) {
    
    // When its not a number between 0 and 9
    if (event.data != null && !validNumber.test(event.data)) {
        event.preventDefault();
    } 
}); 


function keyboardListener(event) {

    // Grab the data from the text area before updating the textfield 
    let currentAnswer = document.getElementById("inputUserText").value;

    // Get the current key code
    let key = event.key;

    updateTextFieldKeyboard(currentAnswer);
            
    console.log("current val:" + currentAnswer + ", tempAnswer : " + key);
    
}

function keypadDeleteListener() {

    // Get the answer already in the text field
    let currentAnswer = document.getElementById("inputUserText").value;

    // Implement backspace
    if (currentAnswer.length > 1) {

        // Remove the last digit in the answer text field
        currentAnswer = currentAnswer.substring(0, currentAnswer.length-1);
    } else {

        // Clear the text
        currentAnswer = "";
    }

    // Update the text field and GUI buttons
    updateTextFieldKeyboard(currentAnswer);
}


function disableTestParameters(bool){

    // disable all dropdown lists and checkbox
    document.getElementById("languageDropDownList").disabled = bool;
    document.getElementById("talkerDropDownList").disabled = bool;
    document.getElementById("listDropDownList").disabled = bool;
    document.getElementById("maskerDropDownList").disabled = bool;
    document.getElementById("testModeDropDownList").disabled = bool;
    document.getElementById("testEarDropDownList").disabled = bool;
    document.getElementById("speechLevelTextBox").disabled = bool;
    document.getElementById("maskerLevelTextBox").disabled = bool;
    document.getElementById("testInQuiet").disabled = bool;
    document.getElementById("tripletTypeDropDownList").disabled = bool;
    document.getElementById("btnStartTest").disabled = bool;
    document.getElementById("btnStopTest").disabled = !bool;
}

// Retrieve all filepaths from Github
const filePath_EN_female = "https://github.com/MelinaRochon/DTT/tree/main/applicationFiles/SOUNDFILES/List_Creation/";
const extractListNumber = (path) => {

   // Split the folder name
   // shows : 01 --> list number
   if (path.isDirectory == true){
    console.log("is folder :" + path.getNames());
   } else {
    console.log("is NOT a folder! "); 
   }
   console.log("index");
   const splitTriplet = path.split("-",2);
   console.log(splitTriplet);
   const lastIndex = splitTriplet.length-1;
   //const 
   console.log("LIST: " + lastIndex);
   return splitTriplet[lastIndex];
};

/*getUserRepos('MelinaRochon');
async function getUserRepos(username) {
   const repos = await fetch(`https://api.github.com/repos/MelinaRochon/CDTT_lists/contents/`);
   //const repos = await fetch('https://api.github.com/users/MelinaRochon/repos?callback=CALLBACK');
    return repos;
 }
 
 getUserRepos("[USERNAME]")
       .then(repos => {
        // for (i=0; i<repos.length; i++) {
             //console.log("repo #" + i + " : " + repos.headers[i]);
         //}
        console.log("mel : " + repos);
  });*/
  

//function }


    /*var listOfObjects = [];
    var a = ["car", "bike", "scooter"];
    a.forEach(function(entry) {
        var singleObj = {};
        singleObj['type'] = 'vehicle';
        singleObj['value'] = entry;
        listOfObjects.push(singleObj);
        console.log(listOfObjects);
    });*/
//const fetch = require('node-fetch');
/*const getNames = async() => {
  try {
    const names = await fetch('https://github.com/MelinaRochon/DTT/applicationFiles/SOUNDFILES/List_Creation/.git');
    const textData = await names.text();
    return textData;
  } catch (err) {
    console.log('fetch error', err);
  }
};

(async () => {
  const getText = await getNames();
  console.log(getText)
})();*/
//console.log(extractListNumber(filePath_EN_female));
//console.log(extractFilename(splitTriplet));


function enableKeyboard(visible) {
    /*if (document.getElementById("tableKeyboard").style.visibility == "hidden") {
        document.getElementById("tableKeyboard").style.visibility = "visible";
    } else {
        document.getElementById("tableKeyboard").style.visibility == "hidden";
    }*/
    document.getElementById("tableKeyboard").style.visibility = visible;
}
/** CLASS */
class CDTT {

    constructor(language, talker, list, masker, mode, testEar, speechLevel, maskerLevel, btestQuiet, tripletType) {
        this.language = language;
        this.talker = talker;
        this.list = list;
        this.masker = masker;
        this.mode = mode;
        this.testEar = testEar;
        this.speechLevel = speechLevel;
        this.maskerLevel = maskerLevel;
        this.btestQuiet = btestQuiet;
        this.tripletType = tripletType;



        // Get the right folder 
        //getWavFolder(language, talker, list);
    }

    // set numList(x) {
    //     this.numList = x;
    // }

    // get numList() {
    //     return this.numList;
    // }

    show() {
        console.log(this.language + ", " + this.talker + ", " + this.list + ", " + this.masker + ", " + this.mode + ", " + this.testEar + ", " + this.speechLevel + ", " + this.maskerLevel
        + ", " + this.btestQuiet + ", " + this.tripletType);
        // output on console: EN_CA, Female, 01, SSNOISE, Fix Level, Left, 65, 65, false, Triplet       (when checkbox not selected for test in quiet)
    }

    getListOfFile (language, talker, list) {
        var wavFile = new XMLHttpRequest();
        var listOfFile = [];
        var fileName = {};
        
        wavFile.open('GET','https://api.github.com/repos/MelinaRochon/CDTT_lists/contents/' , 
            true)
            wavFile.onload = function() {
                var data = JSON.parse(this.response);
                
                // set the number of lists
                //this.numList = data.length;
                console.log("data length : " + data.length);
                for ( i=0; i<data.length; i++) {
                    // Check if the name of the Triplet corresponds to any
                    // of the list name
                    // ex. Triplet_List-01-EN_CA-Female
                    let nameFolder = data[i].name;
                    let tempName = nameFolder.substring(13);
                    const paramArray = tempName.split("-");
                    // Array : [list number, Language, Talker]

                    // Check if all the parameters of the folder correspond to the ones selected by the user
                    if ((paramArray[0] == list) && (paramArray[1] == language) && paramArray[2] == talker) {
                        console.log("FOUND THE RIGHT LIST!!");

                        // Returns the path of folder to access it later on
                        console.log("URL : " + data[i].url);
                        //data[i].url;
                        //this.getWavFolder(data[i].url);
                        //return data[i].url;
                        let temp = getWavFolder(data[i].url);
                    }

                    // for debugging purpose
                    console.log(tempName);
                    console.log(paramArray);
                    console.log(data);
                }
                
            }
            wavFile.send();

            // Error
            // Stop Test and show error message
            //alert('Unfortunately, the file was not found. Please select different parameters. \n Your current selected parameters are the following : \nList: ' + list + '\nLanguage: ' + language + '\nTalker: ' + talker );
            //return stopTest();
            // return listOfFile
            //return wavFile.responseURL;
    }

    

    //getWavFolder(language, talker, list) {
    

    /* getListOfFile () {
        var wavFile = new XMLHttpRequest();
        var listOfFile = [];
        var fileName = {};
        wavFile.open('GET','https://api.github.com/repos/MelinaRochon/CDTT_lists/contents/' , 
            true)
            wavFile.onload = function() {
                var data = JSON.parse(this.response);
                
                // set the number of lists
                this.numList = data.length;
                console.log("data length : " + data.length);
                for ( i=0; i<data.length; i++) {
                    //fileName['n']
                    listOfFile.push(data[i]);
                    //console.log(listOfFile);
                    // data[i].name
                    
                }
                //console.log(data);
                
                
            }
            wavFile.send();
            return listOfFile;
    }*/

}

function getWavFolder(url) {
    // Get the folders in a list
    //var wavList = this.getListOfFile(language, talker, list);

    console.log("wav list is : " + url);
    var wavFiles = new XMLHttpRequest();

    var list = [];
    wavFiles.open('GET', url, true)
    wavFiles.onload = function() {
        var data = JSON.parse(this.response);
        console.log("new data length after path!! : " + data.length);
        
        // returns random index between 0 and data.length, then pushes 
        // the selected index number to the list, to create a random triplet
        // selection

        let i = 0;

        // Returns a random integer between 0 and data.length
        while (data.length > 0) {
            let random = Math.floor(Math.random() * data.length);
            list[i] = data[random].download_url;
            data.splice(random, 1);
            i++;
            //console.log(data);
        }

        // check for different compatible format?
        /*const audioCtx = new AudioContext();
        let buffer = null;
       
        const load = () => {
            console.log("YO 1");
            const request = new XMLHttpRequest();
            request.open("GET", list[0], true); //"https://drive.google.com/file/d/1A-EL802Igf_y0jpUIlg_rVQfZar6pa-u/view?usp=share_link");
            //request.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type');
            //request.
            
            //request.setRequestHeader('Access-Control-Allow-Origin', list[0]);
            
            
            request.responseType = "arraybuffer";
            //request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.onload = function() {
                let undecodedAudio = request.response;
                audioCtx.decodeAudioData(undecodedAudio, (data) => buffer = data);
            };
            request.send();
            console.log('HEADERS: ' + request.getAllResponseHeaders());
            console.log("Passe ds load");
        }
        //audioCtx.load;
        
        console.log(list[0]);

        const play = () => {
            console.log("YO 2");
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.start();
            console.log("Passe ds play");
        };
        load();
        play();*/
        var audio = new Audio(list[0]);
        //audio.type = 'audio/wav';
        
        audio.crossOrigin = 'anonymous';
        try {
            audio.play();
            console.log("playing...");

            // check if user clicked on "stop btn"
            // if so, stop sound
            
            // check if sound is done playing, if so, then submit btn is called
            // and submit btn is disabeld if done and 3 numbers entered, else disabled
            
            
            
        } catch (err) {
            console.log("failed to play " + err);
        }

        audio.onended = function() {
            // Change value of keyboard to true
            console.log("ended!!");
            bNotReadyForAnswer = false;

            // check if all 3 digits are already entered
            
            let tmpInputValue = document.getElementById('inputUserText').value;
            console.log('length : ' +  tmpInputValue.length);
            if (tmpInputValue.length == 3) {
                updateTextFieldKeyboard(tmpInputValue);
            }
           
        };
        
        /*var x = document.createElement("source");
         //x.setAttribute("id", "triplet");
        if (audio.canPlayType("audio/wav")) {
            x.type = "audio/wav";
            x.src = list[0];
            //x.setAttribute("src", list[0]);
            console.log("PEUX FONCTIONNER");
            //audio.play();
        } 
        
        x.setAttribute("controls", "controls");
        //document.getElementById("triplet").play();
        //audio.
        document.body.appendChild(x);
        //var audio = new Audio(x.getAttribute("src"));
        audio.appendChild(x);
        audio.load();
        audio.play();*/

        
        
        //else {
            //x.setAttribute("src", )
            //else
        //document.getElementById("myAudio").innerHTML = audio.play();
        //audio.play();
        //playTriplet(audio);
        // Then remove the current value from the array

        
        //for ( i=0; i<data.length; i++) {
          //  list.push(data[i].name);
        //}
        //console.log("file names are : " + list[0]);
    }
    wavFiles.send();
}


function playTriplet(audio) {
    audio.play();
}