import loadPage from "./loadPage";
import { cachedElements } from "./cacheElements";
import { operateSideBar, closeSideBar, resetSideBarStyle } from "./sidebar"
import { adjustTextareaHeight, controlFormDisplay, validateTaskTitle } from "./form.js";
import { changeTodoListDisplay, setSectionHeading } from "./todoList.js"
import { getTaskData, displayInboxTasks, addTask, getSection, deleteTask } from "./tasks";

//start app 
export default function startApp() {
    window.addEventListener('DOMContentLoaded', () => {
        loadPage();
        addDefaultEvents();
        displayInboxTasks();
        controlTaskDeletion();
    });
}

function addDefaultEvents() {
    openCloseSideBar();
    resizeSideBar();
    removeOverlay();
    removeTaskButton();
    openInbox();
}

// SideBar-specific event listeners
export function openCloseSideBar() {
    cachedElements.sideBarButton().addEventListener('click', operateSideBar);
}

export function resizeSideBar() {
    window.addEventListener('resize', resetSideBarStyle);
}

export function removeOverlay() {
    cachedElements.overlay().addEventListener('click', closeSideBar);
}

export function validateInputTitle() {
    cachedElements.inputTitle().addEventListener('input', () => {
        validateTaskTitle();
    });
}

export function controlTextareaHeight() {
    cachedElements.taskDescTextarea().addEventListener('input', adjustTextareaHeight);
}

export function removeTaskButton() {
    if (cachedElements.btnAddTask()) {
        cachedElements.btnAddTask().addEventListener('click', controlFormDisplay);
    }
}

export function closeForm() {
    cachedElements.btnCancelForm().addEventListener('click', (e) => {
        e.preventDefault();
        controlFormDisplay();
    });
}

export function submitTask() {
    cachedElements.btnAddTaskForm().addEventListener('click', (e) => {
        e.preventDefault();
        getTaskData(e.target.closest('form'));
        // Function that displays a task 
        // * Determine what list should be displayed based on section heading
        addTask();
        controlTaskDeletion();
        controlFormDisplay();
    });
}

function openInbox() {
    if (!cachedElements.todoList().classList.contains("inbox")) {
        cachedElements.inboxBtn().addEventListener('click', () => {
            setSectionHeading("Inbox");
            getSection("Inbox");
            changeTodoListDisplay("Inbox");
            displayInboxTasks();
        });
    }
}

function controlTaskDeletion() {
    cachedElements.deleteTaskBtns().forEach((deleteTaskBtn) => {
        deleteTaskBtn.addEventListener('click', (e) => {
            let targetTask = e.target.closest('li')
            deleteTask(targetTask.dataset.id);
            targetTask.remove();
        });
    });
}





