<script setup lang="ts">
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import DemoSection from './components/DemoSection.vue'
import CodeSection from './components/CodeSection.vue'
import GallerySection from './components/GallerySection.vue'
import CtaSection from './components/CtaSection.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <div class="page">
    <SiteNav />
    <main>
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <CodeSection />
      <GallerySection />
      <CtaSection />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.page {
  position: relative;
  z-index: 1;
}
</style>
