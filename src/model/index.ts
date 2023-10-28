import { newSequelize } from "../config";
import { CategoryModel } from "./category.model";
import { CommentModel } from "./comment.model";
import { ProductModel } from "./product.model";
import { UserModel } from "./user.model";
import { BuyProduct } from "./buyproduct";





UserModel.belongsToMany(ProductModel,{
   through:BuyProduct,
    foreignKey:"user_id"
});

ProductModel.belongsToMany(UserModel,{
    through:BuyProduct,
    foreignKey:"product_id"
});

UserModel.hasMany(CommentModel,{
    foreignKey:"user_id"
});


CategoryModel.hasMany(ProductModel, {
    foreignKey:"category_id"
});


ProductModel.hasMany(CommentModel, {
    foreignKey:"product_id"
});



newSequelize.sync({alter:true});


export {UserModel, CommentModel, ProductModel, CategoryModel, BuyProduct};