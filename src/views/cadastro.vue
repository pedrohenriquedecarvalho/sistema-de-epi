<template>
  <div class="page">

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="nav-left">
        <img src="../assets/image.png" class="logo">
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

    <!-- FORM -->
    <section class="cadastro">
      <div class="card">

        <h1>Cadastro de EPI's</h1>
        <p class="subtitle">
          Preencha as informações para adicionar um novo equipamento no estoque
        </p>

        <form class="form-grid">

          <!-- ESQUERDA -->
          <div class="coluna">

            <div class="geral">
              <label>Nome do EPI</label>
              <input type="text" placeholder="Ex: Capacete de Segurança">
            </div>

            <div class="geral">
              <label>Categoria</label>
              <input type="text" placeholder="Ex: Proteção da cabeça">
            </div>

            <div class="inputs">
              <div class="geral">
                <label>Número do CA</label>
                <input type="text" placeholder="Ex: 1234">
              </div>

              <div class="geral">
                <label>Validade</label>
                <input type="date">
              </div>
            </div>

            <div class="upload-area">
              <label>Imagem do EPI</label>

              <div class="upload-box">
                <img src="../assets/upload-icon.png">
                <p>nenhum arquivo selecionado</p>
                <button type="button">Selecione o arquivo</button>
              </div>
            </div>

          </div>

          <!-- DIVISÓRIA -->
          <div class="divider"></div>

          <!-- DIREITA -->
          <div class="coluna">

            <div class="geral">
              <label>Quantidade Inicial</label>
              <input type="number" placeholder="Ex: 100">
            </div>

            <div class="geral">
              <label>Fornecedor</label>
              <input type="text" placeholder="Ex: Nome do Fornecedor">
            </div>

            <div class="geral">
              <label>Localização no Estoque</label>
              <input type="text" placeholder="Ex: Prateleira A3">
            </div>

            <div class="form-actions">
              <button type="button" class="cancel">Cancelar</button>
              <button type="submit" class="save">Salvar EPI</button>
            </div>

          </div>

        </form>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'cadastro-epi'
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

.logo { width: 40px; }
.conta { width: 28px; }

.input {
  width: 400px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background-color: #374151;
  color: white;
}

/* CARD */
.cadastro {
  display: flex;
  justify-content: center;
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
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  margin-bottom: 30px;
  color: #6b7280;
}

/* GRID */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 40px;
  align-items: start;
}

.divider {
  background-color: #e5e7eb;
  width: 1px;
}

/* COLUNAS */
.coluna {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
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
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.inputs {
  display: flex;
  gap: 15px;
}

.inputs .geral {
  flex: 1;
}

/* UPLOAD */
.upload-box {
  width: 100%;
  border: 2px dashed #e5e7eb;
  padding: 30px;
  text-align: center;
  border-radius: 10px;
  margin-top: 10px;
  background-color: #f3f4f6;
  cursor: pointer;
}

.upload-box img {
  width: 40px;
  opacity: 0.6;
}

.upload-box p {
  font-size: 13px;
  color: #6b7280;
  margin-top: 10px;
}

.upload-box button {
  margin-top: 10px;
  padding: 8px 15px;
  border: none;
  background-color: #e5e7eb;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
}

/* BOTÕES */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 40px;
}

.cancel {
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  background: white;
  border-radius: 6px;
  cursor: pointer;
}

.save {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .divider {
    display: none;
  }

  .navbar {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
