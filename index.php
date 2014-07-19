<?php
    get_header();

        if ( is_user_logged_in() ) { ?>

            <div class="container">
                <div id="app" class="app">

                    <div class="alert hidden">Sorry, you've entered an incorrect username or password.</div>

                    <nav class="app-menu cf">
                        <div class="year-selector-view fl"></div>
                        <button class="menu-item current fl" data-navigate="target">Targets</button>
                        <button class="menu-item fl" data-navigate="campaign">Campaigns</button>
                        <button class="menu-item fl" data-navigate="calendar">Calendar</button>
                        <a class="menu-item fr" href="<?php echo wp_logout_url( home_url() ); ?>">Log Out</a>
                    </nav>

                    <div class="switch-view targets-view"></div>

                    <div class="switch-view campaign-filters-view"></div>
                    <div class="switch-view campaign-list-view"></div>

                    <div class="switch-view calendar-filters-view"></div>
                    <div class="switch-view calendar-view"></div>
                </div>
            </div>

        <?php } else { ?>

            <div class="login-container">
                <form name="loginform" id="loginform" action="<?php echo home_url('/wp-login.php'); ?>" method="post" autocomplete="off">

                    <div class="form-group">
                        <label for="user_login">Username</label>
                        <input type="text" name="log" id="user_login" class="text-input username" placeholder="Username">
                        <i class="fa fa-user"></i>
                    </div>

                    <div class="form-group">
                        <label for="user_pass">Password</label>
                        <input type="password" name="pwd" id="user_pass" class="text-input password" placeholder="Password">
                        <i class="fa fa-lock"></i>
                    </div>

                    <div class="login-remember">
                        <label><input name="rememberme" type="checkbox" id="rememberme" value="forever">Remember Me</label>
                    </div>

                    <input type="submit" name="wp-submit" id="wp-submit" class="login-submit" value="Login">
                    <input type="hidden" name="redirect_to" value="<?php echo home_url('/'); ?>">

                </form>
            </div>

        <?php }

    get_footer();
?>
