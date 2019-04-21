function $(selector) {
    let elements = document.querySelectorAll(selector);
    return elements.length == 1 ? elements[0] : elements;
}

function constructNode(tag, className, id = tag) {
    let ticTacToeElement = document.createElement(tag);
    ticTacToeElement.id = id;
    if (className) {
        ticTacToeElement.className += className;
    }
    return ticTacToeElement;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export {
    $,
    constructNode,
    sleep
};