import sharp from "sharp";
import { getFilePathByFileName } from "../../src/utils/files";
import { createTransformer } from "../../src/utils/sharp"

describe("src/utils/sharp.ts", () => {
    
    it("createTransformer - Correct Input, transform created", async () => {
        expect.assertions(1);
        const fileName = "dog.webp"
        const filePath = getFilePathByFileName(fileName)
        const transformsOptions = "rotate:angle=50;resize:width=350,height=300"
        const transformer = createTransformer(filePath, transformsOptions)
        expect(transformer).toBeDefined()
    })

    it("createTransformer - switched transform options, throw err", async () => {
        expect.assertions(1);
        const fileName = "dog.webp"
        const filePath = getFilePathByFileName(fileName)
        const transformsOptions = "rotate:width=50;resize:angle=350,height=300"
        try{
            createTransformer(filePath, transformsOptions)
        }
        catch(e){
            expect(e).toBeDefined()
        }
    })

    it("createTransformer - wrong spelling transform option, throw err", async () => {
        expect.assertions(1);
        const fileName = "dog.webp"
        const filePath = getFilePathByFileName(fileName)
        const transformsOptions = "rotate:angle=50;resiza:width=350,height=300"
        try{
            createTransformer(filePath, transformsOptions)
        }
        catch(e){
            expect(e).toBeDefined()
        }
    })

    it("createTransformer - Not exists transform option, throw err", async () => {
        expect.assertions(1);
        const fileName = "dog.webp"
        const filePath = getFilePathByFileName(fileName)
        const transformsOptions = "rotate:angle=50;resize:width=350,height=300;newOption:size=20"
        try{
            createTransformer(filePath, transformsOptions)
        }
        catch(e){
            expect(e).toBeDefined()
        }
    })

    it("createTransformer - No options given in transform, throw err", async () => {
        expect.assertions(1);
        const fileName = "dog.webp"
        const filePath = getFilePathByFileName(fileName)
        const transformsOptions = "rotate:angle=50;resize:"
        try{
            createTransformer(filePath, transformsOptions)
        }
        catch(e){
            expect(e).toBeDefined()
        }
    })

    it("createTransformer - Wrong spelling options name in transform, throw err", async () => {
        expect.assertions(1);
        const fileName = "dog.webp"
        const filePath = getFilePathByFileName(fileName)
        const transformsOptions = "rotate:angle=50;resize:width=350,heighk=300"
        try{
            createTransformer(filePath, transformsOptions)
        }
        catch(e){
            expect(e).toBeDefined()
        }
    })

    it("createTransformer - Unavailable transform option value, throw err", async () => {
        expect.assertions(1);
        const fileName = "dog.webp"
        const filePath = getFilePathByFileName(fileName)
        const transformsOptions = "rotate:angle=50;resize:width=-350,height=300"
        try{
            createTransformer(filePath, transformsOptions)
        }
        catch(e){
            expect(e).toBeDefined()
        }
    })
  
});