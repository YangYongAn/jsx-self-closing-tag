import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { JSXOpeningElement } from '@babel/types';

export function isAtNonSelfClosingJsxTagEnd(code: string, offset: number): boolean {
	const fitNodes: JSXOpeningElement[] = []; // use [] due to jsx opening element nested in other elements
	// Temporarily "fix" the code by removing the `/` at the offset
	const fixedCode = code.slice(0, offset) + code.slice(offset + 1);

	try {
		const ast = parse(fixedCode, {
			sourceType: 'module',
			plugins: ['jsx', 'typescript'],
		});

		traverse(ast, {
			JSXOpeningElement({ node }) {
				const { start, end } = node.loc!;
				if (!node.selfClosing // only consider not self closing jsx element
					&& start.index <= offset && end.index >= offset) {
					fitNodes.push(node);
				}
			},
		});
	} catch (error) {
		console.error('Error parsing code:', error);
	}

	if (fitNodes.length) {
		const inNode = fitNodes.pop()!;
		// check if the chars from offset to end has not other attributes
		const chars = fixedCode.slice(offset, inNode.loc!.end.index).trim();

		if (chars === '>') { // find the true end of the node , avoid some attributes behind the offset
			return true;
		}
	}

	return false;
}
