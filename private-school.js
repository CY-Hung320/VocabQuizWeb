/* 私中專區：Unit 1–6 題庫與自適應錯題複習 */
(() => {
  'use strict';
  const KEY = 'private_school_wrong_v1';
  const MASTERED_KEY = 'private_school_mastered_v1';
  const HISTORY_KEY = 'private_school_recent_questions_v1';
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

  // 每個 Unit 至少 20 題：原題不足的部分，以該單元字彙設計不同的補充克漏字題。
  for(let lesson=0;lesson<LESSONS.length;lesson++){
    const words=vocabWords.filter(w=>w[2]===lesson);
    const existing=cloze.filter(item=>item.lesson===lesson).length;
    const patterns=[
      w=>`The English word for “${w[1]}” is ___.`,
      w=>`Choose the word that means “${w[1]}”: ___.`,
      w=>`In Unit ${lesson+1}, ___ means “${w[1]}”.`,
      w=>`Please fill in the blank: ___ = “${w[1]}”.`,
      w=>`The correct vocabulary word is ___ (${w[1]}).`
    ];
    for(let i=existing;i<20;i++){
      const word=words[(i-existing)%words.length];
      const other=words.filter(w=>w[0]!==word[0]).map(w=>w[0]);
      const options=[word[0],...Array.from({length:3},(_,j)=>other[(i+j)%other.length])];
      cloze.push(q(`cx-${lesson}-${i}`,'cloze',lesson,patterns[(i-existing)%patterns.length](word),options,0,`${word[0]} = ${word[1]}。`));
    }
  }

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
  let state = { selected:new Set(['vocab']), lessons:new Set([0]), quiz:[], index:0, answers:[], mode:'test' };
  const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const getWrong = () => { try { return JSON.parse(localStorage.getItem(KEY)||'{}'); } catch { return {}; } };
  const saveWrong = x => localStorage.setItem(KEY,JSON.stringify(x));
  const getMastered = () => { try { return JSON.parse(localStorage.getItem(MASTERED_KEY)||'{}'); } catch { return {}; } };
  const saveMastered = x => localStorage.setItem(MASTERED_KEY,JSON.stringify(x));
  const getHistory = () => { try { const x=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]'); return Array.isArray(x)?x:[]; } catch { return []; } };
  const saveHistory = x => localStorage.setItem(HISTORY_KEY,JSON.stringify(x));
  const shuffle = a => [...a].sort(()=>Math.random()-.5);
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
  function start() {
    const types=[...state.selected];
    if(!types.length) return alert('請至少選一種測驗。');
    const pool=BANK.filter(x=>types.includes(x.type)&&state.lessons.has(x.lesson));
    if(!pool.length) return alert('此篩選條件還沒有題目。');
    const target=Math.min(20,pool.length);
    const per=Math.floor(target/types.length), remainder=target%types.length;
    let qs=[];
    types.forEach((t,i)=>qs.push(...choose(pool.filter(x=>x.type===t),per+(i<remainder?1:0))));
    if(qs.length<target) qs.push(...choose(pool.filter(x=>!qs.some(y=>y.id===x.id)),target-qs.length));
    state.quiz=shuffle(qs).slice(0,target);
    const ids=state.quiz.map(item=>item.id);
    const recent=getHistory().filter(id=>!ids.includes(id)).concat(ids).slice(-160);
    saveHistory(recent);
    state.index=0; state.answers=[]; renderQuestion();
  }
  function renderQuestion() {
    const item=state.quiz[state.index];
    const typeLabel=TYPES[item.type];
    document.getElementById('ps-app').innerHTML=`<section class="ps-card ps-test"><header><button class="ps-back" onclick="PrivateSchool.home()">← 離開</button><span>私中專區 · ${typeLabel}</span><b>${state.index+1} / ${state.quiz.length}</b></header><div class="ps-progress"><i style="width:${(state.index/state.quiz.length)*100}%"></i></div>${item.passage?`<article class="ps-passage">${esc(item.passage)}</article>`:''}<div class="ps-qtype">${LESSONS[item.lesson]} · ${typeLabel}</div><div class="ps-question-row"><h2>${esc(item.stem)}</h2><button class="ps-speak" onclick="PrivateSchool.speakItem('${item.id}')" title="朗讀題目">🔊</button></div><div class="ps-options">${item.opts.map((o,i)=>`<button onclick="PrivateSchool.answer(${i})"><b>${'ABCD'[i]}</b>${esc(o)}</button>`).join('')}</div><p class="ps-tip">答錯會自動收入「常犯錯題庫」，下次優先複習。</p></section>`;
  }
  function answer(choice) {
    const item=state.quiz[state.index], correct=choice===item.answer;
    state.answers.push({id:item.id,correct});
    const buttons=[...document.querySelectorAll('.ps-options button')];
    buttons.forEach((b,i)=>{b.disabled=true;if(i===item.answer)b.classList.add('ok');else if(i===choice)b.classList.add('bad');});
    const box=document.querySelector('.ps-test');
    box.insertAdjacentHTML('beforeend',`<div class="ps-explain ${correct?'good':'wrong'}"><strong>${correct?'答對了！':'這題要再練習'}</strong><br>${esc(item.explain)}<button onclick="PrivateSchool.next()">${state.index===state.quiz.length-1?'看成績':'下一題 →'}</button></div>`);
  }
  function next(){ if(++state.index>=state.quiz.length) finish(); else renderQuestion(); }
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
    document.getElementById('ps-app').innerHTML=`<section class="ps-card ps-result"><div class="ps-medal">${score>=90?'🏆':score>=70?'💪':'📚'}</div><h1>${score} 分</h1><p>答對 ${correct} / ${state.quiz.length} 題</p><h2>${score>=90?'達標！維持節奏，開始錯題複習。':score>=70?'快接近 90 分了，先把錯題練熟。':'先從常犯錯題庫開始，反覆練習最有效。'}</h2><div class="ps-summary">目前有 <b>${weak}</b> 題常錯題、<b>${familiar}</b> 題已練熟題。常錯題要連續答對 5 次才會畢業。</div><button class="ps-primary" onclick="PrivateSchool.review()">常犯錯題庫</button><button class="ps-secondary" onclick="PrivateSchool.home()">回私中專區</button></section>`;
  }
  function review(){ const wrong=getWrong(), ids=Object.keys(wrong); if(!ids.length){alert('太棒了，目前沒有常犯錯題！');return;} state.quiz=shuffle(ids.map(id=>BANK.find(x=>x.id===id)).filter(Boolean)).slice(0,20);state.index=0;state.answers=[];renderQuestion(); }
  function reviewMastered(){
    const mastered=getMastered(), ids=Object.keys(mastered);
    if(!ids.length){alert('目前還沒有完成連續答對 5 次的題目。');return;}
    state.quiz=shuffle(ids.map(id=>BANK.find(x=>x.id===id)).filter(Boolean)).slice(0,20);
    state.index=0; state.answers=[]; renderQuestion();
  }
  function speakItem(id){
    const item=BANK.find(x=>x.id===id);
    if(!item||!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    // 字彙題只念英文單字本身；其他類型保留朗讀文章、題幹與選項。
    const wordIndex=item.type==='vocab' ? Number(id.slice(1)) : -1;
    const text=item.type==='vocab' && vocabWords[wordIndex]
      ? vocabWords[wordIndex][0]
      : (item.passage?item.passage+' ': '')+item.stem+'. '+item.opts.join(', ');
    const voice=new SpeechSynthesisUtterance(text);
    const voices=speechSynthesis.getVoices();
    // 優先年輕、有活力的美式女聲；Windows 的 Natural／Online 聲音通常最清楚。
    const preferred = voices.find(v => /en[-_]US/i.test(v.lang) && /Microsoft.*(Jenny|Ava|Aria).*?(Natural|Online)|Microsoft.*(Natural|Online).*?(Jenny|Ava|Aria)/i.test(v.name))
      || voices.find(v => /en[-_]US/i.test(v.lang) && /(Jenny|Ava|Aria|Zira|Samantha|Google US English)/i.test(v.name))
      || voices.find(v => /en[-_]US/i.test(v.lang) && /Microsoft/i.test(v.name))
      || voices.find(v => /en[-_]US/i.test(v.lang));
    if(preferred) voice.voice=preferred;
    voice.lang='en-US';
    voice.rate=item.type==='vocab' ? .76 : .84;
    voice.pitch=1.12;
    voice.volume=1;
    speechSynthesis.speak(voice);
  }
  function practice(){
    const items=BANK.filter(x=>state.selected.has(x.type)&&state.lessons.has(x.lesson));
    document.getElementById('ps-app').innerHTML=`<section class="ps-card"><header><button class="ps-back" onclick="PrivateSchool.home()">← 回設定</button><span>私中專區 · 練習</span><b>${items.length} 題</b></header><div class="ps-hero"><div>📖</div><h1>範圍練習</h1><p>查看所選 Unit 的題目、選項與解析；按 🔊 可聽英文題目。</p></div>${items.map((item,i)=>`<article class="ps-practice"><div class="ps-qtype">${i+1}. ${LESSONS[item.lesson]} · ${TYPES[item.type]}</div>${item.passage?`<div class="ps-passage">${esc(item.passage)}</div>`:''}<div class="ps-question-row"><h2>${esc(item.stem)}</h2><button class="ps-speak" onclick="PrivateSchool.speakItem('${item.id}')" title="朗讀題目">🔊</button></div><ol>${item.opts.map(o=>`<li>${esc(o)}</li>`).join('')}</ol><button class="ps-answer" onclick="PrivateSchool.toggleAnswer('${item.id}')">顯示答案與解析</button><div id="ps-a-${item.id}" class="ps-answer-box" hidden><b>答案：${'ABCD'[item.answer]}. ${esc(item.opts[item.answer])}</b><br>${esc(item.explain)}</div></article>`).join('')||'<p>請先選擇至少一種測驗與一個 Unit。</p>'}</section>`;
  }
  function toggleAnswer(id){const el=document.getElementById('ps-a-'+id);if(el)el.hidden=!el.hidden;}
  function home(){
    const wrong=getWrong(), weak=Object.keys(wrong).length;
    document.getElementById('ps-app').innerHTML=`<section class="ps-card"><header><button class="ps-back" onclick="PrivateSchool.close()">← 回首頁</button><span>嘉駿的私中專區</span><b>目標 90+</b></header><div class="ps-hero"><div>🎯</div><h1>私中入學英語衝刺</h1><p>六課題庫 · 不重複出題 · 針對錯題反覆加強</p></div><div class="ps-mode"><button class="${state.mode==='test'?'active':''}" onclick="PrivateSchool.setMode('test')">📝 直接考試</button><button class="${state.mode==='practice'?'active':''}" onclick="PrivateSchool.setMode('practice')">📖 範圍練習</button></div><h3>選擇測驗類型（可複選）</h3><div class="ps-types">${Object.entries(TYPES).map(([id,label])=>`<label class="${state.selected.has(id)?'chosen':''}"><input type="checkbox" ${state.selected.has(id)?'checked':''} onchange="PrivateSchool.type('${id}',this.checked)"><span>${({vocab:'🗂️',grammar:'🧩',cloze:'✍️',reading:'📖'})[id]}</span>${label}</label>`).join('')}</div><h3>選擇範圍</h3><div class="ps-lessons"><button class="${state.lessons.size===6?'active':''}" onclick="PrivateSchool.allLessons()">全部 Unit 1–6</button>${LESSONS.map((x,i)=>`<label class="${state.lessons.has(i)?'chosen':''}"><input type="checkbox" ${state.lessons.has(i)?'checked':''} onchange="PrivateSchool.lesson(${i},this.checked)">${x}</label>`).join('')}</div><div class="ps-ready"><span>${state.mode==='test'?'最多 ':'查看 '}<b>${state.mode==='test'?'20 題':'所選題目'}</b><small>${state.mode==='test'?'題庫不足 20 題時，會減少題數，絕不重複。':'可顯示答案、解析與英文朗讀。'}</small></span><button class="ps-primary" onclick="PrivateSchool.${state.mode==='test'?'start()':'practice()'}">${state.mode==='test'?'開始測驗':'開始練習'}</button></div><button class="ps-weak" onclick="PrivateSchool.review()">🔥 常犯錯題庫 <b>${weak}</b> 題</button><p class="ps-note">題庫依 Unit 1–6 的家庭、飲食、校園、日常、休閒、交通內容整理；Unit 7–12 加入後可直接擴充。</p></section>`;
  }
  const renderHome=home;
  home=function(){ renderHome(); renderLeaderboard(); };
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
  function open(){document.getElementById('ps-overlay').classList.add('open');home();}
  function close(){document.getElementById('ps-overlay').classList.remove('open');}
  window.PrivateSchool={open,close,home,start,answer,next,review,reviewMastered,practice,speakItem,toggleAnswer,setMode:m=>{state.mode=m;home();},type:(x,on)=>{on?state.selected.add(x):state.selected.delete(x);home();},lesson:(x,on)=>{on?state.lessons.add(x):state.lessons.delete(x);home();},allLessons:()=>{state.lessons=new Set([0,1,2,3,4,5]);home();}};
  const style=`<style>
  #ps-overlay{position:fixed;inset:0;z-index:9999;background:linear-gradient(135deg,#172554,#4f46e5);padding:18px;overflow:auto;display:none;font-family:Segoe UI,'Microsoft JhengHei',sans-serif}#ps-overlay.open{display:block}.ps-card{max-width:720px;margin:0 auto 20px;background:#fff;border-radius:24px;padding:22px;box-shadow:0 20px 70px #0006}.ps-card header{display:flex;justify-content:space-between;align-items:center;color:#4338ca;font-weight:800;gap:8px}.ps-back{border:0;background:#eef2ff;color:#4338ca;border-radius:10px;padding:8px 10px;font-weight:700;cursor:pointer}.ps-hero{text-align:center;padding:18px 4px}.ps-hero div{font-size:3rem}.ps-hero h1{margin:6px 0;color:#1e1b4b}.ps-hero p,.ps-note,.ps-tip{color:#64748b;font-size:.85rem;line-height:1.5}.ps-card h3{font-size:.9rem;color:#475569;margin:18px 0 8px}.ps-types{display:grid;grid-template-columns:1fr 1fr;gap:9px}.ps-types label,.ps-lessons label{border:2px solid #e2e8f0;border-radius:12px;padding:11px;cursor:pointer;font-weight:700;color:#334155}.ps-types label.chosen,.ps-lessons label.chosen{border-color:#6366f1;background:#eef2ff;color:#3730a3}.ps-types input,.ps-lessons input{display:none}.ps-types span{margin-right:6px}.ps-lessons{display:flex;flex-wrap:wrap;gap:7px}.ps-lessons button{width:100%;border:0;border-radius:10px;padding:9px;background:#f1f5f9;color:#475569;font-weight:700;cursor:pointer}.ps-lessons button.active{background:#312e81;color:#fff}.ps-lessons label{font-size:.8rem;padding:8px}.ps-ready{display:flex;justify-content:space-between;align-items:center;margin-top:20px;background:#f8fafc;padding:13px;border-radius:14px;color:#334155}.ps-ready small{display:block;color:#64748b;font-size:.72rem;margin-top:3px}.ps-primary,.ps-secondary,.ps-weak{border:0;border-radius:12px;padding:12px 18px;font-weight:800;cursor:pointer}.ps-primary{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff}.ps-secondary{background:#e2e8f0;color:#334155;margin-left:8px}.ps-weak{width:100%;margin-top:10px;background:#fff7ed;color:#c2410c;border:1px solid #fed7aa}.ps-mode{display:flex;gap:8px;margin:8px 0 18px}.ps-mode button{flex:1;border:2px solid #e2e8f0;border-radius:11px;padding:10px;background:#fff;color:#475569;font-weight:800;cursor:pointer}.ps-mode button.active{background:#4338ca;color:#fff;border-color:#4338ca}.ps-qtype{font-size:.76rem;color:#6366f1;font-weight:800;margin-top:18px}.ps-test h2,.ps-practice h2{font-size:1.2rem;line-height:1.5;color:#1e293b;margin:8px 0}.ps-question-row{display:flex;align-items:flex-start;gap:10px}.ps-question-row h2{flex:1}.ps-speak{flex:0 0 auto;border:0;background:#eef2ff;color:#4338ca;border-radius:10px;padding:8px;cursor:pointer;font-size:1.1rem}.ps-progress{height:7px;background:#e2e8f0;border-radius:8px;margin:14px 0}.ps-progress i{display:block;height:100%;background:#6366f1;border-radius:8px}.ps-passage{background:#f8fafc;border-left:4px solid #818cf8;padding:13px;line-height:1.7;color:#334155;font-size:.93rem}.ps-options{display:grid;gap:9px}.ps-options button{display:flex;text-align:left;align-items:center;gap:9px;border:2px solid #e2e8f0;background:#fff;border-radius:12px;padding:12px;cursor:pointer;font-size:.95rem}.ps-options button:hover{border-color:#818cf8}.ps-options b{background:#eef2ff;color:#4338ca;border-radius:7px;padding:3px 7px}.ps-options .ok{border-color:#22c55e;background:#f0fdf4}.ps-options .bad{border-color:#ef4444;background:#fef2f2}.ps-explain{margin-top:14px;padding:13px;border-radius:12px;line-height:1.55}.ps-explain.good{background:#f0fdf4;color:#166534}.ps-explain.wrong{background:#fff7ed;color:#9a3412}.ps-explain button{display:block;margin-top:9px;margin-left:auto;border:0;border-radius:9px;padding:8px 12px;background:#4338ca;color:#fff;font-weight:700;cursor:pointer}.ps-practice{border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin:12px 0}.ps-practice ol{padding-left:24px;color:#475569;line-height:1.65}.ps-answer{border:0;border-radius:9px;padding:8px 11px;background:#eef2ff;color:#4338ca;font-weight:700;cursor:pointer}.ps-answer-box{margin-top:9px;padding:10px;border-radius:9px;background:#f0fdf4;color:#166534;line-height:1.55}.ps-result{text-align:center;padding:40px 24px}.ps-result h1{font-size:3.2rem;color:#4f46e5;margin:4px}.ps-result h2{font-size:1.1rem;color:#334155}.ps-medal{font-size:4rem}.ps-summary{margin:18px 0;padding:12px;border-radius:12px;background:#fff7ed;color:#9a3412}.private-zone{margin:14px 0;background:linear-gradient(135deg,#1e1b4b,#4f46e5);border-radius:16px;padding:14px;color:#fff;box-shadow:0 8px 20px #4338ca40}.private-zone div{font-weight:800;font-size:1rem}.private-zone p{font-size:.75rem;margin:4px 0 10px;color:#e0e7ff}.private-zone button{width:100%;border:0;border-radius:10px;padding:10px;background:#fff;color:#3730a3;font-weight:800;cursor:pointer}@media(max-width:480px){#ps-overlay{padding:9px}.ps-card{padding:16px;border-radius:18px}.ps-types{grid-template-columns:1fr}.ps-ready{align-items:flex-start;gap:12px}.ps-ready .ps-primary{white-space:nowrap}}
  </style>`;
  document.body.insertAdjacentHTML('beforeend',style+'<div id="ps-overlay"><main id="ps-app"></main></div>');
  const menu=document.querySelector('#screen-menu .menu-title');
  if(menu) menu.insertAdjacentHTML('afterend','<section class="private-zone"><div>🎯 私中專區 · 嘉駿 90 分衝刺</div><p>字彙、文法、克漏字、閱讀四種測驗 · 錯題自動加強</p><button onclick="PrivateSchool.open()">進入私中專區 →</button></section>');
})();
