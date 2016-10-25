const Link = ReactRouter.Link;
const RouteHandler = ReactRouter.RouteHandler;

const AdminMenu = React.createClass({
	render: function() {
		return (
			<ul>
				<li>
					<Link to='/cms/home'>Home</Link>
				</li>
				<li>
					<Link to='/cms/pages'>Pages</Link>
				</li>
				<li>
					<Link to='/cms/projects'>Projects</Link>
				</li>
				<li>
					<Link to='/cms/skills'>Skills</Link>
				</li>
				<li>
					<Link to='/cms/users'>Users</Link>
				</li>
				<li>
					<Link to='/cms/themes'>Themes</Link>
				</li>
			</ul>
		)
	}
});
