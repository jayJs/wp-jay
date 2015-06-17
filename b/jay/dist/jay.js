/*jslint indent: 2*/
/*global window, console*/

window.J = (function ($) {
  'use strict';

  var jay = {

    get: function (table, limit, id) {
      var url = "/api/j/?table=" + table + '&id=' + id + '&limit=' + limit;
      if (J.host) { url = J.host + url; }

      return $.ajax({
        url: url,
        cache: true,
        dataType: 'jsonp',
        jsonp: "callback",
        type: 'GET',
        success: function (data) {
          return data;
        },
        error: function (error) {
          a(error.responseText);
          ce(error);
          return error;
        }
      });
    },

    post: function (table, data) {
      // TODO wait until access_token exists
      var url = "/api/j/?table=" + table + "&token=" + J.token + "&user=" + J.userId + "&type=short";
      if (J.host) { url = J.host + url; }

      return $.ajax({
        url: url,
        type: 'POST',
        processData: false,
        contentType: false,
        data: data,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (response) {
          if (response.objectId !== undefined) {
            //cl("post done" + response.objectId);
            return response;
          } else {
            cl("error - object not saved");
            cl(response);
          }
        },
        error: function (error) {
          a(error.responseText);
          ce(error);
          return error;
        }
      });
    },

    put: function (table, id, data) {

      var url = "/api/j/?table=" + table + '&id=' + id + '&data=' + data;
      if (J.host) { url = J.host + url; }

      return $.ajax({
        type: 'PUT',
        url: url,
        processData: false,
        contentType: false,
        data: data,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (data) {
          return data;
        },
        error: function (error) {
          a(error.responseText);
          cl(error);
          return error;
        }
      });
    },

    query: function (table, limit, key, value, order) {

      var url = "/api/j/query/?table=" + table + '&key=' + key + '&value=' + value + '&limit=' + limit + '&order=' + order;
      if (J.host) { url = J.host + url; }

      return $.ajax({
        url: url,
        cache: canCache(),
        dataType: 'jsonp',
        jsonp: "callback",
        type: 'GET',
        success: function (data) {
          return data;
        },
        error: function (error) {
          a(error.responseText);
          ce(error);
          return error;
        }
      });
    },

    save: function (table, formId, callback) {
      var clicked = false;
      $("#" + formId).on("submit", function (event) {
        event.preventDefault();
        if (clicked === false) {
          $("#pleaseWait").show();
          $("#" + formId + " input:submit").attr('disabled', 'disabled');
          var fd = J.prepareForm(formId);
          J.post(table, fd).then(function (data) {
            $("#" + formId + " input:submit").removeAttr('disabled');
            $("#pleaseWait").hide();
            callback(data);
          });
          clicked = true;
        }
      });
    },

    update: function (table, formId, objectId, callback) {
      var clicked = false;
      $("#" + formId).on("submit", function (event) {
        event.preventDefault();
        if (clicked === false) {
          $("#pleaseWait").show();
          $("#" + formId + " input:submit").attr('disabled', 'disabled');
          var fd = J.prepareForm(formId);
          J.put(table, objectId, fd).then(function (resp) {
            $("#" + formId + " input:submit").removeAttr('disabled');
            $("#pleaseWait").hide();
            callback(resp);
          });
          clicked = true;
        }
      });
    },

    isUser: function (isLoggedIn, notLoggedIn) {
      // if it's a user
      if (J.userId != undefined && J.userId !== false) {
        isLoggedIn();
        // if it's not a user or we are not sure yet
      } else {
        var i = 0;
        var getStatus = setInterval(function () {
          // is not a user
          if (J.userId === false) {
            notLoggedIn();
            clearInterval(getStatus);
          } else { // is a user or not sure yet
            // is a user
            if (J.userId !== undefined) {
              isLoggedIn();
              clearInterval(getStatus);
            } else {
              // FB is not yet available
              if(i === 40) { // turn off the search after 40 times
                notLoggedIn();
                a('Unable to authenticate. Refresh page to try again');
                clearInterval(getStatus);
              }
              i++;
            }
          }
        }, 200); // Ping every 200 ms
      }
    },

    addFB: function (fbAppId) {
      // Get FB SDK
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      // If FB SDK is loaded:
      window.fbAsyncInit = function() {

        // Initialise FB
        FB.init({
          appId      : fbAppId,
          xfbml      : true,
          version    : 'v2.2',
          status     : true
        });

        J.checkIn();
      }

      //  Fix facebook connect ""#_=_" direction
      if (window.location.hash && window.location.hash == '#_=_') {
        window.location.hash = '/';
      }

    },

    checkIn: function() {
      // See if user is logged in
      FB.getLoginStatus(function(response){
        if (response.status === 'connected') { // Logged into your app and Facebook
          J.userId = response.authResponse.userID;
          var access_token = response.authResponse.accessToken;
          ajax_send(access_token);
        } else if (response.status === 'not_authorized') { // The person is logged into Facebook, but not your app.
          console.log('Please log ' + 'into this app.');
          J.userId = false;
        } else { // Not logged into Facebook or app or something else
          console.log('Please log ' + 'into Facebook.');
          J.userId = false;
        }
      });

      // send access_token
      function ajax_send(access_token) {
        var ajax_object = {};

        ajax_object.access_token = access_token;
        ajax_object.type = "short";
        $.ajax({
            data: JSON.stringify(ajax_object),
            type: 'POST',
            url: "/auth/fb",
            dataType: 'jsonp',
            jsonp: "callback",
            success: function(data) {
              if (data.error == true) {
                J.token = false;
              }
              if (data.error == false) {
                J.token = data.token;
              }
            }
        });
      }
    },

    getBlobURL: function($input) {
      var file = $input[0].files[0];
      if(URL) { // this is for you, IE7, IE8
        var blob = URL.createObjectURL(file);
        if(blob) {
          return blob;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },


    detectFileUpload: function(){ // from: http://viljamis.com/blog/2012/file-upload-support-on-mobile/
      var isFileInputSupported = (function () {
        // Handle devices which falsely report support
        if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
         return false;
        }
        // Create test element
        var el = document.createElement("input");
        el.type = "file";
        return !el.disabled;
      })();

      if (isFileInputSupported) {
          return true;
        } else { // the browser does not support file="input"
          return false;
      }
    },

    // detect if the client can handle cache
    canCache: function (){
      if (navigator.userAgent.match(/(Windows Phone)/)) { // For a start, WinPhone can't handle it's cache
        return false;
      } else {
        return true;
      }
    },

    resetForm: function (formName) {
      $("#"+formName)[0].reset()
      $(".trumbowyg-editor").html("")
    },

    rebuildForm: function (formId, data) {
      $("#"+formId + " :input:not(:submit)").each(function(){
        var $field = $(this);
        if($field.attr("id") in data) {
          if($field.attr("type") === "text") {
            if ($field.hasClass("wysiwg")) {
              $field.parent().find(".trumbowyg-editor").html(data[$field.attr("id")])
              $field.val($(".trumbowyg-editor").html());
            } else {
              $field.val(data[$field.attr("id")])
            }
          }
          if($field.attr("type") === "file") {
            // todo
          }
        }
        // if it uses name instead if ID, like checkbox
        else if($field.attr("name") in data) {
          if($field.attr("type") === "checkbox") {
            // turn to array
            var toArray = data[$field.attr("name")].split(",");
            // find if current checkbox value is in array
            var findFromArray = toArray.indexOf($field.attr("value"));
            // if it is, then mark it as checked
            if(findFromArray != -1) {
              $field.prop('checked', true);
            }
          }
        }
      })
    },

    prepareForm: function (formId) {

      var checkboxes = [];

      var fd = new FormData();
      var titles = {};
      var $form = $("#"+formId);
      // go through form and get data
      $form.find("input, textarea").each(function(){
        var t = $(this);

        // handle input type text, file, submit differently;
        switch(t.attr("type")) {
        case "text":
        case "textarea":
        fd.append(t.attr("id"), t.val()); // add the value of the input
        titles[t.attr("id")] = $("label[for='"+this.id+"']").text(); // at the label to titles array
        break;

        case "hidden":
        fd.append(t.attr("name"), t.attr("value"));
        break;

        case "file":
        fd.append(t.attr("id"), this.files[0]); // add the value of the input
        titles[t.attr("id")] = $("label[for='"+this.id+"']").text(); // at the label to titles array
        break;

        case "checkbox":
        case "radio":
          if(t.prop("checked")) {
            if(typeof window[t.attr("name") + "_meta"] === "undefined") { // if array does not exist, create it
              window[t.attr("name") + "_meta"] = {};
            }
            if(typeof window[t.attr("name") + "_data"] === "undefined") { // if array does not exist, create it
              window[t.attr("name") + "_data"] = [];
            }

            window[t.attr("name") + "_meta"][t.attr("value")] = t.parent().text();
            window[t.attr("name") + "_data"].push(t.val());
          }
          if($.inArray(t.attr("name"), checkboxes) == "-1") { // if array name not there yet, add it to checkboxes array
            checkboxes.push(t.attr("name"));
          }
          break;

          case "submit":
          break;

          default:
          // if it's a textarea
          if (t.prop('tagName') === "TEXTAREA") {
            fd.append(t.attr("id"), t.val()); // add the value of the input
            titles[t.attr("id")] = $("label[for='"+this.id+"']").text(); // at the label to titles array
          }
          break;
        }
      });

      // gather all checboxes to formData
      for (var i = 0; i < checkboxes.length+1; i++) {
        var inputId = checkboxes[i];
        if(inputId) {
          var metaData = window[checkboxes[i]+"_meta"];
          var theData = window[checkboxes[i]+"_data"];
          metaData = JSON.stringify(metaData);
          fd.append(inputId+"_meta", metaData); // add the value of the input
          fd.append(inputId, theData); // add the value of the input
          titles[inputId] = $("label[for='"+inputId+"']").text(); // at the label to titles array
          if(window[inputId]) window[inputId].length = 0;
        }
      }
      checkboxes.length = 0;

      titles = JSON.stringify(titles);
      fd.append("titles", titles); // add titles to fd

      return fd;
    },

    html5: function(choice){
      if(choice === true) {
        $("body").on("click", "a", function (event) {
          if($(this).attr("target") != "_blank") {
            event.preventDefault()
            //  get the original URL from link
            var originalUrl = $(this).attr("href");
            // get current URL
            var host = window.location.protocol + "//" + window.location.host
            var href = window.location.href
            // Make sure it isn't already a correct url
            if(href.charAt(host.length+1) === "#") {
              // there already is a hash at the correct place, so don't to anything
            } else  { //  if browser supports pushState, remove piece of old URL and put just what was after hashtag.
              if (window.history && window.history.replaceState) {
                var hashTagBack = host + "/#" + window.location.pathname;
                history.replaceState("", document.title, hashTagBack);
              } else {   // It's an old browser, so we downgrade to just normal links.
                if(originalUrl === "#" || originalUrl === "#/") {
                  window.location = host;
                } else {
                  window.location = href;
                }
              }
            }
            window.location = originalUrl;
          }
        })
      }
    },

    removeHash: function(){
      var host = window.location.protocol + "//" + window.location.host
      var _hashValRegexp = /#(.*)$/;
      var result = _hashValRegexp.exec(hasher.getURL());
      if(result) {
        if (window.history && window.history.pushState) {     //
          window.history.pushState("", document.title, host + result[1]);
        } else {
          window.location = result[1];
        }
      }
    },

    route: function (crossroads) {
      //setup hasher
      // hasher let's you know when route is changed
      function parseHash(newHash, oldHash){
        if(J.html5 === true) {
          J.removeHash(); // if HTML5 mode is on, remove hash from URL
        }
        crossroads.parse(newHash);
      }
      hasher.initialized.add(parseHash); //parse initial hash
      hasher.changed.add(parseHash); //parse hash changes
      hasher.init(); //start listening for history change
    }
  }

  $(".wysiwg").trumbowyg({
    autogrow: true,
    btns: ['bold', 'italic', 'link', 'unorderedList'],
    fullscreenable: false,
    removeformatPasted: true,
  });

  $.fn.hide = function(transition) {
    return this.each(function() {
      var elem = $( this );
      if (transition === undefined) {
        elem.addClass("hidden");
      } else {
        elem.addClass("animated " + transition).addClass("hidden");
        elem.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          elem.removeClass("animated " + transition);
        });
        //setTimeout(function(){ elem.removeClass("animated " + transition) }, 2000);
      }
      return this;
    });
  }

  $.fn.show = function(transition) {
    return this.each(function() {
      var elem = $( this );
      if (transition === undefined) {
        elem.removeClass("hidden");
      } else {
        elem.removeClass("hidden").addClass("animated " + transition);
        elem.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          elem.removeClass("animated " + transition);
        });
        //setTimeout(function(){ elem.removeClass("animated " + transition) }, 2000);
      }
      return this;
    });
  }

  return jay;
}(jQuery));

/*
  Add some shortcuts to make life sweeter
*/

function cl(data) { // shortcut for console.log
  if (typeof console === "undefined") {
    // I'm so failing sailently
  } else {
    console.log(data);
  }
}

// shortcut for console.error
function ce(data) {
  if (typeof console === "undefined") {   // IE only allows console if developer window is open.
    // I'm so failing sailently
  } else {
    console.error(data);
  }
}

// write to alert
function a(message) {
  $("#alert").remove();
  $("body").append('<div id="alert" style="z-index: 10; margin-left: auto;  margin-right: auto; left: 0; right: 0;"><button type="button" class="close" style="opacity: 1;  z-index: 11;  position: relative; color: #fff;  margin-right: 15px; margin-top: 7px; font-size: 23pt; text-shadow: none;" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><div id="alertMessage" class="alert alert-black alert-dismissible" role="alert">'+message+'</div></div>')
}
