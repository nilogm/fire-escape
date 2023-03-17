# To do List

## Melhorias

- [ ] Sprites/animações:

  - [ ] Obstáculos + sombras
  - [ ] Player
  - [ ] Level
  - [ ] Porta/Placa de saída + chave

- [ ] FX:

  - [ ] Fumaça nos cantos da tela
  - [ ] Iluminação do fogo

- [ ] Sounds:
  - [x] Chave caindo
  - [x] Obstáculo caindo
  - [x] Porta abrindo
  - [ ] Fogo + fogging

## Mecânicas

- [ ] Menu de início
- [x] Gerador de níveis aleatório:
  - [x] Saída nas paredes (caso seja uma porta)
  - [x] Chave aparece após certo período de tempo
  - [x] Maior frequência de obstáculos/menos tempo de aviso
- [x] Colisões melhores (consertei a parte de colidir na tela entendi o porque do bug)
- [x] Chave nunca cair em cima da porta e do jogador
- [ ] Indicador de movimento (caso haja colisão, começar a perder vida por falta de movimento)
  - [x] Botões Simultâneamente apertados que causam o jogador a ficar parado agora faz com q ele tome dano
- [ ] Hud tem q andar com a camera

### Itens (Um por vez/ pode ser carregado para diferentes níveis)

- [x] Machado para abrir a porta sem chave
- [x] MedKit para não tomar hitkill
- [x] Extintor de incêndio (apagar obstáculos)

### Last day

- Cenário
- Porta + chave
- Hud que mostra o item atual
- Obstáculos pegando fogo
- Nível com um certo número de estáticos:
  - Aumenta de acordo com a dificuldade
  - Aparece somente no centro do nível
  - Ajustar colisões num lugar específico
- Colisão com obstáculos:
  - Conferir se há overlap entre obstáculo e player quando cair (não a todo momento como implementado)
- Animação de obstáculo pegando fogo e sumindo
- Mostrar maior score e score atual no HUD
- Player
