function cacheElements() {

    const sideBar = () => document.querySelector('.sidebar-block');
    const navBar = () => document.querySelector('.nav');
    const sideBarButton = () => document.querySelector('.open-close-btn');
    const sideBarButtonContainer = () => document.querySelector('.sidebar-block > div:first-of-type');

    return {
        sideBar,
        navBar,
        sideBarButton,
        sideBarButtonContainer,
    }
}

export const cachedElements = cacheElements();