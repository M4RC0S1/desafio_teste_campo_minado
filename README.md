# Campo Minado - Casos de Teste

Trabalho de casos de teste para o jogo Campo Minado, escrito em JavaScript e testado com Jest.

## Requisitos testados

- Tabuleiro 18 x 14 (18 colunas e 14 linhas, 252 casas)
- 40 bombas (sobram 212 casas sem bomba)

## Regras consideradas

- Cada casa aberta mostra quantas bombas existem nas casas vizinhas (até 8)
- Abrir uma casa com 0 bombas ao redor abre as vizinhas em cascata
- O jogador pode marcar casas com bandeira (no máximo 40). Casa com bandeira não abre
- Abrir uma bomba é derrota, e todas as bombas são reveladas
- Abrir todas as 212 casas sem bomba é vitória

## Arquivos

- `campoMinado.js` - implementação do jogo
- `campoMinado.test.js` - casos de teste
- `package.json` - configuração do projeto e do Jest

## Como rodar

É preciso ter o [Node.js](https://nodejs.org) instalado.

```bash
npm install
npm test
```

## Tabuleiro usado nos testes

Como as bombas são sorteadas, a maioria dos testes usa um tabuleiro com as 40 bombas em posições fixas, para o resultado ser sempre o mesmo:

- linha 0: colunas 1 a 17 (17 bombas)
- linha 1: colunas 0 a 17 (18 bombas)
- linha 2: colunas 0 a 4 (5 bombas)

```
     0 1 2 3 4 5 6 7 8 9 ...  17
 0   . * * * * * * * * * ...  *
 1   * * * * * * * * * * ...  *
 2   * * * * * . . . . . ...  .
 3   . . . . . . . . . . ...  .
...
13   . . . . . . . . . . ...  .
```

## Casos de teste

### Tabuleiro 18 x 14

| ID   | Descrição                                   | Resultado esperado                     |
|------|---------------------------------------------|----------------------------------------|
| CT01 | Verificar o tamanho do tabuleiro            | 14 linhas e 18 colunas                 |
| CT02 | Contar as bombas de um tabuleiro sorteado   | Exatamente 40 bombas                   |
| CT03 | Contar as casas sem bomba                   | 212 casas                              |
| CT04 | Verificar o estado inicial                  | Casas fechadas, sem bandeira, jogando  |
| CT05 | Criar tabuleiro com 39 bombas               | Erro "O tabuleiro deve ter 40 bombas"  |
| CT06 | Criar tabuleiro com bomba em (14,18)        | Erro "Bomba fora do tabuleiro"         |

### Contagem de bombas vizinhas

| ID   | Descrição                                   | Resultado esperado  |
|------|---------------------------------------------|---------------------|
| CT07 | Casas (13,17) e (3,6), sem bomba ao redor   | 0                   |
| CT08 | Casa do canto (0,0), cercada de bombas      | 3                   |
| CT09 | Casa da borda (3,0)                         | 2                   |
| CT10 | Casa do meio (2,5)                          | 4                   |

### Abrir casas

| ID   | Descrição                                   | Resultado esperado                       |
|------|---------------------------------------------|------------------------------------------|
| CT11 | Abrir casa com número (3,0)                 | Abre somente ela                         |
| CT12 | Abrir casa com 0 (13,17)                    | Abre 211 casas em cascata                |
| CT13 | Verificar as bombas depois da cascata       | Nenhuma bomba aberta                     |
| CT14 | Abrir uma casa já aberta                    | Nada muda                                |
| CT15 | Abrir (14,0), (0,18) e (-1,0)               | Erro "Posição fora do tabuleiro"         |

### Bandeiras

| ID   | Descrição                                   | Resultado esperado                       |
|------|---------------------------------------------|------------------------------------------|
| CT16 | Marcar uma bandeira                         | Restam 39 bandeiras                      |
| CT17 | Marcar a mesma casa duas vezes              | Bandeira removida, restam 40             |
| CT18 | Abrir casa com bandeira                     | Casa continua fechada                    |
| CT19 | Colocar bandeira em casa aberta             | Erro "Casa já aberta"                    |
| CT20 | Colocar a 41ª bandeira                      | Erro "Sem bandeiras disponíveis"         |

### Fim de jogo

| ID   | Descrição                                   | Resultado esperado                       |
|------|---------------------------------------------|------------------------------------------|
| CT21 | Abrir uma bomba                             | Derrota                                  |
| CT22 | Verificar as bombas depois da derrota       | As 40 bombas são reveladas               |
| CT23 | Abrir as 212 casas sem bomba                | Vitória                                  |
| CT24 | Jogar depois da derrota                     | Erro "Jogo encerrado"                    |
| CT25 | Jogar depois da vitória                     | Erro "Jogo encerrado"                    |

## Resultado

Os 25 casos de teste passam.

```
Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
```
