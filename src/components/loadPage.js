import { createNavBar, createOpenCloseBtn } from "./createNavBar";
import { openCloseSideBar } from "./eventListeners";

function loadPage() {
    const content = document.querySelector('.content');
    content.appendChild(createSideBar());
    content.appendChild(wrapMainContent());
    openCloseSideBar();
}

function createSideBar() {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar-block');
    sidebar.appendChild(createOpenCloseBtn());
    sidebar.appendChild(createNavBar());
    return sidebar;
}

function wrapMainContent() {
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-block');

    mainContent.appendChild(createHeader());
    mainContent.appendChild(createTaskDisplayScreen())
    return mainContent;
}

function createHeader() {
    const header = document.createElement('header');
    header.classList.add('header');
    // Add App image or main TEXT like 'Doer's List'
    return header;
}

function createTaskDisplayScreen() {
    const taskDisplayScreen = document.createElement('div');
    taskDisplayScreen.classList.add('main-display-screen');
    return taskDisplayScreen;
}

export default loadPage;