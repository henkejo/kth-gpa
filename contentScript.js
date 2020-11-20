console.log('KTH-gpa content script loaded!');

var results = new Array;

document.arrive("ladok-avslutad-kurs .card-body", function() {
    const courseStrings = this.querySelector(".ldk-visa-desktop > a").innerText.split("|");
    const courseCode = courseStrings[2].split(" ")[1];
    const credits = Number(courseStrings[1].split(" ")[1]);
    
    const grade = this.querySelector(".card-body  strong").innerText.split(" ")[1];
    let applicable = true;
    let gradeScore;
    switch (grade) {
        case "-":
            applicable = false;
            break;
        case "P":
            applicable = false;
            break;
        case "F":
            gradeScore = 0;
            break;
        case "E":
            gradeScore = 3;
            break;
        case "D":
            gradeScore = 3.5;
            break;
        case "C":
            gradeScore = 4;
            break;
        case "B":
            gradeScore = 4.5;
            break;
        case "A":
            gradeScore = 5;
            break;
        default:
            break;
    }
    console.log(gradeScore);

    // This beautiful table holds:
    // (1) completed course info on the top
    // (2) and KTHgpa stuff on the bottom
    let table = document.createElement("div");
    table.classList.add("gpactrlcontainer");

    let topCellGpa = document.createElement("div");
    topCellGpa.classList.add("topCellGpa");
    table.appendChild(topCellGpa);

    // Transferring (1) into the table
    while (this.childNodes.length > 0) {
        topCellGpa.appendChild(this.firstChild);
    }

    let bottomCellGpa = document.createElement("div");
    bottomCellGpa.classList.add("bottomCellGpa");
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
    if (applicable) {
        box.checked = true;
        let p = document.createElement("p")
        p.innerText = "(Not applicable for GPA count)";
        p.style.display = "inline";
    } else {
        box.checked = false;
        box.disabled = true; 
        label.style.color = "grey";
        let p = document.createElement("p")
        p.innerText = "(Not applicable for GPA count)";
        p.style.display = "inline";
        checkBox.appendChild(p);
    }
    label.appendChild(box);
    this.appendChild(table);
});
