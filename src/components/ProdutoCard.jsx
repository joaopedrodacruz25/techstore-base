import { Link } from 'react-router'
import { normalizarPreco, produtoDisponivel } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'

export default function ProdutoCard({ produto, onAdicionar }) {
  const esgotado = Number(produto.estoque) === 0
  const vendaDisponivel = produtoDisponivel(produto)
  const precoNormalizado = normalizarPreco(produto.price)
  const precoOriginalNormalizado = normalizarPreco(produto.precoOriginal)

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {precoOriginalNormalizado !== null && (
          <span className="preco-original">{formatarPreco(precoOriginalNormalizado)}</span>
        )}
        <span className="preco">{formatarPreco(precoNormalizado)}</span>
      </div>

      <div className="card-selos">
        {precoNormalizado !== null && precoNormalizado >= 200 && (
          <span className="selo selo-frete">Frete grátis</span>
        )}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={esgotado || !vendaDisponivel}>
        {vendaDisponivel ? 'Adicionar ao carrinho' : 'Indisponível'}
      </button>
    </article>
  )
}
