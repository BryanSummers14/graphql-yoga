const { GraphQLServer } = require('graphql-yoga')
const { db, types } = require('../config.js')
const knex = require('knex')(db)

const typeDefs = `
${types}
type Query {
  hello(name: String): String
  getBuzz: [Buzz]
  getAuth(id: Int!): AuthInfo
}
`;
const resolvers = {
  Query: {
    hello: (root, { name }, context, info) => name ? `hello ${name}` : 'hello.... world',
    getBuzz: async (root, args, context, info) => await knex.queryBuilder().select().from('3formbuzz'),
    getAuth: async (root, { id }, context, info) =>
      ({
        auths: (await knex.queryBuilder().select().from('AuthAssignment').where('userId', id)),
        user: (await knex.queryBuilder().select().from('users').where('uid', id))[0]
      })
  },
}

// const logInput = async (resolve, root, args, context, info) => {
//   console.log(`1. logInput: ${args}`)
//   const result = await resolve(root, args, context, info)
//   console.log(`5. logInput`)
//   return result
// }

// const logResult = async (resolve, root, args, context, info) => {
//   console.log(`2. logResult ${JSON.stringify(args)}`)
//   const result = await resolve(root, args, context, info)
//   console.log(`4. logResult: ${result}`)
//   return result
// }
const PORT = 4040;
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  // middlewares: [logInput, logResult],
  context: {
    test: 'Test context'
  }
})
server.start(
  {
    port: PORT,
    endpoint: '/graphql'
  },
  () => console.log(`Server is running on http://localhost:${PORT}/graphql`)
)