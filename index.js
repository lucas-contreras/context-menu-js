console.log('hello');

let prevRange;

// only for mozilla
function forceHightLight() {
    setTimeout(function() {
        if (prevRange) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(prevRange);
        }
    }, 0);
}

function openAndFocus() {    
    const range = window.getSelection().getRangeAt(0);
    const hasSelected = Math.abs(range.endOffset - range.startOffset) > 0;
    const contextMenu = document.querySelector('.context-menu-list');

    if (hasSelected && contextMenu) {
        contextMenu.classList.remove('close');
        contextMenu.classList.add('open');

        contextMenu.querySelector('li > button').focus();
        prevRange = range;
        forceHightLight();
    }
}

function onDocumentContextMenu(e) {
    e.preventDefault();

    openAndFocus();

    return false;
}

function onDocumentMouseDown(e) {
    const contextMenu = document.querySelector('.context-menu-list');

    const isInside = e.composedPath().includes(contextMenu);
    if (!isInside && prevRange) {
        contextMenu.classList.remove('open');
        contextMenu.classList.add('close');

        prevRange = undefined;
    }
}

function onDocumentMouseUp(e) {
    openAndFocus();
}

function onDocumentKeyUp(e) {
    if (e.key === 'Shift') {
        openAndFocus();
    }
}

function onMenuKeyDown(e) {
    const contextMenu = document.querySelector('.context-menu-list');
    const buttons = contextMenu.querySelectorAll('button');

    const currentIndex = Array.from(buttons).indexOf(document.activeElement);

    
    switch(e.key) {
        case 'ArrowUp': {
            e.preventDefault();
            forceHightLight();
            
            const index = currentIndex - 1;
            if (index < 0) {
                buttons.item(buttons.length - 1).focus();
                return;
            }

            buttons.item(index).focus();
            break;
        }
        case 'ArrowDown': {
            e.preventDefault();
            forceHightLight();

            if (currentIndex + 1 === buttons.length) {
                buttons.item(0).focus();
                return;
            }

            buttons.item(currentIndex + 1).focus();
            break;
        }
        case 'Escape': {
            e.preventDefault();
            contextMenu.classList.remove('open');
            contextMenu.classList.add('close');
            break;
        }
        default: {

            break;
        }
    }
}

function onWindowsLoad(e) {
    document.addEventListener('contextmenu', onDocumentContextMenu);
    document.addEventListener('mousedown', onDocumentMouseDown);
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('keyup', onDocumentKeyUp);

    const contextMenu = document.querySelector('.context-menu-list');
    contextMenu.classList.add('close');

    contextMenu.addEventListener('keydown', onMenuKeyDown, {
        capture: true,
    });
}

window.addEventListener('load', onWindowsLoad);

