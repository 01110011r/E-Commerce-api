import { GraphQLError } from "graphql";
import { CommentType } from "../../types";
import { CommentModel } from "../../model";

export default {
    Query: {
        comments: async (_: undefined, { product_id }: CommentType) => {
            try {
                const data = await CommentModel.findAll({ where: { product_id } });
                return data;
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




    Mutation: {
        createcomment: async (_: undefined, { product_id, title }: CommentType) => {
            try {
                const newComent = await CommentModel.create({ product_id, title });
                return {
                    msg: "ok",
                    data: newComent
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


        // edit comment
        editcomment: async (_: undefined, { comment_id, title }: CommentType) => {
            try {
                const find = await CommentModel.findOne({ where: { comment_id } });
                if (!find) return new GraphQLError("comment notfound", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 404
                        }
                    }
                });

                const newComment = await CommentModel.update({ title }, { where: { comment_id } });
                return {
                    msg: "ok",
                    data: newComment
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



        // delete comment
        deletcomment: async (_: undefined, { comment_id }: CommentType) => {
            try {
                const find = await CommentModel.findOne({ where: { comment_id } });
                if (!find) return new GraphQLError("comment notfound", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 404
                        }
                    }
                });

                const delet = await CommentModel.destroy({ where: { comment_id } });
                return {
                    msg: "ok",
                    data: delet
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
        }




    }
}