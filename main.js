// Fit to parent width & height
function fitToParent(selection) {
    fit(selection)
}

// Fit to parent width
function fitToParentWidth(selection) {
    fit(selection, 'width')
}

// Fit to parent height
function fitToParentHeight(selection) {
    fit(selection, 'height')
}

// Resize and move
function fit(selection, command) {

    // If no selection
    if (0 === selection.length) {
        console.log('No objects selected.')
        return false;
    
    // If objects selected
    } else {
        const parent = selection.insertionParent;
        const parentBounds = parent.boundsInParent;
        const artboard = selection.focusedArtboard;

        // If there is no parent
        if ('RootNode' === parent.constructor.name) {
            console.log('Like Batman, the object doesn\'t have any parents.');
            return false;

        // If there is a parent
        } else {

            // Iterate through the selection
            selection.items.forEach(function (item) {

                // Get each items details
                const itemBounds = item.boundsInParent;

                // Resize nased on the command
                // (and it needed to avoid multiple undo entries)
                switch(command) {

                    // Reisze the width
                    case 'width': {
                        if (itemBounds.width !== parentBounds.width) {
                            move(item, parent, command, artboard);
                            resize(item, parentBounds.width, itemBounds.height);
                        }
                        break; 
                    }

                    // Resize the height
                    case 'height': {

                        if (itemBounds.height !== parentBounds.height) {
                            move(item, parent, command, artboard);
                            resize(item, itemBounds.width, parentBounds.height);
                        }
                        break; 
                    }

                    // Resize both
                    default: {
                        if ((itemBounds.width !== parentBounds.width) || (itemBounds.height !== parentBounds.height)) {
                            move(item, parent, command, artboard);
                            resize(item, parentBounds.width, parentBounds.height);
                        }
                        break; 
                    }
                }
            });
        }
    }
}

// Calculate whether text is point or area
function adjustBasedOnText(item, offset, adjustment) {
    let calc;

    // If it's area
    if (item.areaBox) {

        // Treat it like a GraphicNode
        calc = offset;
    
    // If it's Point
    } else {

        // Calculate the offset
        calc = offset - adjustment;
    }

    return calc;
}

// Calculate the correct offset for the Artboard
// Or return 0 if it's not on an Artboard
function calculateArtboardOffset(parent, artboard) {
    let artboardOffset = {
        x: 0,
        y: 0
    }

    // If the selection is on an Artboard and is within a Group
    if (artboard && parent && 'Group' === parent.constructor.name) {

        const bounds = artboard.boundsInParent;
        
        artboardOffset = {
            x: bounds.x,
            y: bounds.y
        }
    }

    return artboardOffset;
}

function calculateMovementOffset(item, parent, artboard, command) {
    const artboardOffset = calculateArtboardOffset(parent, artboard);
    const itemGlobalBounds = item.globalBounds;
    const parentBounds = parent.boundsInParent;
    const calc = {
        x: itemGlobalBounds.x - artboardOffset.x - parentBounds.x,
        y: itemGlobalBounds.y - artboardOffset.y - parentBounds.y
    }
    
    // The offset always starts as 0
    let offset = {
        x: 0,
        y: 0
    }
    
    // Calculate offsets based on the direction of resize
    switch(command) {
        case 'width': {
            offset.x = -calc.x;
            offset.y = 0;
            break;
        }
        case 'height': {
            offset.x = 0;
            offset.y = -calc.y;
            break;
        }
        default: {
            offset.x = -calc.x;
            offset.y = -calc.y;
            break;
        }
    }

    return offset;
}

// Determine how much an object needs to move
function calculateMovement(item, offset) {
    const itemWidth = item.boundsInParent.width;
    let movement = {};

    // Calculate offsets based on the text alignment as the anchor point is different
    // https://adobexdplatform.com/plugin-docs/reference/scenegraph.html#texttextalign--string
    switch(item.textAlign) {
        case 'center': {
            movement.x = adjustBasedOnText(item, offset.x, itemWidth/2);
            movement.y = offset.y;
            break;
        }
        case 'right': {
            movement.x = adjustBasedOnText(item, offset.x, itemWidth);
            movement.y = offset.y;
            break;
        }
        default: {
            movement.x = offset.x;
            movement.y = offset.y;
            break;
        }
    }

    return movement;
}

// Move the object
function move(item, parent, command, artboard) {
    const offset = calculateMovementOffset(item, parent, artboard, command);
    const movement = calculateMovement(item, offset);
    
    // Move the element by relative pixels
    item.moveInParentCoordinates(movement.x, movement.y);
}

// Resize the object
function resize(item, newWidth, newHeight) {

    // Change point text to areaNox text and apply the dimensions
    if ('Text' === item.constructor.name) {
        item.areaBox = {
            width: newWidth,
            height: newHeight
        }
    
    } else {
        item.resize(newWidth, newHeight);
    }
}

module.exports = {
    commands: {
        "FitToParent": fitToParent,
        "FitToParentWidth": fitToParentWidth,
        "FitToParentHeight": fitToParentHeight
    }
};
