# Chronos

A structured semantic Event and Activity Log on top of ElasticSearch (ES). Communication is via RESTful API.
To sum it up. This will take care of your ES index creation, sharding and document insertion. For now we support only the add operation.
Reading can be done directly via ES.

This project is heavily based on the Architecture of Zeitgeist.
To understand the direction we are taking please read http://web.archive.org/web/20091121192011/http://www.grillbar.org/wordpress/?p=426.

## Inserting events

When inserting Events, those are pushed through a pipe of "pre"'s (pre insert plugins), before validated. Those "pre"'s can manipualte the inserted events or do operations async with the raw data. Every "pre" can manipulate the data before the data is picked up by the next pre.

Once data is inserted into the DB, all valid and inserted events will be forwarded to the post plugins in parrallel to do whatever they feel like doing, e.g: (push notifications, insertion to redis, map/reduce, store until needed).

![alt tag](https://raw.github.com/seiflotfy/chronos/master/data/chronos_insert_events.png)

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
| mimeType       | string    |          | x        |
| storage        | string    |          | x        |
| currentId      | string    |          | x        |
