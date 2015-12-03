/*jslint indent: 2*/
/*global window, console, document, $*/

$(document).ready(function () {

  "use strict";

  J.host = "http://www.merilinmandel.com";

  // hide loadin + show app
  $("#loading").addClass("animated fadeOut").addClass("hidden");
  $("#app").removeClass("hidden").addClass("animated fadeIn");

  // get bloginfo and add it to header
  bloginfo().then(function (data) {
    var d = data;
    $(blogName).empty().append(d.name);
    $(blogDescription).empty().append(d.description);
  });

  function clearApp() {
    $(onePost).empty().hide();
    $(listPosts).empty().hide();
    $(e404).empty().hide();
    $('html,body').scrollTop(0);
  }

  // VIEWS - Front page view
  var listPostsView = function () {
    clearApp();
    $(listPosts).show('fadeIn');
    listPostsFunction();
  }

  // One post view
  var onePostView = function (id) {
    clearApp();
    $(onePost).show('fadeIn');
    onePostFunction(id);
  }

  // MODEL - Set up routes
  crossroads.addRoute('/', listPostsView);
  crossroads.addRoute('/{id}', onePostView);

  // Error 404
  crossroads.bypassed.add(function (request) {
    clearApp()
    e404.append("404")
  })

  // start routing
  J.route(crossroads);

  // CONTROLLERS, "/"
  function listPostsFunction() {
    get_posts().then(function (data) {
      var d = data
      $(listPosts).empty()
      for (var i = 0; i < d.length; i++) {
        $(listPosts).append("<a href='#/"+d[i].slug+"'><h3>"+ d[i].title +"</h3></a>");
        $(listPosts).append("<p>"+ d[i].excerpt +"</p>");
      }
    })
  }

  // Controller, "/{id}"
  function onePostFunction(id) {
    get_post(id).then(function (data) {
      if(data.length != 0) {
        var d = data[0]
        $(onePost).empty()
        $(onePost).append("<h2>"+d.title+"</h2>")
        $(onePost).append("<p>"+d.content+"</p>")
      } else {
        clearApp()
        $(e404).in()
      }
    })
  }
});
