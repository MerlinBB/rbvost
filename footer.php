<?php include("inc/redbullfooter.html"); ?>

<div id="modal" class="modal">
    <div class="container">
        <div class="modal-view"></div>
    </div>
</div>

<?php
    $production = true;
    $theme = get_template_directory_uri();

    // if we're in production mode, include minified concatenated script
    // if not then pull them in unminified individually for easier debugging
    if ($production) {

        echo '<script src ="' . $theme . '/js/production.js"></script>';

    } else {

        echo '<script src ="' . $theme . '/js/bower/jquery/jquery.js"></script>';
        echo '<script src ="' . $theme . '/js/bower/modernizr/modernizr.js"></script>';
        echo '<script src ="' . $theme . '/js/bower/jquery-smartresize/jquery.debouncedresize.js"></script>';
        echo '<script src ="' . $theme . '/js/bower/underscore/underscore.js"></script>';
        echo '<script src ="' . $theme . '/js/bower/moment/moment.js"></script>';
        echo '<script src ="' . $theme . '/js/bower/eventEmitter/EventEmitter.js"></script>';
        echo '<script src ="' . $theme . '/js/bower/imagesloaded/imagesloaded.js"></script>';
        echo '<script src ="' . $theme . '/js/bower/isotope/jquery.isotope.js"></script>';
        echo '<script src ="' . $theme . '/js/bower/clndr/src/clndr.js"></script>';
        echo '<script src ="' . $theme . '/js/bower/flexslider/jquery.flexslider.js"></script>';
        echo '<script src ="' . $theme . '/js/project.js?' . date('l jS \of F Y h:i:s A') . '"></script>';

    }
?>
<?php wp_footer(); ?>


</body>
</html>
