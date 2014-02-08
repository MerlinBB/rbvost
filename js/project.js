(function ($) {
    "use strict";

    var rbvost = {

        siteurl:    "http://127.0.0.1:8080/wordpress/",
        templateurl:   "http://127.0.0.1:8080/wordpress//wp-content/themes/rbvost/templates/",
        cache: undefined,

        init: function () {
            this.setLoginForm();
            this.checkLoginError();
            rbvost.router("campaign");
        },

        router: function (view) {
            if (view === "campaign") {
                rbvost.renderCampaignFilters();
                rbvost.renderCampaignList();
            }
        },

        renderView: function (data, template, el) {
            $.get(rbvost.templateurl + template, function (template) {
                $(el).html(
                    Mustache.render(template, data)
                );
                rbvost.bindUIActions();
            });
        },

        renderCampaignFilters: function () {
            $.ajax({ url: rbvost.siteurl + "?json=get_category_index" })
            .done(function (data) {
                // if the category has a parent we assume it's a target
                // if not then it's a calendar year
                var targets = _(data.categories).filter(function (category) {
                    return category.parent;
                });
                data.categories = targets;
                rbvost.renderView(data, "campaign-filters.html", ".campaign-filters-view");
            })
            .fail(function () {
                alert("error");
            });
        },

        renderCampaignList: function () {
            $.ajax({ url: rbvost.siteurl + "?json=1" })
            .done(function (data) {
                // if the category has a parent we assume it's a target
                // if not then it's a calendar year
                data.isCat = function () {
                    if (this.parent) {
                        return this.title;
                    }
                };
                rbvost.renderView(data, "campaign-list.html", ".campaign-list-view");
            })
            .fail(function () {
                alert("error");
            });
        },

        bindUIActions: function () {
            $(".btn").on("click", function (e) { rbvost.sayHello(e); });
        },

        windowLoaded: function () {
            console.log("Loaded");
        },

        windowResized: function () {
            console.log("Resized");
        },

        windowScrolled: function () {
            // Improve performance while scrolling by not triggering hover events
            // http://www.thecssninja.com/javascript/pointer-events-60fps
            var body = document.documentElement;
            var timer;

            if (!body.style.pointerEvents) {
                body.style.pointerEvents = "none";
            }

            timer = setTimeout(function () {
                body.style.pointerEvents = "";
            }, 200);
        },

        setLoginForm: function () {
            $("#user_login").attr("placeholder", "Username");
            $("#user_pass").attr("placeholder", "Password");
        },

        checkLoginError: function () {
            var querystring = window.location.href.slice(window.location.href.indexOf("?") + 1);
            if (querystring === "login-failed") {
                $(".alert").show();
            }
        }

    };

    // DOM Ready
    $(function () { rbvost.init(); });
    // Images Loaded
    $(window).load(function () { rbvost.windowLoaded(); });
    // Window Resized (smart debounced event)
    $(window).bind("debouncedresize", function () { rbvost.windowResized(); });
    // Window Scrolled
    $(window).on("scroll", function () { rbvost.windowScrolled(); });

} (jQuery));
