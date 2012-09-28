/**
 * Functionality for Episteme's Bazar Agil
 * Developed by Gsi
 */
     var mCapabilities=new Array();
     // Creamos el Manager
     var Manager;

 $(document).ready(function() {

  $('.widgetArea').hide();
    Manager = new AjaxSolr.Manager({
        solrUrl: 'http://shannon.gsi.dit.upm.es/episteme/lmf/solr/INES/'
	//solrUrl: 'http://localhost:8080/LMF/solr/Episteme/'
    });

    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '.result_widget'
    }));

    $('#new-widget').bind('click', function() {
      
      addWidget(Math.floor(Math.random() * 10001), "province", "province");
      $('#new-widget').hide();

    });

    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
    id: 'currentsearch',
    target: '#currentselection'
    }));

    // Manager.addWidget(new AjaxSolr.AutocompleteWidget({
    //   id: 'text',
    //   target: '#searchBox',
    //   fields: [ 'name' ]
    // }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');


  $('#main-content').append('<div id="temp-placeholder"></div>');
    loadOffers(); //cargar ofertas
    //loadCompanies(); //cargar compañias

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
      $('.list_companies').parent().parent().parent().show();
      getCompanies(itemid); //ajax
      
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
    $('.widgetArea').hide();
  }
/*
 * Función que se usa para eliminar las compañias que se sueltan en un hueco
 */
 function removeCompany(el) {
  $(el).parent().parent().parent().droppable("enable");
  var cap=$(el).parent().parent().parent().attr('data-capability');
  var index=$(el).parent().parent().parent().attr('id');
  mCapabilities[eval(index.replace('o',''))]=cap;
  loadCompanies();
  $(el).parent().parent().remove();


}
/*
 * Función que se usa para cargar los huecos necesarios
 * de una oferta
 */
 function getCompanies(itemid){
  $.getJSON('data/offers/offers.js', function(data) {
    $('.list_offers').parent().hide();
    
    // $('.company').css('opacity','0.25');
    $('.panel-to').html('');
    // var mCapabilities=new Array();

    $.each(data.offers[itemid].capabilities, function(key, val) {
      var htmlCompanies='';
      htmlCompanies = htmlCompanies + '<div class="service droppable drop-company" data-max-items="1" data-drag-out-kill="true" data-read-service="true" data-droppable="true" data-capability="'+val+'" style="position: relative; " id="o'+key+'">';
      htmlCompanies = htmlCompanies + '<span class="instructions company" data-instructions="true">Arrastre aqu&iacute;:<br>('+val+')</span></div>';
      htmlCompanies = htmlCompanies + '<span class="instructions not-supported hide" data-instructions-not-supported="true">Not<br>Supported</span>';
      htmlCompanies = htmlCompanies + '<div class="cross hide" data-cant-use-read="true"><img src=""></div>';
      $('.panel-to').append(htmlCompanies);
      //$('.panel-to').hide().append(htmlCompanies).show('fast');

      var mdiv='\'#o'+key+'\'';
      var classType= val;
      classType=classType.split(' ')[0]+'_'+classType.split(' ')[1];
      var mClass='\".'+classType+'\"';
      
      dropifier(mdiv,mClass,key);
      // $(eval(mClass)).css('opacity','1');
      // var mCapability=replaceAll(val,"ñ",'%F1');
      // mCapability=replaceAll(mCapability,' ','+');
      // mCapability=replaceAll(mCapability,'ó','%F3');
      // mCapabilities[key]=mCapability;
      mCapabilities[key]=val;
      // console.log (mCapabilities[key]+ ' numero: '+key);
    });
  // console.log("llamando loadCompanies");
  loadCompanies();
  //$('.list_companies').parent().parent().parent().show();
  // console.log("llamado loadCompanies");

});
}
/*
 * Hace droppable a un determinado div y hace que acepte unas determinadas clases
 * se usa al cargar los huecos para las compañias
 */
 function dropifier(mdiv,aClass,key){
  var mDraggable;
  $(eval(mdiv)).droppable({
    accept: eval(aClass),
    activeClass: "drop-active",
    hoverClass: "drop-hover",
    drop: function(event, ui) {
      $('.instructions.company').show();
      var mdivClass='\''+mdiv.split('\'')[1]+' .instructions.company'+'\'';
      

      $(eval(mdivClass)).empty();
      mDraggable=ui.draggable;
      mDraggable.hide();
      //$('.instructions.company').empty();
      var item = ui.draggable.html();
      var itemid = ui.draggable.attr("id");
      var html = '<div class="service dropped">';
      html = html + '<div class="divrm">';
      html = html + '<a onclick="removeCompany(this)" class="remove '+itemid+'">&times;</a>';
      html = html + '</div><div>'+item+'</div>';
      $(this).append(html);
      $(this).droppable("disable");
      
      mCapabilities[key]='x';
      
      
      var testFinish=0;
      for (var m in mCapabilities){
        if(mCapabilities[m]=='x'){
          testFinish++;
        }
      }
      if(testFinish==mCapabilities.length){
        //window.location.replace("/endPage.html");
        $('.list_companies').parent().parent().parent().hide();
        $('.widgetArea').hide();
        $('#endPanel').show();
      }else{
        loadCompanies();
      }

      
      
      
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
        var classType= val.capabilities[j];
        classType=classType.split(' ')[0]+'_'+classType.split(' ')[1];
        list_offers= list_offers + classType+' ';
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
    $('.list_offers').append('<a href="offerWizard.html"><div id="new_offer_entry" class="add-arrow"></div></a>');
    $('.list_offers').append('<div class="clear"></div>');
    // $('#new_offer_entry').bind('click', function() {
    //     console.log('wololo');
    // });
    
    
    $('.item').draggable({
      revert: 'invalid',
      revertDuration: 500,
      appendTo: '#temp-placeholder',
      helper: 'clone',
      scroll: true
    });
  });
}
/*
 * Carga las compañias, mediante lmf
 * las capabilities se cargan hardcodeadas
 */
 function loadCompanies(){
  
  /*
  var query='http://apps.gsi.dit.upm.es/episteme/lmf/sparql/select?query=PREFIX+gsi%3A+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2F%3E+SELECT+DISTINCT+%3Fname+%3Factivity+%3Flogo+%3Ftype+WHERE+%7B+++++%3Fs+gsi%3AshortName+%3Fname.+++%3Fs+gsi%3Aactivity+%3Factivity.+++OPTIONAL%7B%3Fs+gsi%3Alogo+%3Flogo.%7D+++%3Fs+gsi%3Atype+%3Ftype++++++%7D+ORDER+BY+%3Ftype&output=json';
  
  $.getJSON(query, function(data) {

    var list_companies='<li class="panel">';
    var count=-1;
    $.each(data.results.bindings, function(key, val) {
      for(var j in mCapabilities){
        if(val.type.value==mCapabilities[j]){
          count++;
          if(count===15){
            count=0;
            list_companies= list_companies + '</li><li class="panel">';
          }
          list_companies= list_companies + '<div class="item company ';
          var classType= val.type.value;
          classType=classType.split(' ')[0]+'_'+classType.split(' ')[1];
          list_companies= list_companies + classType;

          list_companies= list_companies + '" id="i'+key+'" '   ;
          list_companies= list_companies + 'data-capability="';

          list_companies= list_companies + val.type.value+'"';
          list_companies= list_companies + 'data-description="'+val.activity.value+'"';

          list_companies= list_companies +'>';
          if(val.logo===undefined){
            
            list_companies= list_companies + '<div class="imgwrap"><img draggable="false" src="data/images/defaultCompany.png"/></div>';
          }else{
            list_companies= list_companies + '<div class="imgwrap"><img draggable="false" src="'+val.logo.value+'"/></div>';
          }
          
          list_companies= list_companies + '<div class="titlebar"><h2>'+val.name.value+'</h2></div></div>';
        }
      }
      
    });
list_companies= list_companies + '</li>';

$('.list_companies').html(list_companies);
*/
Manager.addWidget(new AjaxSolr.ResultWidget({
  id: 'result',
  target: '.list_companies'
}));
  console.log(mCapabilities);
  var fquery = '';
  for (var j in mCapabilities){
    if(mCapabilities[j]!="x"){
      if(j==mCapabilities.length-1){

        fquery+='type:' + '"'+mCapabilities[j]+'"';
      }else{
        fquery+='type:' + '"'+ mCapabilities[j] + '"'+ ' OR ';

      }
    }

  }
    var fq = Manager.store.values('fq');

    for (var i = 0, l = fq.length; i < l; i++) {
      if(fq[i].split(':')[0]=='type'){
          
          Manager.store.removeByValue('fq', fq[i]);

      }
      //links.push($('<a href="google.com"/>').text('(x) ' + fq[i]));
    }
    Manager.store.addByValue('fq', fquery);


    Manager.doRequest();
    
   

}
function replaceAll( text, busca, reemplaza ){
  while (text.toString().indexOf(busca) != -1)
    text = text.toString().replace(busca,reemplaza);
  return text;
}
function showIt(){
  $('.list_companies').parent().parent().parent().show();
}


function addWidget(id, target, field){
      console.log("Add widget");

      Manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: id,
        target: '#' + target,
        field: field
      }));

    Manager.store.addByValue('q', '*:*');

    var params = {
      facet: true,
      'facet.field': field,
      'facet.limit': 10,
      'facet.sort': 'count',
      'facet.mincount': 1,
      'json.nl': 'map'
    };

    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }

    Manager.doRequest();
}
