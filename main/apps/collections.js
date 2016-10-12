var PlanCollection = Backbone.Collection.extend({

    model: Plan,

    localStorage: new Backbone.LocalStorage("plan-backbone"),

    nextOrder: function () {
        if (!this.length) return 1;
        return this.last().get('order') + 1;
    },

    hasGoal: function () {
        var result = false;
        _.each(this.models, function (model) {
            if (model.get('date') == moment().format('MM/DD/YYYY')) {
                result = model;
            }
        });
        return result;
    }
});

var Plans = new PlanCollection;
