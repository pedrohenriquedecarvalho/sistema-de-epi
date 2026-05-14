<template>
  <div class="layout-container">
    <header class="header-section">
      <h1>Entregas de EPI</h1>
      <p>Registro de entrega de equipamentos aos funcionários</p>
    </header>

    <div class="card-form">
      <div class="card-header">
        <h2>Nova Entrega</h2>
      </div>

      <div class="main-form">
        <!-- Grid responsiva: 2 colunas no desktop, 1 no mobile -->
        <div class="form-row">
          <div class="form-group">
            <label>Funcionário</label>
            <select v-model="form.funcionarios_id" class="custom-select">
              <option value="">Selecione o funcionário...</option>
              <option v-for="f in funcionarios" :key="f.id" :value="f.id">
                {{ f.nome }} — {{ f.setor }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>EPI</label>
            <select v-model="form.cadastro_epi_id" class="custom-select">
              <option value="">Selecione o EPI...</option>
              <option v-for="e in epis" :key="e.id" :value="e.id">
                {{ e.nome_epi }} (Saldo: {{ e.quantidade ?? 0 }})
              </option>
            </select>
          </div>
        </div>

        <!-- Grid responsiva: 3 colunas no desktop, 1 no mobile -->
        <div class="form-row cols-3">
          <div class="form-group">
            <label>Quantidade</label>
            <input type="number" v-model.number="form.quantidade_entregue" min="1" />
          </div>
          <div class="form-group">
            <label>Data de Entrega</label>
            <input type="date" v-model="form.data_entrega" />
          </div>
          <div class="form-group checkbox-group">
            <div class="checkbox-wrapper">
              <input type="checkbox" v-model="form.assinatura_digital" id="assinatura" />
              <label for="assinatura">Assinatura digital confirmada</label>
            </div>
          </div>
        </div>

        <div class="action-bar">
          <button 
            class="btn btn-primary" 
            @click="registrar" 
            :disabled="!form.funcionarios_id || !form.cadastro_epi_id || loading"
          >
            {{ loading ? 'Processando...' : 'Registrar Entrega' }}
          </button>
        </div>

        <p class="error-msg" v-if="erro">⚠ {{ erro }}</p>
        <p class="success-msg" v-if="ok">✓ Entrega registrada com sucesso!</p>
      </div>
    </div>

    <div class="card-table">
      <div class="card-header flex-between">
        <h2>Histórico de Entregas</h2>
        <span class="badge badge-blue">{{ entregas.length }} registros</span>
      </div>

      <!-- Wrapper para permitir scroll lateral na tabela em telas pequenas -->
      <div class="table-container">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>EPI</th>
              <th>Qtd</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in entregas" :key="e.id">
              <td data-label="Funcionário">{{ e.funcionarios?.nome || 'N/A' }}</td>
              <td data-label="EPI">{{ e.cadastro_epi?.nome_epi || 'N/A' }}</td>
              <td data-label="Qtd">{{ e.quantidade_entregue }}</td>
              <td data-label="Data">{{ formatarData(e.data_entrega) }}</td>
              <td data-label="Status">
                <span :class="e.assinatura_digital ? 'badge badge-ok' : 'badge badge-warn'">
                  {{ e.assinatura_digital ? 'Confirmada' : 'Pendente' }}
                </span>
              </td>
            </tr>
            <tr v-if="entregas.length === 0">
              <td colspan="5" style="text-align: center; padding: 20px;">Nenhuma entrega registrada.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// ... (manteve-se o mesmo Script Setup que você enviou, sem alterações na lógica)
import { ref, onMounted } from 'vue';
import { useSupabase } from '../composables/useSupabase';
const { supabase } = useSupabase();

const funcionarios = ref([]);
const epis = ref([]);
const entregas = ref([]);
const loading = ref(false);
const erro = ref('');
const ok = ref(false);

const hoje = new Date().toISOString().slice(0, 10);

const form = ref({ 
  funcionarios_id: '', 
  cadastro_epi_id: '', 
  quantidade_entregue: 1, 
  data_entrega: hoje, 
  assinatura_digital: false 
});

async function carregar() {
  loading.value = true;
  try {
    const [resFunc, resEpi] = await Promise.all([
      supabase.from('funcionarios').select('*').order('nome'),
      supabase.from('cadastro_epi').select('*').order('nome_epi')
    ]);

    funcionarios.value = resFunc.data || [];
    epis.value = resEpi.data || [];

    const { data: entData } = await supabase
      .from('entregas')
      .select(`
        *,
        funcionarios (nome),
        cadastro_epi (nome_epi)
      `)
      .order('created_at', { ascending: false });

    entregas.value = entData || [];
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
  } finally {
    loading.value = false;
  }
}

async function registrar() {
  erro.value = ''; ok.value = false; loading.value = true;
  try {
    const epi = epis.value.find(e => e.id === form.value.cadastro_epi_id);
    const qtdPedida = Number(form.value.quantidade_entregue);
    const saldoAtual = Number(epi?.quantidade || 0);

    if (qtdPedida > saldoAtual) {
      throw new Error(`Estoque insuficiente! Saldo disponível: ${saldoAtual}`);
    }

    const { error: insError } = await supabase.from('entregas').insert([{
      funcionarios_id: form.value.funcionarios_id,
      cadastro_epi_id: form.value.cadastro_epi_id,
      quantidade_entregue: qtdPedida,
      data_entrega: form.value.data_entrega,
      assinatura_digital: Boolean(form.value.assinatura_digital)
    }]);

    if (insError) throw insError;

    await supabase.from('cadastro_epi')
      .update({ quantidade: saldoAtual - qtdPedida })
      .eq('id', epi.id);

    ok.value = true;
    form.value = { 
      funcionarios_id: '', 
      cadastro_epi_id: '', 
      quantidade_entregue: 1, 
      data_entrega: hoje, 
      assinatura_digital: false 
    };
    await carregar();
  } catch (e) {
    erro.value = e.message;
  } finally {
    loading.value = false;
  }
}

function formatarData(d) {
  if (!d) return '—';
  const [y, m, dia] = d.split('-');
  return `${dia}/${m}/${y}`;
}

onMounted(carregar);
</script>

<style scoped>
/* Base */
.layout-container { 
  width: 100%; 
  padding: 20px; 
  background-color: #f8fafc; 
  min-height: 100vh; 
  font-family: sans-serif; 
  box-sizing: border-box;
}

.header-section { margin-bottom: 20px; }
.header-section h1 { font-size: 1.5rem; color: #0f172a; margin-bottom: 5px; }

/* Cards */
.card-form, .card-table { 
  background: white; 
  border: 1px solid #e2e8f0; 
  border-radius: 12px; 
  margin-bottom: 24px; 
  padding: clamp(15px, 5vw, 25px); 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
}

.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.card-header h2 { margin: 0; color: #0f172a; font-size: 1.1rem; }

/* Form Layout Responsivo */
.form-row { 
  display: grid; 
  grid-template-columns: 1fr; /* Padrão mobile: 1 coluna */
  gap: 16px; 
  margin-bottom: 16px; 
}

.form-group { display: flex; flex-direction: column; }
.form-group label { font-weight: 600; color: #475569; margin-bottom: 6px; font-size: 0.85rem; }

.custom-select, input { 
  padding: 12px; 
  border: 1px solid #cbd5e1; 
  border-radius: 8px; 
  font-size: 1rem; 
  width: 100%;
  box-sizing: border-box;
}

/* Ajuste específico para o checkbox no mobile e desktop */
.checkbox-group { justify-content: center; }
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  cursor: pointer;
}
.checkbox-wrapper input { width: auto; cursor: pointer; }
.checkbox-wrapper label { margin: 0; cursor: pointer; }

/* Ações */
.action-bar { margin-top: 10px; }
.btn-primary { 
  width: 100%; /* Botão largo no mobile */
  background: #1e293b; 
  color: white; 
  border: none; 
  padding: 14px; 
  border-radius: 8px; 
  cursor: pointer; 
  font-weight: bold; 
  font-size: 1rem;
}

/* Tabela Responsiva */
.table-container { 
  width: 100%; 
  overflow-x: auto; /* Scroll lateral para tabelas longas */
  -webkit-overflow-scrolling: touch;
}

.styled-table { 
  width: 100%; 
  border-collapse: collapse; 
  min-width: 600px; /* Garante que os dados não fiquem espremidos */
}

.styled-table th { 
  background: #f1f5f9; 
  text-align: left; 
  padding: 12px; 
  color: #64748b; 
  font-size: 0.75rem; 
  text-transform: uppercase; 
  letter-spacing: 0.05em;
}

.styled-table td { 
  padding: 14px 12px; 
  border-bottom: 1px solid #f1f5f9; 
  color: #334155; 
  font-size: 0.9rem; 
}

/* Badges */
.badge { padding: 4px 12px; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; white-space: nowrap; }
.badge-blue { background: #e0f2fe; color: #0369a1; }
.badge-ok { background: #dcfce7; color: #166534; }
.badge-warn { background: #fef9c3; color: #854d0e; }

.flex-between { display: flex; justify-content: space-between; align-items: center; gap: 10px; }

/* MEDIA QUERIES - Ajustes para Desktop */
@media (min-width: 768px) {
  .layout-container { padding: 30px 40px; }
  
  .form-row { grid-template-columns: 1fr 1fr; }
  .cols-3 { grid-template-columns: 1fr 1fr 1fr; }
  
  .btn-primary { width: auto; min-width: 200px; }
  
  .checkbox-group { padding-top: 25px; align-items: flex-start; }
}

/* Mensagens de feedback */
.error-msg, .success-msg { 
  margin-top: 15px; 
  padding: 10px; 
  border-radius: 6px; 
  font-size: 0.85rem; 
  text-align: center;
}
.error-msg { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
.success-msg { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
</style>