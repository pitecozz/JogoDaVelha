class Jogador {
    constructor(nome, simbolo) {
        this.nome = nome;
        this.simbolo = simbolo;
        this.pontuacao = 0;
    }
}

class Tabuleiro {
    constructor() {
        this.quadrado = Array(9).fill('')
        this.quadradosHTML = document.querySelectorAll('.quadrado')
    }

    reniciar() {
        this.quadrado.fill('')
        this.quadradosHTML.forEach(quadrado => {
            quadrado.textContent = ''
            quadrado.removeAttribute('mark')
        })
    }

    quadradosAtualizados(indice, simbolo) {
        this.quadrado[indice] = simbolo
        this.quadradosHTML[indice].textContent = simbolo
        this.quadradosHTML[indice].setAttribute('mark', simbolo)
    }

    quadradoVazio(indice) {
        return this.quadrado[indice] === ''
    }

    quadradosDisponiveis() {
        return this.quadrado.map((value, indice) => value === '' ? indice : null).filter(value => value !== null)
    }
}


class JogoDaVelha {
    constructor() {
        this.jogadorAtual = 'X'
        this.tabuleiro = new Tabuleiro()
        this.jogadores = {
            'X': new Jogador('Jogador 1', 'X'),
            'O': new Jogador('Jogador 2', 'O')
        }
        this.jogadorMaquina = false
        this.jogoFinalizado = false
        this.configurandoJogadores()
        this.carregarPontuacoes()
    }

    configurandoJogadores() {
        document.getElementById('inputJogador1').addEventListener('input', (event) => {
            const nome = event.target.value
            if (nome) {
                this.jogadores['X'].nome = nome
                document.getElementById('nomeJogador1').textContent = nome
                document.getElementById('jogador1').textContent = nome
                this.salvarPontuacoes()
            }
        })

        document.getElementById('inputJogador2').addEventListener('input', (event) => {
            const nome = event.target.value
            if (nome) {
                this.jogadores['O'].nome = nome
                document.getElementById('nomeJogador2').textContent = nome
                document.getElementById('jogador2').textContent = nome
                this.salvarPontuacoes()
            }
        })

        document.getElementById('jogadorMaquina').addEventListener('click', () => {
            if (this.jogadores['X'].nome) {
                this.iniciarMaquina()
            } else {
                alert('Por favor, selecione o nome do jogador 1 antes de jogar contra a máquina.')
            }
        })

        document.getElementById('limpar').addEventListener('click', () => {
            this.reniciarJogo()
        })

        this.tabuleiro.quadradosHTML.forEach(quadrado => {
            quadrado.addEventListener('click', () => {
                const indice = quadrado.dataset.quadrado
                if (!this.jogoFinalizado && this.tabuleiro.quadradoVazio(indice)) {
                    this.realizarJogada(indice)
                    if (this.jogadorMaquina && !this.jogoFinalizado) {
                        this.jogadaMaquina()
                    }
                }
            })
        })
    }
/*Gabriel*/ 
    iniciarMaquina() {
        this.jogadorMaquina = true
        this.reniciarJogo()
    }

    reniciarJogo() {
        this.jogoFinalizado = false
        this.jogadorAtual = 'X'
        this.tabuleiro.reniciar()
        document.getElementById('resultado').textContent = ''
        document.getElementById('linha').className = 'linha'
    }

    realizarJogada(indice) {
        this.tabuleiro.quadradosAtualizados(indice, this.jogadorAtual)
        if (this.verificaVitoria()) {
            this.finalizarJogo(`${this.jogadores[this.jogadorAtual].nome} venceu!`)
        } else if (this.tabuleiro.quadradosDisponiveis().length === 0) {
            this.finalizarJogo('Empate!')
        } else {
            this.mudarDeJogador()
        }
    }

    jogadaMaquina() {
        const quadradosDisponiveis = this.tabuleiro.quadradosDisponiveis()
        const indiceAleatorio = Math.floor(Math.random() * quadradosDisponiveis.length)
        this.realizarJogada(quadradosDisponiveis[indiceAleatorio])
    }

    mudarDeJogador() {
        this.jogadorAtual = this.jogadorAtual === 'X' ? 'O' : 'X'
    }

    verificaVitoria() {
        const verificaVitoria = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        return verificaVitoria.some(condition => 
            condition.every(indice => this.tabuleiro.quadrado[indice] === this.jogadorAtual)
        )
    }

    finalizarJogo(message) {
        this.jogoFinalizado = true
        document.getElementById('resultado').textContent = message
        this.pontuacaoAtualizada()
    }

    pontuacaoAtualizada() {
        this.jogadores[this.jogadorAtual].pontuacao++
        const outroJogador = this.jogadorAtual === 'X' ? 'O' : 'X'
        this.jogadores[outroJogador].derrotas = (this.jogadores[outroJogador].derrotas || 0) + 1
    
        document.getElementById(`pontuacaoJog${this.jogadorAtual === 'X' ? 1 : 2}`).textContent = this.jogadores[this.jogadorAtual].pontuacao
        document.getElementById(`derrotaJog${this.jogadorAtual === 'O' ? 1 : 2}`).textContent = this.jogadores[outroJogador].derrotas
    
        this.salvarPontuacoes()
    }
   /*Rafael*/ 
    salvarPontuacoes() {
        const pontuacoes = {
            'X': {
                nome: this.jogadores['X'].nome,
                pontuacao: this.jogadores['X'].pontuacao,
                derrotas: this.jogadores['X'].derrotas || 0
            },
            'O': {
                nome: this.jogadores['O'].nome,
                pontuacao: this.jogadores['O'].pontuacao,
                derrotas: this.jogadores['O'].derrotas || 0
            }
        }
        localStorage.setItem('pontuacoesJogoDaVelha', JSON.stringify(pontuacoes))
        this.atualizarPlacarGeral()
    }
    
    carregarPontuacoes() {
        const pontuacoes = JSON.parse(localStorage.getItem('pontuacoesJogoDaVelha'))
        if (pontuacoes) {
            this.jogadores['X'].nome = pontuacoes['X'].nome
            this.jogadores['X'].pontuacao = pontuacoes['X'].pontuacao
            this.jogadores['X'].derrotas = pontuacoes['X'].derrotas || 0
            document.getElementById('nomeJogador1').textContent = pontuacoes['X'].nome
            document.getElementById('jogador1').textContent = pontuacoes['X'].nome
            document.getElementById('pontuacaoJog1').textContent = pontuacoes['X'].pontuacao
            document.getElementById('derrotaJog1').textContent = pontuacoes['X'].derrotas
    
            this.jogadores['O'].nome = pontuacoes['O'].nome
            this.jogadores['O'].pontuacao = pontuacoes['O'].pontuacao
            this.jogadores['O'].derrotas = pontuacoes['O'].derrotas || 0
            document.getElementById('nomeJogador2').textContent = pontuacoes['O'].nome
            document.getElementById('jogador2').textContent = pontuacoes['O'].nome
            document.getElementById('pontuacaoJog2').textContent = pontuacoes['O'].pontuacao
            document.getElementById('derrotaJog2').textContent = pontuacoes['O'].derrotas
        }
        this.atualizarPlacarGeral()
    }
}    

document.addEventListener('DOMContentLoaded', () => {
    new JogoDaVelha()
})
