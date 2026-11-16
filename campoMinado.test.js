const { CampoMinado, LINHAS, COLUNAS, BOMBAS } = require('./campoMinado');

// Posições fixas das 40 bombas, para o teste não depender de sorteio:
//   linha 0: colunas 1 a 17  (17 bombas) -> a casa (0,0) fica livre
//   linha 1: colunas 0 a 17  (18 bombas)
//   linha 2: colunas 0 a 4   (5 bombas)
// Da linha 3 para baixo não existe bomba.
function bombasFixas() {
  const bombas = [];
  for (let c = 1; c < 18; c++) bombas.push([0, c]);
  for (let c = 0; c < 18; c++) bombas.push([1, c]);
  for (let c = 0; c < 5; c++) bombas.push([2, c]);
  return bombas;
}

function criarJogo() {
  return new CampoMinado(bombasFixas());
}

describe('Tabuleiro 18 x 14', () => {
  test('CT01 - tabuleiro deve ter 14 linhas e 18 colunas (252 casas)', () => {
    const jogo = new CampoMinado();
    expect(LINHAS).toBe(14);
    expect(COLUNAS).toBe(18);
    expect(jogo.casas.length).toBe(14);
    jogo.casas.forEach((linha) => expect(linha.length).toBe(18));
  });

  test('CT02 - tabuleiro sorteado deve ter exatamente 40 bombas', () => {
    const jogo = new CampoMinado();
    expect(BOMBAS).toBe(40);
    expect(jogo.contarBombas()).toBe(40);
  });

  test('CT03 - devem existir 212 casas sem bomba', () => {
    const jogo = new CampoMinado();
    expect(LINHAS * COLUNAS - jogo.contarBombas()).toBe(212);
  });

  test('CT04 - jogo começa com todas as casas fechadas e sem bandeira', () => {
    const jogo = new CampoMinado();
    jogo.casas.forEach((linha) =>
      linha.forEach((casa) => {
        expect(casa.aberta).toBe(false);
        expect(casa.bandeira).toBe(false);
      })
    );
    expect(jogo.estado).toBe('jogando');
    expect(jogo.bandeirasRestantes()).toBe(40);
  });

  test('CT05 - não aceita tabuleiro com quantidade de bombas diferente de 40', () => {
    const bombas = bombasFixas();
    bombas.pop(); // fica com 39
    expect(() => new CampoMinado(bombas)).toThrow('O tabuleiro deve ter 40 bombas');
  });

  test('CT06 - não aceita bomba fora do tabuleiro', () => {
    const bombas = bombasFixas();
    bombas[0] = [14, 18];
    expect(() => new CampoMinado(bombas)).toThrow('Bomba fora do tabuleiro');
  });
});

describe('Contagem de bombas vizinhas', () => {
  test('CT07 - casa sem bomba ao redor mostra 0', () => {
    const jogo = criarJogo();
    expect(jogo.bombasVizinhas(13, 17)).toBe(0);
    expect(jogo.bombasVizinhas(3, 6)).toBe(0);
  });

  test('CT08 - casa do canto (0,0) cercada de bombas mostra 3', () => {
    const jogo = criarJogo();
    expect(jogo.bombasVizinhas(0, 0)).toBe(3);
  });

  test('CT09 - casa da borda (3,0) mostra 2', () => {
    const jogo = criarJogo();
    expect(jogo.bombasVizinhas(3, 0)).toBe(2);
  });

  test('CT10 - casa do meio (2,5) mostra 4', () => {
    const jogo = criarJogo();
    expect(jogo.bombasVizinhas(2, 5)).toBe(4);
  });
});

describe('Abrir casas', () => {
  test('CT11 - abrir casa com número abre somente ela', () => {
    const jogo = criarJogo();
    jogo.abrir(3, 0);
    expect(jogo.casas[3][0].aberta).toBe(true);
    expect(jogo.contarAbertas()).toBe(1);
    expect(jogo.estado).toBe('jogando');
  });

  test('CT12 - abrir casa com 0 abre as vizinhas em cascata', () => {
    const jogo = criarJogo();
    jogo.abrir(13, 17);
    // abre tudo menos a casa (0,0), que está isolada pelas bombas
    expect(jogo.contarAbertas()).toBe(211);
    expect(jogo.casas[3][0].aberta).toBe(true);
    expect(jogo.casas[0][0].aberta).toBe(false);
  });

  test('CT13 - a cascata não abre nenhuma bomba', () => {
    const jogo = criarJogo();
    jogo.abrir(13, 17);
    bombasFixas().forEach(([l, c]) => {
      expect(jogo.casas[l][c].aberta).toBe(false);
    });
    expect(jogo.estado).toBe('jogando');
  });

  test('CT14 - abrir uma casa já aberta não muda nada', () => {
    const jogo = criarJogo();
    jogo.abrir(3, 0);
    jogo.abrir(3, 0);
    expect(jogo.contarAbertas()).toBe(1);
  });

  test('CT15 - não permite abrir casa fora do tabuleiro', () => {
    const jogo = criarJogo();
    expect(() => jogo.abrir(14, 0)).toThrow('Posição fora do tabuleiro');
    expect(() => jogo.abrir(0, 18)).toThrow('Posição fora do tabuleiro');
    expect(() => jogo.abrir(-1, 0)).toThrow('Posição fora do tabuleiro');
  });
});

describe('Bandeiras', () => {
  test('CT16 - marcar bandeira diminui as bandeiras restantes', () => {
    const jogo = criarJogo();
    jogo.alternarBandeira(0, 1);
    expect(jogo.casas[0][1].bandeira).toBe(true);
    expect(jogo.bandeirasRestantes()).toBe(39);
  });

  test('CT17 - marcar de novo a mesma casa remove a bandeira', () => {
    const jogo = criarJogo();
    jogo.alternarBandeira(0, 1);
    jogo.alternarBandeira(0, 1);
    expect(jogo.casas[0][1].bandeira).toBe(false);
    expect(jogo.bandeirasRestantes()).toBe(40);
  });

  test('CT18 - casa com bandeira não abre (nem se for bomba)', () => {
    const jogo = criarJogo();
    jogo.alternarBandeira(0, 1); // (0,1) é bomba
    jogo.abrir(0, 1);
    expect(jogo.casas[0][1].aberta).toBe(false);
    expect(jogo.estado).toBe('jogando');
  });

  test('CT19 - não permite colocar bandeira em casa aberta', () => {
    const jogo = criarJogo();
    jogo.abrir(3, 0);
    expect(() => jogo.alternarBandeira(3, 0)).toThrow('Casa já aberta');
  });

  test('CT20 - não permite colocar mais de 40 bandeiras', () => {
    const jogo = criarJogo();
    bombasFixas().forEach(([l, c]) => jogo.alternarBandeira(l, c));
    expect(jogo.bandeirasRestantes()).toBe(0);
    expect(() => jogo.alternarBandeira(13, 17)).toThrow('Sem bandeiras disponíveis');
  });
});

describe('Fim de jogo', () => {
  test('CT21 - abrir uma bomba causa derrota', () => {
    const jogo = criarJogo();
    jogo.abrir(1, 0);
    expect(jogo.estado).toBe('derrota');
  });

  test('CT22 - na derrota todas as 40 bombas são reveladas', () => {
    const jogo = criarJogo();
    jogo.abrir(1, 0);
    bombasFixas().forEach(([l, c]) => {
      expect(jogo.casas[l][c].aberta).toBe(true);
    });
  });

  test('CT23 - abrir as 212 casas sem bomba causa vitória', () => {
    const jogo = criarJogo();
    jogo.abrir(13, 17); // abre 211 casas
    expect(jogo.estado).toBe('jogando');
    jogo.abrir(0, 0); // última casa sem bomba
    expect(jogo.contarAbertas()).toBe(212);
    expect(jogo.estado).toBe('vitoria');
  });

  test('CT24 - não permite jogar depois da derrota', () => {
    const jogo = criarJogo();
    jogo.abrir(1, 0);
    expect(() => jogo.abrir(13, 17)).toThrow('Jogo encerrado');
    expect(() => jogo.alternarBandeira(13, 17)).toThrow('Jogo encerrado');
  });

  test('CT25 - não permite jogar depois da vitória', () => {
    const jogo = criarJogo();
    jogo.abrir(13, 17);
    jogo.abrir(0, 0);
    expect(() => jogo.abrir(1, 0)).toThrow('Jogo encerrado');
  });
});
