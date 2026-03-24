"use client";

import { useState } from "react";
import Image from "next/image";

type FormData = {
  nomeContato: string;
  nomeLoja: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  whatsapp: string;
};

type Status = "idle" | "loading" | "success" | "error";

function formatCNPJ(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatCEP(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

function formatWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export default function Home() {
  const [form, setForm] = useState<FormData>({
    nomeContato: "",
    nomeLoja: "",
    cnpj: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    whatsapp: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === "cnpj") {
      setForm((prev) => ({ ...prev, cnpj: formatCNPJ(value) }));
    } else if (name === "cep") {
      setForm((prev) => ({ ...prev, cep: formatCEP(value) }));
    } else if (name === "whatsapp") {
      setForm((prev) => ({ ...prev, whatsapp: formatWhatsApp(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao enviar");
      }

      setStatus("success");
      setForm({ nomeContato: "", nomeLoja: "", cnpj: "", endereco: "", cidade: "", estado: "", cep: "", whatsapp: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro inesperado");
    }
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#4BB050] transition-colors";

  const labelClass = "block text-sm font-medium text-white/60 mb-1";

  const ESTADOS = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
    "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
  ];

  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-10 pb-10 text-center overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#4BB05015_0%,_transparent_70%)] pointer-events-none" />

        {/* Logo */}
        <div className="relative mb-8">
          <Image
            src="/logo.png"
            alt="Tribosanta"
            width={300}
            height={109}
            className="object-contain"
            priority
          />
        </div>

        <div className="inline-block bg-[#4BB050]/10 border border-[#4BB050]/30 text-[#4BB050] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          Programa de Revendedores
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-2xl mb-4">
          Vista sua loja com o que{" "}
          <span className="text-[#4BB050]">realmente vende</span>
        </h1>

        <p className="text-white/50 text-lg max-w-xl leading-relaxed">
          Moda masculina com identidade. Cadastre sua loja e tenha acesso ao catálogo exclusivo de revendedores Tribosanta.
        </p>
      </section>

      {/* Benefícios */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "🏷️", title: "Preço de Atacado", desc: "Margens competitivas para revendedores" },
            { icon: "📦", title: "Entrega Rápida", desc: "Logística eficiente para todo o Brasil" },
            { icon: "🤝", title: "Suporte Dedicado", desc: "Equipe pronta para atender sua loja" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/[0.03] border border-white/8 rounded-xl p-5 text-center"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-bold mb-1">{item.title}</h3>
              <p className="text-white/40 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulário */}
      <section className="flex-1 px-6 pb-20">
        <div className="max-w-xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-1">Cadastre sua loja</h2>
            <p className="text-white/40 text-sm mb-8">Preencha os dados abaixo e entraremos em contato.</p>

            {status === "success" ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-[#4BB050]/10 border border-[#4BB050]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#4BB050]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Cadastro recebido!</h3>
                <p className="text-white/50">Nossa equipe vai entrar em contato em breve.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-[#4BB050] text-sm underline underline-offset-4"
                >
                  Enviar outro cadastro
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>Nome do Contato *</label>
                  <input
                    type="text"
                    name="nomeContato"
                    value={form.nomeContato}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome completo"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>WhatsApp *</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    required
                    placeholder="(00) 00000-0000"
                    inputMode="numeric"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Nome da Loja *</label>
                  <input
                    type="text"
                    name="nomeLoja"
                    value={form.nomeLoja}
                    onChange={handleChange}
                    required
                    placeholder="Nome da sua loja"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>CNPJ *</label>
                  <input
                    type="text"
                    name="cnpj"
                    value={form.cnpj}
                    onChange={handleChange}
                    required
                    placeholder="00.000.000/0000-00"
                    inputMode="numeric"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Endereço (Rua e Número) *</label>
                  <input
                    type="text"
                    name="endereco"
                    value={form.endereco}
                    onChange={handleChange}
                    required
                    placeholder="Rua, número, complemento"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Cidade *</label>
                    <input
                      type="text"
                      name="cidade"
                      value={form.cidade}
                      onChange={handleChange}
                      required
                      placeholder="Cidade"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Estado *</label>
                    <select
                      name="estado"
                      value={form.estado}
                      onChange={handleChange}
                      required
                      className={inputClass + " cursor-pointer"}
                    >
                      <option value="">UF</option>
                      {ESTADOS.map((uf) => (
                        <option key={uf} value={uf} className="bg-zinc-900">
                          {uf}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>CEP *</label>
                  <input
                    type="text"
                    name="cep"
                    value={form.cep}
                    onChange={handleChange}
                    required
                    placeholder="00000-000"
                    inputMode="numeric"
                    className={inputClass}
                  />
                </div>

                {status === "error" && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#4BB050] hover:bg-[#3d9642] disabled:bg-[#4BB050]/40 text-white font-bold py-4 rounded-lg transition-colors text-base tracking-wide mt-2"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    "Quero ser revendedor"
                  )}
                </button>

                <p className="text-center text-white/20 text-xs pt-2">
                  Seus dados são usados apenas para contato comercial.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-white/20 text-sm">
        © {new Date().getFullYear()} Tribosanta. Todos os direitos reservados.
      </footer>
    </main>
  );
}
