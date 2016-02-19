'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {

	//To prevent buttons from staying focused after press
	$(".btn").mouseup(function(){
    	$(this).blur();
	});

	$('.add-button').click(function(e) {
		
		$.get("/charities/add_my_cause", {'source':'charities', 'index_charity': id_cause}).done(function(data){
			if (data['result'] == "full") {
				$('#addMyCauseFull').modal("show");
			}
			else {
				location.reload();
			}
		});
	});

	$('.add-button-favorites').click(function(e) {
		var id = $(this).closest('.charity').attr('id').substr('charity'.length);
		console.log(id);
		
		$.get("/charities/add_my_cause", {'source':'saved_causes', 'index_charity': id_cause}).done(function(data){
			if (data['result'] == "full") {
				$('#addMyCauseFull').modal("show");
			}
			else {
				location.reload();
			}
		});
	});

	$('.favorite-button').click(function(e) {

		if(session.showMyFavorites == "favorites") {
			if ($(this).hasClass('favorite-button-active')) {
				$.get('/charities/toggle_favorite', {"source": "saved_causes", "action":"remove", "index_charity": id_cause}).done(function(data) {
					window.open('/charities', "_self");
				});
			}
			else {
				$.get('/charities/toggle_favorite', {"source": "saved_causes", "action":"add", "index_charity": id_cause}).done(function(data) {
					location.reload();
				});
			}
		}
		else {
			if ($(this).hasClass('favorite-button-active')) {
				$.get('/charities/toggle_favorite', {"source": "charities", "action":"remove", "index_charity": id_cause}).done(function(data) {
					location.reload();
				});
			}
			else {
				$.get('/charities/toggle_favorite', {"source": "charities", "action":"add", "index_charity": id_cause}).done(function(data) {
					location.reload();
				});
			}
		}
	})
}