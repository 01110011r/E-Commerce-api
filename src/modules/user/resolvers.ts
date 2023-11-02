import { GraphQLError } from "graphql";
import { UserType, ContextType } from "../../types";
import TokenHelper from "../../lib/TokenHelper";
import { BuyProduct, ProductModel, UserModel } from "../../model";
import crypto from "../../lib/crypto";



export default {
    // query
    Query: {
        // users
        users: async (root: undefined, args: undefined, { token }: ContextType) => {
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




                const data = await UserModel.findAll();
                console.log(data);


                return data;

            } catch (error: any) {
                console.log(error.message);
                return new GraphQLError(error.message, {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        http: {
                            status: 500
                        }
                    }
                });
            }
        },


        // user
        user: async (root: undefined, args: undefined, { token }: ContextType) => {
            try {
                console.log(1);
                
                const { user_id } = await TokenHelper.verify(token) as any;
                if (!user_id) return new GraphQLError("Unauthenticated", {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        http: {
                            status: 500
                        }
                    }
                });
                const find = await UserModel.findOne({ where: { user_id }, include:ProductModel });
                console.log(find);
                
                return find

            } catch (error: any) {
                console.log(error.message);
                return new GraphQLError(error.message, {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
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
        // signup
        signup: async (root: undefined, { username, email, password }: UserType) => {
            try {

console.log(username);


                const check_username = await UserModel.findOne({ where: { username } });
                const check_email = await UserModel.findOne({ where: { email } });



                if (check_email?.dataValues || check_username?.dataValues) {

                    // return new GraphQLError(check_email ? "email already exist" : "username already", {
                    //     extensions:{
                    //         code:'INTERNAL_ERROR',
                    //         http:{
                    //             status:409
                    //         }
                    //     }
                    // });
                    return {
                        msg: check_username ? "username already exist" : "email already exist",
                        data: null
                    }
                };



                const hashpass = await crypto.hash(password);

                const newUser = await UserModel.create({
                    username, email, password: hashpass
                }) as any;

                const { user_id, isAdmin }: { user_id: string, isAdmin: boolean } = newUser;
                let token: string | undefined;
                if (user_id) {
                    token = await TokenHelper.sign({ user_id, username, email, isAdmin });
                };


                return {
                    msg: "ok",
                    data: {
                        newUser,
                        token
                    }
                };

            } catch (error: any) {
                console.log(error.message);
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        http: {
                            status: 500
                        }
                    }
                });
            }
        },



        // signin
        signin: async (root: undefined, { username, email, password }: UserType) => {
            try {
                console.log(username);
                
                const find = await UserModel.findOne({ where: { username, email } }) as any;

                if (!find) {
                    // return {
                    //     msg: "user notfound  :("
                    // }
                    return new GraphQLError("notfound", {
                        extensions: {
                            code: 'INTERNAL_ERROR',
                            http: {
                                status: 404
                            }
                        }
                    });
                };

              const check=await crypto.compare(password, find.password)
                    console.log(check);
                    
               if(!check) return new GraphQLError("wrong password", {
                extensions: {
                    code: 'INTERNAL_ERROR',
                    http: {
                        status: 401
                    }
                }
            });
               


                const token = await TokenHelper.sign({ user_id: find.user_id, username, email, isAdmin: find.isAdmin });

                return {
                    msg: "ok",
                    data:{
                        data:find,
                        token
                    }
                }


            } catch (error: any) {
                console.log(error.message);
                return new GraphQLError(error.message, {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        http: {
                            status: 500
                        }
                    }
                });
            }
        },



        // updateuser
        updateuser: async (root: undefined, { username, email, password }: UserType, { token }: ContextType) => {
            try {
                const { user_id }: any = await TokenHelper.verify(token);

                const find = await UserModel.findOne({ where: { user_id } });
                if (!find) {
                    return new GraphQLError("Unauthorized", {
                        extensions: {
                            code: 'INTERNAL_ERROR',
                            http: {
                                status: 401
                            }
                        }
                    });
                };

                const check_username = await UserModel.findOne({ where: { username } });
                const check_email = await UserModel.findOne({ where: { email } });

                if (check_email || check_username) {
                    return new GraphQLError(check_username ? "username already exists" : "email already exists", {
                        extensions: {
                            code: 'INTERNAL_ERROR',
                            http: {
                                status: 409
                            }
                        }
                    });
                };

                const newData = await UserModel.update({ username, email, password }, { where: { user_id } });

                return {
                    msg: "ok",
                    data: newData
                }

            } catch (error: any) {
                console.log(error.message);
                return new GraphQLError(error.message, {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        http: {
                            status: 500
                        }
                    }
                });
            }
        },


        // delete user
        deletuser: async (root: undefined, { user_id }: UserType, { token }: ContextType) => {
            try {
                console.log(1, token);
                
                const { user_id } = TokenHelper.verify(token) as any;
                const find = await UserModel.findOne({ where: { user_id } });
                if (!find) return new GraphQLError("notfound", {
                    extensions: {
                        code: 'INTERNAL_ERROR',
                        http: {
                            status: 404
                        }
                    }
                });
                console.log(2, user_id);
                
                await UserModel.destroy({ where: { user_id } });
                return {
                    msg: "ok",
                    data: find
                }


            } catch (error: any) {
                console.log(error.message);
                return new GraphQLError(error.message, {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        http: {
                            status: 500
                        }
                    }
                });
            }
        }

    }


}