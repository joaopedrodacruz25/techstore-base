import { produtoDisponivel } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'

export default function SugestaoItem({ produto, onAdicionar }) {
  const vendaDisponivel = produtoDisponivel(produto)

  return (
    <div className="sugestao">
      <div className="sugestao-imagem-moldura">
        <img src={produto.image} alt={produto.title} className="sugestao-imagem" />
      </div>
      <div className="sugestao-info">
        <p className="sugestao-titulo">{produto.title}</p>
        <p className="preco preco-pequeno">{formatarPreco(produto.price)}</p>
      </div>
      <button className="botao botao-pequeno" onClick={() => onAdicionar(produto)} disabled={!vendaDisponivel}>
        {vendaDisponivel ? 'Comprar' : 'Indisponível'}
      </button>
    </div>
  )
}
