// Campo Minado - tabuleiro 18 x 14 (18 colunas e 14 linhas) com 40 bombas

const LINHAS = 14;
const COLUNAS = 18;
const BOMBAS = 40;

class CampoMinado {
  // posicoesBombas (opcional): lista de [linha, coluna] com as 40 bombas.
  // Se não for informada, as bombas são sorteadas.
  constructor(posicoesBombas) {
    this.linhas = LINHAS;
    this.colunas = COLUNAS;
    this.estado = 'jogando'; // 'jogando', 'vitoria' ou 'derrota'
    this.bandeiras = 0;

    this.casas = [];
    for (let l = 0; l < LINHAS; l++) {
      const linha = [];
      for (let c = 0; c < COLUNAS; c++) {
        linha.push({ bomba: false, aberta: false, bandeira: false });
      }
      this.casas.push(linha);
    }

    if (posicoesBombas === undefined) {
      posicoesBombas = this.sortearBombas();
    }
    this.colocarBombas(posicoesBombas);
  }

  sortearBombas() {
    const posicoes = [];
    const usadas = new Set();
    while (posicoes.length < BOMBAS) {
      const l = Math.floor(Math.random() * LINHAS);
      const c = Math.floor(Math.random() * COLUNAS);
      const chave = l + ',' + c;
      if (!usadas.has(chave)) {
        usadas.add(chave);
        posicoes.push([l, c]);
      }
    }
    return posicoes;
  }

  colocarBombas(posicoes) {
    if (posicoes.length !== BOMBAS) {
      throw new Error('O tabuleiro deve ter 40 bombas');
    }
    for (const [l, c] of posicoes) {
      if (!this.dentroDoTabuleiro(l, c)) {
        throw new Error('Bomba fora do tabuleiro');
      }
      if (this.casas[l][c].bomba) {
        throw new Error('Bomba repetida');
      }
      this.casas[l][c].bomba = true;
    }
  }

  dentroDoTabuleiro(linha, coluna) {
    return (
      Number.isInteger(linha) &&
      Number.isInteger(coluna) &&
      linha >= 0 &&
      linha < LINHAS &&
      coluna >= 0 &&
      coluna < COLUNAS
    );
  }

  // Lista das casas vizinhas (até 8) que estão dentro do tabuleiro
  vizinhas(linha, coluna) {
    const lista = [];
    for (let dl = -1; dl <= 1; dl++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dl === 0 && dc === 0) continue;
        if (this.dentroDoTabuleiro(linha + dl, coluna + dc)) {
          lista.push([linha + dl, coluna + dc]);
        }
      }
    }
    return lista;
  }

  // Número que aparece na casa: quantas bombas existem ao redor
  bombasVizinhas(linha, coluna) {
    let total = 0;
    for (const [l, c] of this.vizinhas(linha, coluna)) {
      if (this.casas[l][c].bomba) total++;
    }
    return total;
  }

  contarBombas() {
    let total = 0;
    for (const linha of this.casas) {
      for (const casa of linha) {
        if (casa.bomba) total++;
      }
    }
    return total;
  }

  // Conta as casas abertas que não são bomba
  contarAbertas() {
    let total = 0;
    for (const linha of this.casas) {
      for (const casa of linha) {
        if (casa.aberta && !casa.bomba) total++;
      }
    }
    return total;
  }

  bandeirasRestantes() {
    return BOMBAS - this.bandeiras;
  }

  validarJogada(linha, coluna) {
    if (this.estado !== 'jogando') {
      throw new Error('Jogo encerrado');
    }
    if (!this.dentroDoTabuleiro(linha, coluna)) {
      throw new Error('Posição fora do tabuleiro');
    }
  }

  abrir(linha, coluna) {
    this.validarJogada(linha, coluna);
    const casa = this.casas[linha][coluna];

    // Casa com bandeira ou já aberta: não faz nada
    if (casa.bandeira || casa.aberta) return;

    if (casa.bomba) {
      this.estado = 'derrota';
      this.revelarBombas();
      return;
    }

    this.abrirEmCascata(linha, coluna);

    if (this.contarAbertas() === LINHAS * COLUNAS - BOMBAS) {
      this.estado = 'vitoria';
    }
  }

  // Abre a casa e, se ela não tiver bombas ao redor, abre as vizinhas também
  abrirEmCascata(linha, coluna) {
    const fila = [[linha, coluna]];
    while (fila.length > 0) {
      const [l, c] = fila.pop();
      const casa = this.casas[l][c];
      if (casa.aberta || casa.bandeira || casa.bomba) continue;

      casa.aberta = true;
      if (this.bombasVizinhas(l, c) === 0) {
        for (const vizinha of this.vizinhas(l, c)) {
          fila.push(vizinha);
        }
      }
    }
  }

  revelarBombas() {
    for (const linha of this.casas) {
      for (const casa of linha) {
        if (casa.bomba) casa.aberta = true;
      }
    }
  }

  // Coloca ou tira a bandeira de uma casa fechada
  alternarBandeira(linha, coluna) {
    this.validarJogada(linha, coluna);
    const casa = this.casas[linha][coluna];

    if (casa.aberta) {
      throw new Error('Casa já aberta');
    }
    if (casa.bandeira) {
      casa.bandeira = false;
      this.bandeiras--;
      return;
    }
    if (this.bandeiras === BOMBAS) {
      throw new Error('Sem bandeiras disponíveis');
    }
    casa.bandeira = true;
    this.bandeiras++;
  }
}

module.exports = { CampoMinado, LINHAS, COLUNAS, BOMBAS };
