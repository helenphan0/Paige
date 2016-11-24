const User = require('../app/models/user');
const Page = require('../app/models/page');
const Project = require('../app/models/project');
const Skill = require('../app/models/skill');
const Option = require('../app/models/option');


module.exports = function(app, passport) { 
    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {

        Option.findOne({key: 'default'}, function(err, option){
            
            if (!option) {
                return res.redirect('/login');
            }

            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }

            let id = option.value;
            console.log(id);
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
            })
        })

    //   res.render('index.pug', { message: req.flash('signupMessage') } ); 
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
    app.get('/signup', function(req, res) {

        res.render('signup.pug', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/cms', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));

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
                fetchProjects.skills = skillsArr;

                res.status(200).json(fetchProjects).end();
            });
        });
    });

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

    // ---------------------- Admin endpoint seperator
    // Endpoints to fetch all documents in Page, Project, Skill, and User collections

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
                    fetchProjects.skills = skillsArr;

                    res.status(200).json(fetchProjects).end();
                });
            });
        });

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

    // Admin endpoint seperator ----------------------
    // PAGE endpoints --------------------------------

        app.post('/cms/pages/new-page', function(req, res) {
            
            Page.findOne({ title: req.body.title}, function(err, page) {

                if (err) {
                    return res.status(500);
                }

                if (req.body.title === '' || req.body.title == undefined) {
                    return false;
                }

                if (page) {
                    console.log(page.title + ' already exists');
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
    // ---------------------- Admin endpoint seperator
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

    // ---------------------- Admin endpoint seperator
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
    // Admin endpoint seperator ---------------
    // PROJECT endpoints ----------------------

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
    // ---------------------- Admin endpoint seperator
    // ----------------------

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

    // ---------------------- Admin endpoint seperator
    // ----------------------

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

    // Admin endpoint seperator -------------------
    // SKILL endpoints ----------------------------

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

    // ---------------------- Admin endpoint seperator
    // ----------------------

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

    // Admin endpoint seperator -------------------
    // USER endpoints ----------------------------

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

    // ---------------------- Admin endpoint seperator
    // ----------------------

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

    // ---------------------- Admin endpoint seperator
    // ----------------------

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

    // Admin endpoint seperator -------------------
    // OPTION, Themes endpoints -------------------

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

        // ---------------------- Admin endpoint seperator
        // ----------------------

        app.get('/cms/options/get-theme', function(req, res) {

            Option.findOne({ key: 'theme'}, function(err, option) {
                if (err) {
                    return res.status(500);
                }

                console.log('theme retrieved: ' + option.value);
                res.status(200).json(option).end();

            })
        })

        // ---------------------- Admin endpoint seperator
        // ----------------------

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

// ----------------
// ---------------- Admin endpoints above this line
// ----------------
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // 'public_profile' SHOULD be added to the scope, contrary to facebook developer documentation
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'public_profile'] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/cms',
            failureRedirect : '/'
        }));

    // =====================================
    // GITHUB ROUTES =======================
    // =====================================
    app.get('/auth/github', passport.authenticate('github', { scope : ['user', 'public_repo', 'repo'] }));

    app.get('/auth/github/callback',
        passport.authenticate('github', {
            successRedirect : '/cms',
            failureRedirect : '/'
        }));

    // =====================================
    // LINKEDIN ROUTES =====================
    // =====================================
    app.get('/auth/linkedin', passport.authenticate('linkedin', { scope : ['r_emailaddress', 'r_basicprofile'] }));

    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', {
            successRedirect : '/cms',
            failureRedirect : '/'
        }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/cms',
                failureRedirect : '/'
        }));

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =============
    // DEFAULT THEME 
    // =============

    app.get('/:friendlyUrl', function(req, res) {

        Page.findOne( {friendlyUrl: req.params.friendlyUrl}, function(err, page) {

            if (err) {
                return res.status(500);
            }

            if (!page) {
                console.log('page not found from parameter: ' + req.params.friendlyUrl);
                return res.status(404).json(null);
            }

            // Use option model to get chosen theme
            Option.findOne({ key: 'theme'}, function(err, option) {
                if (err) {
                    return res.status(500);
                }

                if (!option) {
                    console.log('theme not found');
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

                        let renderFile = '../themes/' + option.value + '/' + req.params.friendlyUrl + '.pug';
                        console.log(renderFile);

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
    })

// ====== End of module exports
// ======   
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
