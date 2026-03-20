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
          <img src="../assets/user-icon.png" alt="User">
          <span>acesse sua conta</span>
        </div>
        <img src="../assets/bell.png" alt="Notificações">
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
          <img src="../assets/2.png" alt="ícone" class="card-icon">
          <h2>Controle Movimentações</h2>
        </div>
        <p>Registre quais EPIs foram retirados, devolvidos ou estão vencidos.</p>
      </section>

      <section class="card">
        <div class="card-header">
          <img src="../assets/3.png" alt="ícone" class="card-icon">
          <h2>Análise Relatórios</h2>
        </div>
        <p>Visualize dados de distribuição, uso e vencimento dos EPIs.</p>
      </section>
    </div>


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

</style>