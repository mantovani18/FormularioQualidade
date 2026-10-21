/* Configure these two values using your Supabase project settings. Never put a service_role key here. */
const SUPABASE_URL = "https://amdbhnantajrkijhyrkq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_i_KKQzPS-sf64foJK8FcZw_fvVe1I_g";
const isConfigured = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("COLE_A_") && !SUPABASE_ANON_KEY.includes("COLE_A_");
const db = isConfigured && window.supabase ? window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY) : null;
const likert = ["Concordo completamente","Concordo","Não tenho opinião sobre/Indiferente","Discordo","Discordo completamente"];
const questions = [["q6", "Podemos ver com bastante frequência que os objetivos financeiros ou de produtividade são colocados acima dos objetivos de Segurança de Alimentos?"], ["q7", "Vemos claramente que a política da qualidade e segurança de alimentos é cumprida por todos os colaboradores, independente do cargo?"], ["q8", "Sabemos claramente quais os objetivos da empresa com relação à segurança de alimentos?"], ["q9", "Na nossa rotina diária é priorizada a segurança de alimentos para tomadas de decisões?"], ["q10", "Nossos líderes nos comunicam sobre temas importantes sobre segurança de alimentos?"], ["q11", "Os treinamentos de Qualidade e Segurança de Alimentos realizados pela empresa são claros, aplicáveis ao nosso trabalho e sinto que posso executar bem o meu trabalho após treinamentos que recebi?"], ["q12", "Nós recebemos treinamentos de qualidade e segurança de alimentos regularmente, presenciais e/ou remotos?"], ["q13", "Na minha empresa todos os colaboradores seguem as regras de BPF e entendem que são importantes para que o produto não seja contaminado?"], ["q14", "Quando há uma investigação sobre um perigo, risco ou não conformidade de segurança de alimentos, colaboradores das áreas envolvidas são incentivados a participar dessa investigação."], ["q15", "Na nossa empresa o desempenho é medido considerando-se também a Qualidade e segurança de alimentos?"], ["q16", "Compreendemos claramente os documentos e procedimentos estabelecidos para nossas atividades?"], ["q17", "Sempre que vemos algum problema que comprometa a Segurança de Alimentos sabemos com quem falar?"], ["q18", "Na nossa empresa os colaboradores conseguem se apoiar em procedimentos e instruções sempre que necessário?"], ["q19", "Na nossa empresa os funcionários conhecem as responsabilidades das suas funções com relação à segurança de alimentos e higiene?"], ["q20", "Nós conhecemos os resultados das auditorias e os indicadores e sabemos os principais problemas a serem tratados?"], ["q21", "Na empresa as mudanças ocorrem de forma fácil e flexível, sempre considerando Segurança de Alimentos?"], ["q22", "Fomos envolvidos na última alteração de processo que ocorreu na nossa área?"], ["q23", "Quando há problemas no meu setor, as mudanças solicitadas são realizadas rapidamente e eliminam o problema?"], ["q24", "A liderança da nossa empresa (gerente, supervisor, encarregado, líder) sempre nos informa de mudanças nas regras ou atividades que eu faço?"], ["q25", "Os líderes são exemplos a serem seguidos em relação à Segurança de Alimentos?"], ["q26", "As pessoas podem participar com ideias e ajudar nas rotinas de qualidade e segurança de alimentos?"], ["q27", "Sempre que vemos algum produto com problema de qualidade, contamos para a liderança ou a alguém da equipe do CQ por que temos liberdade para isso?"], ["q28", "Na nossa empresa não temos receio de reportar falhas havendo um canal de comunicação sem necessidade de se identificar."], ["q29", "Na nossa empresa os colaboradores conhecem os problemas e riscos potenciais relacionados a higiene e segurança de alimentos e sabem o que devem fazer?"], ["q30", "Na nossa empresa as pessoas são incentivadas a apresentar sugestão de melhoria?"]];
const $ = s => document.querySelector(s);
const surveyView=$("#surveyView"), adminView=$("#adminView");
const charts=[];
function renderQuestions(){
 const host=$("#questions");
 host.innerHTML=questions.map(([id,text],i)=>`<article class="question-card"><label>${i+6}. ${escapeHtml(text)} <span class="required">*</span></label><div class="likert">${likert.map((label,j)=>`<label class="likert-option"><input required type="radio" name="${id}" value="${escapeHtml(label)}"><span>${escapeHtml(label)}</span></label>`).join("")}</div></article>`).join("");
 host.querySelectorAll("input").forEach(el=>el.addEventListener("change",updateProgress));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function updateProgress(){const n=questions.filter(([id])=>document.querySelector(`input[name="${id}"]:checked`)).length;$("#progressText").textContent=`${n} de ${questions.length} afirmações respondidas`;$("#progressBar").style.width=`${n/questions.length*100}%`;}
function setMessage(el,msg,type=""){el.textContent=msg;el.className="message "+type;}
renderQuestions();
if(location.search.includes("admin=1")){surveyView.hidden=true;adminView.hidden=false;}
$("#surveyForm").addEventListener("submit",async e=>{
 e.preventDefault();const btn=$("#submitBtn"),msg=$("#formMessage");
 if(!db){setMessage(msg,"Configure a URL e a chave anon do Supabase no arquivo app.js antes de publicar.","error");return;}
 const fd=new FormData(e.currentTarget);
 const answers={};for(const [id] of questions){const value=fd.get(id);if(!value){setMessage(msg,"Responda a todas as afirmações antes de enviar.","error");return;}answers[id]=value;}
 const payload={respondent_name:(fd.get("name")||"").trim()||null,area:fd.get("area"),cargo:fd.get("cargo"),idade:fd.get("idade"),tempo_empresa:fd.get("tempo"),answers};
 btn.disabled=true;btn.textContent="Enviando...";
 const {error}=await db.from("survey_responses").insert(payload);
 btn.disabled=false;btn.innerHTML='Enviar pesquisa <span>→</span>';
 if(error){console.error(error);setMessage(msg,"Não foi possível registrar sua resposta. Confira a conexão e tente novamente. Se persistir, avise o responsável pela pesquisa.","error");}
else {
  document.querySelector("#surveyView").innerHTML = `
    <section class="success-screen" role="status" aria-live="polite">
      <div class="success-icon">✓</div>
      <h1>Formulário enviado com sucesso!</h1>
      <p>
        Obrigado por participar da pesquisa.
        Sua resposta foi registrada.
      </p>
      <small>Você já pode fechar esta página.</small>
    </section>
  `;

  window.scrollTo({ top: 0, behavior: "smooth" });
}
});
$("#loginForm").addEventListener("submit",async e=>{
 e.preventDefault();if(!db){setMessage($("#loginMessage"),"Configure o Supabase no arquivo app.js.","error");return;}
 const {error}=await db.auth.signInWithPassword({email:$("#email").value,password:$("#password").value});
 if(error){setMessage($("#loginMessage"),"Não foi possível entrar. Verifique suas credenciais e se essa conta está autorizada.","error");return;}
 await loadDashboard();
});
$("#logoutBtn").addEventListener("click",async()=>{await db?.auth.signOut();$("#dashboard").hidden=true;$("#loginCard").hidden=false;});
$("#refreshBtn").addEventListener("click",loadDashboard);
$("#areaFilter").addEventListener("change",()=>renderDashboard(currentRows));
let currentRows=[];
async function loadDashboard(){
 if(!db){setMessage($("#loginMessage"),"Configure a URL e a chave anon do Supabase no arquivo app.js.","error");return;}
 const {data:{session}}=await db.auth.getSession();
 if(!session){$("#loginCard").hidden=false;$("#dashboard").hidden=true;return;}
 const {data,error}=await db.from("survey_responses").select("*").order("created_at",{ascending:true});
 if(error){setMessage($("#dashboardMessage"),"Acesso negado ou erro ao carregar respostas. Confirme se seu usuário está autorizado como administrador.","error");return;}
 currentRows=data||[];$("#loginCard").hidden=true;$("#dashboard").hidden=false;renderDashboard(currentRows);
}
function renderDashboard(rows){
 const area=$("#areaFilter").value;const filtered=area?rows.filter(r=>r.area===area):rows;
 $("#totalResponses").textContent=rows.length;
 $("#totalAreas").textContent=new Set(rows.map(r=>r.area)).size;
 const old=Array.from($("#areaFilter").options).map(o=>o.value);
 const areas=[...new Set(rows.map(r=>r.area).filter(Boolean))].sort();
 if(old.length!==areas.length+1){$("#areaFilter").innerHTML='<option value="">Todas as áreas</option>'+areas.map(a=>`<option>${escapeHtml(a)}</option>`).join("");$("#areaFilter").value=area;}
 charts.forEach(c=>c.destroy());charts.length=0;const host=$("#charts");host.innerHTML="";
 questions.forEach(([id,text],i)=>{
  const counts=likert.map(label=>filtered.filter(r=>r.answers&&r.answers[id]===label).length);
  const card=document.createElement("article");card.className="chart-card";
  card.innerHTML=`<h3>${i+6}. ${escapeHtml(text)}</h3><div class="chart-wrap"><canvas></canvas></div><p class="response-total">${counts.reduce((a,b)=>a+b,0)} respostas válidas nesta afirmação</p>`;
  host.appendChild(card);
  const ctx=card.querySelector("canvas").getContext("2d");
  charts.push(new Chart(ctx,{type:"doughnut",data:{labels:likert,datasets:[{data:counts,backgroundColor:["#29466f","#5f7eae","#b5c1d2","#d7a16c","#b85c5c"],borderWidth:2,borderColor:"#fff"}]},options:{responsive:true,maintainAspectRatio:false,cutout:"60%",plugins:{legend:{position:"bottom",labels:{boxWidth:10,padding:12,font:{size:10}}},tooltip:{callbacks:{label:c=>`${c.label}: ${c.raw} (${c.dataset.data.reduce((a,b)=>a+b,0)?Math.round(c.raw/c.dataset.data.reduce((a,b)=>a+b,0)*100):0}%)`}}}}}));
 });
 const counts={};rows.forEach(r=>counts[r.area]=(counts[r.area]||0)+1);
 $("#areaSummary").innerHTML=`<table class="table"><thead><tr><th>Área</th><th>Respostas</th><th>Participação</th></tr></thead><tbody>${Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([a,n])=>`<tr><td>${escapeHtml(a||"Não informada")}</td><td>${n}</td><td>${rows.length?Math.round(n/rows.length*100):0}%</td></tr>`).join("")}</tbody></table>`;
}
$("#pdfBtn").addEventListener("click",async()=>{
 if(!currentRows.length){setMessage($("#dashboardMessage"),"Ainda não há respostas para gerar o relatório.","error");return;}
 const btn=$("#pdfBtn");btn.disabled=true;btn.textContent="Gerando PDF...";
 try{
  const {jsPDF}=window.jspdf;const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  pdf.setFillColor(38,62,103);pdf.rect(0,0,210,42,"F");pdf.setTextColor(255,255,255);pdf.setFontSize(19);pdf.text("Pesquisa de Cultura",15,18);pdf.setFontSize(10);pdf.text("Qualidade e Segurança de Alimentos",15,27);pdf.text(`Relatório consolidado · ${new Date().toLocaleDateString("pt-BR")}`,15,34);
  pdf.setTextColor(35,45,60);pdf.setFontSize(12);pdf.text(`Total de respostas: ${currentRows.length}`,15,55);pdf.text(`Áreas representadas: ${new Set(currentRows.map(r=>r.area)).size}`,15,63);
  pdf.setFontSize(9);pdf.text("As respostas são apresentadas de forma consolidada. O relatório não inclui nomes dos participantes.",15,72,{maxWidth:180});
  pdf.autoTable({startY:82,head:[["Área","Respostas","Participação"]],body:Object.entries(currentRows.reduce((a,r)=>(a[r.area]=(a[r.area]||0)+1,a),{})).map(([a,n])=>[a,n,`${Math.round(n/currentRows.length*100)}%`]),theme:"grid",headStyles:{fillColor:[38,62,103]},styles:{fontSize:9}});
  for(let i=0;i<questions.length;i++){
   const [id,qtext]=questions[i];const counts=likert.map(label=>currentRows.filter(r=>r.answers&&r.answers[id]===label).length);
   pdf.addPage();pdf.setTextColor(35,45,60);pdf.setFontSize(12);pdf.text(`${i+6}. ${qtext}`,15,18,{maxWidth:180});
   const canvas=document.querySelectorAll(".chart-card canvas")[i];
   if(canvas){const img=canvas.toDataURL("image/png",1);pdf.addImage(img,"PNG",25,30,160,105);}
   pdf.autoTable({startY:142,head:[["Resposta","Quantidade","Percentual"]],body:likert.map((l,j)=>[l,counts[j],`${counts.reduce((a,b)=>a+b,0)?Math.round(counts[j]/counts.reduce((a,b)=>a+b,0)*100):0}%`]),theme:"grid",headStyles:{fillColor:[38,62,103]},styles:{fontSize:9}});
   pdf.setFontSize(8);pdf.setTextColor(120);pdf.text(`Página ${i+2} · Relatório consolidado`,15,287);
  }
  pdf.save("relatorio-pesquisa-cultura.pdf");setMessage($("#dashboardMessage"),"PDF gerado com sucesso.","success");
 }catch(err){console.error(err);setMessage($("#dashboardMessage"),"Não foi possível gerar o PDF. Tente novamente em um navegador atualizado.","error");}
 finally{btn.disabled=false;btn.textContent="Gerar relatório PDF";}
});
if(db){db.auth.onAuthStateChange((event,session)=>{if(location.search.includes("admin=1")&&session)loadDashboard();});}
