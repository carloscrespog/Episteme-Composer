/**
 * This script has been custom develop for episteme's project.
 * Developed by Gsi
 */


$(document).ready(function() {
		
      // Initialize Smart Wizard
        $('#wizard').smartWizard();
		$( "#slider-range" ).slider({
			range: true,
			min: 0,
			max: 2000,
			values: [ 75, 300 ],
			step: 50,
			slide: function( event, ui ) {
				$( "#remuneration" ).val( "€" + ui.values[ 0 ] + " - €" + ui.values[ 1 ] );
			}
		});

		$( "#remuneration" ).val( "€" + $( "#slider-range" ).slider( "values", 0 ) +
			" - €" + $( "#slider-range" ).slider( "values", 1 ) );

		$( "#datepicker" ).datepicker();

		$( "#slider" ).slider({
			range: true,
			values:[0,2000],
			min: 0,
			max: 10000,
			step: 50,
			slide: function( event, ui ) {
				$( "#budget" ).val( "€" + ui.value );
			}
		});
		$( "#budget" ).val( "€" + $( "#slider" ).slider( "values",1 ) );

		$( "#expSlider" ).slider({
			range: true,
			values:[0,5],
			min: 0,
			max: 10,
			step: 1,
			slide: function( event, ui ) {
				$( "#experience" ).val(  ui.value +' años');
			}
		});
		$( "#experience" ).val( $( "#expSlider" ).slider( "values",1 ) +' años');
	});
