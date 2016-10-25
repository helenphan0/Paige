// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1112500148831397', 
        'clientSecret'  : '74d6fdaa284dbd772a830c33d01c547b', 
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileFields' :  ["emails", "displayName", "name", "email", "hometown", "location"]
    },

    'googleAuth' : {
        'clientID'      : '792416882677-megla5jquv3no6oricto4gaca02pq9oq.apps.googleusercontent.com',
        'clientSecret'  : 'cn2484z3pqJ4hNpRHdg0LHNg',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    },

    'githubAuth' : {
        'clientID'      : 'b5991bbd2f36322c7ee9',
        'clientSecret'  : '890327b582412b907b4a74d18e5ce7a4a80946dd',
        'callbackURL'   : 'http://localhost:8080/auth/github/callback'
    },

    'linkedinAuth' : {
        'clientID'      : '78h7rxui49b4l4',
        'clientSecret'  : '7zCIEfR5uJ7lKUF2',
        'callbackURL'   : "http://localhost:8080/auth/linkedin/callback"
  }

};