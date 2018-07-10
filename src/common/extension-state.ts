import * as vscode from "vscode";

export class ExtensionState {
    private static _context: vscode.ExtensionContext;

    static get global(): vscode.Memento {
        return this._context.globalState;
    }

    static get workspace(): vscode.Memento {
        return this._context.workspaceState;
    }

    static configure(context: vscode.ExtensionContext): void {
        this._context = context;
    }
}
