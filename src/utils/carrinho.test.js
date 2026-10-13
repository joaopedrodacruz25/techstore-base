import assert from 'node:assert/strict'
import test from 'node:test'
import { calcularTotal } from './carrinho.js'

test('ignora produtos sem preço no total do carrinho', () => {
  const total = calcularTotal([
    { title: 'Carregador Turbo', price: 89.9 },
    { title: 'Copo Térmico', price: 49.9 },
    { title: 'Produto sem preço', price: null },
    { title: 'Outro sem preço', price: undefined },
  ])

  assert.equal(total, 139.8)
})

test('soma corretamente valores decimais com preços em string', () => {
  const total = calcularTotal([
    { title: 'Camiseta Estampada', price: '79.90' },
    { title: 'Tênis Casual', price: '149.90' },
  ])

  assert.equal(total, 229.8)
})
