// data controller
var budgetController = (function() {})();

// user interface controller
var uiController = (function() {})();

// global controller
var controller = (function(budgetCtrl, uiCtrl) {
    var ctrlAddItem = function() {
        // get field input
        // add item to the budget controller
        // add new item to ui
        // calculate budget
        // display budget
    };

    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(e) {
        if (e.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
})(budgetController, uiController);
