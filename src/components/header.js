// Do I need a header at all? If it will contain only an image => replace header with a div.
export default function createHeader() { // 
    const header = document.createElement('header'); // 'div'
    header.classList.add('header');
    // Add App image or main TEXT like 'Doer's List'
    const heading = document.createElement('h1'); //
    heading.innerHTML = `Doer's List`             // Code for img
    header.appendChild(heading);                  //
    return header;
}