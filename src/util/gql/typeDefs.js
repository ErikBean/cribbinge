const typeDefs = `

  type Mutation {
    addTodo(text: String!): Todo
    toggleTodo(id: Int!): Todo
  }

  type Query {
    visibilityFilter: String
    todos: [Todo]
    gameEvents: [Event]
    game2: Game2
  }
  
  type Game2 {
    id: String!
    deck: [String]
    stage: Int!
    events: [Event]!
    cutsForFirstCrib: CutsInfo
  }
  
  type CutsInfo {
    first: Cut
    second: Cut
    winner: String
    hasCutForFirstCrib(userid: String!): Boolean!
    shownCuts: [String!]
  }

  type Todo {
    id: Int!
    text: String!
    completed: Boolean!
  }
  
  type Event {
    timestamp
    what
  }

`
export default typeDefs