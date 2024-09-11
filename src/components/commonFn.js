function createButton({btnName, classList, innerType = ''}) {
    // Example 
    // <button><img !! src="dessin.svg" !! class="icon">Test</button>

    let btn = document.createElement('button');
    if (innerType !== '') btn.dataset.innerType = innerType;
    btn.innerHTML = btnName;
    btn.classList.add(...classList);
    return btn;
}

function toggleCssClass(element, classAdd, classRemove) {
    element.classList.add(classAdd);
    element.classList.remove(classRemove);
}

export { 
    createButton,
    toggleCssClass,
};