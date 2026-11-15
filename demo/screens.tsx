"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "../components/ui/card";
import { NavHub } from "../components/shell/NavHub";
import {
  pipeline,
  stages,
  contacts,
  appointments,
  today,
  userId,
  uuid,
  agents,
  products,
} from "./lib/data";

const Contacts = dynamic(() =>
  import("../app/app/contacts/_client").then((m) => m.ContactsListClient),
);
const Contact = dynamic(() =>
  import("../app/app/contacts/[id]/_client").then((m) => m.ContactDetailClient),
);
const Funnels = dynamic(() => import("../app/app/kanban/_client").then((m) => m.FunisClient));
const Board = dynamic(() =>
  import("../app/app/pipelines/[id]/_client").then((m) => m.PipelinePageClient),
);
const Inbox = dynamic(() => import("../components/inbox/InboxLayout").then((m) => m.InboxLayout));
const Tasks = dynamic(() =>
  import("../app/app/tasks/_components/TarefasClient").then((m) => m.TarefasClient),
);
const Agenda = dynamic(() => import("../app/app/agenda/_client").then((m) => m.AgendaClient));
const Team = dynamic(() =>
  import("../app/app/team/_components/TeamMembersClient").then((m) => m.TeamMembersClient),
);
const Campaigns = dynamic(() =>
  import("../app/app/campaigns/_client").then((m) => m.ListaDeCampanhas),
);
const Panel = dynamic(() =>
  import("../app/app/painel/_components/PainelDeAtendimento").then((m) => m.PainelDeAtendimento),
);
const Companies = dynamic(() =>
  import("../app/app/companies/_client").then((m) => m.CompaniesListClient),
);
const Radar = dynamic(() =>
  import("../app/app/radar/_components/RiskRadarList").then((m) => m.RiskRadarList),
);
const Agents = dynamic(() =>
  import("../app/app/ai/agents/_components/AgentsList").then((m) => m.AgentsList),
);
const Metrics = dynamic(() =>
  import("../app/app/metrics/_components/MetricsClient").then((m) => m.MetricsClient),
);
const Connections = dynamic(() =>
  import("../components/connections/ConexoesShell").then((m) => m.ConexoesShell),
);
const Proposals = dynamic(() =>
  import("../app/app/proposals/_client").then((m) => m.ProposalsClient),
);
const Profile = dynamic(() =>
  import("../app/app/settings/profile/_form").then((m) => m.ProfileForm),
);
const Products = dynamic(() => import("../app/app/products/_client").then((m) => m.ProdutosClient));

function Heading({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-6 md:p-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {children}
    </div>
  );
}
export function DemoScreen({ path }: { path: string }) {
  const query = useSearchParams();
  if (path === "/app/contacts") return <Contacts />;
  if (path.startsWith("/app/contacts/"))
    return (
      <Contact
        contactId={path.split("/")[3] ?? contacts[0]!.id}
        paineisDeModulo={[]}
        acessosMcp={false}
        b2b={false}
      />
    );
  if (path === "/app/kanban")
    return (
      <Heading title="Funis">
        <Funnels
          funis={[{ ...pipeline, is_client_pipeline: false }]}
          arquivados={[]}
          podeGerenciar
          podeImportar
        />
      </Heading>
    );
  if (path.startsWith("/app/pipelines/"))
    return (
      <Board
        pipelineId={pipeline.id}
        initialName={pipeline.name}
        role="admin"
        funis={[pipeline]}
        funilInicial={pipeline}
        etapasIniciais={stages}
      />
    );
  if (path.startsWith("/app/inbox"))
    return (
      <Inbox
        initialSelectedId={path.split("/")[3] ?? query.get("id")}
        painelRecolhidoInicial={false}
      />
    );
  if (path === "/app/tasks")
    return <Tasks podeEditar minhasDeInicio={false} funis={[pipeline]} setoresLigados={false} />;
  if (path === "/app/agenda")
    return (
      <Agenda
        fusoDaAgenda="America/Bahia"
        fusoDeApresentacao="America/Bahia"
        hojeNaOrganizacao={today}
        usuarioId={userId}
        googleConfigurado={false}
        faltaNoGoogle={[]}
        tiposIniciais={[
          {
            id: uuid(610),
            nome: "Reunião",
            duracaoMin: 60,
            donoId: userId,
            localKind: null,
            localDetalhes: null,
          },
        ]}
        agendamentosIniciais={appointments}
        podeMarcar
      />
    );
  if (path === "/app/team")
    return (
      <Heading title="Equipe">
        <Team currentUserId={userId} canManage />
      </Heading>
    );
  if (path === "/app/campaigns") return <Campaigns />;
  if (path === "/app/proposals") return <Proposals podeCriar />;
  if (path === "/app/products")
    return (
      <Products
        inicial={products}
        total={products.length}
        pagina={1}
        porPagina={25}
        buscaInicial=""
        urlsDasFotos={{}}
        podeEditar
        textos={{
          titulo: "Produtos",
          subtitulo: "Catálogo de demonstração",
          vazio: "Nenhum produto",
          vazioDica: "Adicione um item ao catálogo.",
        }}
      />
    );
  if (path === "/app/metrics")
    return (
      <Heading title="Desempenho">
        <Metrics canCompare currentUserId={userId} />
      </Heading>
    );
  if (path === "/app/connections")
    return (
      <Heading title="Conexões">
        <Connections wahaConfigured={false} wacallsConfigured={false} />
      </Heading>
    );
  if (path === "/app/settings/profile")
    return (
      <Heading title="Perfil">
        <Profile
          email="visitante@example.invalid"
          initialFullName="Visitante"
          initialAvatarUrl={null}
          initialLocale="pt-BR"
          initialTimezone="America/Bahia"
        />
      </Heading>
    );
  if (path === "/app/painel") return <Panel />;
  if (path === "/app/companies") return <Companies />;
  if (path === "/app/radar")
    return (
      <Heading title="Radar de risco">
        <Radar />
      </Heading>
    );
  if (path === "/app/ai/agents")
    return (
      <Heading title="Agentes de IA">
        <Agents initialData={agents} canWrite />
      </Heading>
    );
  const hubs = {
    "/app/crm": ["crm", "CRM"],
    "/app/settings": ["organizacao", "Configurações"],
    "/app/ai": ["ia", "Inteligência artificial"],
    "/app/analise": ["analise", "Análise"],
  } as const;
  const hub = hubs[path as keyof typeof hubs];
  if (hub)
    return (
      <NavHub
        group={hub[0]}
        title={hub[1]}
        subtitle="Explore as telas da demonstração visual."
        isPlatformAdmin={false}
        role="admin"
        locale="pt-BR"
        modulosLigados={[]}
      />
    );
  return (
    <Heading title="Prévia da interface">
      <Card className="p-6">
        <p>Esta tela depende da infraestrutura original e ainda não foi incluída na demo visual.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Você pode explorar as telas originais de funis, contatos, atendimento, agenda, tarefas e
          equipe.
        </p>
        <Link className="mt-4 inline-block underline" href="/app/kanban">
          Voltar aos funis
        </Link>
      </Card>
    </Heading>
  );
}
