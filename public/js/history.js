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

	$(".my-causes-body").click(function(e) {

		window.open("/history_detail/" + $(this).attr('id').substr('cause'.length), "_self");
	});
}