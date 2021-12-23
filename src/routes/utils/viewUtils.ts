import {ServerConfiguration} from "../../configuration"
import sharp, { Sharp } from "sharp";
import path from "path";

const filesDic = ServerConfiguration.filesDic;

class Transformer {

    // Fields
    public resize:{
        height: (height: string) => void;
        width: (width: string) => void;
    }
    public rotate:{
        angle: (angle: string) => void;
    }

    private sharpStream: Sharp;
    
    // Constructor
    constructor(filePath: string){
        this.sharpStream = sharp(filePath);

        this.resize = {
            height: this.handleResizeHeight,
            width: this.handleResizeWidth
        }
        this.rotate = {
            angle: this.handleRotateAngle
        }
    }

    // Methods
    private handleResizeHeight = (height: string) => {
        console.log(height)
        let heightFloat = <number> parseFloat(height)
        if (!heightFloat || heightFloat < 0) throw(`The Parameter 'width' should be positive number, given ${heightFloat}`)
        this.sharpStream.resize({height: heightFloat})
    }
    
    
    private handleResizeWidth = (width: string) => {
        let widthFloat = <number> parseFloat(width)
        if (!widthFloat || widthFloat < 0) throw(`The Parameter 'width' should be positive number, given ${widthFloat}`)
        this.sharpStream.resize({width: widthFloat})
    }

    private handleRotateAngle = (angle: string) => {
        console.log(this.sharpStream)
        let angleFloat = parseFloat(angle)
        if (!angleFloat ) throw(`The Parameter 'angle' should be number, given ${angleFloat}`)
        this.sharpStream.rotate(angleFloat)
    }


    public async getBuffer(){
        return(
            await this.sharpStream
            .webp()
            .toBuffer()
        );
    }
}


function getFilePathByFileName(fileName: string){
    if (fileName.includes('/') || fileName.includes("\\")){
        console.log("\\")
        console.log(fileName)
        return null;
    }
    const filePath = path.resolve(`${filesDic}/${fileName}`)
    return filePath;
}

function getTransformDescriber(){
    return ({
        resize:{
            height: 200,
            width: 200,
        },
        rotate:{
            angle: 0
        }
    })
}

function parseTransformInstruction(transformsInstructionText: string){
    const transformsInstructionsList = transformsInstructionText.split(";");
    const availableTransform = getTransformDescriber();

    var transformsInstructionParsed = {}

    transformsInstructionsList.forEach(transformInstruction => {
        // For Each Transform Instruction Extract Transform Name & Transform Parameters.
        const transform = transformInstruction.split(':')
        if (transform.length != 2){
            throw(`The Syntax of The Transform '${transformInstruction}' is Wrong.`)
        }
        const transformName = transform[0]
        const transformParametersText = transform[1]

        // Allowing only available Transformers
        if (transformName in availableTransform){
            transformsInstructionParsed[transformName] = {}
            const transformParameters = transformParametersText.split(',')
            transformParameters.forEach(parameterText =>{
                
                const parameter = parameterText.split('=')

                if (parameter.length != 2){
                    throw(`The Syntax of The Transform Parameter '${parameterText}' is Wrong.`)
                }

                const parameterName = parameter[0]
                const parameterValue = parameter[1]

                // Allowing only available Paramaters.
                if (parameterName in availableTransform[transformName]){
                    transformsInstructionParsed[transformName][parameterName] = parameterValue
                }
                else{
                    throw(`The Transform Paramater '${parameterName}' isn't available in '${transformName}'`)
                }
            })
        }
        else{
            throw(`The Transform '${transformName}' isn't available.`);
        }
    })
    return transformsInstructionParsed
}

function createTransformer(transformsInstructionText: string, filePath: string){
    var transformer = new Transformer(filePath);
    const transformsInstructionParsed: Object = parseTransformInstruction(transformsInstructionText);
    
    for (const transformName in transformsInstructionParsed) {
        for ( const parameterName in transformsInstructionParsed[transformName]) {

            const parameterValue = transformsInstructionParsed[transformName][parameterName]
            transformer[transformName][parameterName](parameterValue)
        }
    }
    
    return transformer
}


export { getFilePathByFileName, createTransformer, Transformer}
