import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useReveal(root: Ref<HTMLElement | null>) {
  const visible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!root.value) return

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          visible.value = true
          observer?.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(root.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { visible }
}
