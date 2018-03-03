// data controller
var budgetController = (function() {})();

// user interface controller
var uiController = (function() {
    var domStr = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(domStr.inputType).value,
                description: document.querySelector(domStr.inputDescription).value,
                value: document.querySelector(domStr.inputValue).value
            };
        },
        getDomStr: function() {
            return domStr;
        }
    };
})();

// global controller
var controller = (function(budgetCtrl, uiCtrl) {
    var setupEventListeners = function() {
        var dom = uiController.getDomStr();
        document.querySelector(dom.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function(e) {
            if (e.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function() {
        // get field input
        var input = uiCtrl.getInput();
        console.log(input);
        // add item to the budget controller
        // add new item to ui
        // calculate budget
        // display budget
    };

    return {
        init: function() {
            setupEventListeners();
        }
    };
})(budgetController, uiController);

controller.init();
