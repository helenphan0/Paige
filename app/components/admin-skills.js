const Link = ReactRouter.Link;
const BrowserRouter = ReactRouter.BrowserRouter

let skills;

const AdminSkillsMain = React.createClass({
	getInitialState: function() {
		return {
			skills: []
		}
	},
	getSkills: function() {

	fetch('/cms/skills/get-skills')
        .then((response) => response.json())
        .then((responseJson) => {
            skills = responseJson;
            console.log('fetched skills');
            
            this.setState({ skills: skills });
            return skills
        })
        .catch((error) => {
            console.error(error);
       	});

	},
	componentWillMount: function() {
    	console.log('skill component mounted');
        this.getSkills();
    },
    componentDidUpdate: function(){
    	if (this.state.skills != skills) {
    		console.log('skills updated');
    		this.setState({ skills: skills })
    	}
    },
	render: function(){
		let skillState = ( this.state.skills == [] ? skills : this.state.skills);
		console.log(skillState);
		return (
			<div className='skills-view'>
				<h3>Manage Your Skills</h3>
				<AddSkills />
				<AdminSkillsList skills={skillState} />
			</div>
		)
	}
});

const AdminSkillsList = React.createClass({
	deleteSkill: function(event){
		let idDelete = event.target.getAttribute('data-id');
		let urlDelete = '/cms/skills/delete/' + idDelete;
		let skillDelete = {
			id: idDelete
		};

		fetch(urlDelete, {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(skillDelete)
		})
		.then((response) => response.json())
		.then((responseJson) => {
			skills = responseJson;
			this.context.router.transitionTo('/cms/skills');

			return skills; 
		})
		.catch((error) => {
			console.error(error);
		});

	},
	render: function() {
		const { skill, i} = this.props;
		return (
			<div className='skillsList'>
				<h4>Your Skills</h4>
					{this.props.skills.map((skill, i) =>
						<div key={skill._id} className='skillbox'>
							<span className='skill-text'>{skill.skill} </span>
							<span className='skill-delete' data-id={skill._id} onClick={this.deleteSkill}>| x</span>
						</div>
					)} 
			</div>
		)
	}
})

AdminSkillsList.contextTypes = {
	router: React.PropTypes.object
}

const AddSkills = React.createClass({
	addSkill: function(event) {

		event.preventDefault();
		let addSkill = this.refs.newskillInput.value;
		let skillobj = {
			skill: addSkill
		};

		fetch('/cms/skills/new-skill', {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify(skillobj)
		})
		.then((response) => response.json())
		.then((responseJson) => {
			skills = responseJson;
			this.refs.skillForm.reset();
			this.context.router.transitionTo('/cms/skills');

			return skills;
		})
		.catch((error) => {
			console.error(error);
		});  

	},

	render: function() {
		return (
			<div>
				<form ref='skillForm' onSubmit={this.addSkill} id='newskill-form'>
					<div className='skill-form-section'>
						<label htmlFor='skill'></label>
						<input type='text' ref='newskillInput' placeholder='HTML5' />
						<button onSubmit={this.addSkill} type='submit'>Add Skill</button> 
					</div>
				</form>
			</div>
		)
	}
})

AddSkills.contextTypes = {
	router: React.PropTypes.object
}
