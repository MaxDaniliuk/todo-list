import { createButton, toggleCssClass, createTaskCountContainer } from "./commonFn";
import { cachedElements } from "./cacheElements";
import * as eventHandler from "./eventListeners";
import { v4 as uuidv4 } from 'uuid';
import { taskCountTracker } from "./tasks";

export default function createSideBar() {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar-block');
    sidebar.appendChild(createOpenCloseBtn());
    sidebar.appendChild(createNavBar());
    return sidebar;
}

function createNavBar() {
    const nav = document.createElement('nav');
    nav.classList.add('nav');
    nav.appendChild(createNavBtnsList());
    nav.appendChild(createProjectTab());
    return nav;
}

function getNavBtnDetails() {
    const navBarComponents = {
        "inbox": {
            "btnName": "Inbox",
            "classList": ["btn", "nav-btn"],
            "innerType": "inbox",
        },
        "today": {
            "btnName": "Today",
            "classList": ["btn", "nav-btn"],
            "innerType": "today",
        },
        "thisWeek": {
            "btnName": "Week",
            "classList": ["btn", "nav-btn"],
            "innerType": "week",
        },
    };
    return navBarComponents;
}

function createNavBtnsList() {
    const navBtnComponents = getNavBtnDetails();
    const btnsList = document.createElement('ul');
    btnsList.classList.add('btns-list');

    Object.keys(navBtnComponents).forEach(navBtnComponent => {
        let liElement = document.createElement('li');
        liElement.appendChild(createButton(navBtnComponents[navBtnComponent]));
        liElement.appendChild(createTaskCountContainer(navBtnComponents[navBtnComponent]["innerType"]));
        btnsList.appendChild(liElement);
    });
    return btnsList;
}

function createProjectTab() {
    const projectSectionContainer = document.createElement('div');
    projectSectionContainer.classList.add('projects-container');
    projectSectionContainer.textContent = 'Projects';
    const addProjectBlock = document.createElement('div');
    addProjectBlock.classList.add('add-project-block');
    addProjectBlock.appendChild(createButton({"btnName": "+ Add Project", "classList": ["btn", "add-project-btn"]}));
    projectSectionContainer.appendChild(addProjectBlock);
    return projectSectionContainer;
}

function createAddProjectForm() {
    const projectFormContainer = document.createElement('div');
    projectFormContainer.classList.add('project-form-container');
    projectFormContainer.innerHTML += `
        <input type="text" name="projectName" id="projectTitle" placeholder="Get groceries" maxlength="20" autocomplete="off">
    `;
    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(createButton({"btnName": "Cancel", "classList": ["btn", "cancel-project-btn"]}));
    buttonContainer.appendChild(createButton({"btnName": "Create", "classList": ["btn", "create-project-btn", "enabled-btn"]}));

    projectFormContainer.appendChild(buttonContainer);
    cachedElements.addProjectFormBlock().appendChild(projectFormContainer);
    cachedElements.createProjectBtn().setAttribute("disabled", true);
    cachedElements.addProjectBtn().remove();
    eventHandler.closeProjectForm();
    eventHandler.addProject();
}

export function createProject(storedProjectData = false) { 
    let projectTitle = storedProjectData["project"] || cachedElements.projectTitle().value;
    let innerType = projectTitle.split(' ').join('-');
    const projectLi = document.createElement('li');
    projectLi.dataset.projectId = storedProjectData["projectId"] || uuidv4();
    const buttonsContainer = document.createElement('div');

    const projectButton = createButton({"btnName": projectTitle, "classList": ["btn", "project-btn"], "innerType": innerType});
    buttonsContainer.appendChild(projectButton);
    buttonsContainer.appendChild(createButton({"btnName": "X", "classList": ["btn", "project-delete-btn"]}));
    buttonsContainer.appendChild(createTaskCountContainer(projectLi.dataset.projectId))
    projectLi.appendChild(buttonsContainer);
    
    if (!cachedElements.projectsList()) {
        cachedElements.projectsContainer().appendChild(createProjectsList(projectLi));
    } else {
        cachedElements.projectsList().appendChild(projectLi);
    }
    taskCountTracker.addSection(projectLi.dataset.projectId);
}

function createProjectsList(firstProjectBtnLi = null) {
    const projectsUl = document.createElement('ul');
    projectsUl.classList.add('projects-list');
    projectsUl.appendChild(firstProjectBtnLi);
    if (firstProjectBtnLi) return projectsUl;
    return;
}

export function switchProjectFormAndBtn() {
    if (cachedElements.addProjectBtn()) {
        createAddProjectForm();    
    } else if (cachedElements.projectFormContainer()) {
        recreateAddProjectBtn();
    }
    eventHandler.validateInputTitle(cachedElements.createProjectBtn());
}

function recreateAddProjectBtn() {
    cachedElements.projectFormContainer().remove();
    cachedElements.addProjectFormBlock().appendChild(createButton({"btnName": "+ Add Project", "classList": ["btn", "add-project-btn"]}));
    eventHandler.openProjectForm();
}

export function closeAddProjectForm() {
    if (cachedElements.projectFormContainer()) {
        recreateAddProjectBtn();
    }
}

export function recreateProjectNavBars(sectionData) {
    createProject(sectionData);
    eventHandler.differentiateProjectButtons();
    eventHandler.deleteProject();
}

function createOpenCloseBtn() {
    let div = document.createElement('div');
    div.appendChild(createButton({"btnName": "O/C", "classList": ["btn", "open-close-btn"]}));
    return div;
}

// Below are functions responsible for sidebar's responsiveness

export function operateSideBar() {
    if (cachedElements.sideBar().offsetWidth == 48) {
        openSideBar();
    } else if (cachedElements.sideBar().offsetWidth == 280) {
        closeSideBar();
    }
}

function openSideBar() {
    if (window.innerWidth <= 480) {
        setSideBarStyle("280px", "0px");
        activateOverlay();
    } else if (window.innerWidth > 480) {
        setSideBarStyle("280px", "0px");
        setSideBarContainerSize("280px");
    }
}
function setSideBarStyle(sideBarWidth = '', navMarginLeft = '') {
    setElementWidth(cachedElements.sideBar(), sideBarWidth);
    cachedElements.navBar().style.marginLeft = navMarginLeft;
}

export function closeSideBar() {
    setSideBarStyle("48px", "-280px");
    setSideBarContainerSize("48px");
    deactivateOverlay();
}

export function resetSideBarStyle() {
    resetSideBarContainerSize();
    setSideBarStyle();
    resetOverlay();
}

function resetSideBarContainerSize() {
    setElementWidth(cachedElements.sideBarContainer());
}

function setSideBarContainerSize(width) {
    if (window.innerWidth > 480) {
        setElementWidth(cachedElements.sideBarContainer(), width);
    }
}

function activateOverlay() {
    toggleCssClass(cachedElements.overlay(), "overlay-on", "overlay-off");
    setElementWidth(cachedElements.overlay(), "calc(100vw - 48px)");
}

function deactivateOverlay() {
    toggleCssClass(cachedElements.overlay(), "overlay-off", "overlay-on");
    setElementWidth(cachedElements.overlay());
}

function resetOverlay() {
    cachedElements.overlay().classList.contains("overlay-off") ? cachedElements.overlay().classList.remove("overlay-off") : cachedElements.overlay().classList.remove("overlay-on");
    setElementWidth(cachedElements.overlay());
}

function setElementWidth(element, width = '') {
    element.style.width = width;
}