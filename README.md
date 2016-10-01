## Code Games

I built my favorite board game as a mobile friendly web application to play on the go. The idea was to be able to play while I was at the PAX expo hall, where there is usually little to no cell service. I designed the app to run on two phones, with no backend needed for multiplayer. I have hosted the game on my website, [codegoblins](http://codegoblins.com). Check out my sweet solution for encoding the board!

I used the following frameworks/tools:

```
npm
gulp
bower
sass
babel (for ES2015)
browsersync
AngularJS 1.5.8
Angular UI
```

## Building the site

You will need nodeJS & npm to build and host the site. Install as necessary with whichever package manager suits you and your OS.
Also, install [gulp](https://gulpjs.com) and [bower](https://bower.io).

Now, clone the project and run

```
npm install
bower install
```

This installs all of the project dependencies. Now, you can host the project locally, and check out the site on localhost:3000 from your browser.

```
gulp serve
```
