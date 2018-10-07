import * as vscode from "vscode";
import * as jsonUtils from "../utils/json";

export class ExtractorParameter {
    
    public async extractorParameter(editor: vscode.TextEditor): Promise<void> {
        
        var templateJson = JSON.parse(jsonUtils.cleanJsonContent(editor.document.getText())); 

        let hasParameter = Object.keys(templateJson.parameters).length > 0; 

        await editor.edit(builder => {
            for (let selection of editor.selections){
                let parameterName = editor.document.getText(selection) + "-param";
                builder.replace(selection, "[parameters('"+ parameterName + "')]");
                
                let position = new vscode.Position(3, 19);
                let toInsert = "\r\n\t\t\"" + parameterName + "\": { \r\n\t\t\t\"type\": \"string\", \r\n\t\t\t\"defaultValue\": \""+ editor.document.getText(selection) + "\"\r\n\t\t}";
                if (hasParameter === true) {
                    toInsert += ",";
                }
                builder.insert(position, toInsert);
                hasParameter = true;
            }
        });
    }
}