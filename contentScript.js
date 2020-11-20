console.log('hello world');

document.arrive("ladok-avslutad-kurs .card-body", function() {
    // This beautiful CSS grids table holds:
    // (1) completed course info on the left
    // (2) and KTHgpa stuff on the right
    let table = document.createElement("div");
    table.classList.add("grid-container");

    let leftCell = document.createElement("div");
    leftCell.classList.add("leftCell");
    table.appendChild(leftCell);

    // Transferring (1) into the table
    while (this.childNodes.length > 0) {
        leftCell.appendChild(this.firstChild);
    }
    this.appendChild(table);

    console.log('ladok-avslutad-kurs');
});
