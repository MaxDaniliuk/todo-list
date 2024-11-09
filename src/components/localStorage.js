import { recreateProjectNavBars } from "./sidebar.js";

export function storeDataLocally(inbox) {
    localStorage.setItem("todos", JSON.stringify(inbox));
    console.log(JSON.parse(localStorage.getItem("todos")), 'Shows storage');
}

export function getDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem("todos"));
}

export function extractProjectSections() {
    const storedSectionsDetails = [];
    const storedTodos = getDataFromLocalStorage();
    if (storedTodos && storedTodos.length !== 0) {
        for (let i = 0; i < storedTodos.length; i++) {
            if (storedTodos[i].hasOwnProperty("projectId")) {
                if (storedSectionsDetails.length === 0) {
                    storedSectionsDetails.push({
                        "projectId": storedTodos[i]["projectId"],
                        "project": storedTodos[i]["project"]
                    });
                } else if (storedSectionsDetails.length !== 0 && 
                           !storedSectionsDetails.some(obj => obj["projectId"] === storedTodos[i]["projectId"])
                ) {
                    storedSectionsDetails.push({
                        "projectId": storedTodos[i]["projectId"],
                        "project": storedTodos[i]["project"]
                    });
                }
            }
        }
    }
    return storedSectionsDetails;
}

export function checkStorageForProjects() {
    let sections = extractProjectSections();
    if (sections.length !== 0) {
        sections.forEach(section => recreateProjectNavBars(section));
    }
}

export function storeDnDPositionLocally(dropzoneList) {
    localStorage.setItem("DnDposition", JSON.stringify(dropzoneList));
}

export function getDnDPositions() {
    return JSON.parse(localStorage.getItem("DnDposition"));
}

