export function maskMoney(valor: any, currency = false) {
    const symbol = currency ? "R$" : "";
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      }).format(valor).replace("R$", symbol);
}