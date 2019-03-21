import * as vscode from "vscode";
import * as fs from "fs";
import { GenerateParameterFile } from "../logics/generate-parameters-file-logic";
import * as json from "./../utils/json";

export function generateParameterFile(uri: vscode.TextDocument | vscode.Uri): void {
    
    var text = ""; 
    var filePath = ""; 
    if (!uri || !(<vscode.Uri>uri).fsPath) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        text = editor.document.getText(); 
        filePath = editor.document.fileName; 
    } else {
        filePath = (<vscode.Uri>uri).fsPath; 
        text = fs.readFileSync(filePath, 'utf-8');
    }

    var generator = new GenerateParameterFile();
    var isValid = json.isValidARMFile(text);

    if (isValid !== true) {
        vscode.window.showErrorMessage("This document " + filePath + " is not an ARM Template. JSON Error : " + isValid.message);
    }
    else {
        generator.generateContentFile(text).then(content => {
            generator.createParameterFile(filePath, content).then(async fileName => 
                {
                    var textDocument = await vscode.workspace.openTextDocument(fileName);
                    vscode.window.showTextDocument(textDocument);
                });
        });
        
    }
    
}
