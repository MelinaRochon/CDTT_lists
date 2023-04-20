let bStopTest = false;

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
let ixCurrentTriplet = 0;   // index for the current triplet
let correctAnswer = [];

let numCorrectTriplet = 0;
let bNextTriplet = true;             // if there's another triplet
let firstCorrectAnswer = true;
let bCorrectAnswer = false;
let bFirstReversal = false; 
let dBSTEP = 0;
// Initiali
/**
 * This function is called when the start button is clicked.
 */
function startTest(){

	// Disable the parameters
	disableTestParameters(true);

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
	let speechLevel = parseInt(document.getElementById("speechLevelTextBox").value);
	let maskerLevel = parseInt(document.getElementById("maskerLevelTextBox").value);
	let initSpeechLevel = speechLevel;
	let initMaskerLevel = maskerLevel;
	let btestQuiet;
	if (document.getElementById("testInQuiet").checked == true) {
		btestQuiet = true;
	} else {
		btestQuiet = false;
	}
	let tripletType = document.getElementById("tripletTypeDropDownList").value;

	// New Object creation
	var cdtt = new CDTT(language, talker, list, masker, mode, testEar, speechLevel, maskerLevel, btestQuiet, tripletType);

	// Keyboard visible
	enableKeyboard("visible");

	// For debugging purposes
	cdtt.show();
	// Initialize the first SNR value
	cdtt.setSNR(ixCurrentTriplet, speechLevel - maskerLevel);
		
	// Get the list of folders that holds the different triplets
	cdtt.getListOfFile(language, talker, list)

	

}

function stopTest() {
	disableTestParameters(false);
	enableKeyboard("hidden");

	// // Clear keyboard
	// let clearKeyboard = document.getElementById("inputUserText").value;
	// clearKeyboard = "";
	// updateTextFieldKeyboard(clearKeyboard);
	clearKeyboard();

	bStopTest = false;
}

function clearKeyboard() {
	// Clear keyboard
	let clearKeyboard = document.getElementById("inputUserText").value;
	clearKeyboard = "";
	updateTextFieldKeyboard(clearKeyboard);
}

function keypadDigitListener(val) {

	// Get the current inputText and add the new value to the text area
	let userAnswer = document.getElementById("inputUserText").value + val;

	// Update the keyboard and the buttons
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

document.getElementById('btnStopTest').onclick = function() {
	bStopTest = true;
	stopTest();
}

// function 

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


function enableKeyboard(visible) {

	// Set the visibility of the keyboard
	document.getElementById("tableKeyboard").style.visibility = visible;
}

let SNR = [];
let reversals = [];
/** CLASS */
class CDTT {
	
	// Constructor
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
		bFirstReversal = false;
		self = this;
	}

	show() {
		console.log(this.language + ", " + this.talker + ", " + this.list + ", " + this.masker + ", " + this.mode + ", " + this.testEar + ", " + this.speechLevel + ", " + this.maskerLevel
		+ ", " + this.btestQuiet + ", " + this.tripletType);
		// output on console: EN_CA, Female, 01, SSNOISE, Fix Level, Left, 65, 65, false, Triplet       (when checkbox not selected for test in quiet)
	}

	getListOfFile (language, talker, list) {
		var wavFile = new XMLHttpRequest();
		var listOfFile = [];
		var fileName = {};

		wavFile.open('GET','https://api.github.com/repos/MelinaRochon/CDTT_lists/contents/' , true)
		wavFile.onload = function() {
			var data = JSON.parse(wavFile.response);

			// set the number of lists
			//console.log("data length : " + data.length);
			for ( i=0; i<data.length; i++) {

				// Check if the name of the Triplet corresponds to any
				// of the list name
				// ex. Triplet_List-01-EN_CA-Female
				let nameFolder = data[i].name;
				let folder_contains_triplet = nameFolder.includes("Triplet_List");
				//console.log("does it contain? " + folder_contains_triplet);
				if (folder_contains_triplet == true) {
					//console.log("yes, name is " + nameFolder);
					let tempName = nameFolder.substring(13);
					const paramArray = tempName.split("-");
					// Array : [list number, Language, Talker]

					// Check if all the parameters of the folder correspond to the ones selected by the user
					if ((paramArray[0] == list) && (paramArray[1] == language) && paramArray[2] == talker) {
						//console.log("FOUND THE RIGHT LIST!!");

						// Returns the path of folder to access it later on
						//console.log("URL : " + data[i].url);

						let temp = self.getWavFolder(data[i].url);
					}
				} else {
					console.log("does not contain: " + nameFolder);
				}

				// for debugging purpose
				// console.log(tempName);
				// console.log(paramArray);
				// console.log(data);
			}
		}
		wavFile.send();
	}

	getWavFolder(url) {
		// Get the folders in a list
		//console.log("wav list is : " + url);
		var wavFiles = new XMLHttpRequest();
	
		var list = [];
		wavFiles.open('GET', url, true)
		wavFiles.onload = function() {
			var data = JSON.parse(this.response);
			//console.log("new data length after path!! : " + data.length);
	
			// returns random index between 0 and data.length, then pushes
			// the selected index number to the list, to create a random triplet
			// selection
	
			let i = 0;
			let tmpCorrectAnswer= [];
			// Returns a random integer between 0 and data.length
			while (data.length > 0) {
				let random = Math.floor(Math.random() * data.length);
				list[i] = data[random].download_url;
				tmpCorrectAnswer[i] = data[random].name;
				correctAnswer[i] = tmpCorrectAnswer[i].substring(0,3); // deletes .wav, keep the triplet
				data.splice(random, 1);
				i++;
				//console.log(data);
			}
	
			console.log('list: ' + correctAnswer);
			//while (bNextTriplet && !bStopTest && (ixCurrentTriplet < list.length)) {
			//for (i=0; i<list.length; i++) {
			//console.log('btn stop : ' + bStopTest);
				
			// Present the triplets
			self.presentAudio(list);
	
	
			//}
	
	
	
			// Check if user clicked on the stop button while the audio still playing
			//document.getElementById('btnStopTest').click;
	
		}
		wavFiles.send();
	}
	
	async presentAudio(list) {
		var audio = new Audio(list[ixCurrentTriplet]);
		//console.log(list[ixCurrentTriplet]);
		audio.crossOrigin = 'anonymous';
		try {
			// check if its the first triplet playing,
			// if it is, then 
			console.log('iteration : ' + ixCurrentTriplet + ', SNR = ' + this.getSNR(ixCurrentTriplet));
			console.log('Reversal = ' + this.getReversal(ixCurrentTriplet));
			audio.volume = this.speechLevel/100;
			audio.play();
			console.log("playing...");
	
			// check if user clicked on "stop btn"
			// if so, stop sound
			// Audio is done playing
			audio.onended = async function() {
	
				// Keyboard is ready to receive an answer
				console.log("ended!!");
				bNotReadyForAnswer = false;
	
				// Check if all 3 digits are already entered in the input text area
				let tmpInputValue = document.getElementById('inputUserText').value;
				console.log('length : ' +  tmpInputValue.length);
				if (tmpInputValue.length == 3) {
	
					// Enable submit button
					updateTextFieldKeyboard(tmpInputValue);
	
	
				}
				// check if submit btn is clicked
				document.getElementById('btnSubmit').onclick = function() {
					self.keypadSubmitListener();
	
					bNextTriplet = self.moveToTheNextTriplet(list.length);
					if (bNextTriplet == true) {
						bNotReadyForAnswer = true;
	
						// Present the audio for the next triplet
						self.presentAudio(list)
					} else {
	
						// Display a message prompt that we're done
						alert('Test completed! ');
	
						// FOR FUTURE:
						// add popup that shows results, and offers to save them in database. 
					}
				}
	
	
			};
	
			
	
			if (bStopTest) {
				//break;
			}
			if (bNextTriplet > 5) {
				//break;
			}
	
		} catch (err) {
			console.log("failed to play " + err);
		}
	}
	
	moveToTheNextTriplet(listLength) {
		// Increment the triplet index
		ixCurrentTriplet++;
	
		// Return true as long as we haven't reached the end
		return (ixCurrentTriplet < listLength);
	}

	keypadSubmitListener() {

		// Read the user's answer
		let userAnswerSubmit = document.getElementById('inputUserText').value;
	
		self.scoreCurrentTriplet(userAnswerSubmit, correctAnswer[ixCurrentTriplet], ixCurrentTriplet);
		console.log("num of correct triplet: " + numCorrectTriplet);
		clearKeyboard();
	
	}
	
	scoreCurrentTriplet(userAnswerSubmit, correctAnswer, ixTriplet) {
	
		// Always in adaptive mode!
		if (userAnswerSubmit[ixTriplet] == correctAnswer[ixTriplet]) {
			numCorrectTriplet ++;   // increment the number of correct triplet by 1
			bCorrectAnswer = true;
			
			// check if its the first triplet
			if (ixTriplet == 0) {
			
			}
		} else {
			bCorrectAnswer = false;
		}
		self.computeCurrentSNR(bCorrectAnswer);
		console.log('user answer is : ' + userAnswerSubmit + '\tcorrect answer is : ' + correctAnswer);
	}
	
	computeCurrentSNR(bCorrectAnswer) {
		
		//let speechLevel = document.getElementById("speechLevelTextBox").value;
		//let maskerLevel = document.getElementById("maskerLevelTextBox").value;
	
		// Initialize the SNR to the value used just before we got here
		let currentSNR = this.speechLevel - this.maskerLevel;
	
		// Set a temporary variable in case the maximum level is reached
		let tmpSNR = currentSNR;
	
		if (bCorrectAnswer && firstCorrectAnswer) {
			// Set the SNR before reversal value when the first correct answer is entered
			firstCorrectAnswer = false;
		}
	
		// Detect if a reversal was encountered
		bFirstReversal |= this.detectReversal(bCorrectAnswer, currentSNR);
	
		// Set the step size for the current and future iterations
		if (!bFirstReversal) {
			dBSTEP = 4;
		} else {
			dBSTEP = 2;
		}
	
		// Compute the current SNR based
		if (bCorrectAnswer) {
			// Answer was correct, decrease SNR
			currentSNR -= dBSTEP;
		} else {
			// Answer was incorrect, increase SNR
			currentSNR += dBSTEP;
		}
		
		// Temporary variable to compare the maximum SP level to the new temporary SNR
		let tmpLevelSP = this.maskerLevel + currentSNR;

		// Update the speech level to reflect the new SNR in the next iteration
		if (tmpLevelSP <= 70) {
			
			// Max level not reached
			this.speechLevel = tmpLevelSP;
		} else {

			// Max level reached
			currentSNR = tmpSNR;
		}

		// Update the SNR array in results with the new value we just compiled
		this.setSNR(ixCurrentTriplet, currentSNR);
	}
	
	detectReversal(bCorrectAnswer, currentSNR) {
		let bReversal = false;

		// Detect reversal only if we've done at least 2 iterations already
		if (ixCurrentTriplet > 1) {

			// Get the SNR from the previous iteration
			let previousSNR = this.getSNR(ixCurrentTriplet - 2);
			console.log('prev SNR: ' + previousSNR);
			// if previous SNR was ascendng, look for correct answer
			// if previous SNR was descending, look for incorrect answer
			if (((currentSNR > previousSNR) && bCorrectAnswer) || ((currentSNR < previousSNR) && !bCorrectAnswer)) {

				// Update the reversals array in Results with a value of 1 at the current index
				this.setReversal(ixCurrentTriplet, 1);

				// Set return value to true
				bReversal = true;
			}
		}

		return bReversal;
	}

	setSNR(index, SNRvalue) {
		SNR[index] = SNRvalue;
	}

	getSNR(index) {
		return SNR[index];
	}

	setReversal(index, nreversal) {
		reversals[index] = nreversal;
	}

	getReversal(index) {
		return reversals[index];
	}

}



