(function ($) {
    "use strict";

    var rbvost = {

        siteurl:         window.location.href,
        templateurl:     window.location.href + "/wp-content/themes/rbvost/templates/",
        currentView:     "target",
        currentYear:     new Date().getFullYear(),
        dateRange:       { years: [] },
        cache:           {},
        calendar:        undefined,
        isotopeEl:       ".campaigns-container",
        // defaut setting to show all
        // will update through calendarShouldFilter()
        calendarFilters: {
            targets: "*",
            campaigns: "*",
            regions: "*"
        },

        init: function () {
            this.checkLoginError();
            this.setAppHeight();
            this.bindUIActions();

            // only bother to make API calls if we're logged in
            if ($("body").hasClass("logged-in")) {
                rbvost.buildMenu();
                rbvost.getContent();
            }

            // this seems to fix some bizare bug with the webfont thinking it's loaded even when it hasn't
            // it causes a refresh and seems to then make it load properly
            $("body").css({ "text-rendering" : "auto" });
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
            $("body").on("click", ".menu-item-dropdown", function (e) { rbvost.dropdownShouldToggle(e); });
            $("body").on("click", ".menu-item-dropdown li", function (e) { rbvost.yearShouldChange(e); });

            // Campaigns View
            $("body").on("click", ".campaign-filters button", function (e) { rbvost.campaignsShouldFilter(e); });
            $("body").on("click", ".tooltip", function (e) { rbvost.tooltipShouldToggle(e); });

            // Calendar View
            $("body").on("click", ".calendar-filters button", function (e) { rbvost.calendarShouldFilter(e); });
            $("body").on("click", ".clndr .day.event", function (e) { rbvost.eventPopupShouldToggle(e); });
            $("body").on("click", ".clndr .close-popup", function (e) { rbvost.eventPopupShouldClose(e); });
            $("body").on("click", ".clndr .read-more", function (e) { rbvost.calendarOverlayShouldRender(e); });
            $("body").on("click", ".close-modal", function () { rbvost.modalShouldClose(); });
        },

        router: function (view) {
            $(".switch-view").hide();

            if (view === "target") {
                rbvost.renderTargets();
            }

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
                    _.template(template, data)
                );

                $(el).fadeIn("slow");
                $("#app").css({ "background-image" : "none" });

                if (callback) { callback(); }
            });
        },

        windowLoaded: function () {
            //
        },

        windowResized: function () {
            // retrigger the isotope layout engine
            $(rbvost.isotopeEl).isotope("reLayout");
        },

        setAppHeight: function () {
            // set a min height minus the guessed height for redbull global header / footer
            var appHeight = $(window).height() - 286 + "px";
            $("#app").css({ "min-height" : appHeight });
        },

        navigate: function (e) {
            // Set spinner
            $("#app").css({ "background-image" : rbvost.siteurl + "/wp-content/themes/rbvost/img/ajax-loader.gif" });

            // Toggle active state in menu
            $("button[data-navigate]").removeClass("current");
            $(e.currentTarget).addClass("current");

            // Set current page and rerender
            var destination = $(e.currentTarget).data("navigate");
            rbvost.router(destination);
        },


        // -----------------------------------------------------------------------------------------
        // Login View
        // -----------------------------------------------------------------------------------------


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

        dropdownShouldToggle: function (e) {
            $(e.currentTarget).find(".fa").toggleClass("fa-rotate-180");
            $(e.currentTarget).find(".dropdown").slideToggle("fast");
        },

        yearShouldChange: function (e) {
            var year = $(e.currentTarget).data("value");

            // Close menu and update text
            rbvost.dropdownShouldToggle(e);
            $(".menu-item-dropdown .current-year").text(year);

            // Set spinner and it API for requested year, update cache and re-render
            $("#app").css({ "background-image" : "" });
            rbvost.currentYear = year;
            rbvost.getContent();
        },


        // -----------------------------------------------------------------------------------------
        // Targets View
        // -----------------------------------------------------------------------------------------


        renderTargets: function () {
            var data = rbvost.cache;
            var uniqueTargets = rbvost.getUniqueTargets();

            rbvost.renderView(uniqueTargets, "targets.html", ".targets-view");
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
            var viewData = { campaigns: [] };

            _.each(data.posts, function (post) {
                var campaign = {};

                // get target + slug
                _.each(post.categories, function (category) {
                    if (category.parent) {
                        campaign.targetName = category.title;
                        campaign.targetSlug = category.slug;
                    }
                });

                campaign.title = post.title;
                campaign.description = post.acf.campaign_description;

                viewData.campaigns.push(campaign);
            });

            var afterRender = function () {
                $(rbvost.isotopeEl).isotope();
            };

            rbvost.renderView(viewData, "campaign-list.html", ".campaign-list-view", afterRender);
        },

        campaignsShouldFilter: function (e) {
            // toggle styling
            $(e.currentTarget).siblings().removeClass("active");
            $(e.currentTarget).addClass("active");

            // hide any active tooltips
            $(".tooltip .inner").hide();

            // run the isotope filters
            var query = $(e.currentTarget).data("filter");
            $(rbvost.isotopeEl).isotope({ filter: query });
        },

        tooltipShouldToggle: function (e) {
            e.stopImmediatePropagation();
            var tooltip = $(e.currentTarget).find(".inner");

            if ($(tooltip).is(":visible")) {
                $(tooltip).hide();
            } else {
                // hide any active tooltips
                $(".tooltip .inner").hide();
                $(tooltip).show();
            }
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
                    if (region.slug === "midlands") { region.title = "Midlands"; }

                    filters.regions.push(region);
                }
            });

            rbvost.renderView(filters, "calendar-filters.html", ".calendar-filters-view", false);
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

                    // All events are technically multi day, but we mock single day events by setting the start and end dates to be the same.
                    if (event.event_type === "Multi Day") {
                        thisEvent.startDate = event.event_start_date;
                        thisEvent.endDate = event.event_end_date;
                        thisEvent.prettyDate = moment(event.event_start_date).format("dddd Do MMMM YYYY") + " - " + moment(event.event_end_date).format("dddd Do MMMM YYYY");
                        thisEvent.prettyDateShort = moment(event.event_start_date).format("dddd Do") + " - " + moment(event.event_end_date).format("dddd Do");
                    } else {
                        thisEvent.startDate = event.event_date;
                        thisEvent.endDate = event.event_date;
                        thisEvent.prettyDate = moment(event.event_start_date).format("dddd Do MMMM YYYY");
                        thisEvent.prettyDateShort = moment(event.event_start_date).format("dddd Do");
                    }

                    thisEvent.location = event.event_location;
                    thisEvent.name = event.event_name;
                    thisEvent.campaign = campaign;
                    thisEvent.description = event.event_description;
                    thisEvent.images = event.event_images;
                    thisEvent.region = region;
                    thisEvent.target = target;
                    thisEvent.id = "" + (new Date().getTime()) + (Math.floor(Math.random() * 999999) + 1);
                    // push results to hoisted array
                    calendarEvents.push(thisEvent);
                });
            });

            console.log(calendarEvents);

            // now we have added our unique id to each event
            // we can cache the events object so we can use it later for the event popup
            rbvost.cache.events = calendarEvents;

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
                        multiDayEvents: {
                            startDate: "startDate",
                            endDate: "endDate"
                        },
                        lengthOfTime: {
                            months: 12,
                            startDate: rbvost.currentYear + "-01-01"
                        }
                    });

                    $(".calendar-view").fadeIn("fast");
                });

            }
        },

        calendarShouldFilter: function (e) {
            // first lets toggle the styling
            $(e.currentTarget).siblings().removeClass("active");
            $(e.currentTarget).addClass("active");

            // then we update our calendar settings object
            var type = $(e.currentTarget).data("type");
            var value = $(e.currentTarget).data("filter");
            rbvost.calendarFilters[type] = value;

            // now we can show all events, and then hide appropriate ones
            var clndr = $(".clndr");
            $(clndr).find(".day").removeClass("hidden-event");

            // loop through our filters and if they're not set to show all
            // find events that don't contain the fiter term and hide them
            _.each(rbvost.calendarFilters, function (filter) {
                if (filter !== "*") {
                    $(clndr).find(".event:not(" + filter + ")").addClass("hidden-event");
                }
            });
        },

        eventPopupShouldToggle: function (e) {
            var popup = $(e.currentTarget).find(".popup");

            if ($(popup).is(":visible")) {
                $(popup).hide();
            } else {
                // hide any active popups
                $(".clndr .popup").hide();
                $(popup).show();
            }
        },

        eventPopupShouldClose: function (e) {
            e.stopImmediatePropagation();
            $(e.currentTarget).parent().hide();
        },

        calendarOverlayShouldRender: function (e) {
            var events = rbvost.cache.events;
            var eventId = $(e.currentTarget).data("id");
            var thisEvent = { event: [] };

            thisEvent.event.push(_.findWhere(events, { id: eventId }));

            var afterRender = function () {
                $("#modal").fadeIn("fast");
                $(".flexslider").flexslider();
            };

            rbvost.renderView(thisEvent, "modal.html", ".modal-view", afterRender);
        },

        modalShouldClose: function () {
            $("#modal").fadeOut("fast");
        }

    };

    // DOM Ready
    $(function () { rbvost.init(); });
    // Images Loaded
    $(window).load(function () { rbvost.windowLoaded(); });
    // Window Resized (smart debounced event)
    $(window).bind("debouncedresize", function () { rbvost.windowResized(); });

} (jQuery));
