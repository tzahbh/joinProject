import {ServerConfiguration} from "../../configuration"
import sharp, { Sharp } from "sharp";
import path from "path";

const filesDic = ServerConfiguration.filesDic;

class Transformer {

    // Fields
    public resize: (resizeParams: {[key: string]: string}) => void;
    public rotate: (rotateParams: {[key: string]: string}) => void;

    private sharpStream: Sharp;
    
    // Constructor
    constructor(filePath: string){
        this.sharpStream = sharp(filePath);
        this.resize = this.handleResize
        this.rotate = this.handleRotate
    }

    // Methods

    // Resize Handle - Start.
    private handleResize = (resizeParams: {[key: string]: string}) =>{
        const resizeOptions = {}
        const {width, height} = resizeParams
        if (width) 
            resizeOptions['width'] = this.handleResizeNumbers(<string> width, 'width')
        
        if (height) 
            resizeOptions['height'] = this.handleResizeNumbers(<string> height, 'height')
        
        this.sharpStream.resize(resizeOptions)
    }
        //      Resize Parameters Handle - Start.
    private handleResizeNumbers = (param: string, name: string) => {
        const paramFloat = <number> parseFloat(param)
        if (!paramFloat || paramFloat < 0) throw(`The Parameter '${name}' should be positive number, given ${param}`)
        return paramFloat
    }
        //      Resize Parameter Handle - End.
    // Resize Handle - End.

    // Rotate Handle - Start.
    private handleRotate = (rotateParams: {[key: string]: string}) => {
        const { angle } = rotateParams
        if (angle){
            const angleHandled = this.handleRotateAngle(angle)
            this.sharpStream.rotate(angleHandled)
        }
    }
        //      Rotate Parameter Handle - Start.
    private handleRotateAngle = (angle: string) => {
        let angleFloat = parseFloat(angle)
        if (!angleFloat ) throw(`The Parameter 'angle' should be number, given ${angleFloat}`)
        return angleFloat
    }
        //      Rotate Parameter Handle - End.
    // Rotate Handle - End

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
        return null;
    }
    const filePath = path.resolve(`${filesDic}/${fileName}`)
    return filePath;
}

function getTransformDescriber(){
    return ({
        resize:{
            height: 'number',
            width: 'number',
        },
        rotate:{
            angle: 0
        }
    })
}

function parseTransformInstruction(transformsInstructionText: string){
    const transformsInstructionsList = transformsInstructionText.split(";");
    const availableTransform = getTransformDescriber();

    const transformsInstructionParsed = {}

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

function createTransformer(filePath: string, transformsInstructionText?: string){
    var transformer = new Transformer(filePath);
    
    if (transformsInstructionText) {
        const transformsInstructionParsed: Object = parseTransformInstruction(transformsInstructionText);
        
        Object.keys(transformsInstructionParsed).map((transformName)=>
            transformer[transformName](transformsInstructionParsed[transformName]))
    }

    return transformer
}


export { getFilePathByFileName, createTransformer, Transformer}
