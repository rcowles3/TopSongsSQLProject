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
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    // Run function to prompt for what user wants to do
    inquirer.prompt([{
        name: "searchQuery",
        message: "What would you like to do?",
        choices: ["Find songs by Artist.", "Find all Artists who appear more than once.", "Find data within a specific range.", "Search for a specific song."],
        type: "list"
    }]).then(function(queryChoice) {

        // switch case to run functions to retrieve data based on user selection/input
        switch (queryChoice.searchQuery) {
            case 'Find songs by Artist.':
                searchArtist();
                break;
            case 'Find all Artists who appear more than once.':
                searchArtistDuplicates();
                break;
            case 'Find data within a specific range.':
                searchRange();
                break;
            case 'Search for a specific song.':
                searchSong();
                break;
        }
    });
});

// FUNCTIONS
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
        console.log(artistQuery);

        // declaring artist variable
        let artist = artistQuery.artistSearch;

        // query to search database by specific artist
        connection.query('SELECT * FROM TOP5000 WHERE ARTIST = ?', [artist], function(err, res) {
            
            // error catcher
            if (err) throw err;

            // log search results to console
            console.log(res);
        })
    })
}

// function to search for artist who appear more than once
var searchArtistDuplicates = function() {

    // prompt to ask user what artists to search
    inquirer.prompt([{
        name: "artistsDuplicates",
        message: "Which Artist do you want to search to see if they appear more than once?",
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
        connection.query('SELECT POSITION, ARTIST, SONGS FROM TOP5000 WHERE POSITION BETWEEN ? AND ?', [value1, value2], function(err, res) {
            
            // error catcher
            if (err) throw err;

            // display data to console
            console.log(res);

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

        // testing input 
        console.log(songQuery);

        // declaring artist variable
        let song = songQuery.searchSong;

        // query to search database by specific artist
        connection.query('SELECT * FROM TOP5000 WHERE SONGS = ?', [song], function(err, res) {
            
            // error catcher
            if (err) throw err;

            // log search results to console
            console.log(res);
        })
    })
}
