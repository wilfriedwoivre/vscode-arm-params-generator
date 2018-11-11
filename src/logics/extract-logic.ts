import * as vscode from "vscode";
import * as jsonUtils from "../utils/json";
import * as stripJson from "strip-json-comments";

function findPosition(document: vscode.TextDocument, search: string): Array<number> | undefined {

    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        let index = line.text.search("\"" + search + "\"[ ]?:[ ]?{");
        if (index !== -1) {
            let result = new Array<number>();
            let closeTag = line.text.indexOf('}');
            if (closeTag !== -1) {
                result.push(i);
                result.push(closeTag);
            } else {
                result.push(i + 1);
                result.push(0);
            }

            return result;
        }
    }

    return undefined;
}

export class Extractor {
    public async extractor(editor: vscode.TextEditor): Promise<void> {

        var templateJson = JSON.parse(stripJson(jsonUtils.cleanJsonContent(editor.document.getText())));

        let hasParameter = Object.keys(templateJson.parameters).length > 0;
        let hasVariables = Object.keys(templateJson.variables).length > 0;

        for (let selection of editor.selections) {
            if (selection.isEmpty) {
                vscode.window.showWarningMessage("Select text to extract parameter");
                return;
            }
        }

        var choices: string[] = [];
        choices.push("Parameters");
        choices.push("Variables");
        let choice = await vscode.window.showQuickPick(choices, { placeHolder: "Extract to parameters or variables ?" });

        var placeHolderMessage = "";
        var item = "";
        var hasItem: boolean; 
        if (choice === "Parameters") {
            placeHolderMessage = "Set your parameter name";
            item = "parameters";
            hasItem = hasParameter;
        }
        else {
            if (choice === "Variables") {
                placeHolderMessage = "Set your variable name";
                item = "variables";
                hasItem = hasVariables;
            }
            else {
                vscode.window.showErrorMessage("No type selected");
            }
        }

        let selectionIndex = 0;
        vscode.window.showInputBox({
            placeHolder: placeHolderMessage
        }).then(async name => {
            for (let selection of editor.selections) {

                await editor.edit(builder => {
                    if (name) {
                        builder.replace(selection, "[" + item + "('" + name + "')]");


                        let positionIndex = findPosition(editor.document, item);
                        if (!positionIndex) {
                            return;
                        }

                        selectionIndex++;

                        if (selectionIndex === editor.selections.length) {
                            let position = new vscode.Position(positionIndex[0], positionIndex[1]);

                            let toInsert = "";
                            if (positionIndex[1] !== 0) {
                                toInsert += "\r\n";
                            }
                            if (item === "parameters") {
                                toInsert += "\t\t\"" + name + "\": { \r\n\t\t\t\"type\": \"string\", \r\n\t\t\t\"defaultValue\": \"" + editor.document.getText(selection) + "\"\r\n\t\t}";
                            } else {
                                toInsert += "\t\t\"" + name + "\": \"" + editor.document.getText(selection) + "\"";
                            }


                            if (hasItem === true) {
                                toInsert += ",\r\n";
                            } else {
                                toInsert += "\r\n\t";
                            }

                            builder.insert(position, toInsert);
                            hasItem = true;
                        }
                    }
                    else {
                        vscode.window.showErrorMessage("No " + choice + " name set");
                    }
                });
            }
        });

    }
}