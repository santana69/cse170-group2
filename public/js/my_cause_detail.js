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

	/*
	 * Click listeners for money choices
	 */
	$("#btn-choice-1").click(function(e) {

		//check if active
		if ($(this).hasClass("active")) {
			//active, unset active
			$(this).toggleClass("active");

			//set save button disabled
			$('#btn-save').attr('disabled', true);
		}
		else {
			//not active, set active
			$(this).toggleClass("active");

			//remove active from other button (if applicable)
			$('#btn-choice-2').removeClass('active');

			//set save button enabled
			$('#btn-save').attr('disabled', false);
		}
	});

	/*
	 * Click listeners for money choices
	 */
	$("#btn-choice-2").click(function(e) {

		//check if active
		if ($(this).hasClass("active")) {
			//active, unset active
			$(this).toggleClass("active");

			//set save button disabled
			$('#btn-save').attr('disabled', true);
		}
		else {
			//not active, set active
			$(this).toggleClass("active");

			//remove active from other button (if applicable)
			$('#btn-choice-1').removeClass('active');

			//set save button enabled
			$('#btn-save').attr('disabled', false);
		}
	});

	$('#btn-save').click(function(e) {

		var amountToAdd = $(this).closest('.row').find('.btn-choice.active').attr('value');

		window.open("/addMoneyToCause/my_cause_detail/"+id_cause+"/"+amountToAdd, "_self");
	});
}