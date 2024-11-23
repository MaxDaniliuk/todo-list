function cacheElements() {

    const sideBarContainer = () => document.querySelector('.sidebar-container');
    const sideBar = () => document.querySelector('.sidebar-block');
    const navBar = () => document.querySelector('.nav');
    const sideBarButton = () => document.querySelector('.open-close-btn');
    const sideBarButtonContainer = () => document.querySelector('.sidebar-block > div:first-of-type');
    const overlay = () => document.querySelector('.overlay');
    const overlayOff = () => document.querySelector('.overlay-off');

    const navBtns = () => document.querySelectorAll('.nav-btn');
    const tabOpenLi = () => document.querySelector('.tab-open');
    const navSectionBtnLi = (dataset) => document.querySelector(`[data-inner-type="${dataset}"]`).closest('li'); 

    const sectionContainer = () => document.querySelector('.section-wrapper');
    const mainSection = () => document.querySelector('.section-wrapper > .section');
    const section = () => document.querySelector('.section');
    const sectionHeader = () => document.querySelector('.section-header');
    const sectionHeading = () => document.querySelector('.section-heading');
    const todoList = () => document.querySelector('.section ul');
    const closestTodoList = (section) => section.querySelector('ul');
    const subTodoList = (subSection) => subSection.querySelector('.sub-section ul');
    const subTodoLists = () => document.querySelectorAll('.sub-section ul');
    const overdueList = () => document.querySelector('.overdue');
    const overdueUl = () => document.querySelector('.overdue-list');
    const subSectionHeading = (subSection) => subSection.querySelector('.section-heading');
    const subSectionBtnForm = () => document.querySelector('.sub-section .button-form-container'); 
    const li = () => document.querySelector('li');
    const lis = () => [...document.querySelectorAll('[data-id]')];
    const subUl = (li) => li.querySelector('ul'); 
    const deleteTaskBtns = () => document.querySelectorAll('.delete-task-btn');
    const deleteTaskBtnSpan = (deleteBtn) => deleteBtn.querySelector('.delete-btn-bg');
    const editTaskBtns = () => document.querySelectorAll('.edit-task-btn');

    const buttonFormContainer = () => document.querySelector('.button-form-container');
    const buttonFormContinaers = () => document.querySelectorAll('.button-form-container');
    const btnsAddTask = () => document.querySelectorAll('.add-task-btn');
    const taskForm = () => document.querySelector('.task-form');
    const taskForms = () => document.querySelectorAll('.task-form');
    const inputTitles = () => document.querySelectorAll('input[type="text"]');
    const taskDescTextarea = () => document.querySelector('.data-form textarea');

    const dueDate = () => document.querySelector('#dueDate');
    const subTaskDueDate = (li) => li.querySelector('.optional-info span');
    const taskDescriptionPs = () => document.querySelectorAll('.optional-info p');
    const currentTaskDescriptionP = (li) => li.querySelector('.optional-info p');
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

    const projectsContainer = () => document.querySelector('.projects-container');
    const addProjectFormBlock = () => document.querySelector('.add-project-block');
    const addProjectBtn = () => document.querySelector('.add-project-btn');
    const projectFormContainer = () => document.querySelector('.project-form-container');
    const createProjectBtn = () => document.querySelector('.create-project-btn');
    const cancelPojectBtn = () => document.querySelector('.cancel-project-btn');
    const projectsList = () => document.querySelector('.projects-list');
    const projectTitle = () => document.querySelector('#projectTitle');

    const projectBtns = () => document.querySelectorAll('.project-btn');
    const removeProjectBtns = () => document.querySelectorAll('.project-delete-btn');
    const taskCounts = () => document.querySelectorAll('.task-count');
    const dropDownBtn = () => document.querySelector('.project-drop-down-btn');

    const draggableListItems = () => [...document.querySelectorAll('.draggable')];
    const notDraggableListItems = () => [...document.querySelectorAll('.draggable:not(.dragging)')];
    const draggingItem = () => document.querySelector('.dragging');
    const dropzoneUlLists = () => [...document.querySelectorAll('.dropzone')];
    return {
        sideBarContainer,
        sideBar,
        navBar,
        sideBarButton,
        sideBarButtonContainer,
        overlay,
        overlayOff,
        navBtns,
        tabOpenLi,
        navSectionBtnLi,
        sectionContainer,
        mainSection,
        section,
        sectionHeader,
        sectionHeading,
        todoList,
        closestTodoList,
        subTodoList,
        subTodoLists,
        overdueList,
        overdueUl,
        subSectionHeading,
        subSectionBtnForm,
        li,
        lis,
        subUl,
        deleteTaskBtns,
        deleteTaskBtnSpan,
        editTaskBtns,
        buttonFormContainer,
        buttonFormContinaers,
        btnsAddTask,
        taskForm,
        taskForms,
        dueDate,
        subTaskDueDate,
        taskDescriptionPs,
        currentTaskDescriptionP,
        inputTitles,
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
        projectsContainer,
        addProjectFormBlock,
        addProjectBtn,
        projectFormContainer,
        createProjectBtn,
        cancelPojectBtn,
        projectsList,
        projectTitle,
        projectBtns,
        dropDownBtn,
        removeProjectBtns,
        taskCounts,
        draggableListItems,
        notDraggableListItems,
        draggingItem,
        dropzoneUlLists
    };
}

export const cachedElements = cacheElements();