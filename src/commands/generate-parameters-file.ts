import * as vscode from "vscode";
import { GenerateParameterFile } from "../logics/generate-parameters-file-logic";

export function generateParameterFile(editor: vscode.TextEditor, edit: vscode.TextEditorEdit): void {
    
    var generator = new GenerateParameterFile();
    var isValid = generator.isValidDocument(editor.document.getText());

    if (!isValid) {
        vscode.window.showErrorMessage("This document " + editor.document.fileName + " is not an ARM Template");
    }
    else {
        generator.createParameterFile(editor.document.fileName);
    }
    
};