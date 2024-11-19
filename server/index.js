const express = require("express")
const { ApolloServer } = require("@apollo/server")
const { expressMiddleware } = require("@apollo/server/express4")
const bodyParser = require("body-parser")
const cors = require("cors");
const { default: axios } = require("axios");

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!,
                name: String!,
                email: String!,
            }
    
            type Todo {
                id: ID!
                title: String!
                completed: Boolean!
                user: User
            }
    
            type Query {
                getTodo: [Todo],
                getAllUser: [User],
                getUser(id: ID!): User
            }
        `,
        resolvers: {
            Todo: {
                user: async (todo) => {
                    try {
                        return (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data;
                    } catch (error) {
                        console.error(`Failed to fetch user for todo ${todo.id}:`, error.message);
                        return null;
                    }
                }
            },


                Query: {
                    getTodo: async () => (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
                    getAllUser: async () => (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
                    getUser: async (_, { id }) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
                },
            },
        })
    app.use(cors())
    app.use(bodyParser.json())

    await server.start()

    app.use("/graphql", expressMiddleware(server))

    app.listen(8000, () => {
        console.log("Server is running on port 8000")
    })
}
startServer();