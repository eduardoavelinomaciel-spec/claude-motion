# Shorts de teste · validar o estilo antes de produzir o resto

Três Shorts verticais (1080×1920, 24 fps) feitos das Cenas 1, 2 e 3 da História 1, no formato "página de HQ": a cena no quadro central, a frase-gancho em cima e o selo do canal embaixo.

Gerar de novo:
```bash
cd anime && python3 -m http.server 8124 &
node vertical.mjs s1        # s2, s3 · enquadramento por plano em shorts.json
cd .. && python3 -m sfx sfx/cues/cena1.py
ffmpeg -i anime/out/short-s1-silent.mp4 -i anime/out/cena1.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest anime/out/short-s1.mp4
```

## Publicação

| | Parte 1 | Parte 2 | Parte 3 |
|---|---|---|---|
| Arquivo | `short-s1.mp4` (30 s) | `short-s2.mp4` (34 s) | `short-s3.mp4` (33 s) |
| Título | Ele não viu o carro. O cachorro viu. 🐶 Parte 1 | Toda manhã ele espera alguém que não vem 🥖 Parte 2 | Ele passava todo dia sem olhar para o lado 💔 Parte 3 |
| 🇺🇸 | He didn't see the car. The dog did. Part 1 | Every morning he waits for someone who never comes. Part 2 | He walked by every day without looking. Part 3 |
| Dia | 1 | 2 | 3 |

- **Horário:** de 18h a 20h (horário de Brasília), um por dia, sempre no mesmo horário.
- **Descrição:** *"Uma história sem palavras, contada só com imagens e balões de HQ. Parte [N] de O Homem e o Cachorro da Rua. #animação #histórias #pixelart"*
- **Vídeo relacionado (link no Short):** a Parte 2 aponta para a 1, a 3 para a 2. Quando a história completa sair, todos passam a apontar para ela.
- **Comentário fixado:** *"A Parte [N+1] sai amanhã. O que você acha que o Caramelo vai fazer? 🐶"*
- **Playlist:** "O Homem e o Cachorro da Rua", com as partes em ordem.
- Marcar **"Não é conteúdo para crianças"**.

## Como ler o resultado (48 h depois de cada Short)

YouTube Studio → o Short → Análise → **"Visualizaram" vs. "Deslizaram"**.

| Resultado | O que significa | Ação |
|---|---|---|
| Acima de 70% | O estilo e o gancho prendem | Seguir com a produção. Esse primeiro plano vira referência. |
| 55 a 70% | O estilo funciona, o gancho não | Trocar só o primeiro segundo (frase de cima ou primeiro plano) e publicar como Short novo |
| Abaixo de 55% | O primeiro segundo não segura | Abrir com close + movimento + texto curto (ex.: começar no olho do Caramelo) |

Olhe também:
- **Retenção média acima de 80%** (em Shorts de 30 s): o ritmo está bom. Se houver queda num ponto, anote o segundo e veja o que acontece na cena.
- **Repetições e compartilhamentos:** o momento que as pessoas repetem é o que vai para a miniatura e o título do vídeo longo.
- **Comentários:** se pedirem "parte 2", o formato em partes está funcionando.

**Regra de ouro:** não julgue o canal por 3 Shorts. Eles medem o **estilo**. O canal só é avaliado depois de 30 Shorts.

## Variações de gancho para a próxima rodada (se precisar)

| Short | Variação A | Variação B |
|---|---|---|
| Parte 1 | Começar no olho do Caramelo com o reflexo dos faróis | Começar no "NHAC!" congelado e voltar |
| Parte 2 | Começar no "BOM DIA, CARAMELO!" | Começar no cartão de RPG ("50× MAIS FARO") |
| Parte 3 | Começar no "!!" do Caramelo vendo o Otávio | Começar no close da cabeça inclinada |

---

## Correção: a cachorra é fêmea

Na outra conversa, o cachorro virou **Castanha** (fêmea). Na rua a chamam de "Caramelo" e o nome Castanha vem na adoção. O gancho do Short 2 foi refeito: **"TODA MANHÃ ELA ESPERA ALGUÉM QUE NÃO VEM."** Use "a Caramelo", "ela", nos textos.

---

## Shorts extras (para os dias sem parte nova)

Gerar: `node extras.mjs bastidor1` / `node extras.mjs faro` (em `anime/`, com o servidor 8124 ligado). Cortes em `extras.json`; o som vem da cena, nos mesmos cortes.

### Bastidor 1 · "Animei esta chuva só com código" (~19 s)
- **Título:** `Animei esta chuva só com código (sem IA) 🌧️`
- **Descrição:**
```
Nada de IA: cada gota de chuva, cada luz neon e cada pixel desta cena foram escritos em código.

Primeiro o desenho é feito em 1920×1080, depois um filtro reduz tudo para 480×270 com 12 níveis de cor. Esse é o "antes e depois" que você viu.

A história completa da Castanha está no canal. 🐶

#HistoriasQueAquecem #pixelart #animacao #programacao #creativecoding #shorts
```
- **Comentário fixado:** `Quer ver como o olho da Castanha foi desenhado? Esse é o próximo bastidor. 👁️`
- **Capa:** o quadro do antes e depois no olho.
- **Vídeo relacionado:** o Short 1 (ou a história completa, quando sair).

### Você sabia? · O faro dela (~15 s)
- **Título:** `O nariz de um cachorro sente 50 vezes mais que o seu 🐶👃`
- **Descrição:**
```
Um cachorro tem cerca de 300 milhões de receptores de cheiro. Um humano, só 6 milhões.
É por isso que a Castanha sente o pão da padaria do outro lado da rua. 🥖

Trecho de "O Homem e o Cachorro da Rua", uma história sem palavras.

#HistoriasQueAquecem #cachorro #curiosidades #animacao #pixelart #shorts
```
- **Comentário fixado:** `Qual é a coisa mais longe que o seu cachorro já farejou? 👇`
- **Capa:** o cartão de RPG ("50× MAIS FARO!").
- **Vídeo relacionado:** o Short 2.
