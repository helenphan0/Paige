$(document).ready(function() {

	var projectheight = Math.max($('.project-item').height());
    $('.project-item').height(projectheight);

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

	$('div.project-item').click(function() {
		let project = {};
		project.name = $(this).closest('div').data('name');
	//	project.url = $(this).closest('div').data('url');
		project.img = $(this).closest('div').data('img');
		project.livelink = $(this).closest('div').data('livelink');
		project.codeurl = $(this).closest('div').data('codeurl');
		project.desc = $(this).closest('div').data('desc');
		project.skills = $(this).closest('div').data('skills');
		console.log(project);

		$('#proj-name').children('span').append(project.name);
	//	$('#proj-url').children('span').append(project.url);
		$('#proj-img').children('span').append(project.img);
		$('#proj-livelink').attr('src', project.livelink);
		$('#proj-codeurl').attr('src', project.codeurl);
		$('#proj-desc').children('span').append(project.desc);

		let spanHtml = '';
		for (let i = 0; i < project.skills.length; i++) {
			spanHtml += "<span class='skill'>" + project.skills[i] + "</span>";
		}; 

		$('#proj-skill-box').append(spanHtml);
		$('.grey-out').removeClass('hidden')
		$('#single-project').removeClass('hidden');

		$('button#project-close, .grey-out').click(function() {
			$('#proj-name').children('span').empty();
		//	$('#proj-url').children('span').empty();
			$('#proj-img').children('span').empty();
			$('#proj-livelink').attr('src', '');
			$('#proj-codeurl').attr('src', '');
			$('#proj-desc').children('span').empty();
			$('#proj-skill-box').empty();
			project = {};
			spanHtml = '';

			$('#single-project').addClass('hidden');
			$('.grey-out').addClass('hidden');
		})

	})



	

})