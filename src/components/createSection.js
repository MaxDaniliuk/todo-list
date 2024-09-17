import { cachedElements } from "./cacheElements";
import { createButton } from "./commonFn";
import { setSectionType } from "./tasks";

// section-related
export function createSection(sectionName = 'inbox') {
    const section = document.createElement('section');
    section.classList.add('section', `${sectionName}-section`);
    section.appendChild(getSectionHeader(sectionName));
    // append ul instead of a todoListContainer
    section.appendChild(createTodoList(sectionName));
    setSectionType(sectionName);
    return section;
}

// section-related
function getSectionHeader(sectionHeader) {
    const currentSectionHeader = document.createElement('header');
    currentSectionHeader.classList.add('section-header')
    const sectionHeading = document.createElement('h1');
    sectionHeading.classList.add('section-heading');
    sectionHeading.textContent = `${(sectionHeader.substring(0, 1)).toUpperCase()}${sectionHeader.slice(1)}`;
    currentSectionHeader.appendChild(sectionHeading);
    
    const buttonFormContainer = document.createElement('div');
    buttonFormContainer.classList.add('button-form-container');
    buttonFormContainer.appendChild(createButton({"btnName": "+ Add task", "classList": ["btn", "add-task-btn"]}));
    

    currentSectionHeader.appendChild(buttonFormContainer);
    return currentSectionHeader;
}

function createTodoList(listType) {
    const todoList = document.createElement('ul');
    todoList.classList.add(`${listType}-list`);
    return todoList;
}

export function switchSection(sectionType) {
    cachedElements.section().remove();
    let newSection = null; 
    if (sectionType !== undefined) {
        newSection = createSection(sectionType)
    } else {
        newSection = createSection();
    }
    cachedElements.sectionContainer().appendChild(newSection);
}