export function noEmpty(valor: any) {
    if (typeof valor === 'string') {
        return valor.trim().length !== 0 ? valor : '-';
    } else if (typeof valor === 'number') {
        return valor !== 0 ? valor.toString() : '-';
    } else {
        return valor ? valor : '-';
    }
}
