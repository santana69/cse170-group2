'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$("#btn_group_money").click(function(e) {

		//money tab selected, check if active
		if (! $(this).hasClass("active")) {
			//not active, set active
			$(this).toggleClass("active");

			//unset active from other btn
			$("#btn_group_days").toggleClass("active");

			//set until you can label to money
			$("#until_you_can_label").html("$5 until you can donate to ...");
		}
	});

	$("#btn_group_days").click(function(e) {
		
		//days tab selected, check if active
		if (! $(this).hasClass("active")) {
			//not active, set active
			$(this).toggleClass("active");

			//unset active from other btn
			$("#btn_group_money").toggleClass("active");

			//set until you can label to days
			$("#until_you_can_label").html("5 days until you can donate to ...");
		}
	});
}