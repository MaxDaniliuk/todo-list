import { createButton, toggleCssClass } from "./commonFn";
import { cachedElements } from "./cacheElements";

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
    nav.appendChild(createNavBtnsContainer());
    return nav;
}

function getNavBtnDetails() {
    const navBarComponents = {
        "inbox": {
            "btnName": "Inbox",
            "classList": ["btn", "inbox-btn"],
        },
        "today": {
            "btnName": "Today",
            "classList": ["btn", "today-btn"],
        },
        "upcoming": {
            "btnName": "Upcoming",
            "classList": ["btn", "upcoming-btn"],
        },
    };
    return navBarComponents;
}

function createNavBtnsContainer() {
    const navBtnComponents = getNavBtnDetails();
    const navUlContainer = document.createElement('div');
    navUlContainer.classList.add('btns-wrapper');
    const ul = document.createElement('ul');
    ul.classList.add('nav-list');

    Object.keys(navBtnComponents).forEach(navBtnComponent => {
        let liElement = document.createElement('li');
        liElement.appendChild(createButton(navBtnComponents[navBtnComponent]))
        ul.appendChild(liElement);
    });
    navUlContainer.appendChild(ul);
    return navUlContainer;
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