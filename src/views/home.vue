<template>
  <div class="page">
    
    <!-- NAVBAR -->
    <nav class="navbar">
      
      <div class="nav-left">
        <img src="../assets/image.png" alt="Logo" class="logo">
        <span>Controle de EPIs</span>
      </div>

      <div class="nav-center">
        <input type="text" placeholder="Pesquisar..." class="input">
      </div>

      <div class="nav-right">
        <img src="../assets/conta.png" alt="User" class="conta">
        <RouterLink to="/login" class="conta1">Acesse sua conta</RouterLink>
      </div>

    </nav>

    <!-- MAIN -->
    <main class="principal">
      <div class="text">
        <h1>Bem-Vindo ao Sistema <br> de Gestão de EPIs</h1>
        <p class="subtitle">
          Monitore, controle e garanta a segurança na distribuição de
          equipamentos de proteção individual de forma simples e eficiente.
        </p>
      </div>

      <img src="../assets/inicial.png" alt="sistema de epi" id="img">
    </main>

    <!-- CARDS -->
    <div class="container-cards">
      <section class="card">
        <div class="card-header">
          <img src="../assets/1.png" alt="ícone" class="card-icon">
          <h2>Gerencie EPIs</h2>
        </div>
        <p>Cadastre e mantenha seu estoque de EPIs atualizado para reposição rápida.</p>
      </section>

      <section class="card">
        <div class="card-header">
          <img src="../assets/mov.png" alt="ícone" class="card-icon">
          <h2>Controle Movimentações</h2>
        </div>
        <p>Registre quais EPIs foram retirados, devolvidos ou estão vencidos.</p>
      </section>

      <section class="card">
        <div class="card-header">
          <img src="../assets/rel.png" alt="ícone" class="card-icon">
          <h2>Análise Relatórios</h2>
        </div>
        <p>Visualize dados de distribuição, uso e vencimento dos EPIs.</p>
      </section>
    </div>

    <!-- FOOTER -->
    <footer>
      <div class="footer-content">
        
        <div class="footer-brand">
          <img src="../assets/image.png" alt="Logo" class="footer-logo">
          <p>&copy; 2026 Controle de EPIs.</p>
        </div>
        
        <div class="links">
          <h3>Navegação</h3>
         <ul >
          <li><RouterLink to="/" class="navbar__link">Home</RouterLink></li>
          <li><RouterLink to="/cadastro" class="navbar__link">Cadastro</RouterLink></li>
          <li><RouterLink to="/estoque" class="navbar__link">Estoque</RouterLink></li>
          <li><RouterLink to="/login" class="navbar__link">Login</RouterLink></li>
          <li><RouterLink to="/relatorios" class="navbar__link">Relatórios</RouterLink></li>
          <li><RouterLink to="/reserva" class="navbar__link">Reserva</RouterLink></li>
          
</ul>
        </div>

        <div class="contato">
          <h3>Suporte</h3>
          <p>suporte@gestaoepi.com.br</p>
          <p>(11) 4002-8922</p>
        </div>

      </div>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page {
  font-family: 'Inter', sans-serif;
  background-color: #f3f4f6;
}

/* NAVBAR */
.navbar {
  background-color: #111827;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
  text-decoration: none;
}
.conta1{
  text-decoration: none;
  color: white;
  white-space: nowrap;
  margin-left: 10px;
}

.nav-left,
.nav-center,
.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-center {
  flex: 1;
  justify-content: center;
}

.logo {
  width: 40px;
}

.conta {
  width: 28px;
}

.input {
  width: 400px;
  max-width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background-color: #374151;
  color: white;
}

/* MAIN */
.principal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 50px;
}

.text h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 18px;
  color: #4b5563;
}

#img {
  max-width: 550px;
}

/* CARDS */
.container-cards {
  display: flex;
  gap: 30px;
  padding: 0 100px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.card-icon {
  width: 32px;
}

.card h2 {
  font-size: 20px;
}

.card p {
  color: #6b7280;
}

/* FOOTER */
footer {
  background-color: #111827;
  color: #9ca3af;
  padding: 60px 50px 30px;
  margin-top: 80px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.footer-logo {
  height: 40px;
  filter: brightness(0) invert(1);
}

.links h3,
.contato h3 {
  color: white;
  margin-bottom: 15px;
}

.links ul {
  list-style: none;
}

.links a {
  color: #9ca3af;
  text-decoration: none;
}

.links a:hover {
  color: white;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 15px;
  }

  .principal {
    flex-direction: column;
    text-align: center;
  }

  .container-cards {
    flex-direction: column;
    padding: 20px;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>