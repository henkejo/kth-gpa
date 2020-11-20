console.log('KTH-gpa content script loaded!');

var results = new Array;

document.arrive("ladok-avslutad-kurs .card-body", function() {
    const courseStrings = this.querySelector(".ldk-visa-desktop > a").innerText.split("|");
    const courseCode = courseStrings[2].split(" ")[1];
    const credits = Number(courseStrings[1].split(" ")[1]);

    console.log(credits);

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
    bottomCellGpa.appendChild(checkBox);
    // Checkbox label
    let label = document.createElement("label");
    label.innerText = "Include in GPA count:";
    checkBox.appendChild(label); 
    // Actual checkbox
    let box = document.createElement("input");
    box.type = "checkbox";
    box.checked = true;
    label.appendChild(box);
    this.appendChild(table);
});
