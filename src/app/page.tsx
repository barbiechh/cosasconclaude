"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FinancialData,
  FinancialResult,
  calculateFinancialHealth,
} from "@/lib/calculations";
import { trackEvent, EVENTS } from "@/lib/analytics";

type Screen = "landing" | "step1" | "step2" | "step3" | "results" | "thankyou";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [data, setData] = useState<FinancialData>({
    income: 0,
    incomeStability: "fixed",
    expenses: 0,
    debt: 0,
    interestRate: 12,
  });
  const [result, setResult] = useState<FinancialResult | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (screen === "landing") trackEvent(EVENTS.LANDING_VIEW);
    if (screen === "results") trackEvent(EVENTS.RESULTS_VIEW);
    if (screen === "thankyou") trackEvent(EVENTS.THANK_YOU_VIEW);
  }, [screen]);

  function goToStep(s: Screen) {
    if (screen !== "landing" && screen !== s) {
      trackEvent(EVENTS.STEP_COMPLETE, { step: screen });
    }
    setScreen(s);
    window.scrollTo({ top: 0 });
  }

  function calculateResults() {
    trackEvent(EVENTS.STEP_COMPLETE, { step: "step3" });
    const r = calculateFinancialHealth(data);
    setResult(r);
    setScreen("results");
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) return;
    setSubmitting(true);
    trackEvent(EVENTS.EMAIL_SUBMIT, { score: result?.score });

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          ...data,
          score: result?.score,
          savingsRate: result?.savingsRate,
          tier: result?.tier,
        }),
      });
    } catch {
      // continue anyway
    }

    setUnlocked(true);
    setSubmitting(false);
    setScreen("thankyou");
  }

  function shareResult() {
    trackEvent(EVENTS.SHARE_CLICK);
    const text = `Mi salud financiera es ${result?.score}/10. Descubre la tuya en 2 minutos:`;
    const url = typeof window !== "undefined" ? window.location.origin : "";
    if (navigator.share) {
      navigator.share({ title: "Mi Salud Financiera", text, url });
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, "_blank");
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header — matching calculadora-financiera */}
      <header className="w-full py-3 px-4 border-b border-ec-border bg-ec-bg sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Image
            src="/logo.png"
            alt="Inversionista del Futuro"
            width={120}
            height={38}
            className="h-[38px] w-auto rounded-lg"
            priority
          />
          <div className="hidden sm:block text-center flex-1">
            <h1 className="text-sm font-bold text-ec-text-bright uppercase tracking-wide">
              Salud Financiera
            </h1>
            <span className="text-xs text-ec-text-dim">by Espacio Cripto</span>
          </div>
          <a
            href="https://www.skool.com/espaciocripto/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-ec-accent text-ec-bg text-xs font-bold rounded-lg hover:bg-ec-accent-hover transition-all hover:-translate-y-px active:scale-[0.98] whitespace-nowrap"
          >
            Aprende a invertir con nosotros &rarr;
          </a>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          {/* LANDING */}
          {screen === "landing" && (
            <div className="animate-fade-up text-center space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ec-accent-dim rounded-full text-sm text-ec-accent font-medium">
                  <span className="w-2 h-2 bg-ec-accent rounded-full" />
                  2 minutos
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-ec-text-bright leading-tight">
                  Descubre tu{" "}
                  <span className="text-ec-accent">salud financiera</span>
                </h1>
                <p className="text-ec-text-dim text-lg max-w-md mx-auto">
                  Tu score, tu porcentaje de ahorro, y un plan personalizado
                  para mejorar en 30 días.
                </p>
              </div>

              <button
                onClick={() => {
                  trackEvent(EVENTS.FLOW_START);
                  goToStep("step1");
                }}
                className="w-full sm:w-auto px-8 py-4 bg-ec-accent hover:bg-ec-accent-hover text-ec-bg font-bold rounded-xl text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-ec-accent/20"
              >
                Comenzar gratis
              </button>

              <div className="flex items-center justify-center gap-6 text-sm text-ec-text-dim">
                <span className="flex items-center gap-1.5">
                  <CheckIcon /> Sin registro
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckIcon /> Resultados al instante
                </span>
              </div>

              {/* Social proof */}
              <div className="pt-4 border-t border-ec-border">
                <p className="text-sm text-ec-text-dim">
                  +2,400 personas ya conocen su score financiero
                </p>
              </div>
            </div>
          )}

          {/* STEP 1 - INCOME */}
          {screen === "step1" && (
            <div className="animate-fade-up space-y-6">
              <StepIndicator current={1} total={3} />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-ec-text-bright">
                  Tus ingresos
                </h2>
                <p className="text-ec-text-dim">
                  ¿Cuánto ganas al mes en promedio?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ec-text-dim mb-2">
                    Ingreso mensual
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ec-gray-2 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={data.income || ""}
                      onChange={(e) =>
                        setData({ ...data, income: Number(e.target.value) })
                      }
                      className="w-full pl-8 pr-4 py-4 bg-ec-surface border border-ec-border rounded-xl text-xl font-medium text-ec-text-bright focus:outline-none focus:ring-2 focus:ring-ec-accent focus:border-transparent transition-all placeholder:text-ec-gray-1"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ec-text-dim mb-2">
                    Tipo de ingreso
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        setData({ ...data, incomeStability: "fixed" })
                      }
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        data.incomeStability === "fixed"
                          ? "border-ec-accent bg-ec-accent-dim text-ec-accent"
                          : "border-ec-border text-ec-text-dim hover:border-ec-gray-1"
                      }`}
                    >
                      Fijo (salario)
                    </button>
                    <button
                      onClick={() =>
                        setData({ ...data, incomeStability: "variable" })
                      }
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        data.incomeStability === "variable"
                          ? "border-ec-accent bg-ec-accent-dim text-ec-accent"
                          : "border-ec-border text-ec-text-dim hover:border-ec-gray-1"
                      }`}
                    >
                      Variable (freelance)
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => goToStep("step2")}
                disabled={!data.income}
                className="w-full py-4 bg-ec-accent hover:bg-ec-accent-hover text-ec-bg font-bold rounded-xl text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                Continuar
              </button>
            </div>
          )}

          {/* STEP 2 - EXPENSES */}
          {screen === "step2" && (
            <div className="animate-fade-up space-y-6">
              <StepIndicator current={2} total={3} />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-ec-text-bright">
                  Tus gastos
                </h2>
                <p className="text-ec-text-dim">
                  ¿Cuánto gastas al mes aproximadamente?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ec-text-dim mb-2">
                    Gasto mensual total
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ec-gray-2 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={data.expenses || ""}
                      onChange={(e) =>
                        setData({ ...data, expenses: Number(e.target.value) })
                      }
                      className="w-full pl-8 pr-4 py-4 bg-ec-surface border border-ec-border rounded-xl text-xl font-medium text-ec-text-bright focus:outline-none focus:ring-2 focus:ring-ec-accent focus:border-transparent transition-all placeholder:text-ec-gray-1"
                      autoFocus
                    />
                  </div>
                </div>

                {data.income > 0 && data.expenses > 0 && (
                  <div className="p-3 bg-ec-surface rounded-xl border border-ec-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-ec-text-dim">Ahorro mensual:</span>
                      <span
                        className={`font-semibold ${data.income - data.expenses >= 0 ? "text-ec-green" : "text-ec-red"}`}
                      >
                        ${(data.income - data.expenses).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goToStep("step1")}
                  className="px-6 py-4 border border-ec-border text-ec-text-dim font-medium rounded-xl hover:bg-ec-surface transition-all"
                >
                  Atrás
                </button>
                <button
                  onClick={() => goToStep("step3")}
                  disabled={!data.expenses}
                  className="flex-1 py-4 bg-ec-accent hover:bg-ec-accent-hover text-ec-bg font-bold rounded-xl text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 - DEBT */}
          {screen === "step3" && (
            <div className="animate-fade-up space-y-6">
              <StepIndicator current={3} total={3} />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-ec-text-bright">
                  Tus deudas
                </h2>
                <p className="text-ec-text-dim">
                  ¿Cuánto debes en total? (tarjetas, préstamos, etc.)
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ec-text-dim mb-2">
                    Deuda total
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ec-gray-2 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={data.debt || ""}
                      onChange={(e) =>
                        setData({ ...data, debt: Number(e.target.value) })
                      }
                      className="w-full pl-8 pr-4 py-4 bg-ec-surface border border-ec-border rounded-xl text-xl font-medium text-ec-text-bright focus:outline-none focus:ring-2 focus:ring-ec-accent focus:border-transparent transition-all placeholder:text-ec-gray-1"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ec-text-dim mb-2">
                    Tasa de interés promedio: {data.interestRate}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={data.interestRate}
                    onChange={(e) =>
                      setData({
                        ...data,
                        interestRate: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-ec-text-dim mt-1">
                    <span>0%</span>
                    <span>60%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goToStep("step2")}
                  className="px-6 py-4 border border-ec-border text-ec-text-dim font-medium rounded-xl hover:bg-ec-surface transition-all"
                >
                  Atrás
                </button>
                <button
                  onClick={calculateResults}
                  className="flex-1 py-4 bg-ec-accent hover:bg-ec-accent-hover text-ec-bg font-bold rounded-xl text-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Ver mi resultado
                </button>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {screen === "results" && result && (
            <div className="space-y-6">
              {/* Score — blurred if locked */}
              <div className="animate-fade-up text-center space-y-4 bg-ec-surface rounded-2xl p-8 border border-ec-border relative">
                <p className="text-xs font-semibold text-ec-accent uppercase tracking-widest">
                  Tu salud financiera
                </p>
                <div className={!unlocked ? "blur-locked" : ""}>
                  <ScoreGauge score={result.score} />
                </div>
                <div className="inline-flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.tier === "critico"
                        ? "bg-ec-red/20 text-ec-red"
                        : result.tier === "mejorable"
                          ? "bg-ec-accent-dim text-ec-accent"
                          : "bg-ec-green-dim text-ec-green"
                    }`}
                  >
                    {result.tier === "critico"
                      ? "Estado Crítico"
                      : result.tier === "mejorable"
                        ? "Mejorable"
                        : "Excelente"}
                  </span>
                </div>
              </div>

              {/* EMAIL GATE — show right after score if locked */}
              {!unlocked && (
                <div className="animate-fade-up-delay-1 bg-ec-surface2 rounded-2xl p-6 border border-ec-border space-y-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-ec-accent-dim rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-6 h-6 text-ec-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-ec-text-bright text-lg">
                      Desbloquea tu plan personalizado
                    </h3>
                    <p className="text-sm text-ec-text-dim">
                      Recibe un plan claro y accionable para subir tu score
                      de {result.score} a {result.targetScore} en 30 días.
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-ec-bg border border-ec-border rounded-xl text-sm text-ec-text-bright focus:outline-none focus:ring-2 focus:ring-ec-accent focus:border-transparent placeholder:text-ec-gray-1"
                    />
                    <input
                      type="email"
                      placeholder="Tu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-ec-bg border border-ec-border rounded-xl text-sm text-ec-text-bright focus:outline-none focus:ring-2 focus:ring-ec-accent focus:border-transparent placeholder:text-ec-gray-1"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-ec-accent hover:bg-ec-accent-hover text-ec-bg font-bold rounded-xl transition-all disabled:opacity-60"
                    >
                      {submitting
                        ? "Enviando..."
                        : "Recibir mi plan gratis"}
                    </button>
                    <p className="text-xs text-ec-text-dim text-center">
                      Sin spam. Solo tu plan personalizado.
                    </p>
                  </form>
                </div>
              )}

              {/* BLURRED DIAGNOSTICS — teaser when locked */}
              {!unlocked && (
                <div className="blur-locked space-y-4 animate-fade-up-delay-2">
                  {result.diagnostics.slice(0, 3).map((d, i) => (
                    <div key={i} className="bg-ec-surface rounded-2xl p-5 border border-ec-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-ec-text-dim">{d.label}</span>
                        <span className="text-lg font-bold text-ec-text-bright">{d.value}</span>
                      </div>
                      <p className="text-xs text-ec-text-dim">{d.detail}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* UNLOCKED: Full diagnostics + plan */}
              {unlocked && (
                <div className="space-y-4 animate-fade-up">
                  {/* Detailed diagnostics */}
                  <div className="bg-ec-surface rounded-2xl p-6 border border-ec-border">
                    <p className="text-xs font-semibold text-ec-accent uppercase tracking-widest mb-4">
                      Diagnóstico detallado
                    </p>
                    <div className="space-y-4">
                      {result.diagnostics.map((d, i) => (
                        <div key={i} className="pb-4 border-b border-ec-border last:border-0 last:pb-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-ec-text">{d.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-ec-text-bright">{d.value}</span>
                              <span className={`w-2.5 h-2.5 rounded-full ${
                                d.status === "good" ? "bg-ec-green" : d.status === "warning" ? "bg-ec-accent" : "bg-ec-red"
                              }`} />
                            </div>
                          </div>
                          <p className="text-xs text-ec-text-dim">{d.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Savings rate bar */}
                  <div className="bg-ec-surface rounded-2xl p-6 border border-ec-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-ec-text-dim">
                        Tasa de ahorro
                      </span>
                      <span className="text-lg font-bold text-ec-text-bright">
                        {Math.round(result.savingsRate * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-ec-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min(100, Math.max(0, result.savingsRate * 100))}%`,
                          backgroundColor:
                            result.savingsRate >= 0.2
                              ? "#4CAF50"
                              : result.savingsRate >= 0.1
                                ? "#F7B11F"
                                : "#E53935",
                        }}
                      />
                    </div>
                    <p className="text-xs text-ec-text-dim mt-2">
                      Meta recomendada: 20%
                    </p>
                  </div>

                  {/* Percentile */}
                  <div className="bg-ec-accent-dim rounded-2xl p-4 border border-ec-accent/20 text-center">
                    <p className="text-sm text-ec-text">
                      Solo el{" "}
                      <span className="font-bold text-ec-accent">
                        {100 - result.percentile}%
                      </span>{" "}
                      de personas tiene mejor score que tú.
                    </p>
                  </div>

                  {/* Plan */}
                  <div className="bg-ec-surface rounded-2xl p-6 border border-ec-border">
                    <p className="text-xs font-semibold text-ec-accent uppercase tracking-widest mb-4">
                      Tu plan de mejora a 30 días
                    </p>
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 mb-3">
                        <div className="w-6 h-6 rounded-full bg-ec-accent-dim flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-ec-accent">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-sm text-ec-text">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <button
                onClick={shareResult}
                className="w-full py-3 border-2 border-ec-border text-ec-text font-medium rounded-xl hover:border-ec-accent transition-all flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Compartir mi resultado
              </button>
            </div>
          )}

          {/* THANK YOU */}
          {screen === "thankyou" && result && (
            <div className="animate-fade-up text-center space-y-6">
              <div className="w-16 h-16 bg-ec-green-dim rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-ec-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-ec-text-bright">
                  ¡Listo, {name}!
                </h2>
                <p className="text-ec-text-dim">
                  Revisa tu email. Te enviamos tu plan personalizado para subir
                  tu score de{" "}
                  <span className="font-bold text-ec-accent">
                    {result.score}
                  </span>{" "}
                  a{" "}
                  <span className="font-bold text-ec-green">
                    {result.targetScore}
                  </span>{" "}
                  en 30 días.
                </p>
              </div>

              <button
                onClick={() => {
                  setUnlocked(true);
                  setScreen("results");
                }}
                className="w-full py-4 bg-ec-accent hover:bg-ec-accent-hover text-ec-bg font-bold rounded-xl text-lg transition-all"
              >
                Ver mis resultados completos
              </button>

              <button
                onClick={shareResult}
                className="w-full py-3 border-2 border-ec-border text-ec-text font-medium rounded-xl hover:border-ec-accent transition-all flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Compartir con amigos
              </button>

              {/* Community CTA */}
              <CommunityBanner />
            </div>
          )}
        </div>
      </div>

      {/* Community CTA — always visible in footer */}
      {screen !== "thankyou" && (
        <div className="w-full border-t border-ec-border bg-ec-surface">
          <div className="max-w-lg mx-auto px-4 py-6">
            <CommunityBanner />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-ec-text-dim border-t border-ec-border">
        Hecho por{" "}
        <a
          href="https://www.espaciocripto.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ec-accent hover:underline"
        >
          Espacio Cripto
        </a>
      </footer>
    </main>
  );
}

function CommunityBanner() {
  return (
    <div className="bg-ec-surface2 rounded-2xl p-5 border border-ec-border text-center space-y-3">
      <p className="text-xs font-semibold text-ec-accent uppercase tracking-widest">
        Comunidad
      </p>
      <p className="text-sm text-ec-text">
        Aprende a invertir y mejorar tus finanzas con nuestra comunidad de
        +5,000 personas.
      </p>
      <a
        href="https://www.skool.com/espaciocripto/about"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-ec-accent hover:bg-ec-accent-hover text-ec-bg font-bold rounded-xl text-sm transition-all hover:-translate-y-px active:scale-[0.98]"
      >
        Unirme a la comunidad &rarr;
      </a>
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < current ? "w-10 bg-ec-accent" : "w-6 bg-ec-border"
            }`}
          />
        </div>
      ))}
      <span className="ml-auto text-xs text-ec-text-dim">
        {current}/{total}
      </span>
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const percentage = (score / 10) * 100;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference * 0.75;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#333333"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={
            score < 4 ? "#E53935" : score < 8 ? "#F7B11F" : "#4CAF50"
          }
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.5s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-ec-text-bright">{score}</span>
        <span className="text-sm text-ec-text-dim font-medium">de 10</span>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-ec-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
