import loadPage from "./loadPage";
import { cachedElements } from "./cacheElements";
import { operateSideBar, closeSideBar, resetSideBarStyle, switchProjectFormAndBtn, createProject, closeAddProjectForm } from "./sidebar";
import { adjustTextareaHeight, adjustEditFormTextarea, controlFormDisplay, validateTitle, closeTaskForm } from "./form.js";
import { switchSection, customiseWeekSection, isOverdueSectionEmpty } from "./createSection.js";
import getTaskData, { tasksStorage, storageModerator, taskCountTracker } from "./tasks";
import { displayInboxTasks, displayDueTodayTasks, displayProjectTasks, openTaskEditor, closeTaskEditor, openPopupMessage, closePopupMessage, discardTaskChanges, validateTaskEdition, applyChanges, visualiseTaskData } from "./taskUI.js";
import { storeDataLocally, checkStorageForProjects } from "./localStorage.js";
import * as dragNDrop from "./dragAndDrop.js";

export default function startApp() {
    window.addEventListener('DOMContentLoaded', () => {
        tasksStorage.setInbox();
        loadPage();
        checkStorageForProjects();
        addEvents();
        taskCountTracker.countTasks(cachedElements.taskCounts());
    });
}

function addEvents() {
    openCloseSideBar();
    resizeSideBar();
    removeOverlay();
    removeTaskButton();
    differentiateNavButtons();
    removeTask();
    changeDeleteBtnBg();
    editTask();
    openProjectForm();
    activateDragNDrop();
    controlDropDownMenu();
    expandDescription();
}

function activateDragNDrop() {
    let liItems = cachedElements.draggableListItems();
    liItems.forEach((liItem) => {
        if (liItem.getAttribute('listenerOnDragNDrop') !== 'true') {
            liItem.addEventListener('dragstart', (e) => {
                addDescriptionNoNExpandedClass(e.currentTarget);
                dragNDrop.handleDragStart.call(e.currentTarget, e);
            });
            liItem.addEventListener('dragover', dragNDrop.handleItemDragOver);
            liItem.addEventListener('dragenter', dragNDrop.handleDragEnter);
            liItem.addEventListener('dragleave', dragNDrop.handleDragLeave);
            liItem.addEventListener('dragend', dragNDrop.handleDragEnd);
            liItem.addEventListener('drop', dragNDrop.handleItemDrop);
        }
        liItem.setAttribute('listenerOnDragNDrop', 'true');
    });

    let dropZones = cachedElements.dropzoneUlLists();
    dropZones.forEach((dropZone) => {
        if (dropZone.getAttribute('listenerOnDropzone') !== 'true') {
            if (dropZone.closest('li')) {
                dropZone.closest('li').addEventListener('dragover', dragNDrop.handleDropAreaDragOver);
                dropZone.closest('li').addEventListener('dragleave', dragNDrop.handleDropAreaDragLeave);
            }
            dropZone.addEventListener('dragover', dragNDrop.handleDropzoneDragOver);
            dropZone.addEventListener('drop', dragNDrop.handleDropzoneDrop);
        }
        dropZone.setAttribute('listenerOnDropzone', 'true');
    });
}

function controlDropDownMenu() {
    cachedElements.dropDownBtn().addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropDown();
    });
}

function toggleDropDown() {
    cachedElements.projectsContainer().classList.toggle("show");
    cachedElements.dropDownBtn().classList.toggle("arrow");
}

function expandDescription() {
    let descriptions = [...cachedElements.taskDescriptionPs()];
    if (descriptions.length !== 0) {
        descriptions.forEach((description) => {
            if (description && description.getAttribute('listenerOnDescExpansion') !== "true") {
                description.addEventListener('click', () => {
                    description.classList.toggle('non-expanded-desc');
                    description.classList.toggle('expanded-desc');
                });
                description.setAttribute('listenerOnDescExpansion', "true");
            }
        });
    }
}

function addDescriptionNoNExpandedClass(currentLi) {
    if (cachedElements.currentTaskDescriptionP(currentLi).textContent.trim() !== '') {
        cachedElements.currentTaskDescriptionP(currentLi).classList.add('non-expanded-desc');
        cachedElements.currentTaskDescriptionP(currentLi).classList.remove('expanded-desc');
    }
}

export function highlightDropArea(dropzone) {
        dropzone.closest('li').addEventListener('mouseout', () => {
            console.log('mouseout');
            dropzone.classList.remove('over-dropzone');
        });
}

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
        changeDeleteBtnBg()
        editTask();
        controlFormDisplay();
        activateDragNDrop();
        expandDescription();
    });
}

function removeTask() {
    cachedElements.deleteTaskBtns().forEach((deleteTaskBtn) => {
        if (deleteTaskBtn.getAttribute('listenerOnDeleteBtn') !== 'true') {
            deleteTaskBtn.addEventListener('click', (e) => {
                let targetTask = e.target.closest('li');
                storageModerator.deleteTask(targetTask.dataset.id);
                taskCountTracker.countTasks(cachedElements.taskCounts());
                targetTask.remove();
                isOverdueSectionEmpty();
                storeDataLocally(tasksStorage.getInbox());
            });
            deleteTaskBtn.setAttribute('listenerOnDeleteBtn', 'true');
        }
    });
}

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
            switchSection(activeSection);
            displayInboxTasks();
            selected = true;
        }
    } else if (buttonPressed.dataset.innerType === "today" && activeSection !== "today") {
        activeSection = 'today';
        if (!storageModerator.isSectionOpen(activeSection)) {
            switchSection(activeSection); 
            displayDueTodayTasks();
            selected = true;
        }
    } else if (buttonPressed.dataset.innerType === "week" && activeSection !== "week") {
        activeSection = 'week';
        if (!storageModerator.isSectionOpen(activeSection)) {
            switchSection(activeSection);
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
    if (window.innerWidth <= 480) closeSideBar();
}

function makeSelectedSectionResponsive(activeSection) {
    tasksStorage.setStorageSection(activeSection);
    removeTask();
    changeDeleteBtnBg()
    removeTaskButton();
    editTask();
    activateDragNDrop();
    expandDescription();
}

function editTask() {
    cachedElements.editTaskBtns().forEach((editTaskBtn) => {
        if (editTaskBtn.getAttribute('listenerOnEditBtn') !== 'true') {
            editTaskBtn.addEventListener('click', (e) => {
                openTaskEditor(e.target.closest('li'));
                adjustEditFormTextarea();
                controlTextareaHeight();
                validateEditedData();
                closeEditForm();
                submitTaskChanges();
                if (cachedElements.taskForm()) {
                    closeTaskForm();
                }
            });
            editTaskBtn.setAttribute('listenerOnEditBtn', 'true');
        }
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
            changeDeleteBtnBg()
            editTask();
            isOverdueSectionEmpty();
            activateDragNDrop();
            expandDescription();            
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

export function differentiateProjectButtons() {
    cachedElements.projectBtns().forEach((projectBtn) => {
        if (projectBtn.getAttribute('listenerOnProjectOpen') !== 'true') {
            projectBtn.addEventListener('click', () => {
                selectedSection(projectBtn, tasksStorage.getStorageSection())
            });
            projectBtn.setAttribute('listenerOnProjectOpen', 'true');
        }
    });
}

function assignProjectId(projectId) {
    tasksStorage.resetOpenedProjectId();
    tasksStorage.setProjectId(projectId);
}

export function deleteProject() {
    cachedElements.removeProjectBtns().forEach((rmProjectBtn) => {
        if (rmProjectBtn.getAttribute('listenerOnProjectRm') !== 'true') {
            rmProjectBtn.addEventListener('click', (e) => {
                let targetProjectLi = e.target.closest('li');
                // delete project tasks from inbox
                storageModerator.deleteProjectTasks(targetProjectLi.dataset.projectId);
                taskCountTracker.removeSection(targetProjectLi.dataset.projectId);
                // remove project Li
                targetProjectLi.remove();
                // removoe project section and load inbox
                switchSection('inbox');
                displayInboxTasks();
                makeSelectedSectionResponsive('inbox');
                // closeAddProjectFrom 
                closeAddProjectForm();
                
                taskCountTracker.countTasks(cachedElements.taskCounts());
                storeDataLocally(tasksStorage.getInbox());
            });
            rmProjectBtn.setAttribute('listenerOnProjectRm', 'true');
        }
    });
}

function changeDeleteBtnBg() {
    cachedElements.deleteTaskBtns().forEach((deleteTaskBtn) => {
        if (deleteTaskBtn.getAttribute('listenerOnColorChange') !== 'true') {
            let btnBgColor = null;
            const btnBgSpan = cachedElements.deleteTaskBtnSpan(deleteTaskBtn);
            deleteTaskBtn.addEventListener('mouseenter', () => {
                let btnBorderColor = window.getComputedStyle(deleteTaskBtn).getPropertyValue("border-color");
                btnBgColor = window.getComputedStyle(btnBgSpan).getPropertyValue("background-color");
                deleteTaskBtn.style.backgroundColor = `${btnBorderColor}`;
                btnBgSpan.style.backgroundColor = `${btnBorderColor}`;
            });
            deleteTaskBtn.addEventListener('mouseleave', () => {
                btnBgSpan.style.backgroundColor = `${btnBgColor}`;
                deleteTaskBtn.style.backgroundColor = `${btnBgColor}`;
                btnBgColor = null;
            });
            deleteTaskBtn.setAttribute('listenerOnColorChange', 'true');
        }
    });
}