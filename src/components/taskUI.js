import { cachedElements } from "./cacheElements";
import { createButton } from "./commonFn";
import { createTaskForm, setupCalendar } from "./form";
import { tasksStorage, storageModerator } from "./tasks";
import { visualiseTaskData } from "./tasks";
import { format } from "date-fns";

export default function displayTask(taskObj) {
    const li = document.createElement('li');
    li.dataset.id = taskObj["taskId"];

    if (taskObj["project"]) {
        const projectName = document.createElement('p');
        projectName.classList.add('project-title');
        projectName.textContent = `Project: ${taskObj["project"]}`;
        li.appendChild(projectName);
    }

    const firstBlock = document.createElement('div');
    firstBlock.classList.add('task-first-block');
    const secondBlock = document.createElement('div');
    secondBlock.classList.add('optional-info');

    const deleteBtnContainer = document.createElement('div');
    const deleteButton = createButton({"btnName": "", "classList": ["btn", "delete-task-btn"]})
 
    deleteButton.style.borderColor = getPriorityColor(taskObj["priority"]);
    const buttonBg = document.createElement('span');
    buttonBg.classList.add('delete-btn-bg', taskObj["priority"].toLowerCase(), 'priority-identifier');
    buttonBg.dataset.priority = taskObj["priority"];
    deleteButton.appendChild(buttonBg);
    // Can also adjust background-color + opacity / alpha color
    deleteBtnContainer.appendChild(deleteButton);
    
    // const titleEditContainer = document.createElement('div');
    // titleEditContainer.classList.add('task-title-container');
    const title = document.createElement('p');
    title.classList.add('task-title-container');
    title.textContent = taskObj["title"];
    // titleEditContainer.appendChild(title);
    // titleEditContainer.appendChild(editButton);

    const editBtnContainer = document.createElement('div');
    const editButton = createButton({"btnName": '', "classList": ["btn", "edit-task-btn"]});
    const editSvgSpan = document.createElement('span');
    editSvgSpan.textContent = "Edit" // will have an edit svg image later
    editButton.appendChild(editSvgSpan)
    editBtnContainer.appendChild(editButton);

    firstBlock.appendChild(deleteBtnContainer);
    firstBlock.appendChild(title);
    firstBlock.appendChild(editBtnContainer);

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
        setupCalendar();
    }
}

export function closeTaskEditor() {
    cachedElements.modal().close();
    cachedElements.modal().remove();
}

export function validateTaskEdition() { // if equal objects (no changes) yields true
    if (!storageModerator.compareTasks()) {
        cachedElements.editFormSubmitBtn().removeAttribute("disabled");
    } else {
        cachedElements.editFormSubmitBtn().setAttribute("disabled", true);
    }
}

function processTaskInformation(currentLi) {
    storageModerator.copyEditedTask(currentLi.dataset.id);
    const currentTask = storageModerator.getEditedTask(currentLi.dataset.id);
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

// Should dialog be added to body or it can be added to a container div? 
function createTaskEditor() {
    const dialog = document.createElement('dialog');
    dialog.classList.add('modal');
    dialog.appendChild(createTaskForm("edit-task"));
    document.body.append(dialog); 
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
    if (cachedElements.popup()) cachedElements.popup().showModal();
} 

export function closePopupMessage() {
    cachedElements.popup().close();
    cachedElements.popup().remove();
}

export function discardTaskChanges() {
    closePopupMessage();
    closeTaskEditor();
    storageModerator.clearEditedTaskCopy();
}

export function applyChanges(buttonType) {
    // update task in the inbox array
    storageModerator.updateTask();
    // update an li based on the data of task copy, 
    updateUITask(buttonType);
    // remove task copy
    storageModerator.clearEditedTaskCopy();
}

function updateUITask(buttonType) {
    const liList = cachedElements.lis()
    for (let i = 0; i < liList.length; i++) {
        if (liList[i].dataset.id === tasksStorage.getEditedTaskCopy().taskId) {
            visualiseTaskData(liList[i], buttonType);
            liList[i].remove();
            return;
        }
    }
}

export function displayInboxTasks() {
    if (tasksStorage.getInbox().length > 0) {
        tasksStorage.getInbox().forEach((taskObj) => {
            cachedElements.todoList().appendChild(displayTask(taskObj));
        });
    }
}

export function displayDueTodayTasks() {
    if (tasksStorage.getInbox().length > 0) {
        storageModerator.getTodayTasks().forEach((taskObj) => {
            cachedElements.todoList().appendChild(displayTask(taskObj));
        });
    }
}

export function displayThisWeekTasks(dayDate, currentUl) {
    if (tasksStorage.getInbox().length > 0) {
        const thisWeekTasks = storageModerator.sortThisWeekTasks();
        for (let i = 0; i < thisWeekTasks.length; i++) {
            
            if (thisWeekTasks[i]["due_date"] >= dayDate && thisWeekTasks[i]["due_date"] < format(new Date(), 'yyyy-MM-dd')) {
                console.log()
                currentUl.appendChild(displayTask(thisWeekTasks[i]));
            } else if (dayDate >= format(new Date(), 'yyyy-MM-dd')) {
                if (thisWeekTasks[i]["due_date"] === dayDate) {
                    currentUl.appendChild(displayTask(thisWeekTasks[i]));
                }
            }
        }        
    }
}