console.log('hello world');

document.arrive("ladok-avslutad-kurs .card-body", function() {
    // 'this' refers to the newly created element
    let p = document.createElement("p");
    p.innerText = "Test";
    this.appendChild(p);
    console.log('ladok-avslutad-kurs');
});
