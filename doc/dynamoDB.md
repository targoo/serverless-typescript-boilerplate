# Dynamo DB

|       | Hash           | Sort                                | Attributes |
| ----- | -------------- | ----------------------------------- | ---------- |
|       | ID             | RELATION                            |            |
| BOARD | USER#<USER_ID> | BOAD#<BOARD_UUID>                   |            |
| JOB   | USER#<USER_ID> | JOB#BOARD#<BOARD_UUID>#<JOB_UUID>   |            |
| FILE  | USER#<USER_ID> | FILE#BOARD#<BOARD_UUID>#<FILE_UUID> |            |
| FILE  | USER#<USER_ID> | FILE#JOB#<JOB_UUID>#<FILE_UUID>     |            |

## Entity Relationship Diagram (ERD)

## Access patterns

- List of all the boards for a user: Primary key: Hash key is the `USER#<USER_ID>` and the sort key begins with `BOAD#`
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
