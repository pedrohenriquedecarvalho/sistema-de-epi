<template>
  <div class="page">
    <nav class="navbar">
      <div>
        <img src="../assets/logo.png" alt="Logo" class="logo">
        <span>Controle de EPIs</span>
      </div>
      <div>
        <input type="text" placeholder="Pesquisar..." class="input">
      </div>
      <div>
        <div>
          <img src="../assets/conta.png" alt="User" id="conta">
          <span>acesse sua conta</span>
        </div>
        
      </div>
    </nav>

    <main class="principal">
      <div class="text">
        <h1>Bem-Vindo ao Sistemas <br> de Gestão de EPIs</h1>
        <p class="subtitle">
          Monitore, controle e garanta a segurança na distribuição de <br>
          equipamentos de proteção individual de forma simples <br>
          e eficiente.
        </p>
      </div>
      <img src="../assets/inicial.png" alt="sistema de epi" id="img">
    </main>

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
    <footer >
      <div class="footer-content">
        <div class="footer-brand">
          <img src="../assets/logo.png" alt="Logo" class="footer-logo">
          <p>&copy; 2026 Controle de EPIs.</p>
        </div>
        
        <div class="links">
          <h3>Navegação</h3>
          <ul>
            <li><a href="#">Início</a></li>
            <li><a href="#">Estoque</a></li>
            <li><a href="#">Relatórios</a></li>
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
*{
    margin: 0;
}
.page{
  font-family: 'Inter', sans-serif;
  background-color: #f3f4f6; 
   
}

.navbar {
  background-color: #111827;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
}

.input {
  width: 500px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background-color: #374151;
 
}


.principal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text h1 {
  font-size: 48px;
  font-weight: bold;
  color: #111;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 18px;
  color: #4b5563;
  line-height: 1.5;
}

#img {
  max-width: 550px;
  height: auto;
}


.container-cards {
  display: flex;
  gap: 30px;
  padding: 0 100px;

}

.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 50px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  gap: 12px;
}

.card-icon {
  width: 32px;
  height: 32px;
}

.card h2 {
  font-size: 20px;
  color: #111;
}

.card p {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.4;
}
main{
    margin-left: 50px;
}
footer {
  background-color: #111827; /* Mesma cor da Navbar */
  color: #9ca3af; /* Cinza claro para o texto */
  padding: 60px 50px 30px;
  margin-top: 80px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.footer-brand p {
  margin-top: 15px;
  font-size: 14px;
  line-height: 1.6;
}

.footer-logo {
  height: 40px;
  filter: brightness(0) invert(1); /* Deixa o logo branco se ele for escuro */
}

.links h3, .contato h3 {
  color: white;
  font-size: 18px;
  margin-bottom: 20px;
}

.links ul {
  list-style: none;
  padding: 0;
}

.links li {
  margin-bottom: 10px;
}

.links a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s;
}

.links a:hover {
  color: white;
}

.footer-contact p {
  margin-bottom: 10px;
  font-size: 14px;
}
#conta{
  width: 32px;
  height: 32px;
  margin-right: 15px;
}
.logo{
    width: 50px;
  height: 50px;
}
  

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer {
    padding: 40px 20px;
  }

  .navbar {
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    text-align: center;
  }

  .input {
    width: 95%; 
  }

  .principal {
    flex-direction: column-reverse; 
    text-align: center;
  }

  .text h1 {
    font-size: 28px; 
  }

  .text br {
    display: none; 
  }

  #img {
    max-width: 100%;
    margin-bottom: 20px;
  }

  .container-cards {
    flex-direction: column;
    padding: 20px;
  }

  .card {
    padding: 20px;
  }

  .card-header {
    justify-content: center;
    margin-bottom: 10px;
  }
}

</style>