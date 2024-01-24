// GUI variables, Test Results frame
var age = document.getElementById("age");                                               // Age number input
var languageProficiency = document.getElementById("languageProficiencyDropDownList");   // Language proficiency drop-down list
var hearing = document.getElementById("hearingDropDownList");                           // Hearing question 1, drop-down list
var hearing2 = document.getElementById("hearing2DropDownList");                         // Hearing question 2, drop-down list
var dominantLanguage = document.getElementById("dominantLanguageTextBox");              // Dominant language drop-down list
var textAreaValue = document.getElementById("comments");                                // Comments drop-down list
var chckbxTerms = document.getElementById("modalResultsTerms");                         // Checkbox terms and conditions


/**
 * This function is called when the "Print" button is selected.
 * It opens the Print Dialog Box, where the participant can 
 * select its printing options.
 * 
 * Note: window.print() function - prints the content of the Test 
 * Results modal window.
 */
function handlePrint() {
    window.print();
}


/**
 * This function is called when the "View" button is selected. The
 * handleViewResults() function displays the Test Results modal.
 * 
 */
function handleViewResults() {
    // Variables
    const modal = document.getElementById("modalAskViewResults");
    const modalResults = document.getElementById("showResultsModal");
    
    // Close current modal and open next one with the results
    modal.style.display = "none";
    modalResults.style.display = "block"; 
    ModalResults.bodyOverflowVisible(false);

    showExtendedResults();

    // Add the used language to the end of the innerHTML for the Language Proficieny question
    let getLanguage = document.getElementById("languageDropDownList").value;
    if (getLanguage == "EN_CA") {
        // Is in English
        document.getElementById("qlanguageProficiency").innerHTML = I18N.LANGUAGE_PROF_ENGLISH;
    } else {
        // French
        document.getElementById("qlanguageProficiency").innerHTML = I18N.LANGUAGE_PROF_FRENCH;
    }

    // Get the comboboxes questions options
    if (!Settings.FLAG_OPEN_DETAILED_RESULTS) {
        Settings.ddlLanguageProficieny();
        Settings.ddlHearingList();
        Settings.ddlHearingList2();
        
        // Set the flag to true to not call the functions again
        Settings.FLAG_OPEN_DETAILED_RESULTS = true;
    }
    
}


/**
 * This function is only used for debugging purpose. It displays the modal
 * where it asks the user if they want to view their results or not. 
 */
function openAskViewModal() {
    document.getElementById('modalAskViewResults').style.display = 'block';
    
    ModalResults.bodyOverflowVisible(false);
}


// Keep track of maximum size of text area
var results = document.getElementById("maxSizeTextArea");
var limit = 350; // limit of text user can enter
results.textContent = 0 + "/" + limit;
textAreaValue.addEventListener("input", function() {
    var textLength = textAreaValue.value.length;
    results.textContent = textLength + "/" + limit;

});


/**
 * This function is called to display the extended results table, 
 * where all the correct answers and all the answers submitted by 
 * the user are displayed. This table is displayed on the Test
 * Results modal.
 */
function showExtendedResults() {
   
    // Delete old extended results table
    ModalResults.deleteExtendedResultsTable();

    const table = document.createElement("table");
    table.setAttribute("class", "tableExtendedResults");
    table.setAttribute("id", "tableExtendedResults");

    const tableBody = document.createElement("tbody");

    const listOfTriplet = resultsTriplet.correctAnswer; 
    const userAnswerList = resultsTriplet.userAnswer; 
    const triplets = resultsTriplet.completedTriplet; 
    
    // Add first row
    let rowHeader = table.insertRow(0);
    let cellHeader = rowHeader.insertCell(0);
    cellHeader.innerHTML = "Triplet #";
    cellHeader.style.textAlign = "center";

    let cellHeaderAnswer = rowHeader.insertCell(1);
    cellHeaderAnswer.innerHTML = "Stimulus Digit";
    cellHeaderAnswer.colSpan = 3;
    cellHeaderAnswer.style.padding = "8px";
    cellHeaderAnswer.style.textAlign = "center";

    let cellHeaderUser = rowHeader.insertCell(2);
    cellHeaderUser.innerHTML = "User Answer";
    cellHeaderUser.colSpan = 3;
    cellHeaderUser.style.padding = "8px";
    cellHeaderUser.style.textAlign = "center";
   
    // Add the row to the end of the table body
    tableBody.appendChild(rowHeader);

    // Create all cells, row
    for (let i=0; i< triplets; i++) {
        // Create a table row
        const row = document.createElement("tr");
        
        // Create all columns
        for (let j=0; j< 7; j++) {
            // Create header
            const cell = document.createElement("td");
            var currentNode;
           
            var correctAnswerTriplet = listOfTriplet[i].split(""); // ex. listOfTriplet = ['123'], correctAnswerTriplet = ['1','2','3']
            var userAnswerTriplet = userAnswerList[i].split("");
            
            // Insert the values in the correct columns 
            if (j==0) {
                // Get the triplet number currently working with
                currentNode = document.createTextNode(i+1);                  
            } else if (j > 0 && j < 4) {
                // Create a text node
                currentNode = document.createTextNode(correctAnswerTriplet[j-1] )
            } else {
                // j > 3 && j < 7
                currentNode = document.createTextNode(userAnswerTriplet[j-4])
            }

            // append childs
            cell.appendChild(currentNode);
            row.appendChild(cell);    
        }

        tableBody.appendChild(row);
    }

    // Add the body of the table in the table element
    table.appendChild(tableBody);
    document.getElementById("showDetailedResults").appendChild(table);
}


/**
 * This class creates a ModalResults object and is used
 * to populate the Test Results Modal. 
 * 
 * @class Modal Results
 */
class ModalResults{

    //constructor
    constructor(language, talker, list, mode, tripletType, testEar, masker, startingSNR, SRT, STDEV, numReversals, date, testDuration, testStartingTime, numberTriplets) {
        this.language = language;
        this.talker = talker;
        this.list = list;
        this.mode = mode;
        this.tripletType = tripletType;
        this.testEar = testEar;
        this.masker = masker;
        this.startingSNR = startingSNR;
        this.SRT = SRT;
        this.STDEV = STDEV;
        this.numReversals = numReversals;
        this.date = date;
        this.testDuration = testDuration;
        this.testStartingTime = testStartingTime;
        this.numberTriplets = numberTriplets;
    }


    /**
     * This method takes the parameters entered in the Test Parameters section and 
     * the results for the adaptive test, to show them in the modal. 
     */
    showModalResults() {
        
        // Show the test results
        document.getElementById("resultLanguage").innerHTML = this.language;
        document.getElementById("resultTalker").innerHTML = this.talker
        document.getElementById("resultListNumber").innerHTML = this.list;
        document.getElementById("resultMode").innerHTML = this.mode;
        document.getElementById("resultTripletType").innerHTML = this.tripletType;
        document.getElementById("resultTestEar").innerHTML = this.testEar;
        document.getElementById("resultMasker").innerHTML = this.masker;
        document.getElementById("resultStartingSNR").innerHTML = this.startingSNR + " dB";
        document.getElementById("resultSRT").innerHTML = this.SRT;
        
        document.getElementById("resultStDev").innerHTML = this.STDEV;
        document.getElementById("resultReversals").innerHTML = this.numReversals;
        document.getElementById("resultDateTime").innerHTML = this.date + ", " + this.testStartingTime + " | " + this.testDuration;
    }

    
    show() {
        console.log(this.language + ", " + this.talker + ", " + this.list + ", " + this.masker + ", " + this.mode + ", " + this.testEar + ", " + this.startingSNR + ", " + this.SRT
        + ", " + this.STDEV + ", " + this.tripletType + ", " + this.numReversals + ", " + this.date);
        // output on console: EN_CA, Female, 01, SSNOISE, Fix Level, Left, 65, 65, false, Triplet       (when checkbox not selected for test in quiet)
    }


    /**
     * This static method is called to display or hide the extra section 
     * in the Test Results modal. 
     * 
     * @param {boolean} display (true) display, (false) don't display
     */
    static displayExtraSection(display) {
        var extraSectionClass = document.getElementsByClassName("allowSaveExtraSection")[0];
        if (display) {
            
            extraSectionClass.style.display = "block";
        } else {
            extraSectionClass.style.display = "none";
        }

    }


    /**
     * This static method is called to clear all entries in the 
     * drop-down lists text boxes, from the extra section of the
     * Test Results modal.
     */
    static clearQuestions() {

        // Reset the answers to all questions
        age.value = "";
        hearing.value = "";
        hearing2.value = "";
        languageProficiency.value = "";
        dominantLanguage.value = "";
        textAreaValue.value = "";
        chckbxTerms.checked = false;
    
        // Reset the number of characters in the text area
        results.textContent = 0 + "/" + limit;
    }


    /**
     * This static method sets the modal's display, who's called in 
     * the parameters (modalId) to 'none'. It also hides the extra 
     * section from the test results modal, called using the static 
     * method displayExtraSection() and it clears all question entries 
     * with the static method clearQuestions(). The extended results 
     * table is also deleted. 
     * 
     * @param {String} modalId name of the modal to be hidden
     */
    static closeResultsModal(modalId) {
        document.getElementById(modalId).style.display='none';
        ModalResults.bodyOverflowVisible(true)
        
        // Set the extra modal display to none, in case it was open
        ModalResults.displayExtraSection(false);

        // Clear the boxes, in case user answered
        ModalResults.clearQuestions();
        
        // Delete extended results table
        ModalResults.deleteExtendedResultsTable();

        document.getElementById("startCDTT").style.display = "none";
        document.getElementById("practiceTest").style.display = "none";
        document.getElementById("TestParameters").style.display = "block";
        document.getElementById("testInstructions").style.display = "none";
        // Go back to main page
        document.getElementById("mainButton").style.display = "block";
        document.getElementById("CDTTtest").style.display = "none";
        document.getElementById("keyboardCDTT").style.display = "none";
        //document.getElementById("scorePracticeTest").style.display = "none";

    }


    /**
     * This static method deletes the previous extended results table, 
     * found on the Test Results modal, if there was one. 
     */
    static deleteExtendedResultsTable() {
        const tableExist = document.getElementById("tableExtendedResults");
        if (tableExist != null) {
            
            tableExist.remove();
    
        }
    }


    /**
     * This static method sets the 'body' overflow scrolling view. The 
     * overflow property adds a scrollbar when the body's content is 
     * too big to fit the window. Therefore, if the isVisible parameter 
     * is set to true, the scrolling view is visible. Otherwise it sets 
     * the overflow scrolling view to hidden if the isVisible parameter 
     * is set to false.  
     * 
     * @param {boolean} isVisible 
     */
    static bodyOverflowVisible(isVisible) {
        if (isVisible) {
            document.querySelector("body").style.overflow = "visible";
        } else {
            document.querySelector("body").style.overflow = "hidden";
        }
    
    }
}