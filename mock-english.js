/* 私中英文模擬考：所有試題頁直接使用原始掃描檔，絕不重打或改寫題目。 */
(() => {
  'use strict';
  const PROGRESS_KEY = 'private_school_mock_exam_progress_v1';
  // 卷別及頁次直接依原書目錄頁（第 1 回 P3、…、第 13 回 P82）建立。
  // 每一張題目頁都維持掃描原稿，絕不改寫題幹、選項或閱讀圖表。
  const PAPER_STARTS = [3,10,17,24,30,36,43,50,57,64,70,76,82];
  const PAPERS = PAPER_STARTS.map((first, index) => {
    const last = (PAPER_STARTS[index + 1] || 88) - 1;
    return { name:`第 ${index + 1} 回`, pages:`P${first}–P${last}`, files:Array.from({length:last-first+1},(_,i)=>`私中題庫/模擬考題/${first+i}.jpg`) };
  });
  let paper = null, page = 0, question = 1, remaining = 0, timer = null;

  const read = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; } };
  const write = value => localStorage.setItem(PROGRESS_KEY, JSON.stringify(value));
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const clock = seconds => `${String(Math.max(0, Math.floor(seconds / 60))).padStart(2,'0')}:${String(Math.max(0, seconds % 60)).padStart(2,'0')}`;
  const questionLimit = number => number <= 30 ? 30 : 60;
  const stopTimer = () => { if (timer) clearInterval(timer); timer = null; };
  const mount = html => {
    let root = document.getElementById('mock-exam-overlay');
    if (!root) { root = document.createElement('div'); root.id = 'mock-exam-overlay'; document.body.appendChild(root); }
    root.innerHTML = `<style>
      #mock-exam-overlay{position:fixed;inset:0;z-index:10001;overflow:auto;background:linear-gradient(135deg,#102a43,#334e68);padding:18px;font-family:Arial,'Microsoft JhengHei',sans-serif;color:#102a43}#mock-exam-overlay *{box-sizing:border-box}.me-card{max-width:900px;margin:auto;background:#fff;border-radius:20px;padding:22px;box-shadow:0 18px 48px #0006}.me-card h1{margin:0 0 8px;font-size:1.55rem}.me-card p{line-height:1.6}.me-back,.me-btn{border:0;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}.me-back{background:#e7eef6;color:#102a43}.me-btn{background:#1261a0;color:#fff}.me-btn[disabled]{background:#aab8c2;cursor:not-allowed}.me-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:18px 0}.me-paper{border:1px solid #cbd5e1;border-radius:14px;padding:15px;text-align:left;background:#fff}.me-paper h2{font-size:1rem;margin:0 0 7px}.me-paper small{color:#52606d}.me-warning{padding:13px;border-radius:12px;background:#fff3cd;color:#795b00}.me-head{display:flex;justify-content:space-between;gap:12px;align-items:center;position:sticky;top:0;background:#fff;padding-bottom:12px;z-index:2}.me-timer{font-variant-numeric:tabular-nums;font-size:1.2rem;color:#b42318}.me-scan{width:100%;max-height:72vh;object-fit:contain;background:#e2e8f0;border-radius:12px}.me-nav{display:flex;justify-content:space-between;align-items:center;gap:9px;margin-top:12px}.me-answer-grid{display:grid;grid-template-columns:repeat(10,1fr);gap:6px;margin:14px 0}.me-answer-grid select{width:100%;padding:7px 2px;border:1px solid #cbd5e1;border-radius:7px;background:#fff}.me-answer-grid label{font-size:.7rem;text-align:center;color:#334e68}.me-note{font-size:.85rem;color:#52606d}@media(max-width:600px){#mock-exam-overlay{padding:8px}.me-card{padding:14px}.me-answer-grid{grid-template-columns:repeat(5,1fr)}}
    </style>${html}`;
  };
  function home() {
    stopTimer(); paper = null;
    const saved = read();
    mount(`<main class="me-card"><div class="me-head"><button class="me-back" onclick="MockEnglish.close()">← 回首頁</button><b>私中英文模擬考</b></div><h1>私中英文模擬考</h1><p>完整 13 回均直接使用原始掃描頁，保留題目、選項、圖表與閱讀排版。</p><div class="me-warning"><b>題目與答案來源：</b>題目取自「模擬考題」P3–P87；答案與完整逐題解析取自「模擬考題參考答案」。每題 2.5 分，40 題滿分 100 分。</div><div class="me-grid">${PAPERS.map((item, index) => { const progress=saved[index]; return `<article class="me-paper"><h2>${item.name}</h2><small>原稿頁碼 ${item.pages} · 40 題 · 每題 2.5 分</small><p>${progress ? `已保存作答 ${Object.keys(progress.answers||{}).length}/40 題` : '尚未開始'}</p><button class="me-btn" onclick="MockEnglish.choose(${index})">${progress ? '繼續作答' : '選擇此份試卷'}</button></article>`; }).join('')}</div><p class="me-note">已選的 A/B/C/D 與目前頁次會自動保存；每回完成後可開啟原始答案與完整解析。</p></main>`);
  }
  function choose(index) { paper = index; const saved = read()[index]; page = saved?.page || 0; question = saved?.question || 1; remaining = saved?.questionRemaining || questionLimit(question); render(); }
  function save() { if (paper === null) return; const all=read(), old=all[paper]||{}; all[paper]={...old,page,question,questionRemaining:remaining,answers:old.answers||{},updatedAt:Date.now()}; write(all); }
  function render() {
    const item=PAPERS[paper], record=read()[paper]||{answers:{}};
    const typeLabel=question<=30?'字彙／文法／克漏字：30 秒':'閱讀測驗：60 秒';
    mount(`<main class="me-card"><div class="me-head"><button class="me-back" onclick="MockEnglish.home()">← 離開並保存</button><b>${item.name} · 第 ${page+1}/${item.files.length} 頁</b><span class="me-timer" id="me-clock">⏱ ${clock(remaining)}</span></div><img class="me-scan" src="${item.files[page]}" alt="${item.name} 原始掃描第 ${page+1} 頁"><div class="me-nav"><button class="me-back" ${page===0?'disabled':''} onclick="MockEnglish.page(-1)">← 上一頁</button><span class="me-note">原稿頁碼 ${item.pages} · 每頁約 4 題 · 每題 2.5 分</span><button class="me-back" ${page===item.files.length-1?'disabled':''} onclick="MockEnglish.page(1)">下一頁 →</button></div><h2>逐題作答與倒計時</h2><div class="me-nav"><label>目前題號 <select onchange="MockEnglish.setQuestion(+this.value)">${Array.from({length:40},(_,i)=>`<option value="${i+1}" ${question===i+1?'selected':''}>第 ${i+1} 題</option>`).join('')}</select></label><b>${typeLabel} · 2.5 分</b><button class="me-btn" onclick="MockEnglish.nextQuestion()">${question===40?'完成作答':'下一題 →'}</button></div><div class="me-answer-grid">${Array.from({length:40},(_,i)=>`<label>${i+1}<select onchange="MockEnglish.answer(${i},this.value)"><option value="">—</option>${['A','B','C','D'].map(x=>`<option ${record.answers?.[i]===x?'selected':''}>${x}</option>`).join('')}</select></label>`).join('')}</div><button class="me-btn" onclick="MockEnglish.answers()">查看原始參考答案與完整解析</button><p class="me-note">每題 2.5 分，40 題滿分 100 分。第 1–30 題每題 30 秒；第 31–40 題閱讀測驗每題 60 秒。切換題號或按下一題時，會開始該題的完整時間。</p></main>`);
    stopTimer(); timer=setInterval(()=>{ remaining--; save(); const node=document.getElementById('me-clock'); if(node) node.textContent=`⏱ ${clock(remaining)}`; if(remaining<=0){stopTimer(); alert(`第 ${question} 題時間到，作答已保存。`); if(question<40) nextQuestion();} },1000);
  }
  function answers(){
    stopTimer();
    const files=['S__75087895_0.jpg','S__75087894_0.jpg','S__75087893_0.jpg','S__75087892_0.jpg','S__75087891_0.jpg','S__75087890_0.jpg','S__75087889_0.jpg','S__75087888_0.jpg','S__75087887_0.jpg','S__75087885_0.jpg','S__75087884_0.jpg','S__75087883_0.jpg','S__75087882_0.jpg','S__75087881_0.jpg','S__75087880_0.jpg','S__75087879_0.jpg','S__75087878_0.jpg','S__75087877_0.jpg','S__75087876_0.jpg'];
    mount(`<main class="me-card"><div class="me-head"><button class="me-back" onclick="MockEnglish.backToPaper()">← 回本回試卷</button><b>${PAPERS[paper].name} · 原始參考答案與解析</b></div><p>以下為原書「模擬考題參考答案」掃描頁。答案、中文解析與題號均不改寫。</p>${files.map((file,index)=>`<img class="me-scan" style="margin:10px 0" src="私中題庫/模擬考題/模擬考題參考答案/${file}" alt="原始參考答案與解析第 ${index+1} 頁">`).join('')}</main>`);
  }
  function setQuestion(number){ question=Math.max(1,Math.min(40,number)); remaining=questionLimit(question); save(); render(); }
  function nextQuestion(){ if(question<40){question++; remaining=questionLimit(question); save(); render();} else {save(); alert('本回作答已保存，可查看原始參考答案與完整解析。');} }
  window.MockEnglish={ open:home, home, close:()=>{stopTimer(); const root=document.getElementById('mock-exam-overlay'); if(root) root.remove();}, choose, page:delta=>{page=Math.max(0,Math.min(PAPERS[paper].files.length-1,page+delta));save();render();}, answer:(number,value)=>{const all=read(), record=all[paper]||{answers:{}};record.answers[number]=value;all[paper]={...record,page,question,questionRemaining:remaining,updatedAt:Date.now()};write(all);},setQuestion,nextQuestion,answers,backToPaper:render };
})();
