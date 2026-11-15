"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { Toaster } from "sonner";
import { Providers } from "../app/providers";
import { AuthProvider } from "../hooks/auth/AuthProvider";
import { IdiomaProvider } from "../lib/i18n/IdiomaProvider";
import { ThemeProvider } from "../lib/theme";
import { MarcaDaInstalacaoProvider } from "../lib/branding/contexto";
import { DEFAULT_APP_NAME } from "../lib/branding";
import { ProvedorDeCoresDasEtiquetas } from "../components/tags/CoresDasEtiquetas";
import { ProvedorDaOcupacaoDoRodape } from "../lib/ui/rodape-ocupado";
import { VoiceCallProvider } from "../components/voice/VoiceCallContext";
import { FaixasDeCima } from "../components/shell/FaixasDeCima";
import { Sidebar } from "../components/shell/Sidebar";
import { TopBar } from "../components/shell/TopBar";
import { BarraInferior } from "../components/shell/BarraInferior";
import { activeOrg, user } from "./lib/data";

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <ThemeProvider>
        <IdiomaProvider locale="pt-BR">
          <MarcaDaInstalacaoProvider
            marca={{ name: DEFAULT_APP_NAME, initial: "D", logoUrl: null, logoDarkUrl: null }}
          >
            <AuthProvider user={user} activeOrg={activeOrg}>
              <ProvedorDeCoresDasEtiquetas>
                <ProvedorDaOcupacaoDoRodape>
                  <VoiceCallProvider>
                    <FaixasDeCima>
                      <div className="demo-banner" role="status">
                        <span>
                          <strong>Demo visual</strong> · Dados fictícios · Sem envios ou alterações
                          no servidor
                        </span>
                        <Link href="/app/kanban">Funis</Link>
                        <Link href="/app/contacts">Contatos</Link>
                        <Link href="/app/inbox">Atendimento</Link>
                        <Link href="/app/agenda">Agenda</Link>
                      </div>
                    </FaixasDeCima>
                    <div className="flex min-h-[calc(100dvh-var(--faixas-de-cima,0px))] w-full bg-background">
                      <div className="hidden md:block">
                        <Sidebar collapsed={false} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <TopBar />
                        <main className="flex-1 overflow-auto p-4 pb-area-segura sm:p-6">
                          {children}
                        </main>
                      </div>
                      <BarraInferior />
                    </div>
                  </VoiceCallProvider>
                </ProvedorDaOcupacaoDoRodape>
              </ProvedorDeCoresDasEtiquetas>
            </AuthProvider>
            <Toaster position="bottom-right" richColors />
          </MarcaDaInstalacaoProvider>
        </IdiomaProvider>
      </ThemeProvider>
    </Providers>
  );
}
