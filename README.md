# Chronos

A structured semantic Event and Activity Log on top of ElasticSearch (ES). Communication is via RESTful API.
To sum it up. This will take care of your ES index creation, sharding and document insertion. For now we support only the add operation.
Reading can be done directly via ES for now but soon enough we will add reading via Chronogeist directly.

This project is heavily based on the Architecture of Zeitgeist. 
To understand the direction we are taking please read http://web.archive.org/web/20091121192011/http://www.grillbar.org/wordpress/?p=426.

## Event structure

These are the fields required for Events to be inserted and also the fields that will be stored into the DB. Extra fields should be in the payload object, else the request will be ignored and an error will be reaised.

| property        | data type | readonly | optional |
|-----------------|-----------|----------|----------|
| id              | string    | x        |          |
| systemTimestamp | number    | x        |          |
| timestamp       | number    |          |          |
| interpretation  | string    |          |          |
| actor           | string    |          |          |
| subjects        | object    |          |          |
| manifestation   | string    |          | x        |
| origin          | string    |          | x        |
| payload         | object    |          | x        |

Note: subjects is a list of subject JSONs as described below

## Subject structure

These are the fields required for subjects to be inserted and also the fields that will be stored into the DB

| property       | data type | readonly | optional |
|----------------|-----------|----------|----------|
| id             | string    | x        |          |
| interpretation | string    |          |          |
| text           | string    |          |          |
| manifestation  | string    |          | x        |
| origin         | string    |          | x        |
| mimetype       | string    |          | x        |
| currentId      | string    |          | x        |