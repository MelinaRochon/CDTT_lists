// Variables 
let w = [];
let j = [];
let t = 0;
var resultsTriplet = {
    correctAnswer: w,
    userAnswer: j,
    completedTriplet: t
};

function showResultsGlobal() {
    //console.log("correct answer: " + resultsTriplet.correctAnswer + " || user: " + resultsTriplet.userAnswer + " || completed: " + resultsTriplet.completedTriplet);

}

class Settings {

    static SUBMIT_BTN_TEST = 0;                 // (0) for none, (1) for practice, (2) for test
    static INDEX_TRIPLET_PRACTICE_TEST = 0;     // 0 = new practice test, 23 = on triplet 24
    static CALLED_CALIBRATION_FRAME = false;
    static FLAG_CALIBRATION_MODAL = false;      // Flag to display the calibration modal: (false) not displayed yet, (true) already displayed
    static FLAG_OPEN_DETAILED_RESULTS = false;  // Flag to see if the detailed results are displayed or not
    static COMPLETED_ONE_TEST = false;          // Flag to see if a test has been completed or not

    /**
     * This function populates the language dropdown list
     */
    static ddlLanguage() {
        var select = document.getElementById("languageDropDownList");
        var optionsLanguage = I18N.LANGUAGES;

        for(var i = 0; i < optionsLanguage.length; i++) {
            var opt = optionsLanguage[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    }


    /**
     * This function populates the talker dropdown list
     */
    static ddlTalker() {
        var select = document.getElementById("talkerDropDownList");
        var optionsTalker = I18N.TALKERS;

        for(var i = 0; i < optionsTalker.length; i++) {
            var opt = optionsTalker[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    }


    /**
     * This function populates the test list dropdown list
     */
    static ddlList() {
        var select = document.getElementById("listDropDownList");
        var optionsList = I18N.LIST_NUM;
        
        for(var i = 0; i < optionsList.length; i++) {
            var opt = optionsList[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    }


    /**
     * This function populates the masker dropdown list
     */
    static ddlMasker() {
        var select = document.getElementById("maskerDropDownList");
        var optionsMasker = I18N.MASKER;

        for(var i = 0; i < optionsMasker.length; i++) {
            var opt = optionsMasker[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    }


    /**
     * This function populates the Test mode dropdown list
     * @param {String} type (Adaptive) device not an IOS, (Fix) device is an IOS
     */
    static ddlTestMode(type) {
        var select = document.getElementById("testModeDropDownList");
        var optionsTestMode = [type];
        
        for(var i = 0; i < optionsTestMode.length; i++) {
            var opt = optionsTestMode[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    }


    /**
     * This function populates the test ear dropdown list
     */
    static ddlTestEar() {
        var select = document.getElementById("testEarDropDownList");
        var optionsTestEar = I18N.TEST_EAR;

        for(var i = 0; i < optionsTestEar.length; i++) {
            var opt = optionsTestEar[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    }


    /**
     * This function populates the triplet type dropdown list
     */
    static ddlTripletType() {
        var select = document.getElementById("tripletTypeDropDownList");
        var optionsTripletType = I18N.TRIPLET_TYPE;
        
        for(var i = 0; i < optionsTripletType.length; i++) {
            var opt = optionsTripletType[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    }

    
/**
 * This function populates the Language Proficieny DropDown List.
 */
static ddlLanguageProficieny() {
    var languageProficienyList = I18N.LANGUAGE_PROFICIENCY;
    for(var i = 0; i < languageProficienyList.length; i++) {
        var opt = languageProficienyList[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        languageProficiency.appendChild(el);
    }
}


/**
 * This function populates the Hearing DropDown list.
 */
static ddlHearingList() {
    var hearingList1 = I18N.HEARING_1;

    for(var i = 0; i < hearingList1.length; i++) {
        var opt = hearingList1[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        hearing.appendChild(el);
    }
}


/**
 * This function populates the Second Hearing DropDown list. 
 */
static ddlHearingList2() {
    var hearingList2 = I18N.HEARING_2;
    for (var i = 0; i < hearingList2.length; i++) {
        var opt = hearingList2[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        hearing2.appendChild(el);
    }
}
}