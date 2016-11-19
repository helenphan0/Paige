const Link = ReactRouter.Link;
const RouteHandler = ReactRouter.RouteHandler;

const AdminMenu = React.createClass({
	render: function() {
		return (
			<ul>
				<Link className='admin-menu-link' to='/cms/home'>
					<li>Home</li>
				</Link>
				<Link className='admin-menu-link' to='/cms/pages'>
					<li>Pages</li>
				</Link>
				<Link className='admin-menu-link' to='/cms/projects'>
					<li>Projects</li>
				</Link>
				<Link className='admin-menu-link' to='/cms/skills'>
					<li>Skills</li>
				</Link>
				<Link className='admin-menu-link' to='/cms/users'>
					<li>Users</li>
				</Link>
				<Link className='admin-menu-link' to='/cms/themes'>
					<li>Themes</li>
				</Link>
			</ul>
		)
	}
});
