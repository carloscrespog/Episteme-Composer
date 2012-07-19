/**
 * This script has been custom develop for episteme's project.
 * Developed by Gsi
 */
jQuery(function ($) {

    /*
     * Prepare de sliding form: This shows a sliding effect when submiting the
     * form, and when coming backwards.
     * - It does not use any plugin
     */
    /**/
    var $slide_screen = $('#main-content').wrapInner('<div class="slide-screen"></div>').children();

    /* Double the width of the container shince two slides will be contained */
    var width = $('#main-content').width();
    $('#main-content').width(width).css({'overflow-x': 'hidden'});
    $slide_screen.width(width*2).css({'position':'relative'}); // position relative so it accept sliding

    /* Wrap the content of each slide, and slite them */
    var $slide1 = $('#main-content #selection-panel').wrap('<div class="slide"></div>').parent();
    var $slide2 = $('#main-content #element-container').wrap('<div class="slide"></div>').parent();

    $slide1.css({'float':'left'}).width(width);
    $slide2.css({'float':'left'}).width(width);
    $slide_screen.append('<div class="clear"></div>'); // clear floating
    
    /* Bind handlers to slide foward (submit) and backward (arrow) */
    $("form#skills-selection").bind('submit.steps', function () {
        $slide_screen.animate({'left':'-'+ width +'px'}, 300);
    });

    $(".back-arrow").bind('click.steps', function(){
        $slide_screen.animate({'left':'0px'}, 300);

        /* Also clear reports the page resizes to the default height */
        /* This should be done using events, so this file doesn't need to be 
         * changed when the structure of the html is changed in the target 
         * file */
        $('#main-content').trigger('clear.reports');
        $('#main-content').trigger('clear.chart');
        $('#main-content').trigger('clear.offer');
//        $('#report-container .matching-report').remove);
//        $('#matching-chart').children().empty();
    });

})
