<?php
  add_action( 'init', 'setPermalinks' );
  function setPermalinks() {
    global $wp_rewrite;
    $wp_rewrite->set_permalink_structure( '/#/%postname%/' );
  }
?>
