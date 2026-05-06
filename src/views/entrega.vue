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
        <div class="form-row">
          <div class="form-group">
            <label>Funcionário</label>
            <select v-model="form.funcionario_id" class="custom-select">
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
                {{ e.nome_epi }} (Saldo: {{ estoqueMap[e.id] ?? 0 }})
              </option>
            </select>
          </div>
        </div>

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
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.assinatura_digital" />
              Assinatura digital confirmada
            </label>
          </div>
        </div>

        <div class="action-bar">
          <button 
            class="btn btn-primary" 
            @click="registrar" 
            :disabled="!form.funcionario_id || !form.cadastro_epi_id || loading"
          >
            {{ loading ? 'Processando...' : 'Registrar Entrega' }}
          </button>
        </div>

        <p class="error-msg" v-if="erro">⚠ {{ erro }}</p>
        <p class="success-msg" v-if="ok">✓ Entrega registrada com sucesso!</p>
      </div>
    </div>

    <!-- Tabela Histórico -->
    <div class="card-table">
      <div class="card-header flex-between">
        <h2>Histórico de Entregas</h2>
        <span class="badge badge-blue">{{ entregas.length }} registros</span>
      </div>

      <div v-if="loading && entregas.length === 0" class="text-center-loading">Carregando dados...</div>
      
      <div v-else class="table-container">
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
              <td>
                <div class="text-bold">{{ e.funcionarios?.nome || 'N/A' }}</div>
                <div class="cargo-text">{{ e.funcionarios?.setor }}</div>
              </td>
              <td>
                <div class="text-bold">{{ e.cadastro_epi?.nome_epi || 'N/A' }}</div>
                <div class="cargo-text">CA: {{ e.cadastro_epi?.ca }}</div>
              </td>
              <td class="text-bold">{{ e.quantidade_entregue }}</td>
              <td class="cargo-text">{{ formatarData(e.data_entrega) }}</td>
              <td>
                <span :class="e.assinatura_digital ? 'badge badge-ok' : 'badge badge-warn'">
                  {{ e.assinatura_digital ? 'Confirmada' : 'Pendente' }}
                </span>
              </td>
            </tr>
            <tr v-if="entregas.length === 0 && !loading">
              <td colspan="5" style="text-align: center; padding: 20px;">Nenhuma entrega registrada.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabase } from '../composables/useSupabase';
const { supabase } = useSupabase();

const funcionarios = ref([]);
const epis = ref([]);
const entregas = ref([]);
const estoqueMap = ref({});
const loading = ref(false);
const erro = ref('');
const ok = ref(false);

const hoje = new Date().toISOString().slice(0, 10);

const form = ref({ 
  funcionario_id: '', 
  cadastro_epi_id: '', 
  quantidade_entregue: 1, 
  data_entrega: hoje, 
  assinatura_digital: false 
});

async function carregar() {
  loading.value = true;
  erro.value = '';
  try {
    // 1. Carregar Funcionários, EPIs e Estoque
    const [resFunc, resEpi, resEstoque] = await Promise.all([
      supabase.from('funcionarios').select('*').order('nome'),
      supabase.from('cadastro_epi').select('*').order('nome_epi'),
      supabase.from('estoque').select('cadastro_epi_id, quantidade')
    ]);

    if (resFunc.error) throw resFunc.error;
    if (resEpi.error) throw resEpi.error;

    funcionarios.value = resFunc.data || [];
    epis.value = resEpi.data || [];
    
    if (resEstoque.data) {
      estoqueMap.value = Object.fromEntries(
        resEstoque.data.map(i => [i.cadastro_epi_id, i.quantidade])
      );
    }

    // 2. Carregar histórico (Corrigido para não usar created_at caso não exista)
    const { data: entData, error: entError } = await supabase
      .from('entregas')
      .select(`
        *,
        funcionarios (nome, setor),
        cadastro_epi (nome_epi, ca)
      `)
      .order('data_entrega', { ascending: false }); // Alterado para data_entrega

    if (entError) throw entError;
    entregas.value = entData || [];

  } catch (e) {
    console.error("Erro ao carregar:", e);
    erro.value = "Falha técnica: " + (e.hint || e.message);
  } finally {
    loading.value = false;
  }
}

async function registrar() {
  erro.value = ''; ok.value = false; loading.value = true;
  
  try {
    const epiId = form.value.cadastro_epi_id;
    const qtdPedida = form.value.quantidade_entregue;
    const saldoAtual = estoqueMap.value[epiId] ?? 0;

    // Validação básica
    if (!form.value.funcionario_id || !epiId) {
      throw new Error("Selecione o funcionário e o EPI.");
    }

    if (qtdPedida > saldoAtual) {
      throw new Error(`Estoque insuficiente! Saldo atual: ${saldoAtual}`);
    }

    // Inserir entrega
    const { error: insError } = await supabase.from('entregas').insert([form.value]);
    if (insError) throw insError;

    // Atualizar estoque
    const { error: updError } = await supabase
      .from('estoque')
      .update({ quantidade: saldoAtual - qtdPedida })
      .eq('cadastro_epi_id', epiId);
    
    if (updError) throw updError;

    ok.value = true;
    // Reset do formulário preservando a data de hoje
    form.value = { 
      funcionario_id: '', 
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
.layout-container { width: 100%; padding: 20px 30px; background-color: #f8fafc; min-height: 100vh; box-sizing: border-box; font-family: 'Inter', sans-serif; }
.header-section h1 { color: #0f172a; margin: 0; }
.card-form, .card-table { background: white; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px; }
.card-header { background: #f8fafc; padding: 15px 20px; border-bottom: 1px solid #e2e8f0; font-weight: bold; }
.main-form { padding: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.cols-3 { grid-template-columns: 1fr 1fr 1.2fr; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
label { font-size: 13px; font-weight: 600; color: #475569; }
.custom-select, input { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }
.btn-primary { background: #0f172a; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-primary:disabled { background: #cbd5e1; cursor: not-allowed; }
.error-msg { color: #dc2626; font-weight: bold; margin-top: 10px; font-size: 14px; }
.success-msg { color: #16a34a; font-weight: bold; margin-top: 10px; font-size: 14px; }
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { text-align: left; padding: 12px 20px; background: #f1f5f9; font-size: 12px; color: #64748b; text-transform: uppercase; }
.styled-table td { padding: 12px 20px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
.badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
.badge-blue { background: #e0f2fe; color: #0369a1; }
.badge-ok { background: #dcfce7; color: #166534; }
.badge-warn { background: #fef9c3; color: #854d0e; }
.text-bold { font-weight: 600; color: #1e293b; }
.cargo-text { font-size: 12px; color: #64748b; }
.text-center-loading { padding: 40px; text-align: center; color: #64748b; }
</style>