const Link = ReactRouter.Link;
const BrowserRouter = ReactRouter.BrowserRouter

let users = {};

let userEdits = {
	local: {
		name: '',
		email: '',
		password: ''
	}
};
let newUser = {
	local: {
		name: '',
		email: '',
		password: ''
	}
};

const AdminUsersMain = React.createClass({
	getInitialState: function() {
		return {
			new: false,
			edit: false,
            users: []
		}
	},
	getUsers: function() {

    fetch('/cms/users/get-users')
        .then((response) => response.json())
        .then((responseJson) => {
            users = responseJson;

            // reset temp variable
            userEdits = {
            	local: {
					name: '',
					email: '',
					password: ''
				}
            };

            this.setState({ new: false, edit: false, users: users });
            return users
        })
        .catch((error) => {
            console.error(error);
        });

    },
    newUserInp: function() {
    	this.setState({new: true});

    },
    editUserInp: function(data) {
    	userEdits = data;
    	this.setState({edit: true});

    },
    cancel: function() {
    	this.getUsers();
    },
    componentWillMount: function() {
        this.getUsers();
    },
    componentDidUpdate: function(){
    	if (this.state.users != users) {
    		this.setState({ new: false, edit: false, users: users })
    	}
    },
	render: function() {
		let usersState = ( this.state.users == [] ? users : this.state.users);
		return (
			<div className='users-view'>
				<h3>Manage Users</h3>
				<div>
					<button onClick={this.newUserInp} >Add New User</button>
					<CreateUser cancel={this.cancel} newUserInput={this.state.new} editUserInput={this.state.edit} />
				</div>
				<AdminUsersList editUserInp={this.editUserInp} users={usersState}/>	
			</div>
		)
	}
})

const AdminUsersList = React.createClass({
	userEdit: function(event) {
		let idEdit = event.target.getAttribute('data-id');
		let nameEdit = event.target.getAttribute('data-name');
		let emailEdit = event.target.getAttribute('data-email');
		let passwordEdit = event.target.getAttribute('data-password');
		let objEdit = {
			_id: idEdit,
			local: {
				name: nameEdit,
				email: emailEdit,
				password: passwordEdit
			}
		};
		this.props.editUserInp(objEdit);

	},
	userDelete: function(event){
		let idDelete = event.target.getAttribute('data-id');
		let userDelete = '/cms/users/delete/' + idDelete;
		let objDelete = {
			id: idDelete
		};

		fetch(userDelete, {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(objDelete)
		})
		.then((response) => response.json())
		.then((responseJson) => {
			users = responseJson;
			this.context.router.transitionTo('/cms/users');
			return users; 
		})
		.catch((error) => {
			console.error(error);
		});

	},
	render: function() {
		const { user, i} = this.props;
		return (
			<div className='userslist-view'>
				<h4>Users</h4>
				<div className='users-list'>

					{this.props.users.map((user, i) =>
						<div key={user._id} className='user'>
							<h4>Name: {user.local.name}</h4>
							<p className='email'>Email: {user.local.email}</p>
							<div className='user-buttons'>
								<button onClick={this.userEdit} 
									data-name={user.local.name} 
									data-email={user.local.email} 
									data-password={user.local.password} 
									data-id={user._id} 
									type='button' 
									>Edit
								</button>
								<button onClick={this.userDelete} data-id={user._id} type='button'>Delete</button>
							</div>
						</div>
					)}
	
				</div>
			</div>
		)
	}
});

AdminUsersList.contextTypes = {
	router: React.PropTypes.object
}

const CreateUser = React.createClass({
	getInitialState: function() {
		return {
			userEdits: {
				local: {
					name: '',
					email: '',
					password: ''
				}
			}
		}
	},
	
	createUser: function(event) {

		newUser = this.state.userEdits;

		if (this.refs.userID.value != 0) {
			newUser._id = this.refs.userID.value
		}

		let actionUrl = event.target.getAttribute('data-url');
		this.refs.userForm.reset();

		fetch(actionUrl, {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newUser)
		})
		.then((response) => response.json())
		.then((responseJson) => {
			users = responseJson;
			this.refs.userForm.reset();

			// reset temp variable
			newUser = {
				local: {
					name: '',
					email: '',
					password: ''
				}
			};
			userEdits = {
				local: {
					name: '',
					email: '',
					password: ''
				}
			};

			this.context.router.transitionTo('/cms/users');
			return users;
		})
		.catch((error) => {
			console.error(error);
		});  

	},
	clearForm: function(){
		this.refs.userForm.reset();
		this.props.cancel();
		newUser = {
			local: {
				name: '',
				email: '',
				password: ''
			}
		};
		this.setState({
			userEdits: {
				local: {
					name: '',
					email: '',
					password: ''
				}
			} 
		});

	},
	changeName: function(event) {
		newUser.local.name = event.target.value;
		newUser.local.email = this.refs.newuserEmail.value;
		newUser.local.password = this.refs.newuserPassword.value;
		this.setState({userEdits: newUser});
	},
	changeEmail: function(event) {
		newUser.local.email = event.target.value;
		newUser.local.name = this.refs.newuserName.value;
		newUser.local.password = this.refs.newuserPassword.value;
		this.setState({userEdits: newUser});
	},
	changePassword: function(event) {
		newUser.local.password = event.target.value;
		newUser.local.email = this.refs.newuserEmail.value;
		newUser.local.name = this.refs.newuserName.value;
		this.setState({userEdits: newUser});
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({ userEdits: userEdits });

	},
	render: function() {
		return (
			<div>
				<div onClick={this.clearForm} className={this.props.newUserInput || this.props.editUserInput ? 'grey-out' : 'hidden'}>
				</div>
				<div className={this.props.newUserInput || this.props.editUserInput ? 'createuser-view box' : 'hidden'} >
					<h3>{this.props.editUserInput ? 'Edit User' : 'Create a New User' }</h3>
					<form ref='userForm' id='newuser-form'>
						<div className='form-section'>
							<input ref='userID' value={this.props.editUserInput ? userEdits._id : 0 } className='hidden' />
							<label htmlFor='name'>Name: </label>
								<input type='text' 
									id='name' 
									ref='newuserName' 
									value={this.state.userEdits.local.name || ''} 
									placeholder={this.props.editUserInput ? userEdits.local.name : 'Name' }
									onChange={this.changeName} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='email'>Email: </label>
								<input type='email' 
									id='email' 
									ref='newuserEmail' 
									value={this.state.userEdits.local.email || ''} 
									placeholder={this.props.editUserInput ? userEdits.local.email : 'Email' }  
									onChange={this.changeEmail} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='password'>Password: </label>
								<input form='newuser-form' 
									type='password' 
									ref='newuserPassword' 
									id='password' 
									value={this.state.userEdits.local.password || ''} 
									placeholder={this.props.editUserInput ? 'New Password' : 'Password' } 
									onChange={this.changePassword}
									/>
						</div>
						<button className={this.props.newUserInput ? '' : 'hidden'} 
							onClick={this.createUser} data-url='/cms/users/new-user' 
							type='button'
							>Create User
						</button>
						<button className={this.props.editUserInput ? '' : 'hidden'} 
							onClick={this.createUser} data-url={'/cms/users/edit-user/' + userEdits._id} 
							type='button'
							>Edit User
						</button>
						<button className={this.props.newUserInput || this.props.editUserInput ? '' : 'hidden' } 
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

CreateUser.contextTypes = {
	router: React.PropTypes.object
}