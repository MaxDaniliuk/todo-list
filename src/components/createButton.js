function createButton({btnName, classList, type = ""}) {
    // Example 
    // <button><img !! src="dessin.svg" !! class="icon">Test</button>

    let btn = document.createElement('button');
    if (type !== "") btn.setAttribute('type', type);
    btn.innerHTML = btnName;
    btn.classList.add(...classList);
    return btn
}

export default createButton;