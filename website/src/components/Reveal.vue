<script setup lang="ts">
import { ref } from 'vue'
import { useReveal } from '../composables/useReveal'

const props = withDefaults(
  defineProps<{
    delay?: 0 | 1 | 2 | 3
  }>(),
  { delay: 0 },
)

const root = ref<HTMLElement | null>(null)
const { visible } = useReveal(root)
</script>

<template>
  <div
    ref="root"
    class="reveal"
    :class="[
      { 'is-visible': visible },
      props.delay ? `reveal-delay-${props.delay}` : '',
    ]"
  >
    <slot />
  </div>
</template>
