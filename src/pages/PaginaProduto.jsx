import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { produtoDisponivel } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemEspera, setMensagemEspera] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const vendaDisponivel = produtoDisponivel(produto)
  const esgotado = Number(produto.estoque) === 0
  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id)
    .slice(0, 4)

  function enviarEspera(evento) {
    evento.preventDefault()

    const enviado = onRegistrarEspera(produto.id, nome, email)

    if (enviado) {
      setMensagemEspera('Você foi adicionado à lista de espera.')
      setNome('')
      setEmail('')
    } else {
      setMensagemEspera('Preencha nome e e-mail para receber o aviso.')
    }
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">{formatarPreco(produto.price)}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={!vendaDisponivel}
          >
            {vendaDisponivel ? 'Adicionar ao carrinho' : 'Indisponível'}
          </button>

          {esgotado && (
            <form className="form-espera" onSubmit={enviarEspera}>
              <p className="texto-esgotado">
                Produto esgotado. Deixe seu nome e e-mail para receber um aviso quando voltar.
              </p>

              <label className="campo-espera">
                <span>Nome</span>
                <input
                  type="text"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  placeholder="Seu nome"
                />
              </label>

              <label className="campo-espera">
                <span>E-mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  placeholder="seu@email.com"
                />
              </label>

              <button type="submit" className="botao botao-secundario">
                Avisar quando voltar
              </button>

              {mensagemEspera && <p className="mensagem-espera">{mensagemEspera}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
