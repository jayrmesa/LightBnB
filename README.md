# LightBnB Project

A simple multi-page Airbnb cline that uses a server-side Javascript to display the information from queries to web pages via SQL queries. 

## Purpose

**_BEWARE:_ This client was published for learning purposes. It is _not_ intended for use in production-grade software.**

This project was created and published by me as part of my learnings at Lighthouse Labs. 



## Usage

**_Under LightBnB:_** Database for the tables and queries.

To check tables or the challenges under 1_queries, the user must be in psql mode and create a database called lightbnb from the psql terminal.
Here is the command "CREATE DATABSE lightbnb;" then connect to the database "\c lightbnb;" 

- **[ERD]**: LightBnB Entinty Relationship diagram to draft the tables.
- **[1_queries]:** LighthouseBnb SELECT challenges, five SELECT statements that will return results from our database, based on the requirements of our end user.
- **[migrations]:** Containes the LightBnb database table use "\i migrations/01_schema.sql" to create a table under psql.
- **[seeds]:** Containes the LightBnb database information of the user use "\i seeds/01_seeds.sql" and "\i seeds/02_seeds.sql" to instert the information in our table database.


**_Under LightBnB WebApp-master:_** User is able to connect to the database using javascript application, user then can interact with the data from a web page.


## Dependencies under LightBnB-WebApp-master

- [body-parser](https://www.npmjs.com/package/body-parser)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Express](https://www.npmjs.com/package/express)
- [cookie-session](https://www.npmjs.com/package/cookie-session)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [Node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#overview) Node 5.10.x or above
- [node-postgres](https://www.npmjs.com/package/pg)

## Getting Started

1. [Create](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) a new repository using this repository as a template.
2. Clone your repository onto your local device.
3. Install dependencies using the `npm install` command.
3. Start the web server using the `npm run local` command. The app will be served at <http://localhost:3000/>.
4. Go to <http://localhost:3000/> in your browser.


 **_BEWARE:_ All refactoring and testing is done under server file in database.js**

 ### Sample users

 - Existing sample users are under seeds in 02_seeds.sql, once inserted into the database
 - database,  pg "pool" is under: (can be change upon the user environment)
    - username: labber 
    - password: labber