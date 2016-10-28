const Link = ReactRouter.Link;
const BrowserRouter = ReactRouter.BrowserRouter

let listProjects = {};
let pageEdits = {};
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
            console.log(listProjects);
            console.log('fetched projects');

            // reset temp variables
            pageEdits = {};
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
    	pageEdits = data;
    	console.log(pageEdits);
    	this.setState({edit: true});
    },
    cancel: function() {
    	this.getProjects();
    },
    componentWillMount: function() {
    	console.log('componentWillMount called');
        this.getProjects();
    },
    componentDidUpdate: function(){
    	if (this.state.projects != listProjects.projects) {
    		console.log('componentDidUpdate executed');
    		this.setState({ new: false, edit: false, projects: listProjects.projects })
    	}
    },
	render: function() {
		let projectsState = ( this.state.projects == [] ? listProjects.projects : this.state.projects);
		return (
			<div className='projects-view'>
				<h3>This is the projects admin</h3>
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
				<h4>List of projects</h4>
				<div className='projects-list'>

					{this.props.projects.map((project, i) =>
						<div key={project._id} className='project'>
							<h5>Name: {project.name}</h5>
							<p className='url'>Friendly URL: {project.friendlyUrl}</p>
							<p className='image'>Image: {project.image}</p>
							<p className='livelink'>Live Link: {project.livelink}</p>
							<p className='codeUrl'>codeUrl: {project.codeUrl}</p>
							<p className='description'>Description: {project.description}</p>
							<p>Skills</p>
								{ project.skills.map((skill,i) =>
									<div key={i + '-skill'} className='skillbox'>
										<span className='skill-text'>{skill}</span>
									</div>
								)}
							<div className='project-buttons'>
								<button onClick={this.projectView} data-id={project._id} type='button'>View</button>
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
					)}

				</div>
			</div>
		)
	}
});

AdminProjectsList.contextTypes = {
	router: React.PropTypes.object
}

const CreateProject = React.createClass({
	getInitialState: function(){
		return {
			tempSkills: []
		}
	},
	createProject: function(event) {

		if (this.refs.projectID.value != 0) {
			newProject._id = this.refs.projectID.value;
		}

		let actionUrl = event.target.getAttribute('data-url');
		console.log(actionUrl);
		this.refs.projectForm.reset();

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

			this.context.router.transitionTo('/cms/projects');
			return listProjects;
		})
		.catch((error) => {
			console.error(error);
		});  

	},
	updateValues: function() {

		newProject.name = (this.refs.newprojectName.value || this.refs.newprojectName.defaultValue);
		newProject.friendlyUrl = (this.refs.newprojectUrl.value || this.refs.newprojectUrl.defaultValue);
		newProject.image = (this.refs.newprojectImage.value || this.refs.newprojectImage.defaultValue);
		newProject.livelink = ( this.refs.newprojectlivelink.value || this.refs.newprojectlivelink.defaultValue );
		newProject.codeUrl = (this.refs.newprojectcodeUrl.value || this.refs.newprojectcodeUrl.defaultValue);
		newProject.description = (this.refs.newprojectDescription.value || this.refs.newprojectDescription.defaultValue);

		if (this.refs.projectID.value != 0) {
			newProject._id = this.refs.projectID.value;
		}
		newProject.skills = this.state.tempSkills;
		return newProject
	},
	clearForm: function(){
		newProject.skills = [];
		this.refs.projectForm.reset();
		this.props.cancel();

	},
	addSkill: function(skillArg) {

		if (this.refs.projectID.value != 0) {
			newProject._id = this.refs.projectID.value;
		}
		newProject.skills = pageEdits.skills || this.state.tempSkills;
		newProject.skills.push(skillArg);
		console.log(newProject.skills);
		this.setState({ tempSkills: newProject.skills});

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

		var position = event.target.getAttribute('data-id');
		console.log(position);
		
		newProject.skills = pageEdits.skills || this.state.tempSkills;

		newProject.skills.splice(position, 1);
		this.setState( {tempSkills: newProject.skills});
	},
	componentDidUpdate: function(){
    	if (this.state.tempSkills !== newProject.skills) {
    		console.log('skills componentDidUpdate');
    		this.setState({ tempSkills: newProject.skills })
    	}

    },
	render: function() {
		let skillsMap = listProjects.skills || [];
		let skillsAppend = pageEdits.skills || this.state.tempSkills;
		if (skillsAppend == "") {
			skillsAppend = [];
		}

		return (
			<div>
				<div onClick={this.clearForm} className={this.props.newProjectInput == true || this.props.editProjectInput == true ? 'grey-out' : 'hidden'}>
				</div>
				<div className={this.props.newProjectInput == true || this.props.editProjectInput == true ? 'createproject-view box' : 'hidden'} >
					<h3>{this.props.editProjectInput == true ? 'Edit Project' : 'Create a New Project' }</h3>
					<form ref='projectForm' id='newproject-form'>
						<div className='form-section'>
							<input ref='projectID' value={this.props.editProjectInput == true ? pageEdits._id : 0 } className='hidden' />
							<label htmlFor='name'>Name: </label>
								<input form='newproject-form'  
									type='text' 
									id='name' 
									ref='newprojectName' 
									defaultValue={this.props.editProjectInput == true ? pageEdits.name : '' } 
									placeholder={this.props.editProjectInput == true ? pageEdits.name : 'QuizApp' } 
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='url'>Friendly URL: </label>
								<input form='newproject-form'  
									type='text' 
									id='url' 
									ref='newprojectUrl' 
									defaultValue={this.props.editProjectInput == true ? pageEdits.friendlyUrl : '' } 
									placeholder={this.props.editProjectInput == true ? pageEdits.friendlyUrl : 'www.company.com/about' }  
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='image'>Image: </label>
								<input form='newproject-form' 
									type='text' 
									ref='newprojectImage' 
									id='image' 
									defaultValue={this.props.editProjectInput == true ? pageEdits.image : '' } 
									placeholder={this.props.editProjectInput == true ? pageEdits.image : 'image link' } 
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='livelink'>Live Link: </label>
								<input form='newproject-form' 
									type='text' 
									ref='newprojectlivelink' 
									id='livelink' 
									defaultValue={this.props.editProjectInput == true ? pageEdits.livelink : '' } 
									placeholder={this.props.editProjectInput == true ? pageEdits.livelink : 'live site' } 
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='codeUrl'>Code URL: </label>
								<input form='newproject-form' 
									type='text' 
									ref='newprojectcodeUrl' 
									id='codeUrl' 
									defaultValue={this.props.editProjectInput == true ? pageEdits.codeUrl : '' } 
									placeholder={this.props.editProjectInput == true ? pageEdits.codeUrl : 'url to code' } 
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='description'>Description: </label>
								<textarea form='newproject-form' 
									type='text' 
									ref='newprojectDescription' 
									id='description' 
									defaultValue={this.props.editProjectInput == true ? pageEdits.description : '' } 
									placeholder={this.props.editProjectInput == true ? pageEdits.description : 'description' } 
									onChange={this.updateValues} >
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
						<div className='form-section' >
							<select 
								className='skills-selector' 
								ref='newSkill' 
								onChange={this.skillInput} >
									<option value=''>Skills..</option>
									{ skillsMap.map((skill, i) =>
									<option key={skill._id} value={skill.skill} >{skill.skill}</option>
									)}
							</select>
							
						</div>
						<button className={this.props.newProjectInput == true ? '' : 'hidden'} 
							onClick={this.createProject} data-url='/cms/projects/new-project' 
							type='button'
							>Create Project
						</button>
						<button className={this.props.editProjectInput == true ? '' : 'hidden'} 
							onClick={this.createProject} data-url={'/cms/projects/edit-project/' + pageEdits._id} 
							type='button'
							>Edit Project
						</button>
						<button className={this.props.newProjectInput == true || this.props.editProjectInput == true ? '' : 'hidden' } 
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

