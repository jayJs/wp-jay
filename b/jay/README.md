
##Goals:  
* High browser compatibility  
* fast project start time  
* fast development time  
* good code maintainability  

The focus is to provide superfast prototyping possibilities for building Minimum Viable Products.  

##Installation  
```
bower install jay
```  
or download [jQuery](http://jquery.com/download/), [Bootstrap](http://getbootstrap.com/getting-started/#download), [Hasher](https://github.com/millermedeiros/hasher/), [Crossroads](http://millermedeiros.github.io/crossroads.js/) and [Jay](https://github.com/jayJs/jay/archive/master.zip)  
```
// Add CSS to header
<link rel="stylesheet" href="/bower_components/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/bower_components/bootstrap/dist/css/bootstrap-theme.min.css">
<link rel="stylesheet" href="/bower_components/animate.css/animate.min.css">
<link rel="stylesheet" href="/bower_components/trumbowyg/dist/ui/trumbowyg.min.css">

// Add javascript right to the end of file before the closing </body> tag

// Easy way:  (all of the same files as debuggers way, but minified and uglified)
<script src="/bower_components/jquery/dist/jquery.min.js"></script>  
<script src="/bower_components/jay/dist/jay_and_all_dependencies.min.js"></script>  

// or the debuggers way:  
<script src="/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="/bower_components/js-signals/dist/signals.min.js"></script>
<script src="/bower_components/hasher/dist/js/hasher.min.js"></script>
<script src="/bower_components/crossroads/dist/crossroads.min.js"></script>
<script src="/bower_components/trumbowyg/dist/trumbowyg.min.js"></script>
<script src="/bower_components/jay/dist/jay.js"></script>
```
If you plan to use Facebook SDK, put this into html head like this
```
<script>
  var fbAppId = "756437764450452"
</script>
```

##jQuery  
Jay is a shorthand for jQuery. You can safely use all of jQuery in Jay.  

##Selectors  
Jay encourages you to use $(foo) instead of $("#foo").  
It's 3 letters less and jQuery supports this out of the box.  

##show() & hide()  
Overwrites jQuery show() and hide() with a little bit less jumpy solution for this.  
Now they also take an optional argument for a [animate.css](http://daneden.github.io/animate.css/) animation.  
```
$(hello).show();
$(hello).show("bounce")   // comes in with animate.css animation called "bounce"
```
It's basically just a shorthand for adding / removing class "hidden" and optionally adding an animation.  
```
// both do the same thing:
$("#loading").addClass("animated fadeOut").addClass("hidden");
$(loading).out('fadeOut');
```

##Model: Routing  
To fetch data from URL we use routing from Crossroads JS.  
If a route is matched, a View function is called.
```
// Set routes
crossroads.addRoute('/', frontPageView);
crossroads.addRoute('/admin', adminPageView);

// Start routing
J.route(crossroads);
```

##Views  
The View includes information about what to turn on or off on the page and calls a Controller function.  
Views have to be declared before Models.  
```
var frontPageView = function () {
  $(otherPageView).hide();
  $(adminPageView).hide();
  $(frontPage).show();
  frontPageFunction();
}
```
One thing that might struck odd, is that you have to hide old things before you can show new things.  
The upside of this is that contemporary apps do not always rely on menus, it's rather a random thing turning other random things on and off.

**Controllers**  
A controller function is the best place to keep all the logic functions (like "Get latest posts from database") for this route.   This way you can keep your functions available to the relevant scope and all your logic in one place.  

```
function frontPageFunction() {
  $.ajax({
    url: "/api/posts",
    success: function(data){
      // do something with the data
      },  
      fail: function(error) {
        // show an error
      }
    });
  }
```

![is the user logged in?](http://i.imgur.com/rlWjEMH.png)  


##Authentication
**Facebook SDK**

If fbAppId is set before Jay is loaded, the whole Facebook SDK is added to the site.

If you want to use it for authentication, [jay-npm](https://github.com/jayJs/jay-npm) is currently required.

You can add fbAppId like this to HTML:  
```
<script>
  // test account for jay, works on localhost:5000
  var fbAppId = "756437764450452" // if fbAppId is undefined, FB SDK is not added
</script>
```
Jay loads the whole Facebook SDK for you.
Users who have authorized the Facebook app receive a client ID (available as J.userId) and a token (available as J.token) that enables them to send data to the server.  

**NB!**
Starting version 1.0 you just use this in your JS:
```
J.addFB(756437764450452);
```


**J.isUser()**  
isUser() provides the possibility to apply different commands to anonymous or logged-in users. isUser() determines that you are logged in before executing the functions. J.userId contains the user Facebook ID.

A user is logged in if its logged in to Facebook and a user of a Facebook app.  
(Keep in mind that Facebook apps only work if the Settings -> Site URL matches your URL).  
```
function isLoggedIn() {
  $(logInBox).hide();
  $(logOutBox).show();  
  $(content).append("Your user id is: " + J.userId);
}

function isNotLoggedIn() {
  $(logOutBox).hide();  
  $(logInBox).show();
}

J.isUser(isLoggedIn, isNotLoggedIn);  

```
OR
```

J.isUser(function() { // logged in users
  $(logInBox).hide();
  $(logOutBox).show();  
  $(content).append("Your user id is: " + J.userId);
  }, function (){ // not logged in users
    $(logOutBox).hide();  
    $(logInBox).show();
  }
);  
```

**Facebook SDK debugging**  
Keep in mind, that if you use it for authenthication then there also has to be a backend - like jay-npm - which also needs the credidetials.

In order to make FB authentication work outside localhost, you have to set the FB app status to "Live".  
In order to do this you need to enter your e-mail here:
https://developers.facebook.com/apps/1652366571652103/settings/  

and turn the switch here:  
https://developers.facebook.com/apps/1652366571652103/review-status/  

Sometimes it's not FB, it's Parse.com.

##Little helpers  

##.wysiwg  
If you add class .wysiwg to a textarea, then it will automatically turned into a WYSIWG editor.  
Such editor is aknologed by prepareForm() and rebuildForm().  

##cl(message)  
A shortcut for console.log(message);  
```
console.log(message); // this logs the message to the console
cl(message); // this does exactly the same thing
```

##a(message)  
Display an alert to the users.
```
a("Log in failed");
```  

##J.getBlobURL(elementId)  
In case the browser supports it, gets the URL of the blob of the image attached to the element.  
Otherwise returns false.  
Can be useful for creating previews of images the user has submitted.  
```  
$('#image').change(function(){  
  var blob = J.getBlobURL($(this));
  if(blob != false) {
    $(imagePreview).css("background-image", "url("+blob+")")
  }
})
```  

##J.detectFileUpload()  
Does the browser supports file uploading at all?  
Returns true or false.  
Since the early smartphones did not support file uploading via browsers, it might make debugging your webapp painfull (example - the user reports, that he just clicks on the button and nothing happends).  
detectFileUpload() can help you detect the problem and alert the user.
Update: Added detection for iOs 8.0.0 & 8.1.1 which under favorable terms might support file uploads but usually not.  
```  
var canUploadFiles = J.detectFileUpload();
if(canUploadFiles === false) {
  alert("This browser does not support file uploads");
}
```  

##J.canCache()  
Detect if the client can handle cache.  
Returns true or false.
The reason for this is, that some browsers (looking at you, winphone) just can't handle their cache.
Currently it's used internally inside the get() function.  


##J.resetForm('formId')  
Resets elements in the form in a way a reset form button would.  
Currently handles input type text, checkbox, radio, file and textareas.  
Useful since Single Page Apps itself don't refresh the form after submitting.  
```  
J.resetForm("addPostForm");
$(imagePreview).css("background-image", "")
```  

##Use without /#/ in URL  
**beta**  
Since v0.7 Jay supports URL-s without /#/.
In order to use it set J.html5 to true in the beginning of your HTML.  
```
//HTML:
var J = {}
J.html5 = true;
```
This makes it basically work.  
Other things to keep in mind.
1. Hasher might not always read URL-s without hashtags present. For that please find Shredder in the extra folder of Jay. It's basically Hasher but with a little hack to also support URL-s without hashtags.  
2. Make sure your server is not just serving the html to ("/"), but rather to ('*').  

Starting version 1.0 you would do this in your script:  
```
J.html5 = true;
```

##CRUD  
requires [Jay-npm](https://github.com/jayJs/jay-npm)  

Jay features a wrapper for common AJAX REST API calls.  
Calls ($.ajax JSONP) are made to address "/api/j".  

**J.post(table, data)** -  add a row to database.  
**J.get(table, limit, objectId)** - get a row from database. If limit is 1, add objectId, else <limit> last posts are queried.  
**J.put(table, objectId, data)** - update a row in database.
**J.query(table, limit, key, value, order)** - Query for data.  

**J.save(table, formId)** - Save data data from form to database.  
**J.update(table, formId, objectId)** - Update data from formId to table in objectId via a $.ajax JSONP call.  
The calls are asynchronous and can be chained with .then().  
With saveForm() and updateForm() callback approach can be used.  

**saveForm(Table, formId, callback)** - save() + some clever things Single Page Apps require you to do. Since version 1.0 this is all done with just using save().  

**updateForm(Table, formId, objectId, callback)** - Same as saveForm(), but for updating data.  Since version 1.0 this is all done with just using update().  


##J.post(table, data)  
**Add a row to database via a $.ajax JSONP call.**  
table - name of the table in database (*string*).  
data - data to be saved (*FormData*).

Returns objectId of saved data.

```
var data = new FormData();

var key = "title"; // if key does not exist in the table, it will be created automatically.
var value = "What the f*ck is FormData?"

data.append(key, value); // add the value of the input

J.post("Posts", data).then(function(response) {  
  if(response.objectId != undefined) {
    console.log("Object created: " + response.objectId);
  }
}
```
There's an easier way to achieve this with save(). Scroll a bit down.  


##get(table, limit, objectId)  
**Get a row from database via a $.ajax JSONP call**  
table - name of the table in database (*string*).  
limit - if limit is 1, objectId will be use the get the precise object. In any other case the last posts from the table will be retrieved.  
objectId - Id of object in database (*string*).  

Returns object with the data.  

```
J.get("Posts", 1, "378QWha5OB").then(function(data) {
  console.log(data);
}
```
would return
```
{
  objectId: "378QWha5OB",
  title: "What is FormData?",
  content: "What the user submitted",
  updatedAt: "2015-01-24T13:53:38.498Z",
  createdAt: "2015-01-24T13:53:37.745Z",
  titles: {
    content: "Please write something",
    title: "The title"
  }
}
```

##J.put(table, objectId, data)  
**Update a row in database via a $.ajax JSONP call.**  
table - name of the table in database (*string*).  
objectId - Id of object in database (*string*).  
data - the data to be changed (*object*)  

Returns updatedAt from the update row.

```
var update = {
  content: "I have IE9, I have no idea what FormData is."
}
J.put("Posts", "378QWha5OB", update).then(function(data) {
  cl(data.updatedAt);  
});
```

##save(table, formId)  
**Save data from form to database via a $.ajax JSONP call.**  
table - name of the table to save this data (*string*).  
formId - id of form, where the data comes (*string*).  

Save also disables all <input type="submit"> type elements in the form and shows an upload progress in the bottom of the screen.

HTML:
```
<form id="addNgoForm">
  <p>
    <label for="addNgoName">Name:</label><br />
    <input id="addNgoName" type="text" class="form-control" /><br />
  </p>
  <p>
    <label for="addNgoType">Type:</label><br />
    <label><input type="checkbox" name="addNgoType" value="1">Apples</label><br>
    <label><input type="checkbox" name="addNgoType" value="2">Oranges</label><br>
    <label><input type="checkbox" name="addNgoType" value="3">Grapes</label><br>
  </p>
</form>
```
JS:
```
J.save("TableName", "addNgoForm");
```
Would save the contents of the form to table called TableName.  
The table would have only three columns:  
1. one with a title "addNgoName"  
2. Second with a title "addNgoType", user selection as array.  
3. Last for metadata. It's currently saved to column called "titles".  
With the above sample form it would save this:  
```
{"addNgoName":"Name:", "addNgoType":"Type:"}
```

HTML  
```
<form id="addPost">
  <p>
    <label for="title">The title</label><br />
    <input id="title" type="text" class="form-control" /><br />
  </p>
  <p>
    <label for="content">Please write something</label><br />
    <textarea id="content" type="text" class="form-control"></textarea><br />
  </p>
  <input class="btn button" type="submit">
</form>

```
**input, textarea** - id is used as key. If such key does not exist, it will be created.  
**user input** - is saved as value.  
**label** - if attribute "for" matches with input id, the label value is saved to *titles* array.  

```
addPost.on("submit", function() {
  J.save('Posts', 'addPost');  
})

```
Submitting saves contents from form with id addPost to table "Posts".

##J.update(table, formId, objectId)  
**update data from formId to table in objectId via a $.ajax JSONP call.**  
table - name of the table to save this data (*string*).  
formId - id of form, where the data comes (*string*).  
objectId - object to be updated (*string*).  

update() acts the same as save() the only difference being, it updates instead of creates a new post.  

##J.query(table, limit, key, value, order)  
**Query for data.**  
table - name of the table to save this data (*string*).  
limit - how many results shoult it return (*number*).  
key - What key to search for (*key*).  
value - What value to search for (*string*).  
order - what's the order (*string*).  

Search from table Posts, where "features" is true, get 2 results in the order hoe they were created:
```
J.query("Posts", 2, "featured", "true", 'createdAt').then(function(d){
  cl(d);
});
```

##saveForm(Table, formId, callback)
saveForm performs the same things as save() combined with handling all the stupid things you need to know with Single Page Apps forms, most notably preventing same click from triggering multiple events.  
Returns response from save() - if post was successful, this contains an objectId.
```
saveForm("Posts", 'addPostForm', function(data){
  window.location = "#/p/" + data.objectId;
});
```
**NB!** Since version 1.0 this is all done with just using save().  

##J.updateForm(Table, formId, objectId, callback)
updateForm performs the same things as update() combined with handling all the stupid things you need to know with Single Page Apps forms, most notably preventing same click from triggering multiple events. Returns response from update() - if update was successful, this contains the new updatedAt value.
```
updateForm("Posts", 'addPostForm', id, function(data){
  window.location = "#/p/" + id;
});
```
**NB!** Since version 1.0 this is all done with just using update().  

##J.rebuildForm('formId', data)  
If in from there exists an input with the same name as a key in data, the value from the data will be appended to the input.  
```  
function editPostFunction(id){
  J.resetForm("addPostForm"); // search resetForm from this Readme
  get("Posts", 1, id).then(function(data){
    var d = data[0];
    J.rebuildForm("addPostForm", d);
    // rebuildForm() does not take input="file" yet, so:
    if(d.image && d.image.url) { $(imagePreview).css("background-image", "url("+d.image.url+")"); }
  })
  saveForm("Posts", 'addPostForm', id); // search saveForm() from this Readme.  
}
```
##J.prepareForm('formName')  
Turns from contents into FormData. Used internally by save() and update():
```  
function save(table, formName) {
  fd = prepareForm(formName);
  return post(table, fd).then(function(data){
    return data;
  });
}
```  

##Compability  
Visit the site - compatible until IE 6. We use [latest jQuery version 1.x](http://jquery.com/browser-support/).  
Post data - compatible until IE 10. The bottleneck is [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData#Browser_compatibility).  

##Why?  

I've built more then 10 MVP-s in the past and I'm still maintaining quite a number of them.  
After some time I've found the code getting cluttered, some things not working in some browsers and myself doing the same mistakes over and over again.  

A Single Page App (SPA) architecture relying on a REST API has become my weapon of choice. The jQuery part I did not choose, this is derived from all of the clients who cannot choose their browsers. Nevertheless, a SPA architecture with jQuery can cause quite a lot of stress, especially when I try to add new features later on. To quote a former coworker - this javascript thing can become a flea circus real easy.  

The name J or Jay is a wordplay with the name jQuery. The idea of Jay is to be a shorthand for most common things that people might use jQuery for Single Page Applications.  
I also like Jay-Z.  

##Deprecated  
**foo === $("#foo").**  
Since v0.7 we dropped support for this and encourage you to use $(foo).  
This works by default with jQuery and is more compatible towards old browsers.  

**in() & out().**  
Not in use since v0.7.  
The reason for this is that in is an ECMAscript reserved keyword.  
We just did not notice it before, but IE8 started to cry over this.  
So we decided to go for overwriting jQueries show() and hide().  


##Licence

The MIT License (MIT)

Copyright (c) 2015 Martin Sookael  

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
