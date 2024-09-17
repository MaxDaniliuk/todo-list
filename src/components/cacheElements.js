function cacheElements() {

    const sideBarContainer = () => document.querySelector('.sidebar-container');
    const sideBar = () => document.querySelector('.sidebar-block');
    const navBar = () => document.querySelector('.nav');
    const sideBarButton = () => document.querySelector('.open-close-btn');
    const sideBarButtonContainer = () => document.querySelector('.sidebar-block > div:first-of-type');
    const overlay = () => document.querySelector('.overlay');
    const overlayOff = () => document.querySelector('.overlay-off');

    const navBtns = () => document.querySelectorAll('.nav-btn');

    const sectionContainer = () => document.querySelector('.section-wrapper');
    const section = () => document.querySelector('.section');
    const sectionHeading = () => document.querySelector('.section-heading');
    const todoList = () => document.querySelector('section ul');
    const li = () => document.querySelector('li');
    const lis = () => [...document.querySelectorAll('[data-id]')];
    const deleteTaskBtns = () => document.querySelectorAll('.delete-task-btn');
    const editTaskBtns = () => document.querySelectorAll('.edit-task-btn');

    const buttonFormContainer = () => document.querySelector('.button-form-container');
    const btnAddTask = () => document.querySelector('.add-task-btn');
    const taskForm = () => document.querySelector('.task-form');
    const inputTitle = () => document.querySelector('input[type="text"]');
    const taskDescTextarea = () => document.querySelector('.task-form textarea');

    const dueDate = () => document.querySelector('#dueDate');
    const btnAddTaskForm = () => document.querySelector('.task-form-add-btn');
    const btnCancelForm = () => document.querySelector('.task-form-cancel-btn');
    
    const pageWrapper = () => document.querySelector('.page-wrapper');
    const modal = () => document.querySelector('.modal');
    const editForm = () => document.querySelector('.edit-task');
    const editFormTitle = () => document.querySelector('.edit-task input[type="text"]');
    const editFormDescription = () => document.querySelector('.edit-task textarea');
    const editFormCalendar = () => document.querySelector('.edit-task input[type="date"');
    const editFormSelect = () => document.querySelector('.edit-task #priority');
    const editFormCloseBtn = () => document.querySelector('.edit-task-cancel-btn');
    const editFormSubmitBtn = () => document.querySelector('.edit-task-add-btn');
    const popup = () => document.querySelector('.popup');
    const popupCancelBtn = () => document.querySelector('.popup-cancel-btn');
    const popupDiscardBtn = () => document.querySelector('.popup-discard-btn');

    return {
        sideBarContainer,
        sideBar,
        navBar,
        sideBarButton,
        sideBarButtonContainer,
        overlay,
        overlayOff,
        navBtns,
        sectionContainer,
        section,
        sectionHeading,
        todoList,
        li,
        lis,
        deleteTaskBtns,
        editTaskBtns,
        buttonFormContainer,
        btnAddTask,
        taskForm,
        dueDate,
        inputTitle,
        taskDescTextarea,
        btnAddTaskForm,
        btnCancelForm,
        pageWrapper,
        modal,
        editForm,
        editFormTitle,
        editFormDescription,
        editFormCalendar,
        editFormSelect,
        editFormCloseBtn,
        editFormSubmitBtn,
        popup,
        popupCancelBtn,
        popupDiscardBtn,
    };
}

export const cachedElements = cacheElements();