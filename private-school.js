/* 私中專區：Unit 1–6 題庫與自適應錯題複習 */
(() => {
  'use strict';
  const KEY = 'private_school_wrong_v1';
  const MASTERED_KEY = 'private_school_mastered_v1';
  const HISTORY_KEY = 'private_school_recent_questions_v1';
  const ATTEMPTS_KEY = 'private_school_attempts_v1';
  const CLOZE_ROUND_KEY = 'private_school_cloze_rounds_v1';
  const TYPES = { vocab:'字彙測驗', grammar:'文法測驗', cloze:'克漏字測驗', reading:'閱讀測驗' };
  // 依題庫目錄順序：自我介紹與家庭、學校生活、日常作息、食物餐廳、嗜好、交通問路。
  const LESSONS = ['Unit 1 自我介紹與家庭','Unit 2 學校生活與科目','Unit 3 日常作息與習慣','Unit 4 食物與餐廳','Unit 5 嗜好與休閒時光','Unit 6 交通與問路'];
  const q = (id,type,lesson,stem,opts,answer,explain,passage='') => ({id,type,lesson,stem,opts,answer,explain,passage});

  const vocabWords = [
    // Unit 1 字彙 p.3–p.5：完整 20 字，不再只顯示 6 題。
    ['aunt','姑姑／阿姨',0],['brother','兄弟',0],['cousin','堂（表）兄弟姊妹',0],['family','家庭',0],['father','父親',0],['favorite','最喜歡的',0],['friend','朋友',0],['friendly','友善的',0],['hard-working','勤勞的',0],['hobby','嗜好',0],['kind','和善的',0],['live','居住',0],['loving','有愛心的／慈愛的',0],['mother','母親',0],['name','名字',0],['sister','姊妹',0],['student','學生',0],['together','一起',0],['twelve','十二／十二歲',0],['uncle','叔叔／舅舅',0],
    ['restaurant','餐廳',3],['waiter','男服務生',3],['menu','菜單',3],['dessert','甜點',3],['hungry','飢餓的',3],['full','飽的',3],
    ['library','圖書館',1],['principal','校長',1],['playground','操場',1],['classmate','同學',1],['gym','體育館',1],['break time','下課時間',1],
    ['homework','作業',2],['breakfast','早餐',2],['always','總是',2],['sometimes','有時',2],['seldom','很少',2],['because','因為',2],
    ['guitar','吉他',4],['piano','鋼琴',4],['draw pictures','畫畫',4],['relax','放鬆',4],['practice','練習',4],['leisure time','休閒時間',4],
    ['taxi','計程車',5],['traffic light','紅綠燈',5],['corner','轉角',5],['platform','月台',5],['ticket','車票',5],['map','地圖',5]
  ];
  // 依掃描題庫 Unit 2–6 的核心字彙頁逐頁補齊（每單元 20 個）。
  vocabWords.splice(20, vocabWords.length-20,
    ['art','美術',1],['break','休息時間',1],['classmate','同學',1],['classroom','教室',1],['desk','書桌',1],['history','歷史',1],['homework','作業',1],['librarian','圖書館管理員',1],['library','圖書館',1],['lunch','午餐',1],['math','數學',1],['PE (Physical Education)','體育課',1],['playground','操場',1],['principal','校長',1],['school','學校',1],['science','科學',1],['subject','科目',1],['teacher','老師',1],['test','考試',1],['uniform','校服',1],
    ['alarm clock','鬧鐘',2],['breakfast','早餐',2],['brush','刷（牙／頭髮）',2],['dinner','晚餐',2],['early','早地',2],['exercise','運動；鍛鍊',2],['habit','習慣',2],['healthy','健康的',2],['late','晚地',2],['morning','早晨',2],['plan','計畫；規劃',2],['read','閱讀',2],['rest','休息',2],['routine','日常作息',2],['sleep','睡覺',2],['snack','點心',2],['study','讀書；學習',2],['wash','洗',2],['watch','觀看',2],['weekend','週末',2],
    ['bill','帳單',3],['cook','煮飯',3],['delicious','美味的',3],['dessert','甜點',3],['dish','菜餚；盤子',3],['full','飽的',3],['hungry','餓的',3],['juice','果汁',3],['menu','菜單',3],['milk','牛奶',3],['noodles','麵條',3],['order','點餐',3],['restaurant','餐廳',3],['rice','米飯',3],['salad','沙拉',3],['serve','端上（食物）；服務',3],['taste','品嘗；味道',3],['tasty','好吃的',3],['thirsty','口渴的',3],['waiter','男服務生',3],
    ['activity','活動',4],['boring','無聊的',4],['collect','收集',4],['concert','音樂會',4],['dance','跳舞',4],['draw','畫畫',4],['enjoy','喜愛；享受',4],['exciting','令人興奮的',4],['fun','樂趣；有趣的',4],['listen','聆聽',4],['movie','電影',4],['music','音樂',4],['paint','繪畫；塗色',4],['play','玩；演奏',4],['practice','練習',4],['relax','放鬆',4],['ride','騎（腳踏車、馬等）',4],['shop','購物',4],['sing','唱歌',4],['swim','游泳',4],
    ['across','穿越；橫越',5],['between','在…之間',5],['bus','公車',5],['car','汽車',5],['corner','轉角',5],['driver','司機',5],['far','遙遠的',5],['left','左邊的',5],['map','地圖',5],['minute','分鐘',5],['MRT','捷運',5],['near','在…附近',5],['next','下一個的；旁邊的',5],['right','右邊的',5],['road','道路',5],['station','車站',5],['street','街道',5],['taxi','計程車',5],['traffic light','紅綠燈',5],['train','火車',5]
  );

  const distractors = vocabWords.map(x=>x[1]);
  const vocab = vocabWords.map((w,i) => {
    const other = distractors.filter(x=>x!==w[1]);
    const choices = [w[1], ...Array.from({length:3},(_,j)=>other[(i+j)%other.length])];
    return q('v'+i,'vocab',w[2],`「${w[0]}」的中文意思是？`,choices,0,`${w[0]} = ${w[1]}。`);
  });

  // 依掃描題庫各 Unit 的「文法重點／文法測驗」頁重建；每單元固定 20 題。
  // 題目主題不跨 Unit，後段是以同一文法重點、該單元字彙延伸的不同情境。
  const grammar = [];
  const addGrammar = (lesson, rows) => rows.forEach((row, i) =>
    grammar.push(q(`g${lesson + 1}-${i + 1}`, 'grammar', lesson, ...row))
  );
  const be = ['am','is','are','be'];
  addGrammar(0, [
    ['I ___ a student in Green Junior High School.',be,0,'主詞 I 要搭配 am。'],
    ['My parents ___ both doctors.',be,2,'複數主詞 parents 要搭配 are。'],
    ['___ your brother a teacher?',['Does','Do','Are','Is'],3,'單數名詞 brother 搭配 Is。'],
    ['My sister’s name ___ Amy.',be,1,'name 是單數，搭配 is。'],
    ['This is ___ book.',['my','I','me','mine'],0,'名詞 book 前使用所有格 my。'],
    ['That man is ___ father.',['Tom','Toms’','Toms','Tom’s'],3,'表示「Tom 的」要用 Tom’s。'],
    ['___ is your English teacher?',['What','Where','Who','How'],2,'詢問人使用 Who。'],
    ['___ are you from?',['How','What','Where','Who'],2,'詢問地點使用 Where。'],
    ['___ is your favorite subject?',['What','Who','How','Where'],0,'詢問事物使用 What。'],
    ['My cousin and I ___ in the same town.',['lives','live','living','to live'],1,'My cousin and I 是複數主詞，使用原形 live。'],
    ['My father ___ an engineer.',be,1,'father 是單數主詞，搭配 is。'],
    ['___ name is Kevin.',['I','Me','My','Mine'],2,'name 前要用所有格 My。'],
    ['Anna is my cousin. ___ is very friendly.',['He','She','Her','Hers'],1,'Anna 是女生，作主詞用 She。'],
    ['Tom and Ben are brothers. ___ are hard-working.',['We','You','They','He'],2,'Tom and Ben 用 They 指代。'],
    ['How old ___ your sister?',['am','is','are','be'],1,'your sister 是單數，使用 is。'],
    ['What ___ your parents’ names?',['am','is','are','be'],2,'names 是複數，使用 are。'],
    ['My uncle ___ in Tainan.',be,1,'uncle 是單數，使用 is。'],
    ['___ you and your cousin friends?',['Am','Is','Are','Be'],2,'you and your cousin 是複數，使用 Are。'],
    ['My mother and I ___ dinner together.', ['has','have','having','to have'],1,'My mother and I 是複數主詞，使用 have。'],
    ['___ favorite hobby is drawing.', ['She','Her','Hers','She’s'],1,'hobby 前需要所有格 Her。']
  ]);
  addGrammar(1, [
    ['There ___ a playground in our school.',['is','are','am','be'],0,'單數名詞 playground 搭配 There is。'],
    ['There ___ many students in our class.',['is','are','am','be'],1,'複數名詞 students 搭配 There are。'],
    ['The pencil is ___ the pencil case.',['in','on','under','behind'],0,'物品在盒子裡面使用 in。'],
    ['The book is ___ the table.',['in','on','under','behind'],2,'物品在桌子下方使用 under。'],
    ['The library is ___ the gym.',['behind','in','on','at'],0,'掃描題庫的例句：library is behind the gym。'],
    ['The playground is ___ the school building.',['next to','under','in','at'],0,'next to 表示在旁邊。'],
    ['I am ___ early for class.',['always','always am','am always','is always'],2,'be 動詞後面放頻率副詞：am always。'],
    ['He ___ does his homework after dinner.',['usually','is usually','usually is','does usually'],0,'一般動詞前放頻率副詞。'],
    ['We ___ eat lunch near the library.',['sometimes','are sometimes','sometimes are','is sometimes'],0,'一般動詞 eat 前放 sometimes。'],
    ['She ___ forgets her homework.',['seldom','is seldom','seldom is','does seldom'],0,'一般動詞 forgets 前放 seldom。'],
    ['They are ___ late for school.',['never','never are','are never','do never'],2,'be 動詞後面放 never。'],
    ['___ there a science classroom?',['Are','Is','Do','Does'],1,'單數 classroom 的問句使用 Is there。'],
    ['___ there any desks in the classroom?',['Is','Are','Do','Does'],1,'複數 desks 的問句使用 Are there。'],
    ['There ___ not a test today.',['is','are','do','does'],0,'單數 test 的否定為 There is not。'],
    ['The principal’s office is ___ the library and the gym.',['between','under','on','at'],0,'兩者之間使用 between。'],
    ['My uniform is ___ the chair.',['on','in','behind','next'],0,'在椅子上使用 on。'],
    ['The teacher is ___ the classroom.',['in','on','under','between'],0,'在教室裡使用 in。'],
    ['My classmate is ___ late for school.',['never','never is','is never','does never'],2,'be 動詞 is 後面放 never。'],
    ['We ___ have PE on Fridays.',['usually','are usually','usually are','is usually'],0,'一般動詞 have 前放 usually。'],
    ['There ___ two libraries near the school.',['is','are','am','be'],1,'two libraries 是複數，使用 are。']
  ]);
  addGrammar(2, [
    ['I ___ up at six every day.',['get','gets','getting','to get'],0,'I 搭配原形動詞 get。'],
    ['She ___ to school by bus.',['go','goes','going','to go'],1,'She 為第三人稱單數，go 要加 es。'],
    ['He ___ his homework every day.',['do','does','doing','to do'],1,'He 為第三人稱單數，do 變 does。'],
    ['I ___ eat breakfast at home.',['don’t','doesn’t','am not','isn’t'],0,'I 的一般現在式否定用 don’t。'],
    ['She ___ like milk.',['don’t','doesn’t','isn’t','aren’t'],1,'She 的一般現在式否定用 doesn’t。'],
    ['___ you get up early every day?',['Do','Does','Are','Is'],0,'you 的一般現在式問句用 Do。'],
    ['___ he watch TV after dinner?',['Do','Does','Are','Is'],1,'he 的一般現在式問句用 Does。'],
    ['Does she ___ TV after dinner?',['watches','watch','watching','to watch'],1,'Does 後面接原形動詞 watch。'],
    ['My alarm clock ___ at six every morning.',['ring','rings','ringing','to ring'],1,'alarm clock 是單數，動詞加 s。'],
    ['My dad ___ sandwiches for breakfast.',['make','makes','making','to make'],1,'dad 是第三人稱單數，使用 makes。'],
    ['I read books ___ night.',['in','on','at','by'],2,'固定用法：at night。'],
    ['She takes a shower ___ the morning.',['at','on','in','by'],2,'固定用法：in the morning。'],
    ['They play basketball ___ school.',['after','at','in','on'],0,'固定用法：after school。'],
    ['We visit our grandparents ___ weekends.',['in','at','on','by'],2,'固定用法：on weekends。'],
    ['I ___ do my homework after dinner.',['usually','am usually','usually am','is usually'],0,'一般動詞 do 前放 usually。'],
    ['He ___ goes to bed late.',['never','is never','never is','does never'],0,'一般動詞 goes 前放 never。'],
    ['My sister ___ breakfast before school.',['eat','eats','eating','to eat'],1,'第三人稱單數 sister 使用 eats。'],
    ['We ___ exercise on weekends.',['do','does','doing','to do'],0,'We 搭配原形動詞 do。'],
    ['___ your brother study at night?',['Do','Does','Is','Are'],1,'your brother 是單數，問句用 Does。'],
    ['My friends ___ snacks after school.',['eat','eats','eating','to eat'],0,'friends 是複數，使用原形 eat。']
  ]);
  addGrammar(3, [
    ['I eat ___ apple every day.',['a','an','some','any'],1,'apple 發音以母音開頭，使用 an。'],
    ['I drink ___ milk in the morning.',['a','an','some','any'],2,'milk 是不可數名詞，肯定句可用 some。'],
    ['Rice is a(n) ___ noun.',['countable','uncountable','plural','singular'],1,'rice 是不可數名詞。'],
    ['Apples are ___ nouns.',['countable','uncountable','no','not'],0,'apples 可以計數，是可數名詞。'],
    ['I have ___ juice.',['some','any','an','many'],0,'肯定句使用 some。'],
    ['I don’t have ___ rice.',['some','any','a','an'],1,'否定句通常使用 any。'],
    ['Do you have ___ milk?',['some','any','a','an'],1,'一般疑問句通常使用 any。'],
    ['Would you like ___ coffee?',['some','any','a','an'],0,'提出邀請時常使用 some。'],
    ['I would like ___ sandwich.',['a','an','some','any'],0,'sandwich 是單數可數名詞，使用 a。'],
    ['She would like ___ orange.',['a','an','some','any'],1,'orange 發音以母音開頭，使用 an。'],
    ['There ___ some milk in the glass.',['is','are','am','be'],0,'milk 是不可數名詞，搭配 is。'],
    ['There ___ some noodles on the table.',['is','are','am','be'],1,'noodles 為複數，搭配 are。'],
    ['How ___ juice do you want?',['many','much','any','some'],1,'juice 是不可數名詞，使用 How much。'],
    ['How ___ apples do you want?',['many','much','any','some'],0,'apples 是可數複數，使用 How many。'],
    ['The soup ___ delicious.',['taste','tastes','tasting','to taste'],1,'soup 是單數，動詞使用 tastes。'],
    ['My parents ___ at a restaurant on Sundays.',['eat','eats','eating','to eat'],0,'parents 是複數，使用 eat。'],
    ['The waiter ___ us the menu.',['give','gives','giving','to give'],1,'waiter 是第三人稱單數，使用 gives。'],
    ['I am hungry, so I ___ some noodles.',['want','wants','wanting','to wanting'],0,'I 搭配原形動詞 want。'],
    ['She ___ not want dessert.',['do','does','is','are'],1,'she 的否定句使用 does not。'],
    ['___ you like some salad?',['Would','Do','Are','Is'],0,'禮貌邀請用 Would you like ...?']
  ]);
  addGrammar(4, [
    ['I like ___ books in my free time.',['read','reading','to reading','reads'],1,'like 後面可接 V-ing，題庫指定 reading。'],
    ['___ pictures is her favorite hobby.',['Draw','To draw','Drawing','Draws'],2,'動名詞 Drawing 可作主詞。'],
    ['He can’t ___ the guitar very well.',['playing','to play','plays','play'],3,'can’t 後面接原形動詞。'],
    ['My sister enjoys ___ to music after dinner.',['listen','listening','listens','to listen'],1,'enjoy 後面接 V-ing。'],
    ['We ___ swim in the river because it’s dangerous.',['can’t','aren’t','don’t','didn’t'],0,'表示能力／禁止，使用 can’t。'],
    ['He loves ___ photos when he travels.',['take','takes','taking','to taking'],2,'love 後面可接 V-ing，題庫指定 taking。'],
    ['I play basketball ___ a week.',['once','one time','one times','once time'],0,'頻率用 once a week。'],
    ['Can you ___ English songs?',['singing','sings','to sing','sing'],3,'Can 後面接原形動詞。'],
    ['She goes jogging ___ every month.',['two','twice','double','second'],1,'每月兩次用 twice。'],
    ['A: Do you like playing basketball? B: Yes, I ___.',['am','can','do','does'],2,'Do you...? 的肯定簡答是 Yes, I do.'],
    ['My friends and I ___ shopping on Sundays.',['go','goes','going','to go'],0,'My friends and I 是複數，使用 go。'],
    ['I can’t play the piano, but I ___ play the guitar.',['may','should','can','must'],2,'表示能力使用 can。'],
    ['Amy ___ music every evening.',['listen to','listens to','listening to','to listen to'],1,'Amy 是第三人稱單數，使用 listens to。'],
    ['Peter ___ a movie with his family on weekends.',['watch','watches','watching','to watch'],1,'Peter 是第三人稱單數，使用 watches。'],
    ['They enjoy ___ at the concert.',['dance','dancing','dances','to dancing'],1,'enjoy 後面接 V-ing。'],
    ['My hobby is ___ stamps.',['collect','collecting','collects','to collecting'],1,'be 動詞後用動名詞說明嗜好。'],
    ['___ she draw pictures after school?',['Do','Does','Is','Are'],1,'she 的一般現在式問句使用 Does。'],
    ['We don’t ___ video games every day.',['plays','play','playing','to play'],1,'don’t 後面接原形動詞 play。'],
    ['He ___ relaxes by listening to music.',['usually','is usually','usually is','does usually'],0,'一般動詞 relaxes 前放 usually。'],
    ['Can your sister ___?',['swims','swimming','swim','to swimming'],2,'Can 後面接原形動詞 swim。']
  ]);
  addGrammar(5, [
    ['The bank is ___ the post office.',['next to','under','at','on'],0,'相鄰的位置使用 next to。'],
    ['The park is ___ the school.',['in','at','across from','between'],2,'在對面使用 across from。'],
    ['There is a bus stop ___ the corner.',['under','on','between','at'],3,'固定用法：at the corner。'],
    ['Walk ___ the river and you’ll find a bridge.',['across','on','under','along'],3,'沿著河走使用 along。'],
    ['Don’t walk ___ the road. It’s dangerous.',['between','across','at','behind'],1,'穿越馬路使用 across。'],
    ['___ straight and turn right at the second corner.',['Be','Turn','Go','Walks'],2,'祈使句用原形動詞 Go。'],
    ['___ left at the traffic light, please.',['Turn','To turn','Going','Turns'],0,'祈使句用原形動詞 Turn。'],
    ['___ careful when you cross the street.',['Turn','Be','Go','Walk'],1,'Be careful 是祈使句。'],
    ['Excuse me, ___ can I get to the museum?',['when','where','how','who'],2,'詢問方式用 How。'],
    ['Please ___ the map to find the bus station.',['see','look at','watch','look for'],1,'看地圖使用 look at。'],
    ['Go ___ and then turn right at the traffic light.',['up','down','straight','near'],2,'直走使用 go straight。'],
    ['The bookstore is ___ the post office and the bank.',['behind','next to','across','between'],3,'兩者之間使用 between。'],
    ['The school is ___ the park, so let’s walk there.',['near','far','behind','across'],0,'距離近使用 near。'],
    ['How can I ___ to the train station from here?',['go','get','come','take'],1,'到某地使用 get to。'],
    ['It takes only five ___ to get to the hospital by car.',['miles','hours','minutes','days'],2,'五分鐘使用 five minutes。'],
    ['The driver stops ___ the red traffic light.',['at','in','on','by'],0,'固定搭配 at the traffic light。'],
    ['We get ___ the MRT at the next station.',['in','on','at','by'],1,'搭乘交通工具使用 get on。'],
    ['The taxi will arrive ___ ten minutes.',['on','at','in','for'],2,'in + 一段時間表示「在…之後」。'],
    ['The train station is ___ from my home.',['far','left','right','next'],0,'距離遠使用 far。'],
    ['___ the road carefully at the traffic light.',['Cross','Crosses','Crossing','To cross'],0,'祈使句以原形動詞 Cross 開頭。']
  ]);

  // 為每個單字增加三種新題型，讓考試不會反覆只出「英文選中文」的舊題。
  vocabWords.forEach((word,index)=>{
    const sameUnit=vocabWords.filter(w=>w[2]===word[2]&&w[0]!==word[0]).map(w=>w[0]);
    const choices=[word[0],...Array.from({length:3},(_,i)=>sameUnit[(index+i)%sameUnit.length])];
    vocab.push(
      q(`vx1-${index}`,'vocab',word[2],`「${word[1]}」對應的英文單字是？`,[...choices],0,`${word[0]} = ${word[1]}。`),
      q(`vx2-${index}`,'vocab',word[2],`Which word means “${word[1]}”?`,[...choices],0,`${word[0]} = ${word[1]}。`),
      q(`vx3-${index}`,'vocab',word[2],`Complete the vocabulary note: ___ = “${word[1]}”.`,[...choices],0,`${word[0]} = ${word[1]}。`)
    );
  });

  // 每題正解位置隨機，避免所有單字題的答案都固定在第一個選項。
  vocab.forEach(item => {
    const correct = item.opts[item.answer];
    item.opts.sort(() => Math.random() - .5);
    item.answer = item.opts.indexOf(correct);
  });

  const cloze = [
    q('c1','cloze',0,'Ben ___ twelve years old.',['am','is','are','be'],1,'Ben 是單數，使用 is。'),
    q('c2','cloze',0,'My father is an engineer, ___ my mother is a teacher.',['and','but','so','because'],0,'兩個資訊並列用 and。'),
    q('c3','cloze',0,'Tom is my brother, and ___ likes basketball.',['she','her','he','him'],2,'Tom 為男性主詞，用 he。'),
    q('c4','cloze',0,'We have dinner ___ every evening.',['together','family','friendly','live'],0,'together 表示一起。'),
    q('c5','cloze',1,'Mom took us to a new ___ for lunch.',['school','bank','station','restaurant'],3,'吃午餐的地點是 restaurant。'),
    q('c6','cloze',1,'The waiter gave us the ___.',['ticket','menu','bill','map'],1,'點餐前服務生給 menu。'),
    q('c7','cloze',1,'After dinner, we had fruit for ___.',['salad','menu','dessert','rice'],2,'餐後甜點是 dessert。'),
    q('c8','cloze',1,'Dad was so ___ that he couldn’t finish his cake.',['hungry','full','thirsty','busy'],1,'吃不下表示 full。'),
    q('c9','cloze',2,'The teacher stands at the door to ___ students.',['greet','draw','drive','practice'],0,'greet students 表示迎接學生。'),
    q('c10','cloze',2,'The playground is ___ the school building.',['under','on','next to','behind'],2,'next to 表示在旁邊。'),
    q('c11','cloze',2,'Students can read quietly in the ___.',['gym','library','playground','cafeteria'],1,'讀書的地方是 library。'),
    q('c12','cloze',2,'We have a short rest during ___.',['break time','traffic light','dessert','platform'],0,'下課休息是 break time。'),
    q('c13','cloze',3,'I do my homework ___ dinner every day.',['after','under','between','through'],0,'after dinner 表示晚餐後。'),
    q('c14','cloze',3,'She likes sports, ___ she doesn’t like swimming.',['and','but','so','because'],1,'前後轉折用 but。'),
    q('c15','cloze',3,'It is raining, ___ I stay at home.',['and','but','so','because'],2,'下雨是原因，待在家是結果，用 so。'),
    q('c16','cloze',3,'I stayed at home ___ it was raining.',['and','but','so','because'],3,'because 引導原因。'),
    q('c17','cloze',4,'Peter can play the ___.',['guitar','ticket','corner','map'],0,'play the guitar 是演奏吉他。'),
    q('c18','cloze',4,'Amy enjoys ___ pictures.',['draw','draws','drawing','drew'],2,'enjoy 後接動名詞 drawing。'),
    q('c19','cloze',4,'Music helps Peter and Amy ___.',['relax','relaxes','relaxing','relaxed'],0,'help + 原形動詞。'),
    q('c20','cloze',4,'Peter practices the piano for one ___ every day.',['hour','ticket','station','corner'],0,'one hour 表示一小時。'),
    q('c21','cloze',5,'My dad called a ___ to take me to school.',['bus','train','taxi','bike'],2,'叫計程車用 call a taxi。'),
    q('c22','cloze',5,'The driver stopped at the red ___.',['map','traffic light','platform','ticket'],1,'紅綠燈是 traffic light。'),
    q('c23','cloze',5,'Then he drove ___ the park.',['across','past','between','through'],1,'經過某地用 drive past。'),
    q('c24','cloze',5,'Amy looks at the ___ to find the right platform.',['menu','map','dessert','library'],1,'找月台要看地圖 map。')
  ];

  // Unit 1 原題庫（My Family、A Letter to My Cousin、Introducing Myself）第 5–10 題。
  cloze.push(
    q('c25','cloze',0,'How ___ you?',['am','is','are','be'],2,'主詞 you 要搭配 are。'),
    q('c26','cloze',0,'He ___ from Tainan.',['am','is','are','be'],1,'單數主詞 He 要搭配 is。'),
    q('c27','cloze',0,'Kevin is very kind and ___.',['friend','twelve','family','friendly'],3,'kind and friendly 表示「和善且友善」。'),
    q('c28','cloze',0,'Hello! ___ name is Kelly.',['I','Mine','Me','My'],3,'name 前需用所有格 My。'),
    q('c29','cloze',0,'___ hobby is drawing pictures.',['She','Her','Hers','She’s'],1,'hobby 前需用所有格 Her。'),
    q('c30','cloze',0,'Where ___ you from?',['am','is','are','be'],2,'主詞 you 要搭配 are。')
  );

  // 保留掃描題庫原題，再依相同 Unit 的單字、文法與私中常見四選一題型延伸。
  // 不再用「中文意思填英文」湊題數，所有補充題皆為句意判斷的情境式克漏字。
  const extraCloze = [
    [ // Unit 1：原題有 10 題，補 10 題
      ['My ___ is Linda. Nice to meet you!',['name','family','friend','hobby'],0,'介紹自己時說 My name is ...。'],
      ['Kevin lives with his ___ in Taichung.',['family','classroom','restaurant','station'],0,'和家人一起住使用 family。'],
      ['My father’s sister is my ___.',['aunt','uncle','cousin','sister'],0,'父親的姊妹是 aunt。'],
      ['Amy and I are classmates. She is my good ___.',['friend','mother','teacher','father'],0,'同學且關係好是 friend。'],
      ['Jack is kind and ___ to everyone in his class.',['friendly','hungry','late','full'],0,'對每個人友善使用 friendly。'],
      ['My brother is very ___; he studies every night.',['hard-working','thirsty','boring','far'],0,'每天努力讀書表示 hard-working。'],
      ['Lucy and her cousin play basketball ___.',['together','behind','early','never'],0,'一起玩使用 together。'],
      ['My mother is very ___ and gives me a warm hug.',['loving','left','tasty','busy'],0,'慈愛的媽媽使用 loving。'],
      ['I am ___ years old, and I am in sixth grade.',['twelve','twenty','second','twice'],0,'十二歲使用 twelve。'],
      ['Ben has one brother and one ___.',['sister','aunt','teacher','waiter'],0,'one brother and one sister 是手足。']
    ],
    [ // Unit 2：原題有 4 題，補 16 題
      ['We have art class on Monday. Art is my favorite ___.',['subject','uniform','desk','break'],0,'art 是一門科目，使用 subject。'],
      ['Please put your books on your ___.',['desk','playground','lunch','library'],0,'書放在書桌上使用 desk。'],
      ['Ms. Wang teaches math. She is our math ___.',['teacher','librarian','principal','classmate'],0,'教導學生的人是 teacher。'],
      ['The ___ welcomes new students at the school gate.',['principal','waiter','driver','uncle'],0,'校長是 principal。'],
      ['We borrow storybooks from the ___.',['library','classroom','restaurant','station'],0,'借書的地方是 library。'],
      ['The ___ helps students find books in the library.',['librarian','classmate','teacher','driver'],0,'圖書館管理員是 librarian。'],
      ['We run and play games on the ___.',['playground','desk','uniform','lunch'],0,'跑步玩遊戲的地方是 playground。'],
      ['Students wear a school ___ on Monday.',['uniform','subject','test','break'],0,'校服是 uniform。'],
      ['I study science, math, and history at ___.',['school','restaurant','station','corner'],0,'上學的地方是 school。'],
      ['We eat ___ in the cafeteria at noon.',['lunch','homework','test','art'],0,'中午吃的是 lunch。'],
      ['There is a math ___ tomorrow, so I study tonight.',['test','break','desk','library'],0,'明天要考試使用 test。'],
      ['During the ___, students can rest for ten minutes.',['break','subject','uniform','classroom'],0,'休息時間是 break。'],
      ['Tom is in my class. He is my ___.',['classmate','principal','librarian','waiter'],0,'同班同學是 classmate。'],
      ['Our science ___ is bright and clean.',['classroom','playground','library','station'],0,'上科學課的教室是 classroom。'],
      ['PE means Physical ___.',['Education','Exercise','English','Evening'],0,'PE 是 Physical Education。'],
      ['History tells us about people and events from the ___.',['past','menu','future','corner'],0,'history 與過去發生的事有關。']
    ],
    [ // Unit 3：原題有 4 題，補 16 題
      ['My ___ rings at six, so I get up early.',['alarm clock','traffic light','menu','map'],0,'早晨叫醒人的鬧鐘是 alarm clock。'],
      ['I eat eggs and bread for ___.',['breakfast','dinner','snack','lunch'],0,'早上吃的是 breakfast。'],
      ['Please ___ your teeth before you go to bed.',['brush','watch','serve','collect'],0,'睡前刷牙使用 brush。'],
      ['My family eats ___ together at seven every night.',['dinner','breakfast','snack','lunch'],0,'晚上七點吃的是 dinner。'],
      ['Mia gets up ___ because she takes the first bus.',['early','late','full','far'],0,'搭第一班車要早起，使用 early。'],
      ['Running in the park is good ___.',['exercise','homework','dessert','traffic'],0,'跑步是一種 exercise。'],
      ['Drinking water is a healthy ___.',['habit','corner','subject','bill'],0,'健康習慣是 healthy habit。'],
      ['Don’t be ___ for school again.',['late','early','friendly','hungry'],0,'上學遲到使用 late。'],
      ['I read a book every ___.',['morning','restaurant','station','uniform'],0,'每天早晨使用 every morning。'],
      ['We make a study ___ before the test.',['plan','map','menu','bill'],0,'讀書計畫是 study plan。'],
      ['You should ___ for the English test tonight.',['study','sleep','wash','ride'],0,'為考試讀書使用 study。'],
      ['After two hours of homework, I need to ___.',['rest','order','serve','draw'],0,'做完很久功課需要休息，使用 rest。'],
      ['My daily ___ starts with breakfast and exercise.',['routine','concert','family','road'],0,'日常作息是 routine。'],
      ['Most children ___ for eight hours at night.',['sleep','swim','sing','shop'],0,'晚上睡覺使用 sleep。'],
      ['An apple is a healthy ___.',['snack','subject','station','dessert'],0,'蘋果可當健康點心 snack。'],
      ['I ___ my hands before dinner.',['wash','paint','listen','drive'],0,'晚餐前洗手使用 wash。']
    ],
    [ // Unit 4：原題有 4 題，補 16 題
      ['After we eat, Dad asks for the ___.',['bill','menu','map','uniform'],0,'用餐後結帳要拿 bill。'],
      ['My mother can ___ delicious soup.',['cook','ride','draw','drive'],0,'煮湯使用 cook。'],
      ['This cake is sweet and ___.',['delicious','late','far','left'],0,'美味的蛋糕是 delicious。'],
      ['Ice cream is my favorite ___.',['dessert','subject','break','station'],0,'冰淇淋是甜點 dessert。'],
      ['The waiter brings a fish ___ to our table.',['dish','road','test','map'],0,'一道魚料理是 a fish dish。'],
      ['I am very ___ because I did not eat lunch.',['hungry','full','friendly','early'],0,'沒吃午餐會餓，使用 hungry。'],
      ['Would you like orange ___ with your breakfast?',['juice','rice','noodles','salad'],0,'柳橙汁是 orange juice。'],
      ['Let’s read the ___ before we order food.',['menu','bill','map','uniform'],0,'點餐前讀菜單 menu。'],
      ['A glass of ___ is good for children.',['milk','rice','salad','noodles'],0,'一杯牛奶是 a glass of milk。'],
      ['I would like chicken ___ for lunch.',['noodles','juice','milk','dessert'],0,'雞肉麵是 chicken noodles。'],
      ['May I ___ a salad, please?',['order','serve','taste','cook'],0,'在餐廳點餐使用 order。'],
      ['We eat ___ with chopsticks.',['rice','juice','milk','soup'],0,'用筷子吃飯是 rice。'],
      ['The waiter will ___ the food soon.',['serve','collect','watch','brush'],0,'服務生端上食物使用 serve。'],
      ['Please ___ the soup before you add salt.',['taste','order','wash','study'],0,'品嘗湯使用 taste。'],
      ['These noodles are really ___.',['tasty','thirsty','boring','near'],0,'好吃的麵是 tasty。'],
      ['After running, I am very ___.',['thirsty','full','loving','early'],0,'跑步後口渴使用 thirsty。']
    ],
    [ // Unit 5：原題有 4 題，補 16 題
      ['Swimming is a fun weekend ___.',['activity','subject','uniform','corner'],0,'週末活動是 activity。'],
      ['The movie is too long and ___.',['boring','exciting','tasty','friendly'],0,'太長又無聊使用 boring。'],
      ['I like to ___ stamps from different countries.',['collect','serve','cross','wash'],0,'收集郵票使用 collect。'],
      ['We go to a music ___ on Saturday night.',['concert','restaurant','station','classroom'],0,'音樂會是 concert。'],
      ['Amy loves to ___ to pop music.',['dance','drive','cook','study'],0,'隨音樂跳舞使用 dance。'],
      ['Can you ___ a picture of your family?',['draw','ride','order','rest'],0,'畫圖使用 draw。'],
      ['I ___ listening to music after school.',['enjoy','am','do','have'],0,'喜歡享受某活動使用 enjoy。'],
      ['The soccer game is very ___.',['exciting','boring','thirsty','late'],0,'令人興奮的比賽是 exciting。'],
      ['Playing games with friends is great ___.',['fun','traffic','history','homework'],0,'樂趣是 fun。'],
      ['Please ___ carefully to the teacher.',['listen','paint','swim','shop'],0,'仔細聽老師說話使用 listen。'],
      ['We watch a ___ at home on Friday night.',['movie','menu','map','uniform'],0,'在家看的電影是 movie。'],
      ['My sister plays the piano because she loves ___.',['music','math','milk','traffic'],0,'鋼琴與 music 有關。'],
      ['I use many colors to ___ a picture.',['paint','read','wash','order'],0,'上色繪畫使用 paint。'],
      ['The children ___ in the park after school.',['play','plays','playing','to playing'],0,'children 是複數，使用原形 play。'],
      ['Practice makes you better at the ___.',['piano','station','salad','road'],0,'練習鋼琴可進步，使用 piano。'],
      ['After a busy week, I want to ___.',['relax','test','serve','greet'],0,'忙碌後想放鬆，使用 relax。']
    ],
    [ // Unit 6：原題有 4 題，補 16 題
      ['Please walk ___ the street at the traffic light.',['across','between','under','behind'],0,'穿越街道使用 across。'],
      ['The bookstore is ___ the bank and the park.',['between','across','under','near'],0,'兩者之間使用 between。'],
      ['I take the ___ to school every morning.',['bus','map','corner','road'],0,'每天搭公車上學使用 bus。'],
      ['My dad drives a ___ to work.',['car','station','street','train'],0,'開車上班使用 car。'],
      ['Turn right at the next ___.',['corner','minute','ticket','driver'],0,'在下一個轉角右轉，使用 corner。'],
      ['The bus ___ says, “Good morning!”',['driver','waiter','librarian','principal'],0,'公車司機是 driver。'],
      ['The museum is too ___ to walk to.',['far','near','left','right'],0,'太遠不能走路，使用 far。'],
      ['Turn ___ at the traffic light to get to the bank.',['left','far','near','across'],0,'左轉使用 turn left。'],
      ['Look at the ___ before you visit a new city.',['map','menu','bill','test'],0,'到新城市前看地圖 map。'],
      ['It takes ten ___ to get to school.',['minutes','roads','corners','trains'],0,'十分鐘是 ten minutes。'],
      ['The ___ is faster than the bus in Taipei.',['MRT','taxi driver','traffic light','street'],0,'台北捷運是 MRT。'],
      ['My home is ___ the train station, so I can walk there.',['near','far','between','across'],0,'可以走路表示很近，使用 near。'],
      ['The bakery is ___ to the library.',['next','full','early','tasty'],0,'在圖書館旁邊使用 next to。'],
      ['Please turn ___ at the second corner.',['right','late','behind','across'],0,'右轉使用 turn right。'],
      ['This ___ leads to the train station.',['road','dessert','subject','routine'],0,'通往車站的道路是 road。'],
      ['We wait for the train at the ___.',['station','restaurant','classroom','playground'],0,'等火車的地方是 station。']
    ]
  ];
  extraCloze.forEach((rows,lesson)=>rows.forEach((row,index)=>
    cloze.push(q(`cx-${lesson}-${index}`,'cloze',lesson,...row))
  ));

  // 每次重新整理時，克漏字四個選項皆重新排列；答案索引也同步更新。
  cloze.forEach(item=>{
    const correct=item.opts[item.answer];
    item.opts.sort(()=>Math.random()-.5);
    item.answer=item.opts.indexOf(correct);
  });

  // 同步調整克漏字的 Unit 標記，讓篩選單位與題庫目錄一致。
  cloze.slice(4,8).forEach(x => x.lesson = 3);   // 食物與餐廳
  cloze.slice(8,12).forEach(x => x.lesson = 1);  // 學校生活與科目
  cloze.slice(12,16).forEach(x => x.lesson = 2); // 日常作息與習慣

  const passages = [
    [0,'Ben lives in Taichung with his family. His father is an engineer, and his mother is a teacher. Ben has one brother, Tom. Tom likes playing basketball. The family often has dinner together every evening.',[
      ['Where does Ben live?',['In Taipei','In Taichung','In Tainan','In Kaohsiung'],1,'文章第一句指出 Ben lives in Taichung。'],
      ['What is Ben’s father?',['A teacher','A doctor','An engineer','A driver'],2,'父親是 engineer。'],
      ['Who likes basketball?',['Ben','Tom','Ben’s mother','Ben’s father'],1,'Tom likes playing basketball。'],
      ['What does the family do every evening?',['Play basketball','Have dinner together','Go to school','Read maps'],1,'家人每天晚上一起吃晚餐。']]],
    [1,'Mom took the family to a new restaurant for lunch. The waiter gave them the menu. They ordered noodles and rice. After dinner, they had fruit for dessert. Dad was full, so he could not finish his cake.',[
      ['Where did the family have lunch?',['At school','At a restaurant','At a station','At home'],1,'他們去 restaurant 用餐。'],
      ['Who gave them the menu?',['A teacher','A waiter','A driver','A doctor'],1,'服務生 waiter 給菜單。'],
      ['What did they have for dessert?',['Cake','Soup','Fruit','Rice'],2,'文章說 had fruit for dessert。'],
      ['Why could Dad not finish his cake?',['He was late','He was full','He was sick','He was busy'],1,'Dad was full，所以吃不下。']]],
    [2,'Lily goes to the library after school. The library is next to the gym. She reads books there because it is quiet. During break time, Lily meets her classmates on the playground.',[
      ['Where does Lily go after school?',['The gym','The library','The station','The restaurant'],1,'Lily goes to the library after school。'],
      ['Where is the library?',['Under the gym','Next to the gym','In the park','Behind the station'],1,'圖書館在體育館旁邊。'],
      ['Why does Lily read there?',['It is quiet','It is big','It has food','It is near home'],0,'文章指出 because it is quiet。'],
      ['When does Lily meet classmates?',['After dinner','Every morning','During break time','On Sunday'],2,'下課時間見同學。']]],
    [3,'Kevin always gets up early. He eats breakfast at home and then goes to school. It is raining today, so Kevin takes an umbrella. He stays at school after class because he has homework to finish.',[
      ['What does Kevin always do?',['Gets up early','Plays piano','Takes a taxi','Eats dessert'],0,'Kevin always gets up early。'],
      ['Why does Kevin take an umbrella?',['It is hot','It is raining','He is hungry','He is late'],1,'下雨所以帶傘。'],
      ['Where does Kevin eat breakfast?',['At school','At home','At a restaurant','On the bus'],1,'他在家吃早餐。'],
      ['Why does he stay after class?',['To play games','To finish homework','To meet a driver','To buy a ticket'],1,'因為要完成作業。']]],
    [4,'Peter practices the piano for one hour every day. Amy enjoys drawing pictures and listening to stories. They both like music because it helps them relax after school.',[
      ['What can Peter do?',['Play the piano','Drive a taxi','Draw maps','Cook noodles'],0,'Peter 練習鋼琴。'],
      ['How long does Peter practice?',['Thirty minutes','One hour','Two hours','All day'],1,'每天一小時。'],
      ['What does Amy enjoy doing?',['Drawing pictures','Playing basketball','Driving','Cooking'],0,'Amy 喜歡畫畫。'],
      ['Why do they like music?',['It helps them relax','It makes them tired','It is difficult','It helps them eat'],0,'音樂幫助他們放鬆。']]],
    [5,'It is Sunday morning. Amy is going to visit her aunt in Taichung. She takes a taxi to the train station because her house is far from the city center. She looks at the map, buys a ticket, and gets on the train.',[
      ['Who is Amy going to visit?',['Her friend','Her aunt','Her teacher','Her cousin'],1,'Amy 要拜訪阿姨。'],
      ['Why does Amy take a taxi?',['It is raining','She is tired','Her house is far from the city center','The train is late'],2,'住家離市中心遠。'],
      ['What does Amy look at?',['A menu','A map','A story','A guitar'],1,'她看地圖找月台。'],
      ['What does Amy do after buying a ticket?',['Gets on the train','Goes home','Eats lunch','Calls her father'],0,'買票後上火車。']]]
  ];
  // 閱讀篇章也依同一份目錄的 Unit 2、3、4 順序排列。
  passages[1][0] = 3; // 食物與餐廳
  passages[2][0] = 1; // 學校生活與科目
  passages[3][0] = 2; // 日常作息與習慣
  const reading = passages.flatMap((p,pi) => p[2].map((r,ri) => q(`r${pi}-${ri}`,'reading',p[0],r[0],r[1],r[2],r[3],p[1])));
  const BANK = [...vocab,...grammar,...cloze,...reading];

  // 首次開啟預設從 Unit 1 開始，避免一次載入所有範圍。
  let state = { selected:new Set(['vocab']), lessons:new Set([0]), quiz:[], index:0, answers:[], mode:'test', timerId:null, autoNextId:null, questionStartedAt:0 };
  let speechRun=0;
  const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const getWrong = () => { try { return JSON.parse(localStorage.getItem(KEY)||'{}'); } catch { return {}; } };
  const saveWrong = x => localStorage.setItem(KEY,JSON.stringify(x));
  const getMastered = () => { try { return JSON.parse(localStorage.getItem(MASTERED_KEY)||'{}'); } catch { return {}; } };
  const saveMastered = x => localStorage.setItem(MASTERED_KEY,JSON.stringify(x));
  const getHistory = () => { try { const x=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]'); return Array.isArray(x)?x:[]; } catch { return []; } };
  const saveHistory = x => localStorage.setItem(HISTORY_KEY,JSON.stringify(x));
  const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
  const getAttempts = () => { try { const x=JSON.parse(localStorage.getItem(ATTEMPTS_KEY)||'[]'); return Array.isArray(x)?x.filter(a=>a&&a.completedAt>=Date.now()-ONE_YEAR_MS):[]; } catch { return []; } };
  const saveAttempts = x => localStorage.setItem(ATTEMPTS_KEY,JSON.stringify(x));
  const getClozeRounds = () => { try { return JSON.parse(localStorage.getItem(CLOZE_ROUND_KEY)||'{}'); } catch { return {}; } };
  const saveClozeRounds = x => localStorage.setItem(CLOZE_ROUND_KEY,JSON.stringify(x));
  const sameLocalDay = (time, now=new Date()) => { const d=new Date(time); return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth() && d.getDate()===now.getDate(); };
  const timeLabel = time => new Intl.DateTimeFormat('zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(time));
  const durationLabel = seconds => { const value=Math.max(0,Math.round(seconds||0)); return `${Math.floor(value/60)} 分 ${String(value%60).padStart(2,'0')} 秒`; };
  const attemptDuration = attempt => typeof attempt.totalSeconds==='number' ? attempt.totalSeconds : attempt.answers.reduce((sum,answer)=>sum+(answer.elapsedSeconds||0),0);
  const shuffle = a => [...a].sort(()=>Math.random()-.5);
  // 滿分後使用新的題組：答案與四個選項永遠只取自同一 Unit 的 20 個核心單字。
  // 題幹會依輪次更換不同的閱讀任務，避免學生背選項位置或舊題答案。
  function advancedCloze(lesson, round){
    const words=vocabWords.filter(w=>w[2]===lesson);
    const tasks=[
      w=>`閱讀 ${LESSONS[lesson]} 的情境提示後，選出最符合空格的字：The best word for “${w[1]}” is ___.`,
      w=>`在一段 ${LESSONS[lesson]} 的短文中，空格應填入能表達「${w[1]}」的字：___.`,
      w=>`請依上下文選出最精確的 Unit ${lesson+1} 單字：___ means “${w[1]}”.`,
      w=>`這是 Unit ${lesson+1} 的延伸應用題；最適合填入空格的是 ___（意思：${w[1]}）。`,
      w=>`閱讀題組的關鍵線索是「${w[1]}」，請選出正確的英文單字：___.`
    ];
    return words.map((word,index)=>{
      const others=words.filter(w=>w[0]!==word[0]).map(w=>w[0]);
      const choices=[word[0],...Array.from({length:3},(_,n)=>others[(index+round+n*3)%others.length])];
      const task=tasks[(round+index)%tasks.length](word);
      return q(`adcloze-${lesson}-${round}-${index}`,'cloze',lesson,task,shuffle(choices),0,`${word[0]} = ${word[1]}。第 ${round+1} 輪延伸題，答案與選項均限本 Unit 字彙。`);
    }).map(item=>{const correct=words.find(w=>item.opts.includes(w[0])&&item.stem.includes(`“${w[1]}”`)); if(correct)item.answer=item.opts.indexOf(correct[0]); return item;});
  }
  function choose(pool,n) {
    const wrong=getWrong();
    const history=getHistory();
    return [...pool].sort((a,b)=>{
      const wrongFirst=(wrong[b.id]?.count||0)-(wrong[a.id]?.count||0);
      if(wrongFirst) return wrongFirst; // 錯題永遠優先
      const aSeen=history.includes(a.id), bSeen=history.includes(b.id);
      if(aSeen!==bSeen) return aSeen?1:-1; // 非錯題時優先沒考過的題目
      return Math.random()-.5;
    }).slice(0,n);
  }
  // 同一個單字有多種題型變化（v0、vx1-0…），但一場測驗只能取其中一題。
  const vocabWordId = item => {
    const match=String(item.id).match(/^v(?:x[123]-)?(\d+)$/);
    return match ? Number(match[1]) : null;
  };
  function chooseVocab(pool,n){
    const wrong=getWrong(), history=getHistory(), groups=new Map();
    pool.forEach(item=>{const id=vocabWordId(item); if(id!==null){if(!groups.has(id))groups.set(id,[]);groups.get(id).push(item);}});
    return [...groups.values()].map(items=>{
      const unseen=items.filter(item=>!history.includes(item.id));
      const candidates=unseen.length?unseen:items;
      return [...candidates].sort((a,b)=>(wrong[b.id]?.count||0)-(wrong[a.id]?.count||0)||Math.random()-.5)[0];
    }).sort((a,b)=>(wrong[b.id]?.count||0)-(wrong[a.id]?.count||0)||Math.random()-.5).slice(0,n);
  }
  function start() {
    const types=[...state.selected];
    if(!types.length) return alert('請至少選一種測驗。');
    let pool=BANK.filter(x=>types.includes(x.type)&&state.lessons.has(x.lesson));
    // 單選某 Unit 的克漏字：只要前一組 20 題全對，就自動載入下一輪新題。
    if(types.length===1&&types[0]==='cloze'&&state.lessons.size===1){
      const lesson=[...state.lessons][0], round=getClozeRounds()[lesson]||0;
      if(round>0) pool=advancedCloze(lesson,round);
    }
    if(!pool.length) return alert('此篩選條件還沒有題目。');
    const target=Math.min(20,pool.length);
    const per=Math.floor(target/types.length), remainder=target%types.length;
    let qs=[];
    types.forEach((t,i)=>{
      const count=per+(i<remainder?1:0), typePool=pool.filter(x=>x.type===t);
      qs.push(...(t==='vocab'?chooseVocab(typePool,count):choose(typePool,count)));
    });
    if(qs.length<target){
      const usedWords=new Set(qs.filter(x=>x.type==='vocab').map(vocabWordId));
      const extras=choose(pool.filter(x=>!qs.some(y=>y.id===x.id)),pool.length);
      for(const item of extras){
        const word=vocabWordId(item);
        if(item.type==='vocab'&&usedWords.has(word)) continue;
        qs.push(item); if(item.type==='vocab')usedWords.add(word);
        if(qs.length===target) break;
      }
    }
    state.quiz=shuffle(qs).slice(0,target);
    const ids=state.quiz.map(item=>item.id);
    const recent=getHistory().filter(id=>!ids.includes(id)).concat(ids).slice(-160);
    saveHistory(recent);
    state.index=0; state.answers=[]; renderQuestion();
  }
  function clearQuestionTimer(){if(state.timerId){clearInterval(state.timerId);state.timerId=null;}}
  function clearAutoNext(){if(state.autoNextId){clearTimeout(state.autoNextId);state.autoNextId=null;}}
  function questionLimit(item){return item.type==='reading'?60:30;}
  function startQuestionTimer(item){
    clearQuestionTimer();
    const limit=questionLimit(item);
    state.questionStartedAt=Date.now();
    const update=()=>{
      const left=Math.max(0,Math.ceil((limit*1000-(Date.now()-state.questionStartedAt))/1000));
      const clock=document.getElementById('ps-timer');
      if(clock) clock.textContent=`⏱ ${left} 秒`;
      if(left<=0){
        clearQuestionTimer(); answer(-1,true);
        const timedOutIndex=state.index;
        clearAutoNext();
        state.autoNextId=setTimeout(()=>{
          state.autoNextId=null;
          if(state.index===timedOutIndex&&state.answers.length===timedOutIndex+1) next();
        },1000);
      }
    };
    update(); state.timerId=setInterval(update,200);
  }
  function renderQuestion() {
    const item=state.quiz[state.index];
    const typeLabel=TYPES[item.type];
    const limit=questionLimit(item);
    document.getElementById('ps-app').innerHTML=`<section class="ps-card ps-test"><header><button class="ps-back" onclick="PrivateSchool.home()">← 離開</button><span>私中專區 · ${typeLabel}</span><b>${state.index+1} / ${state.quiz.length}</b></header><div class="ps-progress"><i style="width:${(state.index/state.quiz.length)*100}%"></i></div>${item.passage?`<article class="ps-passage">${esc(item.passage)}</article>`:''}<div class="ps-qtype">${LESSONS[item.lesson]} · ${typeLabel}<b id="ps-timer" class="ps-timer">⏱ ${limit} 秒</b></div><div class="ps-question-row"><h2>${esc(item.stem)}</h2><button class="ps-speak" onclick="PrivateSchool.speakItem('${item.id}')" title="朗讀題目">🔊</button><button class="ps-stop-inline" onclick="PrivateSchool.stopSpeech()" title="停止朗讀">⏹ STOP</button></div><div class="ps-options">${item.opts.map((o,i)=>`<button onclick="PrivateSchool.answer(${i})"><b>${'ABCD'[i]}</b>${esc(o)}</button>`).join('')}</div><p class="ps-tip">字彙、文法、克漏字每題限時 30 秒；閱讀每題限時 60 秒。</p></section>`;
    startQuestionTimer(item);
  }
  function answer(choice,timedOut=false) {
    const item=state.quiz[state.index];
    if(!item||state.answers.length!==state.index) return;
    const limit=questionLimit(item);
    const elapsedSeconds=Math.min(limit,Math.max(0,Math.ceil((Date.now()-state.questionStartedAt)/1000)));
    clearQuestionTimer();
    const correct=!timedOut&&choice===item.answer;
    state.answers.push({id:item.id,choice,correct,elapsedSeconds,timedOut});
    const buttons=[...document.querySelectorAll('.ps-options button')];
    buttons.forEach((b,i)=>{b.disabled=true;if(i===item.answer)b.classList.add('ok');else if(i===choice)b.classList.add('bad');});
    const box=document.querySelector('.ps-test');
    box.insertAdjacentHTML('beforeend',`<div class="ps-explain ${correct?'good':'wrong'}"><strong>${timedOut?'時間到！這題算答錯。':correct?'答對了！':'這題要再練習'}</strong><br>${esc(item.explain)}<button onclick="PrivateSchool.next()">${state.index===state.quiz.length-1?'看成績':'下一題 →'}</button></div>`);
  }
  function next(){ clearQuestionTimer(); clearAutoNext(); if(++state.index>=state.quiz.length) finish(); else renderQuestion(); }
  function finish(){
    const wrong=getWrong(); let correct=0;
    state.answers.forEach(a=>{ if(a.correct){correct++; if(wrong[a.id]){wrong[a.id].count=Math.max(0,wrong[a.id].count-1); if(!wrong[a.id].count)delete wrong[a.id];}} else {const item=BANK.find(x=>x.id===a.id);wrong[a.id]={count:(wrong[a.id]?.count||0)+1,at:Date.now(),type:item.type};} }); saveWrong(wrong);
    const score=Math.round(correct/state.quiz.length*100), weak=Object.keys(wrong).length;
    document.getElementById('ps-app').innerHTML=`<section class="ps-card ps-result"><div class="ps-medal">${score>=90?'🏆':score>=70?'💪':'📚'}</div><h1>${score} 分</h1><p>答對 ${correct} / ${state.quiz.length} 題</p><h2>${score>=90?'達標！維持節奏，開始錯題複習。':score>=70?'快接近 90 分了，先把錯題練熟。':'先從常犯錯題庫開始，反覆練習最有效。'}</h2><div class="ps-summary">目前累積 <b>${weak}</b> 題常錯題；答對一次會降低它的出現權重。</div><button class="ps-primary" onclick="PrivateSchool.review()">常犯錯題庫</button><button class="ps-secondary" onclick="PrivateSchool.home()">回私中專區</button></section>`;
  }
  // 覆寫成「連對 5 次才畢業」的錯題規則；中途錯一次就重新累積。
  function finish(){
    const wrong=getWrong(), mastered=getMastered();
    let correct=0;
    state.answers.forEach(a=>{
      const item=BANK.find(x=>x.id===a.id);
      if(!item) return;
      if(a.correct){
        correct++;
        if(wrong[a.id]){
          wrong[a.id].streak=(wrong[a.id].streak||0)+1;
          if(wrong[a.id].streak>=5){
            mastered[a.id]={count:wrong[a.id].count||1, masteredAt:Date.now(), type:item.type, lesson:item.lesson};
            delete wrong[a.id];
          }
        }
      }else{
        const old=wrong[a.id]||mastered[a.id]||{};
        delete mastered[a.id];
        wrong[a.id]={count:(old.count||0)+1, streak:0, at:Date.now(), type:item.type, lesson:item.lesson};
      }
    });
    saveWrong(wrong); saveMastered(mastered);
    const score=Math.round(correct/state.quiz.length*100), weak=Object.keys(wrong).length, familiar=Object.keys(mastered).length;
    const totalSeconds=state.answers.reduce((sum,answer)=>sum+(answer.elapsedSeconds||0),0);
    const onlyOneClozeUnit=state.quiz.length===20&&state.quiz.every(item=>item.type==='cloze'&&item.lesson===state.quiz[0].lesson);
    if(score===100&&onlyOneClozeUnit){
      const rounds=getClozeRounds(), lesson=state.quiz[0].lesson;
      rounds[lesson]=(rounds[lesson]||0)+1;
      saveClozeRounds(rounds);
    }
    const completedAt=Date.now();
    const attempt={
      id:'a'+completedAt+'-'+Math.random().toString(36).slice(2,7), completedAt, score, totalSeconds,
      answers:state.answers.map(a=>{ const item=BANK.find(x=>x.id===a.id); return {...a,item:item?{...item,opts:[...item.opts]}:null}; })
    };
    // 保留最近一年的完整作答內容，方便日後點開複習；逾一年才會自動清除。
    saveAttempts([...getAttempts(),attempt]);
    document.getElementById('ps-app').innerHTML=`<section class="ps-card ps-result"><div class="ps-medal">${score>=90?'🏆':score>=70?'💪':'📚'}</div><h1>${score} 分</h1><p>答對 ${correct} / ${state.quiz.length} 題 · 總用時 ${durationLabel(totalSeconds)}</p><h2>${score>=90?'達標！維持節奏，開始錯題複習。':score>=70?'快接近 90 分了，先把錯題練熟。':'先從常犯錯題庫開始，反覆練習最有效。'}</h2><div class="ps-summary">目前有 <b>${weak}</b> 題常錯題、<b>${familiar}</b> 題已練熟題。常錯題要連續答對 5 次才會畢業。</div><button class="ps-primary" onclick="PrivateSchool.review()">常犯錯題庫</button><button class="ps-secondary" onclick="PrivateSchool.home()">回私中專區</button></section>`;
  }
  function review(){ const wrong=getWrong(), ids=Object.keys(wrong); if(!ids.length){alert('太棒了，目前沒有常犯錯題！');return;} state.quiz=shuffle(ids.map(id=>BANK.find(x=>x.id===id)).filter(Boolean)).slice(0,20);state.index=0;state.answers=[];renderQuestion(); }
  function reviewMastered(){
    const mastered=getMastered(), ids=Object.keys(mastered);
    if(!ids.length){alert('目前還沒有完成連續答對 5 次的題目。');return;}
    state.quiz=shuffle(ids.map(id=>BANK.find(x=>x.id===id)).filter(Boolean)).slice(0,20);
    state.index=0; state.answers=[]; renderQuestion();
  }
  function viewAttempt(id){
    const attempt=getAttempts().find(x=>x.id===id);
    if(!attempt) return alert('找不到這次考試紀錄。');
    const correct=attempt.answers.filter(x=>x.correct).length, wrong=attempt.answers.length-correct;
    document.getElementById('ps-app').innerHTML=`<section class="ps-card"><header><button class="ps-back" onclick="PrivateSchool.home()">← 回紀錄</button><span>當次考試複習</span><b>${timeLabel(attempt.completedAt)}</b></header><div class="ps-hero"><div>🧾</div><h1>${attempt.score} 分</h1><p>答對 ${correct} 題 · 答錯 ${wrong} 題 · 總用時 ${durationLabel(attemptDuration(attempt))}</p></div>${wrong?`<button class="ps-primary" style="width:100%;margin-bottom:8px" onclick="PrivateSchool.reviewAttemptWrong('${attempt.id}')">🎯 重新練習這次的 ${wrong} 題錯題</button>`:'<p class="ps-note">這次全對，沒有需要重練的錯題。</p>'}${attempt.answers.map((answer,i)=>{const item=answer.item||BANK.find(x=>x.id===answer.id); if(!item)return ''; const picked=typeof answer.choice==='number'?answer.choice:-1; const chosen=answer.selectedText||item.opts[picked]||'未記錄'; const right=answer.correctText||item.opts[item.answer]; return `<article class="ps-practice ${answer.correct?'ps-attempt-ok':'ps-attempt-bad'}"><div class="ps-qtype">${i+1}. ${LESSONS[item.lesson]} · ${TYPES[item.type]} · ${answer.correct?'✅ 答對':'❌ 答錯'}${typeof answer.elapsedSeconds==='number'?` · 用時 ${durationLabel(answer.elapsedSeconds)}`:''}</div>${item.passage?`<div class="ps-passage">${esc(item.passage)}</div>`:''}<div class="ps-question-row"><h2>${esc(item.stem)}</h2><button class="ps-speak" onclick="PrivateSchool.speakItem('${item.id}')" title="朗讀題目">🔊</button></div><ol>${item.opts.map((o,n)=>`<li class="${o===right?'ps-correct-choice':''}">${'ABCD'[n]}. ${esc(o)}</li>`).join('')}</ol><div class="ps-answer-box"><b>你的答案：${esc(chosen)}</b><br><b>正確答案：${esc(right)}</b><br>${esc(item.explain)}</div></article>`;}).join('')}</section>`;
  }
  function reviewAttemptWrong(id){
    const attempt=getAttempts().find(x=>x.id===id);
    if(!attempt) return alert('找不到這次考試紀錄。');
    const items=attempt.answers.filter(x=>!x.correct).map(x=>BANK.find(item=>item.id===x.id)).filter(Boolean);
    if(!items.length) return alert('這次考試沒有錯題，太棒了！');
    state.quiz=items; state.index=0; state.answers=[]; renderQuestion();
  }
  function viewAttemptHistory(){
    const attempts=getAttempts().sort((a,b)=>b.completedAt-a.completedAt);
    const list=attempts.length ? attempts.map(x=>{const wrong=x.answers.filter(a=>!a.correct).length; const day=new Intl.DateTimeFormat('zh-TW',{month:'numeric',day:'numeric'}).format(new Date(x.completedAt)); return `<button class="ps-attempt-row" onclick="PrivateSchool.viewAttempt('${x.id}')"><span><b>${day} ${timeLabel(x.completedAt)}</b><small>${x.answers.length} 題 · 對 ${x.answers.length-wrong}／錯 ${wrong} · ${durationLabel(attemptDuration(x))}</small></span><strong>${x.score} 分　›</strong></button>`;}).join('') : '<p class="ps-note">近一年尚無完成的測驗紀錄。</p>';
    document.getElementById('ps-app').innerHTML=`<section class="ps-card"><header><button class="ps-back" onclick="PrivateSchool.home()">← 回設定</button><span>近一年考試紀錄</span><b>${attempts.length} 次</b></header><div class="ps-hero"><div>📅</div><h1>歷史考試紀錄</h1><p>保留最近一年；點選可查看全部題目、對錯與正解。</p></div>${list}</section>`;
  }
  function setStopVisible(visible){const button=document.getElementById('ps-stop-speech');if(button)button.hidden=!visible;}
  function stopSpeech(){speechRun++;if('speechSynthesis' in window)speechSynthesis.cancel();setStopVisible(false);}
  function speakItem(id,mode='question'){
    const item=BANK.find(x=>x.id===id);
    if(!item||!('speechSynthesis' in window)) return;
    const run=++speechRun;
    speechSynthesis.cancel();
    setStopVisible(true);
    // 題幹中任何常見括號內的英文（如 [aunt]、(aunt)、（aunt））都只念該英文；其他題目會連同 A～D 選項朗讀。
    const bracketedEnglish=mode==='question'&&Array.from(item.stem.matchAll(/[\[［(（{｛<＜〈《「『]\s*([A-Za-z][A-Za-z' -]*)\s*[\]］)）}｝>＞〉》」』]/g)).map(match=>match[1]).find(Boolean);
    const optionBreak='§§§', optionLabelBreak='¤¤¤';
    const rawText=mode==='explanation'
      ? `正確答案：${item.opts[item.answer]}。解析：${item.explain}`
      // 以發音拼寫送進語音引擎，避免某些瀏覽器把單獨字母念成「capital A」；畫面仍維持大寫 A～D。
      : bracketedEnglish || `${item.passage?item.passage+' ':''}${item.stem}${optionBreak}${item.opts.map((option,index)=>`${['ay','bee','see','dee'][index]}${optionLabelBreak}${option}`).join(optionBreak)}`;
    // 部分語音會把標點讀成名稱；朗讀時略過問號與句號。
    const text=rawText.replace(/[?？.。]/g,'');
    const voices=speechSynthesis.getVoices();
    // 優先年輕、有活力的美式女聲；Windows 的 Natural／Online 聲音通常最清楚。
    const englishVoice = voices.find(v => /en[-_]US/i.test(v.lang) && /(Microsoft.*(Jenny|Ava|Aria).*?(Natural|Online)|Microsoft.*(Natural|Online).*?(Jenny|Ava|Aria))/i.test(v.name))
      || voices.find(v => /en[-_]US/i.test(v.lang) && /(Jenny|Ava|Aria|Zira|Samantha|Google US English)/i.test(v.name))
      || voices.find(v => /en[-_]US/i.test(v.lang) && /Microsoft/i.test(v.name))
      || voices.find(v => /en[-_]US/i.test(v.lang));
    const chineseVoice = voices.find(v => /zh[-_]TW/i.test(v.lang) && /Microsoft.*(HsiaoYu|HanHan|YunJhe).*?(Natural|Online)|Microsoft.*(Natural|Online).*?(HsiaoYu|HanHan|YunJhe)/i.test(v.name))
      || voices.find(v => /zh[-_]TW/i.test(v.lang) && /Microsoft|Google/i.test(v.name))
      || voices.find(v => /zh[-_]TW/i.test(v.lang));
    const splitLanguages=section=>(section.match(/[\u3400-\u9fff，。！？、；：「」『』（）]+|[^\u3400-\u9fff，。！？、；：「」『』（）]+/g)||[]).filter(part=>part.trim());
    const sections=bracketedEnglish?[text]:text.split(optionBreak);
    const parts=sections.flatMap((section,index)=>{
      if(mode!=='question'||index===0) return splitLanguages(section);
      const [label,...contentParts]=section.split(optionLabelBreak);
      const content=contentParts.join(optionLabelBreak);
      return [`__choice__${label}`,'__choice_label_pause__',...splitLanguages(content).map(part=>`__choice__${part}`),...(index<sections.length-1?['__option_pause__']:[])];
    });
    let index=0;
    const speakNext=()=>{
      if(run!==speechRun) return;
      if(index>=parts.length){setStopVisible(false);return;}
      let part=parts[index++];
      if(part==='__choice_label_pause__'){setTimeout(speakNext,300);return;}
      if(part==='__option_pause__'){setTimeout(speakNext,650);return;}
      const isChoice=part.startsWith('__choice__');
      if(isChoice) part=part.slice('__choice__'.length);
      const isChinese=/[\u3400-\u9fff]/.test(part);
      const voice=new SpeechSynthesisUtterance(part);
      voice.lang=isChinese?'zh-TW':'en-US';
      if(isChinese && chineseVoice) voice.voice=chineseVoice;
      if(!isChinese && englishVoice) voice.voice=englishVoice;
      // 選項以較慢、清楚的英聽節奏朗讀；volume=1 是 Web Speech 可設定的最大音量。
      voice.rate=isChoice?(isChinese?.86:.72):(isChinese?.92:.84);
      voice.pitch=isChoice?(isChinese?1.02:1.06):(isChinese?1.04:1.12);
      voice.volume=1;
      voice.onend=()=>{if(run===speechRun)speakNext();};
      voice.onerror=()=>{if(run===speechRun)speakNext();};
      speechSynthesis.speak(voice);
    };
    speakNext();
  }
  function practice(){
    const items=BANK.filter(x=>state.selected.has(x.type)&&state.lessons.has(x.lesson));
    document.getElementById('ps-app').innerHTML=`<section class="ps-card"><header><button class="ps-back" onclick="PrivateSchool.home()">← 回設定</button><span>私中專區 · 練習</span><b>${items.length} 題</b></header><div class="ps-hero"><div>📖</div><h1>範圍練習</h1><p>查看所選 Unit 的題目、選項與解析；按 🔊 可聽題目或答案解析。</p></div>${items.map((item,i)=>`<article class="ps-practice"><div class="ps-qtype">${i+1}. ${LESSONS[item.lesson]} · ${TYPES[item.type]}</div>${item.passage?`<div class="ps-passage">${esc(item.passage)}</div>`:''}<div class="ps-question-row"><h2>${esc(item.stem)}</h2><button class="ps-speak" onclick="PrivateSchool.speakItem('${item.id}')" title="朗讀題目">🔊</button></div><ol>${item.opts.map(o=>`<li>${esc(o)}</li>`).join('')}</ol><button class="ps-answer" onclick="PrivateSchool.toggleAnswer('${item.id}')">顯示答案與解析</button><div id="ps-a-${item.id}" class="ps-answer-box" hidden><b>答案：${'ABCD'[item.answer]}. ${esc(item.opts[item.answer])}</b><br>${esc(item.explain)}<button class="ps-answer-speak" onclick="PrivateSchool.speakExplanation('${item.id}')">🔊 朗讀答案與解析</button></div></article>`).join('')||'<p>請先選擇至少一種測驗與一個 Unit。</p>'}</section>`;
  }
  function toggleAnswer(id){const el=document.getElementById('ps-a-'+id);if(el)el.hidden=!el.hidden;}
  function home(){
    clearQuestionTimer(); clearAutoNext();
    const wrong=getWrong(), weak=Object.keys(wrong).length;
    document.getElementById('ps-app').innerHTML=`<section class="ps-card"><header><button class="ps-back" onclick="PrivateSchool.close()">← 回首頁</button><span>嘉駿的私中專區</span><b>目標 90+</b></header><div class="ps-hero"><div>🎯</div><h1>私中入學英語衝刺</h1><p>六課題庫 · 不重複出題 · 針對錯題反覆加強</p></div><div class="ps-mode"><button class="${state.mode==='test'?'active':''}" onclick="PrivateSchool.setMode('test')">📝 直接考試</button><button class="${state.mode==='practice'?'active':''}" onclick="PrivateSchool.setMode('practice')">📖 範圍練習</button></div><h3>選擇測驗類型（可複選）</h3><div class="ps-types">${Object.entries(TYPES).map(([id,label])=>`<label class="${state.selected.has(id)?'chosen':''}"><input type="checkbox" ${state.selected.has(id)?'checked':''} onchange="PrivateSchool.type('${id}',this.checked)"><span>${({vocab:'🗂️',grammar:'🧩',cloze:'✍️',reading:'📖'})[id]}</span>${label}</label>`).join('')}</div><h3>選擇範圍</h3><div class="ps-lessons"><button class="${state.lessons.size===6?'active':''}" onclick="PrivateSchool.allLessons()">全部 Unit 1–6</button>${LESSONS.map((x,i)=>`<label class="${state.lessons.has(i)?'chosen':''}"><input type="checkbox" ${state.lessons.has(i)?'checked':''} onchange="PrivateSchool.lesson(${i},this.checked)">${x}</label>`).join('')}</div><div class="ps-ready"><span>${state.mode==='test'?'最多 ':'查看 '}<b>${state.mode==='test'?'20 題':'所選題目'}</b><small>${state.mode==='test'?'題庫不足 20 題時，會減少題數，絕不重複。':'可顯示答案、解析與英文朗讀。'}</small></span><button class="ps-primary" onclick="PrivateSchool.${state.mode==='test'?'start()':'practice()'}">${state.mode==='test'?'開始測驗':'開始練習'}</button></div><button class="ps-weak" onclick="PrivateSchool.review()">🔥 常犯錯題庫 <b>${weak}</b> 題</button><p class="ps-note">題庫依 Unit 1–6 的家庭、飲食、校園、日常、休閒、交通內容整理；Unit 7–12 加入後可直接擴充。</p></section>`;
  }
  const renderHome=home;
  home=function(){ renderHome(); renderLeaderboard(); renderTodayAttempts(); };
  function renderLeaderboard(){
    const anchor=document.querySelector('#ps-app .ps-note');
    if(!anchor) return;
    const wrong=getWrong();
    const rows=Object.entries(wrong)
      .map(([id,record])=>({id,record,item:BANK.find(x=>x.id===id)}))
      .filter(x=>x.item&&state.selected.has(x.item.type)&&state.lessons.has(x.item.lesson))
      .sort((a,b)=>(b.record.count||0)-(a.record.count||0)||(b.record.at||0)-(a.record.at||0))
      .slice(0,10);
    const masteredCount=Object.values(getMastered()).filter(record=>state.selected.has(record.type)&&state.lessons.has(record.lesson)).length;
    const list=rows.length
      ? `<ol style="margin:8px 0 0;padding-left:22px;line-height:1.7">${rows.map(x=>`<li><b>${x.record.count||1} 次</b> · ${esc(x.item.stem)} <small>連對 ${x.record.streak||0}/5</small></li>`).join('')}</ol>`
      : '<p style="margin:8px 0 0">目前這個範圍尚無錯題紀錄。</p>';
    anchor.insertAdjacentHTML('afterend',`<section style="margin-top:14px;padding:14px;border:1px solid #fed7aa;border-radius:14px;background:#fffaf5;color:#7c2d12"><b>🔥 本範圍最常犯錯題庫 TOP 10</b>${list}<p style="margin:12px 0 8px;font-size:.82rem">連續答對同一題 5 次，才會移到「已練習熟悉」題庫。</p><button class="ps-answer" onclick="PrivateSchool.reviewMastered()">✅ 已練習熟悉（曾經常錯） ${masteredCount} 題</button></section>`);
  }
  function renderTodayAttempts(){
    const anchor=document.querySelector('#ps-app .ps-note');
    if(!anchor) return;
    const attempts=getAttempts().filter(x=>sameLocalDay(x.completedAt)).sort((a,b)=>b.completedAt-a.completedAt);
    const list=attempts.length
      ? attempts.map(x=>{const wrong=x.answers.filter(a=>!a.correct).length; return `<button class="ps-attempt-row" onclick="PrivateSchool.viewAttempt('${x.id}')"><span><b>${timeLabel(x.completedAt)}</b><small> ${x.answers.length} 題 · 對 ${x.answers.length-wrong}／錯 ${wrong} · ${durationLabel(attemptDuration(x))}</small></span><strong>${x.score} 分　›</strong></button>`;}).join('')
      : '<p style="margin:8px 0 0">今天尚未完成測驗；完成後會自動出現在這裡。</p>';
    const allCount=getAttempts().length;
    anchor.insertAdjacentHTML('afterend',`<section class="ps-attempts"><b>🗓️ 今日考試紀錄</b><p>點選任一時段可查看當次所有對題、錯題與正解。</p>${list}<button class="ps-answer" style="margin-top:10px" onclick="PrivateSchool.viewAttemptHistory()">📅 近一年全部紀錄（${allCount} 次）</button></section>`);
  }
  function open(){document.getElementById('ps-overlay').classList.add('open');home();}
  function close(){clearQuestionTimer();clearAutoNext();stopSpeech();document.getElementById('ps-overlay').classList.remove('open');}
  window.PrivateSchool={open,close,home,start,answer,next,review,reviewMastered,viewAttempt,reviewAttemptWrong,viewAttemptHistory,practice,speakItem,speakExplanation:id=>speakItem(id,'explanation'),stopSpeech,toggleAnswer,setMode:m=>{state.mode=m;home();},type:(x,on)=>{on?state.selected.add(x):state.selected.delete(x);home();},lesson:(x,on)=>{on?state.lessons.add(x):state.lessons.delete(x);home();},allLessons:()=>{state.lessons=new Set([0,1,2,3,4,5]);home();}};
  const style=`<style>
  #ps-overlay{position:fixed;inset:0;z-index:9999;background:linear-gradient(135deg,#172554,#4f46e5);padding:18px;overflow:auto;display:none;font-family:Segoe UI,'Microsoft JhengHei',sans-serif}#ps-overlay.open{display:block}.ps-card{max-width:720px;margin:0 auto 20px;background:#fff;border-radius:24px;padding:22px;box-shadow:0 20px 70px #0006}.ps-card header{display:flex;justify-content:space-between;align-items:center;color:#4338ca;font-weight:800;gap:8px}.ps-back{border:0;background:#eef2ff;color:#4338ca;border-radius:10px;padding:8px 10px;font-weight:700;cursor:pointer}.ps-hero{text-align:center;padding:18px 4px}.ps-hero div{font-size:3rem}.ps-hero h1{margin:6px 0;color:#1e1b4b}.ps-hero p,.ps-note,.ps-tip{color:#64748b;font-size:.85rem;line-height:1.5}.ps-card h3{font-size:.9rem;color:#475569;margin:18px 0 8px}.ps-types{display:grid;grid-template-columns:1fr 1fr;gap:9px}.ps-types label,.ps-lessons label{border:2px solid #e2e8f0;border-radius:12px;padding:11px;cursor:pointer;font-weight:700;color:#334155}.ps-types label.chosen,.ps-lessons label.chosen{border-color:#6366f1;background:#eef2ff;color:#3730a3}.ps-types input,.ps-lessons input{display:none}.ps-types span{margin-right:6px}.ps-lessons{display:flex;flex-wrap:wrap;gap:7px}.ps-lessons button{width:100%;border:0;border-radius:10px;padding:9px;background:#f1f5f9;color:#475569;font-weight:700;cursor:pointer}.ps-lessons button.active{background:#312e81;color:#fff}.ps-lessons label{font-size:.8rem;padding:8px}.ps-ready{display:flex;justify-content:space-between;align-items:center;margin-top:20px;background:#f8fafc;padding:13px;border-radius:14px;color:#334155}.ps-ready small{display:block;color:#64748b;font-size:.72rem;margin-top:3px}.ps-primary,.ps-secondary,.ps-weak{border:0;border-radius:12px;padding:12px 18px;font-weight:800;cursor:pointer}.ps-primary{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff}.ps-secondary{background:#e2e8f0;color:#334155;margin-left:8px}.ps-weak{width:100%;margin-top:10px;background:#fff7ed;color:#c2410c;border:1px solid #fed7aa}.ps-mode{display:flex;gap:8px;margin:8px 0 18px}.ps-mode button{flex:1;border:2px solid #e2e8f0;border-radius:11px;padding:10px;background:#fff;color:#475569;font-weight:800;cursor:pointer}.ps-mode button.active{background:#4338ca;color:#fff;border-color:#4338ca}.ps-qtype{font-size:.76rem;color:#6366f1;font-weight:800;margin-top:18px}.ps-test h2,.ps-practice h2{font-size:1.2rem;line-height:1.5;color:#1e293b;margin:8px 0}.ps-question-row{display:flex;align-items:flex-start;gap:10px}.ps-question-row h2{flex:1}.ps-speak{flex:0 0 auto;border:0;background:#eef2ff;color:#4338ca;border-radius:10px;padding:8px;cursor:pointer;font-size:1.1rem}.ps-progress{height:7px;background:#e2e8f0;border-radius:8px;margin:14px 0}.ps-progress i{display:block;height:100%;background:#6366f1;border-radius:8px}.ps-passage{background:#f8fafc;border-left:4px solid #818cf8;padding:13px;line-height:1.7;color:#334155;font-size:.93rem}.ps-options{display:grid;gap:9px}.ps-options button{display:flex;text-align:left;align-items:center;gap:9px;border:2px solid #e2e8f0;background:#fff;border-radius:12px;padding:12px;cursor:pointer;font-size:.95rem}.ps-options button:hover{border-color:#818cf8}.ps-options b{background:#eef2ff;color:#4338ca;border-radius:7px;padding:3px 7px}.ps-options .ok{border-color:#22c55e;background:#f0fdf4}.ps-options .bad{border-color:#ef4444;background:#fef2f2}.ps-explain{margin-top:14px;padding:13px;border-radius:12px;line-height:1.55}.ps-explain.good{background:#f0fdf4;color:#166534}.ps-explain.wrong{background:#fff7ed;color:#9a3412}.ps-explain button{display:block;margin-top:9px;margin-left:auto;border:0;border-radius:9px;padding:8px 12px;background:#4338ca;color:#fff;font-weight:700;cursor:pointer}.ps-practice{border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin:12px 0}.ps-practice ol{padding-left:24px;color:#475569;line-height:1.65}.ps-answer{border:0;border-radius:9px;padding:8px 11px;background:#eef2ff;color:#4338ca;font-weight:700;cursor:pointer}.ps-answer-box{margin-top:9px;padding:10px;border-radius:9px;background:#f0fdf4;color:#166534;line-height:1.55}.ps-answer-speak{display:block;margin-top:9px;border:0;border-radius:8px;padding:7px 10px;background:#dcfce7;color:#166534;font-weight:800;cursor:pointer}.ps-attempt-ok{border-color:#86efac}.ps-attempt-bad{border-color:#fca5a5;background:#fffafa}.ps-correct-choice{font-weight:800;color:#15803d}.ps-attempts{margin-top:14px;padding:14px;border:1px solid #c7d2fe;border-radius:14px;background:#f8faff;color:#312e81}.ps-attempts p{margin:7px 0;font-size:.82rem;color:#64748b}.ps-attempt-row{display:flex;justify-content:space-between;align-items:center;width:100%;margin-top:8px;padding:10px;border:1px solid #dbeafe;border-radius:10px;background:#fff;color:#312e81;text-align:left;cursor:pointer}.ps-attempt-row small{display:block;margin-top:3px;color:#64748b}.ps-result{text-align:center;padding:40px 24px}.ps-result h1{font-size:3.2rem;color:#4f46e5;margin:4px}.ps-result h2{font-size:1.1rem;color:#334155}.ps-medal{font-size:4rem}.ps-summary{margin:18px 0;padding:12px;border-radius:12px;background:#fff7ed;color:#9a3412}.private-zone{margin:14px 0;background:linear-gradient(135deg,#1e1b4b,#4f46e5);border-radius:16px;padding:14px;color:#fff;box-shadow:0 8px 20px #4338ca40}.private-zone div{font-weight:800;font-size:1rem}.private-zone p{font-size:.75rem;margin:4px 0 10px;color:#e0e7ff}.private-zone button{width:100%;border:0;border-radius:10px;padding:10px;background:#fff;color:#3730a3;font-weight:800;cursor:pointer}@media(max-width:480px){#ps-overlay{padding:9px}.ps-card{padding:16px;border-radius:18px}.ps-types{grid-template-columns:1fr}.ps-ready{align-items:flex-start;gap:12px}.ps-ready .ps-primary{white-space:nowrap}}
  #ps-stop-speech{position:fixed;right:22px;bottom:22px;z-index:10001;border:0;border-radius:999px;padding:12px 16px;background:#dc2626;color:#fff;font-weight:900;box-shadow:0 6px 18px #7f1d1d88;cursor:pointer;font-size:.9rem}
  .ps-timer{float:right;background:#fff7ed;color:#c2410c;border-radius:999px;padding:4px 8px;font-size:.78rem}
  .ps-stop-inline{flex:0 0 auto;border:0;border-radius:10px;padding:8px 10px;background:#dc2626;color:#fff;font-weight:900;cursor:pointer;font-size:.75rem}
  </style>`;
  document.body.insertAdjacentHTML('beforeend',style+'<div id="ps-overlay"><button id="ps-stop-speech" hidden onclick="PrivateSchool.stopSpeech()">⏹ STOP 停止朗讀</button><main id="ps-app"></main></div>');
  // 私中入口由首頁的兩大專區版面提供，不再插入國小專區的設定頁。
})();
