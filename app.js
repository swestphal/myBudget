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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
            // return the new element
            return newItem;
        },

        calculateBudget: function() {
            // calculate total income and
            calculateTotal("exp");
            calculateTotal("inc");

            // calculate budget (income-expenses)
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage of income that is spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },

        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expenseContainer: ".expenses__list",
        budget: ".budget__value",
        budgetIncome: ".budget__income--value",
        budgetExpenses: ".budget__expenses--value",
        budgetPercentage: ".budget__expenses--percentage",
        listContainer: ".container"
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(domStr.inputType).value,
                description: document.querySelector(domStr.inputDescription).value,
                value: parseFloat(document.querySelector(domStr.inputValue).value)
            };
        },
        displayBudget: function(obj) {
            document.querySelector(domStr.budget).textContent = obj.budget;
            document.querySelector(domStr.budgetExpenses).textContent = obj.totalExp;
            document.querySelector(domStr.budgetIncome).textContent = obj.totalInc;
            if (obj.percentage > 0) {
                document.querySelector(domStr.budgetPercentage).textContent = obj.percentage;
            } else {
                document.querySelector(domStr.budgetPercentage).textContent = "---";
            }
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
        document.querySelector(dom.container).addEventListener("click", ctrlDeleteItem);
    };

    var updateBudget = function() {
        var budget;
        // calculate budget
        dataController.calculateBudget();

        // return the budget
        budget = dataController.getBudget();
        // display budget
        uiController.displayBudget(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;

        // get field input
        input = uiCtrl.getInput();

        if (input.description != "" && !isNaN(input.value) && input.value > 0) {
            // add item to the budget controller
            newItem = dataController.addItem(input.type, input.description, input.value);

            // add new item to ui
            uiController.addListItem(newItem, input.type);

            // clear fields
            uiController.clearFields();

            //calculate and update budget
            updateBudget();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemId, splitId, type, id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split("-");
            type = splitId[0];
            id = parseInt(splitId[1]);

            // delete item from the data
            dataController.deleteItem(type, id);
            // delete item from ui

            // update ui with budget
        }
    };

    return {
        init: function() {
            uiController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
        }
    };
})(dataController, uiController);

controller.init();
