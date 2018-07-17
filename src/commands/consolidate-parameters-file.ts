import * as vscode from 'vscode';
import { ConsolidateParameterFile } from "../logics/consolidate-parameters-file-logic";

export function consolidateFiles(): void {
    var consolidator = new ConsolidateParameterFile();

    consolidator.getARMTemplate().then(template => {
        if (template) {
            consolidator.getARMParameters().then(parameters => {
                if (parameters) {
                    consolidator.consolidate(template, parameters).then(async _ => {
                        var textDocument = await vscode.workspace.openTextDocument(parameters.fsPath);
                        vscode.window.showTextDocument(textDocument);
                    });
                }
            }).catch(err => {
                vscode.window.showErrorMessage(err.toString());
            });
        }
    }).catch(err => {
        vscode.window.showErrorMessage(err.toString());
    });
}