'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	//time when page was loaded
	var loadDate = new Date().getTime();


	//To prevent buttons from staying focused after press
	$(".btn").mouseup(function(){
    	$(this).blur();
	});

	/*
	 * Click listeners for money choices
	 */
	$(".btn-choice-1").click(function(e) {

		//check if active
		if ($(this).hasClass("active")) {
			//active, unset active
			$(this).toggleClass("active");

			//set save button disabled
			$(this).closest('.row').find('.btn-save').attr('disabled', true);
		}
		else {
			//not active, set active
			$(this).toggleClass("active");

			//remove active from other button (if applicable)
			$(this).closest('.row').find('.btn-choice-2').removeClass('active');

			//set save button enabled
			$(this).closest('.row').find('.btn-save').attr('disabled', false);
		}
	});

	/*
	 * Click listeners for money choices
	 */
	$(".btn-choice-2").click(function(e) {

		//check if active
		if ($(this).hasClass("active")) {
			//active, unset active
			$(this).toggleClass("active");

			//set save button disabled
			$(this).closest('.row').find('.btn-save').attr('disabled', true);
		}
		else {
			//not active, set active
			$(this).toggleClass("active");

			//remove active from other button (if applicable)
			$(this).closest('.row').find('.btn-choice-1').removeClass('active');

			//set save button enabled
			$(this).closest('.row').find('.btn-save').attr('disabled', false);
		}
	});

	$(".my-causes-body").click(function(e) {

		window.open("/my_cause_detail/" + $(this).attr('id').substr('cause'.length), "_self");
	});

	$('.btn-save').click(function(e) {
		//calculate time elapsed since page load
		var now = new Date().getTime();
		var timeElapsed = now - loadDate;

		//send time event to GA
		ga('send', 'timing', 'save', 'homeDeleteCause', timeElapsed);

		var id_cause = $(this).closest('.my-panel').find('.my-causes-body').attr('id').substr('cause'.length);
		var amountToAdd = $(this).closest('.row').find('.btn-choice.active').attr('value');

		window.open("/addMoneyToCause/index/"+id_cause+"/"+amountToAdd, "_self");
	});

	$('.donate-button').click(function(e) {
		var id_cause = $(this).closest('.my-panel').find('.my-causes-body').attr('id').substr('cause'.length);

		$('#donationConfirmModal').find('#donateButton').attr('value', id_cause);

		$('#donationConfirmModal').modal('show');
	});

	$('#donateButton').click(function(e) {
		var id_cause = $(this).attr('value');

		$('#donationModal').find('#donateAnchor').attr('href', "/donateToCause/" + id_cause);

		$('#donationConfirmModal').modal('hide');
		$('#donationModal').modal('show');
	});

	$('.delete-cause-button').click(function(e) {
		e.stopPropagation();

		var id_cause = $(this).closest('.my-causes-body').attr('id').substr('cause'.length);

		$('#deleteCauseModal').find('#deleteCauseAnchor').attr('href', "/my_cause_detail/deleteCause/" + id_cause);

		$('#deleteCauseModal').modal('show');
	});

	$('#deleteCauseAnchor').click(function(e) {

		ga('send', 'event', 'deleteCause', 'homeDeleteCause');
	});
}