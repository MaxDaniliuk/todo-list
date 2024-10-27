import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { endOfISOWeek, startOfISOWeek, eachDayOfInterval, format } from "date-fns";
import { getDataFromLocalStorage } from "./localStorage.js";


export default function getTaskData(form) {
    const task = {};
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i]["name"]) {
            task[form.elements[i]["name"]] = form.elements[i].value; 
        }
    }
    task["taskId"] = uuidv4();
    const currentSection = tasksStorage.getStorageSection();
    if (currentSection !== "inbox" && currentSection !== "today" && currentSection !== "week") {
        task["project"] = currentSection;
        task["projectId"] = tasksStorage.getProjectId();
    }
    tasksStorage.storeTask(task);
    form.reset();
    return task;
}

export const tasksStorage = (function() {
    
    let inbox = [];
    // grab inbox from loca storage if it exists
    const setInbox = () => {
        inbox = getDataFromLocalStorage() || [];
    }

    const storeTask = (task) => inbox.push(task);
    const getInbox = () => inbox;

    let storageSection = "inbox";
    const setStorageSection = (section) => storageSection = section;
    const getStorageSection = () => storageSection;

    const editableTaskCopy = {};
    const getEditedTaskCopy = () => editableTaskCopy;

    const openedProjectId = [];
    const getProjectId = () => openedProjectId[0];
    const setProjectId = (projectId) => { if (openedProjectId.length === 0) openedProjectId.push(projectId) };
    const resetOpenedProjectId = () => { if (openedProjectId.length !== 0) openedProjectId.splice(0) };

    return { 
        storeTask, getInbox, setStorageSection, getStorageSection, getEditedTaskCopy,
        getProjectId, setProjectId, resetOpenedProjectId, setInbox
    };
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
    };

    
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
    };

    const getProjectTasks = (projectId) => {
        return tasksStorage.getInbox().filter((task) => task.hasOwnProperty('projectId') && task["projectId"] === projectId);
    };

    const deleteProjectTasks = (projectId) => {
        for (let i = 0; i < tasksStorage.getInbox().length; i++) {
            if (tasksStorage.getInbox()[i]["projectId"] === projectId) {
                tasksStorage.getInbox().splice(i, 1);
                i--;
            }
        }
    }
    
    return { 
        getTodayTasks, sortThisWeekTasks, deleteTask, 
        isSectionOpen, copyEditedTask, getEditedTask, 
        compareTasks, clearEditedTaskCopy, updateTask,
        getProjectTasks, deleteProjectTasks 
    };
})();

export const taskCountTracker = (function() {

    const sectionTypes = [
        {
            "section": "inbox",
            getCount() {
                return tasksStorage.getInbox().length;
            }
        },
        {
            "section": "today",
            getCount() {
                return storageModerator.getTodayTasks().length;
            } 
        }, 
        {
            "section": "week",
            getCount() {
                return storageModerator.sortThisWeekTasks().length;
            }
        },
    ]; 

    const addSection = (section) => {
        sectionTypes.push({
            section: section,
            getCount() {
                return storageModerator.getProjectTasks(this.section).length
            }
        })
    };
    const removeSection = (section) => {
        for (let i = 0; i < sectionTypes.length; i++) {
            if (sectionTypes[i]["section"] === section) {
                return sectionTypes.splice(i, 1);
            }
        }
    };

    const countTasks = (countContainers) => {
        countContainers.forEach((countContainer, index) => {
            if (sectionTypes[index].getCount() === 0) {
                countContainer.textContent = '';
            } else {
                countContainer.textContent = sectionTypes[index].getCount();
            }
        });
    }

    return {
        addSection, 
        removeSection,
        countTasks
    };
})();

export function selectCurrentWeekDays() {
    const currentWeekDays = eachDayOfInterval({
        start: startOfISOWeek(new Date()), 
        end: endOfISOWeek(new Date())
    })
    return currentWeekDays;
}