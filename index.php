<?php
    get_header();

        if ( is_user_logged_in() ) { ?>

            <div id="app">
                <nav>
                    <button data-navigate="campaign">Campaigns</button>
                    <button data-navigate="calendar">Calendar</button>
                </nav>
                <div class="year-selector-view"></div>

                <div class="switch-view campaign-filters-view"></div>
                <div class="switch-view campaign-list-view"></div>

                <div class="switch-view calendar-filters-view"></div>

                <div class="switch-view calendar-view">
                    <div class="calendar-subview-1"></div>
                    <div class="calendar-subview-2"></div>
                    <div class="calendar-subview-3"></div>
                    <div class="calendar-subview-4"></div>
                    <div class="calendar-subview-5"></div>
                    <div class="calendar-subview-6"></div>
                    <div class="calendar-subview-7"></div>
                    <div class="calendar-subview-8"></div>
                    <div class="calendar-subview-9"></div>
                    <div class="calendar-subview-10"></div>
                    <div class="calendar-subview-11"></div>
                    <div class="calendar-subview-12"></div>
                </div>
            </div>

        <?php } else {

            echo '<div class="login-container">';
                $args = array(
                    'echo' => true,
                    'redirect' => site_url( '/' ),
                    'label_log_in' => __( 'Login' ),
                    'value_username' => NULL
                );
                wp_login_form( $args );
            echo "</div>";

        }

    get_footer();
?>
