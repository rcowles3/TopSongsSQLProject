'use-strict'

// DECLARING VARIABLES TO USE FOR NODE PACKAGES
// ===============================================================

var mysql = require('mysql');
var inquirer = require('inquirer');

// CONNECTING TO SQL DB
// ===============================================================

var connection = mysql.createConnection({
    host: '', // update with host
    port: , // update with port
    user: '', // update with user id
    password: '', // update with user password
    database: '' // update with created database
});

// connecting to db, and displaying connection id
connection.connect(function(err) {

    // error catcher
    if (err) throw err;

    console.log("\nConnected to database " + connection + " as user " + connection.user);

    // call promptUser function 
    promptUser();

    // terminate sql connection
    // terminateConnection();
});

// FUNCTIONS TO QUERY SQL DATABASE
// ===============================================================

// function to search artist through our database
var searchArtist = function() {

    // prompt to ask user which artist to search
    inquirer.prompt([{
        name: "artistSearch",
        message: "What Artist would you like to search for?",
        type: "input"
    }]).then(function(artistQuery) {

        // testing input 
        // console.log(artistQuery);

        // declaring artist variable
        let artist = artistQuery.artistSearch;

        // query to search database by specific artist
        connection.query('SELECT * FROM TOP5000 WHERE ARTIST = ? ORDER BY POSITION', [artist], function(err, res) {

            // error catcher
            if (err) throw err;

            console.log("\nHere are all the top songs for " + res[0].ARTIST);

            // for loop  to run through our array
            for (var i = 0; i < res.length; i++) {

                // var array to hold res data
                let artistArray = [];

                // push data to our array
                artistArray.push(res);

                // log search results to console
                console.log("\nSong Ranking: " + res[i].POSITION + "\nArtist: " + res[i].ARTIST + "\nSong: " + res[i].SONGS + "\nYear Released: " + res[i].YEAR);
            }

            // call promptUser function 
            promptUser();
        })
    })
}

// function to search for artist who appear more than once
var searchArtistDuplicates = function() {

    console.log("works");
    // prompt to ask user what artists to search
    inquirer.prompt([{
        name: "artistsDuplicates",
        message: "Which Artist do you want to search to see if they multiple top songs?",
        type: "input"
    }]).then(function(artistsDuplicatesQuery) {

        // declaring artist variable
        let artist = artistsDuplicatesQuery.artistsDuplicates;

        // query to search database by specific artist
        connection.query('SELECT COUNT(*) AS NUM, ARTIST FROM TOP5000 WHERE ARTIST = ? GROUP BY ARTIST HAVING COUNT(*) > 1', [artist], function(err, res) {

            // error catcher
            if (err) throw err;

            // log search results to console
            console.log("\nThe Artist '" + res[0].ARTIST + "' have had a top song " + res[0].NUM + " times!");

            // call promptUser function 
            promptUser();
        })

    })
}

// function to search between two specific years
var searchRange = function() {

    // prompt to ask user what years they want to search from
    inquirer.prompt([{
        name: "value1",
        message: "Which top song positions would you like to search between?\n  Start posiition: ",
        type: "input",
    }, {
        name: "value2",
        message: "Ending position: ",
        type: "input"
    }]).then(function(rangeQuery) {

        // declaring years variables
        let value1 = rangeQuery.value1;
        let value2 = rangeQuery.value2;

        // query to search our database 
        connection.query('SELECT POSITION, ARTIST, SONGS, YEAR FROM TOP5000 WHERE POSITION BETWEEN ? AND ? ORDER BY POSITION', [value1, value2], function(err, res) {

            // error catcher
            if (err) throw err;

            console.log("\nHere are top songs between " + value1 + " and " + value2);

            // for loop  to run through our array
            for (var i = 0; i < res.length; i++) {

                // var array to hold res data
                let rangeArray = [];

                // push data to our array
                rangeArray.push(res);

                // log search results to console
                console.log("\nSong Ranking: " + res[i].POSITION + "\nArtist: " + res[i].ARTIST + "\nSong: " + res[i].SONGS + "\nYear Released: " + res[i].YEAR);
            }

            // call promptUser function 
            promptUser();
        })
    })
}

// function to search a specific song through our database
var searchSong = function() {

    // prompt to ask user which artist to search
    inquirer.prompt([{
        name: "searchSong",
        message: "What Song would you like to search for?",
        type: "input"
    }]).then(function(songQuery) {

        // declaring artist variable
        let song = songQuery.searchSong;

        // query to search database by specific artist
        connection.query('SELECT POSITION, ARTIST, SONGS, YEAR FROM TOP5000 WHERE SONGS = ?', [song], function(err, res) {

            // error catcher
            if (err) throw err;

            // log search results to console
            console.log("\nSong Ranking: " + res[0].POSITION + "\nArtist: " + res[0].ARTIST + "\nSong: " + res[0].SONGS + "\nYear Released: " + res[0].YEAR);

            // call promptUser function 
            promptUser();
        })
    })
}

// function to terminate the application
var terminateConnection = function() {

    // terminating connection
    connection.end(function(err) {

        // error catcher
        if (err) throw err;

        // The connection is terminated now 
        console.log("\nYour SQL connection has been terminated.\n");
    })
}

// FUNCTION TO RUN APP
// ===============================================================

// function to prompt user what to do
var promptUser = function() {

    // Run function to prompt for what user wants to do
    inquirer.prompt([{
        name: "searchQuery",
        message: "\nWhat would you like to do?\n",
        choices: ["Find songs by Artist.", "Find Artists who have multiple top billboard songs.", "Find top songs within a specific range position, 1-5000.", "Search for a specific song.", "Quit Application."],
        type: "list"
    }]).then(function(queryChoice) {

        // switch case to run functions to retrieve data based on user selection/input
        switch (queryChoice.searchQuery) {
            case 'Find songs by Artist.':
                searchArtist();
                break;
            case 'Find Artists who have multiple top billboard songs.':
                searchArtistDuplicates();
                break;
            case 'Find top songs within a specific range position, 1-5000.':
                searchRange();
                break;
            case 'Search for a specific song.':
                searchSong();
                break;
            case 'Quit Application.':
                terminateConnection();
                break;
        }
    })
}
