# Webapps Unplugged

"We're building the phone powered by the Open Web!"

"If you can build a website, you can build an app"

"Great, but what if you don't have an internet connection?"

Well, um&hellip;

Hm.

In the era of high definition streaming video, complex web applications that blur the line between website and desktop application, and cellular speeds approaching that of wifi, the digital divide is larger than ever! And it shows in connectivity.

[Big Gulp]
[Tiny espresso cup]

Some markets guzzle data as fast as they can. Month-to-month contracts are the norm with unlimited data or high caps. But in much of the world, Internet access is a luxury. It's emininently affordable thanks to pre-paid sims and pay-as-you-go plans, but mobile data is a commodity that is rationed and applied only when necessary, using it during the dash between WiFi hotspots. The next billion internet users will come online in markets like these, and to reach them using an platform built around the technologies of the internet presents challenges beyond those of competitors, whose platforms rely mostly on code installed directly onto the device.

How can we take the wow-capable technologies of the Web, deliver them to phones via the mechanisms of the Internet, and still respect the wallets and throughputs of this emerging market?

It turns out a handful of technologies have been produced and standardized in the big bucket of awesome that is HTML5 that can help us take our beautiful online creations, and take them to a place we might never have expected- the bathroom of an airplane.

# Why Go Offline?

Here are the big reasons your app should know how to cut the cord:

## Graceful experience

Good apps provide access to important data when no connection is available. Think of all those times you held important information in your inbox so you could get to it later on your phone.

Even if your app *must* be online to function properly, a friendly message apologizing in your app's brand is much nicer than the generic 404 screen!

## Slow connections and Pre-paid Plans

Respect your users who pay up front for their data, or who have to go out of their way to come up for digital air. The day you find yourself on EDGE waiting 5 minutes for your own simple website to load is the day you realize that maybe that extra 60K webfont wasn't worth it. But you don't have to settle or skimp (at least not always)! The browser cache is unreliable. By storing your assets in the offline cache, you can ensure your app will only use the network when it has something new to say.

## Spotty connections

3G and LTE have never been in more markets, and they've never failed to let me down when I need them most- the front half of my house or, say, *the entirety of the city San Francisco*. Allowing your app to detect when it is offline, even momentarily, and waiting patiently for the train to come out of the tunnel is better than simply erroring out.

## Performance

Keeping your assets offline will help your site load faster- even when your user is online! Even your data-guzzling users will notice the performance of your app, describing it as "snappy" or the coveted "like native"! Eat that, Facebook.

# Great. I'm sold. Now what?

There are 3 big technologies at play in HTML5 that aid in offline access.

## localStorage

The localStorage object is the poster-child for simple data persistence. It can be addressed just like any other javascript object, reading and writing values to keys. The important difference? Next time you load the page, all that data is just as you left it.

### Basic example

    var name = localStorage.name;
    if (!name) {
        name = prompt('enter your name');
        localStorage.name = name;
    }
    alert('Hello, ' + name + '!');

The first time we visit a page with this code, we will be prompted to enter our name. The next time, the page will already know our name! But wait, couldn't we do this with cookies before? Sure, but cookies are sent to the server with every request, increasing the number of bytes you send. But seriously, could it get easier?

### Features

- Acts like a javascript object, with simple key-value storage.
- It Just Works™

### Watch out for

The data in localStorage is only available on the domain it was stored- hence the 'local' in localStorage. This is arguably a security feature!

All the reading and writing of the localStorage object is done synchronously- watch out for lag with large amounts of data. You never know when the browser will have to go to disk, and then you're going to have a bad time.

LocalStorage has relatively low limits on how much data you can store. A good rule is to not store site resources in localStorage, only user data and state persistance.

## IndexedDB

I'm listing this one in the middle because, honestly, I don't have much experience with IndexedDB. Implementations are just beginning to standardize between browsers- as of this writing, Safari still has no support for the technology. MDN has a [great set of documentation](https://developer.mozilla.org/en-US/docs/IndexedDB) on IndexedDB, but the short summary is as follows:

### Features

- Structured, transactional key-value object store
- Designed for large amounts of data
- Non-blocking reads/ writes
- Versionable schema
- Most-supported HTML5 structured-data store (compared to WebSQL)

### Watch out for

- Asynchronous API = lots and lots of callbacks
- Support does not yet span the top 4 major browsers
- API is still evolving


## HTML5 Application Cache

This one is, in my mind, the big enchilada. An evolution of the volatile and oft-overwhelmed browser cache, the [Application Cache](https://developer.mozilla.org/en-US/docs/HTML/Using_the_application_cache) allows a website to specify a list of URLs to download and store offline for later use, as well as directives on when and how to use those files. The mechanism by which you instruct the browser is by using what is called a Cache Manifest file. The best way to explain this is to look at a sample manifest for the breakout hit HTML5 game Cranky Boids:

    CACHE MANIFEST
    # Version 2

    CACHE:
    index.html
    style-min.css
    media/boids.png
    media/hogs.png
    boids-min.js

    NETWORK:
    # Try to fetch the leaderboard online.
    leaderboard.html

    FALLBACK:
    # Show the users an offline message for the social pages.
    /social/ offline.html

So, what did we just see here? Let's break it down by section.

    CACHE MANIFEST
    # Version 2

The first line is required, and lets the browser know that the file it's dealing with is in fact an appcache manifest file. Note, also, that the manifest file should be served with the MIME type `text/cache-manifest`.

The second line is a comment indicating the current version of the manifest. This is useful for debugging purposes, but serves a much more important purpose as well. The browser will only re-download these files when it detects the cache manifest has been changed. If you haven't changed the names of any files, but you have updated their contents, you can increment the version number (or change any other comment) to force a re-download. The browser will check for changes to the manifest after every page load.

    CACHE:
    index.html
    style.css
    media/boids.png
    media/hogs.png
    boids-min.js

The next section contains a list of explicit URLs we would like to download and store offline. The developers of Cranky Boids have the homepage of their site (where the game is played), the necessary CSS and Javascript, and the image resources their game needs. This means that the will be playable even when their users are offline.

### Watch out for

The URLs in this section must match *exactly* the URLs as they are fetched on the site! If their markup says

    <script src="boids-min.js?v2"></script>

then the corresponding line in the manifest would need to say

    boids-min.js?v2

If they don't exactly match, the file will not be found when the user is offline and requests it.

A second, very important warning! *Never* cache the manifest itself using the manifest. The browser will never see an update, and you're going to have a Bad Time.

    NETWORK:
    # Try to fetch the leaderboard online.
    leaderboard.html

The next section lists URLs that should *always* be retrieved over the network. In our example, the leaderboard should always be up to date, so we don't want to cache it. Cranky Boids requests the leaderboard using AJAX, so their Javascript should be prepared to handle a failed request then the user is offline.

    FALLBACK:
    # Show the users an offline message for the social pages.
    /social/ offline.html

The last section lets us specify fallback content to be shown instead of the requested URL when the user is offline. Fallbacks are specified by listing a URL prefix and a fallback resource. The prefix means that all the following URLs will return offline.html when the user is offline:

- /social/
- /social/friends.html
- /social/chat.html

### Activating the Application Cache

To turn on the Application Cache in Cranky Boids, the beginning of `index.html` looks like this:

    <!doctype html>
    <html manifest="manifest.appcache">

The important bit is the `manifest` attribute, which is the URL of the manifest file.

#### Watch out for

One of the many quirks of the Application Cache (and there are unfortunately many) is that any file that declares a manifest is added to the cache, _regardless of whether it is in the manifest file_. Be careful when adding the attribute to a global HTML template, or you might wind up caching every page your user visits!

Another quirk is that caching process is an all-or-nothing affair. If any resource listed in the manifest fails to be successfully downloaded, then *none* of the resources will be cached.

Many more quirks and edge-cases of the Application Cache can be found at [http://appcachefacts.info/](http://appcachefacts.info/)

# In Closing

I hope that I've sold you on the importance of getting your apps working offline, and helped demystify the process.

## Questions?

You can reach me on Twitter as @potch, or via email at potch@mozilla.com

Thanks! Let's take the rest of this conversation offline.