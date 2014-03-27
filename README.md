Trapfinder
==========
[![Build Status](https://travis-ci.org/natwebb/trapfinder.svg?branch=master)](https://travis-ci.org/natwebb/trapfinder)
[![Coverage Status](https://coveralls.io/repos/natwebb/trapfinder/badge.png?branch=master)](https://coveralls.io/r/natwebb/trapfinder?branch=master)
[![Dependency Status](https://gemnasium.com/natwebb/trapfinder.png)](https://gemnasium.com/natwebb/trapfinder)

*Trapfinder* is a browser game written as the capstone project for the HTML/CSS/JavaScript/NodeJS half of Nashville Software School's bootcamp program. *Trapfinder* actually encompasses two games:
*Trapfinder: Alone in the Dark* and *Trapfinder II: You Are Not Alone*. *Alone in the Dark* is the single-player version of the game, and uses the following technologies:

- Node.js with the Express framework running the server
- MongoDB to store user information, such as login info and game statistics
- Redis to store session data
- Bcrypt to hash and compare user passwords
- Lo-Dash for just about everything
- Jade to create custom HTML

And for testing,

- Grunt
- Mocha
- Chai
- SuperTest
- Blanket
- TravisCI
- Coveralls

*You Are Not Alone* is the two-player version of *Trapfinder*. It's similar to *Alone in the Dark*, using all the same technologies but adding **socket.io** to create a persistent communcation pathway between the server and the two players' browsers. Much more of
the game intelligence lives on the server, and both players see the same game screen dynamically change. Using socket.io also required adding socket.io-client to facilitate mocha testing of the sockets.js file. *Trapfinder II* also has weapons, which is cool.
