import { cachedElements } from "./cacheElements";
import { createButton, toggleCssClass } from "./commonFn";
import { tasksStorage, selectCurrentWeekDays } from "./tasks";
import { displayThisWeekTasks } from "./taskUI";
import { format, isToday, isTomorrow} from "date-fns";


export function createSection(sectionName = 'inbox') {
    const section = document.createElement('section');
    section.classList.add('section', `${sectionName}-section`);
    section.appendChild(getSectionHeader(sectionName));
    section.appendChild(createTodoList(sectionName));
    return section;
}

function getSectionHeader(sectionHeader) {
    const currentSectionHeader = document.createElement('header');
    currentSectionHeader.classList.add('section-header')
    const sectionHeading = document.createElement('h1');
    sectionHeading.classList.add('section-heading');
    if (sectionHeader === 'week') {
        sectionHeading.textContent = `This ${(sectionHeader.substring(0, 1)).toUpperCase()}${sectionHeader.slice(1)}`;
    } else {
        sectionHeading.textContent = `${(sectionHeader.substring(0, 1)).toUpperCase()}${sectionHeader.slice(1)}`;
    }
    currentSectionHeader.appendChild(sectionHeading);

    currentSectionHeader.appendChild(createButtonFormContainer());
    return currentSectionHeader;
}

function createButtonFormContainer() {
    const buttonFormContainer = document.createElement('div');
    buttonFormContainer.classList.add('button-form-container');
    buttonFormContainer.appendChild(createButton({"btnName": "+ Add task", "classList": ["btn", "add-task-btn"]}));
    return buttonFormContainer;
}

function createTodoList(listType) {
    const todoList = document.createElement('ul');
    todoList.classList.add(`${listType}-list`);
    return todoList;
}

export function switchSection(sectionType) {
    cachedElements.section().remove();
    let newSection = null; 
    if (sectionType === 'inbox' || sectionType === 'today' || sectionType === 'week') {
        newSection = createSection(sectionType);
    }
    cachedElements.sectionContainer().appendChild(newSection);
}

export function customiseWeekSection() {
    cachedElements.buttonFormContainer().remove();
    createThisWeekSection();
}

function createThisWeekSection() {
    const currentWeekDays = selectCurrentWeekDays();
    const weekCalendar = document.createElement('div');
    weekCalendar.classList.add('dates-container');
    
    let overdueSectionNeeded = false;
    for (let i = 0; i < currentWeekDays.length; i++) {
        let deicticDayTerm = '';
        if ((format(currentWeekDays[i], 'yyyy-MM-dd') < format(new Date(), 'yyyy-MM-dd'))) {
            deicticDayTerm = 'day-before';
            createDaySection(currentWeekDays[i] ,'Overdue', overdueSectionNeeded);
            if (overdueSectionNeeded === false) {
                overdueSectionNeeded = true;
                cachedElements.subSectionBtnForm().remove();
            }
        } else {
            overdueSectionNeeded = false;
            let subSectionHeading = format(currentWeekDays[i], "d MMM ‧ EEEE");
            if (isToday(currentWeekDays[i])) {
                deicticDayTerm = 'current-day'
                subSectionHeading = `${format(currentWeekDays[i], "d MMM")} ‧ Today ‧ ${format(currentWeekDays[i], "EEEE")}`;
            } else if (isTomorrow(currentWeekDays[i])) {
                subSectionHeading = `${format(currentWeekDays[i], "d MMM")} ‧ Tomorrow ‧ ${format(currentWeekDays[i], "EEEE")}`;
            } 
            createDaySection(currentWeekDays[i] ,subSectionHeading);
        }
        weekCalendar.appendChild(createWeekCalendar(deicticDayTerm, currentWeekDays[i]));
    }
    cachedElements.sectionHeader().appendChild(weekCalendar);
}

function createDaySection(dayDate, headingName, overdueSectionNeeded = false) {
    if (!overdueSectionNeeded) {
        let daySectionContainer = document.createElement('li');
        let subSection = createSection(`${format(dayDate, "d")}-day`);
        toggleCssClass(subSection, 'sub-section', 'section');
        cachedElements.subSectionHeading(subSection).textContent = headingName;
        if (headingName === 'Overdue') {
            toggleCssClass(subSection, headingName.toLowerCase(), `${format(dayDate, "d")}-day-section`);
            toggleCssClass(cachedElements.subTodoList(subSection), `${headingName.toLowerCase()}-list`, `${format(dayDate, "d")}-day-list`)
        }
        daySectionContainer.appendChild(subSection)
        cachedElements.todoList().appendChild(daySectionContainer);
        displayThisWeekTasks(format(dayDate, 'yyyy-MM-dd'), cachedElements.subTodoList(subSection));
    }
}

function createWeekCalendar(deicticDayTerm, dayDate) {
    let dayContainer = document.createElement('span');
    dayContainer.classList.add('day-date');
    if (deicticDayTerm !== '') dayContainer.classList.add(deicticDayTerm);
    const dayName = document.createElement('span');
    dayName.textContent = format(dayDate, "E");
    const dayNumber = document.createElement('span');
    dayNumber.textContent = format(dayDate, "d");
    dayContainer.appendChild(dayName);
    dayContainer.appendChild(dayNumber);
    return dayContainer;
}


