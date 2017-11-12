'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Indenter from 'smart-column-indenter/src/Indenter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    const disposables: vscode.Disposable[] = [];

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "smart-column-indenter" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    disposables.push(vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    }));

    disposables.push(vscode.commands.registerTextEditorCommand("extension.smartColumnIndenter.indent2", indent2));
    disposables.push(vscode.commands.registerTextEditorCommand("extension.smartColumnIndenter.indentN", indentN));
    disposables.push(vscode.commands.registerTextEditorCommand("extension.smartColumnIndenter.removeLineBreaks", removeLineBreaks));

    context.subscriptions.push(...disposables);
}

function indent2(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]): void
{
    //TODO: create/pass configuration to indent in only two columns
    replaceSelection(textEditor, edit, (code, extension) => new Indenter().indent(code, extension));
}

function indentN(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]): void
{
    replaceSelection(textEditor, edit, (code, extension) => new Indenter().indent(code, extension));
}

function removeLineBreaks(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]): void
{
    replaceSelection(textEditor, edit, code => code.replace(/(\r\n|\r|\n)\s*/g, ""));
}

function replaceSelection(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, replacer: (code: string, extension: string) => string): void
{
    const sel = textEditor.selection;
    const firstLine = textEditor.document.lineAt(sel.start.line);
    const lastLine = textEditor.document.lineAt(sel.end.line);
    const expandedSelection = new vscode.Range(firstLine.lineNumber, firstLine.range.start.character, lastLine.lineNumber, lastLine.range.end.character);

    const extension = textEditor.document.fileName.replace(/.*[.]/g, "");
    const code = textEditor.document.getText(expandedSelection);

    const newCode = replacer(code, extension);

    textEditor.selection = new vscode.Selection(expandedSelection.start, expandedSelection.end);
    edit.replace(textEditor.selection, newCode);
}

// this method is called when your extension is deactivated
export function deactivate() {
}