enum BoardStatus {
ACTIVE
ARCHIVED
}

"""
This is a description of a Node
"""
interface Node {
id: ID!
}

"""
This is a description of a Board
"""
type Board implements Node {
uuid: ID!
title: String!
status: BoardStatus!
jobs: [Job!]!
}

"""
This is a description of a Job
"""
type Job implements Node {
id: ID!
}

type Query {
board: Board!
}

type Mutation {
createBoard(input: CreateBoardInput!): Board!
}

input CreateBoardInput {
title: String!
}

# https://nexus.js.org/converter
