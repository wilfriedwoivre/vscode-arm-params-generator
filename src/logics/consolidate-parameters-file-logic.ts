import * as vscode from 'vscode'; 
import * as fs from 'fs';
import * as fileUtils from '../utils/file';
import * as jsonUtils from '../utils/json';
import * as constants  from "../constants";
import { default as stripJson } from "strip-json-comments";


export class ConsolidateParameterFile {
    public async getJsonFiles() : Promise<vscode.Uri[]> {
        const pattern = "**/*.json"; 
        var files = await vscode.workspace.findFiles(pattern);
        return files; 
    }

    public async getARMFile(message:string, schema: string[]): Promise<vscode.Uri | undefined> {
        var jsonFiles = await this.getJsonFiles(); 
        
        if (jsonFiles.length === 0) {
            throw new Error('No JSON files found');
        }

        var relativePaths: string[] = []; 

        for (var f = 0; f < jsonFiles.length; f++) {
            relativePaths.push(vscode.workspace.asRelativePath(jsonFiles[f]));
        }
               
        var result = await vscode.window.showQuickPick(relativePaths, { placeHolder: message });
        
        if (result) {
            var templateFile = await vscode.workspace.findFiles(result);
            if (templateFile.length === 1) {
                var file = templateFile[0];
                var filePath = (<vscode.Uri>file).fsPath; 
                var text = fs.readFileSync(filePath, 'utf-8');
                var content = JSON.parse(stripJson(jsonUtils.cleanJsonContext(text)));
                
                if (schema.indexOf(content.$schema) > -1) {
                    return file;
                }
            }
        }

        return undefined;
    }

    public async getARMTemplate(): Promise<vscode.Uri | undefined> {
        var schemas = [constants.schema.armSchema2015, constants.schema.armSchema2019];
        
        var file = await this.getARMFile("Select ARM Template file", schemas);
        
        if (file) {
            return file;
        }
        
        throw new Error("Invalid ARM Template file"); 
    }

    public async getARMParameters(): Promise<vscode.Uri | undefined> {
        var schemas = [constants.schema.armParameterSchema2015, constants.schema.armParameterSchema2019];

        var file = await this.getARMFile("Select ARM parameters file", schemas);
        
        if (file) {
            return file;
        }
        
        throw new Error("Invalid ARM parameters file"); 
    }

    public async consolidate(template: vscode.Uri, parameters: vscode.Uri): Promise<void> {
        var templateContent = fs.readFileSync(template.fsPath, 'utf-8'); 
        var parameterContent = fs.readFileSync(parameters.fsPath, 'utf-8'); 

        var templateJson = JSON.parse(stripJson(jsonUtils.cleanJsonContext(templateContent))); 
        var parametersJson = JSON.parse(stripJson(jsonUtils.cleanJsonContext(parameterContent))); 

        var configuration =  vscode.workspace.getConfiguration(constants.config.projectName); 
        var ignoreDefaultParameters = configuration.get<boolean>(constants.config.ignoreDefaultParameters);

        // Add key if not exists
        for (var templateKey in templateJson.parameters) {
            if (templateKey) {
                var isExists = false; 
                for (var parameterKey in parametersJson.parameters) {
                    if (parameterKey) {
                        if (templateKey === parameterKey) {
                            isExists = true;
                        }
                    }
                }

                if (!isExists) {
                    if (templateJson.parameters[templateKey].hasOwnProperty('defaultValue')) {
                        if (!ignoreDefaultParameters) {
                            parametersJson.parameters[templateKey] = { value:templateJson.parameters[templateKey].defaultValue };
                        }
                    }
                    else {
                        parametersJson.parameters[templateKey] = { value:"## TO BE DEFINED ##" };
                    }
                }
            }
        }

        var json = JSON.stringify(parametersJson, undefined, 4);

        fileUtils.write(parameters.fsPath, json); 
    }
}