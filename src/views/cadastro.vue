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
          

      <section class="cadastro">
        <div class="card">
           <h1>Cadastro de EPI's</h1>
            <p class="subtitle">Preencha as informações para adicionar um novo equipamento no estoque</p>

          <form  class="form-grid">
            <div class="column">

              <div class="geral">
                <label>Nome do EPI</label>
                <input type="text" placeholder="Ex: capacete de Segurança">
              </div>

              <div class="geral">
                <input type="text" placeholder="Categoria">
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
                <div class="icone">
                  <img src="../assets/upload-icon.png">
                  <p>nenhum arquivo selecionado</p>
                  <button type="button">Selecione o arquivo</button>
                </div>
              </div>

            </div>

            <div class="divider"></div>

            <div>
              <div class="geral">
                <label>Quantidade Inicial</label>
                <input type="text" placeholder="Ex: 100">
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

<style>
/* --- Geral e Reset --- */
* {
  box-sizing: border-box;
}

.page {
  font-family: 'Inter', sans-serif;
  background-color: #d1d5db; 
  min-height: 100vh;
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

/* --- Seção de Cadastro --- */
.cadastro {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
}

.card {
  background-color: white;
  width: 1000px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card h1 {
  text-align: center;
  font-size: 32px;
  color: #000;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 40px;
  font-size: 16px;
}


.form-grid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr; 
  gap: 40px;
 
}

.divider {
  border:  1PX solid rgba(0, 0, 0, 0.192);
}

/* --- Campos de Input --- */
.geral {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.geral label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
}

input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.inputs {
  display: flex;
  gap: 20px;
}



.upload-area label {
  font-weight: bold;
}

.icone {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.icone img {
  width: 40px;
  opacity: 0.7;
}

.icone p {
  font-size: 12px;
  color: #6b7280;
}


/* --- Ações do Formulário --- */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel {
  background: white;
  border: 1px solid #d1d5db;
  padding: 10px 25px;
  border-radius: 8px;
  color: #374151;
  cursor: pointer;
}

.save {
  background-color: #2563eb;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.save:hover {
  background-color: #1d4ed8;
}

/* --- Responsividade --- */
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
  
  .input {
    width: 100%;
  }
}
</style>

<script>
export default {
name: 'cadastro epi'
}
</script>