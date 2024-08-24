import { cachedElements } from "./cacheElements";

export function openCloseSideBar() {
    cachedElements.sideBarButton().addEventListener('click', () => {
        if (cachedElements.sideBar().offsetWidth == 48) {
            openSideBar();
        } else if (cachedElements.sideBar().offsetWidth == 280) {
            closeSideBar();
        }
    });
}

function setSideBarStyle(sideBarWidth = '', navMarginLeft = '', position = "relative", zIndex = 2) {
    cachedElements.sideBar().style.position = position;
    setElementWidth(cachedElements.sideBar(), sideBarWidth);
    cachedElements.navBar().style.marginLeft = navMarginLeft;
    cachedElements.sideBar().style.zIndex = zIndex;
}

function resetSideBarContainerSize() {
    setElementWidth(cachedElements.sideBarContainer());
}

function setSideBarContainerSize(width) {
    if (window.innerWidth > 480) {
        setElementWidth(cachedElements.sideBarContainer(), width);
    }
}

export function resizeSideBar() {
    window.addEventListener('resize', () => {
        resetSideBarContainerSize();
        setSideBarStyle();
        resetOverlay();
    });
}

function openSideBar() {
    if (window.innerWidth <= 480) {
        setSideBarStyle("280px", "0px", "absolute", "10");
        activateOverlay();
    } else if (window.innerWidth > 480) {
        setSideBarStyle("280px", "0px");
        setSideBarContainerSize("280px");
    }
}

function closeSideBar() {
    setSideBarStyle("48px", "-280px");
    setSideBarContainerSize("48px");
    deactivateOverlay();
}

export function removeOverlay() {
    cachedElements.overlay().addEventListener('click', closeSideBar);
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

export function expandTextarea() {
    const textarea = cachedElements.taskDescTextarea();
    textarea.addEventListener('input', () => {
        textarea.style.height = '20px';
        textarea.style.height = `${textarea.scrollHeight}px`;
    });
}

function toggleCssClass(element, classAdd, classRemove) {
    element.classList.add(classAdd);
    element.classList.remove(classRemove);
}

function setElementWidth(element, width = '') {
    element.style.width = width;
}