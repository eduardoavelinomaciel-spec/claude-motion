# Resumo do projeto: vídeos "Histórias que Aquecem" em anime + pixel art + HQ

Cole este arquivo no início do novo chat.

## Repositório e onde está tudo
- Repo: `eduardoavelinomaciel-spec/claude-motion`, branch `claude/video-3d-pixel-art-roteiros-4v5ioj` (tudo já enviado ao GitHub).
- Roteiros adaptados (pasta `roteiros/`):
  - `historia-01-cachorro-hq.md`: bíblia de estilo + História 1 em 12 cenas + decisões do piloto.
  - `historias-02-a-08-hq.md`: histórias 2 a 8 adaptadas.
  - `historias-09-a-12-hq.md`: história 9 completada; 10 (Avó que Guardava Canções), 11 (Robô que Recolhia Lixo) e 12 (Faroleiro da Última Noite) criadas do zero.
- Animação atual (pasta `anime/`):
  - `shots.js`: quadros-chave da Cena 1, funções comuns (chuva, glow, bloom, grão, carro anos 80 `drawCar`, silhueta com luz de contorno `rimSil`, pixelização `pixelate`).
  - `anim.js` + `timeline.json`: Cena 1 animada.
  - `anim2.js` + `timeline2.json`: Cena 2 animada (contém o rig das crianças e o Caramelo sentado `dogSit`).
  - `anim3.js` + `timeline3.json`: Cena 3 animada (contém o Otávio andando `otavio`, o Caramelo trotando `dogTrot`, a rua lateral e o ponto de ônibus).
  - `capture.mjs`: renderiza quadro a quadro para MP4 (24 fps, 1920×1080).
  - Som: `sfx/cues/cena1.py`, `cena2.py`, `cena3.py` (motor de som procedural do repo, masterizado a -14 LUFS).
- Pastas antigas descartadas (não usar): `pilot/` (versão pixel art pura, reprovada).
- **Os MP4 finais NÃO estão no GitHub** (`anime/out/` é ignorado). Baixe os vídeos do chat ou gere de novo (ver Comandos).

## Decisões do dono (seguir sempre)
- Formato: vídeo **sem voz**, só **balões de HQ**, recordatórios (caixa amarela de narrador), onomatopeias e cartões de fato.
- Estilo aprovado: **anime cinematográfico (tipo Shinkai/Ghibli) + pixel art por cima** (render 1920×1080, depois reduz para 480×270 com paleta de 12 níveis e dithering leve e amplia sem suavizar). Textos de HQ ficam **nítidos por cima**, sem pixelar.
- Produção: **tudo por código** (canvas 2D no navegador, Playwright, ffmpeg). Sem IA de imagem.
- **Perguntar os detalhes de cada cena antes de criar** (planos, personagens, lugar, texto), com opções.
- Texto **mínimo** (a versão antiga foi achada poluída): poucos recordatórios, uma onomatopeia por momento.
- Fonte: Bangers (balões, recordatórios); Press Start 2P (onomatopeias e cartões de RPG).
- Fatos reais aparecem como **cartão de item de RPG** em pixel art.
- Cenário: **bairro brasileiro** (sobrados coloridos, padaria, fiação, pedra portuguesa).
- **Otávio é jovem (~30 anos)**: cabelo escuro bagunçado, olhar cansado, barba por fazer, casaco bege comprido, cachecol vermelho, mochila cinza. (Só a voz do narrador original seria velha; não há narrador.)
- **Caramelo**: vira-lata caramelo, uma orelha em pé (rosa por dentro) e outra dobrada, focinho/peito/patas brancos, olhos grandes de anime. Fala por **ícones**, **pensamento** em momentos emocionais e **onomatopeias**.
- Carro: **sedã vermelho anos 80** (referência enviada pelo dono), faróis duplos, **sem logo de marca**. Nunca mostrar impacto.
- Duas crianças da Cena 2: menino (camisa branca, short azul, mochila vermelha) e menina (pele escura, marias-chiquinhas, saia azul, mochila verde), estilo anime com rosto.

## O que já foi produzido (História 1)
| Cena | Duração | Status | Conteúdo |
|---|---|---|---|
| 1 · O puxão | 30 s | pronta, aprovada | rua chuvosa neon → mão com celular → carro dobra a esquina → olho do Caramelo → corrida em câmera lenta → salto congelado em quadro de HQ "NHAC!" → estilhaça em pixels → amanhecer "TRÊS SEMANAS ANTES..." |
| 2 · A rua é a casa dele | 34 s | pronta, aprovada | continua do último quadro da Cena 1; porta da padaria sobe (KRRRRRR) → SNIFF → fio dourado de cheiro + ícone de pão → crianças "BOM DIA, CARAMELO!" e "?" → "HOJE ALGUÉM VEM." → cartão RPG do faro (300 milhões × 6 milhões) |
| 3 · O homem que não olhava | 33 s | **acabou de ser entregue, aguardando opinião** | Otávio andando de cabeça baixa "CASA. ÔNIBUS. TRABALHO. CASA." → 3 quadros empilhados SEGUNDA/TERÇA/QUARTA com relógio → ponto de ônibus, Caramelo vê ("!!") → passa sem notar "ELE NÃO OLHAVA PARA OS LADOS." → close do Caramelo inclinando a cabeça → levanta e segue de longe "TEC TEC TEC!" |

Próxima: **Cena 4 · A espera na padaria** (perguntar detalhes antes). Roteiro das cenas 4 a 12 em `historia-01-cachorro-hq.md`.

## Aprendizados
- Desenho por código fica bom em: **luz, chuva, neon, reflexos, closes com pelo em pinceladas e silhuetas com luz de contorno**. Fica fraco em corpos inteiros detalhados; quando precisar, usar silhueta ou close.
- O close do olho do Caramelo (Cena 1, plano 4) é a referência de qualidade aprovada.
- Personagens andando/correndo: usar **ciclo de verdade** (joelho dobra na passada, tronco inclinado, braço oposto à perna, corpo sobe e desce, cabelo/saia com atraso, sombra no chão). Membros afinando com lado de sombra.
- **Ordem de desenho importa**: roupa (saia, short) deve ser desenhada **depois das duas pernas** (erro já corrigido).
- Sempre revisar com **folha de contatos** (stills) antes de renderizar; conferir quadros do MP4 final.
- Planos em close evitam o limite de qualidade; planos abertos precisam de fundo largo o bastante (sem bordas pretas).
- Para atualizar só um trecho de cena: renderizar o trecho e emendar com ffmpeg (já feito na Cena 2).
- Renderizar uma cena de ~30 s leva ~15 min; rodar em segundo plano e escrever o som enquanto isso.
- Coisas pendentes que o dono notou ou que eu apontei: mãos simples; Caramelo sentado mais simples que o close; Otávio pequeno/silhueta no plano 1 da Cena 1.

## Comandos
```bash
cd claude-motion/anime
npm i --prefix ../pilot three @fontsource/bangers @fontsource/press-start-2p   # se node_modules faltar
ln -sf ../pilot/node_modules node_modules
python3 -m http.server 8124 &                     # servidor local obrigatório
node capture.mjs --page anim3.html --prefix s3 --stills 3,9,15   # stills para revisão
node capture.mjs --page anim3.html --to 33 --out out/cena3-silent.mp4
cd .. && python3 -m sfx sfx/cues/cena3.py          # som
ffmpeg -i anime/out/cena3-silent.mp4 -i anime/out/cena3.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest anime/out/cena3.mp4
```
- Commits: identidade `Claude <noreply@anthropic.com>`, push com `git -c push.negotiate=true push`.
