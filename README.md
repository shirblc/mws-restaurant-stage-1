# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Restaurant Reviews App

### Current Version

Version 1.

### Description

A responsive, offline-ready restaurant reviews app, built as part of the Udacity Front-End Nanodegree.

### Requirements

- Python - Needed to run the project's server
- A browser supporting ES6 (Any browser released after 2015)
- Mapbox API token - You need to replace `<your MAPBOX API KEY HERE>` with a token from [Mapbox](https://www.mapbox.com/). Mapbox is free to use, and does not require any payment information. Simply sign up and get your API token.

### Installation & Usage

1. Download or clone this repository.
2. Open this folder. In it, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

    * In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.
   * Note -  For Windows systems, Python 3.x is installed as `python` by default. To start a Python 3.x server, you can simply enter `python -m http.server 8000`.
3. With your server running, visit the site: `http://localhost:8000`, and look around for a bit to see what the current experience looks like.
4. Don't forget to replace the Mapbox API key before running.

#### Server Port

If you run the server on a different port than the one mentioned, remember to change the port number in the dbhelper.js file. You can find it in the DATABASE_URL static method.

### Code Features

#### Leaflet.js and Mapbox:

This repository uses [leafletjs](https://leafletjs.com/) with [Mapbox](https://www.mapbox.com/). 

#### Service Worker and Cache

This repository utilises a service worker to cache all visited pages to the device cache. The service worker acts on three events:

1. Installation - when a service worker is installed, it caches the pages' HTML, the CSS, the JavaScript, the photos and all off-site assets required by the main page.
2. Activation - when a service worker is activated, it deletes any cache not currently in use.
3. Fetch event - upon a fetch request from the browser, the service worker attempts to find a match for the requested URL in the cache.
    * If it finds a match, the service worker returns the cached URL while reaching out to the network to see if anything has changed. If it has, it simultaneously caches the new page.
    * If it doesn't find a match, the service worker attempts to fetch the URL from the internet. If it succeeds, it adds the URL to the cache and displays it. If not, it returns a cached "no connection" error page.
	
### Known Issues

There are no known issues at the time.
