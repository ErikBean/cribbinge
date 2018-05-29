const typeDefs = `

  type Mutation {
    addTodo(text: String!): Todo
    toggleTodo(id: Int!): Todo
  }

  type Query {
    visibilityFilter: String
    todos: [Todo]
    gameEvents: [Event]
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