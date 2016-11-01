const User = require('../app/models/user');
const Page = require('../app/models/page');
const Project = require('../app/models/project');
const Skill = require('../app/models/skill');
// const Site = require('../app/models/site');

module.exports = function(app, passport) { 
    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {

       res.render('index.pug', { message: req.flash('signupMessage') } ); 
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

    // =============
    // DEFAULT THEME 
    // =============

    app.get('/default/home/:friendlyUrl', function(req, res) {

        Page.findOne({ friendlyUrl: req.params.friendlyUrl}, function(err, page) {

            if (err) {
                return res.status(500);
            }

            if (!page) {
                console.log('page not found from parameter: ' + req.params.friendlyUrl);
                return res.status(404).json(null);
            }

            if (page) {
                    
                res.render('../themes/default/home.pug', {
                    title : page.title,
                    friendlyUrl : page.friendlyUrl,
                    content: page.content
                }); 
            }
        })  
    
    // =====
    // =====
        app.get('/default/about/:friendlyUrl', function(req, res) {

            Page.findOne( {friendlyUrl: req.params.friendlyUrl}, function(err, page) {

                if (err) {
                    return res.status(500);
                }

                if (!page) {
                    console.log('page not found from parameter: ' + req.params.friendlyUrl);
                    return res.status(404).json(null);
                }
                console.log(page);
                res.render('../themes/default/about.pug', {
                    aboutTitle: page.title,
                    aboutUrl: page.friendlyUrl,
                    aboutContent: page.content
                });
            });
        })

    // =====
    // =====
        app.get('/default/portfolio/:friendlyUrl', function(req, res) {

            Page.findOne( {friendlyUrl: req.params.friendlyUrl}, function(err, page) {

                if (err) {
                    return res.status(500);
                }

                if (!page) {
                    console.log('page not found from parameter: ' + req.params.friendlyUrl);
                    return res.status(404).json(null);
                }

                // Fetch all projects
                Project.find(function(err, projects) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }

                    res.render('../themes/default/portfolio.pug', {
                        portfolioTitle: page.title,
                        portfolioUrl: page.friendlyUrl,
                        portfolioContent: page.content,
                        projects: projects
                    });
                })
            });
        })


       app.get('/default/*', function(req, res) {
            console.log('default theme catch-all endpoint');
            defaultHome = {};

            res.redirect('/default/home/home');
        }) 

    // DEFAULT Theme endpoints go above here
    // =====================================
    });  
    

    // =====================================
    // ADMIN SECTION =======================
    // =====================================

    app.get('/cms', isLoggedIn, function(req, res) {
        console.log('logged in as: ' + req.user.local.name);
        let data = {};
        data.user = req.user;
        data.view = 'home';
        res.render('admin-layout.pug', {
            user : data.user,
            view : data.view 
        });

    // ---------------------- Admin endpoint seperator
    // Endpoints to fetch all documents in Page, Project, and Skill collections

        app.get('/cms/pages/get-pages', function(req, res) {
            Page.find(function(err, pages) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }

                res.status(200).json(pages).end();
            })
        })

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

    // Admin endpoint seperator ----------------------
    // PAGE endpoints --------------------------------

        app.post('/cms/pages/new-page', function(req, res) {
            
            Page.findOne({ title: req.body.title}, function(err, page) {

                if (err) {
                    return res.status(500);
                }

                if (req.body.title == '' || req.body.title == undefined) {
                    return false;
                }

                if (page) {
                    console.log(page.title + ' already exists');
                    return res.status(200).redirect('/cms/pages/get-pages');
                }

                else {
                    var page = new Page();
                    page.title = req.body.title;
                    page.friendlyUrl = req.body.friendlyUrl.trim().replace(/ /g, "_");
                    page.content = req.body.content;
                }
    
                page.save(function(err) {
                    if (err) {
                        res.status(500);
                    }
                    console.log('saved new page: ' + page.title);
                    res.redirect('/cms/pages/get-pages');
                });
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
                    var project = new Project();
                    project.name = req.body.name;
                    project.friendlyUrl = req.body.friendlyUrl.trim().replace(/ /g, "_");
                    project.image = req.body.image;
                    project.livelink = req.body.livelink;
                    project.codeUrl = req.body.codeUrl;
                    project.description = req.body.description;
                    project.skills = req.body.skills;
                }
    
                project.save(function(err) {
                    if (err) {
                        res.status(500);
                    }
                    console.log('saved project: ' + project.name);
                    res.redirect('/cms/projects/get-projects');
                });
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
                    console.log('changes made ', project);
                }
    
                project.save(function(err) {
                    if (err) {
                        res.status(500);
                    }
                    console.log('saved project: ' + project.name);
                    res.redirect('/cms/projects/get-projects');
                });
            
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



    // ====  Refresh page catch-all endpoint ========

        app.get('/*', function(req, res) {
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
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
