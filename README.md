# Logitron

Logitron é um jogo educativo de memória para praticar equivalências da lógica proposicional. O objetivo é encontrar, em um tabuleiro embaralhado, os pares de proposições que representam a mesma função lógica.

## Como funciona

- O jogo possui dois jogadores.
- Cada jogador começa com 3 minutos no cronômetro.
- O tabuleiro contém 16 cartas formadas por 8 pares de equivalências.
- Em cada turno, o jogador vira duas cartas.
- Quando as duas proposições são equivalentes, o jogador ganha 1 ponto e a vez passa ao outro jogador.
- Quando não são equivalentes, as cartas voltam para baixo e a vez passa para o outro jogador.
- A partida termina quando todos os pares forem encontrados ou quando o tempo de um jogador chegar a zero.
- Ao final dos pares, vence quem tiver mais pontos. Se houver empate de pontos, vence quem tiver mais tempo restante.

## Funcionalidades

- Tabuleiro embaralhado a cada partida.
- 8 pares de equivalências da lógica proposicional.
- Modo para dois jogadores.
- Cronômetro individual de 3 minutos por jogador.
- Contagem de jogadas e pares encontrados.
- Pontuação atual para os dois jogadores.
- Indicação visual de quem está jogando.
- Janela de pontuação com placar e tempo restante.
- Botão para reiniciar a partida.
- Mensagens acessíveis que informam acertos, erros e vencedor.

## Equivalências presentes no jogo

1. `p → q` equivale a `¬p ∨ q`
2. `¬(p ∧ q)` equivale a `¬p ∨ ¬q`
3. `¬(p ∨ q)` equivale a `¬p ∧ ¬q`
4. `¬(p → q)` equivale a `p ∧ ¬q`
5. `¬¬p` equivale a `p`
6. `p ∨ q` equivale a `q ∨ p`
7. `p ↔ q` equivale a `(p → q) ∧ (q → p)`
8. `p ∧ (q ∨ r)` equivale a `(p ∧ q) ∨ (p ∧ r)`

## Como jogar

1. Abra o arquivo `memoria.html` em um navegador.
2. Observe o tabuleiro com as cartas fechadas.
3. Clique em uma carta para revelar sua proposição.
4. Clique em uma segunda carta.
5. Se houver equivalência lógica, o par permanece revelado e você ganha 1 ponto.
6. Se não houver equivalência, aguarde as cartas serem fechadas novamente.
7. Use o tempo e a memória para encontrar os 8 pares antes do adversário.
8. Clique em **Pontuação** para consultar o placar durante a partida.
9. Clique em **Reiniciar partida** para embaralhar as cartas e começar novamente.

## Executando localmente

Não é necessário instalar dependências. O projeto pode ser executado diretamente no navegador:

```text
Abra memoria.html
```

Também é possível usar uma extensão de servidor local no VS Code ou iniciar um servidor HTTP com Python:

```bash
python -m http.server 8000
```

Em seguida, acesse `http://localhost:8000/memoria.html`.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript