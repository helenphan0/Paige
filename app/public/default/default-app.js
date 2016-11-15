$(document).ready(function() {

/*	let projectheight = Math.max($('.project-item').height());
    $('.project-item').height(projectheight);  */

    $('div.project-item').click(function() {
		let project = {};
		project.name = $(this).closest('div').data('name');
		project.img = $(this).closest('div').data('img');
		project.livelink = $(this).closest('div').data('livelink');
		project.codeurl = $(this).closest('div').data('codeurl');
		project.desc = $(this).closest('div').data('desc');
		project.skills = $(this).closest('div').data('skills');
	//	console.log(project.desc);

		$('#proj-name').children('span').append(project.name);

		if (project.img) {
			$('#proj-img').attr('src', project.img);
		}

		$('#proj-livelink').attr('src', project.livelink);
		$('#proj-codeurl').attr('src', project.codeurl);
		$('#proj-desc').children('div').text(project.desc);
		console.log($('#proj-desc').children('div').text())

	//	let tempHtml = $('#proj-desc').children('div').text();
	//	tempHtml = tempHtml.replace(/\u21B5/g, '  SOME TEXT  ');
	//	console.log(tempHtml);
	//	$('#proj-desc').children('div').text(tempHtml);

		let spanHtml = '';
		for (let i = 0; i < project.skills.length; i++) {
			spanHtml += "<span class='skill'>" + project.skills[i] + "</span>";
		}; 

		$('#proj-skill-box').append(spanHtml);
		$('.grey-out').removeClass('hidden')
		$('#single-project').removeClass('hidden');

		$('button#project-close, .grey-out').click(function() {
			$('#proj-name').children('span').empty();
			$('#proj-img').attr('src', '/public/default/page.png');
			$('#proj-livelink').attr('src', '');
			$('#proj-codeurl').attr('src', '');
			$('#proj-desc').children('div').empty();
			$('#proj-skill-box').empty();
			project = {};
			spanHtml = '';

			$('#single-project').addClass('hidden');
			$('.grey-out').addClass('hidden');
		});

	});


})