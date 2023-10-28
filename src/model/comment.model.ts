import { DataTypes, Model } from "sequelize";
import { newSequelize } from "../config";

export class CommentModel extends Model { };


CommentModel.init(
    {
        comment_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey:true
        },
 
        title:{
            type:DataTypes.STRING,
            allowNull:false
        }

    },
    {
        sequelize: newSequelize,
        tableName: "comments",
        timestamps: true
    }
);