HomePage = Backbone.View.extend({

    initialize: function () {
        this.template = _.template(tpl.get('homepage'));
    },

    render: function (eventName) {
        var attributes = {date: moment().format('MM/DD/YYYY')};

        var plan = Plans.hasGoal();
        if (plan) {
            attributes.left = plan.get('left');
        } else {
            attributes.left = undefined;
        }

        $(this.el).html(this.template(attributes));

        return this;
    }
});

SettingsPage = Backbone.View.extend({

    initialize: function () {
        this.template = _.template(tpl.get('settings'));
    },

    render: function (eventName) {
        $(this.el).html(this.template({
            weight: localStorage.getItem('weight'),
            height: localStorage.getItem('height')
        }));
        return this;
    },
    events: {
        'change #weight-settings': 'changeWeight',
        'change #height-settings': 'changeHeight'
    },
    changeWeight: function (e) {
        localStorage.setItem('weight', $(e.target).val());
    },
    changeHeight: function (e) {
        localStorage.setItem('height', $(e.target).val());
    }
});


BmiPage = Backbone.View.extend({
    constants: {
        KG_PER_POUND: 0.453592,
        INCHES_IN_FOOT: 12,
        CMS_PER_INCH: 2.54
    },
    initialize: function () {
        this.template = _.template(tpl.get('bmi'));
    },

    render: function (eventName) {
        $(this.el).html(this.template({
            height: localStorage.getItem('height'),
            weight: localStorage.getItem('weight')
        }));
        return this;
    },
    events: {
        'click .calculate-bmi': 'calculateBmi'
    },
    calculateBmi: function () {
        this._weight = this.$('#weight-bmi').val();

        if (isNaN(this._weight) || this._weight <= 0) {
            alert('Weight is numerical field');
            return false;
        }

        if (localStorage.getItem('weight') == 'lb') {
            this._weight = this._weight * this.constants.KG_PER_POUND;
        }

        if (localStorage.getItem('weight') == 'lb') {
            this._feet = this.$('#feet-bmi').val();
            this._inches = this.$('#inches-bmi').val();

            if (isNaN(this._feet) || this._feet <= 0) {
                alert('Feet is numerical field');
                return false;
            }

            if (isNaN(this._inches) || this._inches <= 0) {
                alert('Inches is numerical field');
                return false;
            }

            this._feet = this._feet * this.constants.INCHES_IN_FOOT * this.constants.CMS_PER_INCH;
            this._inches = this._inches * this.constants.CMS_PER_INCH;
            this._height = this.roundTwoDecimals(this._feet + this._inches);

        } else {
            this._height = this.$('#height-bmi').val();
            if (isNaN(this._height) || this._height <= 0) {
                alert('Height is numerical field');
                return false;
            }
        }

        var heightInMetres = this._height / 100;
        var bmi = this.roundOneDecimal(this._weight / ( heightInMetres * heightInMetres ));

        this.$('.your-bmi').html(bmi);
        return false;
    },
    roundTwoDecimals: function (number) {
        return Math.round(number * 100) / 100;
    },

    roundOneDecimal: function (number) {
        return Math.round(number * 10) / 10;
    },

    toInteger: function (number) {
        return Math.round(Number(number));
    }

});

var PlanForm = Backbone.View.extend({
    initialize: function () {
        this.template = _.template(tpl.get('plan'));
        this.foodTemplate = _.template(tpl.get('food'));


        this.model = Plans.hasGoal();
        if (!this.model) {
            this.model = new Plan;
        }

        var attributes = this.model;
        attributes.calories = calories;
        this.$el.html(this.template(attributes.toJSON()));

        if (this.model.food) {
            _.each(this.model.food, function (f, index) {
                console.log(index);
                console.log(f);
                this.$('#food-existing-' + index).selectmenu();
            });
        }
        //form elements
        this._goal = this.$("#goal-plan");
    },
    events: {
        'click .btn-save': 'save',
        'click .btn-delete': 'deletePlan',
        'click .add-food': 'addFood',
        'click .delete-food': 'deleteFood',
        'click .calculate-calories': 'calculateCalories'
    },
    save: function () {
        var food = [];
        var attributes = {};
        attributes.left = this._goal.val();
        this.$('select[name^="food"]').each(function () {
            food.push($(this).val());
            attributes.left -= calories[$(this).val()][1];
        });
        attributes.goal = this._goal.val();
        attributes.food = food;

        if (this.model.isNew()) {
            Plans.create(attributes)
        } else {
            this.model.save(attributes);
        }

        window.location.hash = '#homepage';
    },
    deletePlan:function() {
        this.model.destroy();
        window.location.hash = '#homepage';
    },
    addFood: function () {
        var index = foodIndex++;
        this.$('.food').append(this.foodTemplate({calories: calories, foodIndex: index}));
        this.$('#food-' + index).selectmenu();
        return false;
    },
    deleteFood: function (e) {
        $(e.target).closest('.inline-form').remove();
        return false;
    },
    calculateCalories: function () {
        var goal = this._goal.val();
        var _calories = 0;
        this.$('select[name^="food"]').each(function () {
            if ($(this).val() !== '') {
                _calories += calories[$(this).val()][1];
            }
        });

        this.$('.calories-left').html(goal - _calories);
        return false;
    }
});