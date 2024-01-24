let ixCurrentTriplet=0;                 // Triplet index: keeps track of current triplet
var list_wav = [];                      // Array of .wav files for each triplets
var correctAnswer = [];                 // Array of correct triplets for each triplet

let bNotReadyForAnswer = true;          // Flag detecting if the keypad is ready for an answer (true) or not (false)
var btestQuiet = false;                 // Test performed in quiet (true), otherwise (false)

// When scoring the subject's answer
var numCorrectTriplet;          // Total number of correct triplets
var firstCorrectAnswer;         // Checks if the correct answer entered is the first (true), if not (false)
var bCorrectAnswer;             // Current triplet calculated is: (true) correct, (false) incorrect
var bFirstReversal;             // Flag indicating if the first reversal has been detected (1) or not (2)
var initialVolume;              // Initial volume of the speech audio .wav file

// Get speech and masker levels
var speechLevelVal=0.0;
var maskerLevelVal=0.0;
var currentSNR = 0.0;           // Current SNR 

// Strictly internal variables
var dBSTEP = 0.0;               // Step size between continuous presentations
var numberReversal;             // Number of reversals for adaptive procedure
var SNR = [];                   // Array of signal to noise ratios
var reversal = [];              // Array of reversals
var SRT = 0.0;                  // Speech Reception Thresholds
var STDEV = 0.0;                // Standard Deviation for SRT measurement
var numReversals = 0;               
var nProgress = 0;              // Progress of User (out of 24 triplets)
var nmisses = 0;                // Number of misses in a row, if reaches 5 misses in a row, abort test
var maskerAudioWav = "";        // Masker Audio .wav file (download url)

// Set global variable
var listTriplet = {
    correct: correctAnswer,
    userSubmit: userAnswerSubmit,
    triplet: list_wav.length
}

// Data fields
var language;           // Test language (EN_CA, FR_CA)
var talker;             // Test talker (Male, Female)
var list;               // Test list number
var mode;               // Test mode: Adaptive, Fix
var masker = "";        // Masker signal : SSNOISE
var testEar;            // Test Ear: binaural (0), or antiphase (2)
var speechLevel=0.0;    // Speech level
var maskerLevel=0.0;    // Masker level
var tripletType;        // Triplet type: Triplet, All digit
var startingSNR=0.0;    // Starting SND in dB
var startDateTime;      // Date and time test started
var startTime;          // Time at start of test
var endTime;            // Time at end of test
var pmOrAm;             // Time : am or pm
var practiceTest;       // Practice Test object



// Get todays date
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ this.getFullYear();
}

/**
 * This function returns the current date with the following format:
 * Date-Month-Year
 * 
 * @param {Date} date Current date
 * @returns today's date
 */
function currentDate(date) {
    return ((date.getDate() < 10)?"0":"") + date.getDate() +"-"+(((date.getMonth()+1) < 10)?"0":"") + (date.getMonth()+1) +"-"+ date.getFullYear();
}


// Get the time now
Date.prototype.timeNow = function () {
    if (this.getHours() < 12) {
        pmOrAm = " AM";
    } else {
        pmOrAm = " PM";
    }
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}


/**
 * This function returns the current time, using the 
 * following format: hh-min-sec
 * @param {Date} time 
 * @returns Current time
 */
function currentTime(time) {
    return ((time.getHours() < 10)?"0":"") + time.getHours() + ":" + ((time.getMinutes() < 10)?"0":"") + time.getMinutes() + ":" + ((time.getSeconds() < 10)?"0":"") + time.getSeconds();
}

    
/**
 * This function is called when the user selects the "Skip Practice"
 * button. He/she is redirected to the test frame. 
 */
function skipToTest() {
    document.getElementById("practiceTest").style.display = "none";

    // Hide keypad
    CDTT.enableKeyboard("hidden");

    // Show the start CDTT test frame
    document.getElementById("startCDTT").style.display = "block";
}


/**
 * This function checks if the Test in quiet checkbox is selected, if yes, 
 * disable the masker drop down list 
 */
function testInQuiet() {
    if (document.getElementById("testInQuiet").checked == true) {
        document.getElementById("maskerDropDownList").disabled =true;
    } else {
        document.getElementById("maskerDropDownList").disabled = false;
    }
}

// function insertAfter(referenceNode, newNode) {
//     referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
// }


/**
 * This function is called when the user selects the "Show Instruction" button.
 * If the test instructions were already displayed when this function was called,
 * we hide the instructions and change the button's inner HTML to "Hide Instructions". 
 * Otherwise, we show the instructions and reset the button's inner HTML to "Show 
 * Instructions".
 */
function showInstructions() {
    let isShowing = document.getElementById("testInstructions").style.display;
    if (isShowing == "none") {
        // Show the instructions
        document.getElementById("testInstructions").style.display = "block";

        // Set the inner HTML of the "Show Instruction" button
        document.getElementById("btnInstructions").innerHTML = I18N.BTN_HIDE_INSTRUCTIONS;
    } else {
        // Hide the instructions
        document.getElementById("testInstructions").style.display = "none";

        // Reset the "Show Instruction" button inner HTML
        document.getElementById("btnInstructions").innerHTML = I18N.BTN_SHOW_INSTRUCTIONS;
    } 
}


/**
 * This function makes a practice test for the participant. It creates a
 * PracticeTest() object, where a random list is chosen to perform the 
 * practice test. With the chosen random list, the CDTT.getListOfFile()
 * static method is called to return the path of the folder where all 
 * .wav files are stored. 
 * This function also keeps track of the number of triplets that have 
 * been completed, when a .wav file is played.
 */
function startPracticeTest() {

    // Clear keypad
    clearKeyboard();

    // Erase the last saved score
    document.getElementById("scorePracticeTest").innerHTML = "";

    // Disable the practice test button
    document.getElementById("btnPracticeTest").disabled = true;
    
    if (ixCurrentTriplet == 0) {

        // Set the submit button value to 1
        Settings.SUBMIT_BTN_TEST = 1;

        // Gets all values selected from the combo boxes and from the textboxes
        language = document.getElementById("languageDropDownList").value;
        talker = document.getElementById("talkerDropDownList").value;
        list = document.getElementById("listDropDownList").value;
        mode = document.getElementById("testModeDropDownList").value;
        testEar = document.getElementById("testEarDropDownList").selectedIndex;
        speechLevel =(document.getElementById("speechCalib").value);
        maskerLevel = (document.getElementById("maskerCalib").innerHTML);
        initialVolume = document.getElementById("speechCalib").value;

        // Create a practice test object
        practiceTest = new PracticeTest(language, talker, list, mode, testEar, speechLevel, maskerLevel);
        
        // Choose a random list to perform the practice test
        let tmp = practiceTest.getRandomList(list);
        
        // Get the file
        CDTT.getListOfFile(language, talker, tmp);
        
        // Make the keyboard visible
        CDTT.enableKeyboard("visible");
    } else {

        // Play audio file
        CDTT.playAudio(list_wav[ixCurrentTriplet]); 
    }
}


/** 
 * This function is called when the start button is clicked. We get all
 * test parameters and internal calibration values. The current date 
 * and the current time, when the test starts, are stored. A CDTT object
 * is created, where the CDTT.getListOfFile() static method is called to 
 * return the path of the folder where all .wav files are stored. 
 * 
 */
function startTest(){

    // Set the submit button value to 2
    Settings.SUBMIT_BTN_TEST = 2;

    // Start with the first triplet
    ixCurrentTriplet = 0;

    // Submit button won't be enabled until the next 
    // audio file is done playing 
    bNotReadyForAnswer = true;

    // Disable test parameters on the main frame
    disableTestParameters(true);
    
    // Clear keyboard
    clearKeyboard();

    // Return the current Date & Time
    startDateTime = new Date();

    // grab all values selected from the combo boxes and from the textboxes
    language = document.getElementById("languageDropDownList").value;
    talker = document.getElementById("talkerDropDownList").value;
    list = document.getElementById("listDropDownList").value;
    mode = document.getElementById("testModeDropDownList").value;
    testEar = document.getElementById("testEarDropDownList").selectedIndex;
    speechLevel =(document.getElementById("speechCalib").value);
    maskerLevel = (document.getElementById("maskerCalib").innerHTML); 
    
    // Test in quiet
    if (document.getElementById("testInQuiet").checked == true) {
        btestQuiet = true;
    } else {
        btestQuiet = false;
    }

    tripletType = document.getElementById("tripletTypeDropDownList").value;
   
    // Set these variables back to their initial values
    ixCurrentTriplet = 0;

    // Set for the speech value
    initialVolume = document.getElementById("speechCalib").value;
    numCorrectTriplet = 0;
    //bNextTriplet = true;
    firstCorrectAnswer = true;
    bCorrectAnswer = false;
    bFirstReversal = false;
    speechLevelVal= (document.getElementById("speechCalib").value);
    maskerLevelVal= (document.getElementById("maskerCalib").innerHTML);
    masker = document.getElementById("maskerDropDownList").value;
    SRT = 0.0;
    STDEV = 0.0;
    numReversals = 0;

    // Set progress
    nProgress = 0;
    currentSNR = (document.getElementById("startingSNRrange").value);
    startingSNR = currentSNR;
    dBSTEP = 0.0; 
    numberReversal = 0;

    // Set the number of misses in a row to zero
    nmisses = 0;

    // Show progress bar
    document.getElementById("labelProgress").style.visibility = "visible";
    
    // Set the progress and progress status bar
    progress(ixCurrentTriplet);
    updateProgressStatusBar();

    // create a new class
    var cdtt = new CDTT(language, talker, list, masker, mode, testEar, speechLevel, maskerLevel, btestQuiet, tripletType);
    
    // Make the keyboard visible
    CDTT.enableKeyboard("visible");
    cdtt.show();
    
    // Get the list of wav files
    CDTT.getListOfFile(language, talker, list);
}


/**
 * This function is called when the user wants to stops 
 * the test. It enables all parameters in both the Test 
 * Parameters and Calibration Values frames. It also
 * closes the keyboard and stops the audio files. 
 */
function stopTest() {

    // Set the submit button value back to zero
    Settings.SUBMIT_BTN_TEST = 0;

    // Enable parameters/calibration values
    disableTestParameters(false);

    // Hide the keyboard
    CDTT.enableKeyboard("hidden");

    // Clear keyboard
    clearKeyboard();

    // Hide the status bar
    document.getElementById("labelProgress").style.visibility = "hidden";    
}


/**
 * This function keeps track of the user's progress
 * @param {Number} currentTriplet 
 * @returns progress out of 24 triplets 
 */
function progress(currentTriplet) {
    nProgress = currentTriplet;
    return nProgress;
}


/**
 * This function updates the progress status bar each 
 * time a triplet was successfully entered and submited. 
 */
function updateProgressStatusBar() {
    let textProgress;
    // Test session done
    // if (!bNextDigit) { 
    //     textProgress = "Test Session Done";
    // } else  {
        textProgress = "Set " + (nProgress + 1) + " / 24";
    //}
    document.getElementById("labelProgress").innerHTML = textProgress;
}


/**
 * This function clears the keyboard
 */
function clearKeyboard() {
    
    // Clear keyboard
    let clearKeyboard = document.getElementById("inputUserText").value;
    clearKeyboard = "";
    updateTextFieldKeyboard(clearKeyboard);
}


/**
 * This function append the digit pressed to the current answer
 * to check if the answer entered is already at the maximum 
 * or at the mimum length.
 * 
 * @param {String} val Digit pressed
 */
function keypadDigitListener(val) {
    // Check if text area is already at max length or at min length
    // Don't worry about limiting the answer length,
    // this will get done when we update the text field.
    let userAnswer = document.getElementById("inputUserText").value + val;

    // Update the text field and GUI buttons
    updateTextFieldKeyboard(userAnswer);
}


/**
 * This function updates the textfield keyboard.
 * @param {String} answer 
 */
function updateTextFieldKeyboard(answer) {
    let bDisableDelete = false;
    let bDisableSubmit = true;

    // First, trim the answer if we got more digits than we need
    if (answer.length > 3) {
        answer = answer.substring(0, 3);
    }

    if (answer.length == 0) 
    {
        // Disable delete button
        bDisableDelete = true;     
    } 
    else if (answer.length == 3) 
    { 
        // Enable the submit button
        bDisableSubmit = false;     
    }

    // The current answer replaces the text area value 
    document.getElementById("inputUserText").value = answer;
    
    // If the audio is done playing and all 3 numbers are entered on keypad,
    // then enable the submit button, otherwise, disable
    if (bDisableSubmit== false && bNotReadyForAnswer == false) {
        document.getElementById("btnSubmitTest").disabled = false;
        
    } else {
        document.getElementById("btnSubmitTest").disabled = true;
    }
    
    // Enable/disable GUI buttons 
    enableKeyboardKeys(bDisableSubmit, bDisableDelete);
}


/**
 * This function enables/disables the keyboard keys
 * @param {boolean} bDisableSubmit 
 * @param {boolean} bDisableDelete 
 */
function enableKeyboardKeys(bDisableSubmit, bDisableDelete) {
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



/**
 * This function gets the key code of the key pressed and updates the 
 * text field keyboard.
 * @param {Event} event 
 */
function keyboardListener(event) {

    // Grab the data from the text area before updating the textfield 
    let currentAnswer = document.getElementById("inputUserText").value;

    // Get the current key code
    let key = event.key;

    // Update the text field and GUI buttons
    updateTextFieldKeyboard(currentAnswer);            
}


/**
 * This function deletes the last digit entered on with the 
 * on-screen keyboard.
 */
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


var bNextDigit = true;
var userAnswerSubmit = [];


/**
 * This function submits the triplet entered with the on-screen keyboard.
 * It the user is performing a practice test, only one triplet is 
 * played, unless the user selects the "Practice" button again. If the user
 * is performing a noraml test, all triplets are played, until we have 
 * reached the array.length. Then the test is stoped and a ModalResults 
 * object is created, for the Test Results modal to be displayed.
 */
function keypadSubmitListener() {
    
    // Get the answer already in the text field
    userAnswerSubmit[ixCurrentTriplet] = document.getElementById("inputUserText").value;

    // Submit button won't be enabled until the next 
    // audio file is done playing 
    bNotReadyForAnswer = true;
    
    // Scores the answer of the current triplet
    bCorrectAnswer = scoreCurrentTriplet(correctAnswer[ixCurrentTriplet], userAnswerSubmit[ixCurrentTriplet]);
    
    computeCurrentSNR(bCorrectAnswer);
    
    // Clear the previously saved subject answer
    clearKeyboard();

    // Practice test
    if (Settings.SUBMIT_BTN_TEST == 1) {

        // Disable the keyboard
        enableKeyboardKeys(false, true);
        
        // Enable the "Test Practice" button
        document.getElementById("btnPracticeTest").disabled = false;

        let scorePracticeTest;
        // Show the score for this triplet
        if (bCorrectAnswer) {
            scorePracticeTest = "<b>Correct Answer.</b>";
        } else {
            scorePracticeTest = "<b>Incorrect Answer.</b><br>Participant Answer: " + userAnswerSubmit[ixCurrentTriplet] + "<br>Correct Answer: " + correctAnswer[ixCurrentTriplet];
        }

        // Display the score 
        document.getElementById("scorePracticeTest").innerHTML = scorePracticeTest;

        // Move to the next triplet
        bNextDigit = moveToTheNextTriplet();

        // Executing test
    } else {
        // Check if its the first triplet and incorrect
        if ((ixCurrentTriplet == 0) && (bCorrectAnswer == false)) {
            // Repeat the first triplet
        } else {
            if (bCorrectAnswer) {
                
                // Increment the number of correct triplet
                numCorrectTriplet++;
            }

            // Move to the next triplet
            bNextDigit = moveToTheNextTriplet();
        }

        console.log("# of correct triplet: " + numCorrectTriplet + ", # of triplets completed: " + ixCurrentTriplet); 
        
        // Check if we have reached the end of session
        if (!bNextDigit) {
            
            // Update status bar
            updateProgressStatusBar();
            document.getElementById("labelProgress").style.visibility = "hidden";
        
            disableTestParameters(false);

            endTime = new Date(); 

            // Set the global variable values
            resultsTriplet.correctAnswer = correctAnswer;
            resultsTriplet.userAnswer = userAnswerSubmit;
            resultsTriplet.completedTriplet = ixCurrentTriplet;

            // Display a message prompt that we're done. This breaks the thread
            // execution allowing the subject to pass control to the operator
            showResultsGlobal();
            
            // Compute test results
            endOfSession(bCorrectAnswer);

            // Get the test duration and convert it to the format: min-sec
            let duration = Math.abs(endTime.getTime() - startDateTime.getTime());
            let testDuration = convertMilliSecToTime(duration);
            let testDate = currentDate(startDateTime);
            let startTestTime = currentTime(startDateTime);
           
            // Hide and dispose the keypad and stop test
            // Notify the main thread that final iteration is done

            // Open modal with the results
            document.getElementById('modalAskViewResults').style.display = 'block';

            // Get the number of triplets 
            let numberTriplets = ixCurrentTriplet;
            
            // Create an object to show on the modal --> results page
            var showResults = new ModalResults(language, talker, list, mode, tripletType, testEar, masker, startingSNR, SRT, STDEV, numberReversal, testDate, testDuration, startTestTime, numberTriplets);
            showResults.showModalResults();
            showResults.show();  
            
            showResultsGlobal();
            // stop test to reset the parameters
            stopTest();

        } else {  
            // Play audio file and update status bar
            updateProgressStatusBar();
            CDTT.playAudio(list_wav[ixCurrentTriplet]); 
        } 
    }
}


/**
 * This function converts the time from milliseconds to the
 * following time format: hh:min:sec
 * 
 * @param {Number} duration time in milliseconds
 * @returns time in min and seconds
 */
function convertMilliSecToTime(duration) {
    
    // Convert the time to seconds and minutes
    let seconds = Math.floor(duration/1000) % 60;
    let minutes = Math.floor(duration/ (1000*60));

    seconds = (seconds < 10) ? "0" + seconds : seconds;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    return minutes + "min " + seconds + "s";
  }


/**
 * This function performs some end of session cleanup by
 * calculating the theoretical next SNR, releasing or 
 * resetting resources, and returning the appropriate
 * test results depending on the test mode selected:
 *   - For fixed-SNR testing, we return the to total number of
 *     correct digits, as well as the percentage correct score.
 *   - For adaptive testing, we return the SRT along with the
 *     standard deviation and number of reversals for that measurement.
 * 
 * For consistency with the method presentCurrentTriplet(),
 * the parameter bBCorrectAnswer is of type Boolean not boolean.
 * Its value can be set to true or false, but it can also be
 * set to null, which indicates an uninitialized state, which
 * corresponds to the first presentation of the first triplet.
 * However, this function will never receive a null parameter
 * as it's only called at the end of a test session.
 * @param {boolean} bCorrectAnswer answer to previous triplet
 */
function endOfSession(bCorrectAnswer) {

    // Compute the last SNR value: this is the value that the next
    // triplet would have been presented at based on the answer to
    // te last triplet presented.
    computeCurrentSNR(bCorrectAnswer);

    // Reset the current triplet index
    ixCurrentTriplet = 0;
       
    // Compute the SRT
    // Compute the mean SNR over a given number of iterations
    SRT = DSPutils.mean(SNR, 4.0, SNR.length-1);

    // Compute STDEV
    // Compute the standard deviation over a given number of iterations
    STDEV = DSPutils.stdDev(SNR, 4.0, SNR.length-1);


    // Compute the number of reversals
    // Compute then mean SNR over a given number of iterationss
    //numberReversal = DSPutils.sum(reversal, 4.0, reversal.length-1);
    numReversals = DSPutils.sum(reversal, 4.0, reversal.length-1);
}


/**
 * This function is called to increment the triplet index
 * by one. The return value is true if there's a next set
 * of triplets, otherwise the return value is false, 
 * meaning we have completed all triplets.
 * 
 * @returns (true) if next digit, (false) otherwise
 */
function moveToTheNextTriplet() {
    // Increment the triplet index
    ixCurrentTriplet++;

    // Update the progress
    progress(ixCurrentTriplet);

    // Return true as long as we haven't reached the end
    return (ixCurrentTriplet <= (list_wav.length-1));
}


/**
 * This function calculates the answer of the current triplet. If the triplet
 * type chosen in the test parameters is "Triplet", then the return value is 
 * a comparison between the correct answer and the user's answer. Otherwise,
 * we call the scoreTestAllDigits() function, who is reponsible to compare the 
 * current answer to the current array of digits presented to the participant. 
 * It returns true if we have a correct answer, and false if we have an incorrect 
 * answer.
 * 
 * @param correctAnswer correct triplet answer
 * @param userAnswerSubmit user triplet answer
 * @returns TRIPLET: flag indicating if all digits were identified correctly and in the correct order.
 * @return ALL DIGITS: flag indicating if all digits were identified correctly, even if not in the right order. 
 */
function scoreCurrentTriplet(correctAnswer, userAnswerSubmit) {
    if (tripletType == "Triplet") {
        return userAnswerSubmit == correctAnswer
    }
    return (userAnswerSubmit == correctAnswer) || scoreTestAllDigits(correctAnswer, userAnswerSubmit); 
}


/**
 * This function is called to score the subject's answer if we consider all 3 
 * digits instead of the triplet and if we don't consider the order of the 3 digits. 
 * This is done as follow:
 * 	- Passe the value of the current digit, if found in the correct answer, to 
 * 		the new array
 * 	- If the current digit is passed on to the new array, we change its value in 
 * 		answerSubject to -1
 * 	- Returning true if all digits were recognized correctly by the function 
 * 		scoreTestAnswer (false otherwise) 
 * 
 * This function is called by the function scoreCurrentTriplet in the TestSession
 * once a subject's answer has been received and if the test is either in fixed mode, 
 * or in adaptive mode with the "ALL DIGITS" scoring option selected in Settings. 
 * 
 * @param correctAnswer Correct Triplet
 * @param userAnswerSubmit User's triplet
 * @return flag indicating the answer is correct or incorrect
 */
function scoreTestAllDigits(correctAnswer, userAnswerSubmit) {

    // Allow scoring with permutation
    let tmpNumCorrectDigit = 0;
    // Split the answers into arrays 
    let tmpCorrectAnswer = correctAnswer.split("");
    let tmpUserAnswer = userAnswerSubmit.split("");

    for (let ix = 0; ix < 3; ix++) {
        for (let jx = 0; jx < 3; jx++) {

            // Check if the stimulus Digit is the same as the digit entered by the user
            if (tmpCorrectAnswer[ix] == tmpUserAnswer[jx]) {

                // Change the current digit value to -1 in case the same digit is 
                // repeated more than one in the answer
                tmpUserAnswer[jx] = -1;

                // Update the number of correct digits in this triplet
                tmpNumCorrectDigit += 1;
                break;
            }
        }
    }
    return tmpNumCorrectDigit == 3; // for 3 correct digits
}


/**
 * This function computes the SNR for the current triplet
 * presentation. The current SNR is based on the previous SNR
 * value, and the step size. If the test session uses a 
 * fixed-SNR testing mode (mode == 0), the SNR remains the 
 * same for each iteration.
 * 
 * For adaptive testing (mode > 0), the two-phased calculation
 * procedure uses a coarse step size first, then a fine step 
 * size after the first reversal has been detected. Therefore,
 * this function calls detectReversal() to detect when a reversal
 * has occurred. The step size is updated on the first reversal,
 * and the reversals are tracked in an array in the TestResults class.
 * The number of reversals is reported in the results spreadsheet.
 * @param {boolean} bCorrectAnswer Correct/incorrect answer to previous triplet
 * @returns none
 */
function computeCurrentSNR(bCorrectAnswer) {

    // Initialize the SNR to the value used just before we got here
    //var currentSNR = speechLevelVal - maskerLevelVal;

    // Set a temporary variable in case the maximum level is reached
    var tmpSNR = currentSNR;

    if (bCorrectAnswer && firstCorrectAnswer) {
        
        // Set the SNR before reversal value when the first correct answer is entered
        firstCorrectAnswer = false;
    }

    // Detect if a reversal was encountered
    bFirstReversal |= detectReversal(bCorrectAnswer, currentSNR);

    // Set the step size for the current and future iterations
    if (!bFirstReversal) {
        dBSTEP = 4.0;
    } else {
        dBSTEP = 2.0;
    }

    // Compute the current SNR based
    if (bCorrectAnswer) {

        // Answer was correct, decrease SNR
        currentSNR -= dBSTEP;

        // Set the number of misses in a row back to zero
        nmisses = 0;
    } else {

        // Answer was incorrect, increase SNR
        currentSNR += dBSTEP;

        // Increment the number of misses in a row
        nmisses++;
    }

    // Update the SNR array  with the new value we just compiled
    setSNR(ixCurrentTriplet, currentSNR);
}


/**
 * This function detects whether the answer to the previous triplet causes
 * a reversal in SNR during this test session.
 * 
 * The first reversal is used to update the step size in computeCurrentSNR()
 * and the number of reverals is tracked in the TestResults class and 
 * reported in the results spreadhseet.
 * 
 * @param {boolean} bCorrectAnswer Correct/incorrect answer to previous triplet
 * @param {float} SNR Current sound to noise ratio
 * @returns boolean flag indicating if a reversal was encountered or not
 */
function detectReversal(bCorrectAnswer, SNR) {
    let bReversal = false;
    let currentSNR = parseFloat(SNR);
    // Detect reversal only if we've done at least 2 iterations already
    if (ixCurrentTriplet > 1) {

        // Get the SNR from the previous iteration
        let previousSNR = parseInt(getSNR(ixCurrentTriplet - 2));

        // If previous SNR was ascending, look for correct answer
        // If previous SNR was descending, look for incorrect answer
        if (((currentSNR > previousSNR) && bCorrectAnswer) || ((currentSNR < previousSNR) && !bCorrectAnswer)) {

            // Update the reversals array with a value of 1 at current index
            //setReversal(ixCurrentTriplet, 1);
            numberReversal++;

            // Set return value to true
            bReversal = true;
        }
    }
    return bReversal;
}


// setter/getter methods 
function setSNR(idx, SNRvalue){SNR[idx] = parseFloat(SNRvalue);}
function getSNR(idx) {return parseFloat(SNR[idx]);}
function setReversal(idx, nreversal) {reversal[idx] = parseInt(nreversal);}
function getReversal(idx) {return parseInt(reversal[idx]);}


/**
 * This function disables all textboxes, drop down lists, buttons 
 * and checkboxes for all test parameters. 
 * @param {boolean} bool true/false to either disable or enable the parameters
 */
function disableTestParameters(bool){

    // disable all dropdown lists and checkbox
    // Test Parameters
    document.getElementById("languageDropDownList").disabled = bool;
    document.getElementById("talkerDropDownList").disabled = bool;
    document.getElementById("listDropDownList").disabled = bool;
    document.getElementById("maskerDropDownList").disabled = bool;
    document.getElementById("testModeDropDownList").disabled = bool;
    document.getElementById("testEarDropDownList").disabled = bool;
    document.getElementById("testInQuiet").disabled = bool;
    document.getElementById("tripletTypeDropDownList").disabled = bool;

    // Buttons
    document.getElementById("btnStartTest").disabled = bool;
    document.getElementById("btnStopTest").disabled = !bool;
}

// Retrieve all filepaths from Github
// const filePath_EN_female = "https://github.com/MelinaRochon/DTT/tree/main/applicationFiles/SOUNDFILES/List_Creation/";

// For debugging purpose 
const extractListNumber = (path) => {

   // Split the folder name
   // shows : 01 --> list number
   if (path.isDirectory == true){
    console.log("is folder :" + path.getNames());
   } else {
    console.log("is NOT a folder! "); 
   }
   const splitTriplet = path.split("-",2);
   console.log(splitTriplet);
   const lastIndex = splitTriplet.length-1;
   //const 
   console.log("LIST: " + lastIndex);
   return splitTriplet[lastIndex];
};

/**
 * CLASS
 */
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
    }


    show() {
        console.log(this.language + ", " + this.talker + ", " + this.list + ", " + this.masker + ", " + this.mode + ", " + this.testEar + ", " + this.speechLevel + ", " + this.maskerLevel
        + ", " + this.btestQuiet + ", " + this.tripletType);
        // output on console: EN_CA, Female, 01, SSNOISE, Fix Level, Left, 65, 65, false, Triplet       (when checkbox not selected for test in quiet)
    }

    /**
     * This method gets the path to the folder on Github that
     * meets all the requirements
     * @param {String} language 
     * @param {String} talker 
     * @param {string} list 
     */
    static getListOfFile (language, talker, list) {
        var wavFile = new XMLHttpRequest();
        
        wavFile.open('GET','https://api.github.com/repos/MelinaRochon/CDTT_lists/contents/' , 
            true)
            wavFile.onload = function() {
                var data = JSON.parse(this.response);
                
                // set the number of lists
                for (let i=0; i<data.length; i++) {
                    
                    // Check if the name of the Triplet corresponds to any
                    // of the list name
                    // ex. Triplet_List-01-EN_CA-Female
                    let nameFolder = data[i].name;
                    const paramArray = nameFolder.split("-");
                    // Array: [Language, Talker]
                    
                    // Check if all the parameters of the folder correspond to the ones selected by the user
                    if ((paramArray[0] == language) && (paramArray[1] == talker)){
                        // Found list
                        // Returns the path of folder to access it later on
                        CDTT.getCorrectFile(data[i].url, list)
                    }
                    
                    // for debugging purpose
                    //console.log(tempName);
                    //console.log(paramArray);
                    //console.log(data);
                }
            }
            wavFile.send();
    }


    /**
     * This method gets the path to the folder on Github that
     * meets all the requirements 
     */
    static getCorrectFile (url, list) {
        var file = new XMLHttpRequest();
        let maskerUrl = "";
        file.open('GET', url , true)
        file.onload = function() {
                var data = JSON.parse(this.response);
                // set the number of lists
                for (let i=0; i<data.length; i++) {
                    
                    // Check if the name of the Triplet corresponds to any
                    // of the list name
                    // ex. Triplet_List-01
                    let nameFolder = data[i].name;

                    // Check for masker 
                    if (nameFolder == "SSNOISE.wav") {
                        maskerUrl = data[i].download_url;
                    } 
                    else {
                        const paramArray = nameFolder.substring(13); 
                      
                        // Check if all the parameters of the folder correspond to the ones selected by the user
                        if (paramArray == list){ 
                            // Found list
                            // Returns the path of folder to access it later on
                            if (maskerUrl == "") {
                                maskerUrl="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Maskers/SSNOISE.wav"
                            }
                            CDTT.getWavFolder(data[i].url, maskerUrl);
                        }
                    }
                }
            }
            file.send();
    }


    /**
     * This static method sets the on-screen keyboard to visible or hidden.
     * @param {boolean} visible 
     */
    static enableKeyboard(visible) {
        document.getElementById("tableKeyboard").style.visibility = visible;
    }


    /**
     * This function gets the url for the correct folder on Github and
     * gets all .wav files in the folder, to play the triplets. 
     * 
     * @param url path of the wav folder
     */
    static getWavFolder(url, maskerUrl) {
        // Get the folders in a list
        var wavFiles = new XMLHttpRequest();
        maskerAudioWav = maskerUrl;
        wavFiles.open('GET', url, true)
        wavFiles.onload = function() {
            var data = JSON.parse(this.response);
            
            // returns random index between 0 and data.length, then pushes 
            // the selected index number to the list, to create a random triplet
            // selection

            let i = 0;
            var tmpCorrectAnswer = [];
            // Returns a random integer between 0 and data.length
            // Mix the order of the triplets randomly
            while (data.length > 0) {
                let random = Math.floor(Math.random() * data.length);
                list_wav[i] = data[random].download_url;

                // Get the correct answer triplet
                tmpCorrectAnswer[i] = data[random].name;
                
                // Delete .wav, keep the triplet digits
                correctAnswer[i] = tmpCorrectAnswer[i].substring(0,3);
                data.splice(random, 1);
                i++; 
            }

            // play masker if !testInQuiet
            CDTT.playAudio(list_wav[0]);
        }
        wavFiles.send();
    }

    
    /**
     * This function plays each triplets. It sets the volume of each audio file
     * according to the gain (from dB). 
     * 
     * @param {String} wavFile 
     */
    static playAudio(wavFile) { 
        
        // Create triplet and masker audio object
        var audio = new Audio(wavFile);
        var maskerNOISE = new Audio(maskerAudioWav);

        // Set the crossOrigin to 'anonymous', or else 
        // we have a CORS policy error
        audio.crossOrigin = 'anonymous';
        maskerNOISE.crossOrigin = 'anonymous';
        try {

            console.log('iteration: '+ ixCurrentTriplet + ', SNR = ' + currentSNR);
            console.log('Reversal = ' + numberReversal); 
            
            // Calculate the gain volume
            let setVolume = CDTT.gainVolume();
            
            // Play the triplet and the masker only if the 
            // gain value is between 0.0 and 1.0
            if (setVolume) {
                
                // Set the volume for audio
                //audio.volume = initialVolume;
                if (mode == "Adaptive") {
                    audio.volume = initialVolume;
                } else {
                    // Audio volume stays the same
                    audio.volume = document.getElementById("speechCalib").value;
                }

                // Set the volume for masker
                maskerNOISE.volume = document.getElementById("maskerCalib").innerHTML;
                // No masker, test in quiet
                if (btestQuiet===true) {
                    maskerNOISE.volume = 0.0;
                }
                
                // Play audio
                maskerNOISE.play();
                audio.play();

                console.log("volume audio=" + audio.volume + " | volume masker="+ maskerNOISE.volume );
            }
            
            // check if user clicked on "stop button"
            // if so, stop sound
            let stopBtn = document.getElementById("btnStopTest");
            stopBtn.addEventListener("click", function () {
                // Stop audio
                maskerNOISE.pause();
                audio.pause();
            })

            // Check if user clicked on the skip to test button
            let skipBtn = document.getElementById("btnSkipToTest");
            skipBtn.addEventListener("click", function() {
                // Stop audio
                maskerNOISE.pause();
                audio.pause();
            });   

        } catch (err) {
            console.log("failed to play " + err);
        }

        // Audio is done playing
        audio.onended = function() {
            // stop audio
            maskerNOISE.pause();

            // Change value of keyboard to false
            bNotReadyForAnswer = false;

            // check if all 3 digits are already entered on keyboard
            let tmpInputValue = document.getElementById('inputUserText').value;

            // Update the textfield
            if (tmpInputValue.length == 3) {
                updateTextFieldKeyboard(tmpInputValue);
            }      
        };
    }

    
    /**
     * This function calculates the volume gain.
     * @returns 
     */
    static gainVolume() {
        
        // 1.0 ==> 100%
        // We will want to change volume according to the gain 
        var gainVolume = 0;
        var tempVolume = 0.0; // temp value to store the current audio file volume

        // Temporary value to old the previous volume
        var prevVolume = initialVolume;

        // Calculate the gain
        if (bCorrectAnswer == true) {
            tempVolume = Math.pow(10, -(dBSTEP)/20);
        } else {
            tempVolume = Math.pow(10, dBSTEP/20);
        }

        initialVolume = tempVolume * initialVolume;

        // Gain is greater than 1.0, therefore abort test run
        if (Settings.SUBMIT_BTN_TEST == 2) {
            if (initialVolume > 1.00) {
                initialVolume = prevVolume;
                alert("The maximum volume has been reached. \nThe test run is aborted.");
                stopTest();
                return false;
            } 
    
            // If the user reached 5 misses in a row, test run is aborted.
            if (nmisses >= 5) {
                alert("The maximum number of misses have been reached. \nThe test run is aborted.");
                stopTest();
                return false;
            }
        } else {
            if (initialVolume > 1.00) {
                initialVolume = prevVolume;
            }
        }     
        return true;
    }
}



// DIFFERENT WAY OF PLAYING AUDIO FILE
// static playAudio(wavFile) { 
        
//     // Create triplet and masker audio object
//     var audio = new Audio(wavFile);
//     var maskerNOISE = new Audio('/Maskers/SSNOISE.wav');
    
    
//     // var audioCtxAudio = new (window.AudioContext || window.webkitAudioContext)();
//     // var audioCtxMasker = new (window.AudioContext || window.webkitAudioContext)();
//     // // Create a MediaElementAudioSourceNode
//     // var sourceAudio = audioCtxAudio.createMediaElementSource(audio);
//     // var sourceMasker = audioCtxMasker.createMediaElementSource(maskerNOISE);

//     // // Create a stereo panner for both speech and masker
//     // var panNodeAudio = audioCtxAudio.createStereoPanner();
//     // var panNodeMasker = audioCtxMasker.createStereoPanner();

//     // var gainAudio = audioCtxAudio.createGain();
//     // var gainMasker = audioCtxMasker.createGain();
//     // // Select the side to play the sound
//     // if (testEar == 0)  {
//     //     // Diotic, both ears
//     //     panNodeAudio.pan.value = 0;
//     //     panNodeMasker.pan.value = 0;
//     // } else if (testEar == 1) {
//     //     // Left side only
//     //     panNodeAudio.pan.value = -1; 
//     //     panNodeMasker.pan.value = -1;
//     // } else {
//     //     // Right side only
//     //     panNodeAudio.pan.value = 1;
//     //     panNodeMasker.pan.value = 1;

//     // }
    
//     // Wait 0.5 sec with backgorund noise then play audio
//     // When audio done playing, wait 5sec with background noise than stop
//     // Then, disable submit btn
//     // Play new audio file

//     // Connect the audio buffer to the gain node and the gain node to the 
//     // destination, so we can play both the masker and the speech and adjust
//     // its volume according to the answer entered. 
    

//     audio.crossOrigin = 'anonymous';
//     maskerNOISE.crossOrigin = 'anonymous';
//     try {

//         console.log('iteration: '+ ixCurrentTriplet + ', SNR = ' + currentSNR);
//         console.log('Reversal = ' + numberReversal); 

        
//         // Calculate the gain volume
//         let setVolume = CDTT.gainVolume();
        
//         // Play the triplet and the masker only if the 
//         // gain value is between 0.0 and 1.0
//         if (setVolume) {
            
//             // Set the volume for audio
//             //audio.volume = initialVolume;
//             if (mode == "Adaptive") {
//                 audio.volume = initialVolume;
//             } else {
//                 // Audio volume stays the same
//                 audio.volume = document.getElementById("speechCalib").value;

//             }
            
//             //  gainAudio.gain.value = initialVolume;
//             //  gainAudio.gain.setValueAtTime(initialVolume, audioCtxAudio.currentTime);
//             //  gainMasker.gain.value = document.getElementById("maskerCalib").value;
//             //gainMasker.gain.setValueAtTime(, audioCtxMasker.currentTime);

//             // 

//             // Set the volume for masker
//             maskerNOISE.volume = document.getElementById("maskerCalib").innerHTML;
//             // No masker, test in quiet
//             if (btestQuiet===true) {
//                 maskerNOISE.volume = 0.0;
//             }
            
//             // Play audio
//             maskerNOISE.play();
//             audio.play();

//             console.log("playing..., volume audio=" + audio.volume + " | volume masker="+ maskerNOISE.volume );
//             // sourceAudio.connect(panNodeAudio);
//             // sourceMasker.connect(panNodeMasker);
//             // panNodeAudio.connect(audioCtxAudio.destination);
//             // panNodeMasker.connect(audioCtxMasker.destination);

//         }
        
//         // check if user clicked on "stop btn"
//         // if so, stop sound
        
//         let stopBtn = document.getElementById("btnStopTest");
//         stopBtn.addEventListener("click", function () {
//             // Stop audio
//             maskerNOISE.pause();
//             audio.pause();
//         })

//         // Check if user clicked on the skip to test button
//         let skipBtn = document.getElementById("btnSkipToTest");
//         skipBtn.addEventListener("click", function() {
//             // Stop audio
//             maskerNOISE.pause();
//             audio.pause();
//         });
//         // check if sound is done playing, if so, then submit btn is called
//         // and submit btn is disabeld if done and 3 numbers entered, else disabled
                
                
                
//     } catch (err) {
//         console.log("failed to play " + err);
//     }

//     // Audio is done playing
//     audio.onended = function() {
        
//         // stop audio
//         maskerNOISE.pause();

//         // Change value of keyboard to true
//         // if (document.getElementById("btnSubmitTest").style.display == "block") {
            
//         // }
//         bNotReadyForAnswer = false;

//         // check if all 3 digits are already entered on keyboard
//         let tmpInputValue = document.getElementById('inputUserText').value;

//         // Update the textfield
//         if (tmpInputValue.length == 3) {
//             updateTextFieldKeyboard(tmpInputValue);
//         }      

        
//     };

// }
