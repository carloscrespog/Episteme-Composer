/**
 * This script has been custom develop for episteme's project.
 * Developed by Gsi
 */


$(document).ready(function() {
		
		var current_offer_line=0;
		var currentKey=0;
		var currentCompany=1;
		var currentSector='';
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
		loadSector();
		loadActivities(currentKey);
		function loadSector(){
			$.getJSON('data/activities.js',function(data){
				$('#sector').empty();
				$.each(data,function(key,val){
					$('#sector').append('<option value="'+key+'">'+val.cod+' -  '+val.tit+'</option>');

				});
			});
			$('#sector').change(function(){
				$('#sector option:selected').each(function(){
					currentKey=$(this).val();
					loadActivities($(this).val());
				});
				
			});

		}

		function loadActivities(key){
			
			$.getJSON('data/activities.js',function(data){
				$('.activity').empty();
				$.each(data[key].activities,function(key,val){
					$('.activity').append('<option value="'+key+'">'+val.cod+' -  '+val.tit+'</value>');
				});
				$.each(data[key],function(key,val){
					console.log('val: '+val);
					currentSector=val.tit;
				});

			});
		}

		

		$('#new_offer_entry').bind('click', function() {
			
			var new_line = (make_new_activityline());
			
			var selector='\'#act'+current_offer_line+'\'';
			
			$(eval(selector)).after(new_line);
			loadActivities(currentKey);
			current_offer_line = current_offer_line + 1;
			$('.remove-line').unbind();
			$('.remove-line').bind('click', function(){
				$(this).parent().remove();
				
				current_offer_line = current_offer_line - 1;
			});
		});

		function make_new_activityline() {

			return '<div class="skill-level-closure activity-level" id="act'+(current_offer_line+1)+'"><label for="activity">Actividad que desarrolla:</label><select  class="activity" name="activity"><option value=" "> - </option></select><div class="remove-line" >x</div></div>';

		}
		$('#done-button').bind('click', function() {
			var infoCompany='';
			infoCompany=infoCompany+'<div class="skill-level-closure">';
			infoCompany=infoCompany+'<ul><li><label>Compañ&iacute;a '+ currentCompany+'</label><li>';
			
			
			infoCompany=infoCompany+'<li><label>Sector de actividad: </label>'+currentSector+'<li>';
			
			infoCompany=infoCompany+'</ul>';
			infoCompany=infoCompany+'</div>';
			
			$('#step-3 .skill-level-closure').remove();
			$('#done-button').hide();
			$('#step-3').append(infoCompany);
		});




	});
