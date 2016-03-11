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
	 * Click listeners for Auto/Manual Segments
	 */
	$("#btn_group_all").click(function(e) {

		//all tab selected, check if active
		if (! $(this).hasClass("active")) {
			//not active, set active
			$(this).toggleClass("active");

			//unset active from other btn
			$("#btn_group_favorites").toggleClass("active");

			//hide other
			$('#row-favorites').hide();

			//show this
			$('#row-all-charities').show();

			//set session to remember selected tab
			$.get('/session/update_session', {"sessionKey" : "showMyFavorites", "sessionValue": ""});

			//also update local session variable
			session.showMyFavorites = "";
		}
	});

	$("#btn_group_favorites").click(function(e) {
		
		//favorites tab selected, check if active
		if (! $(this).hasClass("active")) {
			//not active, set active
			$(this).toggleClass("active");

			//unset active from other btn
			$("#btn_group_all").toggleClass("active");

			//hide other
			$('#row-all-charities').hide();

			//show this
			$('#row-favorites').show();

			//set session to remember selected tab
			$.get('/session/update_session', {"sessionKey" : "showMyFavorites", "sessionValue": "favorites"});

			//also update local session variable
			session.showMyFavorites = "favorites";
		}
	});

	//To prevent buttons from staying focused after press
	$(".btn").mouseup(function(){
    	$(this).blur();
	});

	//To open detail of selected charity
	$(".causes-body").click(function(e) {

		window.open("/cause_detail/charities/" + $(this).attr('id').substr('cause'.length), "_self");
	});

	//To open detail of selected charity
	$(".causes-body-favorites").click(function(e) {

		window.open("/cause_detail/saved_causes/" + $(this).attr('id').substr('cause'.length), "_self");
	});

	$('.add-button').click(function(e) {
		if (hasBankAccount) {
			var id = $(this).closest('.charity').attr('id').substr('charity'.length);
			console.log(id);
			
			$.get("/charities/add_my_cause", {'source':'charities', 'index_charity': id}).done(function(data){
				if (data['result'] == "full") {
					$('#addMyCauseFull').modal("show");
				}
				else {
					location.reload();
				}
			});
		}
	});

	$('.add-button-favorites').click(function(e) {
		if (hasBankAccount) {
			var id = $(this).closest('.charity').attr('id').substr('charity'.length);
			console.log(id);
			
			$.get("/charities/add_my_cause", {'source':'saved_causes', 'index_charity': id}).done(function(data){
				if (data['result'] == "full") {
					$('#addMyCauseFull').modal("show");
				}
				else {
					location.reload();
				}
			});
		}
	});

	$('.favorite-button').click(function(e) {
		var id = $(this).closest('.charity').attr('id').substr('charity'.length);
		console.log(id);

		if(session.showMyFavorites == "favorites") {
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
		}
		else {
			if ($(this).hasClass('favorite-button-active')) {
				$.get('/charities/toggle_favorite', {"source": "charities", "action":"remove", "index_charity": id}).done(function(data) {
					location.reload();
				});
			}
			else {
				$.get('/charities/toggle_favorite', {"source": "charities", "action":"add", "index_charity": id}).done(function(data) {
					location.reload();
				});
			}
		}
	})
}