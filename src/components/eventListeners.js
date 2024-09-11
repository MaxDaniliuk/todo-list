import loadPage from "./loadPage";
import { cachedElements } from "./cacheElements";
import { operateSideBar, closeSideBar, resetSideBarStyle } from "./sidebar"
import { adjustTextareaHeight, controlFormDisplay, validateTaskTitle } from "./form.js";
import { switchSection } from "./createSection.js"
import { getTaskData, displayInboxTasks, displayDueTodayTasks, addTask, deleteTask, isSectionOpen } from "./tasks";

//start app 
export default function startApp() {
    window.addEventListener('DOMContentLoaded', () => {
        loadPage();
        addDefaultEvents();
        displayInboxTasks();
        removeTask();
    });
}

function addDefaultEvents() {
    openCloseSideBar();
    resizeSideBar();
    removeOverlay();
    removeTaskButton();
    controlNavButtons();
    // openInbox();
    // openDueTodayTasks();
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
        removeTask();
        controlFormDisplay();
    });
}

function controlNavButtons() {
    let activeSection = 'inbox'; // inbox opens by default
    cachedElements.navBtns().forEach((navBtn) => {
        navBtn.addEventListener('click', () => {
            
            // First, it does not check the section. Check if current section is open 
            // This if statement isn't working
            // 
            if (navBtn.dataset.innerType === "inbox" && activeSection !== "inbox") {
                activeSection = 'inbox';
                if (!isSectionOpen(activeSection)) {
                    // check it by dataset as well or tasksStorage storage type? 
                    switchSection();
                    displayInboxTasks();
                }
            } else if (navBtn.dataset.innerType === "today" && activeSection !== "today") {
                activeSection = 'today';
                if (!isSectionOpen(activeSection)) {
                    switchSection('today');
                    displayDueTodayTasks();
                }
            }
            removeTask();
            removeTaskButton();
        })
    });
}

// function openInbox() {
//         cachedElements.inboxBtn().addEventListener('click', () => {
//             if (!cachedElements.section().classList.contains("inbox-section")) {
//                 switchSection();
//                  // default param is inbox
//                 displayInboxTasks();
//                 // setSectionHeading("Inbox"); // Done
//                 // setSectionType("Inbox"); 
//                 // changeTodoListDisplay("Inbox"); Done
//                 // displayInboxTasks(); Done
//                 removeTask();
//                 removeTaskButton();
//             }
//         });
// }

// function openDueTodayTasks() {
//         cachedElements.todayBtn().addEventListener('click', () => {
//             if (!cachedElements.todoList().classList.contains("today")) {
//                 switchSection('today');
//                 // setSectionHeading("Today");
//                 // setSectionType("Today");
//                 // changeTodoListDisplay("Today");
//                 displayDueTodayTasks();
//                 removeTask();
//                 removeTaskButton();
//             }
//         });
// }

function removeTask() {
    cachedElements.deleteTaskBtns().forEach((deleteTaskBtn) => {
        deleteTaskBtn.addEventListener('click', (e) => {
            let targetTask = e.target.closest('li')
            deleteTask(targetTask.dataset.id);
            targetTask.remove();
        });
    });
}





