#  NG.freexit.API

[![Build Status](https://travis-ci.com/freexit/api.freexit.ng.svg?token=JUcCNLXGFi2Z35ydtNmz&branch=master)](https://travis-ci.com/freexit/api.freexit.ng)



## START-UP PROCEDURE
==================
- Install and configure mongoDB 
- sudo service mongod start|stop|restart  or simply mongod
- brew services restart mongodb-community@4.0
- clone the repo
- npm install && npm start

"start": "NODE_ENV=development nodemon --exec babel-node --presets=latest -- ./src",


## ROUTINES
=================
1. pull a particular branch

> git pull origin <branch>

2. Create a new branch named "feature_x" and switch to it using

> git checkout -b feature_x

3. push the branch to your remote repository

> git push origin <branch>

4. switch back to master

> git checkout master

5. and delete the branch again

> git branch -d feature_x

Remove the old origin and readd the correct one:

> git remote remove origin
> git remote add origin <correct address>

Update the existing remote links:

> git remote set-url origin <correct url>

> mongod --shutdown
> 

- User
  eWallet users which are User
- 
Transaction
-Setting
-Charge
-BankRegister
-Royal



## TODO TASKLIST
=================

- [x] admin
- [x] analytic
- [x] bank
- [x] bonus
- [x] category
- [x] county
- [x] country
- [x] deposit
- [x] lien
- [x] mail
- [x] notification
- [x] parcel
- [x] media
- [x] pickup
- [x] rating
- [x] report
- [x] schedule
- [x] setting
- [x] shipment
- [x] sms
- [x] state
- [x] ticket
- [x] track
- [x] transaction
- [x] transfer
- [x] upgrade
- [x] user
- [x] vehicle
- [x] withdraw


## API ROUTES
================

1. api/transaction
------------
- **List Transaction**
    - get /api/transaction


- **Add Transaction**
    - post /api/transaction


- **Delete Transaction**
    - delete /api/transaction/{transactionId}


- **Update Transaction**
    - put /api/transaction/{transactionId}


/var/www/html/freexit-api/public

## SHIPMENT OPERATIONS

- Sender creates parcels
- Sender Creates a Pickup consisting of Array of Parcels
- PENDING: Pickup status waiting to be picked up
- DISPATCH: The System runs a cron-job every minute that assigns pickups to near by dispatchers or
the Dispatcher can manually run a dispatch-service to indicate his interest to pickup
- PACKAGE: Sender indicates Dispatcher has arrives and has loaded the parcel
- SHIP | DISAPPROVE: Dispatcher agrees or disagrees to carry the parcel. Sender gets DEBITED if approves
- RECEIVE: Indicated by Sender including a rating that Recipient has confirmed getting the item. The dispatcher gets paid
- CANCEL: Sender could decline shipping the pickup before it gets shipped at APPROVE stage
- DISPUTE: Dispatcher or Sender could raise a dispute if unsatisfied with the QoS delivered. 

## TODO
 - AWS S3 bucket store images
 - AWS SNS for Notification 
 

1. Distance Matrix API 
https://developers.google.com/maps/documentation/distance-matrix/overview
The Distance Matrix API is a service that provides travel distance and time for a matrix of origins and destinations.


https://maps.googleapis.com/maps/api/distancematrix/outputFormat?parameters

https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=40.6655101,-73.89188969999998&destinations=40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626%7C40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=YOUR_API_KEY

https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=H8MW%2BWP%20Kolkata%20India&destinations=GCG2%2B3M%20Kolkata%20India&key=YOUR_API_KEY

https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=40.6655101,-73.89188969999998&destinations=enc:_kjwFjtsbMt%60EgnKcqLcaOzkGari%40naPxhVg%7CJjjb%40cqLcaOzkGari%40naPxhV:&key=YOUR_API_KEY

https://maps.googleapis.com/maps/api/distancematrix/json?origins=Vancouver+BC|Seattle&destinations=San+Francisco|Victoria+BC&mode=bicycling&language=fr-FR&key=YOUR_API_KEY



## AWS-SNS-SMS
A quick example of sending an SMS with AWS SNS and NodeJS

Create a specific AWS IAM user and add to group 'AmazonSNSFullAccess'

Open browser and visit something like,

`http://localhost:3000/?message=[The Message]&number=[The Number]&subject=[The Subject]`


## Deployment

run-rs --mongod --keep --shell ./erp-api/replStart.js

ssh -i "freexit.pem" ubuntu@3.139.205.76

rs.slaveOk();

## Upload Image 
- The are two endpoint for Image upload. One for AWS and another for Cloudinary
- Convert Image to Base64 String (here)[https://image-to-base64.imageonline.co/]


## TODO
- Search Schedules, regions (given a name, countryIso2)
- Cron-job for System Asignment


Wakanownow
Amadios
GDS

Hotel
Visa
Reservation
Vacation
