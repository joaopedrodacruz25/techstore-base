import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'

const CATEGORIAS = ['roupas', 'eletronicos', 'acessorios', 'casa']

function obterNumero(valor) {
  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : 0
}

export default function Lojista({ produtos = [], listaEspera = [] }) {
  const categorias = CATEGORIAS.map((categoria) => {
    const itens = produtos.filter((produto) => produto.category === categoria)

    const valorEmEstoque = itens.reduce((total, produto) => {
      const preco = obterNumero(produto.price)
      const estoque = obterNumero(produto.estoque)
      return total + preco * estoque
    }, 0)

    const lucroEstimado = itens.reduce((total, produto) => {
      const precoAtual = obterNumero(produto.price)
      const precoOriginal = obterNumero(produto.precoOriginal)
      const estoque = obterNumero(produto.estoque)

      const margem = precoOriginal > 0 ? precoAtual - precoOriginal : 0
      return total + margem * estoque
    }, 0)

    return {
      categoria,
      valorEmEstoque,
      lucroEstimado,
      quantidade: itens.reduce((total, produto) => total + obterNumero(produto.estoque), 0),
    }
  })

  const totalEstoque = categorias.reduce((total, item) => total + item.valorEmEstoque, 0)
  const totalLucro = categorias.reduce((total, item) => total + item.lucroEstimado, 0)

  const esperandoPreco = produtos.filter(
    (produto) => !Number.isFinite(Number(produto.price)) && Number(produto.estoque || 0) > 0
  )

  return (
    <section className="lojista">
      <p className="sobretitulo">Painel do lojista</p>
      <h1>Resumo da loja</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span>Valor em estoque</span>
          <strong>{formatarPreco(totalEstoque)}</strong>
        </div>

        <div className="dashboard-card">
          <span>Clientes na fila de espera</span>
          <strong>{listaEspera.length}</strong>
        </div>

        <div className="dashboard-card">
          <span>Produtos aguardando preço</span>
          <strong>{esperandoPreco.length}</strong>
        </div>

        <div className="dashboard-card">
          <span>Lucro estimado</span>
          <strong>{formatarPreco(totalLucro)}</strong>
        </div>
      </div>

      <div className="painel-colunas">
        <div className="painel-bloco">
          <h2>Por categoria</h2>

          <table className="tabela">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Estoque</th>
                <th>Valor</th>
                <th>Lucro</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((item) => (
                <tr key={item.categoria}>
                  <td>{item.categoria}</td>
                  <td>{item.quantidade} un.</td>
                  <td>{formatarPreco(item.valorEmEstoque)}</td>
                  <td>{formatarPreco(item.lucroEstimado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="painel-bloco">
          <h2>Produtos esperando preço</h2>

          {esperandoPreco.length === 0 ? (
            <p className="aviso">Nenhum produto está aguardando preço do time de suprimentos.</p>
          ) : (
            <ul className="lista-simples">
              {esperandoPreco.map((produto) => (
                <li key={produto.id}>
                  <Link to={`/produto/${produto.id}`}>{produto.title}</Link>
                  <span>{produto.category}</span>
                </li>
              ))}
            </ul>
          )}

          <h2>Clientes aguardando retorno</h2>

          {listaEspera.length === 0 ? (
            <p className="aviso">Nenhum cliente está esperando produtos esgotados voltarem.</p>
          ) : (
            <ul className="lista-simples">
              {listaEspera.map((registro) => (
                <li key={registro.id}>
                  <strong>{registro.nome}</strong>
                  <span>{registro.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
