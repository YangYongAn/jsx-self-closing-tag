import * as vscode from 'vscode';

// 所有可能包含 JSX 语法的语言标识符
const jsxLanguages = [
    'jsx', 'tsx', 'typescript', 'ts',
    'javascript', 'js', 'react',
    'reactjs', 'react-jsx', 'react-tsx'
];

/**
 * 判断当前位置是否在 JSX/TSX 代码块内
 */
export function isInJsxTsxCodeBlock(document: vscode.TextDocument, position: vscode.Position): boolean {
    let line = position.line;
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
 * 检查文档是否支持 JSX 语法
 */
export function isJsxSupported(document: vscode.TextDocument, position: vscode.Position): boolean {
    const languageId = document.languageId;
    const isJsxTsx = ['javascriptreact', 'typescriptreact'].includes(languageId);
    const isMarkdown = languageId === 'markdown';

    if (isJsxTsx) {
        return true;
    }
    if (isMarkdown) {
        return isInJsxTsxCodeBlock(document, position);
    }
    return false;
} 