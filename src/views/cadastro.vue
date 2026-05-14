<template>
  <div class="page">
    <!-- FORMULÁRIO -->
    <section class="cadastro">
      <div class="card">
        <h1>Cadastro de EPI's</h1>
        <p class="subtitle">
          Preencha as informações para adicionar ou editar um equipamento
        </p>

        <form class="form-grid" @submit.prevent="salvar">
          <!-- COLUNA ESQUERDA -->
          <div class="coluna">
            <div class="geral">
              <label>Nome do EPI</label>
              <input v-model="form.nome_epi" type="text" placeholder="Ex: Capacete de Segurança" required>
            </div>

            <div class="geral">
              <label>Categoria</label>
              <input v-model="form.categoria" type="text" placeholder="Ex: Proteção da cabeça">
            </div>

            <div class="inputs-inline">
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

          <!-- DIVISÓRIA (Escondida no mobile via CSS) -->
          <div class="divider"></div>

          <!-- COLUNA DIREITA -->
          <div class="coluna">
            <div class="geral">
              <label>Quantidade em Estoque</label>
              <input v-model.number="form.quantidade" type="number" placeholder="Ex: 100">
            </div>

            <div class="geral">
              <label>Fornecedor</label>
              <input v-model="form.fornecedor" type="text" placeholder="Ex: Nome do Fornecedor">
            </div>

            <div class="geral">
              <label>Localização</label>
              <input v-model="form.localizacao" type="text" placeholder="Ex: Prateleira A3">
            </div>

            <div class="form-actions">
              <button type="button" class="btn cancel" @click="cancelarEdicao">Cancelar</button>
              <button type="submit" class="btn save">
                {{ editandoId ? 'Atualizar EPI' : 'Salvar EPI' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- TABELA DE DADOS -->
    <section class="card-table-container">
      <div class="card-table">
        <div class="responsive-table-wrapper">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Equipamento</th>
                <th>Categoria</th>
                <th>C.A.</th>
                <th>Qtd</th>
                <th class="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in epis" :key="e.id">
                <td data-label="Equipamento"><span class="text-bold">{{ e.nome_epi }}</span></td>
                <td data-label="Categoria">{{ e.categoria }}</td>
                <td data-label="C.A."><span class="badge-ca">{{ e.ca }}</span></td>
                <td data-label="Qtd">{{ e.quantidade }}</td>
                <td data-label="Ações" class="text-center">
                  <button @click="prepararEdicao(e)" class="btn-action edit">Editar</button>
                  <button @click="excluir(e.id)" class="btn-action delete">Excluir</button>
                </td>
              </tr>
              <tr v-if="epis.length === 0">
                <td colspan="5" class="text-center">Nenhum EPI cadastrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
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
  quantidade: 0, 
  fornecedor: '', 
  localizacao: '' 
});

const carregar = async () => {
  try {
    const { data, error } = await supabase
      .from('cadastro_epi')
      .select('*')
      .order('nome_epi', { ascending: true });
    if (error) throw error;
    epis.value = data || [];
  } catch (error) {
    console.error("Erro ao carregar:", error.message);
  }
};

const salvar = async () => {
  const dadosParaSalvar = {
    nome_epi: form.nome_epi,
    categoria: form.categoria,
    ca: String(form.ca),
    validade: form.validade || null,
    quantidade: parseInt(form.quantidade) || 0,
    fornecedor: form.fornecedor,
    localizacao: form.localizacao
  };

  try {
    let error;
    if (editandoId.value) {
      const response = await supabase.from('cadastro_epi').update(dadosParaSalvar).eq('id', editandoId.value);
      error = response.error;
    } else {
      const response = await supabase.from('cadastro_epi').insert([dadosParaSalvar]);
      error = response.error;
    }
    if (error) throw error; 
    cancelarEdicao();
    carregar();
  } catch (error) {
    alert('Erro ao salvar: ' + error.message);
  }
};

const prepararEdicao = (e) => {
  editandoId.value = e.id;
  Object.assign(form, e);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, { nome_epi: '', categoria: '', ca: '', validade: '', quantidade: 0, fornecedor: '', localizacao: '' });
};

const excluir = async (id) => {
  if (confirm('Deseja realmente excluir este equipamento?')) {
    try {
      const { error } = await supabase.from('cadastro_epi').delete().eq('id', id);
      if (error) throw error;
      carregar();
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    }
  }
};

onMounted(carregar);
</script>

<style scoped>
.page { 
  font-family: 'Inter', sans-serif; 
  background-color: #f3f4f6; 
  min-height: 100vh; 
  padding: 20px 10px 50px 10px; 
}

/* CARD CADASTRO */
.cadastro { display: flex; justify-content: center; margin-bottom: 20px; }
.card { 
  background-color: white; 
  width: 100%; 
  max-width: 1000px; 
  border-radius: 12px; 
  padding: clamp(15px, 5vw, 30px); 
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); 
}
.card h1 { text-align: center; color: #111827; margin-bottom: 8px; font-size: clamp(1.2rem, 5vw, 1.8rem); }
.subtitle { text-align: center; margin-bottom: 30px; color: #6b7280; font-size: 14px; }

/* GRID FORMULÁRIO */
.form-grid { 
  display: grid; 
  grid-template-columns: 1fr 1px 1fr; 
  gap: 30px; 
}

.coluna { display: flex; flex-direction: column; gap: 15px; }
.divider { background-color: #e5e7eb; }
.geral { display: flex; flex-direction: column; gap: 5px; }
.geral label { font-size: 14px; font-weight: 600; color: #374151; }
.geral input { 
  padding: 12px; 
  border-radius: 6px; 
  border: 1px solid #d1d5db; 
  width: 100%;
  font-size: 14px; 
}

.inputs-inline { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 15px; 
}

/* BOTÕES */
.form-actions { 
  display: flex; 
  justify-content: flex-end; 
  gap: 12px; 
  margin-top: auto; 
  padding-top: 20px;
}
.btn { 
  padding: 12px 20px; 
  border-radius: 6px; 
  cursor: pointer; 
  font-weight: 600; 
  flex: 1; 
  max-width: 200px;
}
.cancel { background: #fff; border: 1px solid #d1d5db; color: #374151; }
.save { background-color: #2563eb; color: white; border: none; }

/* TABELA */
.card-table-container { display: flex; justify-content: center; }
.card-table { 
  background: white; 
  width: 100%; 
  max-width: 1000px; 
  border-radius: 12px; 
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); 
  overflow: hidden;
}

.responsive-table-wrapper {
  width: 100%;
  overflow-x: auto; /* Scroll para tabelas em telas muito pequenas */
}

.styled-table { width: 100%; border-collapse: collapse; min-width: 500px; }
.styled-table th { 
  background: #f9fafb; 
  padding: 15px; 
  text-align: left; 
  font-size: 12px; 
  color: #4b5563; 
  text-transform: uppercase; 
  border-bottom: 1px solid #e5e7eb; 
}
.styled-table td { padding: 15px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }

/* AÇÕES TABELA */
.btn-action { background: none; border: none; cursor: pointer; font-weight: 600; padding: 5px; }
.edit { color: #2563eb; margin-right: 10px; }
.delete { color: #dc2626; }
.text-center { text-align: center; }
.badge-ca { background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-weight: bold; }

/* RESPONSIVIDADE (MOBILE) */
@media (max-width: 768px) {
  .form-grid { 
    grid-template-columns: 1fr; 
    gap: 20px;
  }
  
  .divider { display: none; }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn { max-width: none; width: 100%; }

  /* Ajuste para inputs de CA e Data no mobile */
  .inputs-inline {
    grid-template-columns: 1fr;
  }

 
}
</style>