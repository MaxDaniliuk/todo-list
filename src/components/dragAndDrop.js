// https://stackoverflow.com/questions/44920180/drag-li-between-two-ul-js-without-jquery

// applies to li
import { cachedElements } from "./cacheElements";
import * as eventHandler from "./eventListeners";
import { isOverdueSectionEmpty } from "./createSection";

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
    
    // console.log(this, 'start dragging')
    //
}

export function handleDragEnd(e) {
    this.classList.remove('dragging');
    this.style.opacity = "1";
    cachedElements.draggableListItems().forEach((liItem) => {
        liItem.classList.remove('over');
    });

}

export function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // this.classList.add('over'); 
    //Fires lots of time...
    return false;
}

export function handleDragEnter(e) {
    this.classList.add('over');
}

export function handleDragLeave(e) {
    this.classList.remove('over');
}

export function handleItemDrop(e) {
    e.preventDefault();

    if (e.stopPropagation) {
        e.stopPropagation(); 
    }
    
    const draggedEl = draggedElement.getDraggedEl();
    const draggedElLocation = draggedEl.parentNode;
    const dropTargetOffset = e.clientY;
    const dropzone = this.parentNode;
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
            let dueDate = cachedElements.subTaskDueDate(draggedEl);
            dueDate.textContent = dropzone.dataset.date;
            
        }
        isOverdueSectionEmpty();
    }
    return false;
}

export function handleDropzoneDrop(e) {
    e.preventDefault();
    
    if (e.stopPropagation) {
        e.stopPropagation(); 
    }

    if (e.currentTarget.children.length === 0) {
        e.currentTarget.appendChild(draggedElement.getDraggedEl());
        console.log('dropzone drop fn call')
        return;
    }
    return false;
}
