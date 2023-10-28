import { makeExecutableSchema } from "@graphql-tools/schema";
import user from "./user";
import product from "./product";
import comment from "./comment";
import category from "./category";
import buy from "./buy";


export default makeExecutableSchema({
    typeDefs:[user.td, product.td, comment.td, category.td, buy.td],
    resolvers:[user.resolvers, product.resolvers, comment.resolvers, category.resolvers, buy.resolvers]
})