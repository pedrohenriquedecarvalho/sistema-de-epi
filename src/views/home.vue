<template>
  <div class="page">
    
    <!-- NAVBAR -->
    <nav class="navbar">

      <div class="nav-center">
        
      </div>

      <div class="nav-right">
        <img src="../assets/conta.png" alt="User" class="conta">
        <RouterLink to="/login" class="nav-center">Acesse sua conta</RouterLink>
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
          
          <p>&copy; Sistema de EPIs.</p>
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
  text-decoration: none;
  color: white;
  white-space: nowrap;
  margin-left: 10px;
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
 
  margin-top: 80px;
}

.footer-content {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.footer-logo {
  height: 20px;
 
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