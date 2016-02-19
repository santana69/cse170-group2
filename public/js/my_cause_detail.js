'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$("#save_amount").change(function(e){
		console.log($(this).val());

		$.get('/my_cause_detail/' + id_cause + "/" + $(this).val() + "/" + $("#save_amount option:selected").text());
	});

	//To prevent buttons from staying focused after press
	$(".btn").mouseup(function(){
    	$(this).blur();
	});
}