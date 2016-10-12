var AppRouter = Backbone.Router.extend({

    routes: {
        "": "homepage",
        "homepage": "homepage",
        "plan": "plan",
        "bmi": "bmi",
        "settings": "settings"
    },

    initialize: function () {
        $('.back').on('click', function (event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;
        Plans.fetch();
    },

    homepage: function () {
        this.changePage(new HomePage());
    },

    plan: function () {
        this.changePage(new PlanForm());
    },

    bmi: function () {
        this.changePage(new BmiPage());
    },

    settings: function () {
        this.changePage(new SettingsPage());
    },

    changePage: function (page) {
        $(page.el).attr('data-role', 'page');
        $(page.el).attr('data-theme', 'a');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }

        $.mobile.changePage($(page.el), {changeHash: false, transition: transition});
    }

});

$(document).ready(function () {
    tpl.loadTemplates([
            'homepage',
            'plan',
            'bmi',
            'food',
            'settings'
        ],
        function () {
            app = new AppRouter();
            Backbone.history.start();
        });
});