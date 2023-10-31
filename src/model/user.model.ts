import { DataTypes, Model, UUIDV4 } from "sequelize";
import { newSequelize } from "../config";


export class UserModel extends Model{};


UserModel.init(
    {

        user_id:{
            type:DataTypes.UUID,
            defaultValue:UUIDV4,
            primaryKey:true
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        isAdmin:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }

    },{
        sequelize:newSequelize,
        tableName:"users",
        timestamps:true
    }
);