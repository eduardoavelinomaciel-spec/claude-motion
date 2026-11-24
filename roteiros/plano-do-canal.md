# Plano do canal · histórias animadas sem palavras

Canal de **várias histórias diferentes**. A identidade é o **estilo**, não um personagem: luz quente de anime, pixel art com dithering, linguagem de HQ (quadros, balões, recordatório amarelo, onomatopeias) e nenhuma voz.

---

## 1. Nome do canal

| Nome | Por que funciona | Atenção |
|---|---|---|
| **Histórias que Aquecem** ⭐ | Já é o nome de trabalho do projeto e diz a promessa (emoção boa). Fácil de lembrar. | Só em português. Resolva com a tradução do nome do canal (veja abaixo). |
| Quadro a Quadro | Remete a HQ e a animação ao mesmo tempo. | Genérico, difícil de achar na busca. |
| Balão Pixel | Une os dois traços do estilo (HQ + pixel). | Não fala de emoção. |
| Pixel Hearts | Funciona em qualquer país, curto. | Nome em inglês para quem começa no Brasil. |
| Sem Palavras | O diferencial do formato no próprio nome. | Pode soar triste ou mudo demais. |
| Histórias de Bolso | Afetivo, sugere histórias curtas e completas. | Menos ligado ao visual. |

**Recomendação:** **Histórias que Aquecem**, com o nome traduzido no YouTube Studio (Personalização → Informações básicas → Adicionar idioma):
- Inglês: **Stories That Warm You**
- Espanhol: **Historias que Abrigan**

Antes de decidir, confira se o @handle está livre (por exemplo `@historiasqueaquecem`) e se o mesmo nome está livre no Instagram e no TikTok.

---

## 2. Identidade visual

Arquivos em `canal/`, gerados por `anime/brand.js` com as mesmas funções dos vídeos (`pixelate`, `bloom`, `grade`) e a camada de HQ nítida por cima.

| Peça | Arquivo | Tamanho | Conceito |
|---|---|---|---|
| Foto do perfil | `canal/avatar.png` | 800×800 | Balão de HQ com coração pixel sobre luz dourada pixelada. É o "ícone" que o Caramelo usa para falar, virado símbolo de todas as histórias. |
| Capa | `canal/banner.png` | 2560×1440 | Uma página de HQ: cada quadro é um mundo diferente (mar, farol, cidade na chuva, rua brasileira ao pôr do sol, girassóis, floresta com vaga-lumes). O nome fica no quadro do meio, que é a área visível no celular. |

Para trocar o nome na capa:
```bash
cd anime && python3 -m http.server 8124 &
node brand.mjs "NOVO NOME|SEGUNDA LINHA"
```

**Regras de identidade (valem para miniaturas também)**
- Cores-assinatura: dourado e laranja do pôr do sol contra azul de tensão.
- Títulos em **Bangers** amarelo-laranja com contorno preto grosso e sombra vermelha.
- Recordatório amarelo com borda preta para frases curtas.
- Coração pixel vermelho como "selo" do canal: canto da miniatura, tela final, marca d'água.

---

## 3. Descrição do canal

> **Histórias que Aquecem** são curtas animadas sem nenhuma fala: só imagens, balões de HQ e muito sentimento.
>
> Um cachorro de rua que salva um desconhecido. Uma avó que esquece nomes, mas não canções. Uma menina que ninguém escolhia no recreio. Cada vídeo é uma história completa, desenhada em pixel art com luz de anime, para você assistir em qualquer língua.
>
> 🎬 Nova história toda semana e Shorts todos os dias.
> 💛 Se uma história tocar você, mande para alguém que precisa dela hoje.
>
> Tudo animado por código, quadro a quadro.

**Versão em inglês (tradução da descrição no Studio):**
> **Stories That Warm You** are silent animated shorts: no dialogue, just pictures, comic-book balloons and a lot of heart.
>
> A stray dog who saves a stranger. A grandmother who forgets names but never songs. A girl nobody picked at recess. Every video is a complete story in pixel art with anime light, made to be understood in any language.
>
> 🎬 A new story every week, Shorts every day.
> 💛 If a story moves you, send it to someone who needs it today.

**Palavras-chave do canal (Configurações → Canal):** histórias animadas, animação emocionante, curta animado, animação sem diálogo, pixel art, história emocionante, histórias que emocionam, silent animation, animated short film, heartwarming story.

---

## 4. Posicionamento e riscos

- **Público:** adultos e famílias (13+), no estilo dos curtas da Pixar. Marque o canal como **não** feito para crianças. Se uma história específica for claramente infantil, marque **aquele vídeo** honestamente.
- **Global:** sem voz, a história funciona em qualquer país. Traduza título, descrição e nome do canal (inglês e espanhol primeiro). Se quiser, troque o JSON de textos dos balões para gerar versões em outros idiomas.
- **Conteúdo inautêntico:** como tudo é feito por código, varie enquadramento, cenário, paleta e ritmo entre as histórias. Cada uma deve ter cara própria, para não parecer template.
- **Legibilidade:** revise o render no tamanho de um celular. No máximo 2 textos na tela por vez.

---

## 5. Lançamento

1. **Agora:** Short teaser de 9:16 com a Cena 1 do cachorro ("UM SEGUNDO.") e 2 ou 3 Shorts com momentos isolados. A meta é que mais de 70% das pessoas vejam em vez de deslizar.
2. **Lançamento:** a História 1 completa (vídeo longo) + 5 Shorts tirados das cenas dela, todos na mesma semana. Cada Short aponta para o vídeo completo (link para o vídeo relacionado).
3. **Ritmo:** 1 história a cada 1 ou 2 semanas e 1 Short por dia, todos tirados das cenas. Uma história de 12 cenas rende pelo menos 8 Shorts.

**Ordem das histórias:** 1 Cachorro, 10 Avó, 9 Menina, 11 Robô, 12 Faroleiro. Depois: 4 Gato, 6 Elias, 5 Herói do Amor, 8 Astronauta, 7 Viagem do Tempo, 3 Peixe, 2 Quarterback (este com mais força na versão em inglês). Comece pelas mais adultas e emocionantes. Peixe e gato puxam o canal para o infantil, por isso ficam para depois que o algoritmo já entendeu o público.

Pacotes (título, descrição, miniatura) das 5 primeiras: `roteiros/pacotes-5-historias.md`.

---

## 6. Kit de produção (acelerar)

1. Rig por personagem com ciclos reutilizáveis (andar, correr, sentar), como o da Cena 2 e o `otavio()` da Cena 3.
2. Biblioteca de cenários (rua, casa, escola, padaria, praça, mar, farol), cada um em manhã, pôr do sol, noite e chuva.
3. Componentes de HQ prontos (balão, pensamento, ícone, onomatopeia, quadros, ficha de RPG) dirigidos pela timeline.
4. Render duplo: a mesma cena sai em 16:9 e 9:16.
5. Textos dos balões num JSON por idioma.

---

## 7. Metas de 90 dias

| Semanas | Foco | Marco |
|---|---|---|
| 1–2 | Shorts teaser | Validar o estilo (mais de 70% de "visualizaram" nos Shorts) |
| 3–6 | História 1 + 1 Short por dia | CTR acima de 5% e retenção acima de 40% no vídeo longo |
| 7–10 | Histórias 10 e 9, versões em inglês e espanhol, playlist "Histórias que emocionam" | 1 vídeo com 3× a média do canal |
| 11–13 | Repetir o tipo de história que mais performou | 1.000 inscritos e 4.000 h de exibição (ou 10 mi de views em Shorts) |

**Métricas para acompanhar:** CTR (bom: 5–8%), retenção aos 30 s (bom: 70%), duração média (bom: 40–50% do vídeo) e, nos Shorts, "visualizaram" vs. "deslizaram" (bom: 70% ou mais).
Se o CTR estiver baixo, troque título e miniatura. Se a queda for no início, refaça o gancho. Se a queda for no meio, encurte o trecho onde ela acontece.
