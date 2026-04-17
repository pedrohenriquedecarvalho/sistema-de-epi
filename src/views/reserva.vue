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

    <!-- FORMULÁRIO -->
    <section class="cadastro">
      <div class="card">

        <h1>Cadastro de EPI's</h1>
        <p class="subtitle">
          Preencha as informações para adicionar um novo equipamento no estoque
        </p>

        <form class="form-grid">

          <!-- COLUNA ESQUERDA -->
          <div class="column">

            <div class="geral">
              <label>Nome do Funcionário</label>
              <input type="text" placeholder="Ex: João">
            </div>

            <div class="geral">
              <label>Cargo do Funcionário</label>
              <input type="text" placeholder="Categoria">
            </div>

            <div class="geral">
              <label>Número dos EPI's</label>
              <input type="text" placeholder="Ex: 1234">
            </div>

            <div class="geral">
              <label>Categoria</label>
              <input type="text" placeholder="Proteção da cabeça">
            </div>

            <div class="geral">
              <label>Quantidade</label>
              <input type="number" placeholder="02">
            </div>

            <div class="form-actions">
              <button type="button" class="cancel">Cancelar</button>
              <button type="submit" class="save">Salvar EPI</button>
            </div>

          </div>

          <!-- COLUNA DIREITA -->
          <div class="column image-column">
            <img src="../assets/reserva.png" alt="reserva" class="reserva">
          </div>

        </form>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'reserva'
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
  background-color: #d1d5db;
  min-height: 100vh;
}
.conta1{
  text-decoration: none;
  color: white;
  white-space: nowrap;
  margin-left: 10px;
}

/* NAVBAR */
.navbar {
  background-color: #111827;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
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

/* FORM */
.cadastro {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
}

.card {
  background-color: white;
  width: 100%;
  max-width: 1000px;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}

.card h1 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 30px;
}

/* GRID */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.column {
  display: flex;
  flex-direction: column;
}

/* INPUTS */
.geral {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.geral label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #374151;
}

input {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

/* BOTÕES */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel {
  background: white;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.save {
  background-color: #2563eb;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.save:hover {
  background-color: #1d4ed8;
}

/* IMAGEM */
.image-column {
  display: flex;
  justify-content: center;
  align-items: center;
}

.reserva {
width: 400px;
height: 350px;
border-radius: 10px;
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.411);
margin-top: 20px;
  
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 15px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .image-column {
    order: -1;
    margin-bottom: 20px;
  }

  .input {
    width: 100%;
  }
}
</style>