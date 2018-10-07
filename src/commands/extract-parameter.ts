import * as vscode from "vscode";
import * as json from "./../utils/json";
import { ExtractorParameter } from "../logics/extract-parameter-logic";

export function extractParameter(editor: vscode.TextEditor): void {
    var isValid = json.isValidARMFile(editor.document.getText());
    var extractor = new ExtractorParameter();

    if (!isValid) {
        vscode.window.showErrorMessage("This document is not an ARM Template");
    }
    else {
        extractor.extractorParameter(editor);
    }
    
}
