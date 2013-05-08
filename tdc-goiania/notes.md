I'm a web developer at Mozilla

Previous Projects
AMO
Glow

Now, Marketplace

Plug Aurora release!

Firefox OS
"A mobile operating system powered by the Web"

Always bet on The Web.

(Technical) What is Firefox OS?
Gonk - Just like Android, It's powered by the Linux Kernel
Gecko - The OS level is adapted from Gecko, the same rendering engine used in Firefox
Gaia - The User interface layer is written entirely in HTML, CSS, and JavaScript
    - Using HTML5, the latest and greatest tools and capabilities of the Web
    - Accessing the special functions in a phone via addition APIs that are
      being standardized
    This is what I know the most about!



WHY


How many of you have written or are writing an Android App?
    - Do you want to learn WinRT and Objective C as well

How many of you write Java that powers a web site?

How many of you have built a web site?


"If you can build a web site, you can build an App"


And take it with you.


A well-built website works in every browser.
A well-built website will make a well-built App.
Your App will work in every browser!

But in Firefox and Firefox OS?

(Demo of installation)

Our goal is that other browsers will enable this too!

# THE MEAT

How to turn an existing Web Site into an Open Web App

The Manifest
The Manifest describes your website and represents it as an App.
Familiar with JSON?
    - Like XML, it is a data format

Simple Manifest:

{
  "name": "Calendar",
  "description": "Gaia Calendar",
  "launch_path": "/index.html",
  "developer": {
    "name": "The Gaia Team",
    "url": "https://github.com/mozilla-b2g/gaia"
  },
  "locales": {
    "en-US": {
      "name": "Calendar",
      "description": "Gaia Calendar"
    },
    "pt-BR": {
      "name": "Calendário",
      "description": "Calendário do Gaia"
    }
  },
  "default_locale": "en-US",
  "icons": {
    "120": "/style/icons/Calendar.png",
    "60": "/style/icons/60/Calendar.png"
  }
}



