import {
  appointments,
  channel,
  contacts,
  conversations,
  leads,
  messages,
  orgId,
  pipeline,
  stages,
  team,
  today,
  userId,
  uuid,
  agents,
} from "./data";

export const demoWriteError = {
  error: {
    code: "visual_demo",
    message: "Demo visual: nenhuma mensagem é enviada e nenhuma alteração é salva no servidor.",
  },
};
const envelope = (data: unknown) => ({
  data,
  meta: { has_more: false, cursor: null, total: Array.isArray(data) ? data.length : undefined },
});

export function demoResponse(url: URL): { body: unknown; status: number } {
  const path = url.pathname.replace(/^\/api\/v1\//, "");
  let data: unknown = [];
  if (path === "contacts") {
    const q = (url.searchParams.get("search") ?? "").toLocaleLowerCase("pt-BR");
    const tags = url.searchParams.getAll("tag");
    const source = url.searchParams.get("source");
    data = contacts.filter(
      (c) =>
        (!q || `${c.name} ${c.email}`.toLocaleLowerCase("pt-BR").includes(q)) &&
        (!source || c.source === source) &&
        (tags.length === 0 ||
          (url.searchParams.get("modo") === "ou"
            ? tags.some((t) => c.tags.includes(t))
            : tags.every((t) => c.tags.includes(t)))),
    );
  } else if (path === "contacts/tags") data = ["Demonstração", "Interessado", "Novo contato"];
  else if (/^contacts\/[^/]+$/.test(path)) {
    data = contacts.find((c) => c.id === path.split("/")[1]);
    if (!data)
      return {
        body: { error: { code: "not_found", message: "Contato de demonstração não encontrado." } },
        status: 404,
      };
  } else if (/^contacts\/[^/]+\/leads$/.test(path))
    data = leads.filter((l) => l.contact_id === path.split("/")[1]);
  else if (/^contacts\/[^/]+\/proposals$/.test(path)) data = { items: [] };
  else if (/^contacts\/[^/]+\/crm-summary$/.test(path))
    data = {
      leads: leads
        .filter((l) => l.contact_id === path.split("/")[1])
        .map((l) => ({
          ...l,
          field_defs: [],
          funil_nome: pipeline.name,
          etapa_nome: stages.find((s) => s.id === l.stage_id)?.name,
          etapas_do_funil: stages,
          motivos_de_perda: [],
        })),
      orders: [],
      activities: [],
      demandas: [],
      fatos: [],
      historico: [],
    };
  else if (/^contacts\/[^/]+\/conversations$/.test(path))
    data = conversations.filter((c) => c.contact_id === path.split("/")[1]);
  else if (path === "pipelines") data = [pipeline];
  else if (path === "pipelines/default") data = { pipeline, stages };
  else if (/^pipelines\/[^/]+\/forecast$/.test(path))
    data = {
      pipeline_id: pipeline.id,
      fonte: "etapa",
      meses: [],
      totais: [],
      sem_data: [],
      sem_probabilidade: [],
      recorrencia_nao_mensal: [],
    };
  else if (/^pipelines\/[^/]+\/board$/.test(path)) data = { pipeline, stages, leads };
  else if (/^pipelines\/[^/]+\/stages$/.test(path)) data = stages;
  else if (/^pipelines\/[^/]+$/.test(path)) data = pipeline;
  else if (path === "leads/at-risk")
    data = {
      items: [],
      counts: { critico: 0, em_risco: 0, em_voo: 0 },
      total: 0,
      sem_proximo_passo: [],
      total_sem_proximo_passo: 0,
      propostas_vencidas_sem_retomada: [],
      propostas_esperando_revisao: [],
    };
  else if (path === "leads") data = leads;
  else if (/^leads\/[^/]+$/.test(path))
    data = leads.find((l) => l.id === path.split("/")[1]) ?? null;
  else if (/^conversations\/[^/]+\/messages$/.test(path)) data = messages(path.split("/")[1]!);
  else if (/^conversations\/[^/]+\/retention$/.test(path)) data = { retentions: [], context: {} };
  else if (/^conversations\/[^/]+\/participants$/.test(path)) data = { participantes: [] };
  else if (/^conversations\/[^/]+$/.test(path))
    data = conversations.find((c) => c.id === path.split("/")[1]) ?? null;
  else if (path === "conversations") {
    const status = url.searchParams.get("status");
    data = status === "closed" ? [] : conversations;
  } else if (path === "channel-sessions") data = [channel];
  else if (
    path === "team" ||
    path === "team/assignable" ||
    path === "attendants" ||
    path === "agenda/pessoas"
  )
    data = team;
  else if (path === "tasks")
    data = {
      tasks: leads.slice(0, 4).map((l, i) => ({
        id: uuid(700 + i),
        organization_id: orgId,
        title: [
          "Apresentar proposta comercial",
          "Confirmar reunião",
          "Revisar requisitos da integração",
          "Preparar demonstração",
        ][i],
        description: "Tarefa fictícia",
        due_date: `${today}T18:00:00-03:00`,
        priority: i === 0 ? "high" : "medium",
        status: i === 3 ? "in_progress" : "pending",
        lead_id: l.id,
        contact_id: l.contact_id,
        demanda_id: null,
        assigned_to: userId,
        created_by: userId,
        created_at: l.created_at,
        updated_at: l.updated_at,
        lead: { id: l.id, title: l.title },
      })),
    };
  else if (path === "agenda/agendamentos")
    data = appointments.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      donoId: a.responsavelId,
      iniciaEm: a.comeca,
      terminaEm: a.termina,
      origem: a.origem,
      situacao: a.situacao,
      contato: { nome: a.quemSeraAtendido },
      tipo: { id: uuid(610), nome: "Reunião" },
    }));
  else if (path === "agenda/horarios-livres")
    data = { dias: [], timezone: "America/Bahia", slots: [] };
  else if (path === "metrics/attendants")
    data = {
      window: { from: today, to: today },
      owner_user_id: null,
      excluded_tag: null,
      excluded_conversations: 0,
      funnel: stages.map((s, i) => ({
        stage_id: s.id,
        stage_name: s.name,
        position: i,
        count: [8, 6, 4, 3, 2][i],
      })),
      attendants: team.map((t, i) => ({
        user_id: t.user_id,
        name: t.full_name,
        email: t.email,
        won: 4 - i,
        lost: i,
        conversations_handled: 14 - i * 3,
        avg_first_response_seconds: 90 + i * 25,
        median_first_response_seconds: 75 + i * 20,
      })),
    };
  else if (path === "metrics/atrito")
    data = {
      window: { from: today, to: today },
      escopo: {
        demandas: 24,
        demandas_abertas: 5,
        demandas_com_caso: 0,
        de: today,
        ate: today,
        abandono_horas: 24,
        repeticao_min: 5,
        espera_horas: 1,
        denominador: "demandas",
      },
      pares: [],
      regua: { abandono_horas: 24, default: 24 },
      componentes: { cliente: {}, empresa: {} },
    };
  else if (path === "metrics/channels")
    data = { window: { from: today, to: today }, owner_user_id: null, channels: [] };
  else if (path === "metrics/lost")
    data = {
      janela: { from: today, to: today },
      truncado: false,
      porMotivo: [],
      porCategoria: [],
      porEtapa: [],
      porMoeda: [],
      total: 0,
    };
  else if (path === "metrics/serie")
    data = {
      window: { from: today, to: today },
      granularidade: url.searchParams.get("granularidade") ?? "dia",
      baldes: [{ balde: today, ganhos: 2 }],
      total: 2,
      truncado: false,
    };
  else if (path === "metrics/metas")
    data = {
      window: { from: today, to: today },
      periodo: today.slice(0, 7),
      indicador: "ganhos",
      metas: [],
      valores_do_periodo: { por_moeda: [], negocios_com_recorrencia: 0, truncado: false },
    };
  else if (path === "ai/automatico-ativo") data = { ativo: false };
  else if (path === "ai/agents") data = agents;
  else if (path === "ai/cases") data = { cases: [], items: [], open_count: 0 };
  else if (path === "ai/inbox") data = { items: [], open_count: 0 };
  else if (path === "risk-radar" || path === "radar") data = [];
  else if (path.includes("notifications") || path.includes("alerts")) data = [];
  else if (path === "version" || path === "system/version")
    data = { current_version: "demo", is_owner: false, update_available: false };
  else if (path === "contact-tags" || path === "conversation-tags")
    data = ["Demonstração", "Interessado", "Novo contato"];
  else if (path === "tags/cores")
    data = {
      cores: { Demonstração: "#506d48", Interessado: "#3b82f6", "Novo contato": "#a855f7" },
    };
  return { body: envelope(data), status: 200 };
}
