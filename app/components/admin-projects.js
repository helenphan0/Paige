const Link = ReactRouter.Link;
const BrowserRouter = ReactRouter.BrowserRouter;


let listProjects = {};
let projectEdits = {
	name: '',
	friendlyUrl: '',
	image: '',
	livelink: '',
	codeUrl: '',
	description: '',
	skills: []
};
let newProject = {skills: []};
let skillArg;

const AdminProjectsMain = React.createClass({
	getInitialState: function() {
        return {
        	new: false,
			edit: false,
            projects: []
        }
    },
    getProjects: function() {

    fetch('/cms/projects/get-projects')
        .then((response) => response.json())
        .then((responseJson) => {
            listProjects.projects = responseJson.projects;
            listProjects.skills = responseJson.skills;

            // reset temp variables
            projectEdits = {
            	name: '',
				friendlyUrl: '',
				image: '',
				livelink: '',
				codeUrl: '',
				description: '',
				skills: []
            };
            skillArg = '';

            this.setState({ new: false, edit: false, projects: listProjects.projects });
            return listProjects
        })
        .catch((error) => {
            console.error(error);
        });
    },
    newProjectInp: function() {
    	this.setState({new: true});
    },
    editProjectInp: function(data) {
    	projectEdits = data;
    	console.log(projectEdits);
    	this.setState({edit: true});
    },
    cancel: function() {
    	this.getProjects();
    },
    componentWillMount: function() {
        this.getProjects();
    },
    componentDidMount: function() {
        this.getProjects();
    },
    componentDidUpdate: function(){
    	if (this.state.projects != listProjects.projects) {
    		this.setState({ new: false, edit: false, projects: listProjects.projects })
    	}
    },
	render: function() {
		let projectsState = ( this.state.projects == [] ? listProjects.projects : this.state.projects);
		return (
			<div className='projects-view'>
				<h3>Manage Your Projects</h3>
				<div>
					<button onClick={this.newProjectInp} type='button'>Add New Project</button>
					<CreateProject cancel={this.cancel} newProjectInput={this.state.new} editProjectInput={this.state.edit} />
				</div>
				<AdminProjectsList editProjectInp={this.editProjectInp} 
					editSkillInput={this.state.edit} 
					projects={projectsState} 
					listItems={listProjects.skills || []}/>
			</div>
		)
	}
});

const AdminProjectsList = React.createClass({
	projectView: function(event) {
		let idView = event.target.getAttribute('data-id');
		let urlView = '/cms/projects/view/' + idView;
		console.log(urlView);
	},
	projectEdit: function(event) {
		let objEdit = {};
		objEdit._id = event.target.getAttribute('data-id');
		objEdit.name = event.target.getAttribute('data-name');
		objEdit.friendlyUrl = event.target.getAttribute('data-url');
		objEdit.image = event.target.getAttribute('data-image');
		objEdit.livelink = event.target.getAttribute('data-livelink');
		objEdit.codeUrl = event.target.getAttribute('data-codeUrl');
		objEdit.description = event.target.getAttribute('data-description');
		objEdit.skills = event.target.getAttribute('data-skills').split(',');
		objEdit.skills = (objEdit.skills == "" ? [] : objEdit.skills);
		this.props.editProjectInp(objEdit);
	},
	projectDelete: function(event){
		let idDelete = event.target.getAttribute('data-id');
		let urlDelete = '/cms/projects/delete/' + idDelete;
		let objDelete = {
			id: idDelete
		};

		fetch( urlDelete, {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(objDelete)
		})
		.then((response) => response.json())
		.then((responseJson) => {
			listProjects.projects = responseJson.projects;
			this.context.router.transitionTo('/cms/projects');
			return listProjects; 
		})
		.catch((error) => {
			console.error(error);
		});

	},
	render: function() {
		const { project, i} = this.props;
		return (
			<div className='projectslist-view'>
				<h4>Your Projects</h4>
				<div className='projects-list'>

					{this.props.projects.map((project, i) =>
						<div key={project._id} className='project'>
							<h4 className='h4-title'>{project.name}</h4>
							<div className='inner-details'>
								<p><span className='text-label'>Friendly URL:</span> {project.friendlyUrl}</p>
								<p><span className='text-label'>Image:</span> {project.image}</p>
								<p><span className='text-label'>Live Link:</span> {project.livelink}</p>
								<p><span className='text-label'>codeUrl:</span> {project.codeUrl}</p>
								
								<p><span className='text-label'>Skills</span></p>
									{ project.skills.map((skill,i) =>
										<div key={i + '-skill'} className='skillbox'>
											<span className='skill-text'>{skill}</span>
										</div>
									)}
								<div className='project-buttons'>
									<button onClick={this.projectEdit} 
										data-id={project._id} 
										data-name={project.name} 
										data-url={project.friendlyUrl} 
										data-image={project.image} 
										data-livelink={project.livelink} 
										data-codeUrl={project.codeUrl} 
										data-description={project.description} 
										data-skills={project.skills} 
										type='button'
										>Edit
									</button>
									<button onClick={this.projectDelete} data-id={project._id} type='button'>Delete</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		)
	}
});

// for future implementation, AdminProjectsList button, to view Project
// <button onClick={this.projectView} data-id={project._id} type='button'>View</button>

AdminProjectsList.contextTypes = {
	router: React.PropTypes.object
}

const CreateProject = React.createClass({
	getInitialState: function(){
		return {
			projectEdits: {},
			tempSkills: []
		}
	},
	createProject: function(event) {

		if (this.refs.projectID.value != 0) {
			newProject._id = this.refs.projectID.value;
		}
		newProject.skills = projectEdits.skills || this.state.tempSkills;

		let data = CKEDITOR.instances.description.getData();
        newProject.description = data;

		let actionUrl = event.target.getAttribute('data-url');
		this.refs.projectForm.reset();

		if (newProject.friendlyUrl) {
			// remove whitespace, change space to underscore
			newProject.friendlyUrl = newProject.friendlyUrl.trim().replace(/ /g, "_")
		}

		console.log('this is the edited page: ', newProject);

		fetch(actionUrl, {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newProject)
		})
		.then((response) => response.json())
		.then((responseJson) => {
			listProjects.projects = responseJson.projects;
			this.refs.projectForm.reset();

			// reset temp variable
			newProject = {skills: []};
			projectEdits = {};

			this.context.router.transitionTo('/cms/projects');
			return listProjects;
		})
		.catch((error) => {
			console.error(error);
		});  

	},
	changeName: function(event) {

		newProject.name = event.target.value;
		newProject.friendlyUrl = this.refs.newprojectUrl.value;
		newProject.image = this.refs.newprojectImage.value;
		newProject.livelink = this.refs.newprojectlivelink.value;
		newProject.codeUrl = this.refs.newprojectcodeUrl.value;
		newProject.description = this.refs.newprojectDescription.value;
		this.setState({ projectEdits: newProject });

	},
	changeUrl: function(event) {

		newProject.name = this.refs.newprojectName.value;
		newProject.friendlyUrl = event.target.value;
		newProject.image = this.refs.newprojectImage.value;
		newProject.livelink = this.refs.newprojectlivelink.value;
		newProject.codeUrl = this.refs.newprojectcodeUrl.value;
		newProject.description = this.refs.newprojectDescription.value;
		this.setState({ projectEdits: newProject });

	},
	changeImage: function(event) {

		newProject.name = this.refs.newprojectName.value;
		newProject.friendlyUrl = this.refs.newprojectUrl.value;
		newProject.image = event.target.value;
		newProject.livelink = this.refs.newprojectlivelink.value;
		newProject.codeUrl = this.refs.newprojectcodeUrl.value;
		newProject.description = this.refs.newprojectDescription.value;
		this.setState({ projectEdits: newProject });

	},
	changeLiveLink: function(event) {

		newProject.name = this.refs.newprojectName.value;
		newProject.friendlyUrl = this.refs.newprojectUrl.value;
		newProject.image = this.refs.newprojectImage.value;
		newProject.livelink = event.target.value;
		newProject.codeUrl = this.refs.newprojectcodeUrl.value;
		newProject.description = this.refs.newprojectDescription.value;
		this.setState({ projectEdits: newProject });

	},
	changeCodeUrl: function(event) {

		newProject.name = this.refs.newprojectName.value;
		newProject.friendlyUrl = this.refs.newprojectUrl.value;
		newProject.image = this.refs.newprojectImage.value;
		newProject.livelink = this.refs.newprojectlivelink.value;
		newProject.codeUrl = event.target.value;
		newProject.description = this.refs.newprojectDescription.value;
		this.setState({ projectEdits: newProject });

	},
	changeDesc: function(event) {

		newProject.name = this.refs.newprojectName.value;
		newProject.friendlyUrl = this.refs.newprojectUrl.value;
		newProject.image = this.refs.newprojectImage.value;
		newProject.livelink = this.refs.newprojectlivelink.value;
		newProject.codeUrl = this.refs.newprojectcodeUrl.value;
		newProject.description = event.target.value;
		this.setState({ projectEdits: newProject });

	},
	clearForm: function(){
		newProject = {};
		newProject.skills = [];
		this.refs.projectForm.reset();
		this.props.cancel();
		this.setState({ 
			projectEdits: {},
			tempSkills: newProject.skills
		});

	},
	addSkill: function(skillArg) {
		if (this.refs.projectID.value != 0) {
			newProject._id = this.refs.projectID.value;
		}
		newProject.skills = projectEdits.skills || this.state.tempSkills;
		newProject.skills.push(skillArg);
		console.log(newProject.skills);
		this.refs.newSkill.value = '';
		this.setState({ tempSkills: newProject.skills });

	},
	skillInput: function(){
		if (this.refs.newSkill.value == '') {
			return false
		}
		skillArg = this.refs.newSkill.value;
		this.addSkill(skillArg);

	},
	deleteSkill: function(event) {
		if (this.refs.projectID.value != 0) {
			newProject._id = this.refs.projectID.value;
		}
		let position = event.target.getAttribute('data-id');
		console.log(position);
		newProject.skills = projectEdits.skills || this.state.tempSkills;
		newProject.skills.splice(position, 1);
		this.setState( { tempSkills: newProject.skills });
	},
	componentWillReceiveProps: function(nextProps) {
		CKEDITOR.instances.description.setData(projectEdits.description);
		this.setState({ projectEdits: projectEdits });
	},
	componentWillUnmount: function() {
		CKEDITOR.instances.description.destroy();
	},
	render: function() {
		// this is the dropdown
		let skillsMap = listProjects.skills || [];

		// list the skills currently on the project
		let skillsAppend = projectEdits.skills || this.state.tempSkills;

		// blank array pulled from data attribute turns to string, 
		// make it an array again, else it errors
		if (skillsAppend == "") {
			skillsAppend = [];
		}

		// update the dropdown so it doesn't have what's already on project
		skillsMap = skillsMap.filter(x => skillsAppend.indexOf(x) < 0);

		// need a conditional so this happens only once
		if (!CKEDITOR.instances.description) {
			window.setTimeout(function() {
   				CKEDITOR.replace('description', { height: 80 });
   				CKEDITOR.instances.description.focus(); 
			}, 100);
		}  

		return (
			<div>
				<div onClick={this.clearForm} className={this.props.newProjectInput || this.props.editProjectInput ? 'grey-out' : 'hidden'}>
				</div>
				<div className={this.props.newProjectInput || this.props.editProjectInput ? 'createproject-view box' : 'hidden'} >
					<h3>{this.props.editProjectInput ? 'Edit Project' : 'Create a New Project' }</h3>
					<form ref='projectForm' id='newproject-form'>
						<div className='form-section'>
							<input ref='projectID' value={this.props.editProjectInput ? projectEdits._id : 0 } className='hidden' />
							<label htmlFor='name'>Name: </label>
								<input form='newproject-form'  
									type='text' 
									id='name' 
									ref='newprojectName' 
									value={this.state.projectEdits.name || ''} 
									placeholder={this.props.editProjectInput ? projectEdits.name : 'QuizApp' } 
									onChange={this.changeName} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='url'>Friendly URL: </label>
								<input form='newproject-form'  
									type='text' 
									id='url' 
									ref='newprojectUrl' 
									value={this.state.projectEdits.friendlyUrl || ''} 
									placeholder={this.props.editProjectInput ? projectEdits.friendlyUrl : 'about_page' }  
									onChange={this.changeUrl} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='image'>Image Link: </label>
								<input form='newproject-form' 
									type='text' 
									ref='newprojectImage' 
									id='image' 
									value={this.state.projectEdits.image || ''} 
									placeholder={this.props.editProjectInput ? projectEdits.image : 'http://www.imgur.com' } 
									onChange={this.changeImage} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='livelink'>Live Link: </label>
								<input form='newproject-form' 
									type='text' 
									ref='newprojectlivelink' 
									id='livelink' 
									value={this.state.projectEdits.livelink || ''} 
									placeholder={this.props.editProjectInput ? projectEdits.livelink : 'http://www.heroku.com' } 
									onChange={this.changeLiveLink} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='codeUrl'>Code URL: </label>
								<input form='newproject-form' 
									type='text' 
									ref='newprojectcodeUrl' 
									id='codeUrl' 
									value={this.state.projectEdits.codeUrl || ''} 
									placeholder={this.props.editProjectInput ? projectEdits.codeUrl : 'https://www.github.com' } 
									onChange={this.changeCodeUrl} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='description'>Description: </label>
								<textarea form='newproject-form' 
									type='text' 
									ref='newprojectDescription' 
									id='description' 
									name='description' 
									rows='2' 
									value={this.state.projectEdits.description || ''} 
									placeholder={this.props.editProjectInput ? projectEdits.description : 'Describe project. What does it accomplish? What audience does it appeal to?' } 
									onChange={this.changeDesc} >
								</textarea>
						</div>
						<div id='skill-area'>
							{ skillsAppend.map((skill, i) =>
								<div key={i} className='skillbox'>
									<span className='skill-text'>{skill} </span>
									<span className='skill-delete' data-id={i} onClick={this.deleteSkill}>| x</span>
								</div>
							)} 
						</div>
						<div className='form-section'>
							<select 
								className='skills-selector' 
								ref='newSkill' 
								defaultValue='' 
								onChange={this.skillInput} >
									<option value=''>Skills..</option>
									{ skillsMap.map((skill, i) =>
									<option key={i + '-selector'} data-id={i} value={skill} >{skill}</option>
									)}
							</select>
						</div>
						<button className={this.props.newProjectInput ? '' : 'hidden'} 
							onClick={this.createProject} data-url='/cms/projects/new-project' 
							type='button'
							>Create Project
						</button>
						<button className={this.props.editProjectInput ? '' : 'hidden'} 
							onClick={this.createProject} data-url={'/cms/projects/edit-project/' + projectEdits._id} 
							type='button'
							>Edit Project
						</button>
						<button className={this.props.newProjectInput || this.props.editProjectInput ? '' : 'hidden' } 
							onClick={this.clearForm} 
							type='button'
							>Cancel
						</button>
					</form>
				</div>
			</div>
		)
	}
});

CreateProject.contextTypes = {
	router: React.PropTypes.object
}
