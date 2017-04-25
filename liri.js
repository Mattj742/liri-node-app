// Core node package for reading and writing files
var fs = require("fs");
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");
//Twitter keys variables
var Twitter = require('twitter');
var twitterCredentials = require("./keys.js");
var keys = twitterCredentials.twitterKeys;
var client = new Twitter(keys);

//Spotify and Inquirer requires
var spotify = require('spotify');
var inquirer = require('inquirer');


var input = process.argv[2];
var inputTwo = process.argv[3];

//If-else for user inputs

switch (input) {
    case 'my-tweets':
        tweets();
        break;
    case 'spotify-this-song':
        spotifySearch(inputTwo);
        break;
    case 'movie-this':
        movie(inputTwo);
        break;
    case 'do-what-it-says':
        random();
        break;

}

//Twitter
function tweets() {
    var params = { screen_name: 'fake_mattj' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (i = 0; i < 20; i++) {
                console.log("Tweets: " + tweets[i].text);
                console.log("Created at: " + tweets[i].created_at);
                console.log("===============================");
            }
        }
    });
};

//Spotify
function spotifySearch(inputTwo) {
    spotify.search({ type: 'track', query: inputTwo }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        if (inputTwo === undefined) {
            noSong();
        } else {
            console.log("===============================");
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
            console.log("Song Name: " + data.tracks.items[0].name);
            console.log("Preview: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("===============================");
        }
    });
};

//function for if no song is entered
function noSong() {
    spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            console.log("===============================");
            console.log("Artist: " + data.tracks.items[3].album.artists[0].name);
            console.log("Song Name: " + data.tracks.items[3].name);
            console.log("Preview: " + data.tracks.items[3].preview_url);
            console.log("Album: " + data.tracks.items[3].album.name);
            console.log("===============================");
        }
    });

};

//OMDB
function movie() {
    request("http://www.omdbapi.com/?t=" + inputTwo + "&tomatoes=true&r=json", function(error, response, body) {
        if (inputTwo === undefined) {
            noMovie();
            return;
        }
        if (!error && response.statusCode === 200) {
            console.log("===============================");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes: " + JSON.parse(body).tomatoURL);
            console.log("===============================");
        }

    });
};
//function for if no movie is entered
function noMovie() {
    request("http://www.omdbapi.com/?t=Mr+Nobody&tomatoes=true&r=json", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("===============================");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes: " + JSON.parse(body).tomatoURL);
            console.log("===============================");
        }
    });
};

//Do what it says
function random() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        var data = data.split(",");
        input = data[0];
        inputTwo = data[1];

        if (input === "spotify-this-song") {
            spotifySearch(inputTwo);
        }
        if (input === "my-tweets") {
            tweets(inputTwo);
        }
        if (input === "movie-this") {
            movie(inputTwo);
        }
    });
};

if (request !== undefined) {

    fs.appendFile('log.txt',input + ' "' + inputTwo + '"\n', function(err) {
        if (err) {
            console.log("An error occured: " + err);
        }

    });
} 
