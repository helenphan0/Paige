const Link = ReactRouter.Link;
const BrowserRouter = ReactRouter.BrowserRouter

let pages;
let defaultId;
let newId;
let edits = {};
let newPage = {};

const AdminPagesMain = React.createClass({
	getInitialState: function() {
        return {
        	new: false,
			edit: false,
            pages: []
        }
    },
    getPages: function() {

    fetch('/cms/pages/get-pages')
        .then((response) => response.json())
        .then((responseJson) => {
            pages = responseJson.pages;
            defaultId = responseJson.option.value;

            // reset temp variable
            edits = {};

            this.setState({ new: false, edit: false, pages: pages });
            return pages
        })
        .catch((error) => {
            console.error(error);
        });

    },
    newPageInp: function() {
    	this.setState({new: true});

    },
    editPageInp: function(data) {
    	edits = data;
    	this.setState({edit: true});

    },
    cancel: function() {
    	this.getPages();
    },
    componentWillMount: function() {
        this.getPages();
    },
    componentDidUpdate: function(){
    	if (this.state.pages != pages) {
    		this.setState({ new: false, edit: false, pages: pages })
    	}
    },
	render: function() {
		let pagesState = ( this.state.pages == [] ? pages : this.state.pages);
		return (
			<div className='pages-view'>
				<h3>Manage Your Pages</h3>
				<div>
					<button onClick={this.newPageInp} >Add New Page</button>
					<CreatePage cancel={this.cancel} newPageInput={this.state.new} editPageInput={this.state.edit} />
				</div>
				<AdminPagesList editPageInp={this.editPageInp} pages={pagesState}/>
			</div>
		)
	}
});

const AdminPagesList = React.createClass({
	pageView: function(event) {
		let idView = event.target.getAttribute('data-id');
		let urlView = '/cms/pages/view/' + idView;

	},
	pageEdit: function(event) {
		let idEdit = event.target.getAttribute('data-id');
		let titleEdit = event.target.getAttribute('data-title');
		let friendlyUrlEdit = event.target.getAttribute('data-url');
		let contentEdit = event.target.getAttribute('data-content');
		let defaultEdit;
		
		if (idEdit == defaultId) {
			defaultEdit = true;
		}
		else {
			defaultEdit = false;
		}

		let objEdit = {
			_id: idEdit,
			title: titleEdit,
			friendlyUrl: friendlyUrlEdit,
			default: defaultEdit,
			content: contentEdit
		};
		this.props.editPageInp(objEdit);

	},
	pageDelete: function(event){
		let idDelete = event.target.getAttribute('data-id');
		let urlDelete = '/cms/pages/delete/' + idDelete;
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
			pages = responseJson.pages;
			defaultId = responseJson.option.value;
			this.context.router.transitionTo('/cms/pages');
			return pages; 
		})
		.catch((error) => {
			console.error(error);
		});

	},
	render: function() {
		const { page, i} = this.props;
		return (
			<div className='pageslist-view'>
				<h4>Your Pages</h4>
				<div className='pages-list'>

					{this.props.pages.map((page, i) =>
						<div key={page._id} className='page'>
							<h4 className='h4-title'>{page.title}</h4>
							<div className='inner-details'>
								<p><span className='text-label'>Friendly URL:</span> {page.friendlyUrl}</p>
								<div className='page-buttons'>
									<button onClick={this.pageEdit} 
										data-title={page.title} 
										data-url={page.friendlyUrl} 
										data-content={page.content} 
										data-id={page._id} 
										type='button' 
										>Edit
									</button>
									<button onClick={this.pageDelete} data-id={page._id} type='button'>Delete</button>
									<span className='default-text'>{page._id == defaultId ? 'Default Page' : ''}</span>
								</div>
							</div>
						</div>
					)}
	
				</div>
			</div>
		)
	}
});

// for future implementation, AdminPagesList component, button to view
// <button onClick={this.pageView} data-id={page._id} type='button'>View</button>

AdminPagesList.contextTypes = {
	router: React.PropTypes.object
}

const CreatePage = React.createClass({
	
	getInitialState: function() {
		return {
			edits: {},
			default: false, 
			newId: null
		}
	},
	
	createPage: function(event) {

		if (this.refs.pageID.value != 0) {
			newPage._id = this.refs.pageID.value
		}

		let text = CKEDITOR.instances.content.getData();
        newPage.content = text;

		let actionUrl = event.target.getAttribute('data-url');
		this.refs.pageForm.reset();


		if (newPage.friendlyUrl) {
			// remove whitespace, change space to underscore
			newPage.friendlyUrl = newPage.friendlyUrl.trim().replace(/ /g, "_");
		}

		console.log('this is the edited page: ', newPage);

		fetch(actionUrl, {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newPage)
		})
		.then((response) => response.json())
		.then((responseJson) => {
			pages = responseJson.pages;
			this.refs.pageForm.reset();

			if (newId) {
				let idObj = {};
				idObj = {
					key: 'default',
					value: newId
				};
				fetch('/cms/options/update-option', {
					method: 'POST',
					headers: {
						'Accept' : 'application/json',
						'Content-Type': 'application/json'
					},
				body: JSON.stringify(idObj)
				})
				.then((response) => response.json())
				.then((responseJson) => {
					defaultId = responseJson.value;
					this.context.router.transitionTo('/cms/pages');
				})
				.catch((error) => {
					console.error(error);
				});
			};

			// reset temp variable
			newPage = {};
			newId = '';
			edits = {};

			this.context.router.transitionTo('/cms/pages');
			return pages;
		})
		.catch((error) => {
			console.error(error);
		});  

	},
	clearForm: function(){
		this.refs.pageForm.reset();
		this.props.cancel();
		newPage = {};
		newId = null;
		this.setState({edits: {}, default: false });

	},
	changeTitle: function(event) {
		newPage.title = event.target.value;
		newPage.friendlyUrl = this.refs.newpageUrl.value;
		newPage.content = this.refs.newpageContent.value;
		newPage.default = this.refs.default.checked;
		this.setState({edits: newPage});
	},
	changeUrl: function(event) {
		newPage.friendlyUrl = event.target.value;
		newPage.title = this.refs.newpageTitle.value;
		newPage.content = this.refs.newpageContent.value;
		newPage.default = this.refs.default.checked;
		this.setState({edits: newPage});
	},
	changeContent: function(event) {
		newPage.content = event.target.value;
		newPage.friendlyUrl = this.refs.newpageUrl.value;
		newPage.title = this.refs.newpageTitle.value;
		newPage.default = this.refs.default.checked;
		this.setState({edits: newPage});
	},
	changeDefault: function(event){
		var checked;
		newPage.content = this.refs.newpageContent.value;
		newPage.friendlyUrl = this.refs.newpageUrl.value;
		newPage.title = this.refs.newpageTitle.value;
		if (event.target.checked) {
			newId = edits._id;
			checked = true;
		}
		else {
			newId = null;
			checked = false;
		}

		this.setState({edits: newPage, default: checked, newId: newId}); 
	}, 
	componentWillReceiveProps: function(nextProps) {

		// need a conditional so this happens only once
		if (!CKEDITOR.instances.content) {
			window.setTimeout(function() {
   				CKEDITOR.replace('content', { height: 80 });
   				CKEDITOR.instances.content.focus(); 
			}, 100);
		};
		
		this.setState({ edits: edits, default: edits.default });
	},
	componentWillUnmount: function() {
		CKEDITOR.instances.content.destroy();
	},
	render: function() {

		if (CKEDITOR.instances.content) {
			CKEDITOR.instances.content.setData(edits.content);
		}

		return (
			<div>
				<div onClick={this.clearForm} className={this.props.newPageInput || this.props.editPageInput ? 'grey-out' : 'hidden'}>
				</div>
				<div className={this.props.newPageInput || this.props.editPageInput ? 'createpage-view box' : 'hidden'} >
					<h3>{this.props.editPageInput ? 'Edit Page' : 'Create a New Page' }</h3>
					<form ref='pageForm' id='newpage-form'>
						<div className='form-section'>
							<input ref='pageID' value={this.props.editPageInput ? edits._id : 0 } className='hidden' />
							<label htmlFor='title'>Title: </label>
								<input type='text' 
									id='title' 
									ref='newpageTitle' 
									value={this.state.edits.title || ''} 
									placeholder={this.props.editPageInput ? edits.title : 'About Our Company' }
									onChange={this.changeTitle} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='url'>Friendly URL: </label>
								<input type='text' 
									id='url' 
									ref='newpageUrl' 
									value={this.state.edits.friendlyUrl || ''} 
									placeholder={this.props.editPageInput ? edits.friendlyUrl : 'about_page' }  
									onChange={this.changeUrl} 
									/>
						</div>
						<div className={this.props.editPageInput ? 'form-section' : 'hidden'}>
							<label className='default-label' htmlFor='default'>Default Page: </label>
								<input type='checkbox' 
									id='default' 
									ref='default' 
									data-id={edits._id} 
									value={this.state.default || false} 
									checked={this.state.default || false} 
									onChange={this.changeDefault} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='content'>Content: </label>
								<textarea form='newpage-form' 
									ref='newpageContent' 
									id='content' 
									rows='2' 
									value={this.state.edits.content || ''} 
									placeholder={this.props.editPageInput ? edits.content : 'Content about the company.' } 
									onChange={this.changeContent}>
								</textarea>
						</div>
						<button className={this.props.newPageInput ? '' : 'hidden'} 
							onClick={this.createPage} data-url='/cms/pages/new-page' 
							type='button'
							>Create Page
						</button>
						<button className={this.props.editPageInput ? '' : 'hidden'} 
							onClick={this.createPage} data-url={'/cms/pages/edit-page/' + edits._id} 
							type='button'
							>Edit Page
						</button>
						<button className={this.props.newPageInput || this.props.editPageInput ? '' : 'hidden' } 
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

CreatePage.contextTypes = {
	router: React.PropTypes.object
}
