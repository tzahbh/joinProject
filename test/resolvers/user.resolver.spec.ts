import axios from "axios";
import config from "config";

const serverAddress = `${config.get<string>("serverAddress")}:${config.get<string>("serverPort")}`

describe("src/resolvers/user.resolver.ts", () => {

    describe('Login', () => {
        it('correct user & password, returns token', async() => {
            expect.assertions(2)
            const response = await axios.post(`${serverAddress}/graphql`,
            {
                query: `query Login($input: LoginInput!) {
                    login(input: $input)
                }`,
                variables: {
                    input: { phone: "0525372525", password: "12345"}
                }
            });
            expect(response.data.data.login).toBeDefined()
            expect(response.data.errors).toBeUndefined()
        })        
    })

    it('wrong username, error message', async() => {
        expect.assertions(2)
        try{
            const response = await axios.post(`${serverAddress}/graphql`,
            {
                query: `query Login($input: LoginInput!) {
                    login(input: $input)
                }`,
                variables: {
                    input: { phone: "0525372526", password: "12345"}
                }
            });
            expect(response.data.data).toBe(null)
            expect(response.data.errors).toBeDefined()
        }
        catch(e){
            console.log(e)
        }
    })
    
    it('wrong password, error message', async() => {
        expect.assertions(2)
        try{
            const response = await axios.post(`${serverAddress}/graphql`,
            {
                query: `query Login($input: LoginInput!) {
                    login(input: $input)
                }`,
                variables: {
                    input: { phone: "0525372525", password: "123456"}
                }
            });
            expect(response.data.data).toBe(null)
            expect(response.data.errors).toBeDefined()
        }
        catch(e){
            console.log(e)
        }
    })
});