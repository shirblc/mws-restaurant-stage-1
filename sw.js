let currentCache = 'rest-review-cache-v1';

//event listener for an 'install' event to cache all information
self.addEventListener('install', function() {
	caches.open(currentCache).then(function(cache) {
		//documents to cache
		let toCache = [
			'index.html',
			'restaurant.html',
			'css/styles.css',
			'data/restaurants.json',
			'js/restaurant_info.js',
			'js/main.js',
			'js/dbhelper.js'
		];
		
		//fetch and cache the documents
		cache.addAll(toCache).then(function() {
			console.log("cached!");
		}).catch(function(error) {
			console.log("error:" + error);
		});
		
		//photos to cache
		let photosToCache = [];
		
		for(var i = 1; i <= 10; i++)
			{
				photosToCache.push('img/' + i + '_300p_x1.jpg');
				photosToCache.push('img/' + i + '_300p_x2.jpg');
				photosToCache.push('img/' + i + '_400p_x1.jpg');
				photosToCache.push('img/' + i + '_400p_x2.jpg');
			}
		
		//fetch and cache the photos
		cache.addAll(photosToCache).then(function() {
			console.log("cached!");
		}).catch(function(error) {
			console.log("error:" + error);
		})
		
		//off-site assets to cache
		let offsiteToCache = [
			'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
			'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
			'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png',
			'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon-2x.png',
			'https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png',
			'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1205/1539.jpg70?access_token=pk.eyJ1Ijoic2hpcmJsIiwiYSI6ImNrMXV4YmVmdzBhdGMzYnFtOTU1dG1sMHMifQ.E5Fyj4FF6sTTV-mPR8LTgA',
			'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1206/1539.jpg70?access_token=pk.eyJ1Ijoic2hpcmJsIiwiYSI6ImNrMXV4YmVmdzBhdGMzYnFtOTU1dG1sMHMifQ.E5Fyj4FF6sTTV-mPR8LTgA',
			'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1205/1540.jpg70?access_token=pk.eyJ1Ijoic2hpcmJsIiwiYSI6ImNrMXV4YmVmdzBhdGMzYnFtOTU1dG1sMHMifQ.E5Fyj4FF6sTTV-mPR8LTgA',
			'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1206/1540.jpg70?access_token=pk.eyJ1Ijoic2hpcmJsIiwiYSI6ImNrMXV4YmVmdzBhdGMzYnFtOTU1dG1sMHMifQ.E5Fyj4FF6sTTV-mPR8LTgA',
			'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1204/1539.jpg70?access_token=pk.eyJ1Ijoic2hpcmJsIiwiYSI6ImNrMXV4YmVmdzBhdGMzYnFtOTU1dG1sMHMifQ.E5Fyj4FF6sTTV-mPR8LTgA',
			'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1539.jpg70?access_token=pk.eyJ1Ijoic2hpcmJsIiwiYSI6ImNrMXV4YmVmdzBhdGMzYnFtOTU1dG1sMHMifQ.E5Fyj4FF6sTTV-mPR8LTgA',
			'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1204/1540.jpg70?access_token=pk.eyJ1Ijoic2hpcmJsIiwiYSI6ImNrMXV4YmVmdzBhdGMzYnFtOTU1dG1sMHMifQ.E5Fyj4FF6sTTV-mPR8LTgA',
			'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1540.jpg70?access_token=pk.eyJ1Ijoic2hpcmJsIiwiYSI6ImNrMXV4YmVmdzBhdGMzYnFtOTU1dG1sMHMifQ.E5Fyj4FF6sTTV-mPR8LTgA'
		];
		
		cache.addAll(offsiteToCache).then(function() {
			console.log("cached");
		}).catch(function(error) {
			console.log("error " + error);
		})
	});
});

//event listener for a 'fetch' event to first serve all cached assets
self.addEventListener('fetch', function(event) {
	//checks what url to fetch, if it's the main page returns the index
	let urlToGet = '';
	if(event.request.url == 'http://localhost:8000/')
		urlToGet = 'index.html';
	else
		urlToGet = event.request.url;
	
	//response
	event.respondWith(
		//find the requested url in the cache
		caches.match(urlToGet).then(function(response) {
			//if there's a match in the cache, return the cached asset
			if(response)
				return response;
			//if tehre's no match in the cache
			else
				{
					//fetch the url from the internet, and then add it to the
					//currently active cache
					fetch(urlToGet).then(function(response) {
						caches.open(currentCache).then(function(cache) {
							cache.put(urlToGet, response);
						})
					})
					
					//return the fetched asset
					return fetch(urlToGet);
				}
		})
	)
});