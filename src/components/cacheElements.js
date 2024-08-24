function cacheElements() {

    const sideBarContainer = () => document.querySelector('.sidebar-container');
    const sideBar = () => document.querySelector('.sidebar-block');
    const navBar = () => document.querySelector('.nav');
    const sideBarButton = () => document.querySelector('.open-close-btn');
    const sideBarButtonContainer = () => document.querySelector('.sidebar-block > div:first-of-type');
    const overlay = () => document.querySelector('.overlay');
    const overlayOff = () => document.querySelector('.overlay-off');

    const btnAddTask = () => document.querySelector('.add-task-btn');
    const taskDescTextarea = () => document.querySelector('.task-form textarea');
    

    return {
        sideBarContainer,
        sideBar,
        navBar,
        sideBarButton,
        sideBarButtonContainer,
        overlay,
        overlayOff,
        btnAddTask,
        taskDescTextarea,
    }
}

export const cachedElements = cacheElements();