import loadPage from "./loadPage";
import { cachedElements } from "./cacheElements";
import { operateSideBar, closeSideBar, resetSideBarStyle } from "./sidebar";
import { adjustTextareaHeight, controlFormDisplay, validateTaskTitle, closeTaskForm } from "./form.js";
import { switchSection, customiseWeekSection, isOverdueSectionEmpty } from "./createSection.js";
import getTaskData, { tasksStorage, storageModerator, selectCurrentWeekDays } from "./tasks";
import { visualiseTaskData } from "./tasks";
import { displayInboxTasks, displayDueTodayTasks, openTaskEditor, closeTaskEditor, openPopupMessage, closePopupMessage, discardTaskChanges, validateTaskEdition, applyChanges } from "./taskUI.js"

//start app 
export default function startApp() {
    window.addEventListener('DOMContentLoaded', () => {
        loadPage();
        addEvents();
        // selectCurrentWeekDays();
    });
}

function addEvents() {
    openCloseSideBar();
    resizeSideBar();
    removeOverlay();
    removeTaskButton();
    controlNavButtons();
    removeTask();
    editTask();
    
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

// Task addition form specific event listeners
export function validateInputTitle() {
    cachedElements.inputTitle().addEventListener('input', () => {
        validateTaskTitle();
    });
}

export function controlTextareaHeight() {
    cachedElements.taskDescTextarea().addEventListener('input', adjustTextareaHeight);
}

export function removeTaskButton() {
    cachedElements.btnsAddTask().forEach((addTaskButton) => {
        addTaskButton.addEventListener('click', (e) => {
            if (cachedElements.taskForms().length < 1) {
                controlFormDisplay(e.target.closest('div'));
            }
        });
    });
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
        visualiseTaskData(getTaskData(e.target.closest('form')), e.target.dataset.buttonType, e.target.closest('section'));
        removeTask();
        editTask();
        controlFormDisplay();
    });
}

function removeTask() {
    cachedElements.deleteTaskBtns().forEach((deleteTaskBtn) => {
        deleteTaskBtn.addEventListener('click', (e) => {
            let targetTask = e.target.closest('li')
            storageModerator.deleteTask(targetTask.dataset.id);
            targetTask.remove();
            isOverdueSectionEmpty();
        });
    });
}

// Section navigation specific event listeners
function controlNavButtons() {
    let activeSection = 'inbox';
    cachedElements.navBtns().forEach((navBtn) => {
        navBtn.addEventListener('click', () => {
            if (navBtn.dataset.innerType === "inbox" && activeSection !== "inbox") {
                activeSection = 'inbox';
                if (!storageModerator.isSectionOpen(activeSection)) {
                    switchSection('inbox');
                    displayInboxTasks();
                }
            } else if (navBtn.dataset.innerType === "today" && activeSection !== "today") {
                activeSection = 'today';
                if (!storageModerator.isSectionOpen(activeSection)) {
                    switchSection('today');
                    displayDueTodayTasks();
                }
            } else if (navBtn.dataset.innerType === "week" && activeSection !== "week") {
                activeSection = 'week';
                if (!storageModerator.isSectionOpen(activeSection)) {
                    switchSection('week');
                    customiseWeekSection();
                }
            }
            tasksStorage.setStorageSection(activeSection);
            removeTask();
            removeTaskButton();
            editTask();
        })
    });
}

function editTask() {
    cachedElements.editTaskBtns().forEach((editTaskBtn) => {
        editTaskBtn.addEventListener('click', (e) => {
            openTaskEditor(e.target.closest('li'))
            controlTextareaHeight();
            validateEditedData();
            closeEditForm();
            submitTaskChanges();
            if (cachedElements.taskForm()) {
                closeTaskForm();
            }
        });
    });
}

function validateEditedData() {
    const taskCopy = tasksStorage.getEditedTaskCopy();
    if (Object.keys(taskCopy).length) {
        cachedElements.editForm().addEventListener('input', (e) => {
            if (e.target === cachedElements.editFormTitle()) {
                taskCopy[e.target["name"]] = e.target.value;
            };
            if (e.target === cachedElements.editFormDescription()) {
                taskCopy[e.target["name"]] = e.target.value;
            };
            if (e.target === cachedElements.editFormCalendar()) {
                taskCopy[e.target["name"]] = e.target.value;
            };
            if (e.target === cachedElements.editFormSelect()) {
                taskCopy[e.target["name"]] = e.target.value;
            };
            validateTaskEdition();
            //Here I should enable/disable submit btn - done
            // It shows the previous dates as well in the edit form calendar... 
        });
    }
}

function submitTaskChanges() {
    cachedElements.editFormSubmitBtn().addEventListener('click', (e) => {
        e.preventDefault();
        if (!storageModerator.compareTasks()) {      
            applyChanges(e.target.dataset.buttonType) 
            closeTaskEditor();
            removeTask();
            editTask();
            isOverdueSectionEmpty();
        }
    });
}

function closeEditForm() {
    cachedElements.editFormCloseBtn().addEventListener('click', (e) => {
        e.preventDefault(); 
        if (!storageModerator.compareTasks()) { // Are objects equal? 
            openPopupMessage();
            continueTaskEdition();
            finishTaskEdition();
        } else {
            closeTaskEditor();
        }
    });
}

function continueTaskEdition() {
    cachedElements.popupCancelBtn().addEventListener('click', closePopupMessage);
}

function finishTaskEdition() {
    // Do you need to delete a copy here? 
    cachedElements.popupDiscardBtn().addEventListener('click', () => {
        discardTaskChanges();
    });
}






