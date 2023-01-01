/* ------------------------------------------------------------------
 * Title: travelodge.js
 * Date: 10/9/2012
 * Version: 0.1
 * Author: Phil Puleo
 * Company: Phil Puleo Consulting LLC
 * Description: Logic and behaviors for the Travelodge Match-It game.
 * Dependencies:
 *   -jQuery 1.7+
 *
 * Copyright 2012, Phil Puleo Consutling LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------*/

// Extend the array prototype to include a random shuffle function
Array.prototype.shuffle = function() {
  for (var i = this.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
};

// Provide an object for extensibility and to play nice with other scripts.
window.travelodge = (function() {

  // Use strict mode
  "use strict";

  // Create an object to return.
  var travelodge = {
    cardArray: [
      {cid: 101, file: "door-slam.png"},
      {cid: 102, file: "ancient-tv.png"},
      {cid: 103, file: "bed-bugs.png"},
      {cid: 104, file: "shower.png"},
      {cid: 105, file: "motel-cat.png"},
      {cid: 106, file: "ceiling-wet.png"},
      {cid: 107, file: "vomit.png"},
      {cid: 108, file: "sex.png"},
      {cid: 109, file: "freeze-or-boil.png"}
    ],
    compareArray: [],
    score: 0,
    messageArray: [
      "Well, not really. But maybe you enjoyed wasting the last minute or so. That's kinda like winning.",
      "Two in a row! Must be a slow day. At least you're not playing FarmVille.",
      "Wow, if you like this game so much, maybe you should marry it.",
      "Impressive! Your dedication to slacking off is truly inspiring.",
      "That's it. Motel Cat will find you and silently disapprove while you sleep.",
      "Veritatem inventus est! You are now enlightened. Go away."
    ]
  };

  // Event Handlers

  // Respond to card flips
  $(".container").on("click",".panel", function() {

    // If this card is already face up, ignore the click.
    if($(this).hasClass("flip")) {
      return false;
    }

    // Add the flipped class to trigger the CSS transform flip.
    $(this).addClass("flip");

    // Push the card into the compare array.
    travelodge.compareArray.push(this);

    // If there are two cards in the compare array...
    if(travelodge.compareArray.length === 2) {

      // Check to see if they match.
      cardCheck();
    }

  });

  // Respond to the Play Again button
  $(".play-again").click(function() {
    $(".alert").fadeOut("fast");
    buildBoard();
    return false;
  });

  // Functions

  // Function to check if two flipped cards match.
  function cardCheck() {

    var card1 = travelodge.compareArray[0];
    var card2 = travelodge.compareArray[1];

    // If the cards match...
    if($(card1).find("img.cardfront").attr("src") === $(card2).find("img.cardfront").attr("src")) {

     travelodge.score += 1;
     if(travelodge.score % 9 === 0) {
       youWin();
     }
    }

    // If the cards don't match...
    else {

      // Flip the unmatched cards back over.
      setTimeout(function() {
        $(card1).removeClass("flip");
        $(card2).removeClass("flip");
      }, 1200);


    }

    // Clear out the compare array for the next turn.
    travelodge.compareArray.length = 0;

  }

  // Function to build the playing board.
  function buildBoard() {

    // Clear any previous games
    $("#gameboard").empty();

    // Clear the score
    //travelodge.score = 0;

    // Create a temporary array to hold all the cards for the board.
    var boardArray = [];

    // Push in each of the cards from the cardArray twice.
    for(var h=0; h < travelodge.cardArray.length; h++) {
      boardArray.push(travelodge.cardArray[h]);
      boardArray.push(travelodge.cardArray[h]);
    }

    // Shuffle the board array.
    boardArray.shuffle();

    // Build the HTML for each card and card row.
    var cardHTML = "";

    // We have 18 cards so 6 cards in 3 rows...
    for(var i=0; i < 3; i++) {

      // Build the card row
      cardHTML += '<div class="row card-row">';

      // For each row, build the cards...
      for(var j=0; j < 6; j++) {
        cardHTML += '<div class="span2 panel">';
        cardHTML += '<div class="face front">';
        cardHTML += '<img class="cardback" src="img/cardback2.jpg" alt="Card Back" /></div>';
        cardHTML += '<div class="face back">';
        cardHTML += '<img class="cardfront" src="img/'+boardArray[j+i*6].file+'" alt="Card Front" /></div>';
        cardHTML += '</div>';
      }

      // Finish the row.
      cardHTML += '</div>';

    }

    // Add the rows of cards to the gameboard.
    $("#gameboard").append(cardHTML);

  }

  // Function to celebrate when you win.
  function youWin() {

    // Why? Quick way of saying "if the user has played more than 5 games".
    if(travelodge.score/9-1 > 4) {
      $(".play-again").remove(); // You're cut off. Go do something productive. Or refresh the page.
    }
    $(".witty-message").text(travelodge.messageArray[travelodge.score/9-1]); // Show the appropriate win message.
    $(".alert").fadeIn("fast");
  }

  // Build the board.
  buildBoard();

  // Return the object
  return travelodge;

})(this); // self-execute
