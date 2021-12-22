import {ServerConfiguration} from "../../configuration"
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { kill } from "process";

const filesDic = ServerConfiguration.filesDic;

class TransformsOption {
    public resize?:{
        height: number
        width: number
    }
    public rotate?:{
        angle: number
    }
    
    private addParameter(transformName: string, parameters: {[key: string]: string}){
        const {width, height, angle} = parameters
        if (width){
            let widthFloat = parseFloat(width)
            if (!widthFloat || widthFloat < 0) throw(`The Parameter 'width' should be positive number, given ${widthFloat}`)
            this[transformName].width = widthFloat
        }
        if (height){
            let heightFloat = parseFloat(height)
            if (!heightFloat || heightFloat < 0) throw(`The Parameter 'width' should be positive number, given ${heightFloat}`)
            this[transformName].height = heightFloat
        }
        if (angle){
            let angleFloat = parseFloat(angle)
            if (!angleFloat ) throw(`The Parameter 'angle' should be number, given ${angleFloat}`)
            this[transformName].angle = angleFloat
        }
    }

    public addTransform(transformName: string, parameters: {[key: string]: string}) {
        if (transformName in this && typeof this[transformName] === 'object'){
            this.addParameter(transformName, parameters)
        }
        else{
            throw(`The Transform '${transformName}' isn't available.`);
        }
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

function getAvailableTransforms(){
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


function parseTransformsOption(transformsText: string){
    const transformsInstructions = transformsText.split(";")
    const availableTransform = getAvailableTransforms()
    var transformsInstructionsParsed = new TransformsOption();
    transformsInstructions.forEach(transformInstruction => {
        // For Each Transform Instruction Extract Transform Name & Transform Parameters.
        const transform = transformInstruction.split(':')
        if (transform.length != 2){
            throw(`The Syntax of The Transform '${transformInstruction}' is Wrong.`)
        }
        const transformName = transform[0]
        const transformParametersText = transform[1]

        // Allowing only available Transformers
        if (transformName in availableTransform){
            transformsInstructionsParsed[transformName] = {}
            const transformParameters = transformParametersText.split(',')
            var parametersParsed = {}
            transformParameters.forEach(parameterText =>{
                
                const parameter = parameterText.split('=')

                if (parameter.length != 2){
                    throw(`The Syntax of The Transform Parameter '${parameterText}' is Wrong.`)
                }

                const parameterName = parameter[0]
                const parameterValue = parameter[1]
                // Allowing only available Paramaters.
                if (parameterName in availableTransform[transformName]){
                    parametersParsed[parameterName] = parameterValue
                }
                else{
                    throw(`The Transform Paramater '${parameterName}' isn't available in '${transformName}'`)
                }
            })
            transformsInstructionsParsed.addTransform(transformName, parametersParsed)

        }
        else{
            throw(`The Transform '${transformName}' isn't available.`);
        }
        
    })
    return transformsInstructionsParsed
}

async function customizePicture(picPath: string, transformsOption: TransformsOption){
    const pictureBuffer = await sharp(picPath)
    .resize('resize' in transformsOption ? transformsOption['resize'] : {})
    .rotate('rotate' in transformsOption ? transformsOption['rotate']['angle'] : null)
    .webp()
    .toBuffer();
    return pictureBuffer;
}

export { getFilePathByFileName, parseTransformsOption, customizePicture}