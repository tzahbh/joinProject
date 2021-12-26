import mongoose from "mongoose";
import config from "config";


abstract class MongoDB {
  public static async initConnection(){
  try{
    const user = config.get<string>("mongoUser");
    const password = config.get<string>("mongoPassword");
    const address = config.get<string>("mongoAddress");
    const port = config.get<string>("mongoPort");
    await mongoose.connect(`mongodb://${user}:${password}@${address}:${port}/?authSource=admin`);
  } catch(err){
    console.log(err);
    process.exit(1);
  }
  } 
}



export { MongoDB };