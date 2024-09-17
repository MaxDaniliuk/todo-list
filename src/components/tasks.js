import { v4 as uuidv4 } from 'uuid';
import { displayTask } from './taskUI.js';
import { cachedElements } from './cacheElements';
import _ from 'lodash';

export function getTaskData(form) {
    const task = {};
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i]["name"]) {
            task[form.elements[i]["name"]] = form.elements[i].value; 
        }
    }
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
    let storageSection = "inbox";
    const inbox = [{"title": "Buy a cookie", "description": "Lactose free", "due_date": "2024-09-01", "priority": "High", "taskId": "db3d4311-2d4c-4c1d-9f71-0f662786f5a9"}];

    const storeTask = (task) => inbox.push(task);
    const getInbox = () => inbox;
    const setStorageSection = (section) => storageSection = section;
    const getStorageSection = () => storageSection;

    const editableTaskCopy = {};
    const getEditableTaskCopy = () => editableTaskCopy;

    return { storeTask, getInbox, setStorageSection, getStorageSection, getEditableTaskCopy }
})();

const storageModerator = (function() {
    const deleteTask = (targetTaskId) => {
        for (let i = 0; i < tasksStorage.getInbox().length; i++) {
            if (tasksStorage.getInbox()[i].taskId === targetTaskId) {
                return tasksStorage.getInbox().splice(i, 1);
            }
        }
    };

    const compareTask = () => {
        const updatedTask = tasksStorage.getEditableTaskCopy();
        return _.isEqual(updatedTask, getEditableTask(updatedTask["taskId"]));
    };

    const updateTask = () => {
        const updatedTask = tasksStorage.getEditableTaskCopy();
        for (let i = 0; i < tasksStorage.getInbox().length; i++) {
            if (tasksStorage.getInbox()[i].taskId === updatedTask.taskId) {
                return Object.assign(tasksStorage.getInbox()[i], updatedTask);
            }
        }
    };
    
    const clearEditableTaskCopy = () => {
        let props = Object.getOwnPropertyNames(tasksStorage.getEditableTaskCopy());
        for (let i = 0; i < props.length; i++) {
            delete tasksStorage.getEditableTaskCopy()[props[i]];
        }
    };
    const copyEditabelTask = (editableTaskId) => {
        if(Object.keys(tasksStorage.getEditableTaskCopy()).length) clearEditableTaskCopy(); 
        for (let i = 0; i < tasksStorage.getInbox().length; i++) {
            if (tasksStorage.getInbox()[i].taskId === editableTaskId) {
                const taskCopy = structuredClone(tasksStorage.getInbox()[i]);
                Object.assign(tasksStorage.getEditableTaskCopy(), taskCopy);
                return;
            }
        }
    };

    const getEditableTask = (editableTaskId) => {
        for (let i = 0; i < tasksStorage.getInbox().length; i++) {
            if (tasksStorage.getInbox()[i].taskId === editableTaskId) {
                return tasksStorage.getInbox()[i];
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
    
    return { getTodayTasks, deleteTask, copyEditabelTask, getEditableTask, compareTask, clearEditableTaskCopy, updateTask };
})();

export function clearTaskCopy() {
    return storageModerator.clearEditableTaskCopy();
}

export function updateTargetTask() {
    return storageModerator.updateTask();
}

export function evaluateTaskChanges() {
    return storageModerator.compareTask();
}

export function copyTaskData(id) {
    return storageModerator.copyEditabelTask(id);
}

export function getTaskToBeEdited(id) {
    return storageModerator.getEditableTask(id);
}

export function getTaskCopy() {
    return tasksStorage.getEditableTaskCopy();
}

// Go to taskUI.js
export function displayInboxTasks() {
    if (tasksStorage.getInbox().length > 0) {
        tasksStorage.getInbox().forEach((taskObj) => {
            cachedElements.todoList().appendChild(displayTask(taskObj));
        });
    }
}

// Go to taskUI.js
export function displayDueTodayTasks() {
    if (tasksStorage.getInbox().length > 0) {
        storageModerator.getTodayTasks().forEach((taskObj) => {
            cachedElements.todoList().appendChild(displayTask(taskObj));
        });
    }
}

export function isSectionOpen(currentSection) {
    return tasksStorage.getStorageSection() === currentSection;
}

export function setSectionType(sectionType) {
    return tasksStorage.setStorageSection(sectionType);
}

export function getSectionType() {
    return tasksStorage.getStorageSection();
}

export function deleteTask(taskId) {
    return storageModerator.deleteTask(taskId);
}

// Go to taskUI.js
function checkSection() {
    if (tasksStorage.getStorageSection()) return true;
    return false;
}

// Go to taskUI.js
export function addTask() {
    // if inbox, today or upcoming => true
    if (checkSection()) {
        if (tasksStorage.getStorageSection() === 'inbox') {
            const inboxTodos = tasksStorage.getInbox();
            cachedElements.todoList().appendChild(displayTask(inboxTodos[inboxTodos.length - 1]));
        } else if (tasksStorage.getStorageSection() === 'today') {
            const inboxTodos = tasksStorage.getInbox();
            if (inboxTodos[inboxTodos.length - 1]["due_date"] === new Date().toISOString().substring(0, 10)) {
                cachedElements.todoList().appendChild(displayTask(inboxTodos[inboxTodos.length - 1]));
            }
        }
    }
}



// Change calendar's placeholder to today's date. Use when uploading a form to the page.
// const date = document.querySelector('#dueDate');
// date.value = new Date().toISOString().substring(0, 10);
