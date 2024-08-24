import { cachedElements } from "./cacheElements";
import { operateSideBar, closeSideBar, resetSideBarStyle } from "./sidebar"
import { adjustTextareaHeight } from "./contentWrapper";

export function openCloseSideBar() {
    cachedElements.sideBarButton().addEventListener('click', operateSideBar);
}

export function resizeSideBar() {
    window.addEventListener('resize', resetSideBarStyle);
}

export function removeOverlay() {
    cachedElements.overlay().addEventListener('click', closeSideBar);
}

