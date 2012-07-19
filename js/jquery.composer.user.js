/**
 * Functionality for Episteme's Bazar Agil
 * Developed by Gsi
 */
 $(document).ready(function() {
  $('#main-content').append('<div id="temp-placeholder"></div>');
    loadOffers(); //cargar ofertas
    loadCompanies(); //cargar compañias
    
  /*
   * Hacer droppables los huecos para las ofertas
   * Mediante getCompanies se carga el número de huecos necesarios para
   * cada oferta
   */
   $('.drop-offer').droppable({
    accept: ".offer",
    activeClass: "drop-active",
    drop: function(event, ui) {
      $('.instructions.offer').empty();
      var item = ui.draggable.html();
      var itemid = ui.draggable.attr("id");
      var html = '<div class="service dropped">';
      html = html + '<div class="divrm">';
      html = html + '<a onclick="remove(this)" class="remove '+itemid+'">&times;</a>';
      html = html + '</div><div>'+item+'</div>';
      $(this).append(html);
      itemid=itemid.replace(/[a-z]+/,"");
      getCompanies(itemid); //ajax
      $('.list_offers').parent().hide();
      $('.list_companies').parent().parent().parent().show();
    },activate: function(event,ui){
      $('.instructions.offer').hide();
    },deactivate: function(event,ui){
      $('.instructions.offer').show();
    }
  });
 });
  /*
   * Función que se usa para eliminar las ofertas que se sueltan en un hueco
   */
   function remove(el) {
    $(el).parent().parent().remove();
    var htmlCompanies = '<div class="service droppable drop-company" data-max-items="1" data-drag-out-kill="true" data-read-service="true" data-droppable="true" style="position: relative; " id="g2"></div>';
    htmlCompanies = htmlCompanies + '<span class="instructions company" data-instructions="true">Arrastre aqu&iacute;<br>(Compañ&iacute;as)</span>';
    htmlCompanies = htmlCompanies + '<span class="instructions not-supported hide" data-instructions-not-supported="true">Not<br>Supported</span>';
    htmlCompanies = htmlCompanies + '<div class="cross hide" data-cant-use-read="true"><img src="/static/images/frontend/cross-large.png"></div>';
    $('.panel-to').html(htmlCompanies);
    $('.list_offers').parent().show();
    $('.list_companies').parent().parent().parent().hide();
  }
/*
 * Función que se usa para eliminar las compañias que se sueltan en un hueco
 */
 function removeCompany(el) {
  $(el).parent().parent().parent().droppable("enable");
  $(el).parent().parent().remove();
}
/*
 * Función que se usa para cargar los huecos necesarios
 * de una oferta
 */
 function getCompanies(itemid){
  $.getJSON('data/offers/offers.js', function(data) {
    $('.panel-to').html('');
    $.each(data.offers[itemid].capabilities, function(key, val) {
      var htmlCompanies='';
      htmlCompanies = htmlCompanies + '<div class="service droppable drop-company" data-max-items="1" data-drag-out-kill="true" data-read-service="true" data-droppable="true" style="position: relative; " id="o'+key+'">';
      htmlCompanies = htmlCompanies + '<span class="instructions company" data-instructions="true">Arrastre aqu&iacute;<br>(Compañ&iacute;as)</span></div>'+val;
      htmlCompanies = htmlCompanies + '<span class="instructions not-supported hide" data-instructions-not-supported="true">Not<br>Supported</span>';
      htmlCompanies = htmlCompanies + '<div class="cross hide" data-cant-use-read="true"><img src="/static/images/frontend/cross-large.png"></div>';
      $('.panel-to').append(htmlCompanies);
      var mdiv='\'#o'+key+'\'';
      var mClass='\".'+val+'\"';
      console.log(eval(mdiv)+' y '+mClass);
      dropifier(mdiv,mClass);
    });
  });
}
/*
 * Hace droppable a un determinado div y hace que acepte unas determinadas clases
 * se usa al cargar los huecos para las compañias
 */
 function dropifier(mdiv,aClass){
  var mDraggable;
  $(eval(mdiv)).droppable({
    accept: eval(aClass),
    activeClass: "drop-active",
    hoverClass: "drop-hover",
    drop: function(event, ui) {
      mDraggable=ui.draggable;
      mDraggable.hide();
      $('.instructions.company').empty();
      var item = ui.draggable.html();
      var itemid = ui.draggable.attr("id");
      var html = '<div class="service dropped">';
      html = html + '<div class="divrm">';
      html = html + '<a onclick="removeCompany(this)" class="remove '+itemid+'">&times;</a>';
      html = html + '</div><div>'+item+'</div>';
      $(this).append(html);
      $(this).droppable("disable");
      loadCompanies();
      $('.list_companies').parent().show();
    },activate: function(event,ui){
      $('.instructions.company').hide();
    },deactivate: function(event,ui){
      $('.instructions.company').show();
    }
  });
}
/*
 * Carga las ofertas, de momento en local, tambien pone las qtips
 */
 function loadOffers(){
  $.getJSON('data/offers/offers.js', function(data) {
    $('.list_offers').html('');
    $.each(data.offers, function(key, val) {
      var list_offers='';
      list_offers= list_offers + '<div class="item offer" id="o'+key+'" ';
      list_offers= list_offers + 'data-capability="';
      for(var j in val.capabilities){
        list_offers= list_offers + val.capabilities[j]+' ';
      }
      list_offers= list_offers +'">';
      list_offers= list_offers + '<div class="imgwrap"><img draggable="false" src="'+val.logo.src+'"/></div>';
      list_offers= list_offers + '<div class="titlebar"><h2>'+val.name+'</h2></div></div>';
      $('.list_offers').append(list_offers);
       // $('.item.offer').draggable({
       //   revert: true
       // });
    
    $('.list_companies').parent().hide();
  });
    $('list_offers').append('<div class="clear"></div>');
  });
}
/*
 * Carga las compañias, mediante lmf
 * las capabilities se cargan hardcodeadas
 */
 function loadCompanies(){
  var query='http://apps.gsi.dit.upm.es/episteme/lmf/sparql/select?query=PREFIX+gsi%3A+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2F%3E+SELECT+DISTINCT+%3Fname+%3Factivity+%3Flogo++WHERE+%7B++++%3Fs+gsi%3AshortName+%3Fname.+++%3Fs+gsi%3Aactivity+%3Factivity.+++%3Fs+gsi%3Alogo+%3Flogo+%7D+ORDER+BY+%3Fname+&output=json';
  $.getJSON(query, function(data) {
    var list_companies='<li class="panel">';
    var count=-1;
    $.each(data.results.bindings, function(key, val) {
      count++;
      if(count===15){
        count=0;
        list_companies= list_companies + '</li><li class="panel">';
      }
      list_companies= list_companies + '<div class="item company ';

      list_companies= list_companies + 'technical_memo admin_memo';

      list_companies= list_companies + '" id="i'+key+'" '   ;
      list_companies= list_companies + 'data-capability="';

      list_companies= list_companies + 'technical_memo admin_memo"';
      list_companies= list_companies + 'data-description="'+val.activity.value+'"';

      list_companies= list_companies +'>';
      list_companies= list_companies + '<div class="imgwrap"><img draggable="false" src="'+val.logo.value+'"/></div>';
      list_companies= list_companies + '<div class="titlebar"><h2>'+val.name.value+'</h2></div></div>';
    });
    list_companies= list_companies + '</li>';
    $('.list_companies').html(list_companies);

    /*
     * Usamos el helper clone para que no desaparezca al arrastrar
     * appendTo se encarga de que el draggable pueda salir de la caja del slider
     * usamos revert  invalid porque queremos que vuelva al dejar fuera del hueco
     */
     $('.item').draggable({
      revert: 'invalid',
      revertDuration: 500,
      appendTo: '#temp-placeholder',
      helper: 'clone',
      scroll: true
    });
     $('#slider').anythingSlider({
      buildStartStop:false,
      hashTags:false
    });
     $('.item').qtip({
      content: {
        title: {
          text: function(){
            return $(this).html();
          }
        },
        attr:'data-description'
      },
      style: {
        classes: 'ui-tooltip-rounded ui-tooltip-shadow ui-tooltip-episteme'
      },
      // hide: {
      //   event: 'click'
      // },
      
      position:{
        my:'bottom center',
        at:'top center'
      }
    });
   });
}
