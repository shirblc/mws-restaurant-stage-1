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
	});
});