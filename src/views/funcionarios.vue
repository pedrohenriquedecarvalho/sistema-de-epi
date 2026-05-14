<template>
  <div class="layout-container">
    
    <header class="header-section">
      <h1>Controle de Efetivo</h1>
      <p>Gerencie o cadastro de colaboradores e organize por setores.</p>
    </header>

    <main class="content">
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Alterar Registro' : 'Novo Funcionário' }}</h3>
        </div>
        
        <form @submit.prevent="salvar" class="main-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Nome Completo</label>
              <input v-model="form.nome" type="text" id="nome" placeholder="Digite o nome" required>
            </div>
            <div class="form-group">
              <label for="matricula">Nº Matrícula</label>
              <input v-model="form.matricula" type="text" id="matricula" placeholder="Ex: 5542" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="setor">Setor</label>
              <input v-model="form.setor" type="text" id="setor" placeholder="Ex: Manutenção" required>
            </div>
            <div class="form-group">
              <label for="cargo">Cargo</label>
              <input v-model="form.cargo" type="text" id="cargo" placeholder="Ex: Pedreiro" required>
            </div>
          </div>
          
          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Atualizar Dados' : 'Finalizar Cadastro' }}
            </button>
            <button v-if="editandoId" type="button" @click="cancelarEdicao" class="btn btn-outline">
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <section class="card-table">
        <!-- Div para scroll horizontal em tabelas largas -->
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Matrícula</th>
                <th>Setor / Cargo</th>
                <th class="text-center">Gerenciar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in funcionarios" :key="f.id">
                <td data-label="Colaborador"><span class="text-bold">{{ f.nome }}</span></td>
                <td data-label="Matrícula">{{ f.matricula }}</td>
                <td data-label="Setor / Cargo">
                  <span class="badge">{{ f.setor }}</span>
                  <span class="cargo-text">{{ f.cargo }}</span>
                </td>
                <td data-label="Ações" class="text-center">
                  <button @click="prepararEdicao(f)" class="btn-action edit">Editar</button>
                  <button @click="excluir(f.id)" class="btn-action delete">Excluir</button>
                </td>
              </tr>
              <tr v-if="funcionarios.length === 0">
                <td colspan="4" class="text-center">Nenhum funcionário cadastrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useSupabase } from '../composables/useSupabase';
const { supabase } = useSupabase();

const funcionarios = ref([]);
const editandoId = ref(null);
const form = reactive({ 
  nome: '', 
  matricula: '', 
  setor: '', 
  cargo: '' 
});

const carregar = async () => {
  const { data, error } = await supabase.from('funcionarios').select('*').order('nome');
  if (error) {
    console.error("Erro ao carregar:", error.message);
  } else {
    funcionarios.value = data || [];
  }
};

const salvar = async () => {
  if (editandoId.value) {
    await supabase.from('funcionarios').update(form).eq('id', editandoId.value);
  } else {
    await supabase.from('funcionarios').insert([form]);
  }
  cancelarEdicao();
  carregar();
};

const prepararEdicao = (f) => {
  editandoId.value = f.id;
  Object.assign(form, { 
    nome: f.nome, 
    matricula: f.matricula, 
    setor: f.setor, 
    cargo: f.cargo 
  });
};

const excluir = async (id) => {
  if (confirm('Deseja realmente remover este registro?')) {
    await supabase.from('funcionarios').delete().eq('id', id);
    carregar();
  }
};

const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, { nome: '', matricula: '', setor: '', cargo: '' });
};

onMounted(carregar);
</script>

<style scoped>
.layout-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px; /* Reduzi padding para telas menores */
  background-color: #f8fafc;
  min-height: 100vh;
}

.header-section { margin-bottom: 30px; text-align: center; }
.header-section h1 { color: #0f172a; font-size: clamp(1.4rem, 5vw, 1.8rem); }
.header-section p { color: #64748b; font-size: 0.95rem; }

/* Cards */
.card-form, .card-table {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  overflow: hidden; /* Garante que nada saia do card */
}

.card-header {
  background-color: #f8fafc;
  padding: 15px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.main-form { padding: 24px; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Duas colunas por padrão */
  gap: 20px;
  margin-bottom: 20px;
}

.form-group { display: flex; flex-direction: column; gap: 8px; }

label { font-size: 0.85rem; font-weight: 700; color: #475569; }

input {
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%; /* FUNDAMENTAL: Mudado de 500px para 100% */
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

/* Botões */
.action-bar { 
  display: flex; 
  gap: 12px; 
  flex-wrap: wrap; /* Botões empilham se não houver espaço */
}
.btn { 
  padding: 12px 24px; 
  border-radius: 8px; 
  font-weight: 600; 
  cursor: pointer; 
  flex: 1; /* Faz os botões crescerem igualmente no mobile */
  min-width: 150px;
  transition: opacity 0.2s;
}
.btn:active { opacity: 0.8; }
.btn-primary { background: #2563eb; color: white; border: none; }
.btn-outline { background: white; color: #64748b; border: 1px solid #cbd5e1; }

/* Tabela */
.table-responsive {
  width: 100%;
  overflow-x: auto; /* Scroll horizontal se necessário */
  -webkit-overflow-scrolling: touch;
}

.styled-table { width: 100%; border-collapse: collapse; min-width: 600px; }
.styled-table th {
  background-color: #f1f5f9;
  padding: 16px 24px;
  text-align: left;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  white-space: nowrap;
}

.styled-table td {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  font-size: 0.95rem;
}

.text-bold { font-weight: 600; color: #1e293b; }

.badge {
  background: #dcfce7;
  color: #166534;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 4px;
}

.cargo-text { color: #64748b; font-size: 0.85rem; display: block; }

/* Ações */
.btn-action {
  background: none;
  border: none;
  font-weight: 700;
  cursor: pointer;
  padding: 8px;
}

.edit { color: #2563eb; }
.delete { color: #be123c; }
.text-center { text-align: center; }

/* Media Queries para Mobile */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr; /* Uma coluna no mobile */
    gap: 15px;
  }

  .layout-container {
    padding: 10px;
  }

  .main-form {
    padding: 15px;
  }

  .header-section {
    margin-bottom: 20px;
  }

  /* Ajuste opcional para transformar tabela em "cards" no mobile */
  /* Se preferir manter o scroll horizontal, ignore o bloco abaixo */
  /*
  .styled-table, .styled-table tbody, .styled-table tr, .styled-table td { display: block; width: 100%; }
  .styled-table thead { display: none; }
  .styled-table tr { margin-bottom: 15px; border: 1px solid #e2e8f0; border-radius: 8px; }
  .styled-table td { text-align: right; position: relative; padding-left: 50%; }
  .styled-table td::before { content: attr(data-label); position: absolute; left: 15px; font-weight: bold; text-transform: uppercase; font-size: 0.7rem; }
  */
}
</style>