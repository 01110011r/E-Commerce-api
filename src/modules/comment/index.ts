import resolvers from "./resolvers";
import fs from "fs";
import path from "path";

const td=fs.readFileSync(path.join(process.cwd(), "src", "modules", "comment", "schema.gql"), "utf-8");

export default{resolvers, td};