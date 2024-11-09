import { createButton, toggleCssClass, createTaskCountContainer, createIconContainer } from "./commonFn";
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
    nav.appendChild(createProjectDropDown());
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
        if (navBtnComponents[navBtnComponent]["innerType"] === "inbox") {
            liElement.classList.add('tab-open');
        }
        liElement.appendChild(createTaskCountContainer(navBtnComponents[navBtnComponent]["innerType"]));
        btnsList.appendChild(liElement);
    });
    return btnsList;
}

function createProjectDropDown() {
    const projectDropDown = document.createElement('div');
    projectDropDown.classList.add('project-drop');

    const hBtnContainer = document.createElement('div');
    const projectH = document.createElement('h1');
    projectH.textContent = "Projects";
    let svgImg = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#e7e5e4"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#e7e5e4"></path></g></svg>`;
    hBtnContainer.appendChild(projectH);
    hBtnContainer.appendChild(createIconContainer(svgImg, ['project-drop-down-btn']));

    projectDropDown.appendChild(hBtnContainer);
    projectDropDown.appendChild(createProjectTab())
    return projectDropDown;
}

function createProjectTab() {
    const projectSectionContainer = document.createElement('div');
    projectSectionContainer.classList.add('projects-container');
    const dropContent = document.createElement('div');
    dropContent.classList.add('project-drop');
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

    const projectBtnsContainer = document.createElement('div');
    projectBtnsContainer.classList.add('project-btns-container');
    projectBtnsContainer.appendChild(createButton({"btnName": projectTitle, "classList": ["btn", "project-btn"], "innerType": innerType}));
    projectBtnsContainer.appendChild(createButton({"btnName": "X", "classList": ["btn", "project-delete-btn"]}));
    buttonsContainer.appendChild(projectBtnsContainer);
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
    // let svgImg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M6,8V16H10V8H6Z" /></svg>`;
    let svgImg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#e7e5e4"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="sidebar-left"> <g> <rect data-name="Square" fill="none" height="18" id="Square-2" rx="2" ry="2" stroke="#e7e5e4" stroke-miterlimit="10" stroke-width="2" width="18" x="3" y="3"></rect> <line fill="none" stroke="#e7e5e4" stroke-miterlimit="10" stroke-width="2" x1="9" x2="9" y1="21" y2="3"></line> </g> </g> </g> </g></svg>`;
    div.appendChild(createIconContainer(svgImg, ["btn", "open-close-btn"]));
    // div.appendChild(createButton({"btnName": "O/C", "classList": ["btn", "open-close-btn"]}));
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
    cachedElements.sideBarButtonContainer().style.justifyContent = "end";
    cachedElements.sideBarButtonContainer().style.paddingRight = "17px";
}
function setSideBarStyle(sideBarWidth = '', navMarginLeft = '') {
    setElementWidth(cachedElements.sideBar(), sideBarWidth);
    cachedElements.navBar().style.marginLeft = navMarginLeft;
}

export function closeSideBar() {
    setSideBarStyle("48px", "-280px");
    setSideBarContainerSize("48px");
    deactivateOverlay();
    cachedElements.sideBarButtonContainer().style.justifyContent = "center"
    cachedElements.sideBarButtonContainer().style.paddingRight = "0";
}

export function resetSideBarStyle() {
    resetSideBarContainerSize();
    setSideBarStyle();
    resetOverlay();
    cachedElements.sideBarButtonContainer().style.justifyContent = "";
    cachedElements.sideBarButtonContainer().style.paddingRight = "";
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