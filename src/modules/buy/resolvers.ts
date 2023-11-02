import { GraphQLError } from "graphql";
import { BuyType, ContextType } from "../../types";
import TokenHelper from "../../lib/TokenHelper";
import { BuyProduct, ProductModel } from "../../model";

export default {
    Query: {
        buy: async (_: undefined, { buy_id }: BuyType, { token }: ContextType) => {
            try {
                const { user_id } = await TokenHelper.verify(token) as any;
                if (!user_id) return new GraphQLError("Unauthorized", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 401
                        }
                    }
                });
                const find = await BuyProduct.findOne({ where: { buy_id } });
                return find;

            } catch (error: any) {
                console.log(error.message);
                return new GraphQLError(error.message, {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500
                        }
                    }
                });
            }
        }
    },



    // mutation
    Mutation: {
        addbuy: async (_: undefined, { product_id }: BuyType, { token }: ContextType) => {
            try {
                console.log(product_id);
                
                const { user_id } = TokenHelper.verify(token) as any;
                console.log(user_id);
                
                if (!user_id) return new GraphQLError("Unauthorized", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 401
                        }
                    }
                });


                const find = await ProductModel.findOne({ where: { product_id } });
                if (!find) return new GraphQLError("Notfound", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 406
                        }
                    }
                });


                await BuyProduct.create({ product_id, user_id });

                return {
                    msg: "ok",
                    data: find
                };
            } catch (error: any) {
                console.log(error.message);
                return new GraphQLError(error.message, {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500
                        }
                    }
                })
            }
        },


        // delet buy
        deletbuy: async (_: undefined, { buy_id }: BuyType, { token }: ContextType) => {
            try {
                const find = await BuyProduct.findOne({ where: { buy_id } }) as any;
                const { user_id } = TokenHelper.verify(token) as any;

                if (!find || find.user_id != user_id) return new GraphQLError("Notfound", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 406
                        }
                    }
                });
                await BuyProduct.destroy({ where: { buy_id } });
                return {
                    msg: "ok",
                    data: find
                }

            } catch (error: any) {
                console.log(error.message);
                return new GraphQLError(error.message, {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500
                        }
                    }
                })
            }
        }

        
    }


}