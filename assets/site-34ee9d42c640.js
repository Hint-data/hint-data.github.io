(()=>{const t=document.querySelector('.topo');let y=scrollY;addEventListener('scroll',()=>{const n=scrollY;if(t&&innerWidth<=720)t.classList.toggle('some',n>y&&n>140);y=n},{passive:true});
const c=document.querySelector('nav.sub [aria-current]');if(c)c.scrollIntoView({block:'nearest',inline:'center'});
const abre=(s,tit,leg)=>{const o=document.createElement('div');o.className='lupa';o.setAttribute('role','dialog');o.innerHTML='<div class="barra"><b></b><button type="button">Fechar</button></div><div class="area"></div><p class="dica">Arraste para os lados e use o gesto de pinça para aproximar. No celular deitado, o gráfico cabe inteiro.</p>';
o.querySelector('b').textContent=tit||'';const cl=s.cloneNode(true);o.querySelector('.area').appendChild(cl);(cl.matches('svg')?[cl]:[...cl.querySelectorAll('svg')]).forEach(x=>x.style.width='max('+Math.round(vb(x)*1.15)+'px,100%)');if(leg){const p=document.createElement('p');p.className='leg';p.textContent=leg;o.querySelector('.area').appendChild(p)}document.body.appendChild(o);document.documentElement.style.overflow='hidden';history.pushState({lupa:1},'');
const fecha=()=>{o.remove();document.documentElement.style.overflow=''};o.querySelector('button').onclick=()=>history.back();addEventListener('popstate',fecha,{once:true});addEventListener('keydown',e=>{if(e.key==='Escape')history.back()},{once:true})};
const vb=s=>s.viewBox&&s.viewBox.baseVal?s.viewBox.baseVal.width:0;
document.querySelectorAll('.corpo svg.graf').forEach(s=>{const alvo=s.closest('.duas')||s;if(alvo.dataset.amp)return;alvo.dataset.amp=1;
if(![...alvo.querySelectorAll?.('svg.graf')||[],s].some(x=>vb(x)>1.2*Math.min(innerWidth,x.getBoundingClientRect().width||innerWidth)))return;   // só quando o texto encolhe mais de 20%
const f=s.closest('figure');const tit=(f?.querySelector('.fig-t')?.textContent||'').slice(0,90);const nx=alvo.nextElementSibling;
const leg=f?[f.querySelector('.fig-n')?.textContent,f.querySelector('.fig-f')?.textContent].filter(Boolean).join(' '):(nx&&nx.matches('p')&&nx.querySelector(':scope > em:only-child')?nx.textContent:'');const mapa=s.classList.contains('mapa');
const b=document.createElement('button');b.type='button';b.className='amplia';b.textContent=mapa?'⤢ Ampliar mapa':'⤢ Ampliar gráfico';b.onclick=()=>abre(alvo,tit,leg);alvo.after(b);
alvo.addEventListener('click',()=>{if(innerWidth<=720)abre(alvo,tit,leg)})});})()
;
(()=>{
const N=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();let idx=null,box=null,sel=0,searchFocus=null,searchOverflow="";
const abre=async()=>{if(box)return;searchFocus=document.activeElement;searchOverflow=document.documentElement.style.overflow;box=document.createElement('dialog');box.className='busca';box.setAttribute('aria-label','Buscar no Research');box.innerHTML='<div class="cx"><button type="button" class="busca-fechar" aria-label="Fechar busca">Fechar</button><input type="search" placeholder="Buscar notas, séries, temas…" aria-label="Buscar"><ol></ol><div class="pe"><span>↑↓ para navegar · Enter para abrir</span><span>Esc para fechar</span></div></div>';
document.body.appendChild(box);box.showModal();box.querySelector('.busca-fechar').onclick=fecha;box.addEventListener('cancel',e=>{e.preventDefault();fecha()});document.documentElement.style.overflow='hidden';const i=box.querySelector('input'),ol=box.querySelector('ol');i.focus();
box.addEventListener('click',e=>{if(e.target===box)fecha()});
if(!idx){try{idx=await (await fetch('/busca.json')).json()}catch(e){idx=[]}}
const mostra=()=>{const q=N(i.value).split(/\s+/).filter(Boolean);const r=(q.length?idx.filter(x=>q.every(t=>x.k.includes(t))):idx).slice(0,12);sel=0;
ol.innerHTML=r.length?r.map((x,j)=>`<li><a href="${x.u}"${j?'':' class="on"'}><span>${x.m}</span><b></b></a></li>`).join(''):'<li class="nada">Nada encontrado.</li>';
ol.querySelectorAll('b').forEach((b,j)=>b.textContent=r[j].t)};
idx.forEach(x=>x.k=x.k||N(x.t+' '+x.m+' '+x.r));mostra();i.addEventListener('input',mostra);
i.addEventListener('keydown',e=>{const as=[...ol.querySelectorAll('a')];if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!as.length)return;as[sel].classList.remove('on');sel=(sel+(e.key==='ArrowDown'?1:as.length-1))%as.length;as[sel].classList.add('on');as[sel].scrollIntoView({block:'nearest'})}
else if(e.key==='Enter'&&as[sel]){location.href=as[sel].href}})};
const fecha=()=>{if(!box)return;box.close();box.remove();box=null;document.documentElement.style.overflow=searchOverflow;searchFocus?.focus({preventScroll:true})};
document.querySelectorAll('.busca-bt').forEach(b=>b.addEventListener('click',abre));
addEventListener('keydown',e=>{if(e.key==='Escape')fecha();const t=e.target.tagName;if(box||t==='INPUT'||t==='TEXTAREA')return;if(e.key==='/'||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k')){e.preventDefault();abre()}});
const pr=document.querySelector('.prog'),art=document.querySelector('.leitura article');if(pr&&art){pr.innerHTML='<i></i>';const b=pr.firstChild;const f=()=>{const r=art.getBoundingClientRect();const p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));b.style.width=(p*100)+'%'};addEventListener('scroll',f,{passive:true});f()}
const links=[...document.querySelectorAll('.rail li a')];if(links.length&&'IntersectionObserver' in window){const hs=links.map(a=>document.getElementById(a.hash.slice(1))).filter(Boolean);
const on=id=>links.forEach(a=>a.classList.toggle('on',a.hash==='#'+id));const io=new IntersectionObserver(es=>{const v=es.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(v)on(v.target.id)},{rootMargin:'-120px 0px -65% 0px'});hs.forEach(h=>io.observe(h))}
const cp=document.querySelector('.rail .copia');if(cp)cp.addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(location.href.split('#')[0]).then(()=>{cp.textContent='Link copiado ✓';setTimeout(()=>cp.textContent='Copiar link da nota',1800)})});
const A2=document.querySelector('[data-arq2]');if(A2){const st={v:'',s:'',q:''};const rows=[...A2.querySelectorAll('.arow')],ms=[...A2.querySelectorAll('.alista .mes')],inp=A2.querySelector('[data-aq]'),cnt=A2.querySelector('.aconta b'),vz=A2.querySelector('[data-avazio]');
const vb=[...A2.querySelectorAll('.abarra [data-v]')],sb=[...A2.querySelectorAll('.vl-s [data-s]')];
const ap=()=>{const q=N(st.q).split(/\s+/).filter(Boolean);let n=0;rows.forEach(r=>{const ok=(!st.v||r.dataset.v===st.v)&&(!st.s||r.dataset.s===st.s)&&q.every(t=>r.dataset.q.includes(t));r.hidden=!ok;if(ok)n++});
ms.forEach(m=>{let x=m.nextElementSibling,vis=false;while(x&&x.classList.contains('arow')){if(!x.hidden)vis=true;x=x.nextElementSibling}m.hidden=!vis});cnt.textContent=n;if(cnt.nextSibling)cnt.nextSibling.textContent=n===1?' publicação':' publicações';vz.hidden=n>0;
vb.forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===st.v));sb.forEach(b=>b.setAttribute('aria-pressed',b.dataset.s===st.s))};
vb.forEach(b=>b.addEventListener('click',()=>{st.v=b.dataset.v;if(st.s&&!st.s.startsWith(st.v+'/'))st.s='';ap()}));
sb.forEach(b=>b.addEventListener('click',()=>{if(st.s===b.dataset.s){st.s=''}else{st.s=b.dataset.s;st.v=b.dataset.sv}ap();A2.querySelector('.abarra').scrollIntoView({block:'start'})}));
inp.addEventListener('input',()=>{st.q=inp.value;ap()});A2.querySelector('[data-alimpa]').addEventListener('click',()=>{st.v=st.s=st.q='';inp.value='';ap()});
const u=new URLSearchParams(location.search);if(u.get('v'))st.v=u.get('v');if(u.get('q')){st.q=u.get('q');inp.value=st.q}if(st.v||st.q)ap()}
const fl=document.querySelectorAll('[data-arq] ~ * .filtros button, main.col .filtros button');fl.forEach(b=>b.addEventListener('click',()=>{fl.forEach(x=>x.setAttribute('aria-pressed',x===b));const v=b.dataset.v;
document.querySelectorAll('[data-arq] .item').forEach(it=>it.hidden=!!v&&it.dataset.v!==v);document.querySelectorAll('[data-arq] .mes').forEach(m=>{let n=m.nextElementSibling,vis=false;while(n&&!n.classList.contains('mes')){if(!n.hidden)vis=true;n=n.nextElementSibling}m.hidden=!vis})}));
})()
;

(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const conta = $$('[data-conta]');
  if (conta.length && !calmo && 'IntersectionObserver' in window) {
    const io0 = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io0.unobserve(e.target); const el = e.target, n = +el.dataset.conta, t0 = performance.now();
      const passo = t => { const k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(passo); }; requestAnimationFrame(passo); setTimeout(() => { el.textContent = n; }, 1400); }));
    conta.forEach(el => io0.observe(el));
  }
  const corpo = $('.corpo'); if (!corpo) return;
  const titulo = ($('article h1') || {}).textContent || document.title;
  const base = location.origin + location.pathname;

  
  let av; const aviso = msg => { if (!av) { av = document.createElement('div'); av.className = 'aviso-t'; av.setAttribute('role', 'status'); document.body.appendChild(av); }
    av.textContent = msg; av.classList.add('vis'); clearTimeout(av._t); av._t = setTimeout(() => av.classList.remove('vis'), 2200); };

  
  const alvos = $$('.corpo > h3, .corpo figure.fig, .achado, .corpo > table, .nums');
  const desenha = fig => { if (calmo || fig._des) return; fig._des = 1;
    $$('svg.graf:not(.mapa) polyline', fig).forEach(pl => { try { const L = pl.getTotalLength(); pl.style.strokeDasharray = L; pl.style.strokeDashoffset = L;
      pl.getBoundingClientRect(); pl.classList.add('desenha'); pl.style.strokeDashoffset = 0;
      const fim = () => { pl.style.strokeDasharray = ''; pl.style.strokeDashoffset = ''; };
      pl.addEventListener('transitionend', fim, { once: true }); setTimeout(fim, 2600); } catch (e) {} });
    $$('svg.graf:not(.mapa)', fig).forEach(svg => { const rs = $$('rect[data-dica]', svg); if (!rs.length) return;
      svg.getBoundingClientRect(); rs.forEach(r => r.classList.add('cresce'));
      setTimeout(() => rs.forEach(r => { r.classList.remove('cresce0', 'cresce', 'h'); r.style.transitionDelay = ''; }), 2600); }); };
  const prepBarras = () => { if (calmo || !('IntersectionObserver' in window)) return;
    $$('.corpo figure.fig svg.graf:not(.mapa)').forEach(svg => { const rs = $$('rect', svg).filter(r => r.querySelector('title')); if (rs.length < 2) return;
      const hs = new Set(rs.map(r => r.getAttribute('height'))), ws = new Set(rs.map(r => r.getAttribute('width'))); const horiz = hs.size === 1 && ws.size > 1;
      rs.forEach((r, i) => { r.classList.add('cresce0'); if (horiz) r.classList.add('h'); r.style.transitionDelay = Math.min(i * 16, 500) + 'ms'; }); }); };
  prepBarras();
  if (!calmo && 'IntersectionObserver' in window) {
    $$('.achado').forEach((a, i) => a.style.transitionDelay = (i * 70) + 'ms');
    alvos.forEach(el => el.classList.add('rv'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('vis'); if (e.target.matches('figure')) desenha(e.target); io.unobserve(e.target); }),
      { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    alvos.forEach(el => io.observe(el));
    const ja = () => alvos.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) { el.classList.add('vis'); if (el.matches('figure')) desenha(el); } });
    addEventListener('load', () => setTimeout(ja, 60)); addEventListener('hashchange', ja); setTimeout(ja, 1500);
  }

  
  const dica = document.createElement('div'); dica.className = 'dica-g'; dica.setAttribute('aria-hidden', 'true'); document.body.appendChild(dica);
  addEventListener('scroll', () => dica.classList.remove('vis'), { passive: true });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('.mapa [data-dica]')) dica.classList.remove('vis'); });
  $$('.corpo svg.graf').forEach(svg => {
    $$('title', svg).forEach(t => { const el = t.parentElement; if (!el || el === svg) return; el.dataset.dica = t.textContent; el.setAttribute('aria-label', t.textContent); t.remove(); });
    if (svg.classList.contains('mapa')) {
      const mostra = (el, x, y) => {
        $$('[data-dica].on', svg).forEach(p => p.classList.remove('on'));
        el.classList.add('on'); dica.textContent = el.dataset.dica;
        const metade = dica.offsetWidth / 2;
        dica.style.left = Math.max(8 + metade, Math.min(innerWidth - 8 - metade, x)) + 'px';
        dica.style.top = Math.max(dica.offsetHeight + 20, y) + 'px'; dica.classList.add('vis');
      };
      $$('[data-dica]', svg).forEach(el => {
        el.setAttribute('tabindex', '0');
        el.addEventListener('focus', () => { const r = el.getBoundingClientRect(); mostra(el, r.left + r.width / 2, r.top); });
        el.addEventListener('blur', () => dica.classList.remove('vis'));
      });
      svg.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'touch') return;
        const el = e.target.closest('[data-dica]');
        if (el) { e.stopPropagation(); mostra(el, e.clientX, e.clientY); }
        else dica.classList.remove('vis');
      });
    }
    svg.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; const el = e.target.closest('[data-dica]');
      $$('[data-dica].on', svg).forEach(x => x !== el && x.classList.remove('on'));
      if (!el) { svg.classList.remove('foco'); dica.classList.remove('vis'); return; }
      el.classList.add('on'); svg.classList.add('foco');
      const txt = el.dataset.dica, k = txt.lastIndexOf(':');
      dica.innerHTML = k > 0 ? '<small></small><b></b>' : '<b></b>';
      if (k > 0) { dica.querySelector('small').textContent = txt.slice(0, k); dica.querySelector('b').textContent = txt.slice(k + 1).trim(); } else dica.querySelector('b').textContent = txt;
      dica.style.left = e.clientX + 'px'; dica.style.top = e.clientY + 'px'; dica.classList.add('vis'); });
    svg.addEventListener('pointerleave', () => { svg.classList.remove('foco'); $$('[data-dica].on', svg).forEach(x => x.classList.remove('on')); dica.classList.remove('vis'); });
  });

  
  $$('.fig-n').forEach(n => { if (n.scrollHeight <= n.clientHeight + 2) { n.style.cursor = 'auto'; n.classList.add('aberta'); return; }
    n.addEventListener('click', () => n.classList.add('aberta')); });

  const IC = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.1Z"/></svg>',
    msg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 5 3.7 6.5L5 21.5l3.9-2.1c1 .3 2 .4 3.1.4 5.5 0 10-3.8 10-8.5S17.5 3 12 3Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    mais: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    img: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 15 3-3 3 3 2-2 3 3"/><circle cx="9" cy="9" r="1.3" fill="currentColor"/></svg>',
    amp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
    in: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 8.5h3V21H3zM9 8.5h2.9v1.7c.4-.8 1.5-1.9 3.3-1.9 3.3 0 3.8 2.1 3.8 4.9V21h-3v-6.9c0-1.4-.1-2.9-1.9-2.9s-2.1 1.3-2.1 2.8v7H9z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>'
  };

  
  const cor = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const quebra = (cx, txt, larg) => { const out = []; let l = ''; txt.split(/\s+/).forEach(p => { const t = l ? l + ' ' + p : p; if (cx.measureText(t).width > larg && l) { out.push(l); l = p; } else l = t; }); if (l) out.push(l); return out; };
  const rodape = (cx, W, H, fundo, texto, M = 72) => { cx.fillStyle = fundo; cx.font = '800 24px "Libre Franklin", Helvetica, Arial, sans-serif'; cx.letterSpacing = '6px';
    cx.fillText('HINT-DATA', M, H - 60); cx.letterSpacing = '0px'; cx.fillStyle = texto; cx.font = '500 21px "Libre Franklin", Helvetica, Arial, sans-serif';
    cx.textAlign = 'right'; cx.fillText(location.host, W - M, H - 60); cx.textAlign = 'left'; };
  const paraArquivo = (cv, nome) => new Promise(r => cv.toBlob(b => r(new File([b], nome, { type: 'image/png' })), 'image/png'));
  
  const salva = arq => { const a = document.createElement('a'); a.href = URL.createObjectURL(arq); a.download = arq.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000); aviso('Imagem salva, pronta para os Stories ou para enviar'); };
  const entrega = async arq => {
    if (!arq) { aviso('Não foi possível gerar a imagem'); return; }
    if (navigator.canShare && navigator.canShare({ files: [arq] })) {
      try { await navigator.share({ files: [arq] }); return; }
      catch (e) { if (e.name === 'AbortError') return; }
    }
    salva(arq);
  };
  const Apple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent), Android = /Android/.test(navigator.userAgent);
  const selo = () => { const so = $('article .sobre'); return so ? so.textContent.replace(/\s*[›·]\s*/g, ' · ').replace(/^RASCUNHO/, '').trim().toUpperCase() : 'HINT-DATA RESEARCH'; };
  const F = (w, px) => `${w} ${px}px "Libre Franklin", Helvetica, Arial, sans-serif`;
  const escreve = (cx, linhas, x, y0, passo, cor, corNum) => linhas.forEach((l, i) => { let x1 = x;
    l.split(' ').forEach((p, k) => { cx.fillStyle = /\d/.test(p) && !/^(19|20)\d\d\W*$/.test(p) ? corNum : cor; const t = (k ? ' ' : '') + p; cx.fillText(t, x1, y0 + i * passo); x1 += cx.measureText(t).width; }); });
  async function cartaoCitacao(q) {
    await (document.fonts && document.fonts.ready); const W = 1080, H = 1350, M = 88, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const cx = cv.getContext('2d');
    const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1E1812'); g.addColorStop(1, '#120E0A'); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    cx.font = F(700, 20); cx.letterSpacing = '5px'; cx.fillStyle = '#C9A36B'; cx.fillText(selo().slice(0, 60), M, 132); cx.letterSpacing = '0px';
    if (q.length > 280) q = q.slice(0, 280).replace(/\s+\S*$/, '') + '…';
    q = q.replace(/[,;:\u2013\u2014-]+$/, '…');
    let tam = 62, linhas; do { cx.font = F(700, tam); linhas = quebra(cx, q, W - 2 * M); tam -= 2; } while (linhas.length * tam * 1.24 > 500 && tam > 30);
    tam += 2; const passo = tam * 1.24, y0 = 470 + Math.max(0, (500 - linhas.length * passo) / 2) + tam;
    cx.font = F(800, 240); cx.fillStyle = 'rgba(201,163,107,.9)'; cx.fillText('“', M - 12, y0 - tam + 80);
    cx.font = F(700, tam); escreve(cx, linhas, M, y0, passo, '#F4EEE0', '#E0B872');
    const yt = H - 300; cx.fillStyle = '#C9A36B'; cx.fillRect(M, yt, 48, 4);
    cx.font = F(600, 18); cx.letterSpacing = '4px'; cx.fillStyle = '#8F826A'; cx.fillText('DA NOTA', M, yt + 46); cx.letterSpacing = '0px';
    cx.font = F(700, 32); cx.fillStyle = '#E8DFCC'; quebra(cx, titulo, W - 2 * M).slice(0, 2).forEach((l, i) => cx.fillText(l, M, yt + 96 + i * 42));
    cx.fillStyle = '#3C3326'; cx.fillRect(M, H - 110, W - 2 * M, 1); rodape(cx, W, H, '#C9A36B', '#B6A98C', M);
    return paraArquivo(cv, 'hint-data-trecho.png');
  }
  async function cartaoGrafico(fig) {
    await (document.fonts && document.fonts.ready);
    const svgs = $$('svg.graf', fig); if (!svgs.length) return null;
    const vars = ['--card', '--li', '--mu', '--fg', '--fg2', '--areia', '--bg', '--bronze', '--ouro', '--tinta', '--papel'];
    const troca = s => vars.reduce((a, v) => a.split(`var(${v})`).join(cor(v)), s);
    const estilo = `<style>.g{stroke:${cor('--li')}}.ax{fill:${cor('--mu')};font:11px Helvetica,Arial,sans-serif}.dl{font:600 12px Helvetica,Arial,sans-serif}</style>`;
    const imgs = await Promise.all(svgs.map(s => new Promise(r => { const c = s.cloneNode(true); const vb = s.viewBox.baseVal;
      c.setAttribute('width', vb.width); c.setAttribute('height', vb.height); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      c.querySelectorAll('[style*="stroke-dash"]').forEach(x => { x.style.strokeDasharray = ''; x.style.strokeDashoffset = ''; });
      const str = troca(new XMLSerializer().serializeToString(c)).replace(/<svg([^>]*)>/, `<svg$1>${estilo}`);
      const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str); })));
    const W = 1200, M = 64, larg = W - 2 * M, alturas = imgs.map(im => im ? larg * im.height / im.width : 0);
    const cv = document.createElement('canvas'), cx = cv.getContext('2d'); cx.font = '800 36px "Libre Franklin", Helvetica, Arial, sans-serif';
    const tl = quebra(cx, ($('.fig-t', fig) || {}).textContent || titulo, larg);
    cx.font = '400 20px "Libre Franklin", Helvetica, Arial, sans-serif'; const fl = quebra(cx, ($('.fig-f', fig) || {}).textContent || '', larg);
    const H = M + 40 + tl.length * 44 + 20 + alturas.reduce((a, b) => a + b + 16, 0) + fl.length * 28 + 150; cv.width = W; cv.height = H;
    const fundo = cor('--card') || '#FBF7EE', tinta = cor('--fg') || '#17120D', mu = cor('--mu') || '#6B5E49';
    cx.fillStyle = fundo; cx.fillRect(0, 0, W, H); cx.fillStyle = cor('--bronze') || '#8C6638'; cx.fillRect(M, M - 6, 40, 4);
    cx.font = F(700, 16); cx.letterSpacing = '4px'; cx.fillText(selo().slice(0, 70), M + 56, M); cx.letterSpacing = '0px';
    let y = M + 60; cx.fillStyle = tinta; cx.font = '800 36px "Libre Franklin", Helvetica, Arial, sans-serif'; tl.forEach(l => { cx.fillText(l, M, y); y += 44; }); y += 8;
    imgs.forEach((im, i) => { if (im) cx.drawImage(im, M, y, larg, alturas[i]); y += alturas[i] + 16; });
    cx.fillStyle = mu; cx.font = '400 20px "Libre Franklin", Helvetica, Arial, sans-serif'; fl.forEach(l => { cx.fillText(l, M, y + 10); y += 28; });
    cx.fillStyle = cor('--li') || '#D8CDB6'; cx.fillRect(M, H - 110, larg, 1); rodape(cx, W, H, cor('--bronze') || '#8C6638', mu, M);
    return paraArquivo(cv, 'hint-data-grafico.png');
  }

  
  $$('.corpo figure.fig').forEach(fig => {
    const box = document.createElement('div'); box.className = 'fig-acoes';
    box.innerHTML = `<button type="button" data-a="img" aria-label="Compartilhar como imagem">${IC.img}<span>Compartilhar</span></button>`
      + (fig.id ? `<button type="button" data-a="link" aria-label="Copiar link da figura">${IC.link}<span>Copiar link</span></button>` : '');
    const ref = $('.fig-d', fig); ref ? fig.insertBefore(box, ref) : fig.appendChild(box);
    const amp = $('.amplia', fig); if (amp) { const rot = amp.textContent.replace(/^\W+/, ''), curto = rot.split(' ')[0]; amp.innerHTML = `${IC.amp}<span>${curto}</span>`; amp.setAttribute('aria-label', rot); box.prepend(amp); }
    const btn = $('[data-a="img"]', box); let pronto = null;
    const prepara = () => { if (!pronto) pronto = cartaoGrafico(fig).catch(() => null); return pronto; };
    ['pointerenter', 'pointerdown', 'focus'].forEach(ev => btn.addEventListener(ev, prepara, { passive: true }));
    fig.addEventListener('pointerenter', prepara, { passive: true, once: true });
    box.addEventListener('click', async e => { const b = e.target.closest('button'); if (!b || b.classList.contains('amplia')) return;
      if (b.dataset.a === 'link') { const link = base + '#' + fig.id; if (navigator.clipboard) navigator.clipboard.writeText(link).then(() => { aviso('Link da figura copiado');
        b.classList.add('ok'); setTimeout(() => b.classList.remove('ok'), 1600); }); return; }
      b.disabled = true; const arq = await prepara(); b.disabled = false; entrega(arq); });
  });

  
  const art = $('article'); if (art && $('h1', art)) {
    const u = base, t = titulo + ' · Hint-data Research';
    const cn = document.createElement('div'); cn.className = 'comp-nota';
    cn.innerHTML = '<p>Compartilhe a nota</p><div>'
      + `<a href="https://wa.me/?text=${encodeURIComponent(t + '\n' + u)}" target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp">${IC.wa}</a>`
      + `<a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">${IC.in}</a>`
      + `<a href="https://x.com/intent/post?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(u)}" target="_blank" rel="noopener" aria-label="X" title="X">${IC.x}</a>`
      + `<a href="mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}" aria-label="E-mail" title="E-mail">${IC.mail}</a>`
      + `<button type="button" data-a="link" aria-label="Copiar link" title="Copiar link">${IC.link}</button>`
      + (navigator.share ? `<button type="button" data-a="mais" aria-label="Mais opções" title="Mais opções">${IC.mais}</button>` : '') + '</div>';
    const vt = $('.voltar', art); vt ? art.insertBefore(cn, vt) : art.appendChild(cn);
    cn.addEventListener('click', async e => { const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'link') { if (navigator.clipboard) navigator.clipboard.writeText(u).then(() => aviso('Link da nota copiado')); }
      else { try { await navigator.share({ title: t, url: u }); } catch (err) {} } });
  }

  

  const podeSms = Apple || Android;
  const barra = document.createElement('div'); barra.className = 'parte'; barra.setAttribute('role', 'toolbar'); barra.setAttribute('aria-label', 'Compartilhar trecho');
  barra.innerHTML = `<button type="button" data-a="wa">${IC.wa}<span>WhatsApp</span></button>`
    + (podeSms ? `<button type="button" data-a="msg">${IC.msg}<span>Mensagens</span></button>` : '')
    + `<button type="button" data-a="ig">${IC.ig}<span>Instagram</span></button><button type="button" data-a="link">${IC.link}<span>Copiar link</span></button>`
    + (navigator.share ? `<button type="button" data-a="mais">${IC.mais}<span>Mais</span></button>` : '');
  document.body.appendChild(barra);
  let trecho = '', segura = false, cartao = null, tm, some;
  const frag = q => { const p = q.replace(/\s+/g, ' ').trim().split(' '); const e = s => encodeURIComponent(s).replace(/-/g, '%2D').replace(/,/g, '%2C').replace(/&/g, '%26');
    return p.length <= 8 ? e(p.join(' ')) : e(p.slice(0, 4).join(' ')) + ',' + e(p.slice(-4).join(' ')); };
  const linkTrecho = q => base + '#:~:text=' + frag(q);
  const letra = c => /[\p{L}\p{N}]/u.test(c || '');
  const inteiro = sel => {
    const r = sel.getRangeAt(0).cloneRange(); const sc = r.startContainer, ec = r.endContainer;
    if (sc.nodeType === 3) { let i = r.startOffset; while (i > 0 && letra(sc.data[i - 1]) && letra(sc.data[i])) i--; r.setStart(sc, i); }
    if (ec.nodeType === 3) { let j = r.endOffset; while (j < ec.data.length && letra(ec.data[j]) && letra(ec.data[j - 1])) j++; r.setEnd(ec, j); }
    return r.toString(); };
  const esconde = () => { barra.classList.remove('vis'); trecho = ''; cartao = null; };
  const mostra = () => { if (segura) return;
    const s = getSelection(); const q = s && !s.isCollapsed ? inteiro(s).replace(/\s+/g, ' ').trim() : '';
    if (q.length < 12 || q.length > 700 || !s.rangeCount || !corpo.contains(s.getRangeAt(0).commonAncestorContainer)) { clearTimeout(some); some = setTimeout(() => { if (!segura) esconde(); }, 250); return; }
    clearTimeout(some); if (q !== trecho) { trecho = q; cartao = null; }
    const r = s.getRangeAt(0).getBoundingClientRect();
    barra.style.left = Math.min(Math.max(r.left + r.width / 2, 170), innerWidth - 170) + 'px'; barra.style.top = (r.top + scrollY) + 'px'; barra.classList.add('vis'); };
  document.addEventListener('selectionchange', () => { clearTimeout(tm); tm = setTimeout(mostra, 180); });
  barra.addEventListener('pointerdown', e => { e.preventDefault(); segura = true;
    if (!cartao && trecho && e.target.closest('[data-a="ig"]')) cartao = cartaoCitacao(trecho).catch(() => null); });
  barra.addEventListener('click', async e => { const b = e.target.closest('button'); const q = trecho;
    if (!b || !q) { segura = false; return; } const l = linkTrecho(q), a = b.dataset.a;
    const txt = `“${q}”\n\n${titulo} · Hint-data Research\n${l}`;
    if (a === 'wa') window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank', 'noopener');
    else if (a === 'msg') location.href = (Apple ? 'sms:&body=' : 'sms:?body=') + encodeURIComponent(txt);
    else if (a === 'link') { if (navigator.clipboard) await navigator.clipboard.writeText(l).then(() => aviso('Link copiado: abre a nota com o trecho grifado'), () => aviso('Não foi possível copiar')); }
    else if (a === 'ig') { if (!cartao) cartao = cartaoCitacao(q).catch(() => null); b.disabled = true; const arq = await cartao; b.disabled = false; await entrega(arq); }
    else if (a === 'mais') { try { await navigator.share({ text: `“${q}”\n\n${titulo} · Hint-data Research`, url: l }); } catch (err) {} }
    segura = false; esconde(); getSelection().removeAllRanges(); });
  addEventListener('scroll', () => { if (barra.classList.contains('vis') && !segura && getSelection().isCollapsed) esconde(); }, { passive: true });
  addEventListener('keydown', e => { if (e.key === 'Escape') { segura = false; esconde(); } });
})();
;

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const feed = $('.home-feed');
  if (feed) {
    const rows = $$('[data-feed-item]', feed), buttons = $$('[data-feed-filter]', feed);
    const more = $('.feed-more', feed), status = $('[data-feed-status]', feed);
    let sector = '', limit = 6;
    const render = () => {
      const eligible = rows.filter(r => !sector || r.dataset.feedItem === sector);
      rows.forEach(r => r.hidden = !eligible.slice(0, limit).includes(r));
      more.hidden = eligible.length <= limit;
      $('.feed-empty', feed).hidden = eligible.length > 0;
      status.textContent = `${Math.min(limit, eligible.length)} de ${eligible.length} análises`;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.feedFilter === sector)));
    };
    buttons.forEach(b => b.addEventListener('click', () => { sector = b.dataset.feedFilter; limit = 6; render(); }));
    more.addEventListener('click', () => {
      const eligible = rows.filter(r => !sector || r.dataset.feedItem === sector), firstNew = eligible[limit];
      limit += 6; render(); firstNew?.focus({preventScroll:true});
    });
    $('.feed-filters', feed).hidden = false; render();
  }

  function chartControls(fig, host, readout) {
    const svg = $('svg.graf', fig); if (!svg) return;
    const points = $$('circle,rect,path', svg).filter(p => p.dataset.dica || $('title', p));
    points.forEach(p => { if (!p.dataset.dica) p.dataset.dica = $('title', p).textContent; });
    if (!points.length) { readout.textContent = fig.closest('.explorer') ? 'Use o zoom para examinar a figura e Ver os dados para consultar os valores.' : 'Abra Explorar para ampliar ou Ver os dados para consultar os valores.'; return; }
    svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', 'Gráfico interativo. Use as setas para consultar os pontos.');
    const circles = points.filter(p => p.tagName.toLowerCase() === 'circle');
    const xs = [...new Set(circles.map(p => Number(p.getAttribute('cx'))))].sort((a,b)=>a-b);
    const months = $$('tbody tr', fig).map(r => r.cells[0]?.textContent || '');
    const label = p => {
      let text = p.dataset.dica;
      if (xs.length === months.length && p.hasAttribute('cx')) text = text.replace(' · :', ` · ${months[xs.indexOf(Number(p.getAttribute('cx')))]}:`);
      return text;
    };
    let active = null;
    const show = p => {
      if (!p || p.classList.contains('chart-muted')) return;
      active?.classList.remove('chart-point-active'); if (active) active.tabIndex = -1;
      active = p; p.classList.add('chart-point-active'); p.tabIndex = 0;
      readout.textContent = label(p);
    };
    points.forEach((p, i) => {
      p.tabIndex = i === 0 ? 0 : -1; p.setAttribute('aria-label', label(p));
      p.addEventListener('focus', () => show(p));
      p.addEventListener('pointerdown', e => { e.stopPropagation(); show(p); });
      p.addEventListener('keydown', e => {
        if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key)) return;
        e.preventDefault(); const shown = points.filter(x => !x.classList.contains('chart-muted'));
        let index = shown.indexOf(p); index = e.key === 'Home' ? 0 : e.key === 'End' ? shown.length - 1 : (index + (['ArrowRight','ArrowDown'].includes(e.key) ? 1 : -1) + shown.length) % shown.length;
        shown[index]?.focus();
      });
    });
    svg.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      let closest = null, distance = 38;
      points.filter(p => !p.classList.contains('chart-muted')).forEach(p => {
        const r = p.getBoundingClientRect(); const d = Math.hypot(e.clientX - (r.left+r.width/2), e.clientY - (r.top+r.height/2));
        if (d < distance) { closest = p; distance = d; }
      });
      if (closest) show(closest);
    });
    readout.textContent = 'Passe o cursor ou toque nos pontos para consultar.';
    const series = new Map();
    if ($$('polyline', svg).length) circles.forEach(p => {
      const color = p.getAttribute('fill'), name = p.dataset.dica.split(' · ')[0];
      if (color && !series.has(color)) series.set(color, name);
    });
    if (series.size > 1 && series.size <= 6) {
      $$('text',svg).filter(t=>[...series.values()].includes(t.textContent.trim())&&Number(t.getAttribute('y'))<=24).forEach(t=>{const swatch=t.previousElementSibling;if(swatch?.tagName.toLowerCase()==='rect'&&Number(swatch.getAttribute('width'))<=12)swatch.style.display='none';t.style.display='none';});
      const help = document.createElement('div'); help.className = 'chart-selection';
      const caption = document.createElement('p'); caption.textContent = 'Séries neste gráfico';
      const hint = document.createElement('p'); hint.className = 'chart-selection-help'; hint.textContent = 'Toque para mostrar ou ocultar. A mudança vale só para esta figura.';
      const status = document.createElement('p'); status.className = 'chart-selection-status'; status.setAttribute('role','status');
      const reset = document.createElement('button'); reset.type = 'button'; reset.className = 'chart-reset'; reset.textContent = 'Mostrar todas';
      help.append(caption, hint); host.before(help); host.after(status);
      const controls = [];
      const update = () => {const shown = controls.filter(b=>b.getAttribute('aria-pressed')==='true'); status.textContent = 'Exibindo: ' + shown.map(b=>b.textContent).join(' · '); reset.disabled=shown.length===controls.length;};
      reset.addEventListener('click',()=>{controls.filter(b=>b.getAttribute('aria-pressed')!=='true').forEach(b=>b.click()); update();});
      series.forEach((name, color) => {
        const displayName = name === 'RJ (empresas)' ? 'Recuperação judicial' : name === 'Falência (empresas)' ? 'Pedidos de falência' : name;
        const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-pressed','true'); button.setAttribute('aria-label', `Série ${displayName}`);
        const dot = document.createElement('i'); dot.style.background = getComputedStyle(circles.find(p=>p.getAttribute('fill')===color)).fill || color; dot.setAttribute('aria-hidden','true');
        button.append(dot,document.createTextNode(displayName)); host.append(button); controls.push(button);
        button.addEventListener('click', () => {
          const visible = button.getAttribute('aria-pressed') !== 'true';
          if (!visible && controls.filter(b=>b.getAttribute('aria-pressed')==='true').length === 1) { readout.textContent = 'Mantenha pelo menos uma série visível.'; return; }
          button.setAttribute('aria-pressed',String(visible));
          update();
          $$('polyline,circle,text', svg).filter(p => p.getAttribute('fill') === color || p.getAttribute('stroke') === color).forEach(p => p.classList.toggle('chart-muted',!visible));
          if (active?.classList.contains('chart-muted')) { active.classList.remove('chart-point-active'); active.tabIndex = -1; active = null; }
          if (!points.some(p => p.tabIndex === 0 && !p.classList.contains('chart-muted'))) { const next = points.find(p=>!p.classList.contains('chart-muted')); if(next)next.tabIndex=0; }
          readout.textContent = `${name}: ${visible ? 'visível' : 'oculta'}. A escala permanece igual.`;
        });
      });
      host.append(reset); update();
    }
  }
  let dialog = null;
  function openExplorer(source, trigger) {
    if (dialog) return;
    const priorOverflow = document.documentElement.style.overflow;
    const hiddenSeries = $$('.chart-tools button[aria-pressed="false"]', source).map(b=>b.getAttribute('aria-label'));
    dialog = document.createElement('dialog'); dialog.className='explorer'; dialog.setAttribute('aria-labelledby','explorer-title');
    dialog.innerHTML = '<header class="explorer-head"><h2 id="explorer-title"></h2><button type="button" aria-label="Fechar exploração">×</button></header><div class="explorer-body"><div class="explorer-zoom" role="group" aria-label="Zoom da figura"><button type="button" aria-label="Diminuir zoom">−</button><output aria-live="polite">100%</output><button type="button" aria-label="Aumentar zoom">+</button><button type="button">Ajustar</button></div><div class="chart-tools" role="group" aria-label="Séries do gráfico"></div><p class="chart-readout" role="status" aria-live="polite"></p><div class="explorer-content"></div></div>';
    $('#explorer-title',dialog).textContent = $('.fig-t',source)?.textContent || 'Explorar figura';
    const clone = source.cloneNode(true);
    $$('.note-chart-scroll,.note-table-scroll',clone).forEach(w=>w.replaceWith(...w.childNodes));
    $$('.note-chart-guide,.note-table-reader,.note-table-toggle',clone).forEach(e=>e.remove());
    $$('[id]',clone).forEach(el=>el.removeAttribute('id'));
    $$('.chart-tools,.chart-readout,.chart-selection,.chart-selection-status,.fig-acoes,.amplia,.explore-button',clone).forEach(el=>el.remove());
    $$('.rv,.chart-muted,.chart-point-active,.on',clone).forEach(el=>el.classList.remove('rv','chart-muted','chart-point-active','on'));
    $$('svg *',clone).forEach(el=>{el.style.strokeDasharray='';el.style.strokeDashoffset='';el.style.transitionDelay='';el.classList.remove('cresce0','cresce','desenha');});
    $('.explorer-content',dialog).append(clone);
    const canvas = document.createElement('div'); canvas.className='explorer-canvas';canvas.tabIndex=0;canvas.setAttribute('role','region');canvas.setAttribute('aria-label','Figura ampliada, com rolagem horizontal');
    const drawings = $$('svg.graf',clone);
    if (drawings.length) { drawings[0].before(canvas); drawings.forEach(s=>canvas.append(s)); }
    let zoom=1;
    const zoomButtons = $$('.explorer-zoom button',dialog), output=$('.explorer-zoom output',dialog);
    const setZoom=z=>{ zoom=Math.max(1,Math.min(3,z)); drawings.forEach(s=>s.style.width=`${zoom*100}%`); output.textContent=`${Math.round(zoom*100)}%`; zoomButtons[0].disabled=zoom===1;zoomButtons[1].disabled=zoom===3; };
    zoomButtons[0].onclick=()=>setZoom(zoom-.25);zoomButtons[1].onclick=()=>setZoom(zoom+.25);zoomButtons[2].onclick=()=>{setZoom(1);canvas.scrollTo(0,0);};setZoom(1);

    const current=dialog;
    const historyKey='explorer-'+Date.now();
    let returning=false;
    history.pushState({...history.state,hintExplorer:historyKey},'',location.href);
    const onBack=()=>{if(history.state?.hintExplorer!==historyKey){returning=true;current.close()}};
    addEventListener('popstate',onBack);
    $('.explorer-head button',current).onclick=()=>current.close();
    current.addEventListener('click',e=>{if(e.target===current){const r=current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)current.close();}});
    current.addEventListener('close',()=>{removeEventListener('popstate',onBack);if(!returning&&history.state?.hintExplorer===historyKey)history.back();current.remove();dialog=null;document.documentElement.style.overflow=priorOverflow;trigger?.focus({preventScroll:true});},{once:true});
    document.body.append(current);chartControls(clone,$('.chart-tools',current),$('.chart-readout',current));
    $$('.chart-tools button[aria-pressed]',current).filter(b=>hiddenSeries.includes(b.getAttribute('aria-label'))).forEach(b=>b.click());
    document.documentElement.style.overflow='hidden';current.showModal();
    if(innerWidth<=720&&drawings.length){const nativeWidth=Math.max(...drawings.map(s=>s.viewBox.baseVal.width||640));setZoom(Math.ceil(nativeWidth/Math.max(canvas.clientWidth,1)*4)/4);const hint=document.createElement('p');hint.className='explorer-pan-hint';hint.textContent='Deslize a figura para os lados. Use Ajustar para ver o conjunto.';canvas.before(hint);}
    $('.explorer-head button',current).focus();
    if (!reduced) current.animate([{opacity:0,transform:'translateY(12px) scale(.985)'},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  $$('[data-interactive-figure] figure.fig,.corpo figure.fig').forEach(fig=>{
    if (!$('svg.graf',fig)) return;
    const home=!!fig.closest('[data-interactive-figure],.panel-page');
    let tools;
    if (home) {
      tools=document.createElement('div');tools.className='chart-tools';tools.setAttribute('role','group');tools.setAttribute('aria-label','Séries do gráfico');
      $('.fig-t',fig)?.after(tools);
      const readout=document.createElement('p');readout.className='chart-readout';readout.setAttribute('role','status');$('svg.graf',fig).after(readout);
      chartControls(fig,tools,readout);
    } else {
      $$('.amplia',fig).forEach(b=>b.remove());
      tools=$('.fig-acoes',fig);
      if(!tools){tools=document.createElement('div');tools.className='chart-tools';fig.append(tools);}
    }
    const button=document.createElement('button');button.type='button';button.className='explore-button';button.innerHTML='Explorar <svg class="ui-arrow" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 15 15 5M5 5h10v10"/></svg>' ;button.setAttribute('aria-label','Explorar figura');
    button.onclick=()=>openExplorer(fig,button);if(home)tools.append(button);else tools.prepend(button);
    if(!home)fig.addEventListener('click',e=>{if(e.target.closest('svg.graf')&&innerWidth<=720){e.stopPropagation();openExplorer(fig,button);}},{capture:true});
  });
})();

(()=>{
  const root=document.querySelector('.relation-demo');if(!root)return;
  const content={
    alvo:['01 / Ponto de partida','Quem está do outro lado?','A empresa é o início da diligência. Sócios, administradores e participações ajudam a delimitar o contexto a verificar.','A conferir: cadastro e atos societários.'],
    holding:['02 / Estrutura societária','Uma camada além do nome.','Neste exemplo, a holding participa da empresa analisada. A diligência segue a cadeia de participação para entender quem está por trás da estrutura.','A conferir: registros e documentos societários.'],
    pessoa:['03 / Beneficiário final','Até chegar à pessoa.','A Pessoa A controla a holding neste cenário fictício. Identificar o beneficiário final exige conferir cada elo da cadeia e registrar as lacunas.','A conferir: documentos de controle e participações.'],
    gestor:['04 / Relações em comum','Um vínculo abre outra pergunta.','A Pessoa B administra as duas empresas do exemplo. A relação amplia o contexto da pesquisa; por si só, não indica irregularidade.','A conferir: atos de nomeação, funções e datas.'],
    outra:['05 / Contexto ampliado','Conexão não é conclusão.','O administrador em comum conecta esta empresa à analisada. A diligência verifica a natureza e o período do vínculo antes de atribuir significado.','A conferir: registros de administração de ambas.']
  };
  const buttons=[...root.querySelectorAll('[data-relation]')],lines=[...root.querySelectorAll('line')];
  const controls=root.querySelector('.relation-controls'), picker=controls.querySelector('select'), previous=controls.querySelector('[data-relation-prev]'), next=controls.querySelector('[data-relation-next]');
  controls.hidden=false;
  picker.addEventListener('change',()=>select(picker.value));
  previous.onclick=()=>select(buttons[buttons.findIndex(b=>b.dataset.relation===picker.value)-1].dataset.relation);
  next.onclick=()=>select(buttons[buttons.findIndex(b=>b.dataset.relation===picker.value)+1].dataset.relation);
  function select(id){
    picker.value=id;const index=buttons.findIndex(b=>b.dataset.relation===id);previous.disabled=index===0;next.disabled=index===buttons.length-1;
    const connected=new Set([id]);
    lines.forEach(line=>{const on=line.dataset.from===id||line.dataset.to===id;line.classList.toggle('is-active',on);if(on){connected.add(line.dataset.from);connected.add(line.dataset.to)}});
    buttons.forEach(b=>{b.classList.toggle('is-selected',b.dataset.relation===id);b.classList.toggle('is-related',connected.has(b.dataset.relation));b.setAttribute('aria-pressed',String(b.dataset.relation===id))});
    ['.relation-kicker','.relation-detail h2','.relation-description','.relation-source'].forEach((s,i)=>root.querySelector(s).textContent=content[id][i]);
  }
  buttons.forEach((b,i)=>{b.addEventListener('click',()=>select(b.dataset.relation));b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key))return;e.preventDefault();const next=buttons[(i+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1)+buttons.length)%buttons.length];next.focus();select(next.dataset.relation)})});
  select('alvo');
})();
;

(()=>{
 const article=document.querySelector('article.research-note');if(!article)return;
 const make=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls||'';if(text)e.textContent=text;return e};
 article.querySelectorAll('.corpo table').forEach((table,index)=>{
  if(table.closest('.tab-f')||table.classList.contains('tab-f'))return;
  const rows=[...table.rows], head=rows[0];if(!head)return;
  const wrapper=make('div','note-table-scroll');wrapper.tabIndex=0;wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label','Tabela completa, com rolagem horizontal');table.before(wrapper);wrapper.append(table);
  const labels=[...head.cells].map(c=>c.textContent.trim());
  if(labels.length<3||!head.querySelector('th')||rows.some(r=>r.cells.length!==labels.length||[...r.cells].some(c=>c.colSpan!==1||c.rowSpan!==1)))return;
  const data=rows.slice(1);if(!data.length)return;
  const reader=make('div','note-table-reader'), label=make('label','','Escolha uma linha para ler'), select=make('select'), values=make('dl'), controls=make('div','note-row-controls'),prev=make('button','','Anterior'),next=make('button','','Próxima'),status=make('p','note-row-status');
  select.id='note-row-'+index;label.htmlFor=select.id;data.forEach((row,i)=>{const option=make('option','',row.cells[0].textContent.trim());option.value=i;select.append(option)});
  [prev,next].forEach(b=>b.type='button');status.setAttribute('role','status');controls.append(prev,next);label.append(select);reader.append(label,controls,status,values);
  function draw(){const i=Number(select.value);values.replaceChildren();labels.slice(1).forEach((name,j)=>{const line=make('div'),context=name==='%'&&j>0?labels[j]+' (%)':name;line.append(make('dt','',context));const dd=make('dd');[...data[i].cells[j+1].childNodes].forEach(n=>dd.append(n.cloneNode(true)));dd.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));line.append(dd);values.append(line)});prev.disabled=i===0;next.disabled=i===data.length-1;status.textContent=`Linha ${i+1} de ${data.length}`;}
  select.onchange=draw;prev.onclick=()=>{select.value=Number(select.value)-1;draw()};next.onclick=()=>{select.value=Number(select.value)+1;draw()};draw();
  const toggle=make('button','note-table-toggle','Ver tabela completa');toggle.type='button';toggle.setAttribute('aria-expanded','false');wrapper.id='note-table-'+index;toggle.setAttribute('aria-controls',wrapper.id);wrapper.classList.add('has-note-reader');
  toggle.onclick=()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));wrapper.classList.toggle('is-open',!expanded);toggle.textContent=expanded?'Ver tabela completa':'Fechar tabela completa';};wrapper.before(reader,toggle);
 });
 article.querySelectorAll('.corpo svg.graf').forEach((svg,index)=>{
  const width=svg.viewBox.baseVal.width;if(!width)return;
  const frame=make('div','note-chart-scroll');frame.tabIndex=0;frame.setAttribute('role','region');frame.setAttribute('aria-label','Gráfico com rolagem horizontal');svg.before(frame);frame.append(svg);
  const sizes=[...svg.querySelectorAll('text')].map(t=>parseFloat(getComputedStyle(t).fontSize)).filter(n=>n>0);
  const scale=sizes.length?Math.max(1,12/Math.min(...sizes)):1;
  frame.style.setProperty('--note-chart-width',Math.ceil(width*Math.min(scale,1.6))+'px');
  const tools=make('div','note-chart-guide'),hint=make('span','','Deslize o gráfico para ler os detalhes.'),fit=make('button','','Ver conjunto');fit.type='button';fit.setAttribute('aria-pressed','false');fit.onclick=()=>{const on=frame.classList.toggle('is-fit');fit.setAttribute('aria-pressed',String(on));fit.textContent=on?'Ler rótulos':'Ver conjunto';hint.textContent=on?'Visão geral. Toque em Ler rótulos para ampliar.':'Deslize o gráfico para ler os detalhes.'};tools.append(hint,fit);frame.before(tools);
 });
})();
;

(()=>{
 const ns='http://www.w3.org/2000/svg', colors=['var(--bronze)','var(--mobile-line2)','var(--mobile-line3)','var(--mobile-line4)'];
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
 const svgEl=(tag,attrs,text)=>{const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;return e};
 const num=s=>{s=s.trim().replace('−','-');if(!s||/^[—–-]$/.test(s))return null;const n=Number(s.replace(/\./g,'').replace(',','.').replace(/[%\s]/g,''));return Number.isFinite(n)?n:null};
 document.querySelectorAll('.panel-page figure[data-mobile-chart]').forEach(fig=>{
  const c=JSON.parse(fig.dataset.mobileChart), table=fig.querySelector('table');if(!table)return;
  const rows=[...table.querySelectorAll('tbody tr')].map(r=>[...r.cells].map(x=>x.textContent.trim()));if(!rows.length)return;
  const block=el('div','mobile-chart');block.setAttribute('aria-label','Gráfico adaptado para celular');
  const intro=el('p','mobile-chart-unit',c.unit);block.append(intro);
  if(c.kind==='bars'){
   const uf={AC:'Acre',AL:'Alagoas',AP:'Amapá',AM:'Amazonas',BA:'Bahia',CE:'Ceará',DF:'Distrito Federal',ES:'Espírito Santo',GO:'Goiás',MA:'Maranhão',MT:'Mato Grosso',MS:'Mato Grosso do Sul',MG:'Minas Gerais',PA:'Pará',PB:'Paraíba',PR:'Paraná',PE:'Pernambuco',PI:'Piauí',RJ:'Rio de Janeiro',RN:'Rio Grande do Norte',RS:'Rio Grande do Sul',RO:'Rondônia',RR:'Roraima',SC:'Santa Catarina',SP:'São Paulo',SE:'Sergipe',TO:'Tocantins'};
   const list=el('div','mobile-bars'),all=el('button','mobile-more','Ver todas as categorias');all.type='button';let expanded=false;
   const max=Math.max(...rows.map(r=>num(r[c.cols[0]])??0),1);
   function draw(){list.replaceChildren();rows.slice(0,expanded?rows.length:8).forEach(r=>{const item=el('div','mobile-bar'),label=el('span','',uf[r[0]]?`${uf[r[0]]} (${r[0]})`:r[0]),value=el('strong','',r[c.cols[0]]),track=el('div','mobile-bar-track'),fill=el('i');fill.style.width=`${100*(num(r[c.cols[0]])??0)/max}%`;track.append(fill);item.append(label,value,track);list.append(item)});all.textContent=expanded?'Mostrar primeiras categorias':`Ver todas as categorias (${rows.length})`;all.setAttribute('aria-expanded',String(expanded));}
   all.addEventListener('click',()=>{expanded=!expanded;draw()});draw();block.append(list);if(rows.length>8)block.append(all);
  }else{
   const selected=new Set(c.cols.map((_,i)=>i)), tools=el('div','mobile-series');tools.setAttribute('role','group');tools.setAttribute('aria-label','Séries do gráfico no celular');
   const chart=svgEl('svg',{viewBox:'0 0 340 220',role:'img','aria-label':fig.querySelector('.fig-t').textContent}),values=el('dl','mobile-values'),message=el('p','mobile-chart-status');message.setAttribute('role','status');
   const label=el('label','mobile-period','Consultar período'),select=el('select');select.setAttribute('aria-label','Período deste gráfico');rows.forEach((r,i)=>{const o=el('option','',r[0]);o.value=i;select.append(o)});select.value=rows.length-1;label.append(select);
   const pager=el('div','mobile-pager'),prev=el('button','','Anterior'),next=el('button','','Próximo');prev.type=next.type='button';pager.append(prev,label,next);
   const data=c.cols.map(col=>rows.map(r=>num(r[col]||''))),flat=data.flat().filter(n=>n!==null),lo=Math.min(0,...flat),hi=Math.max(1,...flat),range=hi-lo||1;
   let plotWidth=340;
   const x=i=>42+i*(plotWidth-56)/Math.max(1,rows.length-1),y=n=>174-(n-lo)/range*150;
   function draw(){const index=Number(select.value);chart.replaceChildren();values.replaceChildren();
    [0,.5,1].forEach(t=>{const n=lo+range*t,yy=y(n);chart.append(svgEl('line',{x1:42,x2:plotWidth-14,y1:yy,y2:yy,stroke:'var(--li)'}),svgEl('text',{x:36,y:yy+4,'text-anchor':'end',fill:'var(--mu)','font-size':12},new Intl.NumberFormat('pt-BR',{notation:Math.abs(n)>=10000?'compact':'standard',maximumFractionDigits:1}).format(n)))});
    [...new Set(rows[0][0].length>8&&plotWidth<320?[0,rows.length-1]:[0,Math.floor((rows.length-1)/2),rows.length-1])].forEach(i=>chart.append(svgEl('text',{x:x(i),y:202,'text-anchor':i===0?'start':i===rows.length-1?'end':'middle',fill:'var(--mu)','font-size':12},rows[i][0])));
    chart.append(svgEl('line',{x1:x(index),x2:x(index),y1:20,y2:178,stroke:'var(--mu)','stroke-dasharray':'3 4'}));
    selected.forEach(i=>{let segment=[];const flush=()=>{if(segment.length)chart.append(svgEl('polyline',{points:segment.join(' '),fill:'none',stroke:colors[i%colors.length],'stroke-width':2}));segment=[]};data[i].forEach((n,j)=>{if(n===null){flush();return}segment.push(`${x(j)},${y(n)}`)});flush();if(data[i][index]!==null)chart.append(svgEl('circle',{cx:x(index),cy:y(data[i][index]),r:4,fill:colors[i%colors.length]}));const row=el('div'),dt=el('dt','',c.names[i]),dd=el('dd','',data[i][index]===null?'Sem dado':rows[index][c.cols[i]]);row.append(dt,dd);values.append(row)});
    prev.disabled=index===0;next.disabled=index===rows.length-1;const reset=tools.querySelector('.mobile-reset');if(reset)reset.disabled=selected.size===c.cols.length;message.textContent=`${rows[index][0]} · ${selected.size} de ${c.cols.length} séries. Escala fixa.`;
   }
   c.names.forEach((name,i)=>{const b=el('button','',name);b.type='button';b.setAttribute('aria-pressed','true');b.style.setProperty('--series-color',colors[i%colors.length]);b.addEventListener('click',()=>{if(selected.has(i)&&selected.size===1){message.textContent='Mantenha pelo menos uma série visível.';return}selected.has(i)?selected.delete(i):selected.add(i);b.setAttribute('aria-pressed',String(selected.has(i)));draw()});tools.append(b)});
   if(c.cols.length>1){const reset=el('button','mobile-reset','Mostrar todas');reset.type='button';reset.addEventListener('click',()=>{c.cols.forEach((_,i)=>selected.add(i));tools.querySelectorAll('[aria-pressed]').forEach(b=>b.setAttribute('aria-pressed','true'));draw()});tools.append(reset)}
   select.addEventListener('change',draw);prev.addEventListener('click',()=>{select.value=Number(select.value)-1;draw()});next.addEventListener('click',()=>{select.value=Number(select.value)+1;draw()});
   block.append(tools,chart,pager,values,message);draw();
   new ResizeObserver(entries=>{const width=Math.round(entries[0].contentRect.width);if(width>0&&width!==plotWidth){plotWidth=width;chart.setAttribute('viewBox',`0 0 ${plotWidth} 220`);draw()}}).observe(block);
  }
  fig.querySelector('svg.graf').before(block);fig.classList.add('has-mobile-chart');
 });
})();
;
/* Abas com endereço compartilhável, histórico e estado recuperável. */
(()=>{
 const roots=[...document.querySelectorAll('[data-choice-root]')];
 roots.forEach(root=>{
  const nav=root.querySelector('.choice-tabs'),tabs=[...nav.children],panels=[...root.querySelector('.choice-panels').children];let mobile=null;
  nav.setAttribute('role','tablist');
  function select(tab){if(!tab)return;if(mobile)mobile.value=tab.dataset.choice;tabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1});panels.forEach(p=>p.hidden=p.dataset.choicePanel!==tab.dataset.choice)}
  function activate(tab){
   if(tab.getAttribute('aria-selected')==='true')return;
   const prior=tabs.find(t=>t.getAttribute('aria-selected')==='true');
   history.replaceState({...history.state,hintChoices:{...history.state?.hintChoices,[root.id]:prior.dataset.choice},hintScroll:scrollY},'',location.href);
   select(tab);
   history.pushState({...history.state,hintChoices:{...history.state?.hintChoices,[root.id]:tab.dataset.choice},hintScroll:scrollY},'',tab.hash);
   // Mantém o seletor à vista, sem saltar direto para dentro do conteúdo.
   const top=root.getBoundingClientRect().top;if(top<100||top>innerHeight-100)root.scrollIntoView({block:'start',behavior:'instant'});
   history.replaceState({...history.state,hintScroll:scrollY},'',location.href);
  }
  if(tabs.length>2){const label=document.createElement('label');label.className='choice-mobile';label.append(document.createTextNode(nav.getAttribute('aria-label')));mobile=document.createElement('select');tabs.forEach(t=>{const o=document.createElement('option');o.value=t.dataset.choice;o.textContent=t.textContent;mobile.append(o)});label.append(mobile);nav.before(label);root.classList.add('has-mobile-choice');mobile.addEventListener('change',()=>activate(tabs.find(t=>t.dataset.choice===mobile.value)))}
  tabs.forEach((tab,i)=>{tab.setAttribute('role','tab');tab.setAttribute('aria-controls',tab.hash.slice(1));tab.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();activate(tab)});tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();activate(tabs[n]);tabs[n].focus({preventScroll:true})})});
  panels.forEach(p=>{p.setAttribute('role','tabpanel');p.tabIndex=0});
  function restore(scroll=false){let hash=location.hash.slice(1);try{hash=decodeURIComponent(hash)}catch{}const dest=document.getElementById(hash);const tab=tabs.find(t=>t.hash===location.hash||(dest&&document.getElementById(t.hash.slice(1)).contains(dest)));select(tab||tabs.find(t=>t.dataset.choice===history.state?.hintChoices?.[root.id])||tabs[0]);if(scroll&&dest)requestAnimationFrame(()=>dest.scrollIntoView({block:'start',behavior:'instant'}))}
  restore(true);addEventListener('hashchange',()=>restore(!history.state?.hintChoices));addEventListener('popstate',()=>{restore();if(Number.isFinite(history.state?.hintScroll))requestAnimationFrame(()=>window.scrollTo({top:history.state.hintScroll,behavior:'instant'}))});
 });
})();
