import { createButton } from "./commonFn";
import createSideBar from "./sidebar";
import * as eventHandler from "./eventListeners";
import { cachedElements } from "./cacheElements";

export default function loadPage() {
    loadContent();
}

function loadContent() {
    const content = document.querySelector('.page-wrapper');
    content.appendChild(sideBarContainer());
    content.appendChild(wrapPageContent());
    content.appendChild(createOverlay());
}

// Sidebar-related elements
function sideBarContainer() {
    const sideBarContainer = document.createElement('div');
    sideBarContainer.classList.add("sidebar-container");
    sideBarContainer.appendChild(createSideBar());
    return sideBarContainer;
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add("overlay");
    return overlay;
}

// Content wrapper
function wrapPageContent() {
    const pageContentWrapper = document.createElement('div');
    pageContentWrapper.classList.add("header-content-block");
    pageContentWrapper.appendChild(createHeader());
    pageContentWrapper.appendChild(createMainContent())
    return pageContentWrapper;
}

// Page header
// Do I need a header at all? If it will contain only an image => replace header with a div.
function createHeader() { // 
    const header = document.createElement('header'); // 'div'
    header.classList.add('header');
    // Add App image or main TEXT like 'Doer's List'
    const heading = document.createElement('h1'); //
    heading.textContent = `Doer's List`             // Code for img
    header.appendChild(heading);                  //
    return header;
}

// Tasks-related elements 
function createMainContent() {
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');
    // Here is a part that should display content - inbox, today etc
    contentWrapper.appendChild(createSection());
    //
    return contentWrapper;
}

function createSection() {
    const openedSection = document.createElement('section');
    openedSection.appendChild(getSectionHeader());
    openedSection.appendChild(createTodoListContainer());
    return openedSection;
}

function getSectionHeader() {
    const currentSectionHeader = document.createElement('header');
    currentSectionHeader.classList.add('section-header')
    const sectionHeading = document.createElement('h1');
    sectionHeading.classList.add('section-heading');
    sectionHeading.textContent = "Inbox";
    currentSectionHeader.appendChild(sectionHeading);
    //
    const buttonFormContainer = document.createElement('div');
    buttonFormContainer.classList.add('button-form-container');
    buttonFormContainer.appendChild(createButton({"btnName": "+ Add task", "classList": ["btn", "add-task-btn"]}));
    //

    currentSectionHeader.appendChild(buttonFormContainer);
    return currentSectionHeader;
}

function createTodoListContainer() {
    const todoContainer = document.createElement('div');
    todoContainer.classList.add('todo-container');
    todoContainer.appendChild(createTodoList());
    return todoContainer;
}

export function createTodoList(listType = 'inbox') {
    const todoList = document.createElement('ul');
    todoList.classList.add('todo-list', listType.toLowerCase());
    return todoList;
}

function addTaskButton() {
    cachedElements.buttonFormContainer().appendChild(createButton({"btnName": "+ Add task", "classList": ["btn", "add-task-btn"]}));
    eventHandler.removeTaskButton();
}

function openTaskForm() {
    cachedElements.buttonFormContainer().appendChild(createTaskForm());
    addTaskFormEvents();
}

function addTaskFormEvents() {
    eventHandler.controlTextareaHeight();
    eventHandler.submitTask();
    eventHandler.closeForm();
    eventHandler.validateInputTitle();
}

export function controlFormDisplay() {
    if (cachedElements.btnAddTask()) {
        openTaskForm();
        cachedElements.btnAddTask().remove();
    } else if (cachedElements.taskForm()) {
        cachedElements.taskForm().remove();
        addTaskButton();
    }
}

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

function setDueDateToToday() { // Set calendar date
    cachedElements.dueDate().value = new Date().toISOString().substring(0, 10);
}

export function validateTaskTitle() {
    if (cachedElements.inputTitle()["name"] === "title" && cachedElements.inputTitle().value.trim() !== '') {
        cachedElements.btnAddTaskForm().removeAttribute("disabled");
        cachedElements.btnAddTaskForm().classList.remove('disabled-btn');
    }
}

export function adjustTextareaHeight() {
    cachedElements.taskDescTextarea().style.height = '20px';
    cachedElements.taskDescTextarea().style.height = `${cachedElements.taskDescTextarea().scrollHeight}px`;
}


export function displayTask(taskObj) {
    const li = document.createElement('li');
    li.dataset.id = taskObj["taskId"];
    const firstBlock = document.createElement('div');
    const secondBlock = document.createElement('div');

    const btnContainer = document.createElement('div');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'delete-task-btn');
    deleteButton.style.borderColor = getPriorityColor(taskObj["priority"]);
    const buttonBg = document.createElement('span');
    buttonBg.classList.add('delete-btn-bg', taskObj["priority"].toLowerCase());
    deleteButton.appendChild(buttonBg);
    // Can also adjust background-color + opacity / alpha color
    btnContainer.appendChild(deleteButton);
    
    const titleEditContainer = document.createElement('div');
    titleEditContainer.classList.add('task-info-container');
    const title = document.createElement('p');
    title.textContent = taskObj["title"];
    const spanEdit = document.createElement('span');
    spanEdit.textContent = "Edit"
    titleEditContainer.appendChild(title);
    titleEditContainer.appendChild(spanEdit);

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