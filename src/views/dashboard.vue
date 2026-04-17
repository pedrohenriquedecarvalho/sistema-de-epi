<template> 
  <div class="layout"> 
    <aside class="sidebar">
      <div class="sidebar__logo">
        <img src="../assets/image.png" class="icon">
        
        <h2>Controle EPI</h2>
      </div>

      <nav aria-label="Menu principal">
        <ul class="navbar__lista">
          <li><RouterLink to="/" class="navbar__link">Home</RouterLink></li>
          <li><RouterLink to="/cadastro" class="navbar__link">Cadastro</RouterLink></li>
          <li><RouterLink to="/estoque" class="navbar__link">Estoque</RouterLink></li>
          <li><RouterLink to="/login" class="navbar__link">Login</RouterLink></li>
          <li><RouterLink to="/relatorios" class="navbar__link">Relatórios</RouterLink></li>
          <li><RouterLink to="/reserva" class="navbar__link">Reserva</RouterLink></li>
          
          <li class="item-sair">
            <button @click="logout" class="btn-sair">Sair</button>
          </li>
        </ul>
      </nav>
    </aside> 

    <main class="conteudo">
      <header class="header-tabela">
        <h1>Funcionários</h1>
        <button class="btn-novo">+ Novo Funcionário</button>
      </header>

      <div class="card-tabela">
        <table>
          <thead>
            <tr>
              <th>MATRÍCULA</th>
              <th>NOME</th>
              <th>SETOR</th>
              <th>CARGO</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MAT001</td>
              <td>Ana Souza</td>
              <td>Produção</td>
              <td>Operadora</td>
              <td><button class="btn-excluir">Excluir</button></td>
            </tr>
            <tr>
              <td>MAT002</td>
              <td>Carlos Lima</td>
              <td>Almoxarifado</td>
              <td>Auxiliar</td>
              <td><button class="btn-excluir">Excluir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div> 
</template>

<script setup>
const logout = () => {
  console.log("Saindo...");
};
</script>

<style scoped> 
/* Layout Base */
.layout { 
  display: flex;
  height: 100vh; 
  background-color: #f4f7f6; 
} 


.sidebar { 
  width: 250px;
  background: #1e1e2d; 
  color: white; 
  padding: 20px;
  display: flex;
  flex-direction: column;
} 

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  
}

img{
  height: 30px;
  width: 30px;
}

.navbar__lista {
  list-style: none; 
  padding: 0;
  margin: 0;
}

.navbar__link {
  display: block; 
  color: #adb5bd; 
  text-decoration: none; 
  padding: 12px 0;
  transition: 0.3s;
}

.navbar__link:hover {
  color: white;
}

.item-sair {
  margin-top: 40px;
  padding-top: 20px;
  
}

.btn-sair {
  background-color: red;
  color:white;
  border: 1px solid #ff4d4d;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 4px;
  width: 100px;
  text-align: center;
}

.btn-sair:hover {
  background: #ff4d4d;
  color: white;
}

/* Área da Direita (Tabela) */
.conteudo {
  flex: 1; 
  padding: 40px; 
} 

.header-tabela {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.btn-novo {
  background: #1e1e2d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.card-tabela {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  color: #adb5bd;
  font-size: 12px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

td {
  padding: 15px 0;
  border-bottom: 1px solid #f9f9f9;
  font-size: 14px;
}

.btn-excluir {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>