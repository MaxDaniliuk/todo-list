import createSideBar from "./sidebar";
import { createSection } from "./createSection.js" 

export default function loadPage() {
    loadContent();
}

function loadContent() {
    const content = document.querySelector('.page-wrapper');
    content.appendChild(sideBarContainer());
    content.appendChild(wrapPageContent());
    content.appendChild(createOverlay());
}

// Sidebar-related elements
function sideBarContainer() {
    const sideBarContainer = document.createElement('div');
    sideBarContainer.classList.add("sidebar-container");
    sideBarContainer.appendChild(createSideBar());
    return sideBarContainer;
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add("overlay");
    return overlay;
}

// Content wrapper
function wrapPageContent() {
    const pageContentWrapper = document.createElement('div');
    pageContentWrapper.classList.add("header-content-block");
    pageContentWrapper.appendChild(createHeader());
    pageContentWrapper.appendChild(createSectionContent())
    return pageContentWrapper;
}

// Page header
// Do I need a header at all? If it will contain only an image => replace header with a div.
function createHeader() { // 
    const header = document.createElement('header'); // 'div'
    header.classList.add('header');
    // Add App image or main TEXT like 'Doer's List'
    const heading = document.createElement('h1'); //
    heading.textContent = `Doer's List`             // Code for img
    header.appendChild(heading);                  //
    return header;
}

// Tasks-related elements 
function createSectionContent() {
    const sectionWrapper = document.createElement('div');
    sectionWrapper.classList.add('section-wrapper');
    // Here is a part that should display content - inbox, today etc
    sectionWrapper.appendChild(createSection());
    //
    return sectionWrapper;
}

// // section-related
// function createSection() {
//     const openedSection = document.createElement('section');
//     openedSection.appendChild(getSectionHeader());
//     // append ul instead of a todoListContainer
//     openedSection.appendChild(createTodoListContainer());
//     return openedSection;
// }

// // section-related
// function getSectionHeader() {
//     const currentSectionHeader = document.createElement('header');
//     currentSectionHeader.classList.add('section-header')
//     const sectionHeading = document.createElement('h1');
//     sectionHeading.classList.add('section-heading');
//     sectionHeading.textContent = "Inbox";
//     currentSectionHeader.appendChild(sectionHeading);
    
//     const buttonFormContainer = document.createElement('div');
//     buttonFormContainer.classList.add('button-form-container');
//     buttonFormContainer.appendChild(createButton({"btnName": "+ Add task", "classList": ["btn", "add-task-btn"]}));
    

//     currentSectionHeader.appendChild(buttonFormContainer);
//     return currentSectionHeader;
// }

// // section-related
// function createTodoListContainer() {
//     const todoContainer = document.createElement('div');
//     todoContainer.classList.add('todo-container');
//     todoContainer.appendChild(createTodoList());
//     return todoContainer;
// }