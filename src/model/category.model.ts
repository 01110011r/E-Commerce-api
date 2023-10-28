import { DataTypes, Model } from "sequelize";
import { newSequelize } from "../config";



export class CategoryModel extends Model{};


CategoryModel.init(
    {
category_id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
},
category_name:{
    type:DataTypes.STRING,
    allowNull:false
}
    },
    {
        sequelize:newSequelize,
        tableName:"categories",
        timestamps:true
    }
)