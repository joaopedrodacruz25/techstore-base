export function formatarPreco(valor) {
  const numero = Number(valor)

  if (!Number.isFinite(numero)) {
    return 'Preço indisponível'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numero)
}
