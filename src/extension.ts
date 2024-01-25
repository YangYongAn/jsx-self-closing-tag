// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "jsx-self-closing-tag" is now active!');
	vscode.workspace.onDidChangeTextDocument(handleTextChange);
}


function handleTextChange(event: vscode.TextDocumentChangeEvent) {
	const { document, contentChanges } = event;
	for (const change of contentChanges) {
		const { text, range } = change;
		if (text === '/') {// 如果输入的是/，则需要判断是否需要自闭合
			const currentPositon = range.end; // 当前输入的位置,start和end是一样的
			const afterText = getAfterText(currentPositon, document); // 获取当前行在currentPosition之后的内容，因为这个获取成本比较小，而且需要提前看后面是不是有标签，所以先获取这个
			const tagName = afterText.match(/><\/(\w+)\/?>/)?.[1]; // 通过正则匹配，看看后面是不是有标签，如果有的话，就需要自闭合
			if(tagName){ // 获取到了标签的话
				const beforeText = getBeforeText(currentPositon, document); // 获取当前行在currentPosition之前的内容和上一行（如果 line>0）的内容
				if(beforeText.endsWith(`<${tagName}`)){ // 如果前面是以<${tagName}开头的话，就需要自闭合
					const edit = new vscode.WorkspaceEdit(); // 获取编辑器对象
					edit.replace(document.uri, new vscode.Range(currentPositon, currentPositon.translate(0,tagName.length+5)), `/>`); // 开始替换
					vscode.workspace.applyEdit(edit); // 应用编辑
				}
			}
		}
	}
}

/**
 * 仅获取当前行在currentPosition之后的内容
 * @param currentPositon 
 * @param document 
 */
function getAfterText(currentPositon: vscode.Position, document: vscode.TextDocument) {
	const line = currentPositon.line;
	const currentLineText = document.getText(new vscode.Range(currentPositon, document.lineAt(line).range.end));
	return currentLineText;
}


/**
 * 	 获取当前行在currentPosition之前的内容和上一行（如果 line>0）的内容
 * @param currentPositon 
 * @param document 
 * @returns 
 */
function getBeforeText(currentPositon: vscode.Position, document: vscode.TextDocument) {
	const line = currentPositon.line;
	const currentLineText = document.getText(new vscode.Range(new vscode.Position(line, 0), currentPositon));
	let previousLineText = '';

	if (line > 0) {
		const previousLine = line - 1;
		const previousLineLastCharacter = document.lineAt(previousLine).range.end;
		const previousLineRange = new vscode.Range(new vscode.Position(previousLine, 0), previousLineLastCharacter);
		previousLineText = document.getText(previousLineRange);
	}

	return (previousLineText + currentLineText).trim();


}

// This method is called when your extension is deactivated
export function deactivate() { }
