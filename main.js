// Fit to artboard
function fitToArtboard(selection) {
    objectResize(selection)
}

// Fit to artboard height
function fitToArtboardHeight(selection) {
    objectResize(selection, 'height')
}

// Fit to artboard width
function fitToArtboardWidth(selection) {
    objectResize(selection, 'width')
}

// Resize and move
function objectResize(selection, command) {

    // If no selection
    if (0 === selection.length) {
        console.error('No elements selected.')
        return false;
    
    // If objects selected
    } else {

        // Get the focussed artboard
        const artboard = selection.focusedArtboard;
        const topLeft = {x: 0, y: 0};

        selection.items.forEach(function (obj) {
            const bounds = obj.boundsInParent;

            switch(command) {
                case 'width': {
                    obj.resize(artboard.width, bounds.height);
                    obj.placeInParentCoordinates(topLeft,{x: 0, y: bounds.y});
                    break; 
                }
                case 'height': {
                    obj.resize(bounds.width, artboard.height);
                    obj.placeInParentCoordinates(topLeft,{x: bounds.x, y: 0});
                    break; 
                }
                default: {
                    obj.resize(artboard.width, artboard.height);
                    obj.placeInParentCoordinates(topLeft,topLeft);
                    break; 
                }
            }
        });
    }
}

module.exports = {
    commands: {
        "FitToArtboardHeight": fitToArtboardHeight,
        "FitToArtboardWidth": fitToArtboardWidth,
        "FitToArtboard": fitToArtboard,
    }
};
