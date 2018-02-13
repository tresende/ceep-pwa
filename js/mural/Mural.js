const Mural = (function (_render, Filtro) {
    "use strict"
    let cartoes = pegaCartoesUsuario();
    cartoes.forEach(cartao => {
        preparaCartao(cartao);
    })

    const render = () => _render({ cartoes: cartoes, filtro: Filtro.tagsETexto });
    render()

    Filtro.on("filtrado", render)

    function salvaCartoes() {
        localStorage.setItem(usuario, JSON.stringify(
            cartoes.map(cartao => ({ conteudo: cartao.conteudo, tipo: cartao.tipo }))
        ))
    }

    login.on('login', () => {
        cartoes = pegaCartoesUsuario();
        render();
    })

    login.on('logout', () => {
        cartoes = [];
        render();
    })

    function pegaCartoesUsuario() {
        let cartoesLocal = JSON.parse(localStorage.getItem(usuario));
        if (cartoesLocal) {
            return cartoesLocal.map(cartaoLocal => new Cartao(cartaoLocal.conteudo, cartaoLocal.tipo)) || [];
        }
        return []
    }

    function preparaCartao(cartao) {
        let urlsImagens = Cartao.pegaImagens(cartao);
        urlsImagens.forEach(url => {
            fetch(url).then(resposta => {
                caches.open('ceep-imagens').then(cache =>{
                    cache.put(url, resposta);
                })
            });
        })
        cartao.on("mudanca.**", salvaCartoes)
        cartao.on("remocao", () => {
            cartoes = cartoes.slice(0);
            cartoes.splice(cartoes.indexOf(cartao), 1)
            salvaCartoes()
            render()
        })
    }
    function adiciona(cartao) {
        if (logado) {
            cartoes.push(cartao);
            salvaCartoes()
            cartao.on("mudanca.**", render)
            preparaCartao(cartao);
            render()
            return true
        } else {
            alert('Voce nao está logado')
        }
    }

    return Object.seal({
        adiciona
    })

})(Mural_render, Filtro)
