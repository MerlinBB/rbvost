<?php

    // stop wordpress from loading it's own version of jQuery
    function wpstarter_custom_js() {
        wp_deregister_script('jquery');
    }
    if (!is_admin()) add_action('wpstarter_enqueue_scripts', 'wpstarter_custom_js', 11);


    // Add ACF content to JSON API
    add_filter('json_api_encode', 'json_api_encode_acf');

    function json_api_encode_acf($response)
    {
        if (isset($response['posts'])) {
            foreach ($response['posts'] as $post) {
                json_api_add_acf($post); // Add specs to each post
            }
        }
        else if (isset($response['post'])) {
            json_api_add_acf($response['post']); // Add a specs property
        }

        return $response;
    }

    function json_api_add_acf(&$post)
    {
        $post->acf = get_fields($post->id);
    }


    // Stop WordPress spitting out RedBull confidential stuff in feeds
    remove_action( 'wp_head', 'feed_links_extra', 3 ); // extra feeds such as category feeds
    remove_action( 'wp_head', 'feed_links', 2 ); // general feeds: Post and Comment Feed
    remove_action( 'wp_head', 'rsd_link'); // link to the Really Simple Discovery service endpoint, EditURI link
    remove_action( 'wp_head', 'wlwmanifest_link'); // link to the Windows Live Writer manifest file.
    remove_action( 'wp_head', 'index_rel_link'); // index link
    remove_action( 'wp_head', 'parent_post_rel_link'); // prev link
    remove_action( 'wp_head', 'start_post_rel_link'); // the start link
    remove_action( 'wp_head', 'adjacent_posts_rel_link'); // relational links for the posts adjacent to the current post.


    // only I need to see the ACF stuff :)
    function remove_acf_menu() {
        $admins = array('merlin');
        $current_user = wp_get_current_user();
        if( !in_array( $current_user->user_login, $admins ) ) {
            remove_menu_page('edit.php?post_type=acf');
        }
    }
    add_action( 'admin_menu', 'remove_acf_menu' );


    // if login is incorrect, stop users going to the admin section
    add_filter('login_redirect', '_catch_login_error', 10, 3);

    function _catch_login_error($redir1, $redir2, $wperr_user)
    {
        if(!is_wp_error($wperr_user) || !$wperr_user->get_error_code()) return $redir1;

        switch($wperr_user->get_error_code())
        {
            case 'incorrect_password':
            case 'empty_password':
            case 'invalid_username':
            default:
                wp_redirect('/?login-failed'); // modify this as you wish
        }

        return $redir1;
    }


    // Customise the footer in admin area
    function wpfme_footer_admin () {
        echo 'Created with love &amp; Red Bull.';
    }
    add_filter('admin_footer_text', 'wpfme_footer_admin');


    // From wpfunction.me

    // Remove the admin bar from the front end
    add_filter( 'show_admin_bar', '__return_false' );


    // Call Googles HTML5 Shim, but only for users on old versions of IE
    function wpfme_IEhtml5_shim () {
        global $is_IE;
        if ($is_IE)
        echo '<!--[if lt IE 9]><script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script><![endif]-->';
    }
    add_action('wp_head', 'wpfme_IEhtml5_shim');


    // Remove the version number of WP
    // Warning - this info is also available in the readme.html file in your root directory - delete this file!
    remove_action('wp_head', 'wp_generator');


    // Obscure login screen error messages
    function wpfme_login_obscure(){ return '<strong>Sorry</strong>: Think you have gone wrong somwhere!';}
    add_filter( 'login_errors', 'wpfme_login_obscure' );


    // Disable the theme / plugin text editor in Admin
    define('DISALLOW_FILE_EDIT', true);

?>
