/**
 * Functionality for Episteme's Bazar Agil
 * Developed by Gsi
 */
jQuery(function($) {

    var display = document.querySelectorAll('#display');

    /* Feature detection */
    if (Modernizr.draganddrop) {
        // Browser supports HTML5 DnD.
        $('#display').html("Native drag and drop supported");
        //display.innerHTML = "Native drag and drop supported";
    } else {
        // Fallback to a library solution.
        $('#display').html("Native drag and drop NOT supported"); 
        //display.innerHTML = "Native drag and drop NOT supported";
    }


    /* Prevent images dragging inside draggable items */
    document.querySelectorAll('.item img').draggable = false;
    

});
