function cacheElements() {

    const sideBarContainer = () => document.querySelector('.sidebar-container');
    const sideBar = () => document.querySelector('.sidebar-block');
    const navBar = () => document.querySelector('.nav');
    const sideBarButton = () => document.querySelector('.open-close-btn');
    const sideBarButtonContainer = () => document.querySelector('.sidebar-block > div:first-of-type');
    const overlay = () => document.querySelector('.overlay');
    const overlayOff = () => document.querySelector('.overlay-off');

    const inboxBtn = () => document.querySelector('.inbox-btn');

    const sectionHeading = () => document.querySelector('.section-heading');
    const todoListContainer = () => document.querySelector('.todo-container');
    const inboxList = () => document.querySelector('.todo-list');
    const li = () => document.querySelector('li');
    const deleteTaskBtns = () => document.querySelectorAll('.delete-task-btn');


    const buttonFormContainer = () => document.querySelector('.button-form-container');
    const btnAddTask = () => document.querySelector('.add-task-btn');
    const taskForm = () => document.querySelector('.task-form');
    const inputTitle = () => document.querySelector('input[type="text"]');
    const taskDescTextarea = () => document.querySelector('.task-form textarea');
    const dueDate = () => document.querySelector('#dueDate');
    const btnAddTaskForm = () => document.querySelector('.form-add-task-btn');
    const btnCancelForm = () => document.querySelector('.form-cancel-btn');
    

    return {
        sideBarContainer,
        sideBar,
        navBar,
        sideBarButton,
        sideBarButtonContainer,
        overlay,
        overlayOff,
        inboxBtn,
        sectionHeading,
        todoListContainer,
        inboxList,
        li,
        deleteTaskBtns,
        buttonFormContainer,
        btnAddTask,
        taskForm,
        dueDate,
        inputTitle,
        taskDescTextarea,
        btnAddTaskForm,
        btnCancelForm,
    };
}

export const cachedElements = cacheElements();