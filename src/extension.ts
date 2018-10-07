'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as constants from './constants';
import { generateParameterFile } from './commands/generate-parameters-file';
import { consolidateFiles } from './commands/consolidate-parameters-file';
import { extractParameter } from './commands/extract-parameter';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(constants.commmands.generateParameters, generateParameterFile),
        vscode.commands.registerCommand(constants.commmands.consolidateFiles, consolidateFiles),
        vscode.commands.registerTextEditorCommand(constants.commmands.extractParameter, extractParameter)
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}