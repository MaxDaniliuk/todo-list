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
    const sectionHeader = () => document.querySelector('.section-header');
    const sectionHeading = () => document.querySelector('.section-heading');
    const todoList = () => document.querySelector('.section ul');
    const closestTodoList = (section) => section.querySelector('ul');
    const subTodoList = (subSection) => subSection.querySelector('.sub-section ul');
    const subTodoLists = () => document.querySelectorAll('.sub-section ul');
    const overdueList = () => document.querySelector('.overdue');
    const subSectionHeading = (subSection) => subSection.querySelector('.section-heading');
    const subSectionBtnForm = () => document.querySelector('.sub-section .button-form-container'); 
    const li = () => document.querySelector('li');
    const lis = () => [...document.querySelectorAll('[data-id]')];
    const subUl = (li) => li.querySelector('ul'); 
    const deleteTaskBtns = () => document.querySelectorAll('.delete-task-btn');
    const editTaskBtns = () => document.querySelectorAll('.edit-task-btn');

    const buttonFormContainer = () => document.querySelector('.button-form-container');
    const buttonFormContinaers = () => document.querySelectorAll('.button-form-container');
    const btnsAddTask = () => document.querySelectorAll('.add-task-btn');
    const taskForm = () => document.querySelector('.task-form');
    const taskForms = () => document.querySelectorAll('.task-form');
    const inputTitle = () => document.querySelector('input[type="text"]');
    const taskDescTextarea = () => document.querySelector('.task-form textarea');

    const dueDate = () => document.querySelector('#dueDate');
    const subTaskDueDate = (li) => li.querySelector('.optional-info span');
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
        sectionHeader,
        sectionHeading,
        todoList,
        closestTodoList,
        subTodoList,
        subTodoLists,
        overdueList,
        subSectionHeading,
        subSectionBtnForm,
        li,
        lis,
        subUl,
        deleteTaskBtns,
        editTaskBtns,
        buttonFormContainer,
        buttonFormContinaers,
        btnsAddTask,
        taskForm,
        taskForms,
        dueDate,
        subTaskDueDate,
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