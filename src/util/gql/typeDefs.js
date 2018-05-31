const typeDefs = `

  type Mutation {
    addTodo(text: String!): Todo
    toggleTodo(id: Int!): Todo
  }

  type Query {
    visibilityFilter: String
    todos: [Todo]
    gameEvents: [Event]
    game: Game
  }
  
  type Game {
    id: String!
    deck: [String]
    stage: Int!
    events: [Event]!
    cutsForFirstCrib: CutsInfo
    hand(userid: String!): Hand
    crib: Crib
  }
  
  type Hand {
    cards: [String]
    hasDiscarded: Boolean
  }
  
  type Crib {
    cards: [String!],
    hasAllCards: Boolean,
  }
  
  type CutsInfo {
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

`;
export default typeDefs;
