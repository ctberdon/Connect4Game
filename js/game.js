/*
 * Connect Four Game
 * @author: Carmencito T. Berdon
 * @email: carmencito.berdon@gmail.com
 * @site: http://carmencitoberdon.com
 */

var player1_class = 'player-1';
var player2_class = 'player-2';
var gameboard_id = 'gameboard-table';
var board_cols = {};
var score_board = {};
var winner = 0;

$(document).ready(function() {
    var gameboard = '<table id="' + gameboard_id + '">';
    var current_player = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    
    // Prepare gameboard
    for (var i = 0; i <= 48; i++) {
        var slot_class = i <= 6 ? 'index' : 'game-slot';
        i % 7 == 0 && (gameboard += '<tr>');
        gameboard += '<td class="' + slot_class + '"><div class="disc">&nbsp;</div></td>';
        i+2 % 7 == 0 && (gameboard += '</tr>');
    }
    
    gameboard += '</table>';
    
    /*
     * *****************************************
     * Attach events
     * *****************************************
     */
    /*
     * Reset Board
     */
    $(document).on('reset', '#' + gameboard_id, function(e) {
        // reset board column counter
        for (var i = 0; i <=6; i++) {
            board_cols[i] = 0;
        }
        
        // reset score board
        for (var i = 0; i <=48; i++) {
            score_board[i] = 0;
        }
        
        // reset winner
        winner = 0;
        
        // reset all disc
        $('.disc', '#' + gameboard_id).removeClass().addClass('disc');
        // make board active
        $('#' + gameboard_id).addClass('active');
        
        // randomize player
        current_player = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        
        // reset message
        $('.say-whose-turn > .message-whose-turn', '#score-board').show();
        $('.say-whose-turn > .message-whos-winner', '#score-board').hide();
        // say whose turn
        sayWhoseTurn(current_player);
    });
    
    /*
     * Game Controller
     */
    $('#gameboard-control').on('click', 'button[name=reset]', function(e) {
        e.preventDefault();
        
        if ( confirm('Are you sure you want to start new game?') ) {
            $('#' + gameboard_id).trigger('reset');
        }
    });
    
    /*
     * Drop disc
     */
    $(document).on('click', '#' + gameboard_id + ' td', function(e) {
        e.preventDefault();
        // get current td index
        var $index = parseInt($('td').index(this)) % 7;
        // init slot
        var slot = 0;
        // debug
        //console.log( $index );
        
        // check if column is full or game is active
        if (board_cols[$index] > 5 || winner > 0) {
            //console.log($index + ' is full');
            return false;
        }
        
        // get empty slot of current column
        slot = ((6 - board_cols[$index]) * 7) + $index;
        // increment column counter
        board_cols[$index] += 1;
        // who owns this slot?
        score_board[slot] = current_player;
        // debug score board
        //console.log(score_board);
        
        // place disc
        $('.disc', $('td:eq(' + slot + ')', '#' + gameboard_id)).addClass('player-' + current_player);
        // check winner
        checkWinner(current_player);
        // is a winner declared?
        if (winner > 0) {
            // render board inactive by disabling disc movement
            $('#' + gameboard_id).removeClass('active');
            // reset disc class
            $('td.index .disc', '#' + gameboard_id).removeClass().addClass('disc');
            return false;
        }
        
        // switch player
        current_player = current_player == 1 ? 2 : 1;
        // say whose turn
        sayWhoseTurn(current_player);
        // reset disc class
        $('td.index .disc', '#' + gameboard_id).removeClass().addClass('disc');
        $('.disc', $('td:eq(' + $index + ')', '#' + gameboard_id)).addClass('player-' + current_player);
    });
    
    /*
     * Move disc
     */
    $(document).on('mouseover', '#' + gameboard_id + '.active td', function(e) {
        e.preventDefault();
        // get current td index
        var $index = parseInt($('td').index(this)) % 7;
        // reset disc class
        $('td.index .disc', '#' + gameboard_id).removeClass().addClass('disc');
        $('.disc', $('td:eq(' + $index + ')', '#' + gameboard_id)).addClass('player-' + current_player);
    });
    
    /*
     * Hide disc
     */
    $(document).on('mouseout', '#' + gameboard_id + '.active', function(e) {
        // reset disc class
        $('td.index .disc', '#' + gameboard_id).removeClass().addClass('disc');
    });
    /*
     * *********************************************************
     */
    
    
    /*
     * *********************************************************
     * Show Board
     * *********************************************************
     */
    $('#gameboard').html(gameboard);
    // reset board
    $('#' + gameboard_id).trigger('reset');
});

/**
 * Checks winner
 * @param {int} player
 */
function checkWinner(player)
{
    // traverse rows and cols
    for (var i = 7; i <= 48; i++)
    {
        if (score_board[i] != player) {
            // next loop please
            continue;
        }
        
        // check horizontal, vertical, diagonal descending, diagonal ascending
        if (
            (i+3 <= 48 /* horizontal */
                && $.inArray(i, [11, 12, 13, 18, 19, 20, 25, 26, 27, 32, 33, 34, 39, 40, 41]) < 0
                && score_board[i + 1] == player
                && score_board[i + 2] == player
                && score_board[i + 3] == player)
            || ( i+(7*3) <= 48 /* vertical */
                && score_board[i + 7] == player
                && score_board[i + (7*2)] == player
                && score_board[i + (7*3)] == player)
            || ( (i+3)+(7*3) <= 48 /* diagonal descending */
                && $.inArray(i, [11, 12, 13, 18, 19, 20, 25, 26, 27]) < 0
                && score_board[(i+1) + 7] == player
                && score_board[(i+2) + (7*2)] == player
                && score_board[(i+3) + (7*3)] == player)
            || ( i-(7*3) >= 7 /* diagonal ascending */
                && $.inArray(i, [32, 33, 34, 39, 40, 41, 46, 47, 48]) < 0
                && score_board[(i+1) - 7] == player
                && score_board[(i+2) - (7*2)] == player
                && score_board[(i+3) - (7*3)] == player)
        )
        {
            // declare who's the winner
            winner = player;
            // indicate who's winner
            sayWhosWinner(winner);
            // Announce who's the winner
            alert('Player ' + player + ' wins!');
            // break from loop
            break;
        }
    }
    
    // check for draw game
    if (winner < 1)
    {
        // stores how many rows were full
        var full_rows = 0;
        
        for (var i = 0; i <= 6; i++) {
            if (board_cols[i] > 5) {
                full_rows++;
            }
        }
        
        // are all rows full
        if (full_rows == 7)
        {
            alert('The game is a draw.');
            // modify winner number as this is used to determine if board is active
            winner = 99;
        }
    }
}

/**
 * Display whose turn is it
 * @param {int} playey
 */
function sayWhoseTurn(player)
{
    // say who's turn
    $('#player-id').text(player);
    // change disc to current player's
    $('.say-whose-turn > .disc', '#score-board').removeClass().addClass('disc player-' + player);
}

/**
 * Display who's the player
 * @param {int} player
 */
function sayWhosWinner(player)
{
    $('.say-whose-turn > .message-whose-turn', '#score-board').hide();
    // say who's winner
    $('.say-whose-turn > .message-whos-winner', '#score-board').show().html('Player ' + player + ' wins!!!');
    // change disc to current player's
    $('.say-whose-turn > .disc', '#score-board').removeClass().addClass('disc player-' + player);
}