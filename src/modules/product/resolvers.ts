import { GraphQLError } from "graphql";
import { ContextType, ProductType } from "../../types";
import { CategoryModel, ProductModel } from "../../model";
import { GraphQLUpload } from "graphql-upload-ts";
import TokenHelper from "../../lib/TokenHelper";
import { createWriteStream } from "fs";
import { resolve } from "path";
import unlinkFile from "../../lib/unlinkFile";

export default {
    Query: {
        // product
        product: async (root: undefined, { product_id }: ProductType) => {
            try {
                console.log(product_id);

                const find = await ProductModel.findOne({ where: { product_id } });
                if (!find) return new GraphQLError("notfound", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 404
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
                });
            };
        },


        // products
        products: async () => {
            try {
                const find = await ProductModel.findAll();
                console.log(find);

                if (!find) return new GraphQLError("notfound", {
                    extensions: {
                        code: "INTERNAL_ERROR",
                        http: {
                            status: 404
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
                });
            }
        }

    },



    // mutation
    Mutation: {

        // addproduct
        addproduct: async (_: undefined, { product_name, price, measurement, quantity, category_id, file }: ProductType, { token }: ContextType) => {
            try {
                console.log(1,file);
                console.log(2, product_name, price, measurement, quantity, category_id);
                console.log(token);
                


                let { filename, createReadStream } = await file;
                filename = Date.now() + filename.replace(/\s/g, "");
                const stream = createReadStream();
                const out = createWriteStream(resolve("uploads", filename));
                stream.pipe(out);

                

                const { isAdmin } = TokenHelper.verify(token) as any;

                if (!isAdmin) {
                    unlinkFile(filename);

                    return new GraphQLError("Forbidden", {
                        extensions: {
                            code: "INTERNAL_ERROR",
                            http: {
                                status: 403
                            }
                        }
                    });
                };

                const id = await CategoryModel.findOne({ where: { category_name: "all" } }) as any;
                if (category_id?.trim()) {
                    const check = await CategoryModel.findOne({ where: { category_id } });
                    if (!check) {
                        category_id = id?.category_id;
                    }
                } else {
                    category_id = id?.category_id;
                };


                const find = await ProductModel.findOne({ where: { product_name } }) as any;
                if (find) {
                    find.price = price;
                    find.quantity += quantity;

                    unlinkFile(filename);
                    find.save();
                    return {
                        msg: "ok",
                        data: find
                    }
                };
                const newData = await ProductModel.create({ product_name, price, measurement, quantity, category_id, img: filename });
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



        // edit product
        editproduct: async (_: undefined, { product_id, product_name, price, measurement, quantity, category_id, file }: ProductType, { token }: ContextType) => {
            try {
                console.log(file);



                let { filename, createReadStream } = await file;
                filename = Date.now() + filename.replace(/\s/g, "");
                const stream = createReadStream();
                const out = createWriteStream(resolve("uploads", filename));
                stream.pipe(out);


                const { isAdmin } = TokenHelper.verify(token) as any;

                if (!isAdmin) {
                    unlinkFile(filename);

                    return new GraphQLError("Forbidden", {
                        extensions: {
                            code: "INTERNAL_ERROR",
                            http: {
                                status: 403
                            }
                        }
                    });
                }


                const find = await ProductModel.findOne({ where: { product_id } }) as any;
                if (!find) {
                    unlinkFile(filename);

                    return new GraphQLError("Notfound", {
                        extensions: {
                            code: "INTERNAL_ERROR",
                            http: {
                                status: 404
                            }
                        }
                    });
                };
                const newData = await ProductModel.update({ product_name, price, measurement, quantity, category_id, img: filename }, { where: { product_id } });
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


        // delet product
        deletproduct: async (_: undefined, { product_id }: ProductType, { token }: ContextType) => {
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



                const find = await ProductModel.findOne({ where: { product_id } }) as any;
                if (!find) {
                    return new GraphQLError("Notfound", {
                        extensions: {
                            code: "INTERNAL_ERROR",
                            http: {
                                status: 404
                            }
                        }
                    });
                };


                if (find.img) {
                    console.log("in 'if'");

                    //  unlinkSync("uploads/"+find.img);
                    unlinkFile(find.img);
                    console.log(find.img);

                };

                await ProductModel.destroy({ where: { product_id } });
                return {
                    msg: "ok",
                    data: find
                };

            } catch (error: any) {
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


    Upload: GraphQLUpload

}