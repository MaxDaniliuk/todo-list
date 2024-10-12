import loadPage from "./loadPage";
import { cachedElements } from "./cacheElements";
import { operateSideBar, closeSideBar, resetSideBarStyle, switchProjectFormAndBtn, createProject, closeAddProjectForm } from "./sidebar";
import { adjustTextareaHeight, controlFormDisplay, validateTitle, closeTaskForm } from "./form.js";
import { switchSection, customiseWeekSection, isOverdueSectionEmpty } from "./createSection.js";
import getTaskData, { tasksStorage, storageModerator} from "./tasks";
import { visualiseTaskData } from "./tasks";
import { displayInboxTasks, displayDueTodayTasks, displayProjectTasks, openTaskEditor, closeTaskEditor, openPopupMessage, closePopupMessage, discardTaskChanges, validateTaskEdition, applyChanges } from "./taskUI.js"

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
    differentiateNavButtons();
    removeTask();
    editTask();
    openProjectForm();
}

// SideBar-specific event listeners
export function openCloseSideBar() {
    cachedElements.sideBarButton().addEventListener('click', () => {
        operateSideBar()
        closeAddProjectForm();
    });
}

export function resizeSideBar() {
    window.addEventListener('resize', resetSideBarStyle);
}

export function removeOverlay() {
    cachedElements.overlay().addEventListener('click', closeSideBar);
}

// Task addition form specific event listeners
export function validateInputTitle(button) {
    cachedElements.inputTitles().forEach((inputTitle) => {
        inputTitle.addEventListener('input', () => {
            validateTitle(inputTitle, button);
        });
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
function differentiateNavButtons() {
    cachedElements.navBtns().forEach((navBtn) => {
        navBtn.addEventListener('click', () => {
            selectedSection(navBtn, tasksStorage.getStorageSection());
            tasksStorage.resetOpenedProjectId();
        });
    });
}

function selectedSection(buttonPressed, activeSection) {
    let selected = false;
    if (buttonPressed.dataset.innerType === "inbox" && activeSection !== "inbox") {
        activeSection = 'inbox';
        if (!storageModerator.isSectionOpen(activeSection)) {
            switchSection('inbox');
            displayInboxTasks();
            selected = true;
        }
    } else if (buttonPressed.dataset.innerType === "today" && activeSection !== "today") {
        activeSection = 'today';
        if (!storageModerator.isSectionOpen(activeSection)) {
            switchSection('today');
            displayDueTodayTasks();
            selected = true;
        }
    } else if (buttonPressed.dataset.innerType === "week" && activeSection !== "week") {
        activeSection = 'week';
        if (!storageModerator.isSectionOpen(activeSection)) {
            switchSection('week');
            customiseWeekSection();
            selected = true;
        }
    } else {
        activeSection = buttonPressed.dataset.innerType;
        if (!storageModerator.isSectionOpen(activeSection)) {
            switchSection(activeSection);
            assignProjectId(buttonPressed.closest('li').dataset.projectId);
            displayProjectTasks(buttonPressed);
            selected = true;
        }
    }

    if (selected) {
        makeSelectedSectionResponsive(activeSection);
    }
    closeAddProjectForm();
}

function makeSelectedSectionResponsive(activeSection) {
    tasksStorage.setStorageSection(activeSection);
    removeTask();
    removeTaskButton();
    editTask();
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
        if (!storageModerator.compareTasks()) {
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

export function openProjectForm() {
    cachedElements.addProjectBtn().addEventListener('click', switchProjectFormAndBtn)
}

export function closeProjectForm() {
    cachedElements.cancelPojectBtn().addEventListener('click', switchProjectFormAndBtn);
}

export function addProject() {
    cachedElements.createProjectBtn().addEventListener('click', () => {
        createProject();
        switchProjectFormAndBtn();
        differentiateProjectButtons();
        deleteProject();
    });
}

function differentiateProjectButtons() {
    cachedElements.projectBtns().forEach((projectBtn) => {
        projectBtn.addEventListener('click', () => {
            selectedSection(projectBtn, tasksStorage.getStorageSection())
        });
    });
}

function assignProjectId(projectId) {
    tasksStorage.resetOpenedProjectId();
    tasksStorage.setProjectId(projectId);
}

function deleteProject() {
    cachedElements.removeProjectBtns().forEach((rmProjectBtn) => {
        rmProjectBtn.addEventListener('click', (e) => {
            let targetProjectLi = e.target.closest('li');
            // delete project tasks from inbox
            storageModerator.deleteProjectTasks(targetProjectLi.dataset.projectId);
            // remove project Li
            targetProjectLi.remove()
            // removoe project section and load inbox (loadPage() fn )
            switchSection('inbox');
            displayInboxTasks();
            makeSelectedSectionResponsive('inbox');
            // closeAddProjectFrom 
            closeAddProjectForm();

            // removoe project section and load inbox (loadPage() fn )
            
        })
    });
}



