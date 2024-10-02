import * as eventHandler from "./eventListeners";
import { cachedElements } from "./cacheElements";
import { createButton } from "./commonFn";
import { tasksStorage, selectCurrentWeekDays } from "./tasks";
import { format } from "date-fns";


export function createTaskForm(classEditor = 'task-form') {
    const taskForm = document.createElement('form');
    taskForm.action = '#';
    taskForm.method = 'get';
    taskForm.classList.add('data-form', classEditor);
    let addTaskBtnName = 'Add task';
    let buttonType = 'add-type';
    if (classEditor === 'edit-task') {
        addTaskBtnName = 'Submit';
        buttonType = 'submit-type';
    }
    taskForm.innerHTML += `
        <input type="text" name="title" id="title" placeholder="Title">
        <textarea name="description" id="description" placeholder="Description"></textarea>
        <div class="elements-block">
            <input type="date" id="dueDate" name="due_date">
            <select id="priority" name="priority">
                <option>Urgent</option>
                <option>High</option>
                <option>Normal</option>
                <option selected>Low</option>
            </select>
        </div>
        <div>
            <button class="btn ${classEditor}-cancel-btn">Cancel</button> 
            <button class="btn ${classEditor}-add-btn enabled-btn" disabled data-button-type="${buttonType}">${addTaskBtnName}</button>
        </div>
    `;
    return taskForm;
}

export function controlFormDisplay(buttonFormContainer) {
    buttonFormContainer = buttonFormContainer || ''
    if (buttonFormContainer) {
        openTaskForm(buttonFormContainer);
        buttonFormContainer.children[0].remove();
    } else if (cachedElements.taskForm()) {
        closeTaskForm()
    }
}

export function closeTaskForm() {
    cachedElements.taskForm().remove();
    recreateTaskButton();
}

function openTaskForm(buttonFormContainer) {
    buttonFormContainer.appendChild(createTaskForm());
    if (tasksStorage.getStorageSection() === "week") {
        setupCalendar(buttonFormContainer);
    } else {
        setupCalendar();
    }
    addTaskFormEvents();
}

export function recreateTaskButton() {
    cachedElements.buttonFormContinaers().forEach((buttonFormContainer) => {
        if (!buttonFormContainer.hasChildNodes()) { // When cancel, it appends another button at next lis
            buttonFormContainer.appendChild(createButton({"btnName": "+ Add task", "classList": ["btn", "add-task-btn"]}));
            eventHandler.removeTaskButton();
        }
    });
}

function addTaskFormEvents() {
    eventHandler.controlTextareaHeight();
    eventHandler.submitTask();
    eventHandler.closeForm();
    eventHandler.validateInputTitle();
}

export function adjustTextareaHeight() {
    cachedElements.taskDescTextarea().style.height = '20px';
    cachedElements.taskDescTextarea().style.height = `${cachedElements.taskDescTextarea().scrollHeight}px`;
}

export function validateTaskTitle() {
    if (cachedElements.inputTitle()["name"] === "title" && cachedElements.inputTitle().value.trim() !== '') {
        cachedElements.btnAddTaskForm().removeAttribute("disabled");
    } else {
        cachedElements.btnAddTaskForm().setAttribute("disabled", true);
    }
}

export function setupCalendar(buttonFormContainer = undefined) {
    let todayDate = new Date().toLocaleDateString('en-CA');
    cachedElements.dueDate().min = todayDate;
    if (tasksStorage.getStorageSection() === "today") {
        cachedElements.dueDate().value = todayDate;
    } else if (tasksStorage.getStorageSection() === "week") {
        let date = tasksStorage.getEditedTaskCopy()["due_date"];
        if (buttonFormContainer !== undefined) {
            date = getSpecificWeekDate(buttonFormContainer);
        }
        cachedElements.dueDate().value = date;
    }
}

function getSpecificWeekDate(buttonFromContainer) {
    const currentLi = buttonFromContainer.closest('li');
    const liList = [...cachedElements.todoList().children];
    let targetIndex = null;
    liList.forEach((li, index) => {
        if (li === currentLi) {
            targetIndex = index;
        }
    });
    return format(selectCurrentWeekDays()[targetIndex], 'yyyy-MM-dd');
}