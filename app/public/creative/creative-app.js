function listProjects(project) {
	var defaultImg = '/public/default/page.png';
	var projectBox = $('.template .project-item').clone();
	projectBox.attr('id', project._id);

	var projImg = projectBox.children('.project-image');
	projImg.attr('src', project.image || defaultImg);

	var projName = projectBox.children('.project-name');
	projName.text(project.name);

	return projectBox;
} 

function getProjects() {
	$.ajax('/cms/projects/get-projects', {
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json'
	})
	.done(function(results){
		allProjects = results.projects;
		$.each(allProjects, function(i, project) {
			var proj = listProjects(project);
			$('#results').append(proj);
		});
	});
}

var projId;
var singleProj;

function openProject() {
	$.ajax('/cms/projects/open-project/' + projId, {
        type: 'GET',
        data: { id: projId },
        dataType: 'json',
        contentType: 'application/json'
	})
	.done(function(result){
		singleProj = result;

		$('#proj-name').children('span').append(singleProj.name);

		if (singleProj.image) {
			$('#proj-img').attr('src', singleProj.image);
		}

		$('#proj-livelink').attr('href', singleProj.livelink);
		$('#proj-codeurl').attr('href', singleProj.codeUrl);
		$('#proj-desc').children('div').html(singleProj.description);

		let spanHtml = '';
		for (let i = 0; i < singleProj.skills.length; i++) {
			spanHtml += "<span class='skill'>" + singleProj.skills[i] + "</span>";
		};
		$('#proj-skill-box').append(spanHtml);  

	});
}

var filter = $('#skills-selector');
var skillFilter;
var allProjects;

function getSkill(){ 
     return filter.val();
};

function filterProjects(skill) {
	return skill = skillFilter
}; 

$(document).ready(function() {
	getProjects();

    $('#results').on('click', '.project-item', function() {
    	projId = $(this).attr('id');
    	openProject();
    	
		window.scrollTo(0, 30);
		$('.grey-out').removeClass('hidden')
		$('#single-project').removeClass('hidden');

		// exit out of single project view
		$('button#project-close, .grey-out').click(function() {
			$('#proj-name').children('span').empty();
			$('#proj-img').attr('src', '/public/default/page.png');
			$('#proj-livelink').attr('href', '');
			$('#proj-codeurl').attr('href', '');
			$('#proj-desc').children('div').empty();
			$('#proj-skill-box').empty();
			spanHtml = '';

			$('#single-project').addClass('hidden');
			$('.grey-out').addClass('hidden');
		});

	});

    $('#skills-selector').on('change', function() {
		skillFilter = getSkill();
		var newList = allProjects.filter(function(n) {
			return n.skills.indexOf(skillFilter) > -1 ;
		});
		if (skillFilter == '') {
			newList = allProjects;
		};
		$('#results').empty();
		$.each(newList, function(i, project) {
			var filteredProj = listProjects(project);
			$('#results').append(filteredProj);
		});
	});

})