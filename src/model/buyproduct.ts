import { DataTypes, Model, UUIDV4 } from "sequelize";
import { newSequelize } from "../config";


export class BuyProduct extends Model{};


BuyProduct.init(
    {

        buy_id:{
            type:DataTypes.UUID,
            defaultValue:UUIDV4,
            primaryKey:true
        },
        user_id:{
            type:DataTypes.UUID
        },
        product_id:{
            type:DataTypes.UUID
        },
        buyproduct_user_id_fkey:{
            type:DataTypes.UUID
        }
    },
    {
        sequelize:newSequelize,
        tableName:"buyproduct",
        timestamps:true
    }
);