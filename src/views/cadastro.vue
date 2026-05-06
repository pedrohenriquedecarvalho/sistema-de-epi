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
              <button type="button" class="cancel" @click="cancelarEdicao">Cancelar</button>
              <button type="submit" class="save">
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
              <td><span class="text-bold">{{ e.nome_epi }}</span></td>
              <td>{{ e.categoria }}</td>
              <td><span class="badge-ca">{{ e.ca }}</span></td>
              <td>{{ e.quantidade }}</td>
              <td class="text-center">
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

// Busca os dados do banco
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

// Salva ou Atualiza
const salvar = async () => {
  // Tratamento de dados para evitar Erro 400
  const dadosParaSalvar = {
    nome_epi: form.nome_epi,
    categoria: form.categoria,
    ca: String(form.ca), // Garante que é string (varchar)
    validade: form.validade || null, // Garante nulo se estiver vazio (date)
    quantidade: parseInt(form.quantidade) || 0, // Garante que é número (int2)
    fornecedor: form.fornecedor,
    localizacao: form.localizacao
  };

  try {
    let error;
    if (editandoId.value) {
      const response = await supabase
        .from('cadastro_epi')
        .update(dadosParaSalvar)
        .eq('id', editandoId.value);
      error = response.error;
    } else {
      const response = await supabase
        .from('cadastro_epi')
        .insert([dadosParaSalvar]);
      error = response.error;
    }
    
    if (error) throw error; 

    alert(editandoId.value ? 'EPI atualizado!' : 'EPI cadastrado!');
    cancelarEdicao();
    carregar();
  } catch (error) {
    console.error('Erro detalhado:', error);
    alert('Erro ao salvar: ' + error.message);
  }
};

const prepararEdicao = (e) => {
  editandoId.value = e.id;
  // Preenche o formulário com os dados do objeto 'e'
  form.nome_epi = e.nome_epi;
  form.categoria = e.categoria;
  form.ca = e.ca;
  form.validade = e.validade;
  form.quantidade = e.quantidade;
  form.fornecedor = e.fornecedor;
  form.localizacao = e.localizacao;
  
  // Rola a tela para o topo para facilitar a edição
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelarEdicao = () => {
  editandoId.value = null;
  form.nome_epi = '';
  form.categoria = '';
  form.ca = '';
  form.validade = '';
  form.quantidade = 0;
  form.fornecedor = '';
  form.localizacao = '';
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
/* Use scoped para não afetar outras páginas */
* { margin: 0; padding: 0; box-sizing: border-box; }

.page { font-family: 'Inter', sans-serif; background-color: #f3f4f6; min-height: 100vh; padding-bottom: 50px; }

/* NAVBAR */
.navbar { background-color: #111827; color: white; display: flex; align-items: center; padding: 15px 50px; }
.nav-center { flex: 1; display: flex; justify-content: center; }
.nav-right { display: flex; align-items: center; gap: 10px; }
.input { width: 400px; padding: 10px; border-radius: 6px; border: none; background-color: #374151; color: white; }
.conta { width: 28px; }
.conta1 { text-decoration: none; color: white; margin-left: 10px; font-size: 14px; }

/* CARD CADASTRO */
.cadastro { display: flex; justify-content: center; padding: 40px 20px; }
.card { background-color: white; width: 100%; max-width: 1000px; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.card h1 { text-align: center; color: #111827; margin-bottom: 8px; }
.subtitle { text-align: center; margin-bottom: 30px; color: #6b7280; font-size: 14px; }

/* GRID FORMULÁRIO */
.form-grid { display: grid; grid-template-columns: 1fr 1px 1fr; gap: 30px; }
.divider { background-color: #e5e7eb; }
.coluna { display: flex; flex-direction: column; gap: 15px; }
.geral { display: flex; flex-direction: column; gap: 5px; }
.geral label { font-size: 14px; font-weight: 600; color: #374151; }
.geral input { padding: 10px; border-radius: 6px; border: 1px solid #d1d5db; background-color: #fff; font-size: 14px; }
.inputs { display: flex; gap: 15px; }
.inputs .geral { flex: 1; }

/* BOTÕES */
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
.cancel { padding: 10px 20px; background: #fff; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; }
.save { padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
.save:hover { background-color: #1d4ed8; }

/* TABELA */
.card-table-container { display: flex; justify-content: center; padding: 0 20px; }
.card-table { background: white; width: 100%; max-width: 1000px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { background: #f9fafb; padding: 15px; text-align: left; font-size: 12px; color: #4b5563; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; }
.styled-table td { padding: 15px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #111827; }
.text-bold { font-weight: 600; }
.badge-ca { background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
.btn-action { background: none; border: none; cursor: pointer; font-weight: 600; font-size: 13px; }
.edit { color: #2563eb; margin-right: 15px; }
.delete { color: #dc2626; }
.text-center { text-align: center; }

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .divider { display: none; }
  .navbar { padding: 15px 20px; }
  .input { width: 100%; }
}
</style>