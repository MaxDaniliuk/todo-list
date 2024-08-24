import createSideBar from "./sidebar";
import createHeader from "./header";
import createContentWrapper from "./contentWrapper";
import * as eventHandler from "./eventListeners";

export default function loadPage() {
    loadContent();
    addEvents();
}

function loadContent() {
    const content = document.querySelector('.page-wrapper');
    content.appendChild(sideBarContainer());
    content.appendChild(wrapPageContent());
    content.appendChild(createOverlay());
}

function addEvents() {
    eventHandler.openCloseSideBar();
    eventHandler.resizeSideBar();
    eventHandler.removeOverlay();
    eventHandler.expandTextarea();
}

function sideBarContainer() {
    const sideBarContainer = document.createElement('div');
    sideBarContainer.classList.add("sidebar-container");
    sideBarContainer.appendChild(createSideBar());
    return sideBarContainer;
}

function wrapPageContent() {
    const pageContentWrapper = document.createElement('div');
    pageContentWrapper.classList.add("header-content-block");
    pageContentWrapper.appendChild(createHeader());
    pageContentWrapper.appendChild(createContentWrapper())
    return pageContentWrapper;
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add("overlay");
    return overlay;
}