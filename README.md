#rbVOST

Repository online at - https://github.com/MerlinBB/rbvost
Please contact Merlin Mason for push access.

A webapp built from a WordPress backend using a custom version of the WordPress JSON API plugin. Pages are rendered with Underscore templating from html partials.

- Theme is built from: https://github.com/MerlinBB/wp-starter
- Powered with a fork of the wp-json-api: https://github.com/MerlinBB/wp-json-api

##Data Structure

    years     -> wp parent category (if there's no parent we assume it's a year)
    targets   -> wp child category (if it has a parent we assume it's a target)
    campaigns -> wp post
    events    -> ACF repeater field in wp post
