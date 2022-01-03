import axios from "axios";
import config from "config";

const serverAddress = `${config.get<string>("serverAddress")}:${config.get<string>("serverPort")}`
let axiosConfig = { headers: {}}

describe("src/routes/view.ts", () => {

    beforeAll(async () =>{
        const bodyLogin = {phone: "0525372525", password: "12345"} 
        const token = await axios.post(`${serverAddress}/users/login`, bodyLogin)
        axiosConfig.headers['x-token'] = token.data
    })

    describe("View End Point", () =>{
        it("View - available file, return status 200.", async () => {
            expect.assertions(1);       
            const fileName = "dog.webp"
            const response = await axios.get(`${serverAddress}/view/${fileName}`,axiosConfig)
            expect(response.status).toBe(200);
        })
    
        it("View - available file without Authorization, return status 403.", async () => {
            expect.assertions(1);
            try{       
            const fileName = "dog.webp"
            await axios.get(`${serverAddress}/view/${fileName}`)
            }
            catch(e){
                expect(e.response.status).toBe(403);
            }
            
        })
    
        it("View - unavailable file, return status 404.", async () => {
            expect.assertions(1);  
            try{     
            const fileName = "dogy.webp"
            await axios.get(`${serverAddress}/view/${fileName}`,axiosConfig)
            }
            catch(e){
                expect(e.response.status).toBe(404);
            }
        })
    })
    
    describe("View With Transforms End Point", ()=>{
        it("View -  available file & available options, return status 200.", async () => {
            expect.assertions(1);  
            const fileName = "dog.webp"
            const transformsOptions = "rotate:angle=50;resize:width=350,height=300"
            const response = await axios.get(`${serverAddress}/view/${transformsOptions}/${fileName}`,axiosConfig)
            expect(response.status).toBe(200)
        })
    
        it("View -  available file & unavailable options, return status 400.", async () => {
            expect.assertions(1);  
            try{
                const fileName = "dog.webp"
                const transformsOptions = "rotate:angle=50;resiza:width=350,height=300"
                await axios.get(`${serverAddress}/view/${transformsOptions}/${fileName}`,axiosConfig);
            }
            catch(e){
                expect(e.response.status).toBe(400)
            }
        })

        it("View -  available file & unavailable option value, return status 400.", async () => {
            expect.assertions(1);  
            try{
                const fileName = "dog.webp"
                const transformsOptions = "rotate:angle=50;resize:width=-350,height=300"
                await axios.get(`${serverAddress}/view/${transformsOptions}/${fileName}`,axiosConfig);
            }
            catch(e){
                expect(e.response.status).toBe(400)
            }
        })
    })
    

    
    
});