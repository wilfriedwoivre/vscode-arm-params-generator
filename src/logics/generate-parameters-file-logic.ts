import * as path from "path";
import * as fs from "fs";
import * as fileUtils from "../utils/file";

export class GenerateParameterFile {
    public isValidDocument(text: string):boolean {
        try {
            var content = JSON.parse(text);
            return content.$schema == "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#"; 
        }
        catch {
            return false; 
        }
    }

    public async createParameterFile(filePath: string): Promise<string> {
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
    
        await fileUtils.write(newFilePath, "Hello"); 
        
        return newFilePath;
    }
}