/* 私中英文模擬考：題目資料由 mock-english-bank.js 提供；不顯示整頁掃描檔。 */
(() => {
  'use strict';
  const STATE_KEY='private_school_mock_exam_state_v2', WRONG_KEY='private_school_mock_exam_wrong_v2', MASTERED_KEY='private_school_mock_exam_mastered_v2', REVIEW_KEY='private_school_mock_exam_review_v2', STATS_KEY='private_school_mock_exam_stats_v1', PAPER_COUNT=13;
  let session=null,timer=null;
  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(_){return {}}}, write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])), nl=v=>esc(v).replace(/\n/g,'<br>');
  const limit=n=>n<=30?30:60, clock=s=>{const t=Math.max(0,s);return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`};
  const bank=()=>window.MockEnglishQuestionBank||[], questions=p=>bank().filter(q=>q.paper===p).sort((a,b)=>a.no-b.no), find=id=>bank().find(q=>q.id===id);
  function stop(){if(timer)clearInterval(timer);timer=null;stopMockSpeech()} function root(){let e=document.getElementById('mock-exam-overlay');if(!e){e=document.createElement('div');e.id='mock-exam-overlay';document.body.appendChild(e)}return e}
  function mount(html){root().innerHTML=`<style>
    #mock-exam-overlay{position:fixed;inset:0;z-index:10001;overflow:auto;background:linear-gradient(135deg,#102a43,#243b53);padding:16px;font-family:Arial,'Microsoft JhengHei',sans-serif;color:#172b4d}#mock-exam-overlay *{box-sizing:border-box}.me-card{max-width:920px;margin:auto;background:#fff;border-radius:20px;padding:22px;box-shadow:0 18px 48px #0007}.me-card h1{margin:0 0 8px;font-size:1.55rem}.me-card p{line-height:1.65}.me-head{display:flex;align-items:center;justify-content:space-between;gap:10px;position:sticky;top:0;background:#fff;padding-bottom:12px;z-index:2}.me-btn,.me-back,.me-choice{border:0;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}.me-btn{background:#1261a0;color:#fff}.me-back{background:#e8eef6;color:#172b4d}.me-btn[disabled],.me-back[disabled]{background:#cbd5e1;color:#64748b;cursor:not-allowed}.me-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:12px;margin:18px 0}.me-paper{border:1px solid #cbd5e1;border-radius:14px;padding:15px;text-align:left;background:#fff}.me-paper h2{font-size:1rem;margin:0 0 7px}.me-paper small,.me-note{color:#52606d}.me-status{padding:12px;border-radius:12px;background:#eaf3fb;color:#12406d}.me-timer{font-variant-numeric:tabular-nums;font-size:1.18rem;color:#b42318}.me-progress{height:9px;background:#e5edf5;border-radius:99px;overflow:hidden;margin:10px 0 20px}.me-progress span{display:block;height:100%;background:#1d8f6e}.me-section{font-size:.9rem;color:#52606d;font-weight:700}.me-stem{font-size:1.16rem;line-height:1.75;margin:18px 0}.me-asset{max-width:100%;max-height:280px;object-fit:contain;margin:6px 0 16px}.me-table{width:100%;border-collapse:collapse;margin:12px 0}.me-table td,.me-table th{border:1px solid #94a3b8;padding:7px;text-align:left}.me-choices{display:grid;gap:10px}.me-choice{text-align:left;background:#fff;border:1.5px solid #cbd5e1;font-size:1rem}.me-choice:hover{border-color:#1261a0;background:#f4f9ff}.me-choice.selected{border-color:#1261a0;background:#dcedfb;color:#0c4a78}.me-nav{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:20px}.me-review-list{display:grid;gap:10px;margin:18px 0}.me-answer{border-radius:12px;padding:14px;margin:14px 0;background:#f3f8fc}.me-answer.good{background:#e9f8ef;color:#166534}.me-answer.bad{background:#fff0f0;color:#991b1b}@media(max-width:600px){#mock-exam-overlay{padding:8px}.me-card{padding:14px}.me-head{align-items:flex-start}.me-head b{font-size:.86rem}.me-nav{flex-wrap:wrap}.me-stem{font-size:1.04rem}}</style>${html}`}
  function close(){stop();const e=document.getElementById('mock-exam-overlay');if(e)e.remove()} const state=()=>read(STATE_KEY),saveState=v=>write(STATE_KEY,v);
  function home(){stop();session=null;const saved=state();const cards=Array.from({length:PAPER_COUNT},(_,i)=>{const p=i+1,qs=questions(p),r=saved[p],ready=qs.length===40,progress=r?.completedAt?`最近成績：${r.score}/100`:r?.answers?`已作答 ${Object.keys(r.answers).length}/40 題`:'尚未開始';return `<article class="me-paper"><h2>第 ${p} 回</h2><small>${ready?'40 題・每題 2.5 分・滿分 100 分':`題目轉錄與核對中（${qs.length}/40 題）`}</small><p>${progress}</p><button class="me-btn" ${ready?'':'disabled'} onclick="MockEnglish.start(${p})">${r?.answers?'繼續作答':'開始考試'}</button></article>`}).join('');mount(`<main class="me-card"><div class="me-head"><button class="me-back" onclick="MockEnglish.close()">← 回首頁</button><b>私中英文模擬考</b></div><h1>私中英文模擬考</h1><p>逐題文字作答，不顯示整頁掃描檔。第 1–30 題每題 30 秒；第 31–40 題每題 60 秒。</p><div class="me-status">題目、選項與圖表會逐題依原始試卷核對後加入。未完成核對的回次不會開放，避免出現猜測或錯誤題目。</div><div class="me-grid">${cards}</div><button class="me-back" onclick="MockEnglish.reviewMenu()">錯題複習與已熟悉題</button></main>`)}
  function start(p){const qs=questions(p);if(qs.length!==40)return home();const old=state()[p]||{},i=Math.max(0,Math.min(39,old.index||0));session={kind:'exam',paper:p,questions:qs,index:i,answers:old.answers||{},revealed:old.revealed||{},remaining:old.remaining||limit(qs[i].no)};renderQuestion()}
  function persistExam(){if(!session||session.kind!=='exam')return;const all=state();all[session.paper]={...all[session.paper],answers:session.answers,revealed:session.revealed,index:session.index,remaining:session.remaining,updatedAt:Date.now()};saveState(all)}
  function renderQuestion(){stop();const q=session.questions[session.index],choice=session.answers[q.id]??'',pct=((session.index+1)/40*100).toFixed(1),items=q.options.map((o,i)=>`<button class="me-choice ${choice===i?'selected':''}" onclick="MockEnglish.chooseAnswer(${i})"><b>${String.fromCharCode(65+i)}.</b> ${nl(o)}</button>`).join('');mount(`<main class="me-card"><div class="me-head"><button class="me-back" onclick="MockEnglish.exitExam()">暫停並離開</button><b>第 ${session.paper} 回・第 ${q.no} 題</b><span class="me-timer" id="me-clock">${clock(session.remaining)}</span></div><div class="me-progress"><span style="width:${pct}%"></span></div><div class="me-section">${esc(q.section||(q.no<=10?'Vocabulary':q.no<=20?'Grammar':q.no<=30?'Cloze-test':'Reading'))}・本題 2.5 分</div>${q.asset?`<img class="me-asset" src="${esc(q.asset)}" alt="題目附圖">`:''}${q.table||''}<div class="me-stem">${nl(q.stem)}</div><div class="me-choices">${items}</div><div class="me-nav"><button class="me-back" ${session.index===0?'disabled':''} onclick="MockEnglish.previous()">← 上一題</button><span class="me-note">${session.index+1} / 40</span><button class="me-btn" onclick="MockEnglish.next()">${session.index===39?'交卷並看結果':'下一題 →'}</button></div></main>`);timer=setInterval(()=>{session.remaining--;persistExam();const e=document.getElementById('me-clock');if(e)e.textContent=clock(session.remaining);if(session.remaining<=0){stop();if(session.index<39){session.index++;session.remaining=limit(session.questions[session.index].no);persistExam();renderQuestion()}else submit()}},1000)}
  function chooseAnswer(i){
    const q=session.questions[session.index];
    if(session.revealed[q.id])return;
    session.answers[q.id]=i;
    session.revealed[q.id]=true;
    persistExam();
    renderQuestion();
  }
  function previous(){if(session.index>0){session.index--;session.remaining=limit(session.questions[session.index].no);persistExam();renderQuestion()}}
  function next(){if(session.index<39){session.index++;session.remaining=limit(session.questions[session.index].no);persistExam();renderQuestion()}else submit()}
  function exitExam(){persistExam();home()}
  function submit(){stop();const wrong=read(WRONG_KEY),mastered=read(MASTERED_KEY),all=state();let correct=0;session.questions.forEach(q=>{const picked=session.answers[q.id];if(picked===q.answer){correct++;if(wrong[q.id]){wrong[q.id].streak=(wrong[q.id].streak||0)+1;if(wrong[q.id].streak>=5){mastered[q.id]={...wrong[q.id],masteredAt:Date.now()};delete wrong[q.id]}}}else wrong[q.id]={id:q.id,paper:q.paper,no:q.no,streak:0,wrongCount:(wrong[q.id]?.wrongCount||0)+1,lastWrongAt:Date.now()}});write(WRONG_KEY,wrong);write(MASTERED_KEY,mastered);const score=correct*2.5,p=session.paper;all[p]={answers:session.answers,index:39,remaining:0,completedAt:Date.now(),score,updatedAt:Date.now()};saveState(all);session=null;mount(`<main class="me-card"><div class="me-head"><button class="me-back" onclick="MockEnglish.home()">← 回模擬考</button><b>第 ${p} 回成績</b></div><h1>${score} / 100 分</h1><p>答對 ${correct} 題，答錯 ${40-correct} 題。每一題 2.5 分。</p><div class="me-review-list"><button class="me-btn" onclick="MockEnglish.startReview('paper',${p})">複習第 ${p} 回錯題</button><button class="me-btn" onclick="MockEnglish.startReview('all')">複習 13 回全部錯題</button><button class="me-back" onclick="MockEnglish.home()">離開</button></div></main>`)}
  function reviewMenu(){const wrong=Object.values(read(WRONG_KEY)),mastered=Object.values(read(MASTERED_KEY));mount(`<main class="me-card"><div class="me-head"><button class="me-back" onclick="MockEnglish.home()">← 回模擬考</button><b>錯題複習</b></div><h1>錯題與已熟悉題</h1><p>錯題 ${wrong.length} 題；已練習熟悉 ${mastered.length} 題。答對同一錯題 5 次後會移到「已熟悉」，仍可再次複習。</p><div class="me-review-list"><button class="me-btn" onclick="MockEnglish.startReview('all')">13 回全部錯題總複習</button><button class="me-back" onclick="MockEnglish.startReview('mastered')">已熟悉題複習</button><button class="me-back" onclick="MockEnglish.home()">離開</button></div></main>`)}
  function startReview(scope,p){const list=(scope==='mastered'?Object.values(read(MASTERED_KEY)):Object.values(read(WRONG_KEY)).filter(x=>scope!=='paper'||x.paper===p)).map(x=>x.id).filter(id=>find(id));if(!list.length){mount(`<main class="me-card"><button class="me-back" onclick="MockEnglish.reviewMenu()">← 返回</button><h1>目前沒有題目</h1><p>這個範圍目前沒有可複習的題目。</p></main>`);return}const old=read(REVIEW_KEY),signature=`${scope}-${p||'all'}`,i=old.signature===signature?Math.min(old.index||0,list.length-1):0;session={kind:'review',scope,paper:p,ids:list,index:i,answers:{},remaining:limit(find(list[i]).no),signature};renderReview()}
  function persistReview(){if(session?.kind==='review')write(REVIEW_KEY,{signature:session.signature,index:session.index,ids:session.ids,updatedAt:Date.now()})} function renderReview(){stop();const q=find(session.ids[session.index]),picked=session.answers[q.id],shown=picked!==undefined,items=q.options.map((o,i)=>`<button class="me-choice ${shown&&i===q.answer?'selected':''}" ${shown?'disabled':''} onclick="MockEnglish.reviewAnswer(${i})"><b>${String.fromCharCode(65+i)}.</b> ${nl(o)}</button>`).join('');mount(`<main class="me-card"><div class="me-head"><button class="me-back" onclick="MockEnglish.exitReview()">離開並記錄進度</button><b>複習・第 ${q.paper} 回第 ${q.no} 題</b><span class="me-timer" id="me-clock">${clock(session.remaining)}</span></div><div class="me-progress"><span style="width:${((session.index+1)/session.ids.length*100).toFixed(1)}%"></span></div><div class="me-section">第 ${q.paper} 回・${esc(q.section||'')}</div>${q.asset?`<img class="me-asset" src="${esc(q.asset)}" alt="題目附圖">`:''}${q.table||''}<div class="me-stem">${nl(q.stem)}</div><div class="me-choices">${items}</div>${shown?`<div class="me-answer ${picked===q.answer?'good':'bad'}"><b>${picked===q.answer?'答對了':`正確答案：${String.fromCharCode(65+q.answer)}`}</b><br>${nl(q.explanation||'解析正在依原答案頁校對。')}</div>`:''}<div class="me-nav"><span class="me-note">${session.index+1} / ${session.ids.length}</span><button class="me-btn" ${shown?'':'disabled'} onclick="MockEnglish.reviewNext()">${session.index===session.ids.length-1?'完成複習':'下一題 →'}</button></div></main>`);if(!shown)timer=setInterval(()=>{session.remaining--;const e=document.getElementById('me-clock');if(e)e.textContent=clock(session.remaining);if(session.remaining<=0){stop();reviewAnswer(-1)}},1000)}
  function reviewAnswer(i){stop();const q=find(session.ids[session.index]);session.answers[q.id]=i;const wrong=read(WRONG_KEY),mastered=read(MASTERED_KEY);if(i===q.answer&&wrong[q.id]){wrong[q.id].streak=(wrong[q.id].streak||0)+1;if(wrong[q.id].streak>=5){mastered[q.id]={...wrong[q.id],masteredAt:Date.now()};delete wrong[q.id]}write(WRONG_KEY,wrong);write(MASTERED_KEY,mastered)}renderReview()} function reviewNext(){if(session.index<session.ids.length-1){session.index++;session.remaining=limit(find(session.ids[session.index]).no);persistReview();renderReview()}else{localStorage.removeItem(REVIEW_KEY);reviewMenu()}} function exitReview(){persistReview();home()}
  window.MockEnglish={open:home,close,home,start,chooseAnswer,previous,next,exitExam,reviewMenu,startReview,reviewAnswer,reviewNext,exitReview};
  // Question speech controls are installed at the shared mock-exam layer, so every
  // current and future paper uses the same read/stop behavior.
  let mockSpeechRun=0,mockSpeechQuestionId='';
  function stopMockSpeech(){
    mockSpeechRun++;
    if('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
  function activeMockQuestion(){
    if(!session)return null;
    return session.kind==='exam' ? session.questions[session.index] : find(session.ids[session.index]);
  }
  function speakMockQuestion(){
    const q=activeMockQuestion();
    if(!q||!('speechSynthesis' in window))return;
    const run=++mockSpeechRun;
    window.speechSynthesis.cancel();
    const text=[q.stem,...q.options.map((option,index)=>`${'ABCD'[index]}. ${option}`)].join('. ')
      .replace(/\[[A-Z]\]/g,' ').replace(/\s+/g,' ').trim();
    const chunks=(text.match(/[\u3400-\u9fff]+|[^\u3400-\u9fff]+/g)||[]).map(x=>x.trim()).filter(Boolean);
    const voices=window.speechSynthesis.getVoices();
    const english=voices.find(v=>/en[-_]US/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));
    const chinese=voices.find(v=>/zh[-_]TW/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang));
    let index=0;
    const nextPart=()=>{
      if(run!==mockSpeechRun||index>=chunks.length)return;
      const part=chunks[index++],isChinese=/[\u3400-\u9fff]/.test(part),voice=new SpeechSynthesisUtterance(part);
      voice.lang=isChinese?'zh-TW':'en-US';
      if(isChinese&&chinese)voice.voice=chinese;
      if(!isChinese&&english)voice.voice=english;
      voice.rate=isChinese?.9:.78;
      voice.onend=nextPart;
      voice.onerror=nextPart;
      window.speechSynthesis.speak(voice);
    };
    nextPart();
  }
  function installMockSpeechControls(){
    if(!document.getElementById('mock-exam-feedback-style')){
      const style=document.createElement('style');
      style.id='mock-exam-feedback-style';
      style.textContent='.me-choice.correct{border-color:#16a34a!important;background:#f0fdf4!important;color:#166534}.me-choice.wrong{border-color:#dc2626!important;background:#fef2f2!important;color:#991b1b}.me-choice:disabled{cursor:default;opacity:1}.me-nav .me-btn:disabled{cursor:not-allowed;opacity:.55}';
      document.head.appendChild(style);
    }
    const overlay=document.getElementById('mock-exam-overlay');
    if(!overlay)return;
    const stem=overlay.querySelector('.me-stem');
    if(!stem||stem.previousElementSibling?.classList.contains('me-speech-controls'))return;
    const controls=document.createElement('div');
    controls.className='me-speech-controls';
    controls.style.cssText='display:flex;gap:8px;align-items:center;margin:14px 0 4px;flex-wrap:wrap';
    const speak=document.createElement('button');
    speak.type='button';speak.textContent='🔊 朗讀題目';speak.title='朗讀題目與選項';
    speak.style.cssText='border:0;border-radius:9px;padding:8px 11px;background:#e8f2ff;color:#075985;font-weight:800;cursor:pointer';
    speak.addEventListener('click',speakMockQuestion);
    const stopButton=document.createElement('button');
    stopButton.type='button';stopButton.textContent='⏹ STOP';stopButton.title='停止朗讀';
    stopButton.style.cssText='border:0;border-radius:9px;padding:8px 11px;background:#dc2626;color:#fff;font-weight:900;cursor:pointer';
    stopButton.addEventListener('click',stopMockSpeech);
    controls.append(speak,stopButton);
    stem.before(controls);
  }
  function applyMockAnswerFeedback(){
    if(!session||session.kind!=='exam')return;
    const q=activeMockQuestion(),overlay=document.getElementById('mock-exam-overlay');
    if(!q||!overlay)return;
    const revealed=Boolean(session.revealed?.[q.id]);
    if(revealed&&timer){clearInterval(timer);timer=null;persistExam();}
    const nextButton=overlay.querySelector('.me-nav .me-btn');
    if(nextButton)nextButton.disabled=!revealed;
    if(!revealed)return;
    const picked=session.answers[q.id];
    overlay.querySelectorAll('.me-choices .me-choice').forEach((button,index)=>{
      button.disabled=true;
      if(index===q.answer)button.classList.add('correct');
      if(index===picked&&picked!==q.answer)button.classList.add('wrong');
    });
    if(overlay.querySelector('.me-immediate-answer'))return;
    const feedback=document.createElement('div');
    feedback.className=`me-answer me-immediate-answer ${picked===q.answer?'good':'bad'}`;
    const title=document.createElement('b');
    title.textContent=picked===q.answer?'答對了！':'答錯了。';
    const answer=document.createElement('div');
    answer.textContent=`正確答案：${String.fromCharCode(65+q.answer)}. ${q.options[q.answer]}`;
    const explanation=document.createElement('div');
    explanation.textContent=`解析：${q.explanation||'解析正在依原答案頁校對。'}`;
    feedback.append(title,document.createElement('br'),answer,explanation);
    overlay.querySelector('.me-choices')?.after(feedback);
  }
  function syncMockExamStats(){
    const exams=state(),stats=read(STATS_KEY);let changed=false;
    for(let paper=1;paper<=PAPER_COUNT;paper++){
      const record=exams[paper];
      if(!record?.completedAt||typeof record.score!=='number')continue;
      const entries=Array.isArray(stats[paper])?stats[paper]:[];
      if(!entries.some(entry=>entry.completedAt===record.completedAt)){
        entries.push({completedAt:record.completedAt,score:record.score});
        stats[paper]=entries.slice(-30);
        changed=true;
      }
    }
    if(changed)write(STATS_KEY,stats);
    return stats;
  }
  function startFrequentReview(){
    const list=Object.values(read(WRONG_KEY)).sort((a,b)=>(b.wrongCount||0)-(a.wrongCount||0)||(b.lastWrongAt||0)-(a.lastWrongAt||0)).slice(0,10).map(x=>x.id).filter(id=>find(id));
    if(!list.length){startReview('all');return;}
    const old=read(REVIEW_KEY),signature='frequent-top10',i=old.signature===signature?Math.min(old.index||0,list.length-1):0;
    session={kind:'review',scope:'frequent',ids:list,index:i,answers:{},remaining:limit(find(list[i]).no),signature};
    renderReview();
  }
  function renderMockHomeAnalytics(){
    const overlay=document.getElementById('mock-exam-overlay');
    if(!overlay||!overlay.querySelector('.me-grid'))return;
    const wrong=Object.values(read(WRONG_KEY)),stats=syncMockExamStats();
    if(!overlay.querySelector('#me-analytics')){
      const panel=document.createElement('section');
      panel.id='me-analytics';
      panel.style.cssText='margin:16px 0;padding:14px;border:1px solid #bfdbfe;border-radius:14px;background:#f8fbff';
      const cards=Array.from({length:PAPER_COUNT},(_,index)=>{
        const paper=index+1,entries=Array.isArray(stats[paper])?stats[paper]:[],scores=entries.map(x=>x.score),latest=scores.length?scores[scores.length-1]:null,best=scores.length?Math.max(...scores):null,average=scores.length?(scores.reduce((sum,score)=>sum+score,0)/scores.length).toFixed(1):null;
        return `<div style="padding:8px;border:1px solid #dbeafe;border-radius:9px;background:#fff;font-size:.78rem"><b>第 ${paper} 回</b><br>作答 ${scores.length} 次<br>最近 ${latest??'-'}｜最高 ${best??'-'}｜平均 ${average??'-'}</div>`;
      }).join('');
      panel.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><b>📊 各回成績統計</b><button type="button" id="me-frequent-review" style="border:0;border-radius:9px;padding:8px 11px;background:#b45309;color:#fff;font-weight:800;cursor:pointer">🔥 常錯題 Top 10 複習（${wrong.length}）</button></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-top:10px">${cards}</div>`;
      panel.querySelector('#me-frequent-review').addEventListener('click',startFrequentReview);
      overlay.querySelector('.me-grid').before(panel);
    }
    overlay.querySelectorAll('.me-paper').forEach((card,index)=>{
      if(card.querySelector('.me-paper-wrong-review'))return;
      const paper=index+1,count=wrong.filter(item=>item.paper===paper).length,button=document.createElement('button');
      button.type='button';button.className='me-back me-paper-wrong-review';button.style.marginTop='8px';
      button.textContent=`查看／複習本回錯題（${count}）`;
      button.disabled=count===0;
      button.addEventListener('click',()=>startReview('paper',paper));
      card.append(button);
    });
  }
  new MutationObserver(()=>{
    const q=activeMockQuestion();
    if(q&&q.id!==mockSpeechQuestionId){
      stopMockSpeech();
      mockSpeechQuestionId=q.id;
      // New questions are read once automatically. The visible button remains
      // available afterwards for an on-demand replay.
      setTimeout(()=>{if(activeMockQuestion()?.id===q.id)speakMockQuestion();},0);
    }
    installMockSpeechControls();
    applyMockAnswerFeedback();
    if(!q)renderMockHomeAnalytics();
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
