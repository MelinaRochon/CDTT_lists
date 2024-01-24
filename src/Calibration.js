// GUI variables, Test Parameters and Internal Calibration frame
var sliderSNR = document.getElementById("startingSNRrange");            // Range slider for Starting SNR
var valueSNR = document.getElementById("startingSNRdB");                // Starting SNR label
var sliderMasker = document.getElementById("volumeRangeMasker");        // Range slider for Masker
var valueMasker = document.getElementById("maskerCalib");               // Masker label
var valueSpeech = document.getElementById("speechCalib");               // Speech label
var maskerAudio = document.getElementById('calibMaskerAudio');          // Masker Audio File
const maskerValCalib = document.getElementById("maskerValueCalib");     // Masker Calibration value


/**
 * This function checks if the user is on an IOS device or not. If it 
 * is, the test will be performed in fixed mode, otherwise, the test 
 * will be in adaptive mode.
 * 
 * REASON: Can't change an audio file volume with the program, or read 
 * the system volume, meaning the Masker & Starting SNR calibration is 
 * @returns (true) if device running on ios, (false) not an ios device
 */
function IOSdevice() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}


/**
 * This function is called when the "Load CDTT Test" button is pressed. 
 * This function detects if the user's device is an IOS or not, and sets 
 * the Test mode drop-down list option based on the function's return 
 * value.
 * 
 * It also populates all comboboxes found in the test parameters field,
 * and displays the CDTT main frame. 
 */
function loadTest() {
    
    // Check for IOS device
    const isIOS = IOSdevice();

    // Display the Test parameters and the Internal Calibration 
    // fields. 
    document.getElementById('CDTTtest').style.display = "block";
    document.getElementById('mainButton').style.display = "none";
    
    if (!Settings.COMPLETED_ONE_TEST) {
        // Set the comboboxes for the test parameters
        Settings.ddlLanguage();
        Settings.ddlTalker();
        Settings.ddlList();
        Settings.ddlMasker();
        Settings.ddlTestEar();
        Settings.ddlTripletType();
    
    

        if (!isIOS) {

            // Not working with an IOS device, show Calibration Modal
            // Set the test mode to adaptive
            Settings.ddlTestMode("Adaptive");

            // Set the defaut Masker value
            sliderMasker.value = 0.5;
            valueMasker.innerHTML = sliderMasker.value;

            // Set the default Speech value
            valueSpeech.value = 0.500;

        } else {
            // Set the test mode to fix
            Settings.ddlTestMode("Fix");

            // Disable the Starting SNR and noise slider range
            sliderSNR.disabled = true;
            sliderMasker.disabled = true;

            // Set the masker slider value to 0.9, the masker value to 1.0
            // and the speech value to 1.0 as it is unrelevant for this type of test
            sliderMasker.value = 0.9;
            valueMasker.innerHTML = 1.0;
            valueSpeech.value = 1.0;
        }
    
    
        // Set the default SNR value
        sliderSNR.value = 0.0;
        valueSNR.innerHTML = sliderSNR.value + ".0 dB";

        // Executing test more than once
        Settings.COMPLETED_ONE_TEST = true;
    }
}


/**
 * This function is called everytime the program detects
 * a change, when the user updates the starting SNR 
 * slider value.
 * It calls the startingSpeechValue() function to set the 
 * speech value.
 */
function updateSNRSliderValue() {
    // Set starting SNR value
    valueSNR.innerHTML = sliderSNR.value + ".0 dB";
    
    // Set the speech value
    valueSpeech.value = startingSpeechValue(sliderSNR.value, sliderMasker.value);
}


/**
 * This function is called everytime the program detects
 * a change, when the user updates the masker slider 
 * value. The noise audio file volume is set. 
 * It calls the startingSpeechValue() function to set the 
 * speech value.
 */
function updateMaskerSliderValue() {
    // Set the masker value
    valueMasker.innerHTML = sliderMasker.value;
    
    // Set the speech value
    valueSpeech.value = startingSpeechValue(sliderSNR.value, sliderMasker.value);

    // Set the masker volume
    maskerAudio.volume = valueMasker.innerHTML;
}


/**
 * This function sets the starting speech value, the noise value 
 * and the noise audio file volume. If the speech value is greater
 * than 1.0, the noise value is decremented by 0.1 until this one
 * is lower or equal 1.0.
 * @param {Number} SNRval Starting SNR value
 * @param {Number} masker Masker value
 * @returns Speech value
 */
function startingSpeechValue(SNRval, masker) {
    
    // Get the speech gain
    let speech = (masker) * (Math.pow(10, (SNRval/20)));
    
    // Check if speech value is greater than 1.0
    if (speech > 1.0) {
        valueMasker.innerHTML -= 0.1; // Decrement the masker value
        let tmpMaskerValue = parseFloat(valueMasker.innerHTML);
        valueMasker.innerHTML = tmpMaskerValue.toFixed(1);
        sliderMasker.value -= 0.1;

        // Set the masker volume
        maskerAudio.volume = valueMasker.innerHTML;

        // Recall the function until the speech is lower than 1.0
        return startingSpeechValue(sliderSNR.value, sliderMasker.value);
    }

    // Change speech value
    return speech.toFixed(3);
}


/**
 * This function is called when the user select the "Next" button, on
 * the main page. It hides the current frame and displays the test
 * practice frame.
 */
function nextFrame() {
    
    // Stop sound in case it is still playing
    maskerAudio.pause();

    // Reset "Play Masker" button
    playMasker(false);
    
    // Set the flag value to false 
    Settings.CALLED_CALIBRATION_FRAME = false;

    // Enable the "Practice Test" button, in case it was previously disabled
    document.getElementById("btnPracticeTest").disabled = false;

    // Hide the test parameters frame
    document.getElementById("TestParameters").style.display = "none";

    // Show the practice test frame
    document.getElementById("practiceTest").style.display = "block";

    // Display the frame used for the keyboard, with the keyboard still
    // being hidden
    document.getElementById("keyboardCDTT").style.display = "block";

    document.getElementById("scorePracticeTest").innerHTML = ""; 
}


/**
 * This function is called when the user selects the "Done" button
 * on the Calibration modal, as it redirect the user back to the test 
 * parameters page, to continue calibrating.
 */
function doneCalibration() {

    // Go back to the main frame
    // Show main page scrolling view
    ModalResults.bodyOverflowVisible(true);

    // Close calibration modal and display the main frame
    document.getElementById("calibrationModal").style.display = "none";
    document.getElementById("TestParameters").style.display = "block";
}


/**
 * This function is called to see if the audio file is playing
 * or is paused.
 * @param {*} audio masker Audio
 * @returns (true) audio is paused, (false) audio is playing
 */
function isPlaying(audio) { 
    return !audio.paused; 
}


/**
 * This function is called to change the style of the masker button. When the 
 * masker is playing, the masker button class name is renamed to "btnPause" and
 * when the masker is not playing, the noise button class name is renamed back 
 * to "btnPlay".
 * 
 * This function also flags the variable CALLED_CALIBRATION_FRAME to determine 
 * whether the calibration modal has been displayed. If the masker is playing 
 * and the variable has not been previously flagged, then we display the 
 * calibration modal, and flag it.
 * 
 * @param {boolean} play (true) masker playing, (false) masker not playing
 */
function playMasker(play) {
    let calibrationModal = document.getElementById('calibrationModal');
    // Is Masker playing or not.

    let className = "";
    let btnText = "";

    if (play) {
        
        // Masker playing, set the flag to true
        if (!Settings.CALLED_CALIBRATION_FRAME) {
            
            // Reset the masker label inner html, found in the Calibration modal
            maskerValCalib.innerHTML = I18N.CALIB_FRAME_MASKER + valueMasker.innerHTML;
            
            // Show the calibration frame
            calibrationModal.style.display = "block";

            // Set the value to true so we can go to the next section
            Settings.CALLED_CALIBRATION_FRAME = true;
        } 
       
        // Change the button class name and set the inner HTML
        className = "btnPause";
        btnText = I18N.BTN_MASKER_STOP;
        
    } else {
        // Masker not playing
        // Reset the button class name and its inner HTML
        className = "btnPlay";
        btnText = I18N.BTN_MASKER_PLAY;
    }

    document.getElementById('btnCalibMaskerPlay').className = className;
    document.getElementById('btnCalibMaskerPlay').innerHTML = btnText;
}


/**
 * This function is called everytime when the Play/Pause button was clicked. 
 * It calls the isPlaying() function to check if the maskerAudio is playing
 * or not. If the masker was already playing when the button was selected, 
 * then we pause it, otherwise, we play the masker. 
 * 
 * The Play/Pause button is also renamed each time the masker button is
 * selected by calling the playMasker() function. 
 */
function buttonCalibration() {
    
    // Check if 
    if (!isPlaying(maskerAudio)) {

        // Play masker and set text button to Pause
        maskerAudio.volume = valueMasker.innerHTML;
        maskerAudio.play();

        // Rename button
        playMasker(true);
        
    } else {

        // Pause masker and set text button to Play
        maskerAudio.pause();
        
        // Rename button
        playMasker(false);
    }
}