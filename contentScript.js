console.log('KTH-gpa content script loaded!');

var results = new Array;

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

document.arrive(".col-sm-5", function() {
    this.appendChild(gpaResultsBox); // Make results box visible when navigated to the results page
});

document.arrive("ladok-avslutad-kurs .card-body", function() {
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