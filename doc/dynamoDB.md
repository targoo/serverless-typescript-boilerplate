# Dynamo DB

|       | Hash           | Sort                                                 | Attributes |                |
| ----- | -------------- | ---------------------------------------------------- | ---------- | -------------- |
|       |                |                                                      |            | 2nd Hash       |
| ----- | -------------- | ---------------------------------------------------- | ---------- | ---            |
|       | ID             | RELATION                                             |            | FID            |
| USER  | USER#<USER_ID> | USER                                                 |            |                |
| BOARD | USER#<USER_ID> | BOARD#<BOARD_UUID>                                   |            |                |
| JOB   | USER#<USER_ID> | JOB#BOARD#<BOARD_UUID>#<JOB_UUID>                    |            |                |
| EVENT | USER#<USER_ID> | EVENT#BOARD#<BOARD_UUID>#JOB#<JOB_UUID>#<EVENT_UUID> |            |                |
| FILE  | USER#<USER_ID> | FILE#BOARD#<BOARD_UUID>#<FILE_UUID>                  |            |                |
| FILE  | USER#<USER_ID> | FILE#JOB#<JOB_UUID>#<FILE_UUID>                      |            |                |
| BOARD | USER#<USER_ID> | FOLLOWING_BOARD#<BOARD_UUID>                         |            | USER#<USER_ID> |
| JOB   | USER#<USER_ID> | FOLLOWING_JOB#BOARD#<BOARD_UUID>#<JOB_UUID>          |            |                |

## Entity Relationship Diagram (ERD)

## Access patterns

- List of all the boards for a user: Primary key: Hash key is the `USER#<USER_ID>` and the sort key begins with `BOARD#`
- List of all the jobs for a user: Primary key: Hash key is the `USER#<USER_ID>` and the sort key begins with `JOB#`
- List of all the jobs for a board: Primary key: Hash key is the `USER#<USER_ID>` and the sort key begins with `JOB#BOARD#<BOARD_UUID>`
- List of all the files for a user: Primary key: Hash key is the `USER#<USER_ID>` and the sort key begins with `FILE#`
- List of all the files for a board: Primary key: Hash key is the `USER#<USER_ID>` and the sort key begins with `FILE#BOARD#<BOARD_UUID>`
- List of all the files for a job: Primary key: Hash key is the `USER#<USER_ID>` and the sort key begins with `FILE#JOB#<JOB_UUID>`

## GSI

## Query

Need to provide the primary key to access the items.

## Scan

Avoid
