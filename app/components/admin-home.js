const AdminHome = React.createClass({
    render: function(){
        return (
            <div className='admin-home-box'>
                <h3>Create and Manage Your Site</h3>
                <div className='admin-home-text'>
                    <p>Start building your site!</p>
                    <h4>Quick Start</h4>
                    <p>Paige comes with four starter pages: Home, About, Portfolio, and Contact. You can edit the page title and contents 
                    (for edits to the Friendly Url, see Advanced Options). </p>
                    <p>Create additional pages under the Page menu. The Friendly Url should be one or two words, 
                    and will be used to access your page's site on this domain.</p>
                    <p>Under the Skills menu, add skills utilized in your projects, for example HTML, CSS, and jQuery. 
                    These skills will be available for you to add to your projects.</p>
                    <p>For a project's Image, Live Link, and codeUrl, make sure to enter a valid url format (ie, 'www.github.com').</p>
                    <p>There are three themes included with Paige. Theme creation and management will be a future implementation. </p>
                    <h4>Advanced Options</h4>
                    <p>In order to make a new page live, it will need a template file whose file name matches the page's Friendly Url. Use the starter template 
                    files, located the themes folder, as guidelines for your new pages.</p>
                    <p>New template files should be saved in the same directories as the starter template files, under the theme that you wish to use.</p>
                    <p>After creating new pages with their respective template files, you can update the navigation bar of the site 
                    by editing the nav-bar template file.</p>
                    <p>There are more template files under each theme's folder. In addition to the nav-bar file, you can also edit the contact file with your contact information. 
                    Add your own style sheets and scripts by linking them in the 
                    styles and scripts files. (Be sure not to use these file names in any of your pages' Friendly Urls.)</p>
                    <p>Don't forget to update the Contact template and add your contact information.</p>
                </div>
            </div>
        )
    }
});
