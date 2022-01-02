import dotenv from "dotenv"
dotenv.config();
import UserService from "../../src/services/user.service"
import {MongoDB} from "../../src/utils/mongo";
MongoDB.initConnection()

describe("src/services/user.service.ts", () => {

    it("Login - Token given", async () => {
        expect.assertions(1);
        try{
            const LoginInput = {phone: "0525372525", password: "12345"}
            const data = await UserService.login(LoginInput)
            expect(data).toBeDefined();
        }
        catch(e){}
    })
   
    it("Login - Error Throw", async () => {
        expect.assertions(1);
        try{
            const LoginInput = {phone: "0525372524", password: "12345"}
            await UserService.login(LoginInput)
        }
        catch(e){
            expect(e).toBeDefined();
        }
    })
    it("Login - Error Throw", async () => {
        expect.assertions(1);
        try{
            const LoginInput = {phone: "0525372525", password: "123456"}
            await UserService.login(LoginInput)
        }
        catch(e){
            expect(e).toBeDefined();
        }
    })
    
});