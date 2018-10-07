import * as vscode from "vscode";
import * as jsonUtils from "../utils/json";

function findParameter(document: vscode.TextDocument): Array<number> | undefined {

    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        let index = line.text.search("\"parameters\"[ ]?:[ ]?{");
        if (index !== -1) {
            let result = new Array<number>();
            let closeTag = line.text.indexOf('}')
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

export class ExtractorParameter {
    public async extractorParameter(editor: vscode.TextEditor): Promise<void> {

        var templateJson = JSON.parse(jsonUtils.cleanJsonContent(editor.document.getText()));

        let hasParameter = Object.keys(templateJson.parameters).length > 0;

        await editor.edit(builder => {
            for (let selection of editor.selections) {
                if (selection.isEmpty) {
                    vscode.window.showWarningMessage("Select text to extract parameter");
                    return;
                }
                
                let parameterName = editor.document.getText(selection) + "-param";
                builder.replace(selection, "[parameters('" + parameterName + "')]");

                let findPosition = findParameter(editor.document);
                if (!findPosition) {
                    return;
                }

                let position = new vscode.Position(findPosition[0], findPosition[1]);

                let toInsert = "";
                if (findPosition[1] !== 0) {
                    toInsert += "\r\n";
                }
                toInsert += "\t\t\"" + parameterName + "\": { \r\n\t\t\t\"type\": \"string\", \r\n\t\t\t\"defaultValue\": \"" + editor.document.getText(selection) + "\"\r\n\t\t}";

                if (hasParameter === true) {
                    toInsert += ",\r\n";
                }else {
                    toInsert += "\r\n\t";
                }

                builder.insert(position, toInsert);
                hasParameter = true;
            }
        });
    }
}