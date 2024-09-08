import { v4 as uuidv4 } from 'uuid';
import { displayTask } from './todoList.js';
import { cachedElements } from './cacheElements';

export function getTaskData(form) {
    const task = {};
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i]["name"]) {
            task[form.elements[i]["name"]] = form.elements[i].value; 
        }
    }
    //Set data attribute https://blog.webdevsimplified.com/2020-10/javascript-data-attributes/
    task["taskId"] = uuidv4();
    tasksStorage.storeTask(task);
    form.reset();
}


// description : "Buy groceries"
// due_date : "2024-09-01"
// priority : "Normal"
// taskId : "3ee82357-e4ab-40e7-977d-c33cb65afa2c"
// title : "Cook dinner"

const tasksStorage = (function() {
    const storageSection = "Inbox";
    const inbox = [{"title": "Buy a cookie", "description": "Lactose free", "due_date": "2024-09-01", "priority": "High", "taskId": "db3d4311-2d4c-4c1d-9f71-0f662786f5a9"}];
    //It simply stores the todos inside an array
    const storeTask = (task) => inbox.push(task);
    const getInbox = () => inbox;
    const setStorageSection = (section) => storageSection = section;
    const getStorageSection = () => storageSection;

    return { storeTask, getInbox, setStorageSection, getStorageSection }
})();

const storageRegulator = (function() {
    const deleteTask = (targetTaskId) => {
        for (let i = 0; i < tasksStorage.getInbox().length; i++) {
            if (tasksStorage.getInbox()[i].taskId === targetTaskId) {
                return tasksStorage.getInbox().splice(i, 1);
            }
        }
    };

    // While the tasks should be displayed based on the function called, like for today pages - display only those tasks that are
    // due Today
    // getTodoList should sort data based on button in the nav clicked.
    // date format '2024-08-29'

    const getTodayTasks = () => {
        return tasksStorage.getInbox().filter((task) => task["due_date"] === new Date().toISOString().substring(0, 10));
    };

    // Sort upcoming tasks based on date
    // Sort dates like 2024-08-08 2024-08-10 etc
    // todoList.sort((a, b) => {
    //     a = a.split('-').join('');
    //     b = b.split('-').join('');
    //     return a < b ? -1 : a > b ? 1 : 0;
    // });
    const getUpcomingTasks = () => {};

    // Suitable for inbox
    const getInboxTasks = () => tasksStorage.getInbox();
    return { getInboxTasks, getTodayTasks, deleteTask }
})();

export function displayInboxTasks() {
    if (tasksStorage.getInbox().length > 0) {
        storageRegulator.getInboxTasks().forEach((taskObj) => {
            cachedElements.todoList().appendChild(displayTask(taskObj));
            // transfer task data to li elements
            // append each li to ul
            // cachedElements.inboxList().appendChild(li creating function);
        });
    }
}

export function getSection(section) {
    return tasksStorage.setStorageSection(section);
}

export function deleteTask(taskId) {
    return storageRegulator.deleteTask(taskId);
}

function checkSection() {
    if (tasksStorage.getStorageSection()) return true;
    return false;
}

export function addTask() {
    // if inbox, today or upcoming => true
    if (checkSection()) {
        if (tasksStorage.getStorageSection() === 'Inbox') {
            const inboxTodos = storageRegulator.getInboxTasks();
            cachedElements.todoList().appendChild(displayTask(inboxTodos[inboxTodos.length - 1]));
        }
    }
}


// Change calendar's placeholder to today's date. Use when uploading a form to the page.
// const date = document.querySelector('#dueDate');
// date.value = new Date().toISOString().substring(0, 10);
