// Fit to artboard
function fitToArtboard(selection) {
    moveAndResize(selection)
}

// Fit to artboard height
function fitToArtboardHeight(selection) {
    moveAndResize(selection, 'height')
}

// Fit to artboard width
function fitToArtboardWidth(selection) {
    moveAndResize(selection, 'width')
}

// Resize and move
function moveAndResize(selection, command) {

    // If no selection
    if (0 === selection.length) {
        console.error('No elements selected.')
        return false;
    
    // If objects selected
    } else {

        // Get the focussed artboard
        const artboard = selection.focusedArtboard;

        // If there is no parent artboard
        if (0 === selection.focusedArtboard.length) {
            console.error('The object isn\'t on an Artboard');
            return false;

        // If there is a parent artboard
        } else {

            // Iterate through the selection
            selection.items.forEach(function (obj) {

                // Get each items details
                const bounds = obj.boundsInParent;

                // Move the item *before* resizing to calculate positions
                move(obj, bounds, command);

                // Resize nased on the command
                // (and it needed to avoid multiple undo entries)
                switch(command) {

                    // Reisze the width
                    case 'width': {
                        if (bounds.width !== artboard.width || bounds.x !== 0) {
                            resize(obj, artboard.width, bounds.height);
                        }
                        break; 
                    }

                    // Resize the height
                    case 'height': {
                        if (bounds.height !== artboard.height || bounds.y !== 0) {
                            resize(obj, bounds.width, artboard.height);
                        }
                        break; 
                    }

                    // Resize both
                    default: {
                        if ((bounds.width !== artboard.width || bounds.height !== artboard.height) || (bounds.x !== 0 || bounds.y !== 0)) {
                            resize(obj, artboard.width, artboard.height);
                        }
                        break; 
                    }
                }
            });
        }
    }
}

// Move based on the type of element
function move(obj, originalBounds, command) {
    const originalWidth = originalBounds.width;
    let offsetX;
    let offsetY;
    let x;
    let y;

    // Calculate offsets based on the direction of resize
    switch(command) {
        case 'width': {
            offsetX = -originalBounds.x;
            offsetY = 0;
            break;
        }
        case 'height': {
            offsetX = 0;
            offsetY = -originalBounds.y;
            break;
        }
        default: {
            offsetX = -originalBounds.x;
            offsetY = -originalBounds.y;
            break;
        }
    }

    // Calculate offsets based on the text alignment as the anchor point is different
    // https://adobexdplatform.com/plugin-docs/reference/scenegraph.html#texttextalign--string
    switch(obj.textAlign) {
        case 'center': {
            x = offsetX - originalWidth/2;
            y = offsetY;
            break;
        }
        case 'right': {
            x = offsetX - originalWidth;
            y = offsetY;
            break;
        }
        default: {
            x = offsetX;
            y = offsetY;
            break;
        }
    }

    // Move the element by relative pixels
    obj.moveInParentCoordinates(x, y);
}

// Resize the object
function resize(obj, newWidth, newHeight) {

    // IF it's text
    if (obj.constructor.name === 'Text') {

        // Change from point text and resize
        obj.areaBox = {
            width: newWidth,
            height: newHeight
        }
    
    // If it's anything else
    } else {

        // Resize as normal
        obj.resize(newWidth, newHeight);
    }
}

module.exports = {
    commands: {
        "FitToArtboardHeight": fitToArtboardHeight,
        "FitToArtboardWidth": fitToArtboardWidth,
        "FitToArtboard": fitToArtboard,
    }
};
