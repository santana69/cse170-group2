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

	//To open detail of selected charity
	$(".causes-body").click(function(e) {

		window.open("/cause_detail", "_self");
	});

	$('.favorite-button').click(function(e) {
		var id = $(this).closest('.charity').attr('id').substr('charity'.length);
		console.log(id);

		if ($(this).hasClass('favorite-button-active')) {
			$.get('/charities/toggle_favorite', {"source": "saved_causes", "action":"remove", "index_charity": id}).done(function(data) {
				location.reload();
			});
		}
		else {
			$.get('/charities/toggle_favorite', {"source": "saved_causes", "action":"add", "index_charity": id}).done(function(data) {
				location.reload();
			});
		}
	})
}