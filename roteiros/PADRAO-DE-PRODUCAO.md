# Padrão de produção · "Histórias que Aquecem"

Tudo o que foi usado para fazer a História 1 (Castanha e Otávio, 12 cenas, 6:09), para repetir nas próximas.

---

## 1. Repositórios e dependências

| O quê | Onde | Para quê |
|---|---|---|
| **Repositório principal** | `github.com/eduardoavelinomaciel-spec/claude-motion`, branch `claude/video-3d-pixel-art-roteiros-4v5ioj` | Todo o projeto: roteiros, código das cenas, som |
| Base do repositório | Kit de motion design para agentes (Remotion + motor de som `sfx/`) | Do kit original só usamos o **motor de som `sfx/`** e as regras das skills (`.claude/skills/`). As cenas **não** usam Remotion |
| Pasta `anime/` | Código da animação (canvas 2D) | Uma página HTML + um JS + um timeline JSON por cena |
| Pasta `sfx/` | Motor de som procedural em Python puro (só biblioteca padrão) | Gera e masteriza o áudio de cada cena |
| Pasta `roteiros/` | Roteiros, plano do canal, este padrão | Texto e decisões |
| Pasta `pilot/` | Versão pixel art pura reprovada | **Não usar**, só guarda o `node_modules` com as fontes |

**Pacotes npm** (instalados em `pilot/node_modules`, ligados em `anime/node_modules`):
- `@fontsource/bangers` 5.x: fonte dos balões, recordatórios e textos grandes.
- `@fontsource/press-start-2p` 5.x: fonte pixel das onomatopeias e dos cartões de RPG.
- `three` também está instalado, mas não é usado.

**Ferramentas do sistema:**
- Node 22 com **Playwright + Chromium** (já instalados no ambiente). Abrem a página e tiram um print por quadro.
- **ffmpeg 6.1**: monta o MP4, junta som e vídeo, emenda trechos, mede loudness.
- **Python 3.13**: roda o motor `sfx` e scripts curtos (folhas de contato com Pillow).

**Não usamos:** IA de imagem, IA de vídeo, IA de voz, bancos de imagens ou sons prontos. Tudo é desenhado e sintetizado por código.

Os outros repositórios ligados à conta (audiocraft, ACE-Step, Wan2.2, raea, GSAP etc.) **não foram usados** nesta história.

---

## 2. Fluxo de trabalho (por cena)

1. **Ler o roteiro** da cena em `roteiros/historia-XX-*.md`.
2. **Perguntar os detalhes ao dono** antes de criar: planos, lugar, luz, personagens, texto. Sempre com opções e uma recomendada.
3. **Escrever o `timelineN.json`**: planos com início e fim, mais as batidas (`beats`) de cada evento. Nenhum tempo fica escrito direto no código.
4. **Escrever `animN.js` + `animN.html`**. A função `render(t)` depende só de `t`, sem `Math.random` e sem `Date`.
5. **Renderizar stills** dos momentos-chave e montar uma **folha de contatos**. Olhar, corrigir e repetir até ficar limpo.
6. **Renderizar a cena inteira** em segundo plano (cerca de 15 min para 30 s).
7. **Escrever o som** `sfx/cues/cenaN.py` contra o mesmo timeline, enquanto o vídeo renderiza.
8. **Juntar vídeo e som** com ffmpeg e conferir alguns quadros do MP4 final.
9. **Commit e push**. Mandar o MP4 ao dono e esperar a aprovação.
10. No fim da história, **emendar as cenas** num MP4 só e medir a loudness do arquivo final.

---

## 3. Formato técnico

| Item | Valor |
|---|---|
| Resolução de desenho | 1920×1080 |
| Quadros por segundo | 24 fps |
| Pixelização | reduz para **480×270** (fator 4), **12 níveis** por canal, **dithering Bayer 4×4** com força 0,45, `saturate(1.15) contrast(1.06)`, e amplia sem suavizar (`pixelate(ctx, 4, 12)`) |
| Camada de HQ | balões, recordatórios e onomatopeias vão **depois** da pixelização, nítidos |
| Pós | `bloom` (brilho) + `grade` (vinheta e grão) antes de pixelizar |
| Vídeo | H.264 `crf 16` por cena, `crf 18` no vídeo final, `yuv420p`, `+faststart` |
| Áudio | WAV masterizado a **−14 LUFS**, pico real abaixo de −1 dBFS, AAC 256 kbps no MP4 |
| Duração por cena | 20 a 35 s (a história inteira dá uns 6 min) |

---

## 4. Estilo visual

- **Anime cinematográfico** (luz no estilo Shinkai/Ghibli) com **pixel art por cima**.
- **Fica bom por código:** luz, chuva, neon, reflexos, poças, closes com pelo em pinceladas, silhuetas com luz de contorno, quadros de HQ.
- **Fica fraco:** corpos inteiros detalhados. Quando precisar, use silhueta, close ou plano médio.
- **Cenário:** bairro brasileiro, com sobrados coloridos, padaria, fiação nos postes e pedra portuguesa.

**Luzes já prontas no código:**

| Luz | Onde está | Usada em |
|---|---|---|
| Manhã | `sideStreet()` (céu azul e pêssego) | Cenas 2, 3, 4, 7 |
| Pôr do sol pós-chuva | `STREET5` em `anim5.js` (rosa e laranja, rua molhada) | Cenas 5, 6, 12 |
| Noite com chuva e neon | `NIGHT` em `anim9.js`, `shot3`/`shot6` em `shots.js` | Cenas 1, 8, 9, 10 |
| Interior quente | `ROOM`/`COUNTER` em `anim4.js`, `DOOR` em `anim7.js` | Padaria, porta de casa |
| Consultório claro | `CLINIC` em `anim11.js` | Cena 11 |

**Cores de neon:** `#ff3cac`, `#3cf2ff`, `#ffd23c`, `#5dff7a`, `#b06bff`.

---

## 5. Linguagem de HQ (sem voz)

| Elemento | Como é | Função no código |
|---|---|---|
| **Recordatório** (narrador) | caixa amarela `#ffe066`, borda preta, sombra, Bangers 46 px, no canto superior esquerdo | `captionAt()` |
| **Balão de fala** | elipse branca com rabicho, Bangers 54 a 64 px | `speech(..., thought=false)` |
| **Balão de pensamento** | nuvem com bolinhas, Bangers | `speech(..., thought=true)` |
| **Onomatopeia** | Press Start 2P, letras tortas, contorno preto, sombra colorida, gradiente | `sfx(g, texto, x, y, tamanho, rotação, k, cores, sombra)` |
| **Ícone em balão** | pixel art desenhada com arrays de texto (`'.XX.XX.'`) | `icon()`, `iconBalloon()`, `pixIcon()` |
| **Cartão de RPG** (fatos reais) | caixa azul-escura `#0a1240`, borda branca, título amarelo, barras comparativas, desenhado já em 480×270 | `card()` em `anim7.js`, `rpgCard()` em `anim2.js` |
| **Quadro congelado** | moldura branca, tinta roxa, "NHAC!" gigante | `freezeOverlay()` / `freezeFrame()` |
| **Página de HQ** | 2×2 ou 3 colunas, quadros que entram um por vez | Cenas 3, 7, 9 |

**Regras de texto:**
- **Mínimo:** cerca de 25 palavras por minuto. Uma onomatopeia por momento.
- A fonte **Press Start 2P não tem letras acentuadas maiúsculas**. Nos cartões e onomatopeias escreva sem acento ("CAO", "ATE") ou use Bangers.
- Os fatos de cartão precisam ser reais e sem números inventados. Barras só comparativas.

---

## 6. Personagens

### Castanha (a cadela)
- **Raça e pelagem:** vira-lata caramelo. Focinho, peito e patas brancos. Olhos grandes de anime com dois brilhos.
- **Orelhas:** **uma em pé** (rosa por dentro) e **uma dobrada**. A dobrada precisa ficar **por cima da cabeça**, senão some (versão corrigida em `anim10.js` a `anim12.js`).
- **Nome:** na rua a chamam de **"Caramelo"**. Na adoção recebe a plaquinha **CASTANHA / COMPANHEIRA**. É **fêmea** ("AMIGA", "FOI ELA").
- **Expressão:** fala só por ícones, pensamentos nos momentos emocionais e onomatopeias.

| Cor | Valor |
|---|---|
| Base | `#d68a3a` |
| Luz | `#f0b265` |
| Sombra | `#a8601f` |
| Branco | `#f6efe4` |
| Pinceladas do pelo | `#7a400f` `#a8601f` `#cf8436` `#eaa555` `#ffd08a` |

### Otávio (~30 anos)
- Cabelo escuro bagunçado, olhar cansado (pálpebra pesada), barba por fazer.
- Casaco bege comprido, **cachecol vermelho** (a cor-assinatura), mochila cinza.

| Parte | Cor |
|---|---|
| Pele | `#f0c4a0` / `#d39a78` |
| Cabelo | `#2a2024` |
| Casaco | `#d8bf94` / `#b69c70` / `#8c7450` |
| Calça | `#2a3150` |
| Cachecol | `#b8343a` / `#86242c` |
| Mochila | `#6d727c` |

### Outros
- **Crianças (Cena 2):** menino (camisa branca, short azul, mochila vermelha) e menina (pele escura, marias-chiquinhas, saia azul, mochila verde).
- **Padeira e veterinária:** só mãos e mangas, sem rosto.
- **Gato preto (Cena 5):** gordo, olhos amarelos.
- **Carro:** sedã vermelho anos 80, faróis duplos, **sem logo**. Nunca mostrar impacto.

---

## 7. Biblioteca de desenho (funções prontas)

Cada `animN.js` copia as funções das cenas anteriores (os blocos "base"). Para começar uma cena nova, copie o topo da cena mais parecida.

| Função | Arquivo de origem | O que faz |
|---|---|---|
| `pixelate`, `bloom`, `grade`, `glow`, `rain`, `caption_`, `rimSil`, `drawCar`, `off`, `rng` | `shots.js` | Base comum (`window.SH`) |
| `shots[4]` com `SHOT4_DAY` | `shots.js` | **Close do olho da Castanha** (referência de qualidade aprovada) |
| `shots[8]` com `S8` | `shots.js` | Fachada da padaria ao amanhecer, porta de aço subindo |
| `dogSit(blink)` + `drawDog(g, img, x, y, escala, virar, rabo)` | `anim2.js` em diante | Castanha sentada de perfil, com pelo em pinceladas |
| `dogTrot(g, x, y, s, fase, movendo, {pal, happy, headUp, legsOut, tuck})` | `anim3.js`, estendida em `anim5.js` | Trotando, correndo, saltando, feliz, suja de lama (`pal: MUD`) |
| `otavio(g, x, y, s, fase, cabeça, {lean, armUp, smile, hop, spikes, wide, laugh, belly})` | `anim3.js`, estendida até `anim6.js` | Otávio de perfil andando, com expressões |
| `otHead(...)` | `anim6.js` | Só a cabeça (closes, risada) |
| `kneel(...)` | `anim6.js` (também em `anim12.js`) | Otávio ajoelhado, braços com cinemática inversa (`ik`) |
| `sit(...)` | `anim10.js` | Otávio sentado no meio-fio |
| `backMan(...)` | `anim8.js` | Otávio de costas, com o brilho do celular |
| `kid(...)` | `anim2.js` | Crianças correndo |
| `sideStreet(seed)` | `anim3.js` | Rua lateral longa (5 telas) com sobrados, fios e pedra portuguesa |
| `busStop`, `gate`, `awning`, `tree`, `bench`, `DOOR` | `anim3.js`, `anim7.js` | Objetos do bairro |
| `bread()`, `wallClock()`, `card()`, `heart()`, `star4()`, `splash()`, `puddle()` | `anim4.js` a `anim9.js` | Detalhes reaproveitáveis |

Para animar os bonecos:
- **Caminhada de verdade:** joelho dobra, tronco inclina, braço oposto à perna, corpo sobe e desce, cabelo e saia com atraso, sombra no chão. Membros afinam e têm um lado de sombra (`limb()`).
- **Ordem de desenho:** membros do lado de lá, corpo, membros do lado de cá. Saia e short **depois** das duas pernas.
- **Cache:** tudo que não muda entre quadros vira uma camada pronta (`layer()`/`off()`), para não redesenhar.

---

## 8. Câmera e planos que funcionaram

- Closes do rosto e do olho, com push-in lento.
- **Plano por cima do ombro** com o braço em primeiro plano desfocado (Cena 7).
- **Rack focus** com desfoque trocando entre camadas (Cenas 4 e 7).
- **Câmera baixa em poça** com reflexo do neon e ondas (Cena 8): substituiu a vista de cima, que foi reprovada.
- **Silhuetas com luz de contorno** contra o sol (finais das Cenas 6 e 10).
- **Recuo até a rua virar maquete** (tilt-shift) no final (Cena 12).
- **Zoom rápido** (crash zoom) para ligar dois planos (Cena 8).
- **Planos abertos:** o fundo precisa ser largo o bastante, sem bordas pretas, e a subida da câmera não pode tirar os personagens do quadro.

---

## 9. Som

**Motor:** `sfx/synth.py` (geradores), `sfx/mix.py` (posição, pan e masterização) e `sfx/loudness.py`. Lista dos geradores: `python3 -m sfx --list`.

Geradores usados:
- `pad`: fundo musical por acordes.
- `blip`: notas.
- `chime`: momentos de emoção.
- `pop`: balões, ícones e batidas.
- `click`: passos, patas e tique-taque.
- `whoosh`: movimentos e transições.
- `bandnoise`: chuva, motor, água e respiração.
- `impact`: um por cena no máximo.
- `riser`: subida de tensão.
- `scratch`: caneta.

Receita de uma cue:

```python
TIMELINE = "anime/timelineN.json"; OUT = "anime/out/cenaN.wav"; TARGET_LUFS = -14.0
def score(mix, tl):
    b = tl["beats"]
    mix.put_stereo(0, *pad(dur, [(0, ACORDE1), (b["virada"], ACORDE2)], volume=env), gain=0.035)
    mix.put(b["evento"], pop(500, 900), 0.25, pan)
```

Convenções:
- Os acordes mudam junto com a emoção da cena:
  - Fá maior para o calor.
  - Lá menor ou um acorde diminuto para a tensão.
  - Dó maior para o fim.
- **Batida de coração** (dois `pop` graves) para a tensão (Cenas 8 e 9).
- **Silêncio total** depois do clímax (Cena 9).
- Cada onomatopeia na tela tem um som no mesmo quadro.
- `bandnoise` devolve uma lista, então o volume vai no argumento de ganho do `put`, nunca multiplicado.

---

## 10. Formato do timeline

```json
{
  "fps": 24, "duration": 30,
  "shots": [ { "id": 1, "start": 0.0, "end": 6.5, "name": "descrição" } ],
  "beats": { "cap1": 1.0, "click": 8.6 }
}
```

O mesmo arquivo serve para o vídeo (`animN.js`) e para o som (`cenaN.py`). Mude o tempo de um evento só aqui.

---

## 11. Comandos

```bash
cd claude-motion/anime
# se faltar node_modules
npm i --prefix ../pilot @fontsource/bangers @fontsource/press-start-2p && ln -sfn ../pilot/node_modules node_modules
python3 -m http.server 8124 &          # servidor local obrigatório

# stills para revisão
node capture.mjs --page animN.html --prefix sN --stills 3,9.5,15
# cena inteira (rodar em segundo plano)
node capture.mjs --page animN.html --to 30 --out out/cenaN-silent.mp4
# só um trecho, para emendar
node capture.mjs --page animN.html --from 21.5 --to 30 --out out/trecho.mp4

# som
cd .. && python3 -m sfx sfx/cues/cenaN.py
# juntar som e vídeo
ffmpeg -y -i anime/out/cenaN-silent.mp4 -i anime/out/cenaN.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest anime/out/cenaN.mp4

# emendar um trecho com exatidão de quadro (exemplo: trocar de 21,5 s até o fim)
ffmpeg -i cena-velha.mp4 -i trecho.mp4 -filter_complex "[0:v]trim=end_frame=516,setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1[v]" -map "[v]" -c:v libx264 -crf 16 -pix_fmt yuv420p -r 24 cena-nova-silent.mp4

# história completa (12 cenas)
ffmpeg -i cena1.mp4 ... -i cena12.mp4 -filter_complex "[0:v][0:a]...[11:v][11:a]concat=n=12:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart historia-XX-completa.mp4
# conferir loudness
ffmpeg -i historia-XX-completa.mp4 -filter_complex ebur128=peak=true -f null -
```

- **Commits:** identidade `Claude <noreply@anthropic.com>`, push com `git -c push.negotiate=true push`.
- **Arquivos fora do GitHub:** os MP4 e WAV ficam em `anime/out/` (ignorada pelo git). Baixe do chat ou gere de novo pelo código.

---

## 12. Tempos de produção (referência)

| Etapa | Tempo |
|---|---|
| Código de uma cena nova | 1 a 2 rodadas de stills e correção |
| Render de 30 s | cerca de 15 min (até 3 cenas em paralelo numa máquina de 4 núcleos) |
| Som de uma cena | alguns segundos para renderizar |
| História completa (12 cenas) | cerca de 6 min de vídeo e ~212 MB |

---

## 13. Aprendizados e erros a evitar

- O **servidor local** (`http.server 8124`) cai quando o ambiente reinicia. Ligue de novo antes de renderizar.
- **Cortar com `-c copy`** no ffmpeg corta em quadro-chave e perde quadros. Para emendar, use `trim=end_frame=` com recodificação.
- Ao virar um personagem com `scale(-1, 1)`, confira para onde ele olha.
- A orelha dobrada da Castanha desenhada **atrás** da cabeça some. Desenhe por cima.
- Brilho e feixe de luz fortes demais lavam os personagens. Use transparência de 0,2 a 0,3.
- Balões precisam apontar para quem fala ou pensa. Confira o rabicho em cada still.
- Desenhos simples de corpo inteiro (vista de cima, de costas, de frente) foram os pontos mais criticados. Prefira close, plano médio ou silhueta.
- Pergunte antes de cada cena. O dono escolhe entre opções, e as mudanças pedidas depois de ver o vídeo são refeitas só no trecho afetado.

---

## 14. Pendências da História 1

- Nas Cenas 2, 3, 4, 6 e 7, a Castanha sentada ainda aparece com uma orelha só. A correção está pronta em `anim10.js` a `anim12.js`; falta aplicar nessas cenas e renderizar de novo.
- Mãos simples, a veterinária só como braço e o Otávio de frente na Cena 8 ainda são pontos fracos.

---

## 15. Checklist para a próxima história

1. Ficha dos personagens (cores em hexadecimal, traços, gênero, nome e apelido).
2. Luz e cenário de cada cena (use as luzes da seção 4 quando der).
3. Perguntas ao dono, cena por cena.
4. `timelineN.json` → `animN.js` → stills → correções → render → som → MP4 → aprovação.
5. Shorts: cada cena isolada serve (ver `roteiros/shorts-teste.md` e `anime/vertical.mjs`).
6. No fim, juntar as cenas, medir −14 LUFS, título e comentário fixado do roteiro.
