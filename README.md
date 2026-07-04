# namefaces

**Cada nome ganha um rosto próprio.**

Em vez do mesmo ícone genérico para todo mundo, o namefaces dá uma identidade visual para cada pessoa da sua listagem — clientes, usuários, equipe, contatos.

---

## Por que usar

- Listagens de clientes com cara de gente de verdade
- Perfis sem foto, sem parecer todos iguais
- Identidade estável: o mesmo nome sempre mostra o mesmo rosto
- Leve, em SVG, e fácil de colorir

---

## Instalação

```bash
npm install namefaces
```

```bash
yarn add namefaces
```

```bash
pnpm add namefaces
```

---

## Uso rápido

### JavaScript

```js
import { getAvatarSvg, getAvatarDataUri } from 'namefaces'

const svg = getAvatarSvg('Matheus Silva')
const src = getAvatarDataUri('Yasmin')
```

No HTML:

```html
<img id="avatar" width="64" height="64" alt="Yasmin" />
<script type="module">
  import { getAvatarDataUri } from 'namefaces'

  document.getElementById('avatar').src = getAvatarDataUri('Yasmin')
</script>
```

### React

```tsx
import { NameFace } from 'namefaces/react'

export function Cliente({ nome }) {
  return <NameFace name={nome} size={40} />
}
```

---

## Cores

Você pode pintar cada parte do rosto:

| Opção | O que muda | Padrão |
| --- | --- | --- |
| `background` | fundo redondo | `#E8E8E8` |
| `hair` | cabelo | `#111111` |
| `skin` | rosto | `#FFFFFF` |
| `features` | olhos, nariz, boca, traços e acessórios | `#111111` |

```js
import { getAvatarSvg } from 'namefaces'

getAvatarSvg('Ana', {
  size: 64,
  background: '#F3E8FF',
  hair: '#4C1D95',
  skin: '#FFF7ED',
  features: '#1F2937',
})
```

```tsx
<NameFace
  name="João"
  size={48}
  background="#DBEAFE"
  hair="#1E3A8A"
  features="#0F172A"
/>
```

---

## Nome, sobrenome ou nome completo

Por padrão, o namefaces usa o **primeiro nome**.

```js
getAvatarSvg('Matheus Silva')
// usa o rosto de "matheus"
```

Se quiser outro recorte:

| Modo | Exemplo | Comportamento |
| --- | --- | --- |
| `first` | `Matheus Silva` | usa `matheus` |
| `last` | `Matheus Silva` | usa `silva` |
| `full` | `Matheus Silva` | tenta `matheus-silva`, senão cai no primeiro nome |
| `auto` | `Matheus Silva` | tenta nome completo, depois primeiro nome, depois sobrenome |

```js
getAvatarSvg('Matheus Silva', { mode: 'last' })
getAvatarSvg('Matheus Silva', { mode: 'auto' })
```

Acentos não importam: `José`, `jose` e `JOSÉ` apontam para o mesmo rosto.

---

## Quando o nome ainda não tem rosto próprio

Se o nome ainda não estiver no mapa, o namefaces escolhe um rosto estável do conjunto geral.

Assim sua listagem nunca fica sem avatar.

Para saber se existe identidade própria:

```js
import { hasAvatar } from 'namefaces'

hasAvatar('Matheus') // true
hasAvatar('NomeRaro') // false
```

---

## Nomes com rosto próprio nesta versão

**Primeiros nomes:** ana, joao, maria, matheus, yasmin

**Sobrenomes:** silva

A coleção cresce com o tempo. Quanto mais nomes entrarem, mais gente ganha identidade própria.

Para listar tudo no código:

```js
import { listKnownNames } from 'namefaces'

console.log(listKnownNames())
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
} from 'namefaces'
```

| Função | Retorno |
| --- | --- |
| `getAvatar(nome, opcoes?)` | objeto com `svg`, `dataUri`, `matched`, cores e tamanho |
| `getAvatarSvg(nome, opcoes?)` | texto SVG pronto |
| `getAvatarDataUri(nome, opcoes?)` | endereço para usar em `<img src="...">` |
| `hasAvatar(nome, opcoes?)` | `true` se o nome tem rosto próprio |
| `listKnownNames()` | nomes e sobrenomes já mapeados |

### React

```tsx
import { NameFace } from 'namefaces/react'
```

| Prop | Descrição |
| --- | --- |
| `name` | nome da pessoa |
| `size` | tamanho em pixels |
| `mode` | `first`, `last`, `full` ou `auto` |
| `background`, `hair`, `skin`, `features` | cores |
| `as` | `"svg"` (padrão) ou `"img"` |
| `className`, `style`, `title` | apresentação |

---

## Usar sem instalar (CDN)

Depois que o pacote estiver no npm, o [jsDelivr](https://www.jsdelivr.com/) serve os arquivos automaticamente:

```html
<script type="module">
  import { getAvatarDataUri } from 'https://cdn.jsdelivr.net/npm/namefaces@0.1.0/+esm'

  document.getElementById('avatar').src = getAvatarDataUri('Maria')
</script>
```

Prefira sempre uma versão fixa (`@0.1.0`) em produção.

---

## Licença

Você pode usar o namefaces de graça, inclusive em produtos e sites do trabalho.

O que não pode: vender esta biblioteca (ou um pedaço grande dela) como um produto pago de avatars.

Detalhes em [LICENSE](./LICENSE).

---

## Contribuir

Quer adicionar um rosto novo?

1. Crie um arquivo em `src/avatars/first/`, `src/avatars/last/` ou `src/avatars/full/`
2. Use o mesmo formato dos avatars existentes (`createAvatarSvg`)
3. Registre o nome em `src/avatars/index.ts`
4. Rode `npm run validate` e `npm run build`

Cada rosto precisa das partes `background`, `hair`, `skin` e `features`, no `viewBox` `0 0 80 80`.

---

Feito para dar identidade às pessoas do seu app.
