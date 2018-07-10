'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as constants from './constants';
import { ExtensionState } from "./common/extension-state";
import { generateParameterFile } from './commands/generate-parameters-file';

export function activate(context: vscode.ExtensionContext) {
    ExtensionState.configure(context);

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand(constants.commmands.generateParameters, generateParameterFile)
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}