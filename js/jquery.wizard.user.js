/**
 * This script has been custom develop for episteme's project.
 * Developed by Gsi
 */


$(document).ready(function() {
		
	var current_offer_line=0;
	var endPoint='http://apps.gsi.dit.upm.es/episteme/lmf/';
		//var endPoint='http://echo.local:8080/LMF/';
	var level=['Básico','Experto','Avanzado'];

	var AppViewModel= {

		offerName : ko.observable(""),
		offerLogo : ko.observable(""),
		description : ko.observable(""),
		contractor : ko.observable(""),
		budget : ko.observable(""),
		address : ko.observable(""),
		beginDate : ko.observable(""),
		endDate : ko.observable(""),
		currentCompany: ko.observable(1),
		companyGapArray : ko.observableArray(),
		skillsArray: ko.observableArray(),
		selectedChoice : ko.observable()

	};
	init();

	/* Función de inicialización */
	function init(){
		ko.applyBindings(AppViewModel);
		loadSkills();
		$('#wizard').smartWizard({onFinish:onFinishCallback});

		$( "#datepickerI" ).datepicker();
		$( "#datepickerF" ).datepicker();
		$( "#datepickerI" ).datepicker("option", "dateFormat", "dd-mm-yy");
		$( "#datepickerF" ).datepicker("option", "dateFormat", "dd-mm-yy");
		rateIt('\'#act0\'');
	}

	/* Función que activa los campos de autocomplete */
	function loadActivities(selector){
		$(eval(selector)).empty();
		$( eval(selector) ).autocomplete({
			source: AppViewModel.skillsArray()
		});
	}

	/* Función que carga del endpoint la lista de skills */
	function loadSkills(){
		var query=endPoint+'sparql/select?query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E+PREFIX+ecos%3A+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23%3E+SELECT+DISTINCT+%3Fskill+WHERE+%7B+++%3Fid+ecos%3ASpecific+%3Fspecific+.+++++%3Fspecific+ecos%3ASkill+%3Fskills+.+++++++++%3Fskills+rdf%3ABag+%3Fbag+.+++++++++%3Fbag+%3Fp+%3Fbagid+.+++++++++%3Fbagid+ecos%3Aname+%3Fskill+.+++++FILTER+%28+lang%28%3Fskill%29+%3D+%22es%22+%29+%7D&output=json';
		$.getJSON(query,function(data){

			$.each(data.results.bindings,function(key,val){
				var skill=val.skill.value;
				console.log(skill);
				AppViewModel.skillsArray.push(skill);
			});
			loadActivities('\'#act0 .activity\'');
			$('#autocomplete' ).autocomplete({
				source: AppViewModel.skillsArray()
			});

		});

	}

	/* Binding para el botón de nuevo requisito */
	$('#new_offer_entry').bind('click', function() {
		newOfferLine();
	});

	/* Función que genera nueva linea de requisito */
	/*jshint multistr:true */
	function make_new_activityline() {
		var newLine='<tr class="companyGap" style="display:none" id="act'+current_offer_line+'"> \
		<th> \
		Requisito '  +(current_offer_line+1)+ '\
		</th> <td > \
		<input class="activity"> \
		</td><td> \
		<select class="rating">\
		<option value="0">Básico</option>\
		<option value="1" selected="selected">Experto</option>\
		<option value="2">Avanzado</option>\
		</select>\
		<span class="ratingText"></span>\
		<div class="remove-line">x</div> \
		</td> \
		</tr>';
		return newLine;
	}

	/* Binding para el botón de fin de compañia */
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

	/* Binding para el botón de nueva compañia */
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

	/* Guarda en la viewModel un companyGap */
	function fillCompanyGap(){
		var companyGap=ko.observableArray();
		$('.companyGap').each(function(){
			var requirement=new Requirement();
			var children = $(this).children("td");

			$(children[0]).find('.activity').each(function(){
				console.log("Habilidad"+$(this).val());
				requirement.field=$(this).val();
			});
			$(children[1]).find('.ratingText').each(function(){
				requirement.weight=$(this).html();
				console.log("Peso"+$(this).html());
			});
			companyGap.push(requirement);
		});
		AppViewModel.companyGapArray.push(companyGap);
	}

	/* Modifica la interfaz y la prepara para un nuevo companyGap */
	function nextCompanyGap(){
		var i=AppViewModel.currentCompany()+1;
		AppViewModel.currentCompany(i);
		current_offer_line=-1;
		$('.companyGap').remove();
		newOfferLine();
	}

	/* Activa el plugin de rating en un determinado elemento, selector */
	function rateIt(selector){
		var selectorRating=selector.split('\'')[1];
		var selectorRatingText='\''+selectorRating+' .ratingText'+'\'';
		selectorRating='\''+selectorRating+' .rating'+'\'';

		$(eval(selectorRating)).rating({
			showCancel:false
		});
		$(eval(selectorRating)).bind("change",function(){
			$(eval(selectorRatingText)).text(level[$(eval(selectorRating)).val()]);
		});

		$(eval(selectorRating)).val(1).change();
	}

	/* Modelo de cada requisito, formarán parte de un companyGap */
	function Requirement(field,weight){
		var self=this;

		self.field=field;
		self.weight=weight;
	}
		
	/* Añade una linea, creada con la función make_new_activity_line */
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
		rateIt(selectorSlider);

		loadActivities('\'#act'+current_offer_line+' .activity\'');
		$('.remove-line').unbind();
		$('.remove-line').bind('click', function(){
			$(this).parent().remove();

			current_offer_line = current_offer_line - 1;
		});
	}

	/* Función llamada al hacer click en finish */
	function onFinishCallback(){
		var serialized= serializer();
		uploader(serialized);
		console.log(serialized	);
			//window.location.replace("./");
	}
	
	/* Extrae los datos del viewModel y devuelve el rdf */
	function serializer(){
		var serialized='<?xml version="1.0" encoding="utf-8"?> \
		<rdf:RDF \
		xmlns:gsi="http://www.gsi.dit.upm.es/" \
		xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" \
		xmlns:ecos="http://kmm.lboro.ac.uk/ecos/1.0#"> \
		<rdf:Description rdf:about="' ;
		serialized = serialized + AppViewModel.offerName().replace(/ +?/g,'');
		serialized = serialized + '">'+ '<gsi:id>'+ Math.floor(Math.random()*10000)+'</gsi:id>';
		serialized = serialized + '<gsi:logo>'+AppViewModel.offerLogo()+'</gsi:logo>';
		serialized = serialized + '<ecos:name>';
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

	/* Sube un archivo, payload, al endpoint definido*/
	function uploader(payload){
		$.ajax({
			type: 'POST',
			url: endPoint+'import/upload?context=default',
			contentType: 'application/rdf+xml',
			data: payload,
			success: function(){
				console.log("Success");
			}

		});
	}
});









