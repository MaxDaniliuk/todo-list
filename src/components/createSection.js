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

//Now, addTask and form changes as I click between sections
// export function changeTodoListDisplay(sectionName) {
//     cachedElements.todoList().remove();
//     cachedElements.todoListContainer().appendChild(createTodoList(sectionName));
// }

// Now, do you need it? No, as I will be passing
// section type to section that will be passed
// further down 
// export function setSectionHeading(headingName) {
//     cachedElements.sectionHeading().innerHTML = headingName;
// }

export function displayTask(taskObj) {
    const li = document.createElement('li');
    li.dataset.id = taskObj["taskId"];
    const firstBlock = document.createElement('div');
    const secondBlock = document.createElement('div');

    const btnContainer = document.createElement('div');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'delete-task-btn');
    deleteButton.style.borderColor = getPriorityColor(taskObj["priority"]);
    const buttonBg = document.createElement('span');
    buttonBg.classList.add('delete-btn-bg', taskObj["priority"].toLowerCase());
    deleteButton.appendChild(buttonBg);
    // Can also adjust background-color + opacity / alpha color
    btnContainer.appendChild(deleteButton);
    
    const titleEditContainer = document.createElement('div');
    titleEditContainer.classList.add('task-info-container');
    const title = document.createElement('p');
    title.textContent = taskObj["title"];
    const spanEdit = document.createElement('span');
    spanEdit.textContent = "Edit"
    titleEditContainer.appendChild(title);
    titleEditContainer.appendChild(spanEdit);

    firstBlock.appendChild(btnContainer);
    firstBlock.appendChild(titleEditContainer);

    const description = document.createElement('p');
    description.textContent = taskObj["description"];
    const dueDate = document.createElement('span');
    dueDate.textContent = taskObj["due_date"];

    secondBlock.appendChild(description);
    secondBlock.appendChild(dueDate);

    li.appendChild(firstBlock);
    li.appendChild(secondBlock);
    return li;
}

function getPriorityColor(taskPriority) {
    return taskPriority === "Urgent" ? "#a62c2b" : 
           taskPriority === "High" ? "#fdcc0d" : 
           taskPriority === "Normal" ? "#32527b" : 
           "#a0a1a1"; 
}