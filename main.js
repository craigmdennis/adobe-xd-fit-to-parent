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

        // Iterate through the selection
        selection.items.forEach(function (item) {

            const parent = item.parent;
            const distanceToMove = calculateDistance(item, parent);

            let desiredWidth = parent.globalDrawBounds.width;
            let desiredHeight = parent.globalDrawBounds.height;
            let currentWidth = item.globalDrawBounds.width;
            let currentHeight = item.globalDrawBounds.height;

            // If there is no parent
            if ('RootNode' === parent.constructor.name) {
                console.log('Like Batman, the object doesn\'t have any parents.');
                return false;
            }

            switch(command) {
                case 'width': {
                    item.moveInParentCoordinates(-distanceToMove.x, 0);
                    resizeObject(item, desiredWidth, currentHeight);
                    break;
                }
                case 'height': {
                    item.moveInParentCoordinates(-calculateTextOffset(item), -distanceToMove.y);
                    resizeObject(item, currentWidth, desiredHeight);
                    break;
                }
                default: {
                    item.moveInParentCoordinates(-distanceToMove.x, -distanceToMove.y);
                    resizeObject(item, desiredWidth, desiredHeight);
                    break;
                }
            }

        })
    }
}

function calculateTextOffset(item) {
    const itemWidth = item.globalDrawBounds.width;
    let offset;

    // Calculate offsets based on the text alignment as the anchor point is different
    // https://adobexdplatform.com/plugin-docs/reference/scenegraph.html#texttextalign--string
    switch(item.textAlign) {
        case 'center': {
            offset = itemWidth/2;
            break;
        }
        case 'right': {
            offset = itemWidth;
            break;
        }
        default: {
            offset = 0;
            break;
        }
    }

    return offset;
}

function resizeObject(item, w, h) {

    // If it's not text, use the normal resize
    if (item.constructor.name !== 'Text') {
        item.resize(w, h);

    // If it's text, convert to areaBox and set width/height
    } else {
        item.areaBox = {
            width: w,
            height: h,
        }
    }
}

function calculateDistance(item, parent) {
    let distanceToMove = {
        x: item.globalDrawBounds.x - parent.globalDrawBounds.x,
        y: item.globalDrawBounds.y - parent.globalDrawBounds.y
    }

    return distanceToMove;
}

module.exports = {
    commands: {
        "FitToParent": fitToParent,
        "FitToParentWidth": fitToParentWidth,
        "FitToParentHeight": fitToParentHeight
    }
};
