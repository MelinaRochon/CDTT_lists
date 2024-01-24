import { addDoc } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
import { getFirestore, collection, Timestamp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDuKnaBoKS1M6sZVC5Nht4lfUJwCj9C9cY",
    authDomain: "cdtt-dc538.firebaseapp.com",
    projectId: "cdtt-dc538",
    storageBucket: "cdtt-dc538.appspot.com",
    messagingSenderId: "110118431025",
    appId: "1:110118431025:web:0a93184db381462d41e810",
    measurementId: "G-9M8V21CJ3J"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


const resultsCollection = collection(db, 'Results');

/**CLASS */
// Test Results frame GUI items
var submitElements = document.getElementById("submitResultsBtn");
var chckbxTerms = document.getElementById("modalResultsTerms");
var extraResultsFrame = document.getElementById("termsAndConditionFrame");

var error = document.createElement("p");
error.style.color = "red";
error.innerHTML = I18N.SUBMIT_RESULTS_ERROR;
document.getElementById("termsAndConditions").appendChild(error);
error.style.display = "none";

chckbxTerms.addEventListener("input", function() {
    if (chckbxTerms.checked) {
        chckbxTerms.style.outline = "none";

        // Do not show terms and conditions error
        error.style.display = "none";

        // Do not show red border
        extraResultsFrame.style.border = "2px groove rgb(192, 192, 192)";
    }
});

var resultsTripletList = [];

/**
 * This function submits the results. If the user did not check the
 * terms and conditions checkbox, the user can't submit his/her answer
 * to the database. Otherwise, a Results object is created and the 
 * results are stored in the firebase. 
 */
function submitResults() {
    if (!chckbxTerms.checked) {
        
        // Do not continue
        // Show error!
        error.style.display = "block";
        chckbxTerms.style.color = "red";

        // Red border color for the Results Frame
        extraResultsFrame.style.border = "4px solid red";
        
        // Cannot submit! Change color of checkbox border to let the user know
        chckbxTerms.style.outline = "2px solid #ff2851";
    } else {
        // Access results from results file and store them in Firebase
        var language = document.getElementById("resultLanguage").innerHTML;
        var talker = document.getElementById("resultTalker").innerHTML;
        var list = document.getElementById("resultListNumber").innerHTML;
        var mode = document.getElementById("resultMode").innerHTML;
        var tripletType = document.getElementById("resultTripletType").innerHTML;
        var testEar = document.getElementById("resultTestEar").innerHTML;
        var masker = document.getElementById("resultMasker").innerHTML;
        var startingSNR = document.getElementById("resultStartingSNR").innerHTML;
        var srt = document.getElementById("resultSRT").innerHTML;
        var stDev = document.getElementById("resultStDev").innerHTML;
        var numReversals = document.getElementById("resultReversals").innerHTML;
        var date_time = document.getElementById("resultDateTime").innerHTML;

        var age = document.getElementById("age").value + "";
        var languageProficiency = document.getElementById("languageProficiencyDropDownList").value + "";
        var hearing = document.getElementById("hearingDropDownList").value + "";
        var ear = document.getElementById("hearing2DropDownList").value + "";
        var dominantLanguage = document.getElementById("dominantLanguageTextBox").value + "";
        var comments = document.getElementById("comments").value + "";
        
        //create object
        getResultsExtendedResults();
        var firebase = new Results(language, talker, list, mode, tripletType, testEar, masker, startingSNR, srt, stDev, numReversals, date_time, age, languageProficiency, hearing, ear, dominantLanguage, comments, resultsTripletList); //stimTripletList, userTripletList);
        firebase.addNewDocument();
        
        ModalResults.displayExtraSection(false);
        ModalResults.clearQuestions();

        // Delete extended results table
        ModalResults.deleteExtendedResultsTable();
        
        document.getElementById("showResultsModal").style.display = "none";
        
        // Show the next modal to let the user know the answer was submitted succesfully
        loadNextPage();
        
    }
}
submitElements.addEventListener("click", submitResults);// {
    

function getResultsExtendedResults() {
    // Get Results
    // Try to obtain the table
    const table = document.getElementById("tableExtendedResults"); 

    let tmpStimList = [];
    let tmpUserList = [];
    if (table.className == "tableExtendedResults") { // element found
        // ROW: Start at row 1 because we don't want the headers
        // CELL: Start at cell 1 because we don't want to include the triplet number
        //       Append the cells values 
        for (let i=1; i<4; i++) {
            let cell = table.rows[i].cells;
            for (let j=1; j<7; j++) {
                // Append the cells for the stimTriplet list
                if (j < 4) {
                    tmpStimList[j-1] = cell[j].innerHTML;
                }

                // Append the cells for the userTriplet list
                if (j > 3) {
                    tmpUserList[j-4] = cell[j].innerHTML;
                }
            }
 
            resultsTripletList[i-1] = "Stimulus: " + tmpStimList.join("") + "\t|\tUser: " + tmpUserList.join("");
        } 

    } else {
        console.log("table NOT found!");  
    }
}


/**
 * This function loads the following page, once the results are saved. 
 */
function loadNextPage() {
    document.getElementById("resultsSavedModal").style.display = "block";
    setTimeout(showPage, 3000);
}


/**
 * This function shows the loading page, will the results are being
 * saved to the database.
 */
function showPage() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("loaded").style.display = "block";

    var btnSelected = document.getElementById("btnReturningMainP");

    // If button selected, returning on main page
    btnSelected.onclick = function() {
        returningMainPage();
    }
}


/**
 * This function returns to the main page and sets all the frame
 *  back to normal
 */
function returningMainPage() {

    // Close open modal
    document.getElementById("resultsSavedModal").style.display = "none";

    document.getElementById("startCDTT").style.display = "none";
    document.getElementById("practiceTest").style.display = "none";
    document.getElementById("TestParameters").style.display = "block";
    document.getElementById("testInstructions").style.display = "none";
    
    // Go back to main page
    document.getElementById("mainButton").style.display = "block";
    document.getElementById("CDTTtest").style.display = "none";
    document.getElementById("keyboardCDTT").style.display = "none";
    //document.getElementById("scorePracticeTest").style.display = "none";

    ModalResults.bodyOverflowVisible(true);

}


/**
 * @class Results
 */
class Results {

    /**
     * 
     * @param {String} language 
     * @param {String} talker 
     * @param {String} list 
     * @param {String} mode 
     * @param {String} tripletType 
     * @param {String} testEar 
     * @param {String} masker 
     * @param {String} startingSNR 
     * @param {String} SRT 
     * @param {String} STDEV 
     * @param {String} numReversals 
     * @param {String} dateTime 
     * @param {String} age 
     * @param {String} languageProficiency 
     * @param {String} hearing 
     * @param {String} dominantLanguage 
     * @param {String} comments 
     */
    constructor(language, talker, list, mode, tripletType, testEar, masker, startingSNR, srt, stDev, numReversals, dateTime, age, languageProficiency, hearing, ear, dominantLanguage, comments, resultsTripletList) { // timTripletList, userTripletList) {
        this.language = language;
        this.talker = talker;
        this.list = list;
        this.mode = mode;
        this.tripletType = tripletType;
        this.testEar = testEar;
        this.masker = masker;
        this.startingSNR = startingSNR;
        this.srt = srt;
        this.stDev = stDev;
        this.numReversals = numReversals;
        this.dateTime = dateTime;
        this.age = age;
        this.languageProficiency = languageProficiency;
        this.hearing = hearing; 
        this.ear = ear;
        this.dominantLanguage = dominantLanguage;
        this.comments = comments;
        this.resultsTripletList = resultsTripletList;
    }


    /**
     * This method adds the results to the firebase.
     */
    addNewDocument() {
        addDoc(resultsCollection, {

            "Adaptive test": {
                Reversals: this.numReversals,
                SRT: this.srt,
                "St. Dev.": this.stDev
            },
            "Date & Time": this.dateTime, 
            Language: this.language,
            'List #': this.list,
            Masker: this.masker,
            Mode: this.mode,
            "Starting SNR": this.startingSNR,
            "Subject": {
                Age: this.age,
                Hearing: this.hearing,
                "Better ear": this.ear,
                "Language Proficiency": this.languageProficiency,
                "Dominant Language": this.dominantLanguage,
                Comments: this.comments
            },
            Talker: this.talker,
            "Test Ear": this.testEar,
            "Triplet type": this.tripletType,
            "Extended Results": this.resultsTripletList
        });
    }
}

