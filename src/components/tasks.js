import { v4 as uuidv4 } from 'uuid';
import displayTask from './taskUI.js';
import { cachedElements } from './cacheElements';
import _ from 'lodash';
import { endOfISOWeek, startOfISOWeek, eachDayOfInterval, format, isToday } from "date-fns";


export default function getTaskData(form) {
    const task = {};
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i]["name"]) {
            task[form.elements[i]["name"]] = form.elements[i].value; 
        }
    }
    task["taskId"] = uuidv4();
    const currentSection = tasksStorage.getStorageSection();
    if (currentSection !== "inbox" && currentSection !== "today" && currentSection !== "week") task["project"] = tasksStorage.getStorageSection();
    tasksStorage.storeTask(task);
    form.reset();
    return task;
}


// description : "Buy groceries"
// due_date : "2024-09-01"
// priority : "Normal"
// taskId : "3ee82357-e4ab-40e7-977d-c33cb65afa2c"
// title : "Cook dinner"

export const tasksStorage = (function() {
    
    const inbox = [{"title": "Buy a cookie", 
        // "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut feugiat sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam sit amet tellus sit amet elit consectetur euismod. Sed vehicula auctor cursus. Integer id nunc blandit, viverra nunc vel, ullamcorper turpis. Quisque euismod orci ante. Ut eleifend purus non sem tempus, sed volutpat urna rhoncus. Cras faucibus, ante vel tincidunt mattis, quam quam suscipit velit, non commodo nisi ligula id libero.", 
        "description": "Gluten-free",
        "due_date": "2024-09-29", "priority": "High", "taskId": "db3d4311-2d4c-4c1d-9f71-0f662786f5a9"},
        {
            "title": "Thursday 03 Oct",
            "description": "first",
            "due_date": "2024-10-03", "priority": "High", "taskId": "db3d4311-2d4c-4c1d-9f71-0f662786f5a8"
        },
        {
            "title": "Sunday 06 Oct",
            "description": "second",
            "due_date": "2024-10-06", "priority": "High", "taskId": "db3d4311-2d4c-4c1d-9f71-0f662786f5a7"
        },
        {
            "title": "Monday 30 Sep",
            "description": "third",
            "due_date": "2024-09-30", "priority": "High", "taskId": "db3d4311-2d4c-4c1d-9f71-0f662786f5a6"
        },
        ];
    const storeTask = (task) => inbox.push(task);
    const getInbox = () => inbox;

    let storageSection = "inbox";
    const setStorageSection = (section) => storageSection = section;
    const getStorageSection = () => storageSection;

    const editableTaskCopy = {};
    const getEditedTaskCopy = () => editableTaskCopy;

    return { storeTask, getInbox, setStorageSection, getStorageSection, getEditedTaskCopy }
})();

export const storageModerator = (function() {
    const deleteTask = (targetTaskId) => {
        for (let i = 0; i < tasksStorage.getInbox().length; i++) {
            if (tasksStorage.getInbox()[i].taskId === targetTaskId) {
                return tasksStorage.getInbox().splice(i, 1);
            }
        }
    };

    const isSectionOpen = (currentSection) => tasksStorage.getStorageSection() === currentSection;

    const compareTasks = () => {
        const updatedTask = tasksStorage.getEditedTaskCopy();
        return _.isEqual(updatedTask, getEditedTask(updatedTask["taskId"]));
    };

    const updateTask = () => {
        const updatedTask = tasksStorage.getEditedTaskCopy();
        for (let i = 0; i < tasksStorage.getInbox().length; i++) {
            if (tasksStorage.getInbox()[i].taskId === updatedTask.taskId) {
                return Object.assign(tasksStorage.getInbox()[i], updatedTask);
            }
        }
    };
    
    const clearEditedTaskCopy = () => {
        let props = Object.getOwnPropertyNames(tasksStorage.getEditedTaskCopy());
        for (let i = 0; i < props.length; i++) {
            delete tasksStorage.getEditedTaskCopy()[props[i]];
        }
    };
    const copyEditedTask = (editableTaskId) => {
        if(Object.keys(tasksStorage.getEditedTaskCopy()).length) clearEditedTaskCopy(); 
        for (let i = 0; i < tasksStorage.getInbox().length; i++) {
            if (tasksStorage.getInbox()[i].taskId === editableTaskId) {
                const taskCopy = structuredClone(tasksStorage.getInbox()[i]);
                Object.assign(tasksStorage.getEditedTaskCopy(), taskCopy);
                return;
            }
        }
    };

    const getEditedTask = (editableTaskId) => {
        for (let i = 0; i < tasksStorage.getInbox().length; i++) {
            if (tasksStorage.getInbox()[i].taskId === editableTaskId) {
                return tasksStorage.getInbox()[i];
            }
        }
    };

    const getTodayTasks = () => {
        return tasksStorage.getInbox().filter((task) => task["due_date"] === new Date().toLocaleDateString('en-CA'));
    }; // Output: ['Sep 23, 2024', 'Sep 24, 2024', 'Sep 25, 2024', 'Sep 26, 2024', 'Sep 27, 2024', 'Sep 28, 2024', 'Sep 29, 2024']

    
    const getThisWeekTasks = () => {
        const currentWeekDays = selectCurrentWeekDays()
                                .map((task) => format(task, 'yyyy-MM-dd'));
        return tasksStorage.getInbox().filter((task) => currentWeekDays.includes(task["due_date"]));
    };

    const sortThisWeekTasks = () => {
        const thisWeekTasks = getThisWeekTasks().slice();
        return thisWeekTasks.sort((a, b) => {
                a = a["due_date"].split('-').join('');
                b = b["due_date"].split('-').join('');
                return a < b ? -1 : a > b ? 1 : 0;
            });
    }
    
    return { getTodayTasks, sortThisWeekTasks, deleteTask, isSectionOpen, copyEditedTask, getEditedTask, compareTasks, clearEditedTaskCopy, updateTask };
})();

//################################################# // Leave it here for a certain time
// Go to taskUI.js
// function checkOrdinarySection() {
//     const openSection = tasksStorage.getStorageSection();
//     if (openSection !== "inbox" || openSection !== "today" || openSection !== "upcoming") return true;
//     return false;
// }

// // Go to taskUI.js
// export function addTask(buttonClicked, taskObject = '') {
//     let task;
//     if (buttonClicked === 'add-type') task = tasksStorage.getInbox()[tasksStorage.getInbox().length - 1];
//     else if (buttonClicked === 'submit-type') task = taskObject
//     // if inbox, today or upcoming => true
//     if (checkOrdinarySection()) {
//         if (tasksStorage.getStorageSection() === 'inbox') {
//             cachedElements.todoList().appendChild(displayTask(task));
//         } else if (tasksStorage.getStorageSection() === 'today') {
//             if (task["due_date"] === new Date().toISOString().substring(0, 10)) {
//                 cachedElements.todoList().appendChild(displayTask(task));
//             }
//         }
//     }
// }

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
    }
    // Also if dueDate of overdue tasks is postponed, the section remains but empty with Overdue Heading
}

function determineButtonFunctionality(buttonPressed, currentTask, correctList) {
    if (buttonPressed === 'add-type') {
        return correctList.appendChild(displayTask(currentTask));
    } else if (buttonPressed === 'submit-type') {
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

export function selectCurrentWeekDays() {
    const currentWeekDays = eachDayOfInterval({
        start: startOfISOWeek(new Date()), 
        end: endOfISOWeek(new Date())
    })
    return currentWeekDays;
}

