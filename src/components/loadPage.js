import createSideBar from "./sidebar";
import createHeader from "./header";
import createContentWrapper from "./contentWrapper";
import { openCloseSideBar } from "./eventListeners";

export default function loadPage() {
    const content = document.querySelector('.page-wrapper');
    content.appendChild(createSideBar());
    content.appendChild(wrapPageContent());
    openCloseSideBar();
}

function wrapPageContent() {
    const pageContentWrapper = document.createElement('div');
    pageContentWrapper.classList.add('header-content-block');
    pageContentWrapper.appendChild(createHeader());
    pageContentWrapper.appendChild(createContentWrapper())
    return pageContentWrapper;
}