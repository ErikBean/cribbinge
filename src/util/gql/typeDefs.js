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
    crib: Crib
    cutsForFirstCrib: CutsInfo
    deck: [String]
    events: [Event]!
    hand(userid: String!): Hand
    id: String
    pegging(userid: String!, opponentid: String!): PeggingInfo
    stage: Int!
    points(userid: String!, opponentid: String!): AllPoints!
    cut: String!
  }
  
  type AllPoints {
    hand: PointsItem!
    pegging: PointsItem!
    pegs: Pegs!
  }
  
  type Pegs {
    front: Int!
    rear: Int!
  }
  
  type Points {
    fifteens: Int!
    pairs: Int!
    runs: Int!
  }
  
  type PeggingInfo {
    playedCards: [PegCard]
    hasAGo(userid: String): Boolean
    canPlay(userid: String): Boolean
    total: Int!
  }
  
  type PegCard {
    card: String!
    playedBy: String!
  }
  
  type Hand {
    cards: [String]
    hasDiscarded: Boolean
  }
  
  type Crib {
    cards: [String!]
    hasAllCards: Boolean
    isMyCrib(userid: String!): Boolean!
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
