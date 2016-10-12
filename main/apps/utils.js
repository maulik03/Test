tpl = {

    // Hash of preloaded templates for the app
    templates: {},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates: function (names, callback) {

        var that = this;

        var loadTemplate = function (index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get('src/' + name + '.html', function (data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get: function (name) {
        console.log('getting src:' + name);
        return this.templates[name];
    }

};

// list of calories
var calories = [
    ['Apple', 52, '100g'],
    ['Banana', 89, '100g'],
    ['Bread', 265, '100g'],
    ['Cheese', 402, '100g'],
    ['Milk', 42, '100g'],
    ['Egg', 155, '100g'],
    ['Hamburger', 295, '100g'],
    ['Chicken meat', 239, '100g'],
    ['Beef, ground, 85% lean meat', 250, '100g'],
    ['Fries', 312, '100g'],
    ['Rice, white, cooked', 130, '100g'],
    ['Carrot', 41, '100g'],
    ['Pizza Hut Cheese Pizza', 275, '100g'],
    ['Coca Cola', 140, 'bottle'],
    ['Orange', 47, '100g'],
    ['Dark Chocolate', 546, '100g'],
    ['Ice Cream, vanilla', 207, '100g'],
    ['Cake, serving size 1 piece', 239, '64g'],
    ['Strawberries', 33, '100g'],
    ['Vegetable Juice', 29, '100g'],
    ['Grape Juice', 60, '100g']

];

//use when click on add food
var foodIndex = 0;

//set default weight as kg
if(!localStorage.getItem('weight')) {
    localStorage.setItem('weight', 'kg');
}

//set default height as cm
if(!localStorage.getItem('height')) {
    localStorage.setItem('height', 'cm');
}
