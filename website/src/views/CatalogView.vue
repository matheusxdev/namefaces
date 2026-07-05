<script setup lang="ts">
import GalleryCatalog from '../components/GalleryCatalog.vue'
import Reveal from '../components/Reveal.vue'
</script>

<template>
  <section class="section catalog-page">
    <div class="container">
      <Reveal>
        <header class="head">
          <div>
            <span class="eyebrow">Catálogo</span>
            <h1 class="serif">Todos os rostos disponíveis</h1>
            <p class="muted">
              Busque, filtre e explore cada identidade já disponível no
              namefaces.
            </p>
          </div>

          <RouterLink to="/" class="btn btn-secondary">Voltar</RouterLink>
        </header>
      </Reveal>

      <GalleryCatalog />
    </div>
  </section>
</template>

<style scoped>
.head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.head h1 {
  margin: 14px 0 12px;
  font-size: clamp(34px, 5vw, 52px);
  max-width: 16ch;
}

.head p {
  margin: 0;
  max-width: 44ch;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .head {
    flex-direction: column;
    align-items: start;
  }
}
</style>
