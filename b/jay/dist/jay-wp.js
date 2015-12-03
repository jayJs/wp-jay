"use strict";

function get_posts() {
  var url = "wp-json/posts";
  if (J.host) { url = J.host + url; }

  return $.ajax({
    url: url,
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
  var url = "wp-json/posts?filter[name]="+id;
  if (J.host) { url = J.host + url; }

  return $.ajax({
    url: url,
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
  var url = "wp-json/";
  if (J.host) { url = J.host + url; }

  return $.ajax({
    url: url,
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
