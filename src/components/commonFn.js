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

function createTaskCountContainer(id) {
    let taskCountSpan = document.createElement('span');
    taskCountSpan.classList.add('task-count');
    taskCountSpan.dataset.sectionTasks = id;
    return taskCountSpan;
}

function createIconContainer(svgImg, classList) {
    const iconContainer = document.createElement('span');
    iconContainer.classList.add(...classList);
    iconContainer.innerHTML = svgImg;
    return iconContainer;
}

export { 
    createButton,
    toggleCssClass,
    createTaskCountContainer,
    createIconContainer
};