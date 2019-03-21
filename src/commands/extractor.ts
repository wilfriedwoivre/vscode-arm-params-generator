import * as vscode from "vscode";
import * as json from "./../utils/json";
import { Extractor } from "../logics/extract-logic";

export function extractor(editor: vscode.TextEditor): void {
    var isValid = json.isValidARMFile(editor.document.getText());
    var extractor = new Extractor();

    if (isValid !== true) {
        var message = isValid.message; 
        if (message === undefined) {
            message = "Schema is not valid";
        }
        vscode.window.showErrorMessage("This document is not an ARM Template. JSON Error : " + message);
    }
    else {
        extractor.extractor(editor);
    }
    
}
