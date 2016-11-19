// future enhancements 
// allow additional options



const Link = ReactRouter.Link;
const BrowserRouter = ReactRouter.BrowserRouter

let newOption = {
	key: '',
	value: ''
};
let options = [];

const AdminOptionsMain = React.createClass({
	getInitialState: function() {
		return {
			options: []
		}
	},
	getOptions: function() {

	fetch('/cms/options/get-options')
        .then((response) => response.json())
        .then((responseJson) => {
            options = responseJson;
            
            this.setState({ options: options });
            return options
        })
        .catch((error) => {
            console.error(error);
       	});

	},
	componentWillMount: function() {
        this.getOptions();
    },
    componentDidUpdate: function(){
    	if (this.state.options != options) {
    		console.log('options updated');
    		this.setState({ options: options })
    	}
    },	


	render: function(){
		let optionState = ( this.state.options == [] ? options : this.state.options);
		return (
			<div className='options-view'>
				<h3>Manage Options</h3>
				<AddOptions />
				<AdminOptionsList options={optionState}/>
			</div>
		)
	}
});

const AdminOptionsList = React.createClass({
	render: function() {
		const { option, i} = this.props;
		return (
			<div className='optionsList'>
				<h4>Options</h4>
					{this.props.options.map((option, i) =>
						<div key={option._id} className='optionbox'>
							<p className='option-text'>key: {option.key} </p>
							<p className='option-text'>value: {option.value} </p>
						</div>
					)} 
			</div>
		)
	}
})

AdminOptionsList.contextTypes = {
	router: React.PropTypes.object
}

const AddOptions = React.createClass({
	getInitialState: function() {
		return {
			key: '',
			value: ''
		}
	},
	changeKey: function(event) {
		newOption.key = event.target.value;
		newOption.value = this.refs.newvalueInput.value;
		this.setState({key: event.target.value});
	},
	changeValue: function(event) {
		newOption.value = event.target.value;
		newOption.key = this.refs.newkeyInput.value;
		this.setState({value: event.target.value});
	},
	addOption: function(event) {

		event.preventDefault();

		fetch('/cms/options/new-option', {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify(newOption)
		})
		.then((response) => response.json())
		.then((responseJson) => {
			options = responseJson;
			this.refs.optionForm.reset();
			this.context.router.transitionTo('/cms/options');

			return options;
		})
		.catch((error) => {
			console.error(error);
		});  
	},

	render: function() {
		return (
			<div>
				<form ref='optionForm' onSubmit={this.addOption} id='newoption-form'>
					<div className='form-section'>
						<label htmlFor='key'>Key: </label>
						<input id='key' 
						type='text' 
						ref='newkeyInput' 
						value={this.state.key || ''} 
						placeholder='key' 
						onChange={this.changeKey} />
					</div>
					<div className='form-section'>
						<label htmlFor='value'>Value: </label>
						<input id='value' 
						type='text' 
						ref='newvalueInput' 
						value={this.state.value || ''} 
						placeholder='value' 
						onChange={this.changeValue} />
					</div>
					<button onSubmit={this.addOption} type='submit'>Add Option</button>
				</form>
			</div>
		)
	}
})

AddOptions.contextTypes = {
	router: React.PropTypes.object
}