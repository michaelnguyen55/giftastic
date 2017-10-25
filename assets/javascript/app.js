$(document).ready(function() {
	
	var gifSearch = {
		limit: 10,
		currentGifs: "",
		addGifs: false,
		
		topics: ["dog", "cat", "rabbit", "hamster", "skunk", "gold fish", 
		"bird", "ferret", "turtle", "sugar glider", "chinchilla", "hedgehog", 
		"hermit crab", "gerbil", "chicken", "capybara", "pig", 
		"serval", "salamander", "frog"],

		//Creates a button for each topic in the topics array
		topicsButtons: function() {
			for(var i = 0; i < gifSearch.topics.length; i++) {
				var gifName = gifSearch.topics[i];
				var topicButton = $("<button class='gifButton'>").append(gifName);
				topicButton.attr("data-name", gifName);
				$("#gifButtons").append(topicButton);
			};
		},

		//Adds a new button with the value of the add a gif input box when the user clicks the submit button
		newButton: function() {
			var gifName = $("#gifInput").val().trim();
			
			//Adds a new button only if there is no other button with the same name
			if(gifSearch.topics.indexOf(gifName) === -1 && gifName !== "") {
				var newButton = $("<button class='gifButton'>").append(gifName);
				newButton.attr("data-name", gifName);
				$("#gifButtons").append(newButton);
				gifSearch.topics.push(gifName);
			};
		},

		clickGifButton: function(currentButton) {
			//Changes css of the currently clicked button
			$(".gifButton").removeClass("currentButton");
			$(currentButton).addClass("currentButton")

			var gifName = $(currentButton).attr("data-name");
			gifSearch.getGifs(gifName);
		},

		//Gets gifs of the name of the button that was clicked
		getGifs: function(currentGifName) {
			var gifName = currentGifName;
			//Resets gif limit to 10 and changes gif urls when clicking a different gif button
			if(gifName !== gifSearch.currentGifs) {
				gifSearch.addGifs = false;
				gifSearch.limit = 10;
			};
			if(gifSearch.addGifs === false) {
				gifSearch.currentGifs = gifName;
			};

			//Giphy API
			var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
			gifSearch.currentGifs + "&api_key=8wzOC3MqXGSVtY50jtWTpjN66DxyFcrl&limit=" + gifSearch.limit;

			//Gets gifs from Giphy
			$.ajax({
				url: queryURL,
				method: "GET"
			})
			.done(function(response) {
				$("#gifsList").empty();
				var results = response.data;

				//Get gifs with a rating under pg-13 and set them to still images
				for (var i = 0; i < results.length; i++) {
					if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
						var gifDiv = $("<div class='gifDiv'>");
						var rating = results[i].rating;
						var p = $("<div class='rating'>").html("<h3>Rating: " + rating + "</h3>");
						var gifImage = $("<img class='gif'>");
						gifImage.attr("src", results[i].images.fixed_height_still.url);
						gifImage.attr("data-still", results[i].images.fixed_height_still.url);
						gifImage.attr("data-animate", results[i].images.fixed_height.url);
						gifImage.attr("data-state", "still");
						gifDiv.append(p);
						gifDiv.append(gifImage);
						$("#gifsList").append(gifDiv);
					};
				};

				//Shows "Add More Gifs" button if there are any results, otherwise returns "No Search Results Found" on the page
				if($("#gifsList").html() !== "") {
					$("#moreGifsButton").css("visibility", "visible");
				}
				else {
					$("#gifsList").html("<h2>No Search Results Found</h2>");
					$("#moreGifsButton").css("visibility", "hidden");
				}
			});
		},

		//When a gif is clicked, this function sets a gif to be animated if it is still or sets it to be still if it is animated
		playOrPause: function(gifImage) {
			var state = $(gifImage).attr("data-state");

			if (state === "still") {
				$(gifImage).attr("src", $(gifImage).attr("data-animate"));
				$(gifImage).attr("data-state", "animate");
			} else {
				$(gifImage).attr("src", $(gifImage).attr("data-still"));
				$(gifImage).attr("data-state", "still");
			};
		},

		//When the "Add More Gifs" button is clicked, this function adds 10 more images by changing the image limit
		moreGifs: function() {
			gifSearch.addGifs = true;
			gifSearch.limit += 10;
			gifSearch.getGifs(gifSearch.currentGifs);
		}

	}

	gifSearch.topicsButtons();
	$(document).on("click", "#addGifSubmitButton", function() {
		gifSearch.newButton();
	});
	$(document).on("click", ".gifButton", function() {
		gifSearch.clickGifButton(this);
	});
	$(document).on("click", ".gif", function() {
		gifSearch.playOrPause(this);
	});
	$(document).on("click", "#moreGifsButton", function() {
		gifSearch.moreGifs();
	});

});