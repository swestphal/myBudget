// data controller
var dataController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, description, value) {
            var newItem;

            // create new id
            if (data.allItems[type].length > 0) {
                var id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else id = 0;

            // create new item based on type
            if (type === "exp") {
                newItem = new Expense(id, description, value);
            } else if (type === "inc") {
                newItem = new Income(id, description, value);
            }

            // push to data
            data.allItems[type].push(newItem);
            console.log(newItem);
            // return the new element
            return newItem;
        }
    };
})();

// user interface controller
var uiController = (function() {
    var domStr = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list"
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
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            // html string

            if (type === "inc") {
                element = domStr.incomeContainer;
                html =
                    '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = domStr.expenseContainer;
                html =
                    '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // update with object values
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            // insert html into the dom
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(domStr.inputDescription + "," + domStr.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            // set focus back on input field
            fieldsArr[0].focus();
        }
    };
})();

// global controller
var controller = (function(dataCtrl, uiCtrl) {
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
        var input, newItem;

        // get field input
        input = uiCtrl.getInput();

        // add item to the budget controller
        newItem = dataController.addItem(input.type, input.description, input.value);

        // add new item to ui
        uiController.addListItem(newItem, input.type);

        // clear fields
        uiController.clearFields();

        // calculate budget

        // display budget
    };

    return {
        init: function() {
            setupEventListeners();
        }
    };
})(dataController, uiController);

controller.init();
