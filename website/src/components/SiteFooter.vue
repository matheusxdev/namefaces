<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <RouterLink to="/" class="logo">namefaces</RouterLink>
        <p class="muted">Cada nome ganha um rosto próprio.</p>
      </div>

      <div class="links">
        <RouterLink to="/#recursos">Recursos</RouterLink>
        <RouterLink to="/#demo">Demo</RouterLink>
        <RouterLink to="/#como-usar">Como usar</RouterLink>
        <RouterLink to="/rostos">Rostos</RouterLink>
        <a
          href="https://github.com/matheusxdev/namefaces"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 28px 0 40px;
  border-top: 1px solid var(--line);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  display: inline-block;
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
}

.footer p {
  margin: 6px 0 0;
  font-size: 14px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--muted);
  font-size: 14px;
}

.links a:hover {
  color: var(--ink);
}

@media (max-width: 700px) {
  .footer-inner {
    flex-direction: column;
    align-items: start;
  }
}
</style>
