let restaurants,
	neighborhoods,
	cuisines
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
	registerServiceWorker();
	initMap(); // added 
	fetchNeighborhoods();
	fetchCuisines();
});

/**
 * Register the service worker
 */
registerServiceWorker = () => {
	//if the browser doesn't support service workers, quit here
	if(!navigator.serviceWorker) return;
	
	navigator.serviceWorker.register('/sw.js');
}

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
	DBHelper.fetchNeighborhoods((error, neighborhoods) => {
		if (error) { // Got an error
			console.error(error);
		} else {
			self.neighborhoods = neighborhoods;
			fillNeighborhoodsHTML();
		}
	});
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
	//gets the select menu
	const select = document.getElementById('neighborhoods-select');
	//adds a menu item for each neighbourhood
	neighborhoods.forEach(neighborhood => {
		const option = document.createElement('option');
		option.innerHTML = neighborhood;
		option.value = neighborhood;
		select.append(option);
	});
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
	DBHelper.fetchCuisines((error, cuisines) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			self.cuisines = cuisines;
			fillCuisinesHTML();
		}
	});
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
	//gets the select menu
	const select = document.getElementById('cuisines-select');
	//adds a menu item for each cuisine
	cuisines.forEach(cuisine => {
		const option = document.createElement('option');
		option.innerHTML = cuisine;
		option.value = cuisine;
		select.append(option);
	});
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
	self.newMap = L.map('map', {
		center: [40.722216, -73.987501],
		zoom: 12,
		scrollWheelZoom: false
	});
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
		mapboxToken: 'pk.eyJ1Ijoic2hpcmJsIiwiYSI6ImNrMXV4YmVmdzBhdGMzYnFtOTU1dG1sMHMifQ.E5Fyj4FF6sTTV-mPR8LTgA',
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(newMap);
	
	updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
	const cSelect = document.getElementById('cuisines-select');
	const nSelect = document.getElementById('neighborhoods-select');
	
	const cIndex = cSelect.selectedIndex;
	const nIndex = nSelect.selectedIndex;
	
	const cuisine = cSelect[cIndex].value;
	const neighborhood = nSelect[nIndex].value;
	
	DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			resetRestaurants(restaurants);
			fillRestaurantsHTML();
		}
	})
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
	// Remove all restaurants
	self.restaurants = [];
	const ul = document.getElementById('restaurants-list');
	ul.innerHTML = '';
	
	// Remove all map markers
	if (self.markers) {
		self.markers.forEach(marker => marker.remove());
	}
	self.markers = [];
	self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
	//gets the list HTML element
	const ul = document.getElementById('restaurants-list');
	//add each restaurant to the element
	restaurants.forEach(restaurant => {
		ul.append(createRestaurantHTML(restaurant));
	});
	addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
	//restaurant container
	const li = document.createElement('li');
	li.setAttribute('aria-label', `restaurant page for ${restaurant.name}`);
	
	//restaurant image
	const image = document.createElement('img');
	image.className = 'restaurant-img';
	//restaurant picture - sets the source and the alt text
	image.src = (restaurant.id <= 9) ? (DBHelper.imageUrlForRestaurant(restaurant)[0].substr(22,17)) : (DBHelper.imageUrlForRestaurant(restaurant)[0].substr(23,18));
	image.srcset = DBHelper.imageUrlForRestaurant(restaurant)[0];
	image.alt = (restaurant.id == 2) ? (`Food at the restaurant ${restaurant.name}`) : (`The restaurant ${restaurant.name}`);
	li.append(image);
	
	//restaurant name
	const name = document.createElement('h2');
	name.innerHTML = restaurant.name;
	name.setAttribute('aria-describedby', 'restaurantName');
	li.append(name);
	
	//restaurant neighbourhood
	const neighborhood = document.createElement('p');
	neighborhood.innerHTML = restaurant.neighborhood;
	neighborhood.setAttribute('aria-describedby', 'restaurantNeighborhood');
	li.append(neighborhood);
	
	//restaurant address
	const address = document.createElement('p');
	address.innerHTML = restaurant.address;
	address.setAttribute('aria-describedby', 'restaurantAddress');
	li.append(address);
	
	//restaurant view more link
	const more = document.createElement('a');
	more.innerHTML = 'View Details';
	more.href = DBHelper.urlForRestaurant(restaurant);
	more.setAttribute('aria-label', `view details of the restaurant ${restaurant.name}`)
	li.append(more)
	
	return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
	restaurants.forEach(restaurant => {
		// Add marker to the map
		const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
		marker.on("click", onClick);
		function onClick() {
			window.location.href = marker.options.url;
		}
		self.markers.push(marker);
	});
}