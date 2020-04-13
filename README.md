Bitum (news aggregator; deprecated)
====================

Description
-
"Bitum news aggregator" is a small demo site built with Node.js, Redis and 
Socket.io library. It is a web page that udpates itself with latest news from
rss channels that can be specified in a config file.
It consists of three parts: Express.js-based website, Redis storage and
script that fills storage with latest news runned by cron.

Installation
-
1. Install and run Redis data storage
2. Run runner.js script that you can find in the daemon folder. It fills
   Redis with initial data from rss channels (specified in the config file)
3. Run the website

Tests
-
Project has small test suite for daemon script testing. You can run it with 
```
grunt simplemocha
```
command

License
-
MIT
