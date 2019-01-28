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
                            move(item, parent, command);
                            resize(item, parentBounds.width, itemBounds.height);
                        }
                        break; 
                    }

                    // Resize the height
                    case 'height': {

                        if (itemBounds.height !== parentBounds.height) {
                            move(item, parent, command);
                            resize(item, itemBounds.width, parentBounds.height);
                        }
                        break; 
                    }

                    // Resize both
                    default: {
                        if ((itemBounds.width !== parentBounds.width) || (itemBounds.height !== parentBounds.height)) {
                            move(item, parent, command);
                            resize(item, parentBounds.width, parentBounds.height);
                        }
                        break; 
                    }
                }
            });
        }
    }
}

// Move based on the type of element
function move(item, parent, command) {
    const itemGlobalBounds = item.globalBounds;
    const parentBounds = parent.boundsInParent;
    const itemWidth = item.boundsInParent.width;
    let groupOffsetY = 0;
    let offsetX;
    let offsetY;
    let x;
    let y;

    // Calculate whether text is point or area
    function textCalc(item, offset, adjustment) {
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

    // Not sure why group positioning is -2px off when positioning on the y axis
    if ('Group' === parent.constructor.name && command !== 'width') {
        groupOffsetY = 2;
    }

    // Calculate offsets based on the direction of resize
    switch(command) {
        case 'width': {
            offsetX = (itemGlobalBounds.x - parentBounds.x) / -1;
            offsetY = 0;
            break;
        }
        case 'height': {
            offsetX = 0;
            offsetY = (itemGlobalBounds.y - parentBounds.y) / -1;
            break;
        }
        default: {
            offsetX = (itemGlobalBounds.x - parentBounds.x) / -1;
            offsetY = (itemGlobalBounds.y - parentBounds.y) / -1;
            break;
        }
    }

    // Calculate offsets based on the text alignment as the anchor point is different
    // https://adobexdplatform.com/plugin-docs/reference/scenegraph.html#texttextalign--string
    switch(item.textAlign) {
        case 'center': {
            x = textCalc(item, offsetX, itemWidth/2);
            y = offsetY;
            break;
        }
        case 'right': {
            x = textCalc(item, offsetX, itemWidth);
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
    item.moveInParentCoordinates(x, y + groupOffsetY);
}

// Resize the object
function resize(item, newWidth, newHeight) {

    // If it's text
    if ('Text' === item.constructor.name) {

        // Change from point text and resize
        item.areaBox = {
            width: newWidth,
            height: newHeight
        }
    
    // If it's anything else
    } else {

        // Resize as normal
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
