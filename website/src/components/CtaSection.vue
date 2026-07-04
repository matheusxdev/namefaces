<script setup lang="ts">
import AvatarFace from './AvatarFace.vue'
import Reveal from './Reveal.vue'
</script>

<template>
  <section class="section">
    <div class="container">
      <Reveal>
        <div class="cta card">
          <div class="faces">
            <AvatarFace name="Yasmin" :size="52" background="#F7F4EE" />
            <AvatarFace name="Matheus" :size="52" hair="#4C1D95" background="#EDE9FE" />
            <AvatarFace name="Ana" :size="52" hair="#0F766E" background="#DCFCE7" />
            <AvatarFace name="João" :size="52" hair="#1D4ED8" background="#DBEAFE" />
          </div>

          <h2 class="serif">Nunca mais pergunte “quem é essa pessoa?”</h2>
          <p class="muted">
            Dê ao seu produto uma forma simples de manter pessoas visíveis
            enquanto a base cresce.
          </p>

          <div class="actions">
            <a class="btn btn-primary" href="#como-usar">Instalar namefaces</a>
            <a
              class="btn btn-secondary"
              href="https://github.com/matheusxdev/namefaces"
              target="_blank"
              rel="noreferrer"
            >
              Ver no GitHub
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding: 56px 28px;
  text-align: center;
  background:
    radial-gradient(circle at top, rgba(91, 79, 224, 0.12), transparent 42%),
    #fff;
}

.faces {
  display: inline-flex;
  margin-bottom: 18px;
}

.faces :deep(.avatar-face) {
  margin-left: -8px;
  border: 2px solid #fff;
}

.faces :deep(.avatar-face:first-child) {
  margin-left: 0;
}

.cta h2 {
  margin: 0 auto 12px;
  max-width: 14ch;
  font-size: clamp(34px, 5vw, 52px);
}

.cta p {
  margin: 0 auto 24px;
  max-width: 46ch;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
