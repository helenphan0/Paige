$(document).ready(function() {


	$('input.submit').click(function() {
		if ($('input').val() == '') {
			console.log('empty input');
			return false
		};
	});

	$('input.submit.signup').click(function() {
		if ($('input.password2').val() !== $('input#password').val()) {
			console.log('password mismatch');
			console.log($('input#password').val());
			console.log($('input.password2').val());
			return false;
		};
	});

})