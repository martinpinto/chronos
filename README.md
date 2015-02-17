# Chronogeist

A structured semnatic Event and Activity Log

## Event structure

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

## Subject structue

| property   | data type | readonly | optional |
|------------|-----------|----------|----------|
| id         | string    | x        |          |
| type       | string    |          |          |
| text       | string    |          |          |
| typeDomain | string    |          | x        |
| origin     | string    |          | x        |
| mimetype   | string    |          | x        |