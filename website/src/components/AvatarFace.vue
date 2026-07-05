<script setup lang="ts">
import { computed } from 'vue'
import { getAvatarSvg, type AvatarOptions } from 'namefaces'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    background?: string
    hair?: string
    skin?: string
    features?: string
    mode?: AvatarOptions['mode']
    kind?: AvatarOptions['kind']
    font?: AvatarOptions['font']
    text?: string
  }>(),
  {
    size: 80,
    mode: 'first',
  },
)

const svg = computed(() =>
  getAvatarSvg(props.name, {
    size: props.size,
    mode: props.mode,
    kind: props.kind,
    background: props.background,
    hair: props.hair,
    skin: props.skin,
    features: props.features,
    text: props.text,
    font: props.font,
  }),
)
</script>

<template>
  <span
    class="avatar-face"
    :style="{ width: `${size}px`, height: `${size}px` }"
    v-html="svg"
  />
</template>

<style scoped>
.avatar-face {
  display: inline-flex;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 999px;
  line-height: 0;
}

.avatar-face :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
