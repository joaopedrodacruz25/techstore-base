// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function normalizarPreco(valor) {
  if (valor === null || valor === undefined || valor === '') return null

  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : null
  }

  const texto = String(valor).trim()
  if (!texto) return null

  const semMoeda = texto.replace(/[R$\s]/gi, '')

  if (!semMoeda || semMoeda === '-' || semMoeda === '.') return null

  const temVirgula = semMoeda.includes(',')
  const temPonto = semMoeda.includes('.')

  let valorNormalizado = semMoeda

  if (temVirgula && temPonto) {
    valorNormalizado = semMoeda.replace(/\./g, '').replace(',', '.')
  } else if (temVirgula) {
    valorNormalizado = semMoeda.replace(',', '.')
  }

  const numero = Number(valorNormalizado)
  return Number.isFinite(numero) ? numero : null
}

export function produtoDisponivel(produto) {
  if (!produto) return false
  return Number(produto.estoque) > 0 && normalizarPreco(produto.price) !== null
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    const preco = normalizarPreco(produto?.price)
    return preco === null ? total : total + preco
  }, 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
