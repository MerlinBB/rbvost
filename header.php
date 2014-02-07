<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>

    <!-- Meta tags -->
    <meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="HandheldFriendly" content="true">

    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="format-detection" content="telephone=no"/>

    <meta name="description" content="">

    <title><?php wp_title('|', true, 'right'); bloginfo('name'); ?></title>

    <link rel="stylesheet" type="text/css" media="all" href="<?php echo get_stylesheet_uri(); ?>"/>

    <?php // RB global footer styles and fonts ?>
    <link href="https://create.redbull.com/cs/RedBull2/stylesheets/shared-modules/shared-footer-20130829100721.css" media="screen" rel="stylesheet" type="text/css" />
    <link href="https://create.redbull.com/cs/RedBull2/stylesheets/shared-modules/shared-footer-desktop-20130829100721.css" media="only screen and (min-width: 640px)" rel="stylesheet" type="text/css" />
    <!--[if lte IE 8]>
      <link href="/cs/RedBull2/stylesheets/shared-modules/shared-footer-IE-lte8-20130829100721.css" media="screen" rel="stylesheet" type="text/css" />
    <![endif]-->

    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>"/>
    <link rel="icon" type="image/png" href="<?php bloginfo('template_url'); ?>/img/favicon.png">

    <?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>

<?php include("inc/redbullheader.html"); ?>

<div class="alert hidden">
    Sorry, you've entered an incorrect username or password.
</div>
