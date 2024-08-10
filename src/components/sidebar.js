import createButton from "./createButton";

export default function createSideBar() {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar-block');
    sidebar.appendChild(createOpenCloseBtn());
    sidebar.appendChild(createNavBar());
    return sidebar;
}

function createNavBar() {
    const nav = document.createElement('nav');
    nav.classList.add('nav');
    nav.appendChild(createNavBtnsContainer());
    return nav;
}

function getNavBtnDetails() {
    const navBarComponents = {
        "inbox": {
            "btnName": "Inbox",
            "classList": ["btn", "inbox-btn"],
        },
        "today": {
            "btnName": "Today",
            "classList": ["btn", "today-btn"],
        },
        "upcoming": {
            "btnName": "Upcoming",
            "classList": ["btn", "upcoming-btn"],
        },
    };
    return navBarComponents;
}

function createNavBtnsContainer() {
    const navBtnComponents = getNavBtnDetails();
    const navUlContainer = document.createElement('div');
    navUlContainer.classList.add('btns-wrapper');
    const ul = document.createElement('ul');
    ul.classList.add('nav-list');

    Object.keys(navBtnComponents).forEach(navBtnComponent => {
        let liElement = document.createElement('li');
        liElement.appendChild(createButton(navBtnComponents[navBtnComponent]))
        ul.appendChild(liElement);
    });
    navUlContainer.appendChild(ul);
    return navUlContainer;
}

function createOpenCloseBtn() {
    let div = document.createElement('div');
    div.appendChild(createButton({"btnName": "O/C", "classList": ["btn", "open-close-btn"]}));
    return div;
}

export {
    createNavBar,
    createOpenCloseBtn,
};