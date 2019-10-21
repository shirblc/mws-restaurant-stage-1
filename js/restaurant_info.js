let restaurant;
var newMap;
//counts the number of reviews (for use in the review details described-by)
let reviewNum = 1;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
	initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
	fetchRestaurantFromURL((error, restaurant) => {
		if (error) { // Got an error!
			console.error(error);
		} else {      
			self.newMap = L.map('map', {
				center: [restaurant.latlng.lat, restaurant.latlng.lng],
				zoom: 16,
				scrollWheelZoom: false
			});
			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
				mapboxToken: 'pk.eyJ1Ijoic2hpcmJsIiwiYSI6ImNrMXV4YmVmdzBhdGMzYnFtOTU1dG1sMHMifQ.E5Fyj4FF6sTTV-mPR8LTgA',
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				id: 'mapbox.streets'
			}).addTo(newMap);
			fillBreadcrumb();
			DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
		}
	});
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
	if (self.restaurant) { // restaurant already fetched!
		callback(null, self.restaurant)
		return;
	}
	const id = getParameterByName('id');
	if (!id) { // no id found in URL
		error = 'No restaurant id in URL'
		callback(error, null);
	} else {
		//gets the restaurant from the database helper
		DBHelper.fetchRestaurantById(id, (error, restaurant) => {
			self.restaurant = restaurant;
			if (!restaurant) {
				console.error(error);
				return;
			}
			//fill the restaurant html
			fillRestaurantHTML();
			callback(null, restaurant)
		});
	}
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
	//restaurant name title
	const name = document.getElementById('restaurant-name');
	name.innerHTML = restaurant.name;
	
	//restaurant address
	const address = document.getElementById('restaurant-address');
	address.innerHTML = restaurant.address;
	
	//restaurant picture - multiple options depending on viewport size
	const image = document.getElementById('restaurant-imgs');
	image.children.item(0).srcset = DBHelper.imageUrlForRestaurant(restaurant)[0];
	image.children.item(2).srcset = DBHelper.imageUrlForRestaurant(restaurant)[0];
	image.children.item(1).srcset = DBHelper.imageUrlForRestaurant(restaurant)[1];
	image.children.item(3).srcset = DBHelper.imageUrlForRestaurant(restaurant)[1];
	
	//restaurant picture - sets the source and the alt text
	image.children.item(4).src = (restaurant.id < 9) ? (DBHelper.imageUrlForRestaurant(restaurant)[1].substr(22,17)) : (DBHelper.imageUrlForRestaurant(restaurant)[1].substr(23,18));
	image.children.item(4).alt = (restaurant.id == 2) ? (`Food at the restaurant ${restaurant.name}`) : (`The restaurant ${restaurant.name}`);
	
	//restaurant cuisine
	const cuisine = document.getElementById('restaurant-cuisine');
	cuisine.innerHTML = restaurant.cuisine_type;
	
	// fill operating hours
	if (restaurant.operating_hours) {
		fillRestaurantHoursHTML();
	}
	// fill reviews
	fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
	const hours = document.getElementById('restaurant-hours');
	//for every day in the opening hours
	for (let key in operatingHours) {
		//creates a row
		const row = document.createElement('tr');
		
		//creates a table cell with the day in that row
		const day = document.createElement('td');
		day.innerHTML = key;
		day.id = key;
		day.setAttribute('aria-describedby', 'restaurantOpeninghours');
		row.appendChild(day);
		
		//creates a table cell with the hours in that row
		const time = document.createElement('td');
		time.innerHTML = operatingHours[key];
		time.setAttribute('aria-describedby', `restaurantOpeninghours ${day.id}`)
		row.appendChild(time);
		
		//adds the table to the html element
		hours.appendChild(row);
	}
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
	//gets the reviews container
	const container = document.getElementById('reviews-container');
	//creates the reviews title
	const title = document.createElement('h3');
	title.innerHTML = 'Reviews';
	title.id = 'reviews-section';
	title.setAttribute('tabindex', '0');
	container.appendChild(title);
	
	//if there are no reviews, creates a "no reviews" message
	if (!reviews) {
		const noReviews = document.createElement('p');
		noReviews.innerHTML = 'No reviews yet!';
		container.appendChild(noReviews);
		return;
	}
	
	//if there are reviews
	const ul = document.getElementById('reviews-list');
	//add each review to the page
	reviews.forEach(review => {
		ul.appendChild(createReviewHTML(review));
	});
	//once done creating reviews, resets the review number for the next restaurant
	reviewNum = 1;
	container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
	//creates the review container
	const li = document.createElement('li');
	//creates the reviewer name
	const name = document.createElement('p');
	name.innerHTML = review.name;
	name.className = 'reviewerName';
	name.id = `reviewerName${reviewNum}`;
	li.appendChild(name);
	
	//creates the review date
	const date = document.createElement('p');
	date.innerHTML = review.date;
	date.className = 'reviewDate';
	date.setAttribute('aria-describedby', `reviewer ${name.id}`);
	li.appendChild(date);
	
	//creates the reviewer rating
	const rating = document.createElement('p');
	rating.innerHTML = `Rating: ${review.rating}`;
	rating.className = 'reviewerRating';
	rating.setAttribute('aria-describedby', `reviewer ${name.id}`);
	li.appendChild(rating);
	
	//creates the reviewer comments
	const comments = document.createElement('p');
	comments.innerHTML = review.comments;
	comments.className = 'reviewerComments';
	comments.setAttribute('aria-describedby', `reviewer ${name.id}`);
	comments.setAttribute('tabindex', '0');
	li.appendChild(comments);
	
	//once done with this review, adds to the review number for the next review
	reviewNum++;
	
	//returns the review object
	return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
	const breadcrumb = document.getElementById('breadcrumb');
	const li = document.createElement('li');
	li.innerHTML = restaurant.name;
	breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
	if (!url)
		url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
		  results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
