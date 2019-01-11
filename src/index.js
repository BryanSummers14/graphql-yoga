const { GraphQLServer } = require('graphql-yoga')
const compression = require('compression');
const { db } = require('../config.js')
const knex = require('knex')(db)

const typeDefs = `
type Buzz {
  id: Int
  date: String
  contact1: Int
  contact2: Int
  socialTip: String
  generated: Int
}
type Query {
  hello(name: String): String
  bye(name: String): String
  getBuzz: [Buzz]
}
`
const resolvers = {
  Query: {
    hello: (root, { name }, context, info) => {
      console.log(`3. resolver: hello`)
      return `Hello ${name ? name : 'world'}!`
    },
    bye: (root, { name }, context, info) => {
      console.log(`3. resolver: bye - ${JSON.stringify(context)}`)
      return `Bye ${name ? name : 'world'}!`
    },
    getBuzz: async (root, args, context, info) => await knex.select().from('3formbuzz')
  },
}

const logInput = async (resolve, root, args, context, info) => {
  console.log(`1. logInput: ${args}`)
  const result = await resolve(root, args, context, info)
  console.log(`5. logInput`)
  return result
}

const logResult = async (resolve, root, args, context, info) => {
  console.log(`2. logResult ${JSON.stringify(args)}`)
  const result = await resolve(root, args, context, info)
  console.log(`4. logResult: ${result}`)
  return result
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: {
    test: 'Test context'
  }
})
server.use(compression())
server.start(() => console.log('Server is running on http://localhost:4000'))