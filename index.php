<?php
    get_header();

        if ( is_user_logged_in() ) {

            echo '<div id=app></div>';

        } else {

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
