import * as eventHandler from "./eventListeners";
import { cachedElements } from "./cacheElements";
import { createButton } from "./commonFn";

function createTaskForm() {
    const taskForm = document.createElement('form');
    taskForm.action = '#';
    taskForm.method = 'get';
    taskForm.classList.add('task-form');
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
            <button class="btn form-cancel-btn">Cancel</button>
            <button class="btn form-add-task-btn disabled-btn" disabled>Add task</button>
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
    addTaskFormEvents();
}

function recreateTaskButton() {
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
        cachedElements.btnAddTaskForm().classList.remove('disabled-btn');
    }
}

function setDueDateToToday() { // Set calendar date
    cachedElements.dueDate().value = new Date().toISOString().substring(0, 10);
}