import axios from "axios";
import config from "config";

const serverAddress = `${config.get<string>("serverAddress")}:${config.get<string>("serverPort")}`
let headers = {} 

beforeAll(async ()=>{
    const response = await axios.post(`${serverAddress}/graphql`,
        {
            query: `query Login($input: LoginInput!) {
                login(input: $input)
            }`,
            variables: {
                input: { phone: "0525372525", password: "12345"}
            }
        });
    headers['x-token'] = response.data.data.login
})


describe("src/resolvers/picture.resolver.ts", () => {

    describe("GetAllPicture Query", ()=>{
        it('get all pictures, show at least 1 picture', async() => {
            expect.assertions(5)
            try{
                const response = await axios.post(`${serverAddress}/graphql`,
                {
                    query: `query GetPictures{
                                getPictures{
                                    file_name
                                    uploaded_by{
                                        name
                                        phone
                                    }
                                }
                    }`
                },
                { headers });
                expect(response.data.data["getPictures"]).toBeDefined();
                expect(response.data.data["getPictures"].length).toBeGreaterThan(0);
                expect(response.data.data["getPictures"][0].uploaded_by).toBeDefined();
                expect(response.data.data["getPictures"][0].uploaded_by.name).toBeDefined();
                expect(response.data.data["getPictures"][0].uploaded_by.phone).toBeDefined();
    
            }
            catch(e){
                console.log(e)
            }
        })
    
        it('get all pictures, unauthorized, error message', async() => {
            expect.assertions(2)
            try{
                const response = await axios.post(`${serverAddress}/graphql`,
                {
                    query: `query GetPictures{
                                getPictures{
                                    file_name
                                    uploaded_by{
                                        name
                                        phone
                                    }
                                }
                    }`
                });
                expect(response.data.data).toBe(null);
                expect(response.data.errors).toBeDefined();
            }
            catch(e){
                console.log(e)
            }
        })
    })

    describe("DeletePicture Mutation", ()=>{
        it('delete test1.jpeg, message sent test1.jpeg is not exists', async() => {
            expect.assertions(1)
            try{
                const response = await axios.post(`${serverAddress}/graphql`,
                {
                    query: `mutation DeletePicture($input: String!){
                        deletePicture(file_name: $input)
                    }`,
                    variables: {
                        input: "test1.jpeg"
                    }
                },
                { headers });
                expect(response.data['data']['deletePicture']).toBe("File Doesn't Exists.")
            }
            catch(e){
                console.log(e)
            }
        })
    })
    
});