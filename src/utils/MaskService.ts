function isValidCPF(cpf: any) {
    let sum = 0, remainder;

    for (let i = 1; i <= 9; i++) 
        sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) 
        sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11))  remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

function isValidCNPJ(cnpj: any) {
    let length = cnpj.length - 2
    let numbers = cnpj.substring(0,length)
    const verifiers = cnpj.substring(length)
    let sum = 0
    let pos = length - 7

    for (let i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result != verifiers.charAt(0)) return false;

    length = length + 1;
    numbers = cnpj.substring(0,length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * pos--;
        if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result != verifiers.charAt(1)) return false;

    return true;
}

const formatCPFCNPJ = (value: any) => {
    if (value === null || value === undefined) return false;

    let stringValue = String(value).replace(/\D/g, '');

    if (stringValue.length === 11 && isValidCPF(stringValue)) {
        return stringValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (stringValue.length === 14 && isValidCNPJ(stringValue)) {
        return stringValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return false;
};

export default formatCPFCNPJ;
