import * as vscode from "vscode";
import * as path from "path";
import * as fileUtils from "../utils/file";
import * as constants  from "../constants";
import * as jsonUtils from "../utils/json";
import { default as stripJson } from "strip-json-comments";

export class GenerateParameterFile {
    public async generateContentFile(text: string): Promise<string> {
        var configuration =  vscode.workspace.getConfiguration(constants.config.projectName); 
        var useNewerVersion = configuration.get<boolean>(constants.config.useNewerVersion);

        var schema = "";
        if (useNewerVersion) {
            schema = constants.schema.armParameterSchema2019;
        }
        else {
            schema = constants.schema.armParameterSchema2015; 
        }

        var content = JSON.parse(stripJson(jsonUtils.cleanJsonContext(text)));

        var result: {[k:string]: any} = {};
        result.$schema = schema;
        result.contentVersion= "1.0.0.0";
    
        var parameters: {[k:string]: any} = {};
        
        for (var key in content.parameters) {
            if (key) 
            {
                if (content.parameters[key].hasOwnProperty('defaultValue')) {
                    var ignoreDefaultParameters = configuration.get<boolean>(constants.config.ignoreDefaultParameters); 
                    if (!ignoreDefaultParameters) {
                        parameters[key] = { value:content.parameters[key].defaultValue };
                    }
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
        var isExists = await fileUtils.exists(newFilePath);
    
        var i = 1; 
        while (isExists) {
            newFilePath = path.join(dirName, fileName + "." + i + extension); 
            isExists = await fileUtils.exists(newFilePath);
            i += 1;
        }
    
        await fileUtils.write(newFilePath, content); 
        
        return newFilePath;
    }
}