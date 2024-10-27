import { cachedElements } from "./cacheElements";
import { createButton } from "./commonFn";
import { createTaskForm, setupCalendar } from "./form";
import { tasksStorage, storageModerator, selectCurrentWeekDays, taskCountTracker } from "./tasks";
import { format, isToday } from "date-fns";
import { storeDataLocally } from "./localStorage.js";

export default function displayTask(taskObj) {
    const li = document.createElement('li');
    li.dataset.id = taskObj["taskId"];
    li.setAttribute('draggable', true);
    li.classList.add('draggable');

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
    const deleteButton = createButton({"btnName": "", "classList": ["btn", "delete-task-btn"]})
 
    deleteButton.style.borderColor = getPriorityColor(taskObj["priority"]);
    const buttonBg = document.createElement('span');
    buttonBg.classList.add('delete-btn-bg', taskObj["priority"].toLowerCase(), 'priority-identifier');
    buttonBg.dataset.priority = taskObj["priority"];
    deleteButton.appendChild(buttonBg);
    // Can also adjust background-color + opacity / alpha color
    deleteBtnContainer.appendChild(deleteButton);
    
    const title = document.createElement('p');
    title.classList.add('task-title-container');
    title.textContent = taskObj["title"];

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
    cachedElements.todoList().classList.add('dropzone');
}

export function displayDueTodayTasks() {
    if (tasksStorage.getInbox().length > 0) {
        storageModerator.getTodayTasks().forEach((taskObj) => {
            cachedElements.todoList().appendChild(displayTask(taskObj));
        });
    }
    console.log('TODAY Section')
    console.log(tasksStorage.getInbox())
    console.log(storageModerator.getTodayTasks())
    cachedElements.todoList().classList.add('dropzone');
}

export function displayThisWeekTasks(dayDate, currentUl) { // I can select another time 
    if (tasksStorage.getInbox().length > 0) {
        const thisWeekTasks = storageModerator.sortThisWeekTasks();
        
        // !currentUl.classList.contains("overdue-list")
        if (!currentUl.dataset.overdue) {
            currentUl.dataset.date = dayDate;
            currentUl.classList.remove(`${format(dayDate, "d")}-day-list`);
            currentUl.classList.add('dropzone');
        }
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
    if (tasksStorage.getStorageSection() === 'today' && currentTaskDueDate["due_date"] === new Date().toISOString().substring(0, 10)) {
        determineButtonFunctionality(buttonPressed, currentTask, cachedElements.todoList());
    } else if (tasksStorage.getStorageSection() === 'inbox') {
        determineButtonFunctionality(buttonPressed, currentTask, cachedElements.todoList());
    } else if ((tasksStorage.getStorageSection() === 'week') && (currentTaskDueDate["due_date"] >= format(currentWeekDays[0], 'yyyy-MM-dd') && currentTaskDueDate["due_date"] <= format(currentWeekDays[6], 'yyyy-MM-dd'))) {
        if (currentSection === undefined) {
            currentSection = currentTask.closest('section');
        }
        determineButtonFunctionality(buttonPressed, currentTask, cachedElements.closestTodoList(currentSection));
    } else {
        determineButtonFunctionality(buttonPressed, currentTask, cachedElements.todoList());
    }
    taskCountTracker.countTasks(cachedElements.taskCounts());
    storeDataLocally(tasksStorage.getInbox());
}

function determineButtonFunctionality(buttonPressed, currentTask, correctList) {
    if (buttonPressed === 'add-type') {
        // curretnTask is a todo object
        if (tasksStorage.getStorageSection() === 'week' && currentTask["due_date"] <= format(selectCurrentWeekDays()[6], 'yyyy-MM-dd')) {
            let selectedDate = storageModerator.getEditedTask(currentTask["taskId"])["due_date"];
            
            return determineCorrectSubsection(selectedDate).appendChild(displayTask(currentTask));
        } else if (tasksStorage.getStorageSection() !== 'week') {
            return correctList.appendChild(displayTask(currentTask));
        }
    } else if (buttonPressed === 'submit-type') {
        // currentTask is an Li element
        if (tasksStorage.getStorageSection() === 'week' && cachedElements.subTaskDueDate(correctList).textContent !== tasksStorage.getEditedTaskCopy()["due_date"]) {
            let newDate = storageModerator.getEditedTask(currentTask.dataset.id)["due_date"];
            return determineCorrectSubsection(newDate).appendChild(displayTask(tasksStorage.getEditedTaskCopy()));
        } else {
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