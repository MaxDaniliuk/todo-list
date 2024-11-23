import createSideBar from "./sidebar";
import { createSection } from "./createSection.js";
import { displayInboxTasks } from "./taskUI.js";
import { createIconContainer } from "./commonFn.js";

export default function loadPage() {
    loadContent();
    displayInboxTasks();
}

function loadContent() {
    const content = document.querySelector('.page-wrapper');
    content.appendChild(sideBarContainer());
    content.appendChild(wrapPageContent());
    content.appendChild(createOverlay());
}

// Sidebar-related elements
function sideBarContainer() {
    const sideBarContainer = document.createElement('div');
    sideBarContainer.classList.add("sidebar-container");
    sideBarContainer.appendChild(createSideBar());
    return sideBarContainer;
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add("overlay");
    return overlay;
}

// Content wrapper
function wrapPageContent() {
    const pageContentWrapper = document.createElement('div');
    pageContentWrapper.classList.add("header-content-block");
    pageContentWrapper.appendChild(createHeader());
    pageContentWrapper.appendChild(createSectionContent())
    return pageContentWrapper;
}

// Header
function createHeader() {
    const header = document.createElement('div');
    header.classList.add('header-img-container');
    let projectLogoTextSpan = document.createElement('span');
    projectLogoTextSpan.textContent = 'todo';
    header.appendChild(projectLogoTextSpan);
    let projectIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="16" y1="24" x2="38" y2="24"></line> <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="16" y1="34" x2="38" y2="34"></line> <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="16" y1="44" x2="38" y2="44"></line> <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="16" y1="54" x2="38" y2="54"></line> <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="12" y1="24" x2="8" y2="24"></line> <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="12" y1="34" x2="8" y2="34"></line> <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="12" y1="44" x2="8" y2="44"></line> <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="12" y1="54" x2="8" y2="54"></line> <polyline fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="14,8 1,8 1,63 45,63 45,8 32,8 "></polyline> <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="27,5 27,1 19,1 19,5 15,5 13,13 33,13 31,5 "></polygon> <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="55,1 55,54 59,62 63,54 63,1 "></polygon> <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="55" y1="11" x2="63" y2="11"></line> </g></svg>`;                 //
    header.appendChild(createIconContainer(projectIcon, ['project-logo']));
    return header;
}

// Tasks-related elements 
function createSectionContent() {
    const sectionWrapper = document.createElement('div');
    sectionWrapper.classList.add('section-wrapper');
    sectionWrapper.appendChild(createSection());
    return sectionWrapper;
}