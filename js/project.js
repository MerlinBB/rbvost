(function ($) {
    "use strict";

    var rbvost = {

        siteurl:    "http://127.0.0.1:8080/wordpress/",
        themeurl:   "http://127.0.0.1:8080/wordpress//wp-content/themes/rbvost/",
        cache: undefined,

        init: function () {
            this.setLoginForm();
            this.checkLoginError();

            $.ajax({
                url: rbvost.siteurl + "?json=1"
            })
            .done(function (data) {
                if (data) {
                    rbvost.cache = data;
                    rbvost.renderView();
                } else {
                    alert("please log in");
                }
                console.log(data);
            })
            .fail(function () {
                alert("error");
            });
        },

        renderView: function () {
            var data = rbvost.cache;
            $.get(rbvost.themeurl + "_template.html", function (template) {
                $("#app").html(
                    Mustache.render(template, data)
                );
                rbvost.bindUIActions();
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
