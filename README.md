## WP-Jay  

A Wordpress theme boilerplate for a Single Page Application (SPA).  

All user input relies on backend.  
Can currently only retrieve information.  

This is meant as an idea to demonstrate the possibilities of using Wordpress as a backend.  

##Install  

Install as a normal Wordpress Theme:  
1. Copy "wp-jay" to "wp-content/themes/"  
2. Activate from "Appearance" menu in backend.  

[Install WP-API plugin](https://wordpress.org/plugins/json-rest-api/)
1. Copy "json-rest-api" to "wp-content/plugins/"
2. Activate from "Plugins" menu in backend.  

NB - the theme name "wp-jay" is hardcoded currently. Sorry for that.  
NB2 - In order to use "#" as a normal SPA would, functions.php sets permalinks to '/#/%postname%/'.  
This is so far the easiest solution for automatically forward all "watch post" links in backend to the correct URL.  
This overwrites all Permalink settings from backend.  

##Instant:  
jQuery  
Bootrap  
Animate.css  
Crossroads.js - routing  
MomentJS - date manipulations  
FB SDK - Facebook integration  
Bower - package management  
Jay - jQuery MVC library.  
Jay-WP  

##Jay-WP  
Wordpress specific Jay commands  

**get_posts()**  
Returns "wp-json/posts" ajax response or error.  
This returns latest posts.  

**get_post(slug)**  
Returns "wp-json/posts?filter[name]="+id" ajax response or error.  
This returns posts by slug name.  

**bloginfo()**  
Returns "wp-json/" ajax response or error.  
Get's your blog name and description.  

##Issues
**Address of theme files.**  
Since theme files are not in root folder, it's a bit hard for index.html to figure out where all of the files are, that's why all of the links are currently hardcoded to "wp-content/themes/wp-jay".  

**Is user?**  
Currently no solution for making sure from Wordpress point of view who the user is.  

**Save data**  
Could be achieved with oauth or nonces.  
  
**Frontend plugins don't work**  
If your plugin does something in frontend the css & js files from them are currently not being loaded.  

Also the jQuery is not enqued, but kept independently.  

Most of the issues could be solved by combining some php with the index file.
