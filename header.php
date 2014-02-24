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

    <title>Red Bull Student Team</title>

    <link rel="stylesheet" type="text/css" media="all" href="<?php echo get_stylesheet_uri(); ?>"/>

    <?php // RB global footer styles and fonts ?>
    <link href="https://create.redbull.com/cs/RedBull2/stylesheets/shared-modules/shared-footer-20130829100721.css" media="screen" rel="stylesheet" type="text/css" />
    <link href="https://create.redbull.com/cs/RedBull2/stylesheets/shared-modules/shared-footer-desktop-20130829100721.css" media="only screen and (min-width: 640px)" rel="stylesheet" type="text/css" />

    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>"/>
    <link rel="icon" type="image/png" href="<?php bloginfo('template_url'); ?>/img/favicon.png">

    <?php wp_head(); ?>

</head>

<?php
    // pull in a random background image
    $rows = get_field('background_image', 'option'); // get all the images
    $rand_row = $rows[ array_rand( $rows ) ]; // get random row
    $rand_image = $rand_row['image']; // get image from row
?>

<body <?php body_class(); ?> style="background-image:url(<?php echo $rand_image; ?>);">

<?php include("inc/redbullheader.html"); ?>
