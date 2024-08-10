import createButton from "./createButton";

export default function createContentWrapper() {
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');

    //  Adding a task button here right now...
    contentWrapper.appendChild(createButton({"btnName": "+ Add task", "classList": ["btn", "add-task-btn"]}));
    //
    return contentWrapper;
}