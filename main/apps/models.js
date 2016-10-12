var Plan = Backbone.Model.extend({

    defaults: function () {
        var order = Plans.nextOrder();
        return {
            date: "",
            goal: "",
            order: order,
            left: undefined,
            food: []
        };
    },

    initialize: function () {
        if (!this.get("date")) {
            this.set({"date": moment().format('MM/DD/YYYY')});
        }
    }
});