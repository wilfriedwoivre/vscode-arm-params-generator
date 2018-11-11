import * as vscode from "vscode";
import * as json from "./../utils/json";
import { Extractor } from "../logics/extract-logic";

export function extractor(editor: vscode.TextEditor): void {
    var isValid = json.isValidARMFile(editor.document.getText());
    var extractor = new Extractor();

    if (!isValid) {
        vscode.window.showErrorMessage("This document is not an ARM Template");
    }
    else {
        extractor.extractor(editor);
    }
    
}
