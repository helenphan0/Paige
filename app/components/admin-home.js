const AdminHome = React.createClass({
	render: function(){
		return (
			<div className='admin-home-box'>
				<h3>Create and Manage Your Site</h3>
				<div className='admin-home-text'>
					<p>Start building your site!</p>
					<h4>Quick Start</h4>
					<p>Paige comes with three starter pages: Home, About, and Portfolio. You can edit the page title and contents 
					(for edits to the Friendly Url, see Advanced Options). </p>
					<p>Create additional pages under the Page menu. The Friendly Url should be one or two words, 
					and will be used to access your page's site on this domain.</p>
					<p>Under the Skills menu, add skills utilized in your projects, for example HTML, CSS, and jQuery. 
					These skills will be available for you to add to your projects.</p>
					<p>For a project's Image, Live Link, and codeUrl, make sure to enter a valid url format (ie, 'www.github.com').</p>
					<p>There are three themes included with Paige. Theme creation and management will be a future implementation. </p>
					<h4>Advanced Options</h4>
					<p></p>
				</div>
			</div>
		)
	}
});
