<template>
  <div class="page">

    <!-- NAVBAR -->
    <nav class="navbar">

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

        <form class="form-grid" @submit.prevent="salvar">

          <!-- ESQUERDA -->
          <div class="coluna">

            <div class="geral">
              <label>Nome do EPI</label>
              <input v-model="form.nome_epi" type="text" placeholder="Ex: Capacete de Segurança">
            </div>

            <div class="geral">
              <label>Categoria</label>
              <input v-model="form.categoria" type="text" placeholder="Ex: Proteção da cabeça">
            </div>

            <div class="inputs">
              <div class="geral">
                <label>Número do CA</label>
                <input v-model="form.ca" type="text" placeholder="Ex: 1234">
              </div>

              <div class="geral">
                <label>Validade</label>
                <input v-model="form.validade" type="date">
              </div>
            </div>

          </div>

          <!-- DIVISÓRIA -->
          <div class="divider"></div>

          <!-- DIREITA -->
          <div class="coluna">

            <div class="geral">
              <label>Quantidade Inicial</label>
              <input v-model="form.quantidade"  type="number" placeholder="Ex: 100">
            </div>

            <div class="geral">
              <label>Fornecedor</label>
              <input v-model="form.fornecedor" type="text" placeholder="Ex: Nome do Fornecedor">
            </div>

            <div class="geral">
              <label>Localização no Estoque</label>
              <input v-model="form.localizacao" type="text" placeholder="Ex: Prateleira A3">
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


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useSupabase } from '../composables/useSupabase'; 

const { supabase } = useSupabase();

const epis = ref([]);
const editandoId = ref(null);

const form = reactive({ 
  nome_epi: '', 
  categoria: '', 
  ca: '', 
  validade: '', 
  quantidade: '', 
  fornecedor: '', 
  localizacao: '' 
});

const carregar = async () => {
  const { data, error } = await supabase.from('cadastro_epi').select('*').order('nome_epi');
  if (error) console.error("Erro ao carregar:", error);
  epis.value = data || [];
};

const salvar = async () => {
  // --- PASSO 1: Preparar os dados ---
  // Convertemos quantidade e CA para número, pois inputs de texto enviam strings
  // Isso evita o erro 400 por tipo de dado incorreto
  const dadosParaSalvar = {
    nome_epi: form.nome_epi,
    categoria: form.categoria,
    ca: parseInt(form.ca) || 0, // Converte para número
    validade: form.validade,
    quantidade: parseInt(form.quantidade) || 0, // Converte para número
    fornecedor: form.fornecedor,
    localizacao: form.localizacao
  };

  try {
    let error;
    if (editandoId.value) {
      // Atualizar
      const response = await supabase.from('cadastro_epi').update(dadosParaSalvar).eq('id', editandoId.value);
      error = response.error;
    } else {
      // Inserir
      const response = await supabase.from('cadastro_epi').insert([dadosParaSalvar]);
      error = response.error;
    }
    
    if (error) throw error; 

    alert('Salvo com sucesso!');
    cancelarEdicao();
    carregar();
  } catch (error) {
    console.error('Erro detalhado do Supabase:', error);
    alert('Erro ao salvar: ' + (error.message || 'Verifique o console'));
  }
};

const prepararEdicao = (e) => {
  editandoId.value = e.id;
  Object.assign(form, { ...e });
};

const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, { 
    nome_epi: '', categoria: '', ca: '', validade: '', 
    quantidade: '', fornecedor: '', localizacao: '' 
  });
};

onMounted(carregar);
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
