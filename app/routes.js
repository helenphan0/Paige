const User = require('../app/models/user');
const Page = require('../app/models/page');
const Project = require('../app/models/project');
const Skill = require('../app/models/skill');
const Option = require('../app/models/option');


module.exports = function(app, passport) { 
    
// =================================
// Default page entry point ========
// =================================

    app.get('/', function(req, res) {

        Option.findOne({key: 'default'}, function(err, option){

            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }

            if (!option) {
                performInstallation(res);
            } else {
                let id = option.value;
                console.log('default page id: ' + id);
                Page.findById(id, function(err, page){
                    
                    if (!page) {
                        return res.redirect('/login');
                    }

                    if (err) {
                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }

                    let url = page.friendlyUrl;
                    return res.redirect('/' + url);
                });
            }
        });
    });   

    // =====================================
    // LOGIN ===============================
    // =====================================
    app.get('/login', function(req, res) {

        res.render('login.pug', { message: req.flash('loginMessage') }); 
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/cms', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // app.get('/signup', function(req, res) {

    //     res.render('signup.pug', { message: req.flash('signupMessage') });
    // });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/cms', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));

    // Populate portfolio page with projects

    app.get('/cms/projects/get-projects', function(req, res) {
        Project.find(function(err, projects) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            let fetchProjects = {
                projects: projects
            };
            Skill.find(function(err, skills) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }

                let skillsArr = [];

                // skills result is an array of skills objects
                // turn the result into an array with skill name values
                for ( let i = 0; i < skills.length; i++ ) {
                    skillsArr.push(skills[i].skill);
                }
                fetchProjects.skills = skillsArr.sort();

                res.status(200).json(fetchProjects).end();
            });
        });
    });  

    // Single project view

    app.get('/cms/projects/open-project/:id', function(req, res) {

        let id = req.params.id;
        Project.findById(id, function(err, project) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }

            res.status(200).json(project).end();
        })
    })
    // =====================================
    // ADMIN SECTION =======================
    // =====================================

    app.get('/cms', isLoggedIn, function(req, res) {
        console.log('logged in as: ' + req.user.local.name);

        res.render('admin-layout.pug', {
            user : req.user 
        });

    // Endpoints to fetch all documents in Page, Project, Skill, and User collections

        // Retrieve pages --------------

        app.get('/cms/pages/get-pages', function(req, res) {
            Page.find(function(err, pages) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }

                Option.findOne({key: 'default'}, function(err, option) {
                    if (err) {
                        return res.status(500);
                    }
                    let pageData = {};
                    pageData.pages = pages;
                    pageData.option = option;

                    res.status(200).json(pageData).end();
                });
            });
        });

        // Retrieve projects ------------

        app.get('/cms/projects/get-projects', function(req, res) {
            Project.find(function(err, projects) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                let fetchProjects = {
                    projects: projects
                };
                Skill.find(function(err, skills) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }

                    let skillsArr = [];

                    // skills result is an array of skills objects
                    // turn the result into an array with skill name values
                    for ( let i = 0; i < skills.length; i++ ) {
                        skillsArr.push(skills[i].skill);
                    }
                    fetchProjects.skills = skillsArr.sort();

                    res.status(200).json(fetchProjects).end();
                });
            });
        });

        // Retrieve skills ------------

        app.get('/cms/skills/get-skills', function(req, res) {
            Skill.find(function(err, skills) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                res.status(200).json(skills).end();
            });
        });

        // Retrieve users -------------

        app.get('/cms/users/get-users', function(req, res) {
            User.find(function(err, users) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }

                // use the local login for accounts created from back end
                for (let i = 0; i < users.length; i++) {

                    if (users[i].google && !users[i].local.name) {
                        users[i].local.name = users[i].google.name;
                        users[i].local.email = users[i].google.email;
                        users[i].local.password = users[i].google.token;
                    }
                    if (users[i].facebook && !users[i].local.name) {
                        users[i].local.name = users[i].facebook.name;
                        users[i].local.email = users[i].facebook.email;
                        users[i].local.password = users[i].facebook.token;
                    }
                    if (users[i].linkedin && !users[i].local.name) {
                        users[i].local.name = users[i].linkedin.name;
                        users[i].local.email = users[i].linkedin.email;
                        users[i].local.password = users[i].linkedin.token;
                    }

                    if (users[i].github && !users[i].local.name) {
                        users[i].local.name = users[i].github.name;
                        users[i].local.email = users[i].github.email;
                        users[i].local.password = users[i].github.token;
                    }
                }

                res.status(200).json(users).end();
            });
        });

        // Retrieve options -----------

        app.get('/cms/options/get-options', function(req, res) {
            Option.find(function(err, options) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }

                res.status(200).json(options).end();
            })
        })

    // PAGE endpoints -------------------
    // ----------------------------------

        app.post('/cms/pages/new-page', function(req, res) {
            
            Page.findOne({ friendlyUrl: req.body.friendlyUrl }, function(err, page) {

                if (err) {
                    return res.status(500);
                }

                if (req.body.title === '' || req.body.title == undefined) {
                    return false;
                }

                if (page) {
                    console.log('FriendlyUrl ' + page.friendlyUrl + ' already exists');
                    return res.status(200).redirect('/cms/pages/get-pages');
                }

                else {
                    let page = new Page();
                    page.title = req.body.title;
                    page.friendlyUrl = req.body.friendlyUrl.trim().replace(/ /g, "_");
                    page.content = req.body.content;
    
                    page.save(function(err) {
                        if (err) {
                            res.status(500);
                        }
                        console.log('saved new page: ' + page.title);
                        res.redirect('/cms/pages/get-pages');
                    });
                }
            })      
        }) 

    // Delete page ----------
    // ----------------------

        app.post('/cms/pages/delete/:id', function(req, res) {

            let id = req.body.id;
            Page.findByIdAndRemove(id, function(err, page) {
                if (err) {
                    return res.status(500);
                }
                if (page) {
                    console.log(page.title + ' deleted');

                    res.redirect('/cms/pages/get-pages');
                }
            })
        })

    // Edit page ------------
    // ----------------------

        app.post('/cms/pages/edit-page/:id', function(req, res) {

            let id = req.body._id;
            let updateObj = req.body;

            Page.findByIdAndUpdate( id, updateObj, {new: true}, function(err, page) {

                if (err) {
                    return res.status(500);
                }

                if (id == '' || !id) {
                    return false;
                }

                if (page) {
                    console.log(page.title + ' found');  
                    console.log('changes made ', page);
                }
    
                page.save(function(err) {
                    if (err) {
                        res.status(500);
                    }
                    console.log('saved page: ' + page.title);
                    res.redirect('/cms/pages/get-pages');
                });
            })      
        })

    // PROJECT endpoints -------
    // -------------------------

        app.post('/cms/projects/new-project', function(req, res) {
            
            Project.findOne({ name: req.body.name}, function(err, project) {

                if (err) {
                    return res.status(500);
                }

                if (req.body.name === '' || req.body.name == undefined) {
                    return false;
                }

                if (project) {
                    console.log(project.name + ' already exists');
                    return res.status(200).redirect('/cms/projects/get-projects');
                }

                else {
                    let project = new Project();
                    project.name = req.body.name;
                    project.friendlyUrl = req.body.friendlyUrl.trim().replace(/ /g, "_");

                    // check for http or https on links
                    // add to url string if needed
                    let http = 'http';
                    project.image = req.body.image;
                    project.livelink = req.body.livelink;
                    project.codeUrl = req.body.codeUrl;

                    imageBeg = req.body.image.split('').slice(0,4).join('');
                    livelinkBeg = req.body.livelink.split('').slice(0,4).join('');
                    codeUrlBeg = req.body.codeUrl.split('').slice(0,4).join('');

                    if (http != imageBeg) {
                        project.image = 'http://' + project.image;
                    }

                    if (http != livelinkBeg) {
                        project.livelink = 'http://' + project.livelink;
                    }

                    if (http != codeUrlBeg) {
                        project.codeUrl = 'http://' + project.codeUrl;
                    }

                    project.description = req.body.description;
                    project.skills = req.body.skills;
    
                    project.save(function(err) {
                        if (err) {
                            res.status(500);
                        }
                        console.log('saved project: ' + project.name);
                        res.redirect('/cms/projects/get-projects');
                    });
                }
            })      
        }) 

    // Delete project ---------
    // ------------------------

        app.post('/cms/projects/delete/:id', function(req, res) {

            let id = req.body.id;
            Project.findByIdAndRemove(id, function(err, project) {
                if (err) {
                    return res.status(500);
                }
                if (project) {
                    console.log(project.name + ' deleted');

                    res.redirect('/cms/projects/get-projects');
                }
            })
        })

    // Edit project ----------
    // -----------------------

        app.post('/cms/projects/edit-project/:id', function(req, res) {
            
            let id = req.body._id;
            let updateObj = req.body;

            Project.findByIdAndUpdate( id, updateObj, {new: true}, function(err, project) {

                if (err) {
                    return res.status(500);
                }

                if (id == '' || !id) {
                    return false;
                }

                if (project) {
                    console.log(project.name + ' found'); 

                    // check for http or https on links
                    // add to url string if needed
                    let http = 'http';

                    if (req.body.image) {
                        imageBeg = req.body.image.split('').slice(0,4).join('');
                        if (http != imageBeg) {
                            project.image = 'http://' + project.image;
                        };
                    };

                    if (req.body.livelink) {
                        livelinkBeg = req.body.livelink.split('').slice(0,4).join('');
                        if (http != livelinkBeg) {
                            project.livelink = 'http://' + project.livelink;
                        };
                    };
                    
                    if (req.body.codeUrl) {
                        codeUrlBeg = req.body.codeUrl.split('').slice(0,4).join('');
                        if (http != codeUrlBeg) {
                            project.codeUrl = 'http://' + project.codeUrl;
                        };
                    };
                    console.log('changes made ', project);
                
                    project.save(function(err) {
                        if (err) {
                            res.status(500);
                        }
                        console.log('saved project: ' + project.name);
                        res.redirect('/cms/projects/get-projects');
                    });
                }
            })      
        })

    // Add new skill -------------
    // ---------------------------

        app.post('/cms/skills/new-skill', function(req, res) {
                
            Skill.findOne({ skill: req.body.skill}, function(err, skill) {

                if (err) {
                    return res.status(500);
                }

                if (req.body.skill == '') {
                    return false;
                }

                if (skill) {
                    console.log(skill.skill + ' already exists');
                    return res.status(200).redirect('/cms/skills/get-skills');
                }

                let newskill = new Skill();
                newskill.skill = req.body.skill;
                
                newskill.save(function(err) {
                    if (err) {
                        res.status(500);
                    }
                    console.log('saved new skill: ' + newskill.skill);
                    res.redirect('/cms/skills/get-skills');
                });
            })      
        }) 

    // Delete skill --------------
    // ---------------------------

        app.post('/cms/skills/delete/:id', function(req, res) {

            let id = req.body.id;
            Skill.findByIdAndRemove(id, function(err, skill) {
                if (err) {
                    return res.status(500);
                }
                if (skill) {
                    console.log(skill.skill + ' deleted');
                    
                }
                res.redirect('/cms/skills/get-skills');
            })
        })

    // USER endpoints ---------
    // ------------------------

        app.post('/cms/users/new-user', function(req, res) {
                
            User.findOne({'local.email': req.body.local.email} , function(err, user) {

                if (!req.body.local.email || !req.body.local.name) {
                    return false;
                }

                if (user) {
                    console.log(user.local.email + ' already exists');
                    return res.status(200).redirect('/cms/users/get-users');
                }

                if (err) {
                    return res.status(500);
                }

                let newuser = new User();
                newuser.local = {};
                newuser.local.name = req.body.local.name;
                newuser.local.email = req.body.local.email;
                newuser.local.password = newuser.generateHash(req.body.local.password);
                
                newuser.save(function(err) {
                    if (err) {
                        res.status(500);
                    }
                    console.log('saved new user: ' + newuser.local.email);
                    res.redirect('/cms/users/get-users');
                });
            })      
        })

    // Edit admin user details -------
    // -------------------------------

        app.post('/cms/users/edit-user/:id', function(req, res) {
            
            let id = req.body._id;
            let updateObj = req.body;

            User.findById(id, function(err, user) {

                if (err) {
                    return res.status(500);
                }

                if (updateObj.local.email === '' || !updateObj.local.email) {
                    return false;
                }

                if (user) {
                    console.log(user.local.email + ' found');  

                }

                user.local.email = updateObj.local.email;
                user.local.name = updateObj.local.name;
                
                if (user.local.password != updateObj.local.password) {
                    user.local.password = updateObj.local.password;
                    user.local.password = user.generateHash(user.local.password);
                }
                console.log('changes', user);
    
                user.save(function(err) {
                    if (err) {
                        res.status(500);
                    }
                    console.log('saved user: ' + user.local.email);
                    res.redirect('/cms/users/get-users');
                });  
            
            })      
        })

    // Delete admin user -----------
    // -----------------------------

        app.post('/cms/users/delete/:id', function(req, res) {
            let id = req.body.id;
            User.findByIdAndRemove(id, function(err, user) {
                if (err) {
                    return res.status(500);
                }
                if (user) {
                    console.log(user.local.email + ' deleted');
                    
                }
                res.redirect('/cms/users/get-users');
            })
        })

    // OPTION, Themes endpoints -----
    // ------------------------------

        app.post('/cms/options/new-option', function(req, res) {

            Option.findOne({ key: req.body.key}, function(err, option) {
                if (err) {
                    return res.status(500);
                }

                if (req.body.key === '') {
                    return false;
                }

                if (option) {
                    console.log(option.key + ' already exists');
                    return res.status(200).redirect('/cms/options/get-options');
                }

                let newOption = new Option();
                newOption.key = req.body.key;
                newOption.value = req.body.value;
                
                newOption.save(function(err) {
                    if (err) {
                        res.status(500);
                    }
                    console.log('saved new option: ' + newOption.key + ' = ' + newOption.value);
                    res.redirect('/cms/options/get-options');
                });
            })
        })

        // Retrieve active theme -----
        // ---------------------------

        app.get('/cms/options/get-theme', function(req, res) {

            Option.findOne({ key: 'theme'}, function(err, option) {
                if (err) {
                    return res.status(500);
                }

                console.log('theme retrieved: ' + option.value);
                res.status(200).json(option).end();

            })
        })

        // Update Option Value (theme, default)
        // -----------------------------------

        app.post('/cms/options/update-option', function(req, res) {

            Option.findOne({ key: req.body.key}, function(err, option) {
                if (err) {
                    return res.status(500);
                }

                if (req.body.key === '') {
                    return false;
                }

                if (option) {
                    option.value = req.body.value;
                    
                    option.save(function(err) {
                        if (err) {
                            return res.status(500);
                        }

                        console.log(option.key + ' updated: ' + option.value);
                        return res.status(200).json(option).end();
                        
                    });
                }

                else {
                    console.log('option error, not found?');
                    return res.end();
                }
            })
        })


    // ====  Refresh page catch-all endpoint ========

        app.get('/cms/*', isLoggedIn, function(req, res) {
            console.log('catch-all endpoint');
            res.redirect('/cms');
        })

// -------------------------------------------
// ----------- Admin endpoints above this line
// ------------------------------------------
    });

    // Page not found 
    
    app.get('/:url/*', function(req, res, next) {
        if (req.params.url === 'cms') {
            next();
        }
        else {
            console.log('404 error');
            res.status(404).render('notfound.pug');
        }
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =======================================
// Live site access point via Friendly Url 
// =======================================

    app.get('/:friendlyUrl', function(req, res) {

        Page.findOne( {friendlyUrl: req.params.friendlyUrl}, function(err, page) {

            if (err) {
                return res.status(500);
            }

            // Page 404 Error 
            if (!page) {
                console.log('page not found from parameter: ' + req.params.friendlyUrl);
                return res.status(404).render('notfound.pug');

            }

            // Use option model to get chosen theme
            Option.findOne({ key: 'theme'}, function(err, option) {
                if (err) {
                    return res.status(500);
                }

                if (!option) {
                    console.log('theme not found');
                    return res.redirect('/');
                }

                // Fetch all projects
                Project.find(function(err, projects) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }

                    Skill.find(function(err, skills) {
                        if (err) {
                            return res.status(500);
                        }

                        let skillsArr = [];

                        // skills result is an array of skills objects
                        // turn the result into an array with skill name values
                        for ( let i = 0; i < skills.length; i++ ) {
                            skillsArr.push(skills[i].skill);
                        }
                        skillsArr.sort();

                        let renderFile = '../themes/' + option.value + '/' + req.params.friendlyUrl + '.pug';

                        // file name of template needs to match friendlyUrl
                        res.render(renderFile, {
                            title : page.title,
                            friendlyUrl : page.friendlyUrl,
                            content: page.content,
                            projects: projects,
                            skills: skillsArr
                        });
                    });
                });
            });
        });
    });

// ====== End of module exports
// ======   
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

    // =====================================
    // INSTALLATION=========================
    // ===================================== 

function performInstallation(res){
    var defaultID;

    // create admin user
    let newuser = new User();
    newuser.local = {};
    newuser.local.name = 'admin';
    newuser.local.email = 'admin@email.com';
    newuser.local.password = newuser.generateHash('admin');
    
    newuser.save(function(err) {
        if (err) {
            res.status(500);
        }
        console.log('Installation Step 1: Created Admin User ' + newuser.local.email);
    });

    // create pages, set home to default
    let pages = [
        {
            "content" : "<p>Hello, welcome to my page. This is the Home page.</p>\n",
            "friendlyUrl" : "home",
            "title" : "Home Page",
        },
        {
            "content" : "<p>This is the portfolio page. See my projects.</p>\n",
            "friendlyUrl" : "portfolio",
            "title" : "Portfolio",
        },
        {
            "content" : "<p>This is the &#39;About&#39; Page. You can type whatever you want here.</p>\n",
            "friendlyUrl" : "about",
            "title" : "About",
        },
        {
            "content" : "<p>Thank you for visiting my page! Feel free to contact me.</p>\n",
            "friendlyUrl" : "contact",
            "title" : "Contact Me",
        }
    ];

    pages.map(function(p){
        let page = new Page();
        page.title = p.title;
        page.friendlyUrl = p.friendlyUrl.trim().replace(/ /g, "_");
        page.content = p.content;
        
        page.save(function(err) {
            if (err) {
                res.status(500);
            }
            if(page.friendlyUrl == 'home'){
                let newOption = new Option();
                newOption.key = "default";
                newOption.value = page._id;
                
                newOption.save(function(err) {
                    if (err) {
                        res.status(500);
                    }
                }); 
            }
            console.log('Installation Step 2: Created Page ' + page.title);
        });
    });


    // create projects
    let projects = [       
        {
            "skills" : [ 
                "Javascript", 
                "Node.js", 
                "Petting Dogs", 
                "Sushi"
            ],
            "description" : "<p>We want the <strong>GitHub</strong> community to be a welcoming environment where people feel empowered to share their opinion.</p>\n\n<p>We are now accepting feedback on our proposed Community Guidelines.</p>\n",
            "codeUrl" : "http://www.mspca.com",
            "livelink" : "http://www.petfinder.com",
            "image" : "",
            "friendlyUrl" : "Rescue_Doggos",
            "name" : "thinkful project"
        },
        {
            "description" : "<p>Optional. Which base to use for representing a numeric value. <em>Must be an integer between 2 and 36.</em></p>\n\n<p><strong>2 - The number will show as a binary value </strong></p>\n\n<p>8 - The number will show as an octal value</p>\n\n<p><s>16 - The number will show as an hexadecimal value</s></p>\n",
            "codeUrl" : "http://www.github.com",
            "livelink" : "http://www.amazon.com",
            "image" : "http://placekitten.com/400/300",
            "friendlyUrl" : "this_is_another_test_with_spaces",
            "name" : "Testing urls",
            "skills" : [ 
                "Eating", 
                "Cooking", 
                "Sleeping", 
                "Buffets", 
                "Sushi"
            ],
        },
        {
            "description" : "<p><em><strong>The escape() function encodes a string. This function makes a string portable, so it can be transmitted across any network to any computer that supports ASCII characters.</strong></em></p>\n\n<p><em><strong>more stuff</strong></em></p>\n\n<p><em><strong>This function encodes special characters, with the exception of: * @ - _ + </strong></em>.&nbsp;</p>\n",
            "codeUrl" : "http://www.github.com",
            "livelink" : "http://www.heroku.com",
            "image" : "http://placekitten.com/350",
            "friendlyUrl" : "friendly",
            "name" : "Another URL test",
            "skills" : [ 
                "Eating", 
                "Cooking", 
                "Socket.io", 
                "Sushi", 
                "Typing"
            ]
        },
        {
            "description" : "<p>For those who want some background info, here&#39;s a short article explaining why overflow: hidden works.<strong> It has to do with the so-called block formatting context.</strong> This is part of W3C&#39;s spec (ie is not a hack) and is basically the region occupied by an element with a block-type flow. Every time it is applied, overflow: hidden creates a new block formatting context.</p>\n\n<p>But it&#39;s not the only property capable of triggering that behaviour. Quoting a presentation by Fiona Chan from Sydney Web Apps Group:</p>\n\n<p>float: left / right</p>\n\n<p>overflow: hidden / auto / scroll</p>\n\n<p>display: table-cell</p>\n\n<p>and any table-related values / inline-block position: absolute / fixed</p>\n",
            "codeUrl" : "http://www.github.com ",
            "livelink" : "http://www.google.com ",
            "image" : "http://placekitten.com/450",
            "friendlyUrl" : "this_is_a_url",
            "name" : "New Page Test",
            "skills" : [ 
                "Buffets", 
                "Express", 
                "Cooking", 
                "Eating", 
                "Vacuuming", 
                "UI/UX", 
                "Redux"
            ]
        },
        {
            "description" : "<p>Good Friday to everyone, hopefully, it&#39;s full of nice surprises. We have also prepared something to show: this shot features a new full case study in Tubik design portfolio. The presentation shows UI/UX, branding and graphic design created for the Mac app&nbsp;<a href=\"http://swiftybeaver.tubikstudio.com/\">SwiftyBeaver</a>&nbsp;whose core target audience is developers. So, design solutions were determined with a variety of specific factors due to the nature of the product. Perhaps, you remember our previous shots showing some details of creative process and today we invite you to see&nbsp;<a href=\"http://swiftybeaver.tubikstudio.com/\">the full case</a>.</p>\n\n<p><strong>To share more ideas based on experience from design projects and concepts, we regularly update&nbsp;<a href=\"http://tubikstudio.com/blog/\">Tubik Blog</a>with new articles and share free ebooks. One of the books presents deep insights into&nbsp;<a href=\"http://tubikstudio.com/book/\">design for business goals</a>. Welcome to download or read online!</strong></p>\n",
            "codeUrl" : "http://www.github.com  ",
            "livelink" : "http://www.google.com   ",
            "image" : "http://placekitten.com/270",
            "friendlyUrl" : "wut_doo",
            "name" : "Testing",
            "skills" : [ 
                "Javascript", 
                "Angular", 
                "Node.js", 
                "Express", 
                "Redux", 
                "Interview"
            ]
        },
        {
            "description" : "<p>While practicing motocross in Hawaii, Sean Jones witnesses the brutal murder of an important American prosecutor by the powerful mobster Eddie Kim. He is protected and persuaded by the FBI agent Neville Flynn to testify against Eddie in Los Angeles.</p>\n\n<p>They embark in the red-eye Flight 121 of Pacific Air, occupying the entire first-class. However, Eddie dispatches hundred of different species of snakes airborne with a time operated device in the luggage to release the snakes in the flight with the intent of crashing the plane.</p>\n\n<p>Neville and the passengers have to struggle with the snakes to survive.&nbsp;<em>Written by&nbsp;<a href=\"http://www.imdb.com/search/title?plot_author=Claudio%20Carvalho,%20Rio%20de%20Janeiro,%20Brazil&amp;view=simple&amp;sort=alpha&amp;ref_=tt_stry_pl\">Claudio Carvalho, Rio de Janeiro, Brazil</a></em></p>\n",
            "codeUrl" : "http://www.teefury.com",
            "livelink" : "http://www.placekitten.com",
            "image" : "",
            "friendlyUrl" : "url_test_sample",
            "name" : "Sample",
            "skills" : [ 
                "HTML", 
                "Javascript", 
                "Node.js", 
                "Angular", 
                "UI/UX", 
                "Socket.io", 
                "Redux", 
                "Sleeping"
            ]
        }
    ];

    projects.map(function(p){
        let project = new Project();
        project.name = p.name;
        project.friendlyUrl = p.friendlyUrl.trim().replace(/ /g, "_");
        project.image = p.image;
        project.livelink = p.livelink;
        project.codeUrl = p.codeUrl;
        project.description = p.description;
        project.skills = p.skills;
        
        project.save(function(err) {
            if (err) {
                res.status(500);
            }
            console.log('Installation Step 3: Created Project ' + project.name);
        });
    });

    // create skills

    let skills = [
        {"skill" : "HTML" },
        {"skill" : "Javascript" },
        {"skill" : "Node.js" },
        {"skill" : "React" },
        {"skill" : "Express" },
        {"skill" : "Sleeping" },
        {"skill" : "Cooking" },
        {"skill" : "Eating" },
        {"skill" : "Petting Dogs" },
        {"skill" : "Angular" },
        {"skill" : "Vacuuming" },
        {"skill" : "Buffets" },
        {"skill" : "Sushi" },
        {"skill" : "UI/UX" },
        {"skill" : "Socket.io" },
        {"skill" : "Redux" },
        {"skill" : "Typing" },
        {"skill" : "Interview" }
    ];
    skills.map(function(s){
        let newskill = new Skill();
        newskill.skill = s.skill;
        
        newskill.save(function(err) {
            if (err) {
                res.status(500);
            }
            console.log('Installation Step 4: Created Skill ' + newskill.skill);
        });
    });

    // set options, default & theme
    let options = [
        {
            "value" : "default",
            "key" : "theme",
        }
    ];
    options.map(function(o){
        let newOption = new Option();
        newOption.key = o.key;
        newOption.value = o.value;
        
        newOption.save(function(err) {
            if (err) {
                res.status(500);
            }
            console.log('Installation Step 5: Set Default Theme & Homepage');
        }); 
    });

    res.render('installation.pug');
}
