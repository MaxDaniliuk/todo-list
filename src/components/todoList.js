import { cachedElements } from "./cacheElements";

export function createTodoList(listType = 'inbox') {
    const todoList = document.createElement('ul');
    todoList.classList.add('todo-list', listType.toLowerCase());
    return todoList;
}

export function changeTodoListDisplay(sectionName) {
    cachedElements.todoList().remove();
    cachedElements.todoListContainer().appendChild(createTodoList(sectionName));
}

export function setSectionHeading(headingName) {
    cachedElements.sectionHeading().innerHTML = headingName;
}

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