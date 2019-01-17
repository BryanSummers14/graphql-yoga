const { GraphQLServer } = require('graphql-yoga')
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
type AuthItem {
  name: String
  type: Int
  description: String
  bizrule: String
  data: String
}
type AuthItemChild {
  parent: String
  child: String
}
type AuthAssignment {
  itemname: String
  userid: Int 
  bizrule: String
  data: String
}
type AuthInfo {
  auths: [AuthAssignment]
  user: User
}
type User {
  uid: Int
  is3form: Int
  isveritas: Int
  privs: Int
  active: Int
  email: String
  password: String
  changePassword: Int
  lastLogin: String
  fname: String
  lname: String
  company: String
  position: String
  industry: String
  phone: String
  phone_ext: String
  mobile: String
  fax: String
  tollfree: String
  billaddr: String
  shipaddr: String
  fedexnum: String
  upsnum: String
  category: String
  pricegrp: String
  ctag: Int
  repnote: String
  info: Int
  priority: Int
  cust_id: String
  contact_id: String
  repid: String
  srepid: String
  alt_pm: Int
  ice_privs: String
  terms: String
  cto_grp: String
  cto_grp_sub: String
  assoc: String
  created: String
  createby: Int
  accepted_terms: String
  reminder: Int
  cookie_validation: String
  bid: Int
  googleAuth: String
  lightartrepid: String
  exteriorrepid: String
  nationalrepid: String
  exempt_reason: String
  refresh_token: String
  adv_notif: Int
}
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

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  // middlewares: [logInput, logResult],
  context: {
    test: 'Test context'
  }
})
server.start({ port: 4040, endpoint: '/graphql' }, () => console.log('Server is running on http://localhost:4040/graphql'))