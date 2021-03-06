
const Router = ReactRouter.Router;
const Link = ReactRouter.Link;
const Match = ReactRouter.Match;
const Miss = ReactRouter.Miss;
const BrowserRouter = ReactRouter.BrowserRouter

const Root = React.createClass({
    render: function() {
        return (
            <BrowserRouter>
                <div id='left-menu'>
                    <Match exacly pattern='/cms' component={AdminMenu} />
                </div>
                <div id='right-view'>
                    <Match exactly pattern='/cms' component={AdminHome} />
                    <Match exactly pattern='/cms/home' component={AdminHome} />
                    <Match pattern='/cms/pages' component={AdminPagesMain}/>
                    <Match pattern='/cms/projects' component={AdminProjectsMain} />
                    <Match pattern='/cms/skills' component={AdminSkillsMain} />
                    <Match pattern='/cms/options' component={AdminOptionsMain} />
                    <Match pattern='/cms/users' component={AdminUsersMain} />
                    <Match pattern='/cms/themes' component={AdminThemesMain} />
                    <Miss component={AdminHome} />
                </div>
            </BrowserRouter>
        )
    }
});

ReactDOM.render( <Root />, document.getElementById('container') )