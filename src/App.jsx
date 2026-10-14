import { useEffect, useRef, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import Lojista from './pages/Lojista'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { produtoDisponivel } from './utils/carrinho'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState([])
  const ultimoCliqueRef = useRef({})

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    if (!produtoDisponivel(produto)) {
      return
    }

    const agora = Date.now()
    const ultimaAdicao = ultimoCliqueRef.current[produto.id] || 0

    if (agora - ultimaAdicao < 300) {
      return
    }

    ultimoCliqueRef.current[produto.id] = agora
    setCarrinho((carrinhoAtual) => carrinhoAtual.concat(produto))
  }

  function removerUmaUnidade(produtoId) {
    setCarrinho((carrinhoAtual) => {
      const indiceParaRemover = carrinhoAtual.findIndex((produto) => produto.id === produtoId)

      if (indiceParaRemover === -1) {
        return carrinhoAtual
      }

      return carrinhoAtual.filter((produto, indice) => indice !== indiceParaRemover)
    })
  }

  function registrarEspera(produtoId, nome, email) {
    const valorNome = nome.trim()
    const valorEmail = email.trim()

    if (!produtoId || !valorNome || !valorEmail) {
      return false
    }

    setListaEspera((atual) => {
      const jaExiste = atual.some(
        (item) => item.produtoId === produtoId && item.email.toLowerCase() === valorEmail.toLowerCase()
      )

      if (jaExiste) {
        return atual
      }

      return [...atual, { id: crypto.randomUUID(), produtoId, nome: valorNome, email: valorEmail }]
    })

    return true
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onRegistrarEspera={registrarEspera}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/estoque"
              element={<Estoque produtos={produtos} listaEspera={listaEspera} />}
            />
            <Route
              path="/lojista"
              element={<Lojista produtos={produtos} listaEspera={listaEspera} />}
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
