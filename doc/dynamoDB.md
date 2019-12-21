# Dynamo DB

|       | Hash   | Sort                       | Attributs |
| ----- | ------ | -------------------------- | --------- |
|       | ID     | RELATION                   |           |
| BOARD | userid | board-BOARD_UUID           |           |
| JOB   | userid | job-BOARD_UUID-JOB_UUID    |           |
| FILE  | userid | file-board-BOARD_UUID-UUID |           |

## ERD

## Access patterns

- List of all the boards for a user: Hash key is the `userid` and the sort key starts with `board-`
- List of all the jobs: Start with job-
- List of all job by board: Start with job-BOARDUUID
- List of files: Start with file-
- List of files by board: Start with file-board-BOARDUUID

## GSI

## Query

Need to provide the primary key to access the items.

## Scan

Avoid
