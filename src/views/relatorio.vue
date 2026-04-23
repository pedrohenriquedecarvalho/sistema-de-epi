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

    <!-- RELATÓRIO -->
    <section class="relatorio">
      <div class="card">

        <h1>Relatório de EPI's</h1>
        <p class="subtitle">
          Visualize os equipamentos cadastrados no sistema
        </p>

        <!-- FILTROS -->
        <div class="filtros">

          <div class="campo">
            <label>Nome do EPI</label>
            <input type="text" placeholder="Ex: Capacete">
          </div>

          <div class="campo">
            <label>Status</label>
            <select>
              <option>Todos</option>
              <option>Estoque</option>
              <option>Em uso</option>
              <option>Vencido</option>
            </select>
          </div>

          <div class="campo">
            <label>Data Inicial</label>
            <input type="date">
          </div>

          <div class="campo">
            <label>Data Final</label>
            <input type="date">
          </div>

        </div>

        <!-- TABELA -->
        <table>
          <thead>
            <tr>
              <th>EPI</th>
              <th>CA</th>
              <th>Quantidade</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Capacete</td>
              <td>1234</td>
              <td>10</td>
              <td class="estoque">Estoque</td>
              <td>01/04/2026</td>
            </tr>

            <tr>
              <td>Luva</td>
              <td>5678</td>
              <td>5</td>
              <td class="uso">Em uso</td>
              <td>02/04/2026</td>
            </tr>

            <tr>
              <td>Óculos</td>
              <td>9999</td>
              <td>2</td>
              <td class="vencido">Vencido</td>
              <td>03/04/2026</td>
            </tr>
          </tbody>
        </table>

      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'relatorio'
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

.conta1 {
  text-decoration: none;
  color: white;
  margin-left: 10px;
}

.input {
  width: 400px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background-color: #374151;
  color: white;
}

/* RELATÓRIO */
.relatorio {
  display: flex;
  justify-content: center;
  padding: 50px 20px;
}

/* CARD */
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
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 30px;
}

/* FILTROS */
.filtros {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.campo {
  display: flex;
  flex-direction: column;
}

.campo label {
  font-weight: 600;
  margin-bottom: 5px;
}

.campo input,
.campo select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

/* TABELA */
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #e5e7eb;
}

th, td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

/* STATUS */
.estoque {
  color: green;
  font-weight: bold;
}

.uso {
  color: orange;
  font-weight: bold;
}

.vencido {
  color: red;
  font-weight: bold;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .filtros {
    grid-template-columns: 1fr;
  }

  .navbar {
    flex-direction: column;
    gap: 10px;
  }

  .input {
    width: 100%;
  }
}
</style>
