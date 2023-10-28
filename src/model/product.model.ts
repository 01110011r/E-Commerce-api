import { DataTypes, Model, UUIDV4 } from "sequelize";
import { newSequelize } from "../config";

export class ProductModel extends Model { };


ProductModel.init(
    {
        product_id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey:true
        },
        product_name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        price:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        measurement:{
            type:DataTypes.STRING,
            allowNull:false
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        img:{
            type:DataTypes.STRING
        }
    },
    {
        sequelize: newSequelize,
        tableName: "products",
        timestamps: true
    }
)