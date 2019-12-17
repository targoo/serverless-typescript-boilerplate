#Dynamo DB

| d     | Hash   | Sort                       |
| ----- | ------ | -------------------------- |
|       | ID     | RELATION                   |
| BOARD | userid | board-BOARD_UUID           |
| JOB   | userid | job-BOARD_UUID-JOB_UUID    |
| FILE  | userid | file-board-BOARD_UUID-UUID |

List of all the boards: Start with board-
List of all the jobs: Start with job-
List of all job by board: Start with job-BOARDUUID
List of files: Start with file-
List of files by board: Start with file-board-BOARDUUID
