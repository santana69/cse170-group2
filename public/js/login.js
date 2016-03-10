'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	
	$('#formLogin').submit(function(e) {
		e.preventDefault();

		//Only do if no .has-error class in children (bootstrapValidator)
		if ($(this).find('.has-error').length == 0) {
			var email = $('#email').val();
			var password = $('#password').val();

		
			$.post('/login/attemptLogin', {"email":email, "password":password}).done(function(result){
				if (result['error']) {
					//display error message
					//$('#errorMessage').html(result['message']);
					$('#errorMessage').show();
				}
				else {
					//no error, redirect to page
					window.open('/', '_self');
				}
			});
		}
	});

}