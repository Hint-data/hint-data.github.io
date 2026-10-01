// Hint-data Research — porta da área do cliente. Cada página de área chega cifrada (AES-256-GCM); a chave da área só sai de
// assets/porta/chaves.json com login e senha (PBKDF2-SHA256). PDFs e dashboards são .bin cifrados, abertos como blob no navegador.
(() => {
  const base = new URL(".", document.currentScript.src);   // …/assets/porta/
  const raiz = new URL("../../../", base);                  // raiz do site (base = clientes/assets/porta/)
  const LOJA = "hdr-chaves";
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const txt = new TextEncoder();
  const lerTodas = () => { for (const st of [localStorage, sessionStorage]) { try { const v = JSON.parse(st.getItem(LOJA) || "null"); if (v) return v; } catch (e) {} } return {}; };
  const guarda = (obj, lembrar) => { const st = lembrar ? localStorage : sessionStorage; try { st.setItem(LOJA, JSON.stringify(obj)); } catch (e) {} };
  const limpa = () => { for (const st of [sessionStorage, localStorage]) try { st.removeItem(LOJA); } catch (e) {} };
  const hash = async (login) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", txt.encode("hint-data-research:" + login.trim().toLowerCase())))).map((x) => x.toString(16).padStart(2, "0")).join("");
  async function decifra(chaveB64, build, bytes, comprimido) {
    const chave = await crypto.subtle.importKey("raw", b64(chaveB64), "AES-GCM", false, ["decrypt"]);
    const plano = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12), additionalData: txt.encode(build) }, chave, bytes.slice(12));
    return comprimido ? new Response(new Blob([plano]).stream().pipeThrough(new DecompressionStream("deflate-raw"))) : new Response(plano);
  }
  // abre um .bin da área (PDF ou dashboard HTML) numa aba nova; chamado pelos botões da página decifrada
  window.hintAbre = async (area, arq, tipo, nome) => {
    const w = window.open("", "_blank");   // aberto no gesto do clique (antes do fetch), senão o navegador bloqueia a aba
    if (w) w.document.write('<p style="font:15px system-ui;padding:24px">Decifrando o arquivo…</p>');
    const cfg = await (await fetch(new URL("chaves.json", base), { cache: "no-cache" })).json();
    const guardadas = lerTodas(); const k = guardadas[area]; const a = cfg.areas[area];
    if (!k || !a || k.b !== a.build) { alert("Sessão expirada. Entre de novo."); location.reload(); return; }
    const bytes = new Uint8Array(await (await fetch(new URL(area + "/r/" + arq, raiz + "clientes/"))).arrayBuffer());
    const r = await decifra(k.k, a.build, bytes, tipo !== "application/pdf");
    const blob = new Blob([await r.arrayBuffer()], { type: tipo });
    const url = URL.createObjectURL(blob);
    if (w) w.location = url; else { const l = document.createElement("a"); l.href = url; l.download = nome || "arquivo"; l.click(); }
  };
  window.hintSair = () => { limpa(); location.href = raiz + "clientes/"; };
  async function abrePagina(area, cfg) {
    const k = lerTodas()[area]; if (!k || k.b !== cfg.areas[area].build) return false;
    try {
      const r = await decifra(k.k, cfg.areas[area].build, b64(document.getElementById("cifra").textContent.trim()), true);
      const html = await r.text(); document.open(); document.write(html); document.close();
      if (location.hash) { const alvo = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (alvo) alvo.scrollIntoView(); }
      return true;
    } catch (e) { return false; }
  }
  async function entra(cfg, login, senha) {
    const h = await hash(login); const chaves = {};
    const mat = await crypto.subtle.importKey("raw", txt.encode(senha), "PBKDF2", false, ["deriveKey"]);
    for (const [area, a] of Object.entries(cfg.areas)) {
      const u = a.u[h]; if (!u) continue;
      try {
        const kek = await crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: b64(u.sal), iterations: cfg.iter }, mat, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
        const k = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(u.iv), additionalData: txt.encode(a.build) }, kek, b64(u.k));
        chaves[area] = { b: a.build, k: btoa(String.fromCharCode(...new Uint8Array(k))) };
      } catch (e) {}
    }
    if (!Object.keys(chaves).length) throw new Error("x");
    return chaves;
  }
  (async () => {
    const cfg = await (await fetch(new URL("chaves.json", base), { cache: "no-cache" })).json();
    const f = document.getElementById("porta"), erro = document.getElementById("e"), area = f.dataset.area || "";
    if (area && await abrePagina(area, cfg)) return;
    if (!area) {   // página de entrada (/clientes/): já logado → vai para a área
      const g = lerTodas(); const ok = Object.keys(g).filter((a) => cfg.areas[a] && cfg.areas[a].build === g[a].b);
      if (ok.length === 1) { location.href = raiz + "clientes/" + ok[0] + "/"; return; }
      if (ok.length > 1) { f.hidden = false; f.innerHTML = '<span class="wm">HINT-DATA RESEARCH</span><h1>Suas áreas</h1>' + ok.map((a) => `<p><a href="${raiz}clientes/${a}/">${a}</a></p>`).join("") + '<p><a href="#" onclick="hintSair();return false">Sair</a></p>'; return; }
    }
    f.hidden = false; document.getElementById("u").focus();
    f.onsubmit = async (ev) => {
      ev.preventDefault(); erro.textContent = "Conferindo…";
      let chaves;
      try { chaves = await entra(cfg, document.getElementById("u").value, document.getElementById("s").value); }
      catch (e) { erro.textContent = "Login ou senha incorretos."; return; }
      guarda(chaves, document.getElementById("l").checked);
      if (area) { if (!(await abrePagina(area, cfg))) erro.textContent = "Este login não tem acesso a esta área."; return; }
      const as = Object.keys(chaves); location.href = raiz + "clientes/" + as[0] + "/";
    };
  })();
})();
