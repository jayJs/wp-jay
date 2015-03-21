
##Goals:  
* High browser compatibility  
* fast project start time  
* fast development time  
* good code maintainability  


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

// Add javascript right to the end of file before the closing </body> tag
<script src="/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="/bower_components/js-signals/dist/signals.min.js"></script>
<script src="/bower_components/hasher/dist/js/hasher.min.js"></script>
<script src="/bower_components/crossroads/dist/crossroads.min.js"></script>
<script src="/bower_components/jay/jay.js"></script>
```
Put your fbAppId into html head like this
```
<script>
  var fbAppId = "756437764450452"
</script>
```

##jQuery  
Jay is a shorthand for jQuery. You can safely use all of jQuery in Jay.  

##Templating  
Put all design templates into one index.html file and make them invisible.  
Jay relies on Bootstrap class "hidden".
```
<div id="frontPageView" class="hidden"></div>
<div id="otherPageView" class="hidden"></div>
```

##Selectors  
Jay takes every class and id on your index.html and creates a variable with their name.  
```
// Remember when you did:
$("#hello").show();

// how about
hello.show();
```

##in() & out()  
For showing and hiding elements, we have in() & out().
They also take an optional argument for a [animate.css](http://daneden.github.io/animate.css/) animation.
```
$("#hello").in();   // this is exactly the same
hello.in();         // as this

hello.in("bounce")   // comes in with animate.css animation called "bounce"
```
It's basically just a shorthand for adding / removing class "hidden" and optionally adding an animation.  
```
// both do the same thing:
$("#loading").addClass("animated fadeOut").addClass("hidden");
loading.out('fadeOut');
```

##Model: Routing  
To fetch data from URL we use routing from Crossroads JS.  
If a route is matched, a View function is called.
```
// Set routes
crossroads.addRoute('/', frontPageView);
crossroads.addRoute('/admin', adminPageView);

// Start routing
route(crossroads);
```

##Views  
The View includes information about what to turn on or off on the page and calls a Controller function.  
Views have to be declared before Models.  
```
var frontPageView = function () {
  otherPageView.out();
  adminPageView.out();
  frontPage.in();
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

If fbAppId is set before Jay is loaded, the whole Facebook SDK is added to the site. You can add fbAppId like this:
```
<script>
  // test account for jay, works on localhost:5000
  var fbAppId = "756437764450452" // if fbAppId is undefined, FB SDK is not added
</script>
```
Jay loads the whole Facebook SDK for you. Currently we use it only for authentication.  

isUser() provides the possibility to apply different commands to anonymous or logged-in users. isUser() determines that you are logged in before executing the functions. window.userId contains the user Facebook ID.

A user is logged in if its logged in to Facebook and a user of a Facebook app.  
(Keep in mind that Facebook apps only work if the Settings -> Site URL matches your URL).  
```
function isLoggedIn() {
  $("#logInBox").hide();
  $("#logOutBox").show();  
  $("#content").append("Your user id is: " + window.userId);
}

function isNotLoggedIn() {
  $("#logOutBox").hide();  
  $("#logInBox").show();
}

isUser(isLoggedIn, isNotLoggedIn);  

```
OR
```

isUser(function() { // logged in users
  $("#logInBox").hide();
  $("#logOutBox").show();  
  $("#content").append("Your user id is: " + window.userId);
  }, function (){ // not logged in users
    $("#logOutBox").hide();  
    $("#logInBox").show();
  }
);  

```

##CRUD (experimental - requires [node-jay](https://github.com/jayJs/node-jay) )  
Jay features a wrapper for common AJAX REST API calls.  
**post(table, data)** -  add a row to database.  
**get(table, limit, objectId)** - get a row from database. If limit is 1, add objectId, else <limit> last posts are queried.  
**put(table, objectId, data)** - update a row in database.  
**save(table, formId)** - Save data data from form to database.  

The calls are asynchronous and can be chained with .then().  

**Warning**  
Without data modelling you can't guarantee data consistency and you will limit your test coverage.  
Nevertheless you will prototype much quicker.  

##post(table, data)  
**Add a row to database.**  
table - name of the table in database (*string*).  
data - data to be saved (*FormData*).

Returns objectId of saved data.

```
var data = new FormData();

var key = "title"; // if key does not exist in the table, it will be created automatically.
var value = "What the f*ck is FormData?"

data.append(key, value); // add the value of the input

post("Posts", data).then(function(response) {  
  if(response.objectId != undefined) {
    console.log("Object created: " + response.objectId);
  }
}
```
There's an easier way to achieve this with save(). Scroll a bit down.  


##get(table, limit, objectId)  
**Get a row from database.**  
table - name of the table in database (*string*).  
limit - if limit is 1, objectId will be use the get the precise object. In any other case the last posts from the table will be retrieved.  
objectId - Id of object in database (*string*).  

Returns object with the data.  

```
get("Posts", 1, "378QWha5OB").then(function(data) {
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

##put(table, objectId, data)  
**Update a row in database.**  
table - name of the table in database (*string*).  
objectId - Id of object in database (*string*).  
data - the data to be changed (*object*)  

Returns updatedAt from the update row.

```
var update = {
  content: "I have IE9, I have no idea what FormData is."
}
put("Posts", "378QWha5OB", update).then(function(data) {
  cl(data.updatedAt);  
});
```

##save(table, formId)  
**Save data data from form to database.**  
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
save("TableName", "addNgoForm");
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
  save('Posts', 'addPost');  
})

```
Submitting saves contents from form with id addPost to table "Posts"


##Helpers  

##cl(message)  
A shortcut for console.log(message);  
```
console.log(message); // this logs the message to the console
cl(message); // this does exactly the same thing
```

##a(message)  
Display an alert to the users.
```
a("Log in failed"); // this logs the message to the console
```

##Compability  
Visit the site - compatible until IE 6. We use [latest jQuery version 1.x](http://jquery.com/browser-support/).  
Post data - compatible until IE 10. The bottleneck is [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData#Browser_compatibility).  

##Why?  

I've built more then 10 MVP-s in the past and I'm still maintaining quite a number of them.  
After some time I've found the code getting cluttered, some things not working in some browsers and myself doing the same mistakes over and over again.  

A Single Page App (SPA) architecture relying on a REST API has become my weapon of choice. The jQuery part I did not choose, this is derived from all of the clients who cannot choose their browsers. Nevertheless, a SPA architecture with jQuery can cause quite a lot of stress, especially when I try to add new features later on. To quote a former coworker - this javascript thing can become a flea circus real easy.  

The name J or Jay is a wordplay with the name jQuery.  
I also like Jay-Z.  


##Goals for January:  

1. Make Jay installable via bower.  **done**  
It needs to be figured out how to install Jay via bower so that installing all of the dependencies is understandable for all (it currently relies on jquery, bootstrap, crossroads, signals and hasher).  
2. Break front and backend into independent parts.   **done**  
The current backend would be something like Jay-NodeJs or Jay-Node  
3. Make a Github organisation that would host Jay & Jay-Node  **done**
4. Establish a way for CRUD operations.  **done**  
5. Add WYSISWG editor - perhaps this:  
https://github.com/Voog/wysihtml  
6. Add Google Analytics and Facebook Like + Twitter Tweet buttons for demo.  


##Roadmap

**0.4.4**  
Add edit post to sample and tie it with save().  

Add delete().  

Unify get(), post(), put(), delete and save().  

Hide then() in jay or use it constantly.

Add WYSISWG editor - OK
https://github.com/Voog/wysihtml

dee-jay or jay-one:  
A index.html+css+js working without backend for easy learning.  

Create public API service for dee-jay.  


**0.4.5**
Expose backend as node middleware.

Make backend always serve index.html:
( app.get("*", function ) {}

sample page:
add FB samples - like & comment.  
Add Google Analytics sample.  


##Licence

The MIT License (MIT)

Copyright (c) 2015 Martin Sookael

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
