(function ($) {



AjaxSolr.theme.prototype.result = function (doc, max_results) {
		
	
          

         var list_companies='';
          list_companies= list_companies + '<div class="item company ';

 	  if(doc.type===undefined){
         	var classType= 'undefined';

	  }else{
         	var classType= doc.type[0];
	  }
          classType=classType.split(' ')[0]+'_'+classType.split(' ')[1];

          list_companies= list_companies + classType;

          list_companies= list_companies + '" id="i'+doc.id+'" '   ;
          list_companies= list_companies + 'data-capability="';

          list_companies= list_companies + doc.type+'"';
          list_companies= list_companies + 'data-description="'+doc.activity+'"';

          list_companies= list_companies +'>';
          if(doc.logo===undefined){
            list_companies= list_companies + '<div class="imgwrap"><img draggable="false" src="data/images/defaultCompany.png"/></div>';
          }else{
            list_companies= list_companies + '<div class="imgwrap"><img draggable="false" src="'+doc.logo+'"/></div>';
          }
          
          list_companies= list_companies + '<div class="titlebar"><h2>'+doc.name+'</h2></div></div>';

	
        return list_companies;
};


AjaxSolr.theme.prototype.snippet = function (doc) {
  var output = '';
  if (doc.activity.length > 50) {
    output += doc.activity.substring(0, 300);
    output += '<span style="display:none;">' + doc.activity.substring(300);
    output += '</span> <a href="#" class="more">more</a>';
  }
  else {
    output += doc.activity;
  }
  return output;
};

AjaxSolr.theme.prototype.tag = function (facet, weight, handler) {

  return $('<a href="#" class="tagcloud_item"></a></br>').text(facet.value).append(' (' + facet.count + ')').click(handler);
};

AjaxSolr.theme.prototype.facet_link = function (field, value, handler) {
  return [ field + ':', $('<a href="#"/>').text(value).click(handler) ];
};

AjaxSolr.theme.prototype.no_items_found = function () {
  return 'No se encontraron coincidencias';
};

})(jQuery);
