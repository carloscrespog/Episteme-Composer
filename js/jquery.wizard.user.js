/**
 * This script has been custom develop for episteme's project.
 * Developed by Gsi
 */


$(document).ready(function() {
		
		var current_offer_line=0;
		var currentKey=0;
		var currentCompany=1;
		var currentSector='';
      // Initialize
      var AppViewModel= {
			
			offerName : ko.observable("Opportunity 1"),
			description : ko.observable("A great opportunity"),
			contractor : ko.observable("GSI"),
			budget : ko.observable("5000"),
			address : ko.observable("Madrid"),
			beginDate : ko.observable("30-10-2012"),
			endDate : ko.observable("31-12-2012"),
			currentCompany: ko.observable(1),
			companyGapArray : ko.observableArray(),
		
			weightLeft : ko.observable(0)
			
		};
		init();
        

		function init(){
			ko.applyBindings(AppViewModel);
			$('#wizard').smartWizard({onFinish:onFinishCallback});

			$( "#datepickerI" ).datepicker();
			$( "#datepickerF" ).datepicker();
			$( "#datepickerI" ).datepicker("option", "dateFormat", "dd-mm-yy");
			$( "#datepickerF" ).datepicker("option", "dateFormat", "dd-mm-yy");
			loadSector('\'#act0 .sector\'');
			loadActivities(currentKey,'\'#act0 .activity\'');
			sliderIt('\'#act0\'');
		}

		
		function loadSector(selector){
			$.getJSON('data/activities.js',function(data){
				$(eval(selector)).empty();
				$.each(data,function(key,val){
					$(eval(selector)).append('<option value="'+key+'">'+val.cod+' -  '+val.tit+'</option>');

				});
			});
			$(eval(selector)).change(function(){
				var selectedSelector=selector.split('\'')[1];
				selectedSelector='\''+selectedSelector+' option:selected'+'\'';
				$(eval(selectedSelector)).each(function(){
					currentKey=$(this).val();
					var currentSelector=selector.split(' ')[0]+' .activity\'';
					loadActivities($(this).val(),currentSelector);
				});
				
			});

		}

		function loadActivities(key,selector){
			
			$.getJSON('data/activities.js',function(data){

				$(eval(selector)).empty();
				$.each(data[key].activities,function(key,val){
					$(eval(selector)).append('<option value="'+key+'">'+val.cod+' -  '+val.tit+'</value>');
				});
				$.each(data[key],function(key,val){
					currentSector=val.tit;
				});

			});
		}

		

		$('#new_offer_entry').bind('click', function() {
			newOfferLine();
		});
		/*jshint multistr:true */
		function make_new_activityline() {
			var newLine='<tr class="companyGap" style="display:none" id="act'+current_offer_line+'"> \
				<th> \
					Requisito '  +(current_offer_line+1)+ '\
				</th> <td > \
					<select  class="sector" name="activity" > \
						<option value=" "> - </option> \
					</select> \
				</td><td> \
					<select  class="activity" name="activity" > \
						<option value=" "> - </option> \
					</select> \
				</td><td> \
					<div > \
						<div class="weightSlider" style="display:inline-block"></div> \
						<input type="text" class="weightAmount" /> \
						<div class="remove-line">x</div> \
					</div> \
				</td> \
			</tr>';
			return newLine;
		}
		$('#done-button').bind('click', function() {
			fillCompanyGap();
			$('#tableCompanies').fadeOut('slow',function(){
				$('#tableCompaniesCompleted').fadeIn('slow',function(){
					$('#done-button').fadeOut('slow',function(){
						$('#new-company-entry').fadeIn('slow',function(){});
					});
				});
			});
		});
		$('#new-company-entry').bind('click',function(){
			nextCompanyGap();
			$('#tableCompaniesCompleted').fadeOut('slow',function(){
				$('#tableCompanies').fadeIn('slow',function(){
					$('#new-company-entry').fadeOut('slow',function(){
						$('#done-button').fadeIn('slow',function(){});
					});
				});
			});
		});
		function fillCompanyGap(){
			var companyGap=ko.observableArray();
			$('.companyGap').each(function(){
				var requirement=new Requirement();
				var children = $(this).children("td");
				// $(children[0]).find('select option:selected').each(function(){
				//	requirement.filter=$(this).html();
				// });
				$(children[1]).find('select option:selected').each(function(){
					requirement.field=$(this).html();
				});
				$(children[2]).find('.weightAmount').each(function(){
					requirement.weight=$(this).val();
				});
				companyGap.push(requirement);
			});
			AppViewModel.companyGapArray.push(companyGap);
		}
		function nextCompanyGap(){
			var i=AppViewModel.currentCompany()+1;
			AppViewModel.currentCompany(i);
			current_offer_line=-1;
			$('.companyGap').remove();
			newOfferLine();
		}
		function sliderIt(selector){
			var selectorSlider=selector.split('\'')[1];
			selectorSlider='\''+selectorSlider+' .weightSlider'+'\'';
			var selectorAmount=selector.split('\'')[1];
			selectorAmount='\''+selectorAmount+' .weightAmount'+'\'';
			$( eval(selectorSlider) ).slider({
            value:50,
            min: 0,
            max: 100,
            step: 5,
            slide: function( event, ui ) {
                $( eval(selectorAmount) ).val(  ui.value +' %');
            },
            change: function(event,ui){
				RefreshWeightLeft();
            }
        });
        $( eval(selectorAmount) ).val($( eval(selectorSlider) ).slider( "value" ) +' %');
        RefreshWeightLeft();
		}

		function Requirement(field,weight){
			var self=this;
			
			self.field=field;
			self.weight=weight;
		}
		
		function RefreshWeightLeft(){
			AppViewModel.weightLeft(100);
        $('.weightSlider').each(function(){
			// console.log(0+$(this).slider("value" ));
			
			var wLeft=AppViewModel.weightLeft()-$(this).slider("value" );
			if(wLeft<0){
				$('#weightLeft').parent().css("color","#EA8511");
			}else{
				$('#weightLeft').parent().css("color","#5A5655");
			}
			AppViewModel.weightLeft(wLeft) ;
			// console.log(AppViewModel.weightLeft());
        });
		}
		function newOfferLine(){
			current_offer_line = current_offer_line + 1;
			var new_line = (make_new_activityline());

			var selector='\'#act'+(current_offer_line-1)+'\'';
			var selectorSlider='\'#act'+(current_offer_line)+'  \'';
			if(current_offer_line===0){
				$('#tableCompanies tbody').append(new_line);
			}else{
				$(eval(selector)).after(new_line);
			}
			$(eval(selectorSlider)).fadeIn('slow',function(){});
			sliderIt(selectorSlider);
			loadSector('\'#act'+current_offer_line+ ' .sector\'');
			loadActivities(currentKey,'\'#act'+current_offer_line+' .activity\'');

			$('.remove-line').unbind();
			$('.remove-line').bind('click', function(){
				$(this).parent().remove();

				current_offer_line = current_offer_line - 1;
			});
		}
		function onFinishCallback(){
			var serialized= serializer();
			uploader(serialized);
			//window.location.replace("./");
			
			
		}
	
		function serializer(){
			var serialized='<?xml version="1.0" encoding="utf-8"?> \
			<rdf:RDF \
				xmlns:gsi="http://www.gsi.dit.upm.es/" \
				xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" \
				xmlns:ecos="http://kmm.lboro.ac.uk/ecos/1.0#"> \
				<rdf:Description rdf:about="' ;
			serialized = serialized + AppViewModel.offerName().replace(/ +?/g,'');
			serialized = serialized + '">'+'<ecos:name>';
			serialized = serialized + AppViewModel.offerName();
			serialized = serialized + '</ecos:name>' + '<ecos:detail>';
			serialized = serialized + AppViewModel.description();
			serialized = serialized + '</ecos:detail>' + '<gsi:contractor>';
			serialized = serialized + AppViewModel.contractor();
			serialized = serialized + '</gsi:contractor>' + '<gsi:budget>';
			serialized = serialized + AppViewModel.budget();
			serialized = serialized + '</gsi:budget>' + '<ecos:Address>';
			serialized = serialized + AppViewModel.address();
			serialized = serialized + '</ecos:Address>' + '<gsi:beginDate>';
			serialized = serialized + AppViewModel.beginDate();
			serialized = serialized + '</gsi:beginDate>' + '<gsi:endDate>';
			serialized = serialized + AppViewModel.endDate();
			serialized = serialized + '</gsi:endDate>' ;

			ko.utils.arrayForEach(AppViewModel.companyGapArray(), function(item){
				serialized = serialized + '<gsi:companyReq rdf:parseType="Resource">';
				ko.utils.arrayForEach(item(), function(req){
					serialized = serialized + '<ecos:Preference rdf:parseType="Resource">';
					serialized = serialized + '<gsi:field>'+ req.field + '</gsi:field>';
					serialized = serialized + '<ecos:weight>'+ req.weight + '</ecos:weight>';
					serialized = serialized + '</ecos:Preference>';
				});
				serialized = serialized + '</gsi:companyReq>';
			});
			
			serialized = serialized + '</rdf:Description></rdf:RDF>';
			return serialized;
		}
		function uploader(payload){
			$.ajax({
				type: 'POST',
				url: 'http://echo.local:8080/LMF/import/upload?context=default',
				contentType: 'application/rdf+xml',
				data: payload,
				success: function(){
					console.log("Success");
				}

			});
		}
	});









