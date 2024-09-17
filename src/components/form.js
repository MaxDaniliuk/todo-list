import * as eventHandler from "./eventListeners";
import { cachedElements } from "./cacheElements";
import { createButton } from "./commonFn";
import { getSectionType } from "./tasks";


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

export function controlFormDisplay() {
    if (cachedElements.btnAddTask()) {
        openTaskForm();
        cachedElements.btnAddTask().remove();
    } else if (cachedElements.taskForm()) {
        cachedElements.taskForm().remove();
        recreateTaskButton();
    }
}

function openTaskForm() {
    cachedElements.buttonFormContainer().appendChild(createTaskForm());
    setupCalendar();
    addTaskFormEvents();
}

export function recreateTaskButton() {
    cachedElements.buttonFormContainer().appendChild(createButton({"btnName": "+ Add task", "classList": ["btn", "add-task-btn"]}));
    eventHandler.removeTaskButton();
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

function setupCalendar() {
    cachedElements.dueDate().min = new Date().toISOString().substring(0, 10);
    if ( getSectionType() === "today") {
        cachedElements.dueDate().value = new Date().toISOString().substring(0, 10);
    }
}