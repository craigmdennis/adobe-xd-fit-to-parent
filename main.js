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

        if (0 === selection.focusedArtboard.length) {
            console.error('The object isn\'t on an Artboard');
            return false;

        } else {
            selection.items.forEach(function (obj) {
                const bounds = obj.boundsInParent;

                switch(command) {
                    case 'width': {
                        if (bounds.width !== artboard.width || bounds.x !== 0) {

                            // Move X not Y
                            moveX(obj, bounds);
                            resize(obj, artboard.width, bounds.height);
                        }
                        break; 
                    }
                    case 'height': {
                        if (bounds.height !== artboard.height || bounds.y !== 0) {

                            // Move Y not X
                            moveY(obj, bounds);
                            resize(obj, bounds.width, artboard.height);
                        }
                        break; 
                    }
                    default: {
                        if ((bounds.width !== artboard.width || bounds.height !== artboard.height) || (bounds.x !== 0 || bounds.y !== 0)) {
                            moveBoth(obj, bounds);
                            resize(obj, artboard.width, artboard.height);
                        }
                        break; 
                    }
                }
            });
        }
    }
}

function moveY(obj, originalBounds) {
    const width = originalBounds.width;
    const y = originalBounds.y;
    let x = 0;

    // Calculate offsets based on the text alignment
    switch(obj.textAlign) {
        case 'center': {
            x = -width/2;
            break;
        }
        case 'right': {
            x = -width;
            break;
        }
        default: {
            break;
        }
    }

    // Offset by the current relative position
    obj.moveInParentCoordinates(x, -y);
}

function moveX(obj, originalBounds) {
    const width = originalBounds.width;
    const y = originalBounds.y;
    let x = originalBounds.x;

    // Calculate offsets based on the text alignment
    switch(obj.textAlign) {
        case 'center': {
            x = x + width/2;
            break;
        }
        case 'right': {
            x = x + width;
            break;
        }
        default: {
            break;
        }
    }

    // Offset by the current relative position
    obj.moveInParentCoordinates(-x, 0);
}

function moveBoth(obj, originalBounds) {
    const width = originalBounds.width;
    const y = originalBounds.y;
    let x = originalBounds.x;

    // Calculate offsets based on the text alignment
    switch(obj.textAlign) {
        case 'center': {
            x = x + width/2;
            break;
        }
        case 'right': {
            x = x + width;
            break;
        }
        default: {
            break;
        }
    }

    // Offset by the current relative position
    obj.moveInParentCoordinates(-x, -y);
}

function resize(obj, newWidth, newHeight) {

    // If the element is text
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
