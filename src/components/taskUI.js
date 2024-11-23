import { cachedElements } from "./cacheElements";
import { createButton, createIconContainer } from "./commonFn";
import { createTaskForm, setupCalendar } from "./form";
import { tasksStorage, storageModerator, selectCurrentWeekDays, taskCountTracker } from "./tasks";
import { format, isToday } from "date-fns";
import { storeDataLocally  } from "./localStorage.js";

export default function displayTask(taskObj) {
    const li = document.createElement('li');
    li.dataset.id = taskObj["taskId"];
    li.setAttribute('draggable', true);
    li.classList.add('draggable', 'todo');

    if (taskObj.hasOwnProperty("project")) {
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
    const deleteButton = createButton({"btnName": "", "classList": ["btn", "delete-task-btn", "hl-delete-btn", `${taskObj["priority"].toLowerCase()}`]})
 
    deleteButton.style.borderColor = getPriorityColor(taskObj["priority"]);
    const buttonBg = document.createElement('span');
    buttonBg.classList.add('delete-btn-bg', taskObj["priority"].toLowerCase(), 'priority-identifier');
    buttonBg.dataset.priority = taskObj["priority"];
    deleteButton.appendChild(buttonBg);
    deleteBtnContainer.appendChild(deleteButton);
    
    const title = document.createElement('p');
    title.classList.add('task-title-container');
    title.textContent = taskObj["title"];

    const editBtnContainer = document.createElement('div');
    let editImgSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#0c0a09"></path> </g></svg>`;
    editBtnContainer.appendChild(createIconContainer(editImgSvg, ["btn", "edit-task-btn"]));

    firstBlock.appendChild(deleteBtnContainer);
    firstBlock.appendChild(title);
    firstBlock.appendChild(editBtnContainer);

    const description = document.createElement('p');
    if (taskObj["description"] !== '') {
        description.classList.add('non-expanded-desc');
    }
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

export function validateTaskEdition() {
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
    // update an li based on the data of task copy
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
    cachedElements.todoList().classList.add('dropzone');
}

export function displayDueTodayTasks() {
    if (tasksStorage.getInbox().length > 0) {
        storageModerator.getTodayTasks().forEach((taskObj) => {
            cachedElements.todoList().appendChild(displayTask(taskObj));
        });
    }
    cachedElements.todoList().classList.add('dropzone');
}

export function displayThisWeekTasks(dayDate, currentUl) { 
    if (!currentUl.dataset.overdue) {
        currentUl.dataset.date = dayDate;
        currentUl.classList.remove(`${format(dayDate, "d")}-day-list`);
        currentUl.classList.add('dropzone');
    }
    if (tasksStorage.getInbox().length > 0) {
        const thisWeekTasks = storageModerator.sortThisWeekTasks();
        for (let i = 0; i < thisWeekTasks.length; i++) {
            if (thisWeekTasks[i]["due_date"] >= dayDate && thisWeekTasks[i]["due_date"] < format(new Date(), 'yyyy-MM-dd')) {
                currentUl.appendChild(displayTask(thisWeekTasks[i]));
            } else if (dayDate >= format(new Date(), 'yyyy-MM-dd')) {
                if (thisWeekTasks[i]["due_date"] === dayDate) {
                    currentUl.appendChild(displayTask(thisWeekTasks[i]));
                }
            }
        }        
    }
}

export function displayProjectTasks(buttonPressed) { 
    let projectId = buttonPressed.closest('li').dataset.projectId;
    let buttonInnerType = buttonPressed.dataset.innerType;                 
    if (tasksStorage.getInbox().length > 0) {
        storageModerator.getProjectTasks(projectId).forEach((taskObj) => {
            cachedElements.todoList().appendChild(displayTask(taskObj, buttonInnerType));
        });
    }
    cachedElements.todoList().classList.add('projects', 'dropzone');
}

export function visualiseTaskData(currentTask, buttonPressed, currentSection = undefined) {
    const currentWeekDays = selectCurrentWeekDays();
    let currentTaskDueDate = currentTask;
    if (currentTask["due_date"] === undefined) {
        currentTaskDueDate = storageModerator.getEditedTask(currentTask.dataset.id);
    }
    if ((tasksStorage.getStorageSection() === 'week') && (currentTaskDueDate["due_date"] >= format(currentWeekDays[0], 'yyyy-MM-dd') && currentTaskDueDate["due_date"] <= format(currentWeekDays[6], 'yyyy-MM-dd'))) {
        if (currentSection === undefined) {
            currentSection = currentTask.closest('section');
        }
        determineButtonFunctionality(buttonPressed, currentTask, cachedElements.closestTodoList(currentSection));
    } else {
        determineButtonFunctionality(buttonPressed, currentTask, cachedElements.todoList(), currentTaskDueDate["due_date"]);
    }
    taskCountTracker.countTasks(cachedElements.taskCounts());
    storeDataLocally(tasksStorage.getInbox());
}

function determineButtonFunctionality(buttonPressed, currentTask, correctList, todayDate = undefined) {
    if (buttonPressed === 'add-type') {
        // curretnTask is a todo object
        if (tasksStorage.getStorageSection() === 'week' && currentTask["due_date"] <= format(selectCurrentWeekDays()[6], 'yyyy-MM-dd')) {
            let selectedDate = storageModerator.getEditedTask(currentTask["taskId"])["due_date"];
            return determineCorrectSubsection(selectedDate).appendChild(displayTask(currentTask));
        } else if (tasksStorage.getStorageSection() !== 'week') {
            if (tasksStorage.getStorageSection() === 'today' && todayDate !== new Date().toISOString().substring(0, 10)) {
                return;
            }
            return correctList.appendChild(displayTask(currentTask));
        }
    } else if (buttonPressed === 'submit-type') {
        // currentTask is an Li UI task
        if (tasksStorage.getStorageSection() === 'week' && cachedElements.subTaskDueDate(currentTask).textContent !== tasksStorage.getEditedTaskCopy()["due_date"]) {
            if (tasksStorage.getEditedTaskCopy()["due_date"] <= format(selectCurrentWeekDays()[6], 'yyyy-MM-dd')) {
                let newDate = storageModerator.getEditedTask(currentTask.dataset.id)["due_date"];
                return determineCorrectSubsection(newDate).appendChild(displayTask(tasksStorage.getEditedTaskCopy()));
            }
        } else {
            if (tasksStorage.getStorageSection() === 'today' && todayDate !== new Date().toISOString().substring(0, 10)) {
                return;
            }
            return correctList.insertBefore(displayTask(tasksStorage.getEditedTaskCopy()), currentTask);
        }
    }
}

function determineCorrectSubsection(taskNewDate) {
    const currentWeekDays = selectCurrentWeekDays();
    const weekUlLiSections = [...cachedElements.todoList().children]
    let todayDateIndex = currentWeekDays.findIndex(date => isToday(date));
    const days = currentWeekDays.splice(todayDateIndex);
    const availableUlLiSections = weekUlLiSections.slice(-days.length);
    for (let i = 0; i < days.length; i++) {
        if (format(days[i], 'yyyy-MM-dd') === taskNewDate) {
            return cachedElements.subUl(availableUlLiSections[i]);
        }
    }
}