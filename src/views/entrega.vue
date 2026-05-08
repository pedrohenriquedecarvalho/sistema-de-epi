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

        <div class="form-row cols-3">
          <div class="form-group">
            <label>Quantidade</label>
            <input type="number" v-model.number="form.quantidade_entregue" min="1" />
          </div>
          <div class="form-group">
            <label>Data de Entrega</label>
            <input type="date" v-model="form.data_entrega" />
          </div>
          <div class="form-group checkbox-group" style="display: flex; align-items: center; padding-top: 25px;">
            <input type="checkbox" v-model="form.assinatura_digital" id="assinatura" />
            <label for="assinatura" style="margin-left: 8px; margin-bottom: 0; cursor: pointer;">Assinatura digital confirmada</label>
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
              <td>{{ e.funcionarios?.nome || 'N/A' }}</td>
              <td>{{ e.cadastro_epi?.nome_epi || 'N/A' }}</td>
              <td>{{ e.quantidade_entregue }}</td>
              <td>{{ formatarData(e.data_entrega) }}</td>
              <td>
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

// Nomes das chaves ajustados para as colunas do seu banco
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

    // Busca o histórico relacionando as tabelas para mostrar nomes em vez de IDs
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

    // Validação básica de estoque
    if (qtdPedida > saldoAtual) {
      throw new Error(`Estoque insuficiente! Saldo disponível: ${saldoAtual}`);
    }

    // Inserção com nomes de colunas confirmados via esquema
    const { error: insError } = await supabase.from('entregas').insert([{
      funcionarios_id: form.value.funcionarios_id,
      cadastro_epi_id: form.value.cadastro_epi_id,
      quantidade_entregue: qtdPedida,
      data_entrega: form.value.data_entrega,
      assinatura_digital: Boolean(form.value.assinatura_digital)
    }]);

    if (insError) throw insError;

    // Atualização do saldo na tabela de cadastro
    await supabase.from('cadastro_epi')
      .update({ quantidade: saldoAtual - qtdPedida })
      .eq('id', epi.id);

    ok.value = true;
    
    // Limpa o formulário
    form.value = { 
      funcionarios_id: '', 
      cadastro_epi_id: '', 
      quantidade_entregue: 1, 
      data_entrega: hoje, 
      assinatura_digital: false 
    };
    
    await carregar(); // Recarrega a lista e os saldos atualizados

  } catch (e) {
    erro.value = e.message;
    console.error("Erro no registro:", e);
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
.layout-container { width: 100%; padding: 20px 30px; background-color: #f8fafc; min-height: 100vh; font-family: sans-serif; }
.card-form, .card-table { background: white; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.card-header h2 { margin-top: 0; color: #0f172a; font-size: 1.25rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-weight: 600; color: #475569; margin-bottom: 4px; font-size: 0.9rem; }
.custom-select, input { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.95rem; }
.btn-primary { background: #1e293b; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
.btn-primary:hover:not(:disabled) { background: #334155; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { color: #dc2626; font-weight: bold; margin-top: 15px; font-size: 0.9rem; }
.success-msg { color: #16a34a; font-weight: bold; margin-top: 15px; font-size: 0.9rem; }
.styled-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.styled-table th { background: #f1f5f9; text-align: left; padding: 12px; color: #64748b; font-size: 0.85rem; text-transform: uppercase; }
.styled-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.95rem; }
.badge { padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }
.badge-blue { background: #e0f2fe; color: #0369a1; }
.badge-ok { background: #dcfce7; color: #166534; }
.badge-warn { background: #fef9c3; color: #854d0e; }
</style>