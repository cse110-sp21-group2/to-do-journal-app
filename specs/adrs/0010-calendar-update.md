# Calendar Schema Update

## Context and Problem Statement

It became difficult to update the quarter and semester view as we needed a start date. WE have to consider changes to the schema to implement. 

## Considered Options

* Create new objects and store them
* Have a new start date and generate the view from there
* Possibly ditch the view
  
## Decision Outcome

Chosen option: "Create new semester/quarter objects", because 
* Want to leave the quarter/semester intact for the student element 
* Easier to think creating elements 
* Better defined ways of storing those schedules