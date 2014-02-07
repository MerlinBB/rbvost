<?php
    get_header();

        if ( is_user_logged_in() ) { ?>

            <div id="app">
                <div class="campaign-filters-view"></div>
                <div class="campaign-list-view"></div>
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
