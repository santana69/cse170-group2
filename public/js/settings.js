'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {

	/*
	 * Click listeners for Notifications On/Off Segments
	 */
	$("#btn_group_notification_on").click(function(e) {

		//money tab selected, check if active
		if (! $(this).hasClass("active")) {
			//not active, set active
			$(this).toggleClass("active");

			//unset active from other btn
			$("#btn_group_notification_off").toggleClass("active");
		}
	});

	$("#btn_group_notification_off").click(function(e) {
		
		//days tab selected, check if active
		if (! $(this).hasClass("active")) {
			//not active, set active
			$(this).toggleClass("active");

			//unset active from other btn
			$("#btn_group_notification_on").toggleClass("active");
		}
	});
}