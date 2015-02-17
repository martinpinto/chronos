# Chronogeist

A structured semnatic Event and Activity Log

## Event structure

These are the fields required for Events to be inserted and also the fields that will be stored into the DB. Extra fields should be in the payload object, else the request will be ignored and an error will be reaised.

| property        | data type | readonly | optional |
|-----------------|-----------|----------|----------|
| id              | string    | x        |          |
| systemTimestamp | number    | x        |          |
| timestamp       | number    |          |          |
| type            | string    |          |          |
| actor           | string    |          |          |
| subjects        | object    |          |          |
| typeDomain      | string    |          | x        |
| origin          | string    |          | x        |
| payload         | object    |          | x        |

Note: subjects is a list of subject jsons as described below

## Subject structue

These are the fields required for subjects to be inserted and also the fields that will be stored into the DB

| property   | data type | readonly | optional |
|------------|-----------|----------|----------|
| id         | string    | x        |          |
| type       | string    |          |          |
| text       | string    |          |          |
| typeDomain | string    |          | x        |
| origin     | string    |          | x        |
| mimetype   | string    |          | x        |