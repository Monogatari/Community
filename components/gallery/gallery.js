/*
 * ==============================
 * Gallery
 * ==============================
 * Author: Diego Islas Ocampo <diego@hyuchia.com>
 * Monogatari Version: 1.4.1
 * Component Version: 0.1.0
 * License: MIT
 * ==============================
 * A simple self-contained gallery for your visual novel!
 * To use it simply add this file to your `js` directory and then, load it in
 * your index.html file by adding this line just before the `main.js` one:
 * <script src="js/gallery.js"></script>
 *
 * And that's it! Just with that line, you'll be able to
 */

"use strict";

/* global $_ready */
/* global strings */
/* global $_ */

class Gallery {

	// We'll set up all needed variables in here
	constructor () {
		// The list of images the gallery has, all of them have a name or id and
		// the path of the image, much like every asset object in Monogatari.
		this.images = {

		};

		// Let's define a list of translations for every language we want to
		// support
		this.translations = {
			"English": "Gallery",
			"Español": "Gallería"
		};

		// Component's State, saves internally the unlocked images list
		this.state = {
			"unlocked": []
		};
	}

	// We'll modify the state of the gallery through this function, which will
	// also save things up to the storage.
	setState (state) {
		this.state = Object.assign ({}, this.state, state);
		Storage.set ("gallery", JSON.stringify (this.state));
	}

	// A function to lock an image, it accepts the key of the image to lock
	lock (image) {
		const unlocked = this.state.unlocked.filter ((item) => item !== image);

		this.setState ({
			unlocked
		});
	}

	// A function to unlock an image, it accepts the key of the image to unlock
	unlock (image) {
		const unlocked = [...this.state.unlocked, image];

		this.setState ({
			unlocked
		});

	}

	init () {
		// Let's check if the storage has the list of unlocked images, if it
		// doesn't exist then let's create an empty one.
		if (Storage.get ("gallery") !== null ) {
			this.setState (JSON.parse (Storage.get ("gallery")));
		}

		// Let's add up those nice translation strings we added to the actual
		// translations object. This will enable our gallery to work with multiple
		// languages as well!
		for (const language in this.translations) {
			strings[language].Gallery = this.translations[language];
		}

		// Let's add the gallery component itself to the HTML body, notice we are
		// keeping the data attributes to keep consistency between Monogatari
		// prebuilt components or menus
		$_("body").append (`
			<section data-menu='gallery'>
				<div class='modal' data-ui='image-viewer'>
					<figure></figure>
				</div>
				<button class="fa fa-arrow-left top left" data-action="back"></button>
				<h2 data-string="Gallery">Gallery</h2>
				<div class='row spaced align-center' data-ui='gallery'></div>
			</section>
		`.trim ());

		// You may notice we also added a "back" button in the gallery HTML so
		// that players can return to the main menu, let's add a lister for that
		// to happen.
		$_("[data-menu='gallery'] [data-action='back']").click (() => {
			// Hide gallery
			$_("[data-menu='gallery']").hide ();

			// Show main menu
			$_("[data-menu='main']").show ();
		});

		// Let's add a button to the main menu, we'll use this button to open
		// the gallery.
		$_("[data-menu='main'] [data-ui='inner-menu']").append ("<button data-action='open-menu' data-open='gallery' data-string='Gallery'>Gallery</button>");

		// Now that we added the button, let's add a listener for it so that when
		// players click it, the gallery gets opened.
		$_("[data-open='gallery']").click (() => {
			// Hide all the other screens
			$_("[data-menu]").hide ();

			// Use the render function to render properly all the images in the gallery
			$_("[data-menu='gallery'] [data-ui='gallery']").html (this.render ());

			// Now that the images have been added in the render, we can finally
			// show it
			$_("[data-menu='gallery']").show ();
		});

		// Now lets make it so that when a player clicks on one of the Images
		// of the gallery, the image gets shown. For that purpose, we'll use
		// create a function showImage (). You may notice we are not using a simple
		// $_().click function, instead we are using the "on" function, this is
		// due to the images being generated automatically, we can't simply
		// attach the listerner to them so we attach it to their parent (the
		// gallery) and then check if the click was actually on an image.
		$_("[data-ui='gallery']").on ("click", (element) => {
			if (element.target.matches ("[data-image]")) {
				this.showImage (element.target.dataset.image);
			}
		});

		// This listener will make it so that any click on the image viewer
		// closes it
		$_("[data-ui='image-viewer']").click (() => {
			$_("[data-menu='gallery'] [data-ui='image-viewer']").removeClass ("active");
			$_("[data-menu='gallery'] [data-ui='image-viewer'] figure").style ("background-image", "");
		});
	}

	// A simple function to show an image, this will activate the image viewer
	// and set the image as a background for it.
	showImage (image) {
		$_("[data-menu='gallery'] [data-ui='image-viewer'] figure").style ("background-image", `url("./img/gallery/${this.images[image]}")`);
		$_("[data-menu='gallery'] [data-ui='image-viewer']").addClass ("active");
	}

	// The render image will build all the image elements we need in the gallery
	render () {
		// Clear the gallery images so we can rebuild them every time the gallery
		// gets opened
		$_("[data-menu='gallery'] [data-ui='gallery']").html ("");

		// Create an image element for evert image declared in the constructor
		return Object.keys (this.images).map ((image) => {
			// Check if the image has been unlocked or not, if it hasn't then a
			// lock will be shown instead of the image.
			if (this.state.unlocked.includes (image)) {
				return `<figure class='md-depth-2 col xs6 s6 m4 l3 xl3' data-image='${image}' style='background-image: url("./img/gallery/${this.images[image]}")'></figure>`;
			} else {
				return "<figure class='md-depth-2 col xs6 s6 m4 l3 xl3'><span class='fa fa-lock'></span></figure>";
			}
		}).join ("");
	}
}

// Let's create a Gallery!
const ImageGallery = new Gallery ();

// Now, lets wait until the whole page gets loaded, and then lets initialize the
// gallery component
$_ready (() => {
	ImageGallery.init ();
});