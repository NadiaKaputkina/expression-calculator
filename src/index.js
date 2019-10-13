function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    const calc = (str) => {
        const numbers = (firstNumber, secondNumber, op) => {
            firstNumber = +firstNumber;
            secondNumber = +secondNumber;

            switch (op) {
                case '*':
                    return firstNumber * secondNumber;
                case '/':
                    if (!secondNumber) throw new TypeError('TypeError: Division by zero.');
                    return firstNumber / secondNumber;
                case '+':
                    return firstNumber + secondNumber;
                case '-':
                    return firstNumber - secondNumber;
            }
        };

        let newStr = /\(|\)/.test(str) ? str.slice(1, str.length - 1) : str;
        let doubleOp = newStr.match(/[\+\-\*\/]-/);

        while (doubleOp !== null) {
            switch (doubleOp[0]) {
                case '+-':
                    newStr = newStr.replace('+-', '-');
                    break;
                case '--':
                    newStr = newStr.replace('--', '+');
                    break;
                case '*-':
                    newStr = newStr.replace('*-', '*');
                    for (let i = doubleOp.index - 1; i > -2; i--) {
                        if (i === -1) {
                            newStr = `-${newStr}`;
                            break;
                        } else {
                            if (newStr[i] === '+') {
                                newStr = `${newStr.slice(0,i)}-${newStr.slice(i+1)}`;
                                break;
                            }
                            if (newStr[i] === '-') {
                                if (i !== 0) newStr = `${newStr.slice(0,i)}+${newStr.slice(i+1)}`;
                                else newStr = newStr.slice(1);
                                break;
                            }
                        }
                    }
                    break;
                case '/-':
                    newStr = newStr.replace('/-', '/');
                    for (let i = doubleOp.index - 1; i > -2; i--) {
                        if (i === -1) {
                            newStr = `-${newStr}`;
                            break;
                        } else {
                            if (newStr[i] === '+') {
                                newStr = `${newStr.slice(0,i)}-${newStr.slice(i+1)}`;
                                break;
                            }
                            if (newStr[i] === '-') {
                                if (i !== 0) newStr = `${newStr.slice(0,i)}+${newStr.slice(i+1)}`;
                                else newStr = newStr.slice(1);
                                break;
                            }
                        }
                    }
                    break;
            }
            doubleOp = newStr.match(/[\+\-\*\/]-/);
        }

        let arrExpr = newStr.match(/\d+\.?\d*|\D/g);
        if (arrExpr[0] === '-') {
            let firstNumber = arrExpr[1];
            arrExpr[1] = `-${firstNumber}`;
            arrExpr = arrExpr.slice(1);
        }

        while (arrExpr.length !== 1) {
            let newArrExpr = [];

            if (arrExpr[1] === '+' || arrExpr[1] === '-') {
                if (arrExpr[3] === '*' || arrExpr[3] === '/') {
                    newArrExpr.push(...arrExpr.slice(0, 2),
                        numbers(arrExpr[2], arrExpr[4], arrExpr[3]),
                        ...arrExpr.slice(5));
                } else {
                    newArrExpr.push(numbers(arrExpr[0], arrExpr[2], arrExpr[1]),
                        ...arrExpr.slice(3));
                }
            } else {
                newArrExpr.push(numbers(arrExpr[0], arrExpr[2], arrExpr[1]),
                    ...arrExpr.slice(3));
            }
            arrExpr = newArrExpr;
        }
        return arrExpr[0];
    };

    let exprWithoutSpace = expr.replace(/ /g, '');

    const openedBrackets = exprWithoutSpace.match(/\(/g);
    const closedBrackets = exprWithoutSpace.match(/\)/g);

    const numberOpenedBrackets = (!openedBrackets) ? 0 : openedBrackets.length;
    const numberClosedBrackets = (!closedBrackets) ? 0 : closedBrackets.length;

    if (numberOpenedBrackets === numberClosedBrackets) {
        if (!numberOpenedBrackets && !numberClosedBrackets) {
            return calc(exprWithoutSpace);
        } else {
            while (numberOpenedBrackets > 0) {
                let arrBrackets = exprWithoutSpace.match(/\([\d\+\-\*\/\.]+?\)/g);

                if (arrBrackets === null) return calc(exprWithoutSpace);

                arrBrackets = arrBrackets.map((item) => {
                    exprWithoutSpace = exprWithoutSpace.replace(item, calc(item));
                });
            }
        }
    } else throw new Error('ExpressionError: Brackets must be paired');

}

module.exports = {
    expressionCalculator
}