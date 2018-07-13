import * as path from "path";
import * as fileUtils from "../utils/file";
import { ExceptionInfo } from "_debugger";

export class GenerateParameterFile {

    public cleanJsonContent(text: string):string {
        text = text.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
            // remove non-printable and other non-valid JSON chars
        text = text.replace(/[\u0000-\u0019]+/g,""); 
        text = text.trim();

        return text;
    }

    public isValidDocument(text: string):boolean {
        try {
            var content = JSON.parse(this.cleanJsonContent(text));
            return content.$schema === "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#"; 
        }
        catch (error) {
            console.error(error);
            return false; 
        }
    }


    public async generateContentFile(text: string): Promise<string> {
        var content = JSON.parse(this.cleanJsonContent(text));

        var result: {[k:string]: any} = {};
        result.$schema = "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#";
        result.contentVersion= "1.0.0.0";
    
        var parameters: {[k:string]: any} = {};
        
        for (var key in content.parameters) {
            if (key) 
            {
                if (content.parameters[key].hasOwnProperty('defaultValue')) {
                    parameters[key] = { value:content.parameters[key].defaultValue };
                }
                else {
                    parameters[key] = { value:"## TO BE DEFINED ##" };
                }
            }
        }

        result.parameters = parameters;
        var json = JSON.stringify(result, undefined, 4);
        return json;
    }

    public async createParameterFile(filePath: string, content: string): Promise<string> {
        const dirName = path.dirname(filePath); 
        const fileName = path.basename(filePath, ".json");
        const extension = '.parameters.json';
    
        var newFilePath = path.join(dirName, fileName + extension); 
        var isExists = await fileUtils.exits(newFilePath);
    
        var i = 1; 
        while (isExists) {
            newFilePath = path.join(dirName, fileName + "." + i + extension); 
            isExists = await fileUtils.exits(newFilePath);
            i += 1;
        }
    
        await fileUtils.write(newFilePath, content); 
        
        return newFilePath;
    }
}