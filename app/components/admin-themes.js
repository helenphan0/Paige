const Link = ReactRouter.Link;
const BrowserRouter = ReactRouter.BrowserRouter

let theme;
const AdminThemesMain = React.createClass({
	getInitialState: function() {
		return {
			active: ''
		}
	},
	getActiveTheme: function() {

	fetch('/cms/options/get-theme')
        .then((response) => response.json())
        .then((responseJson) => {
            theme = responseJson.value;
            this.setState({ active: theme });
        })
        .catch((error) => {
            console.error(error);
       	});

	},
	componentWillMount: function() {
        this.getActiveTheme();
    },
    componentDidUpdate: function(){
    	if (this.state.active != theme) {
    		console.log('active theme updated');
    		this.setState({ active: theme })
    	}
    },	
	selectTheme: function(event) {
		theme = event.target.getAttribute('data-theme');
		let themeObj = {
			key: 'theme',
			value: theme
		};
		fetch('/cms/options/update-option', {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify(themeObj)
		})
		.then((response) => response.json())
		.then((responseJson) => {
			theme = responseJson.value;
			this.setState({ active: theme });

		})
		.catch((error) => {
			console.error(error);
		});

	},
	render: function(){

		console.log('active theme is: ' + this.state.active);

		return (
			<div className='themes-view'>
				<h3>Manage Themes</h3>
				<h4>Select Theme</h4>
				<div className='themes-list'>
					<div data-theme='default' className={this.state.active == 'default' ? 'active theme' : 'theme'} onClick={this.selectTheme}>
						Default
					</div>
					<div data-theme='creative' className={this.state.active == 'creative' ? 'active theme' : 'theme'} onClick={this.selectTheme}>
						Creative
					</div>
					<div data-theme='food' className={this.state.active == 'food' ? 'active theme' : 'theme'} onClick={this.selectTheme}>
						Food
					</div>
				</div>
			</div>
		)
	}
});