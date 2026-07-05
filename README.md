# namefaces

**Cada nome ganha um rosto próprio.**

Em vez do mesmo ícone genérico para todo mundo, o namefaces dá identidade visual para cada pessoa da sua listagem — clientes, usuários, equipe, contatos.

**npm:** [namefaces@0.2.0](https://www.npmjs.com/package/namefaces) · **Guia completo:** [docs/USO.md](./docs/USO.md)

---

## Por que usar

- Listagens de clientes com cara de gente de verdade
- Perfis sem foto, sem parecer todos iguais
- Identidade estável: o mesmo nome sempre mostra o mesmo avatar
- **Iniciais automáticas** quando ainda não há rosto desenhado (`M`, `MO`, `LF`…)
- Leve, em SVG, e fácil de colorir

---

## Instalação

```bash
npm install namefaces
```

---

## Uso rápido

### JavaScript

```js
import { getAvatarSvg, getAvatarDataUri } from 'namefaces'

// Com rosto próprio → rosto; senão → iniciais
const svg = getAvatarSvg('Matheus Silva')
const src = getAvatarDataUri('Lucas Ferreira') // iniciais "LF"
```

### React

```tsx
import { NameFace } from 'namefaces/react'

export function Cliente({ nome }) {
  return <NameFace name={nome} size={40} />
}
```

---

## Iniciais (v0.2)

Por padrão, nomes **sem rosto próprio** recebem iniciais dinâmicas:

| Entrada | Iniciais |
| --- | --- |
| `Matheus` | `M` |
| `Matheus Oliveira` | `MO` |
| `Lucas Ferreira` | `LF` |

Máximo **2 letras**. Fundo redondo, traço consistente, fonte **brand** (Fraunces) por padrão.

```js
import { getAvatarSvg, extractInitials } from 'namefaces'

extractInitials('Matheus Oliveira') // "MO"

getAvatarSvg('Lucas') // iniciais (padrão)

getAvatarSvg('Matheus', { kind: 'initials' }) // força iniciais

getAvatarSvg('Lucas Ferreira', {
  kind: 'initials',
  background: '#EDE9FE',
  text: '#4C1D95',
  font: 'brand', // brand | sans | rounded
})

// Comportamento antigo (pool genérico)
getAvatarSvg('Lucas', { kind: 'face', fallback: 'pool' })
```

### Tipo (`kind`)

| Valor | Comportamento |
| --- | --- |
| `auto` (padrão) | rosto se existir, senão iniciais |
| `face` | tenta rosto; sem match usa `fallback` |
| `initials` | sempre iniciais |

---

## Cores

### Rostos

| Opção | Padrão |
| --- | --- |
| `background` | `#E8E8E8` |
| `hair` | `#111111` |
| `skin` | `#FFFFFF` |
| `features` | `#111111` |

### Iniciais

| Opção | Padrão |
| --- | --- |
| `background` | `#E8E8E8` |
| `text` | `#111111` |
| `font` | `brand` |

```js
getAvatarSvg('Ana', {
  size: 64,
  background: '#F3E8FF',
  hair: '#4C1D95',
})
```

---

## Nome, sobrenome ou nome completo

| Modo | Exemplo | Comportamento |
| --- | --- | --- |
| `first` | `Matheus Silva` | usa `matheus` |
| `last` | `Matheus Silva` | usa `silva` |
| `full` | `Matheus Silva` | tenta `matheus-silva` |
| `auto` | `Matheus Silva` | full → first → last; sem rosto → iniciais |

Acentos não importam: `José`, `jose` e `JOSÉ` apontam para o mesmo resultado.

---

## Nomes com rosto próprio (v0.2.0)

**Primeiros nomes:** ana, bruna, clevison, joao, marcelo, maria, matheus, yasmin

**Sobrenomes:** silva

```js
import { listKnownNames, hasAvatar } from 'namefaces'

listKnownNames()
hasAvatar('Matheus') // true
hasAvatar('Lucas')   // false → iniciais
```

---

## API

```js
import {
  getAvatar,
  getAvatarSvg,
  getAvatarDataUri,
  hasAvatar,
  listKnownNames,
  extractInitials,
  INITIALS_FONTS,
} from 'namefaces'
```

| Função | Retorno |
| --- | --- |
| `getAvatar(nome, opcoes?)` | `{ svg, dataUri, matched, render, initials?, ... }` |
| `getAvatarSvg(nome, opcoes?)` | string SVG |
| `getAvatarDataUri(nome, opcoes?)` | data URI para `<img>` |
| `hasAvatar(nome, opcoes?)` | `true` se existe rosto próprio |
| `extractInitials(nome)` | `"M"`, `"MO"`, etc. |

**`render`:** `'face'` | `'initials'` | `'pool'`

### React — `NameFace`

| Prop | Descrição |
| --- | --- |
| `name` | nome da pessoa |
| `size` | pixels |
| `mode` | `first`, `last`, `full`, `auto` |
| `kind` | `auto`, `face`, `initials` |
| `fallback` | `initials`, `pool` |
| `background`, `hair`, `skin`, `features`, `text` | cores |
| `font` | `brand`, `sans`, `rounded` ou CSS |
| `as` | `"svg"` ou `"img"` |

---

## CDN

```html
<script type="module">
  import { getAvatarDataUri } from 'https://cdn.jsdelivr.net/npm/namefaces@0.2.0/+esm'

  document.getElementById('avatar').src = getAvatarDataUri('Maria')
</script>
```

---

## Licença

Uso livre em apps comerciais. Não revenda a lib como produto pago de avatars. Ver [LICENSE](./LICENSE).

---

Feito para dar identidade às pessoas do seu app.
