// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.workspace.onDidChangeTextDocument(handleTextChange);
}

function handleTextChange(event: vscode.TextDocumentChangeEvent) {
	const { document, contentChanges } = event;

	// 检查文件类型
	const languageId = document.languageId;
	const isJsxTsx = ['javascriptreact', 'typescriptreact'].includes(languageId);
	const isMarkdown = languageId === 'markdown';

	// 如果既不是 JSX/TSX 也不是 Markdown，直接返回
	if (!isJsxTsx && !isMarkdown) {
		return;
	}

	for (const change of contentChanges) {
		const { text, range } = change;
	
		if(text==='/'){
			// 如果是 Markdown，检查当前位置是否在 JSX/TSX 代码块内
			if (isMarkdown) {
				const isInJsxBlock = isInJsxTsxCodeBlock(document, range.start);
				if (!isInJsxBlock) {
					return;
				}
			}

			// 查看光标后面的第一个非空字符是什么
			const afterSlashPosition = new vscode.Position(range.end.line, range.end.character + 1);
			const afterText = getFirstNonWhitespaceChar(afterSlashPosition, document);

			if(afterText==='>'){
				// TODO 继续处理逻辑
				console.log('这是应该要开始处理的');
			}else{
				console.log('不必理会');
			}
		}
	}
}

/**
 * 判断当前位置是否在 JSX/TSX 代码块内
 * @param document 文档对象
 * @param position 当前位置
 * @returns 是否在 JSX/TSX 代码块内
 */
function isInJsxTsxCodeBlock(document: vscode.TextDocument, position: vscode.Position): boolean {
	let line = position.line;
	
	// 所有可能包含 JSX 语法的语言标识符
	const jsxLanguages = [
		'jsx',
		'tsx',
		'typescript',
		'ts',
		'javascript',
		'js',
		'react',
		'reactjs',
		'react-jsx',
		'react-tsx'
	];
	const jsxLanguagePattern = new RegExp(`^\\s*\`\`\`\\s*(${jsxLanguages.join('|')})\\b`, 'i');
	
	// 向上查找代码块开始
	while (line >= 0) {
		const text = document.lineAt(line).text;
		if (text.match(jsxLanguagePattern)) {
			// 找到代码块开始，现在向下查找代码块结束
			let endLine = position.line;
			while (endLine < document.lineCount) {
				const endText = document.lineAt(endLine).text;
				if (endText.match(/^\s*```\s*$/)) {
					// 找到代码块结束
					return endLine > position.line;
				}
				endLine++;
			}
			return true;
		}
		if (text.match(/^\s*```\s*$/)) {
			// 找到其他代码块的结束，说明不在 JSX/TSX 代码块内
			return false;
		}
		line--;
	}
	return false;
}

/**
 * 获取指定位置后的第一个非空白字符
 * @param position 起始位置
 * @param document 文档对象
 * @returns 第一个非空白字符，如果没找到则返回空字符串
 */
function getFirstNonWhitespaceChar(position: vscode.Position, document: vscode.TextDocument): string {
	// 从当前行开始遍历
	for (let lineIndex = position.line; lineIndex < document.lineCount; lineIndex++) {
		const line = document.lineAt(lineIndex);
		let startChar = lineIndex === position.line ? position.character : 0;
		const text = line.text.substring(startChar);
		
		// 如果当前行trim后有内容
		if (text.trim()) {
			const match = text.match(/[^\s]/);
			if (match) {
				return match[0];
			}
		}
	}
	return '';
}

// This method is called when your extension is deactivated
export function deactivate() { }
