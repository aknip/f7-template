// Initialize your app
var myApp = new Framework7({
    panelLeftBreakpoint: 1024
});

// Export selectors engine
var $$ = Dom7;

// Add views
var leftView = myApp.addView('.view-left', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


$$(window).on('load', function(obj){
    appCacheNanny.set('loaderPath', 'appcache-loader.html') ;
    appCacheNanny.start({checkInterval: 30000});
    appCacheNanny.on('updateready', function(){console.log('NEW VERSION CACHED. PLEASE RELOAD!')})
})