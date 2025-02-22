
npm init -y (Created a new Nodejs Project).

Installed dependencies Like express mongoose dotenv.

Created a new Model Contact.js, completed the schema and model.

Created index.js and did Port connection.

MongoDB Connection 

"/identify" Post request for checking whether contact data already present or not.

1) If not present then create a new Collection
2) If present and matched with one of from email or phone create a secondayID Collection with likedId as of primaryId Collection.

'/contact/:id' delete request for soft delete and to update delete time


Steps for Execution

1) Open terminal enter Contact folder and run "Node index.js"

2) check whether the server is running on port 3000

3) open Postman and create a new workspace

4) http://localhost:3000/identify  

5) Post method and body json

6) send email and phone number as JSON data

7) click submit

8) check response below and also Ensure that database formed in MongoDB Compass

To Update Delete time.

In Postman

1) select Delete Method and add url http://localhost:3000/contact/:id  (select id From Previous pushes)

2) attach success message in JSON data and submit.

3) check response below and also Ensure that database formed in MongoDB Compass

4) if collection is present then updates the delete time.
