(function ($) {
    "use strict";

    var rbvost = {

        siteurl:       "http://127.0.0.1:8080/wordpress/",
        templateurl:   "http://127.0.0.1:8080/wordpress/wp-content/themes/rbvost/templates/",
        currentView:   "campaign",
        currentYear:   new Date().getFullYear(),
        dateRange:     { years: [] },
        cache:         {},
        calendar:      undefined,
        isotopeEl:     ".campaigns-container",

        init: function () {
            this.setLoginForm();
            this.checkLoginError();
            this.setAppHeight();
            this.bindUIActions();

            // only bother to make API calls if we're logged in
            if ($("body").hasClass("logged-in")) {
                rbvost.buildMenu();
                rbvost.getContent();
            }
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
                _.each(data.categories, function (category) {
                    // if category has no parent, it's a year
                    if (!category.parent) {

                        // create period object
                        var period = {};
                        // add year to object
                        period.year = category.slug;
                        // if this year is the current calendar year, mark it as so
                        if (category.slug == rbvost.currentYear) {
                            period.isCurrent = true;
                        }
                        // push results to hoisted array
                        rbvost.dateRange.years.push(period);
                    }
                });
                // now we have a daterange array, we can render the menu
                rbvost.renderMenu();
            })
            .fail(function () {
                alert("Sorry, there is currently an error fetching the date range.");
            });
        },

        getContent: function () {
            // get all content for current year
            $.ajax({
                url: rbvost.siteurl + "?json=get_category_posts&slug=" + rbvost.currentYear
            })
            .done(function (data) {
                rbvost.cache = data;
                rbvost.router(rbvost.currentView);
            })
            .fail(function () {
                alert("Sorry, there is currently an error fetching the content.");
            });
        },

        getUniqueTargets: function () {
            var data = rbvost.cache;
            var uniqueTargets = { targets: [] };

            // for each post (year), go through all categories and find all sub categories (targets)
            // then check if this already exists in our unique collection
            // if not, push it in
            _.each(data.posts, function (post) {
                _.each(post.categories, function (category) {
                    if (category.parent) {

                        var exists = _.findWhere(uniqueTargets.targets, { slug: category.slug });

                        if (!exists) {
                            var target = {};
                            target.slug = category.slug;
                            target.title = category.title;
                            target.description = category.description;

                            uniqueTargets.targets.push(target);
                        }

                    }
                });
            });

            return uniqueTargets;
        },


        // -----------------------------------------------------------------------------------------
        // Common Functions
        // -----------------------------------------------------------------------------------------


        bindUIActions: function () {
            // App Menu
            $("[data-navigate]").on("click", function (e) { rbvost.navigate(e); });
            $("body").on("change", "#year-selector", function (e) { rbvost.yearShouldChange(e); });

            // Campaigns View
            $("body").on("click", ".campaign-filters button", function (e) { rbvost.campaignsShouldFilter(e); });
        },

        router: function (view) {
            $(".switch-view").hide();

            if (view === "campaign") {
                rbvost.renderCampaignFilters();
                rbvost.renderCampaignList();
            }

            if (view === "calendar") {
                rbvost.renderCalendarFilters();
                rbvost.renderCalendar();
            }

            rbvost.currentView = view;
        },

        renderView: function (data, template, el, callback) {
            $.get(rbvost.templateurl + template, function (template) {
                $(el).html(
                    Mustache.render(template, data)
                );

                $(el).fadeIn("slow");

                if (callback) { callback(); }
            });
        },

        windowLoaded: function () {
            console.log("Loaded");
        },

        windowResized: function () {
            // retrigger the isotope layout engine
            $(rbvost.isotopeEl).isotope("reLayout");
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
            var uniqueTargets = rbvost.getUniqueTargets();

            rbvost.renderView(uniqueTargets, "campaign-filters.html", ".campaign-filters-view");
        },

        renderCampaignList: function () {
            var data = rbvost.cache;

            // filters down to just subcategories
            // ie: targets not years
            data.catTitle = function () {
                if (this.parent) {
                    return this.title;
                }
            };

            data.catSlug = function () {
                if (this.parent) {
                    return this.slug;
                }
            };

            var afterRender = function () {
                $(rbvost.isotopeEl).isotope({

                });
            };

            rbvost.renderView(data, "campaign-list.html", ".campaign-list-view", afterRender);
        },

        campaignsShouldFilter: function (e) {
            e.preventDefault();

            var query = $(e.currentTarget).data("filter");
            $(rbvost.isotopeEl).isotope({ filter: query });
        },


        // -----------------------------------------------------------------------------------------
        // Calendar View
        // -----------------------------------------------------------------------------------------


        renderCalendarFilters: function () {
            var data = rbvost.cache;

            var filters = {
                targets: rbvost.getUniqueTargets(),
                campaigns: [],
                regions: []
            };

            // get campaigns
            _.each(data.posts, function (post) {
                var campaign = {};
                campaign.title = post.title;
                campaign.slug = post.slug;

                filters.campaigns.push(campaign);
            });

            // get regions
            _.each(data.posts, function (post) {
                var exists = _.findWhere(filters.regions, { slug: post.acf.region });

                if (!exists) {
                    var region = {};
                    region.slug = post.acf.region;

                    if (region.slug === "national") { region.title = "National"; }
                    if (region.slug === "london") { region.title = "London"; }
                    if (region.slug === "north") { region.title = "North / Scotland"; }
                    if (region.slug === "southwest") { region.title = "South West"; }

                    filters.regions.push(region);
                }
            });

            rbvost.renderView(filters, "calendar-filters.html", ".calendar-filters-view");
        },

        renderCalendar: function () {
            var data = rbvost.cache;
            var calendarEvents = [];

            _.each(data.posts, function (post) {
                // here we can grab stuff from the post which we can later insert into the event objects
                var campaign = post.slug;
                var region = post.acf.region;
                var target;

                // get the event target
                _.each(post.categories, function (category) {
                    if (category.parent) {
                        target = category.slug;
                    }
                });

                _.each(post.acf.events, function (event) {
                    // create event object
                    var thisEvent = {};
                    // add data to object
                    thisEvent.date = event.event_date;
                    thisEvent.prettyDate = moment(event.event_date).format("MMM Do YYYY");
                    thisEvent.location = event.event_location;
                    thisEvent.name = event.event_name;
                    thisEvent.campaign = campaign;
                    thisEvent.region = region;
                    thisEvent.target = target;
                    // push results to hoisted array
                    calendarEvents.push(thisEvent);
                });

            });

            // If a clndr instance already exists we can just update it
            if (rbvost.calendar) {

                rbvost.calendar.setEvents(calendarEvents);
                rbvost.calendar.setYear(rbvost.currentYear);

                $(".calendar-view").fadeIn("fast");

            // if not let's grab the template and render it out
            } else {

                $.get(rbvost.templateurl + "calendar.html", function (calendarTemplate) {
                    rbvost.calendar = $(".calendar-view").clndr({
                        template: calendarTemplate,
                        events: calendarEvents,
                        showAdjacentMonths: false,

                        lengthOfTime: {
                            months: 12,
                            startDate: rbvost.currentYear + "-01-01"
                        }
                    });

                    $(".calendar-view").fadeIn("fast");
                });

            }
        }

    };

    // DOM Ready
    $(function () { rbvost.init(); });
    // Images Loaded
    $(window).load(function () { rbvost.windowLoaded(); });
    // Window Resized (smart debounced event)
    $(window).bind("debouncedresize", function () { rbvost.windowResized(); });

} (jQuery));
