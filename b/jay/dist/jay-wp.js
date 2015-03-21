"use strict";

function get_posts() {
  return $.ajax({
    url: "wp-json/posts",
    success: function(data){
      return data;
    },
    error: function(error) {
      a(error.responseText);
      ce(error);
      return error;
    }
  });
}

function get_post(id) {
  return $.ajax({
    url: "wp-json/posts?filter[name]="+id,
    success: function(data){
      return data;
    },
    error: function(error) {
      a(error.responseText);
      ce(error);
      return error;
    }
  });
}

function bloginfo() {
  return $.ajax({
    url: "wp-json/",
    success: function(data){
      return data;
    },
    error: function(error) {
      a(error.responseText);
      ce(error);
      return error;
    }
  });
}



(function ( $ ) {



}( jQuery ));
