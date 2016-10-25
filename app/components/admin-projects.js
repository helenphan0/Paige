const Link = ReactRouter.Link;
const BrowserRouter = ReactRouter.BrowserRouter

let projects;
let skills;

let edits = {};
let newProject = {};

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
            projects = responseJson.projects;
            skills = responseJson.skills;
            console.log('fetched projects');

            // reset temp variables
            edits = {};

            this.setState({ new: false, edit: false, projects: projects });
            return projects
        })
        .catch((error) => {
            console.error(error);
        });

    },
    newProjectInp: function() {
    	this.setState({new: true});

    },
    editProjectInp: function(data) {
    	edits = data;
    	console.log(edits);
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
    	if (this.state.projects != projects) {
    		console.log('componentDidUpdate executed');
    		this.setState({ new: false, edit: false, projects: projects })
    	}
    },
	render: function() {
		let projectsState = ( this.state.projects == [] ? projects : this.state.projects);
		return (
			<div className='projects-view'>
				<h3>This is the projects admin</h3>
				<div>
					<button onClick={this.newProjectInp} type='button'>Add New Project</button>
					<CreateProject cancel={this.cancel} newProjectInput={this.state.new} editProjectInput={this.state.edit} />
				</div>
				<AdminProjectsList editProjectInp={this.editProjectInp} projects={projectsState}/>
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
		objEdit.idEdit = event.target.getAttribute('data-id');
		objEdit.nameEdit = event.target.getAttribute('data-name');
		objEdit.friendlyUrlEdit = event.target.getAttribute('data-url');
		objEdit.imageEdit = event.target.getAttribute('data-image');
		objEdit.livelinkEdit = event.target.getAttribute('data-livelink');
		objEdit.codeUrlEdit = event.target.getAttribute('data-codeUrl');
		objEdit.descriptionEdit = event.target.getAttribute('data-description');
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
			projects = responseJson.projects;
			this.context.router.transitionTo('/cms/projects');
			return projects; 
		})
		.catch((error) => {
			console.error(error);
		});

	},
	addSkill: function(event) {
		let skillObj = {
			skill: this.refs.newprojectNewSkill.value,
			id: event.target.getAttribute('data-project')
		}

		fetch( '/cms/projects/add-skill', {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(skillObj)
		})
		.then((response) => response.json())
		.then((responseJson) => {
			projects = responseJson.projects;
			skills = responseJson.skills;
			this.context.router.transitionTo('/cms/projects');
			return projects; 
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
									<div key={skill._id + '-project'} className='skillbox'>
										<div className='skill-text'>{skill.skill}</div>
										<div className='skill-delete'>x</div>
									</div>
								)}
							<div className='form-section'>
							<label htmlFor='skills'></label>
								<input form='newproject-form' 
									type='text' 
									ref='newprojectNewSkill' 
									id='skills' 
									placeholder='Add skill'  
									list='skillList' 
									/>
								<button data-project={project._id} onClick={this.addSkill}>Add</button>
							</div>
							<datalist id='skillList'>
								{skills.map((skill, i) =>
									<option key={skill._id}>{skill.skill}</option>
								)}
							</datalist>
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
	
	createProject: function(event) {

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
			projects = responseJson.projects;
			this.refs.projectForm.reset();

			// reset temp variable
			newProject = {};

			this.context.router.transitionTo('/cms/projects');
			return projects;
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
			newProject._id = this.refs.projectID.value
		}

		return newProject
	},
	clearForm: function(){
		this.refs.projectForm.reset();
		this.props.cancel();

	},
	render: function() {
		return (
			<div>
				<div onClick={this.clearForm} className={this.props.newProjectInput == true || this.props.editProjectInput == true ? 'grey-out' : 'hidden'}>
				</div>
				<div className={this.props.newProjectInput == true || this.props.editProjectInput == true ? 'createproject-view box' : 'hidden'} >
					<h3>{this.props.editProjectInput == true ? 'Edit Project' : 'Create a New Project' }</h3>
					<form ref='projectForm' id='newproject-form'>
						<div className='form-section'>
							<input ref='projectID' value={this.props.editProjectInput == true ? edits._id : 0 } className='hidden' />
							<label htmlFor='name'>Name: </label>
								<input form='newproject-form'  
									type='text' 
									id='name' 
									ref='newprojectName' 
									defaultValue={this.props.editProjectInput == true ? edits.name : '' } 
									placeholder={this.props.editProjectInput == true ? edits.name : 'QuizApp' } 
									onChange={this.updateValues}  
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='url'>Friendly URL: </label>
								<input form='newproject-form'  
									type='text' 
									id='url' 
									ref='newprojectUrl' 
									defaultValue={this.props.editProjectInput == true ? edits.friendlyUrl : '' } 
									placeholder={this.props.editProjectInput == true ? edits.friendlyUrl : 'www.company.com/about' }  
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='image'>Image: </label>
								<input form='newproject-form' 
									type='text' 
									ref='newprojectImage' 
									id='image' 
									defaultValue={this.props.editProjectInput == true ? edits.image : '' } 
									placeholder={this.props.editProjectInput == true ? edits.image : 'image link' } 
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='livelink'>Live Link: </label>
								<input form='newproject-form' 
									type='text' 
									ref='newprojectlivelink' 
									id='livelink' 
									defaultValue={this.props.editProjectInput == true ? edits.livelink : '' } 
									placeholder={this.props.editProjectInput == true ? edits.livelink : 'live site' } 
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='codeUrl'>Code URL: </label>
								<input form='newproject-form' 
									type='text' 
									ref='newprojectcodeUrl' 
									id='codeUrl' 
									defaultValue={this.props.editProjectInput == true ? edits.codeUrl : '' } 
									placeholder={this.props.editProjectInput == true ? edits.codeUrl : 'url to code' } 
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='description'>Description: </label>
								<textarea form='newproject-form' 
									type='text' 
									ref='newprojectDescription' 
									id='description' 
									defaultValue={this.props.editProjectInput == true ? edits.description : '' } 
									placeholder={this.props.editProjectInput == true ? edits.description : 'description' } 
									onChange={this.updateValues} >
								</textarea>
						</div>
						<button className={this.props.newProjectInput == true ? '' : 'hidden'} 
							onClick={this.createProject} data-url='/cms/projects/new-project' 
							type='button'
							>Create Project
						</button>
						<button className={this.props.editProjectInput == true ? '' : 'hidden'} 
							onClick={this.createProject} data-url={'/cms/projects/edit-project/' + edits._id} 
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