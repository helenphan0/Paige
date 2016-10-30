const Link = ReactRouter.Link;
const BrowserRouter = ReactRouter.BrowserRouter

let pages;

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
            pages = responseJson;
            console.log('fetched pages');

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
    	console.log(edits);
    	this.setState({edit: true});

    },
    cancel: function() {
    	this.getPages();
    },
    componentWillMount: function() {
    	console.log('pages componentWillMount');
        this.getPages();
    },
    componentDidUpdate: function(){
    	if (this.state.pages != pages) {
    		console.log('pages componentDidUpdate');
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
		console.log(urlView);
	},
	pageEdit: function(event) {
		let idEdit = event.target.getAttribute('data-id');
		let titleEdit = event.target.getAttribute('data-title');
		let friendlyUrlEdit = event.target.getAttribute('data-url');
		let contentEdit = event.target.getAttribute('data-content');
		let objEdit = {
			_id: idEdit,
			title: titleEdit,
			friendlyUrl: friendlyUrlEdit,
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
			pages = responseJson;
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
							<h4>Title: {page.title}</h4>
							<p className='url'>Friendly URL: {page.friendlyUrl}</p>
							<p className='content'>Content: {page.content}</p>
							<div className='page-buttons'>
								<button onClick={this.pageView} data-id={page._id} type='button'>View</button>
								<button onClick={this.pageEdit} 
									data-title={page.title} 
									data-url={page.friendlyUrl} 
									data-content={page.content} 
									data-id={page._id} 
									type='button' 
									>Edit
								</button>
								<button onClick={this.pageDelete} data-id={page._id} type='button'>Delete</button>
							</div>
						</div>
					)}
	
				</div>
			</div>
		)
	}
});

AdminPagesList.contextTypes = {
	router: React.PropTypes.object
}

const CreatePage = React.createClass({
	
	createPage: function(event) {

		let actionUrl = event.target.getAttribute('data-url');
		console.log(actionUrl);
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
			pages = responseJson;
			this.refs.pageForm.reset();

			// reset temp variable
			newPage = {};

			this.context.router.transitionTo('/cms/pages');
			return pages;
		})
		.catch((error) => {
			console.error(error);
		});  

	},
	updateValues: function() {

		newPage.title = (this.refs.newpageTitle.value || this.refs.newpageTitle.defaultValue);
		newPage.friendlyUrl = (this.refs.newpageUrl.value || this.refs.newpageUrl.defaultValue);
		newPage.content = ( this.refs.newpageContent.value || this.refs.newpageContent.defaultValue );

		if (this.refs.pageID.value != 0) {
			newPage._id = this.refs.pageID.value
		}

		return newPage
	},
	clearForm: function(){
		this.refs.pageForm.reset();
		this.props.cancel();

	},
	render: function() {
		return (
			<div>
				<div onClick={this.clearForm} className={this.props.newPageInput == true || this.props.editPageInput == true ? 'grey-out' : 'hidden'}>
				</div>
				<div className={this.props.newPageInput == true || this.props.editPageInput == true ? 'createpage-view box' : 'hidden'} >
					<h3>{this.props.editPageInput == true ? 'Edit Page' : 'Create a New Page' }</h3>
					<form ref='pageForm' id='newpage-form'>
						<div className='form-section'>
							<input ref='pageID' value={this.props.editPageInput == true ? edits._id : 0 } className='hidden' />
							<label htmlFor='title'>Title: </label>
								<input type='text' 
									id='title' 
									ref='newpageTitle' 
									defaultValue={this.props.editPageInput == true ? edits.title : '' } 
									placeholder={this.props.editPageInput == true ? edits.title : 'About Our Company' } 
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='url'>Friendly URL: </label>
								<input type='text' 
									id='url' 
									ref='newpageUrl' 
									defaultValue={this.props.editPageInput == true ? edits.friendlyUrl : '' } 
									placeholder={this.props.editPageInput == true ? edits.friendlyUrl : 'www.company.com/about' }  
									onChange={this.updateValues} 
									/>
						</div>
						<div className='form-section'>
							<label htmlFor='content'>Content: </label>
								<textarea form='newpage-form' 
									ref='newpageContent' 
									id='content' 
									defaultValue={this.props.editPageInput == true ? edits.content : '' } 
									placeholder={this.props.editPageInput == true ? edits.content : 'Content about the company.' } 
									onChange={this.updateValues}>
								</textarea>
						</div>
						<button className={this.props.newPageInput == true ? '' : 'hidden'} 
							onClick={this.createPage} data-url='/cms/pages/new-page' 
							type='button'
							>Create Page
						</button>
						<button className={this.props.editPageInput == true ? '' : 'hidden'} 
							onClick={this.createPage} data-url={'/cms/pages/edit-page/' + edits._id} 
							type='button'
							>Edit Page
						</button>
						<button className={this.props.newPageInput == true || this.props.editPageInput == true ? '' : 'hidden' } 
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
