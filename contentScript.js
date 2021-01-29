console.log('KTH-gpa content script loaded!');

var results = new Array;

let leftDiv = document.createElement("div");
leftDiv.classList.add("gpa-left-div");

// Build results box
let gpaResultsBox = document.createElement("div");
gpaResultsBox.classList.add("gpa-box");
gpaResultsBox.classList.add("gpa-results-box");
let gpaTitle = document.createElement("p");
gpaTitle.innerText = "GPA:";
gpaTitle.classList.add("gpa-title");
let gpaText = document.createElement("p");
gpaText.innerText = "-";
gpaResultsBox.appendChild(gpaTitle);
gpaResultsBox.appendChild(gpaText);
leftDiv.appendChild(gpaResultsBox);


// Build other courses title box
let otherCoursesTitleBox = document.createElement("div");
otherCoursesTitleBox.classList.add("gpa-box");
let customTitle = document.createElement("p");
customTitle.innerText = "Add other courses:";
customTitle.classList.add("gpa-title");
otherCoursesTitleBox.appendChild(customTitle);
leftDiv.appendChild(otherCoursesTitleBox);

// Build other courses list div
let otherCoursesListdiv = document.createElement("div");
otherCoursesListdiv.id = "other-courses-list"
otherCoursesTitleBox.appendChild(otherCoursesListdiv);

// "Add" button
let addCourseBtn = document.createElement("button");
addCourseBtn.classList.add("gpa-add-course-btn");
addCourseBtn.innerText = "Add";
addCourseBtn.addEventListener("click", () => {
    addCourse();
});
leftDiv.appendChild(addCourseBtn);


function updateCount () {
    var numerator = 0;
    var denominator = 0;
    for (i = 0; i < results.length; i++) {
        let course = results[i];
        numerator += course.gradeFactor * course.credits;
        denominator += course.credits;
    }
    let gpa = numerator/denominator;
    gpaText.innerHTML = "~ " + gpa.toFixed(3);
}

function addCourse () {
    let otherCourseBox = document.createElement("div");
    otherCourseBox.classList.add("gpa-box");
    otherCourseBox.classList.add("gpa-other-course");

    let table = document.createElement("table");

    let headerRow = document.createElement("tr");
        let ccHeaderCell = document.createElement("td");
        let ccHeader = document.createElement("p");
        ccHeader.innerText = "Course code:";
        ccHeader.classList.add("gpa-title");
        ccHeaderCell.append(ccHeader);
        headerRow.appendChild(ccHeaderCell);

        let creditsHeaderCell = document.createElement("td");
        let creditsHeader = document.createElement("p");
        creditsHeader.innerText = "Credits:";
        creditsHeader.classList.add("gpa-title");
        creditsHeaderCell.append(creditsHeader);
        headerRow.appendChild(creditsHeaderCell);

        let gradeHeaderCell = document.createElement("td");
        let gradeHeader = document.createElement("p");
        gradeHeader.innerText = "Grade:";
        gradeHeader.classList.add("gpa-title");
        gradeHeaderCell.append(gradeHeader);
        headerRow.appendChild(gradeHeaderCell);

        let includeHeaderCell = document.createElement("td");
        let includeHeader = document.createElement("p");
        includeHeader.innerText = "Include:";
        includeHeader.classList.add("gpa-title");
        includeHeaderCell.append(includeHeader);
        headerRow.appendChild(includeHeaderCell);

        headerRow.appendChild(document.createElement("td"));
    let dataRow = document.createElement("tr");
        let ccCell = document.createElement("td");
        let ccInput = document.createElement("input");
        ccInput.id = "ccData";
        ccInput.type = "text";
        ccCell.append(ccInput);
        dataRow.appendChild(ccCell);

        let creditsCell = document.createElement("td");
        let creditsInput = document.createElement("input");
        creditsInput.id = "creditsData";
        creditsInput.type = "text";
        creditsCell.append(creditsInput);
        dataRow.appendChild(creditsCell);

        let gradeCell = document.createElement("td");
        let gradeInput = document.createElement("select");
        const grades = ["A", "B", "C", "D", "E", "F"];
        grades.forEach(grade => {
            let option = document.createElement("option");
            option.value = grade;
            option.innerHTML = grade;
            gradeInput.appendChild(option);
        });
        gradeInput.id = "gradeInput";
        gradeInput.type = "text";
        gradeCell.append(gradeInput);
        dataRow.appendChild(gradeCell);

        let includeCell = document.createElement("td");
        let includeInput = document.createElement("input");
        includeInput.type = "checkbox";
        includeCell.append(includeInput);
        dataRow.appendChild(includeCell);

        let removeCell = document.createElement("td");
        let remove = document.createElement("button");
        remove.classList.add("fa-trash");
        remove.classList.add("fa");
        remove.addEventListener("click", () => {
            otherCoursesListdiv.removeChild(otherCourseBox);
        });
        removeCell.appendChild(remove);
        dataRow.appendChild(removeCell);

    table.appendChild(headerRow);
    table.appendChild(dataRow);
    otherCourseBox.appendChild(table);

    otherCoursesListdiv.appendChild(otherCourseBox);
}


// Re-adding elements when switching to another ladok tab and back
document.arrive(".col-sm-5", function() {
    this.appendChild(leftDiv);
});

// Adding readers for each course when they appear
document.arrive("ladok-avslutad-kurs .card-body", function() {
    document.querySelector(".col-sm-5").appendChild(leftDiv);

    const courseStrings = this.querySelector(".ldk-visa-desktop > a").innerText.split("|");
    const courseCode = courseStrings[2].split(" ")[1];
    let credits = courseStrings[1].split(" ")[1];
    credits = Number(credits.replace(',', '.'));
    const grade = this.querySelector(".card-body  strong").innerText.split(" ")[1];

    let applicable = true;
    let gradeFactor;
    switch (grade) {
        case "-":
            applicable = false;
            break;
        case "P":
            applicable = false;
            break;
        case "F":
            gradeFactor = 0;
            break;
        case "E":
            gradeFactor = 3;
            break;
        case "D":
            gradeFactor = 3.5;
            break;
        case "C":
            gradeFactor = 4;
            break;
        case "B":
            gradeFactor = 4.5;
            break;
        case "A":
            gradeFactor = 5;
            break;
        default:
            applicable = false;
            break;
    }

    let result = { courseCode, credits, gradeFactor };

    let table = document.createElement("div");
    table.classList.add("gpactrlcontainer");

    let topCellGpa = document.createElement("div");
    topCellGpa.classList.add("topCellGpa");
    table.appendChild(topCellGpa);

    while (this.childNodes.length > 0) {
        topCellGpa.appendChild(this.firstChild);
    }

    let bottomCellGpa = document.createElement("div");
    bottomCellGpa.classList.add("gpa-box");
    bottomCellGpa.classList.add("gpa-completed-course-box");
    table.appendChild(bottomCellGpa);
    
    //  --- "Include in GPA count:"-checkbox
    let checkBox = document.createElement("div");
    checkBox.classList.add("checkBox");
    checkBox.style.display = "inline";
    bottomCellGpa.appendChild(checkBox);

    // Checkbox label
    let label = document.createElement("label");
    label.innerText = "Include in GPA count:";
    checkBox.appendChild(label); 

    // Actual checkbox
    let box = document.createElement("input");
    box.type = "checkbox";
    box.id = courseCode;

    if (applicable) {
        box.checked = true;
        results.push(result);
        updateCount();
    } else {
        box.checked = false;
        box.disabled = true; 
        label.style.color = "grey";
        let p = document.createElement("p")
        p.innerText = "(Not applicable)";
        p.style.display = "inline";
        checkBox.appendChild(p);
    }

    box.addEventListener("click", () => {
        if (results.includes(result)) {
            results = results.filter(function (e) {return e != result});
        } else {
            results.push(result);
        }
        updateCount();
    });
    
    label.appendChild(box);
    this.appendChild(table);
});