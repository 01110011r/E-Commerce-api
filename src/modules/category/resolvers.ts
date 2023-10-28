import { GraphQLError } from "graphql";
import { CategoryType, ContextType } from "../../types";
import { CategoryModel, ProductModel } from "../../model";
import TokenHelper from "../../lib/TokenHelper";

export default {
    Query: {
        category: async (_: undefined, { category_id }: CategoryType) => {
            try {
                const find = await CategoryModel.findOne({ where: { category_id }, include: ProductModel });
                if (!find) return new GraphQLError("category notfound", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500
                        }
                    }
                });
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
                })
            }
        },



        // categories
        categories: async () => {
            try {
                console.log('ok');
                
                const find = await CategoryModel.findAll();
                console.log(find);
                
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
                })
            }
        }
    },





    // Mutation
    Mutation: {


        addcategory: async (_: undefined, { category_name }: CategoryType, { token }: ContextType) => {
            try {

                const { isAdmin } = TokenHelper.verify(token) as any;

                if (!isAdmin) return new GraphQLError("Forbidden", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 403
                        }
                    }
                });

                const check = await CategoryModel.findOne({ where: { category_name } });
                if (check) return new GraphQLError("already exists", {
                    extensions: {
                        code: "CONFLICT",
                        http: {
                            status: 409
                        }
                    }
                });
                const newData = await CategoryModel.create({ category_name });
                return {
                    msg: "ok",
                    data: newData
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
                });
            }
        },



        // edit category
        editcategory: async (_: undefined, { category_id, category_name }: CategoryType, { token }: ContextType) => {
            try {

                const { isAdmin } = TokenHelper.verify(token) as any;

                if (!isAdmin) return new GraphQLError("Forbidden", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 403
                        }
                    }
                });


                const check = await CategoryModel.findOne({ where: { category_id } });
                if (!check) return new GraphQLError("notfound", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 404
                        }
                    }
                });
                const newData = await CategoryModel.update({ category_name }, { where: { category_id } });
                return {
                    msg: "ok",
                    data: newData
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
                });
            }
        },




        // delet category
        deletcategory: async (_: undefined, { category_id }: CategoryType, { token }:ContextType) => {
            try {

                const { isAdmin } = TokenHelper.verify(token) as any;

                if (!isAdmin) return new GraphQLError("Forbidden", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 403
                        }
                    }
                });

                const check = await CategoryModel.findOne({ where: { category_id } });
                if (!check) return new GraphQLError("notfound", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 409
                        }
                    }
                });
                const newData = await CategoryModel.destroy({ where: { category_id } });
                return {
                    msg: "ok",
                    data: newData
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
                });
            }
        },





    }
}