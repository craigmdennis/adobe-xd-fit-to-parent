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
            const desiredWidth = parent.globalDrawBounds.width;
            const desiredHeight = parent.globalDrawBounds.height;
            const currentWidth = item.globalDrawBounds.width;
            const currentHeight = item.globalDrawBounds.height;
            const offset = calculateTextOffset(item);

            // If there is no parent
            if ('RootNode' === parent.constructor.name) {
                console.log('Like Batman, the object doesn\'t have any parents.');
                return false;
            }

            switch(command) {
                case 'width': {
                    resizeObject(item, desiredWidth, currentHeight);
                    item.moveInParentCoordinates(- calculateDistance(item, parent).x, 0);
                    break;
                }
                case 'height': {
                    resizeObject(item, currentWidth, desiredHeight);
                    item.moveInParentCoordinates(- offset, - calculateDistance(item, parent).y);
                    break;
                }
                default: {
                    resizeObject(item, desiredWidth, desiredHeight);
                    item.moveInParentCoordinates(- calculateDistance(item, parent).x, - calculateDistance(item, parent).y);
                    break;
                }
            }

        })
    }
}

// Calculate offsets based on the text alignment as the anchor point is different
// https://adobexdplatform.com/plugin-docs/reference/scenegraph.html#texttextalign--string
function calculateTextOffset(item) {
    const itemWidth = item.localBounds.width;
    let offset = 0;

    // If it doesn't have a areaBox
    // and is therefore POint text
    if (null === item.areaBox) {
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
                break;
            }
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
