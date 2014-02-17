<?php
    get_header();

        if ( is_user_logged_in() ) { ?>

            <div id="app" class="container">
                <nav>
                    <div class="year-selector-view fl"></div>
                    <button data-navigate="campaign">Campaigns</button>
                    <button data-navigate="calendar">Calendar</button>
                </nav>

                <div class="switch-view campaign-filters-view"></div>
                <div class="switch-view campaign-list-view"></div>

                <div class="switch-view calendar-filters-view"></div>
                <div class="switch-view calendar-view"></div>
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
