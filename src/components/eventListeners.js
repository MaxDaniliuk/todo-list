import { cachedElements } from "./cacheElements";

function changeSideBarStyle(sideBarWidth = '', navBarDisplay = '', btnAlignment = '') {
    cachedElements.sideBar().style.width = sideBarWidth;
    cachedElements.navBar().style.display = navBarDisplay;
    cachedElements.sideBarButtonContainer().style.textAlign = btnAlignment;
}   

export function openCloseSideBar() {
    window.addEventListener('resize', () => {
        changeSideBarStyle();
    });
    cachedElements.sideBarButton().addEventListener('click', () => {
        if (cachedElements.sideBar().offsetWidth == 48) {
            changeSideBarStyle('280px', 'block', 'end');
        } else if (cachedElements.sideBar().offsetWidth == 280) {
            changeSideBarStyle('48px', 'none', 'center');
        }
    })
}