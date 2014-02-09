(function ($) {
    "use strict";

    var rbvost = {

        siteurl:       "http://127.0.0.1:8080/wordpress/",
        templateurl:   "http://127.0.0.1:8080/wordpress//wp-content/themes/rbvost/templates/",
        currentPage:   "campaign",
        currentYear:   new Date().getFullYear(),
        dateRange:     { years: [] },
        cache:         {},

        init: function () {
            this.setLoginForm();
            this.checkLoginError();
            this.setAppHeight();
            this.bindUIActions();
            rbvost.buildMenu();
            rbvost.getContent();
        },


        // -----------------------------------------------------------------------------------------
        // API Requests
        // -----------------------------------------------------------------------------------------


        buildMenu: function () {
            // get list of years for year selector menu
            $.ajax({
                url: rbvost.siteurl + "?json=get_category_index"
            })
            .done(function (data) {
                // if we're logged out api will not return anything
                if (data) {
                    for (var i = 0; i < data.categories.length; i++) {
                        // if category has no parent, it's a year
                        if (!data.categories[i].parent) {

                            var period = {};
                            period.year = data.categories[i].slug;
                            if (data.categories[i].slug == rbvost.currentYear) {
                                period.isCurrent = true;
                            }

                            rbvost.dateRange.years.push(period);
                        }
                    }
                    rbvost.renderMenu();
                }
            })
            .fail(function () {
                alert("error");
            });
        },

        getContent: function () {
            // get all content for current year
            $.ajax({
                url: rbvost.siteurl + "?json=get_category_posts&slug=" + rbvost.currentYear
            })
            .done(function (data) {
                // if we're logged out api will not return anything
                if (data) {
                    rbvost.cache = data;
                    rbvost.router(rbvost.currentPage);
                }
            })
            .fail(function () {
                alert("error");
            });
        },


        // -----------------------------------------------------------------------------------------
        // Common Functions
        // -----------------------------------------------------------------------------------------


        bindUIActions: function () {
            $("[data-navigate]").on("click", function (e) { rbvost.navigate(e); });
            $("body").on("change", "#year-selector", function (e) { rbvost.yearShouldChange(e); });
        },

        router: function (page) {
            $(".switch-view").hide();

            if (page === "campaign") {
                rbvost.renderCampaignFilters();
                rbvost.renderCampaignList();
            }

            if (page === "calendar") {
                $(".calendar-view").fadeIn("slow");
            }

            rbvost.currentPage = page;
        },

        renderView: function (data, template, el) {
            $.get(rbvost.templateurl + template, function (template) {
                $(el).html(
                    Mustache.render(template, data)
                );
                $(el).fadeIn("slow");
            });
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

        setAppHeight: function () {
            // set a min height minus the guessed height for redbull global header / footer
            var appHeight = $(window).height() - 186 + "px";
            $("#app").css({ "min-height" : appHeight });
        },

        navigate: function (e) {
            var destination = $(e.currentTarget).data("navigate");
            rbvost.router(destination);
        },


        // -----------------------------------------------------------------------------------------
        // Login View
        // -----------------------------------------------------------------------------------------


        setLoginForm: function () {
            $("#user_login").attr("placeholder", "Username");
            $("#user_pass").attr("placeholder", "Password");
        },

        checkLoginError: function () {
            var querystring = window.location.href.slice(window.location.href.indexOf("?") + 1);
            if (querystring === "login-failed") {
                $(".alert").show();
            }
        },


        // -----------------------------------------------------------------------------------------
        // Menu View
        // -----------------------------------------------------------------------------------------


        renderMenu: function () {
            var data = rbvost.dateRange;

            rbvost.renderView(data, "year-selector.html", ".year-selector-view");
        },

        yearShouldChange: function (e) {
            rbvost.currentYear = $(e.currentTarget).val();
            // Hit API for requested year, update cache and re-render
            rbvost.getContent();
        },


        // -----------------------------------------------------------------------------------------
        // Campaigns View
        // -----------------------------------------------------------------------------------------


        renderCampaignFilters: function () {
            var data = rbvost.cache;

            // filters down to just subcategories
            // ie: targets not years
            data.catDesc = function () {
                if (this.parent) {
                    return "<h2>" + this.title + "</h2><p>" + this.description + "</p>";
                }
            };

            rbvost.renderView(data, "campaign-filters.html", ".campaign-filters-view");
        },

        renderCampaignList: function () {
            var data = rbvost.cache;

            // filters down to just subcategories
            // ie: targets not years
            data.cat = function () {
                if (this.parent) {
                    return this.title;
                }
            };

            rbvost.renderView(data, "campaign-list.html", ".campaign-list-view");
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
