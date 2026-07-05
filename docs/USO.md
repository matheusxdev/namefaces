# namefaces — guia de uso

Pacote: **https://www.npmjs.com/package/namefaces**

Cada nome ganha um rosto próprio. Em vez do mesmo ícone genérico para todo mundo, o namefaces dá identidade visual para clientes, usuários, equipe e contatos.

---

## Instalação

```bash
npm install namefaces
```

Alternativas:

```bash
yarn add namefaces
pnpm add namefaces
```

**React:** o pacote inclui `namefaces/react`. É necessário React 17+ no projeto (peer dependency).

---

## Conceito rápido

Você passa um **nome** e recebe um **avatar SVG**.

- Se o nome tem **rosto próprio** no mapa → usa esse rosto
- Se não tem → gera **iniciais** dinamicamente (ex.: `Matheus` → **M**, `Matheus Oliveira` → **MO**)
- O mesmo nome **sempre** gera o mesmo resultado

---

## Iniciais (novo em v0.2)

Por padrão, nomes **sem rosto próprio** recebem iniciais em um círculo — no mesmo estilo de traço dos rostos.

| Entrada | Iniciais |
| ------- | -------- |
| `Matheus` | `M` |
| `Matheus Oliveira` | `MO` |
| `Ana` | `A` |

Máximo **2 letras** (primeiro nome + último sobrenome).

### Tipo (`kind`)

| Valor | Comportamento |
| ----- | ------------- |
| `auto` (padrão) | rosto se existir, senão iniciais |
| `face` | tenta rosto; sem match usa `fallback` |
| `initials` | sempre iniciais, mesmo que exista rosto |

```ts
import { getAvatarSvg, extractInitials } from 'namefaces'

getAvatarSvg('Lucas')                          // iniciais "L"
getAvatarSvg('Matheus', { kind: 'initials' })  // força "M"
getAvatarSvg('Lucas', { kind: 'face', fallback: 'pool' }) // pool antigo
```

### Cores e fonte das iniciais

```ts
getAvatarSvg('Maria Silva', {
  kind: 'initials',
  background: '#EDE9FE',
  text: '#4C1D95',       // cor das letras
  font: 'brand',         // padrão — Fraunces
})

// fontes: 'brand' | 'sans' | 'rounded' | string CSS
getAvatarSvg('João', { kind: 'initials', font: 'sans' })
```

### Retorno

```ts
const avatar = getAvatar('Lucas Ferreira')
avatar.render    // 'initials' | 'face' | 'pool'
avatar.initials  // 'LF' quando render === 'initials'
avatar.matched   // true se existe rosto próprio (mesmo exibindo iniciais)
```

---

## Uso básico (JavaScript / TypeScript)

```ts
import {
  getAvatarSvg,
  getAvatarDataUri,
  getAvatar,
  hasAvatar,
  listKnownNames,
} from 'namefaces'

// SVG como string
const svg = getAvatarSvg('Maria Silva')

// Para usar em <img src="...">
const src = getAvatarDataUri('Maria Silva')

// Objeto completo (útil para lógica no app)
const avatar = getAvatar('Maria Silva')
console.log(avatar.matched) // true = rosto próprio
console.log(avatar.id)      // ex: "maria"
console.log(avatar.svg)
console.log(avatar.dataUri)
console.log(avatar.size)    // 80 (padrão)
```

### Inserir no HTML

**Opção 1 — `<img>` com data URI**

```html
<img id="avatar" width="64" height="64" alt="Maria" />
```

```js
import { getAvatarDataUri } from 'namefaces'

document.getElementById('avatar').src = getAvatarDataUri('Maria', { size: 64 })
```

**Opção 2 — SVG inline**

```js
import { getAvatarSvg } from 'namefaces'

element.innerHTML = getAvatarSvg('Maria', { size: 64 })
```

---

## React

```tsx
import { NameFace } from 'namefaces/react'

export function UserRow({ nome }: { nome: string }) {
  return (
    <div className="flex items-center gap-3">
      <NameFace name={nome} size={40} />
      <span>{nome}</span>
    </div>
  )
}
```

**Com cores da sua marca:**

```tsx
<NameFace
  name="Ana Costa"
  size={48}
  background="#EDE9FE"
  hair="#4C1D95"
  skin="#FFFFFF"
  features="#111111"
/>
```

**Como `<img>` em vez de SVG inline:**

```tsx
<NameFace name="João" size={40} as="img" />
```

### Listagem de clientes (exemplo completo)

```tsx
import { NameFace } from 'namefaces/react'
import { hasAvatar } from 'namefaces'

const clientes = [
  { id: 1, nome: 'Maria Silva' },
  { id: 2, nome: 'Lucas Ferreira' },
  { id: 3, nome: 'Bruna Santos' },
]

export function ListaClientes() {
  return (
    <ul>
      {clientes.map((c) => (
        <li key={c.id} className="flex items-center gap-3 py-2">
          <NameFace
            name={c.nome}
            size={44}
            mode="auto"
            background="#F3F4F6"
            hair="#111111"
          />
          <div>
            <strong>{c.nome}</strong>
            {!hasAvatar(c.nome, { mode: 'auto' }) && (
              <span className="text-xs text-gray-500"> · rosto genérico</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
```

---

## Vue 3

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { getAvatarSvg } from 'namefaces'

const props = defineProps<{ nome: string; size?: number }>()

const svg = computed(() =>
  getAvatarSvg(props.nome, { size: props.size ?? 40 }),
)
</script>

<template>
  <span
    class="avatar"
    :style="{ width: `${size ?? 40}px`, height: `${size ?? 40}px` }"
    v-html="svg"
  />
</template>

<style scoped>
.avatar {
  display: inline-block;
  border-radius: 999px;
  overflow: hidden;
  line-height: 0;
}
.avatar :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
```

---

## Opções (`AvatarOptions`)

Todas as funções aceitam o mesmo objeto de opções:

| Opção        | Tipo                                      | Padrão     | Descrição              |
| ------------ | ----------------------------------------- | ---------- | ---------------------- |
| `size`       | `number`                                  | `80`       | Tamanho em pixels      |
| `mode`       | `'first' \| 'last' \| 'full' \| 'auto'`   | `'first'`  | Como extrair o nome para **rostos** |
| `kind`       | `'auto' \| 'face' \| 'initials'`          | `'auto'`   | Rosto, iniciais ou automático       |
| `fallback`   | `'initials' \| 'pool'`                    | `'initials'` | Se `kind: 'face'` e sem rosto   |
| `font`       | `'brand' \| 'sans' \| 'rounded' \| string`| `'brand'`  | Fonte das iniciais                  |
| `background` | `string`                                  | `#E8E8E8`  | Cor do fundo circular               |
| `text`       | `string`                                  | `#111111`  | Cor das iniciais                    |
| `hair`       | `string`                                  | `#111111`  | Cor do cabelo (rostos)              |
| `skin`       | `string`                                  | `#FFFFFF`  | Cor da pele/rosto                   |
| `features`   | `string`                                  | `#111111`  | Traços do rosto; fallback de `text` |

```ts
getAvatarSvg('Matheus', {
  size: 64,
  mode: 'auto',
  background: '#DBEAFE',
  hair: '#1D4ED8',
})
```

---

## Modos de nome (`mode`)

Por padrão usa só o **primeiro nome**.

| Modo    | Entrada         | Comportamento                                              |
| ------- | --------------- | ---------------------------------------------------------- |
| `first` | `Matheus Silva` | usa `matheus`                                              |
| `last`  | `Matheus Silva` | usa `silva`                                                |
| `full`  | `Matheus Silva` | tenta `matheus-silva`; se não existir, cai no primeiro nome |
| `auto`  | `Matheus Silva` | tenta full → first → last; sem rosto → iniciais              |

```ts
getAvatarSvg('Matheus Silva')                     // matheus
getAvatarSvg('Matheus Silva', { mode: 'last' })   // silva
getAvatarSvg('Matheus Silva', { mode: 'auto' })   // melhor match disponível
```

**Acentos e maiúsculas não importam:** `José`, `jose`, `JOSE` → mesmo rosto.

---

## Rostos próprios (v0.1.0)

**Primeiros nomes:** ana, bruna, clevison, joao, marcelo, maria, matheus, yasmin

**Sobrenomes:** silva

Listar no código:

```ts
import { listKnownNames } from 'namefaces'

const { first, last, full } = listKnownNames()
console.log(first) // ['ana', 'bruna', 'clevison', ...]
console.log(last)  // ['silva']
```

Verificar se tem rosto próprio:

```ts
hasAvatar('Maria')                       // true
hasAvatar('Lucas')                       // false (mostra iniciais "L")
hasAvatar('Silva', { mode: 'last' })     // true
```

---

## API completa

```ts
import {
  getAvatar,        // AvatarResult completo
  getAvatarSvg,     // string SVG
  getAvatarDataUri, // data:image/svg+xml,... para <img>
  hasAvatar,        // boolean — rosto próprio no mapa
  listKnownNames,   // { first, last, full }
  extractInitials,  // 'Matheus Oliveira' → 'MO'
} from 'namefaces'

import { INITIALS_FONTS, DEFAULT_INITIALS_FONT } from 'namefaces'

import type {
  AvatarOptions,
  AvatarResult,
  AvatarMode,
  AvatarColors,
} from 'namefaces'

import { DEFAULT_COLORS, DEFAULT_SIZE } from 'namefaces'
```

### Retorno de `getAvatar()`

```ts
{
  id: 'maria',           // id do avatar usado
  key: 'maria',          // chave resolvida
  mode: 'first',         // modo efetivo
  matched: true,         // true = rosto próprio existe no mapa
  render: 'face',        // 'face' | 'initials' | 'pool'
  initials: 'MO',        // presente quando render === 'initials'
  gender: 'female',
  svg: '<svg>...</svg>',
  dataUri: 'data:image/svg+xml,...',
  size: 64,
  colors: { background, hair, skin, features }
}
```

### React — props do `NameFace`

| Prop         | Descrição                              |
| ------------ | -------------------------------------- |
| `name`       | nome da pessoa                         |
| `size`       | tamanho em pixels                      |
| `mode`       | `first`, `last`, `full` ou `auto`      |
| `background` | cor de fundo                           |
| `hair`       | cor do cabelo                          |
| `skin`       | cor da pele                            |
| `features`   | cor dos traços                         |
| `as`         | `"svg"` (padrão) ou `"img"`            |
| `className`  | classe CSS                             |
| `style`      | estilo inline                          |
| `title`      | label acessível (padrão: o nome)       |

---

## CDN (sem instalar)

```html
<img id="avatar" width="64" height="64" alt="Maria" />

<script type="module">
  import { getAvatarDataUri } from 'https://cdn.jsdelivr.net/npm/namefaces@0.1.0/+esm'

  document.getElementById('avatar').src = getAvatarDataUri('Maria', { size: 64 })
</script>
```

Em produção, fixe a versão: `@0.1.0`.

---

## Next.js / SSR

Funciona em Server Components e API routes — não depende de browser:

```tsx
import { getAvatarSvg } from 'namefaces'

export function Avatar({ name }: { name: string }) {
  const svg = getAvatarSvg(name, { size: 40 })
  return (
    <span
      style={{ display: 'inline-block', width: 40, height: 40 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
```

Ou use `<NameFace as="img" />` no client.

---

## Dicas práticas

1. **Listagens:** use `mode: 'auto'` para tentar o melhor match
2. **Tamanhos comuns:** 32, 40, 48, 64 px
3. **Cores:** alinhe `background` e `hair` com o tema do app
4. **Fallback:** iniciais por padrão; use `{ kind: 'face', fallback: 'pool' }` para o comportamento antigo
5. **Badge opcional:** use `hasAvatar()` se quiser mostrar “rosto próprio” vs genérico

---

## Licença (resumo)

- Uso livre em apps pessoais e comerciais
- Não pode revender a lib como produto pago de avatars
- Detalhes: [LICENSE](../LICENSE)

---

## Atualizar versão no seu projeto

Quando sair uma versão nova com mais rostos:

```bash
npm update namefaces
# ou
npm install namefaces@latest
```

Para novos rostos, prefira `patch` (ex.: `0.1.0` → `0.1.1`).
