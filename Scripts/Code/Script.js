   var gamesDatatable=null;
   $(document).ready(function () {
        getGames();
         $("#btnClr").click(function(){
          localStorage.removeItem("game");
          $("#divMsg").show().empty().append('<strong>Success!</strong> Data is removed from Local Storage');
         });

         $("#btnRefresh").click(function(){
            $("#divMsg").empty().hide();
           if (gamesDatatable !== null && gamesDatatable !== "") {
            gamesDatatable.fnClearTable()
            gamesDatatable.fnDestroy();
            $("#tblGames tbody").append('<tr style="text-align: center;"><td colspan="7"><img height="75" widht="75" alt="loading" src="images/preloader.gif"></td></tr>')
            }
            setTimeout(function(){
               getGames();
            },3000);
           
         })

    })
   
    function getGames() {

    	var gameData = localStorage.getItem("game");
    	if (gameData == null || gameData == "null") {
    		 $.ajax({
	           url: "http://starlord.hackerearth.com/gamesext",
	           type: "GET",
	           contentType: "application/json",
	           success: function (data) {
	             dataTableInit(data);
               $("#divMsg").show().empty().append('<strong>Success!</strong> Data is loaded from api call.');
               $("#divMsg").addClass("alert alert-success");

	             localStorage.setItem("game",JSON.stringify(data))
	           },
	           error: function (x, h, r) {
	           	alert("error Occured")
	           }

	       	})
    	}
    	else{
    		var data = JSON.parse(localStorage.getItem("game"));
         $("#divMsg").show().empty().append('<strong>Success!</strong> Data is Loaded from Local Storage.');
         $("#divMsg").addClass("alert alert-success");
    		 dataTableInit(data);
    	}
      
    }

   function dataTableInit(data){
     $("#btnClr").attr("disabled",false)
   	var dataSrc = [];
             gamesDatatable=  $("#tblGames").dataTable({
             	   responsive:true,
                   data: data,
                   searching: true,
                   paging:true,
                   processing : true,
                   language: {
				        processing: "<img height='75' widht='75' src='images/preloader.gif'>",				        
    			   },    
                   initComplete: function(){
				         var api = this.api();

				         // Populate a dataset for autocomplete functionality
				         // using data from first column
				         api.cells('tr', [0,2]).every(function(){
				            // Get cell data as plain text
				            var data = $('<div>').html(this.data()).text();           
				            if(dataSrc.indexOf(data) === -1){ dataSrc.push(data); }
				         });
				         
				         // Sort dataset alphabetically
				         dataSrc.sort();	
				        
				         // Initialize Typeahead plug-in
				         $('.dataTables_filter input[type="search"]', api.table().container())
				            .typeahead({
				               source: dataSrc,
				               afterSelect: function(value){
				                  api.search(value).draw();
				               }
				            }
				         );
				      },
                   columns: [
                       {
                           "data": "title",
                           "searchable": true                            
                       },
                       {
                           "data": "url",
                           "sortable": false,
                           "searchable": false,
                           "render":function(data){
                           		return data ? '<a href="'+data+'">'+data+'</a>' : "";
                           }                            
                       },
                       {
                           "data": "platform",
                           "sortable": false,
                           "searchable": true                            
                       },
                       {
                           "data": "score",
                           "searchable": false                            
                       },
                       {
                           "data": "genre",
                           "sortable": false,
                           "searchable": false                            
                       },
                       {
                           "data": "editors_choice",
                           "sortable": false,
                           "searchable": false  	                          
                       },
                       {
                           "data": "release_year",
                           "sortable": false,
                           "searchable": false                            
                       }  

                   ]
      
               });
   }
