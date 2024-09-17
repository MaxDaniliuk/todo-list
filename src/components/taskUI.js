import { cachedElements } from "./cacheElements";
import { createButton } from "./commonFn";
import { createTaskForm } from "./form";
import { copyTaskData, getTaskToBeEdited, clearTaskCopy, evaluateTaskChanges, updateTargetTask, getTaskCopy, visualiseTaskData } from "./tasks";


export function displayTask(taskObj) {
    const li = document.createElement('li');
    li.dataset.id = taskObj["taskId"];
    const firstBlock = document.createElement('div');
    const secondBlock = document.createElement('div');
    secondBlock.classList.add('optional-info');

    const btnContainer = document.createElement('div');
    const deleteButton = createButton({"btnName": "", "classList": ["btn", "delete-task-btn"]})
    // const deleteButton = document.createElement('button');
    // deleteButton.classList.add('btn', 'delete-task-btn');
    deleteButton.style.borderColor = getPriorityColor(taskObj["priority"]);
    const buttonBg = document.createElement('span');
    buttonBg.classList.add('delete-btn-bg', taskObj["priority"].toLowerCase(), 'priority-identifier');
    buttonBg.dataset.priority = taskObj["priority"];
    deleteButton.appendChild(buttonBg);
    // Can also adjust background-color + opacity / alpha color
    btnContainer.appendChild(deleteButton);
    
    const titleEditContainer = document.createElement('div');
    titleEditContainer.classList.add('task-info-container');
    const title = document.createElement('p');
    title.textContent = taskObj["title"];
    const editButton = createButton({"btnName": '', "classList": ["btn", "edit-task-btn"]});
    const editSvgSpan = document.createElement('span');
    editSvgSpan.textContent = "Edit" // will have an edit svg image later
    editButton.appendChild(editSvgSpan)
    titleEditContainer.appendChild(title);
    titleEditContainer.appendChild(editButton);

    firstBlock.appendChild(btnContainer);
    firstBlock.appendChild(titleEditContainer);

    const description = document.createElement('p');
    description.textContent = taskObj["description"];
    const dueDate = document.createElement('span');
    dueDate.textContent = taskObj["due_date"];

    secondBlock.appendChild(description);
    secondBlock.appendChild(dueDate);

    li.appendChild(firstBlock);
    li.appendChild(secondBlock);
    return li;
}

function getPriorityColor(taskPriority) {
    return taskPriority === "Urgent" ? "#a62c2b" : 
           taskPriority === "High" ? "#fdcc0d" : 
           taskPriority === "Normal" ? "#32527b" : 
           "#a0a1a1"; 
}

export function openTaskEditor(currentLi) { 
    createTaskEditor();
    if (cachedElements.modal()) {
        cachedElements.modal().showModal();
        processTaskInformation(currentLi);
    }
}

export function closeTaskEditor() {
    cachedElements.modal().close();
    cachedElements.modal().remove();
}

export function validateTaskEdition() { // if equal objects (no changes) yields true
    if (!evaluateTaskChanges()) {
        cachedElements.editFormSubmitBtn().removeAttribute("disabled");
    } else {
        cachedElements.editFormSubmitBtn().setAttribute("disabled", true);
    }
}

function processTaskInformation(currentLi) {
    // Extract data and store data
    copyTaskData(currentLi.dataset.id);
    const currentTask = getTaskToBeEdited(currentLi.dataset.id);
    
    // Append the data to the edit-form
    cachedElements.editFormTitle().value = currentTask["title"];
    cachedElements.editFormDescription().value = currentTask["description"];
    cachedElements.editFormCalendar().value = currentTask["due_date"];
    
    let prioritySelectBox = cachedElements.editFormSelect()
    for (let i = 0; i < prioritySelectBox.options.length; i++) {
        let option = prioritySelectBox.options[i]
        if (option.hasAttribute("selected")) option.removeAttribute("selected");
        if (option.text === currentTask["priority"]) option.setAttribute("selected", true);
    }

}

// {
//     "title": "Buy a milk",
//     "description": "Should be 3.5% fat",
//     "due_date": "2024-09-12",
//     "priority": "High",
//     "taskId": "3175472f-f62e-43ef-bff8-9ac14a91e664",
// }

// Should dialog be added to body or it can be added to a container div? 
function createTaskEditor() {
    const dialog = document.createElement('dialog');
    dialog.classList.add('modal');
    dialog.appendChild(createTaskForm("edit-task"));
    document.body.append(dialog); 
    // Now, I should fill form's inputs with the task's current values.
    // First, get edit form's elements
}

function createPopupMessage() {
    const popup = document.createElement('dialog');
    popup.classList.add('popup');
    const notificationOne = document.createElement('p');
    notificationOne.textContent = "Discard unsaved changes?"
    const notificationTwo = document.createElement('p');
    notificationTwo.textContent = "Your unsaved changes will be discarded.";
    popup.appendChild(notificationOne);
    popup.appendChild(notificationTwo);
    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(createButton({"btnName": "Cancel", "classList": ["btn", "popup-cancel-btn"]}));
    buttonContainer.appendChild(createButton({"btnName": "Discard", "classList": ["btn", "popup-discard-btn"]}));
    popup.appendChild(buttonContainer);
    document.body.append(popup);
}

export function openPopupMessage() {
    createPopupMessage();
    if (cachedElements.popup()) {
        cachedElements.popup().showModal();
    }
} 

export function closePopupMessage() {
    cachedElements.popup().close();
    cachedElements.popup().remove();
}

export function discardTaskChanges() {
    closePopupMessage();
    closeTaskEditor();
    clearTaskCopy();
}

export function updateChanges(buttonType) {
    // update task in the inbox array
    updateTargetTask();
    // update an li based on the data of task copy, 
    updateUITask(buttonType);
    // remove task copy
    clearTaskCopy();
}

function updateUITask(buttonType) {
    const liList = cachedElements.lis()
    for (let i = 0; i < liList.length; i++) {
        if (liList[i].dataset.id === getTaskCopy().taskId) {
            visualiseTaskData(liList[i], buttonType);
            liList[i].remove();
            return;
        }
    }
}