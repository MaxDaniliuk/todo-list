import { cachedElements } from "./cacheElements";
import * as eventHandler from "./eventListeners";
import { isOverdueSectionEmpty } from "./createSection";
import { storageModerator } from "./tasks";

const draggedElement = (function() {
    let draggedItem = null;
    const getDraggedEl = () => draggedItem;
    const setDraggedEl = (newItem) => draggedItem = newItem;
    const resetDraggedEl = () => draggedItem = null;

    return { getDraggedEl, setDraggedEl, resetDraggedEl };
})();


export function handleDragStart(e) {
    this.classList.add('dragging');
    this.style.opacity = "0.2";

    draggedElement.setDraggedEl(this);
    e.dataTransfer.clearData();
    e.dataTransfer.effectAllowed = 'move';
}

export function handleDragEnd(e) {
    this.classList.remove('dragging');
    this.style.opacity = "1";
    cachedElements.draggableListItems().forEach((liItem) => {
        liItem.classList.remove('over');
    });
    cachedElements.dropzoneUlLists().forEach((dropzone) => {
        dropzone.classList.remove('over-dropzone');
    });
    draggedElement.resetDraggedEl();
}

export function handleItemDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (this !== draggedElement.getDraggedEl()) {
        this.classList.add('over'); 
    }
    // make dragover react to copy size not mouse cursor
    return false;
}

export function handleDragEnter(e) {
    if (this !== draggedElement.getDraggedEl()) {
        this.classList.add('over');
    }
}

export function handleDragLeave(e) {
    if (!this.contains(e.relatedTarget)) {
        this.classList.remove('over');
    }
}

export function handleItemDrop(e) {
    e.preventDefault();
    if (e.stopPropagation) {
        e.stopPropagation(); 
    }
    
    const draggedEl = draggedElement.getDraggedEl();
    const draggedElLocation = draggedEl.parentNode;
    const dropzone = this.parentNode;

    if (dropzone.dataset.overdue && dropzone !== draggedElLocation) return;

    const dropTargetOffset = e.clientY;
    
    const {
        top,
        height
    } = this.getBoundingClientRect();
    const dropTargetTopOffset = top + height / 2;

    if (dropTargetOffset < dropTargetTopOffset) {
        this.insertAdjacentElement("beforebegin", draggedEl);
    } else if (dropTargetOffset > dropTargetTopOffset) {
        this.insertAdjacentElement("afterend", draggedEl);
    }
   
    if (dropzone !== draggedElLocation) {
        if (dropzone.dataset.date) {
            updateTaskDate(draggedEl, dropzone);
        }
        isOverdueSectionEmpty();
    }
    return false;
}

export function handleDropzoneDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

export function handleDropzoneDrop(e) {
    e.preventDefault();
    
    if (e.stopPropagation) {
        e.stopPropagation(); 
    }
    if (e.currentTarget.children.length === 0) {
        e.currentTarget.appendChild(draggedElement.getDraggedEl());
        updateTaskDate(draggedElement.getDraggedEl(), this);
        return;
    }
    return false;
}

// updateTaskDate(draggedEl.dataset.id, dropzone.dataset.date);

function updateTaskDate(draggedEl, dropzone) {
    let taskId = draggedEl.dataset.id;
    let newDate = dropzone.dataset.date;
    let dueDate = cachedElements.subTaskDueDate(draggedEl);
    dueDate.textContent = newDate;
    storageModerator.getEditedTask(taskId)["due_date"] = newDate;
}

export function handleDropAreaDragOver(e) {
    e.preventDefault();
    const dropzone = cachedElements.subUl(this);
    
    if (dropzone.children.length === 0) {
        console.log('over')
        dropzone.classList.add('over-dropzone');
    }
}
// 

export function handleDropAreaDragLeave(e) {
    
    const dropzone = cachedElements.subUl(this);
    if (!dropzone.contains(e.relatedTarget)) {
        if (dropzone.children.length === 0) {
            console.log('called');
            dropzone.classList.remove('over-dropzone');
        }
    }
    return false;
}
