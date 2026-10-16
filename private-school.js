/* 私中專區：Unit 1–12 題庫、Unit 13 全冊模擬與自適應錯題複習 */
(() => {
  'use strict';
  const KEY = 'private_school_wrong_v1';
  const MASTERED_KEY = 'private_school_mastered_v1';
  const HISTORY_KEY = 'private_school_recent_questions_v1';
  const ATTEMPTS_KEY = 'private_school_attempts_v1';
  const CLOZE_ROUND_KEY = 'private_school_cloze_rounds_v1';
  const TYPES = { vocab:'字彙測驗', grammar:'文法測驗', cloze:'克漏字測驗', reading:'閱讀測驗' };
  // 依掃描題庫目錄順序建立；Unit 13 為 Unit 1–12 的全冊私中模擬考。
  const LESSONS = ['Unit 1 自我介紹與家庭','Unit 2 學校生活與科目','Unit 3 日常作息與習慣','Unit 4 食物與餐廳','Unit 5 嗜好與休閒時光','Unit 6 交通與問路','Unit 7 購物與金錢','Unit 8 節慶與傳統','Unit 9 健康與運動','Unit 10 自然與天氣','Unit 11 科技與日常生活','Unit 12 夢想與未來','Unit 13 全冊模擬考'];
  const FULL_MOCK_LESSON = 12;
  const selectedLessonIds = lessons => [...new Set([...lessons].flatMap(lesson => lesson===FULL_MOCK_LESSON ? Array.from({length:12},(_,i)=>i) : [lesson]))];
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
  // Unit 7–12 依掃描題庫的核心字彙頁整理，每單元 20 個字。
  vocabWords.push(
    ['bag','袋子；包包',6],['buy','購買',6],['card','卡片；信用卡',6],['cashier','收銀員',6],['change','找零；零錢',6],['cheap','便宜的',6],['clothes','衣服',6],['color','顏色',6],['customer','顧客',6],['expensive','昂貴的',6],['fit','合身',6],['money','金錢',6],['price','價格',6],['receipt','收據',6],['sale','特價；販售',6],['shop','購物',6],['spend','花費',6],['store','商店',6],['try on','試穿',6],['wallet','皮夾',6],
    ['candle','蠟燭',7],['celebrate','慶祝',7],['costume','服裝；裝扮',7],['culture','文化',7],['decorate','裝飾',7],['event','活動',7],['festival','節慶',7],['firecracker','鞭炮',7],['firework','煙火',7],['gift','禮物',7],['holiday','假日',7],['lantern','燈籠',7],['moon','月亮',7],['parade','遊行',7],['pray','祈禱',7],['prepare','準備',7],['reunion','團聚',7],['temple','廟宇',7],['tradition','傳統',7],['treat','款待；招待',7],
    ['body','身體',8],['exercise','運動',8],['healthy','健康的',8],['hospital','醫院',8],['jog','慢跑',8],['medicine','藥物',8],['nap','小睡',8],['nurse','護士',8],['patient','病人',8],['rest','休息',8],['should','應該',8],['sick','生病的',8],['stretch','伸展',8],['strong','強壯的',8],['swim','游泳',8],['tired','疲累的',8],['treatment','治療',8],['walk','散步；走路',8],['workout','健身；運動',8],['yoga','瑜伽',8],
    ['cloudy','多雲的',9],['cold','寒冷的',9],['cool','涼爽的',9],['forecast','天氣預報',9],['hot','炎熱的',9],['rain','下雨；雨',9],['rainy','多雨的',9],['snow','下雪；雪',9],['snowy','下雪的',9],['storm','暴風雨',9],['sunny','晴朗的',9],['temperature','溫度',9],['tomorrow','明天',9],['umbrella','雨傘',9],['warm','溫暖的',9],['weather','天氣',9],['weekend','週末',9],['wind','風',9],['windy','多風的',9],['winter','冬天',9],
    ['app','應用程式',10],['battery','電池',10],['computer','電腦',10],['download','下載',10],['email','電子郵件',10],['Internet','網際網路',10],['message','訊息',10],['online','線上的',10],['password','密碼',10],['photo','照片',10],['project','專題；計畫',10],['robot','機器人',10],['screen','螢幕',10],['smartphone','智慧型手機',10],['technology','科技',10],['user','使用者',10],['video','影片',10],['website','網站',10],['Wi-Fi','無線網路',10],['work','工作；作業',10],
    ['abroad','在國外',11],['achieve','達成',11],['artist','藝術家',11],['become','成為',11],['decide','決定',11],['dream','夢想',11],['future','未來',11],['goal','目標',11],['hard','努力地；困難的',11],['hope','希望',11],['job','工作',11],['learn','學習',11],['plan','計畫',11],['science','科學',11],['study','讀書；學習',11],['university','大學',11],['will','將會',11],['wish','希望；願望',11],['work hard','努力讀書／工作',11],['world','世界',11]
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

  // Unit 7–12：依掃描本的文法重點延伸為每單元 20 題。
  addGrammar(6, [
    ['How ___ this bag?',['much is','many are','much are','many is'],0,'單數物品詢問價格用 How much is ...?'],['These shoes ___ too expensive.',['is','are','am','be'],1,'shoes 是複數，使用 are。'],['I want ___ a new wallet.',['buy','to buy','buying to','buys'],1,'want 後面接 to + 原形動詞。'],['She ___ on the dress before buying it.',['try','tries','trying','to tries'],1,'She 是第三人稱單數，使用 tries。'],['There ___ a sale at the store today.',['is','are','am','be'],0,'a sale 是單數，使用 There is。'],['I don’t have ___ money with me.',['many','much','a','an'],1,'money 不可數，否定句用 much。'],['The cashier ___ me the receipt.',['give','gives','giving','to give'],1,'cashier 是單數，使用 gives。'],['This T-shirt is ___ than that one.',['cheap','cheaper','cheapest','more cheap'],1,'兩件物品比較，cheap 用比較級 cheaper。'],['My new shoes ___ me well.',['fit','fits','fitting','to fit'],0,'shoes 是複數，使用 fit。'],['We ___ shopping every Saturday.',['go','goes','going','to go'],0,'We 使用原形 go。'],['The red bag is ___ than the blue one.',['expensive','more expensive','most expensive','expensively'],1,'多音節形容詞比較級用 more expensive。'],['___ I pay by card?',['Can','Do','Am','Is'],0,'詢問可否使用 Can I ...?'],['My sister ___ all her money on books.',['spend','spends','spending','to spend'],1,'sister 是單數，使用 spends。'],['There are ___ customers in the store.',['much','many','a','an'],1,'customers 是可數複數，使用 many。'],['I need ___ some change.',['get','to get','gets','getting to'],1,'need 後面接 to + 原形。'],['This color ___ nice on you.',['look','looks','looking','to look'],1,'color 是單數，使用 looks。'],['The price ___ on the tag.',['is','are','am','be'],0,'price 是單數，使用 is。'],['___ you like this jacket?',['Do','Does','Are','Is'],0,'you 的一般現在式問句用 Do。'],['My parents are ___ at the mall now.',['shop','shops','shopping','to shop'],2,'now 為現在進行式提示，使用 are shopping。'],['I ___ a gift for my mother yesterday.',['buy','bought','buys','buying'],1,'yesterday 表過去式，buy 的過去式是 bought。']
  ]);
  addGrammar(7, [
    ['We ___ the Lantern Festival every year.',['celebrate','celebrates','celebrating','to celebrating'],0,'We 使用原形 celebrate。'],['My family ___ dinner together last night.',['have','had','has','having'],1,'last night 表過去式，have 變 had。'],['They ___ lanterns for the festival now.',['make','makes','are making','made'],2,'now 表現在進行式，使用 are making。'],['There ___ many people at the parade.',['is','are','am','be'],1,'people 是複數，使用 are。'],['We went to the temple ___ pray.',['for','to','at','with'],1,'目的用 to + 原形動詞。'],['My mother ___ a special meal yesterday.',['prepare','prepares','prepared','preparing'],2,'yesterday 表過去式，使用 prepared。'],['The children are ___ costumes.',['wear','wears','wearing','wore'],2,'are 後面接 V-ing。'],['A lantern is ___ than a candle.',['bright','brighter','brightest','more bright'],1,'兩者比較使用 brighter。'],['The Moon Festival is ___ favorite festival.',['I','me','my','mine'],2,'名詞 festival 前用所有格 my。'],['We ___ fireworks at the river last weekend.',['watch','watched','watches','watching'],1,'last weekend 表過去式，使用 watched。'],['People give ___ gifts during the holiday.',['each other','each others','one another’s','themself'],0,'彼此互贈禮物用 each other。'],['My grandparents ___ us stories about traditions.',['tell','tells','told','telling'],2,'掃描故事為過去式，使用 told。'],['The parade ___ at seven last night.',['start','starts','started','starting'],2,'last night 表過去式。'],['We ___ lucky money in red envelopes.',['get','gets','got','getting'],2,'描述去年新年用 got。'],['___ did you celebrate with?',['What','Who','Where','How'],1,'詢問人用 Who。'],['The festival ___ very exciting.',['was','were','is','are'],0,'festival 單數且過去式，用 was。'],['My cousin and I ___ moon cakes.',['make','makes','made','making'],2,'過去事件用 made。'],['People ___ for peace and health.',['pray','prays','prayed','praying'],0,'一般敘述複數 people 用 pray。'],['This custom is part of our ___.',['culture','cultures','cultural','cultured'],0,'文化是 culture。'],['We ___ our house with lights.',['decorate','decorates','decorated','decorating'],2,'描述已完成的節慶佈置，使用 decorated。']
  ]);
  addGrammar(8, [
    ['You ___ drink more water every day.',['should','shoulds','are should','should to'],0,'should 後接原形動詞。'],['Kevin ___ jogging every morning.',['go','goes','going','to go'],1,'Kevin 是第三人稱單數，使用 goes。'],['My sister is ___ because she has a fever.',['sick','strong','healthy','free'],0,'發燒表示 sick。'],['We ___ exercise to stay healthy.',['need','needs','needed','needing'],0,'We 使用原形 need。'],['A nurse ___ patients at the hospital.',['help','helps','helping','to helps'],1,'nurse 單數，使用 helps。'],['He ___ a nap after lunch yesterday.',['take','takes','took','taking'],2,'yesterday 表過去式，take 變 took。'],['My body feels ___ after a good workout.',['strong','strongly','strength','stronger'],0,'feel 後面接形容詞 strong。'],['You ___ stretch before you run.',['should','should to','shoulds','are should'],0,'should 後接原形 stretch。'],['She is too tired ___ swim today.',['to','for','at','with'],0,'too + adj. + to V。'],['We ___ basketball after school yesterday.',['play','plays','played','playing'],2,'yesterday 表過去式。'],['How often ___ you exercise?',['do','does','are','is'],0,'you 的一般現在式問句用 Do。'],['My father ___ to the hospital now.',['go','goes','is going','went'],2,'now 表現在進行式。'],['A healthy lunch ___ fruit and vegetables.',['have','has','having','to have'],1,'lunch 單數，使用 has。'],['I don’t feel well. I ___ see a doctor.',['should','shouldn’t','can’t','don’t'],0,'生病時建議用 should。'],['The patient ___ medicine twice a day.',['take','takes','taking','to take'],1,'patient 單數，使用 takes。'],['My friends ___ a long walk on Sundays.',['take','takes','taking','to take'],0,'friends 複數，使用 take。'],['Swimming is ___ than sitting all day.',['healthy','healthier','healthiest','more health'],1,'兩者比較用 healthier。'],['He ___ tired after the race.',['feel','feels','feeling','to feel'],1,'He 單數，使用 feels。'],['We ___ not stay up too late.',['should','shoulds','are','do'],0,'should not 表建議否定。'],['The medicine ___ better now.',['works','work','working','to work'],0,'medicine 單數，使用 works。']
  ]);
  addGrammar(9, [
    ['It ___ rainy today.',['is','are','am','be'],0,'today 的天氣用 It is。'],['It ___ tomorrow.',['will rain','rains will','will rainy','rain will'],0,'未來天氣使用 will + 原形。'],['The weather ___ cold last night.',['is','was','were','be'],1,'last night 表過去式，It was cold。'],['Look! It ___ outside.',['snow','snows','is snowing','snowed'],2,'Look! 表現在進行式。'],['We ___ an umbrella because it is raining.',['need','needs','needed','needing'],0,'We 用原形 need。'],['It is ___ than yesterday.',['cold','colder','coldest','more cold'],1,'兩天比較使用 colder。'],['___ the weather sunny tomorrow?',['Will','Do','Does','Is'],0,'未來問句用 Will。'],['The forecast says it ___ be windy this weekend.',['will','is','does','has'],0,'預測用 will。'],['I ___ my jacket yesterday because it was cold.',['wear','wears','wore','wearing'],2,'yesterday 表過去式，wear 變 wore。'],['There ___ a storm last night.',['was','were','is','are'],0,'storm 單數過去式用 was。'],['It is too hot ___ run outside.',['to','for','at','with'],0,'too hot to run。'],['My brother ___ photos of the snowy mountain.',['take','takes','taking','to take'],1,'brother 單數使用 takes。'],['The sun ___ brightly this morning.',['shine','shines','shining','to shine'],1,'sun 單數，使用 shines。'],['We will stay home if it ___.',['rain','rains','raining','to rain'],1,'if 子句用一般現在式，it rains。'],['Today is ___ than Monday.',['warm','warmer','warmest','more warmly'],1,'比較級 warmer。'],['The children ___ excited when it snowed.',['was','were','is','be'],1,'children 複數過去式用 were。'],['It ___ not snow in summer here.',['does','do','is','are'],0,'It 的一般現在否定用 does not。'],['___ your umbrella before you leave.',['Take','Takes','Taking','To take'],0,'祈使句用原形 Take。'],['The sky is full of ___.',['cloud','clouds','cloudy','clouding'],1,'full of 後面接複數名詞 clouds。'],['We ___ the weather report every morning.',['watch','watches','watched','watching'],0,'We 用原形 watch。']
  ]);
  addGrammar(10, [
    ['My phone ___ a new app.',['has','have','having','to have'],0,'phone 單數，使用 has。'],['I ___ a message to my friend yesterday.',['send','sends','sent','sending'],2,'yesterday 表過去式，send 變 sent。'],['She is ___ a video now.',['watch','watches','watching','watched'],2,'now 表現在進行式。'],['We use Wi-Fi ___ the Internet.',['use','to use','using','uses'],1,'目的用 to + 原形。'],['The battery ___ low, so charge the phone.',['is','are','am','be'],0,'battery 單數，使用 is。'],['My father ___ emails every morning.',['check','checks','checking','to check'],1,'father 單數，使用 checks。'],['Can you ___ this app for me?',['download','downloads','downloading','to downloads'],0,'Can 後接原形。'],['A robot ___ help people at home.',['can','cans','is can','can to'],0,'can 後接原形 help。'],['The screen is too small ___ read.',['to','for','at','with'],0,'too + adj. + to V。'],['I forgot my password, ___ I cannot log in.',['so','but','because','or'],0,'因果結果用 so。'],['This computer is ___ than my old one.',['fast','faster','fastest','more fast'],1,'兩者比較用 faster。'],['My teacher ___ us a useful website.',['show','shows','showing','to show'],1,'teacher 單數使用 shows。'],['We ___ our project online last week.',['finish','finished','finishes','finishing'],1,'last week 表過去式。'],['___ you ever used this website?',['Have','Has','Do','Are'],0,'you 的現在完成式問句用 Have。'],['She ___ never seen a robot before.',['have','has','is','does'],1,'She 搭配 has。'],['The app helps me ___ English.',['learn','learns','learning','to learning'],0,'help 後可接原形動詞。'],['My computer ___ working this morning.',['stop','stops','stopped','stopping'],2,'this morning 過去事件使用 stopped。'],['There ___ many photos on my phone.',['is','are','am','be'],1,'photos 複數使用 are。'],['I need ___ my homework on the computer.',['do','to do','does','doing to'],1,'need 後接 to + 原形。'],['Technology ___ daily life easier.',['make','makes','making','to make'],1,'technology 單數，使用 makes。']
  ]);
  addGrammar(11, [
    ['I ___ study abroad next year.',['will','am','do','have'],0,'未來計畫使用 will + 原形。'],['She wants ___ an artist.',['be','to be','being','is'],1,'want 後接 to + 原形。'],['My dream is ___ a doctor.',['become','to become','becomes','becoming to'],1,'be 動詞後可用 to become 說明夢想。'],['If I work hard, I ___ my goal.',['achieve','will achieve','achieved','achieves'],1,'if 條件句主句用 will + 原形。'],['He ___ to study science at university.',['hope','hopes','hoping','to hopes'],1,'He 單數，使用 hopes。'],['We ___ a plan for the future yesterday.',['make','made','makes','making'],1,'yesterday 表過去式，make 變 made。'],['My sister ___ English every night.',['study','studies','studying','to study'],1,'sister 單數，study 變 studies。'],['I want to travel ___ after college.',['abroad','aboard','around','ahead'],0,'到國外是 abroad。'],['She ___ a pilot when she grows up.',['become','becomes','will become','became'],2,'未來目標用 will become。'],['What ___ you do in the future?',['will','do','are','have'],0,'未來問句用 What will ...?'],['My parents ___ me to follow my dream.',['encourage','encourages','encouraged','encouraging'],0,'parents 複數，使用 encourage。'],['I am going ___ harder for the test.',['study','to study','studies','studying to'],1,'be going to + 原形。'],['His goal ___ to help sick people.',['is','are','am','be'],0,'goal 單數，使用 is。'],['We ___ never give up on our dreams.',['should','shoulds','are should','should to'],0,'should 後接原形。'],['She ___ a famous scientist one day.',['will be','is be','will being','be'],0,'will be 表未來。'],['My teacher says hard work ___ success.',['bring','brings','bringing','to bring'],1,'hard work 單數，使用 brings。'],['I ___ my future carefully.',['plan','plans','planning','to plans'],0,'I 使用原形 plan。'],['They want ___ the world.',['see','to see','seeing to','sees'],1,'want 後接 to see。'],['You can ___ anything if you try.',['achieve','achieves','achieved','achieving'],0,'can 後接原形。'],['I ___ a wish on my birthday last year.',['make','made','makes','making'],1,'last year 表過去式。']
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

  // Unit 7–12 掃描題庫的情境句與延伸私中題型；每單元 20 題，選項只從同單元核心字彙取得。
  const extensionClozeRows = [
    [6,[['The ___ gives me my change and receipt.','cashier'],['This jacket is on ___, so it is cheaper today.','sale'],['I want to ___ this dress before I buy it.','try on'],['Please pay by ___ if you do not have cash.','card'],['The new shoes do not ___ me; they are too small.','fit'],['My mother keeps her money in a ___.','wallet'],['The ___ on this bag is NT$500.','price'],['I need a paper ___ after I pay.','receipt'],['That store is popular because its clothes are not ___.','expensive'],['I usually ___ my birthday money on books.','spend'],['The customer puts the new shirt in a ___.','bag'],['This hat is cheap, but the red one is very ___.','expensive'],['There is a big ___ near the train station.','store'],['My sister likes the blue ___ of this dress.','color'],['We go ___ at the mall on Sunday.','shop'],['The ___ is looking for a birthday gift.','customer'],['I need to ___ a new notebook for school.','buy'],['These ___ are too big for me.','clothes'],['I have only ten dollars in my ___.','wallet'],['The cashier gives me five dollars in ___.','change']]],
    [7,[['We light a ___ on the birthday cake.','candle'],['People ___ the New Year with their families.','celebrate'],['Children wear a funny ___ at the Halloween party.','costume'],['A festival can teach us about local ___.','culture'],['We ___ the house with lights for the holiday.','decorate'],['The school sports day is a special ___.','event'],['The Moon ___ is in autumn.','festival'],['People set off ___ during Lunar New Year.','firecracker'],['We watch colorful ___ in the sky at night.','firework'],['I bought a small ___ for my teacher.','gift'],['We do not have school on this ___.','holiday'],['Children carry a ___ in the parade.','lantern'],['We watch the full ___ during the Mid-Autumn Festival.','moon'],['The band leads a street ___.','parade'],['Many people go to the temple to ___.','pray'],['My mother will ___ dinner for the family reunion.','prepare'],['The whole family has a ___ on New Year’s Eve.','reunion'],['The old ___ is near the mountain.','temple'],['Making moon cakes is a family ___.','tradition'],['Grandma will ___ us to a big dinner.','treat']]],
    [8,[['Fruit and exercise are good for your ___.','body'],['Walking after dinner is good ___.','exercise'],['Eating vegetables helps you stay ___.','healthy'],['The doctor works at the ___.','hospital'],['My dad likes to ___ in the park before breakfast.','jog'],['Take this ___ after dinner.','medicine'],['I am tired, so I need a short ___.','nap'],['The ___ checks the patient’s temperature.','nurse'],['The doctor is talking to a ___.','patient'],['You should ___ after a long workout.','rest'],['You ___ drink more water when it is hot.','should'],['Kevin is ___ and cannot go to school today.','sick'],['Please ___ your arms before you run.','stretch'],['Exercise can make your body ___.','strong'],['We ___ in the pool every Saturday.','swim'],['I feel ___ after running five kilometers.','tired'],['The patient needs medical ___.','treatment'],['Let’s ___ to school because it is near.','walk'],['I do a short ___ every morning.','workout'],['My aunt does ___ to relax her body.','yoga']]],
    [9,[['The sky is gray and ___ today.','cloudy'],['Wear a coat because it is ___.','cold'],['Spring mornings are ___, not hot.','cool'],['The weather ___ says it will rain tomorrow.','forecast'],['It is very ___ in July.','hot'],['Take an umbrella because it may ___.','rain'],['It is a ___ day, so we stay inside.','rainy'],['The children are happy because it starts to ___.','snow'],['The road is white after a ___ night.','snowy'],['The boats stay inside during a ___.','storm'],['It is ___ today; let’s have a picnic.','sunny'],['The ___ is thirty degrees today.','temperature'],['We will check the weather again ___.','tomorrow'],['Bring an ___ when it rains.','umbrella'],['The soup is still ___; be careful.','warm'],['What is the ___ like today?','weather'],['We will go hiking this ___.','weekend'],['The ___ is strong near the sea.','wind'],['It is too ___ to fly a kite safely.','windy'],['It often snows here in ___.','winter']]],
    [10,[['I use an ___ to learn new words.','app'],['My phone has no power because the ___ is low.','battery'],['I do my homework on the ___.','computer'],['Please ___ the new game before you play it.','download'],['My teacher sends an ___ to my parents.','email'],['I got a short ___ from my friend.','message'],['The ___ lets us find information quickly.','Internet'],['This class is ___, so we use a website.','online'],['Do not share your ___ with other people.','password'],['She takes a ___ of the sunset.','photo'],['Our science ___ is due on Friday.','project'],['The ___ can clean the floor by itself.','robot'],['The phone ___ is cracked.','screen'],['My father bought a new ___.','smartphone'],['Modern ___ makes daily life easier.','technology'],['Every ___ needs a strong password.','user'],['We watched a funny ___ in class.','video'],['This ___ has many English games.','website'],['The café has free ___.','Wi-Fi'],['David finishes his school ___ before playing games.','work']]],
    [11,[['My sister wants to study ___ next year.','abroad'],['Hard work can help you ___ your goal.','achieve'],['Amy wants to become an ___.','artist'],['He hopes to ___ a doctor in the future.','become'],['I must ___ which club to join.','decide'],['My ___ is to travel around the world.','dream'],['What will you do in the ___?','future'],['Getting into a good school is my ___.','goal'],['You must work ___ to make your dream come true.','hard'],['I ___ to visit Japan one day.','hope'],['My father loves his ___ at the hospital.','job'],['We ___ something new every day at school.','learn'],['Let’s make a study ___.','plan'],['She likes ___ because she wants to know how things work.','science'],['I need to ___ for the test tonight.','study'],['My brother hopes to enter a good ___.','university'],['I ___ call you tomorrow.','will'],['Make a ___ before you blow out the candles.','wish'],['You can reach your goal if you ___.','work hard'],['The Internet helps us learn about the ___.','world']]]
  ];
  extensionClozeRows.forEach(([lesson,rows])=>{
    const words=vocabWords.filter(word=>word[2]===lesson);
    rows.forEach(([stem,answer],index)=>{
      const options=[answer,...words.map(word=>word[0]).filter(word=>word!==answer).slice(index%8,index%8+3)].sort(()=>Math.random()-.5);
      cloze.push(q(`cx-${lesson}-${index}`,'cloze',lesson,stem,options,options.indexOf(answer),`${answer} 是本單元的核心字彙；依句意選擇最合適的答案。`));
    });
  });

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
  passages.push(
    [6,'Jenny went to a store with her mother. She wanted a blue bag, but it was too expensive. Then they found the same bag on sale. Jenny paid by card and the cashier gave her a receipt and some change.',[
      ['Where did Jenny go?',['A hospital','A store','A temple','A station'],1,'第一句說 Jenny went to a store。'],['Why did Jenny not buy the first bag?',['It was too small','It was too expensive','It was red','It was broken'],1,'第一個包包太貴。'],['How did Jenny pay?',['By card','With a ticket','With change','By phone'],0,'文章指出 paid by card。'],['Who gave Jenny a receipt?',['Her mother','A cashier','A nurse','A teacher'],1,'收銀員 cashier 給收據。']]],
    [7,'Last month, Leo celebrated the Moon Festival with his family. They prepared moon cakes and went to a temple to pray. At night, they watched the full moon together. Leo’s grandmother told him that this tradition brings families close.',[
      ['What festival did Leo celebrate?',['The Moon Festival','Christmas','A sports day','A school festival'],0,'文章第一句指出 Moon Festival。'],['What did the family prepare?',['Moon cakes','A computer','Medicine','A map'],0,'他們準備 moon cakes。'],['Where did they go to pray?',['A temple','A store','A hospital','A station'],0,'文章說 went to a temple to pray。'],['What does the tradition do?',['Makes families close','Makes food cheap','Changes the weather','Starts school'],0,'祖母說這傳統讓家人更親近。']]],
    [8,'Kevin felt tired last week, so he visited the hospital. The nurse checked his temperature, and the doctor said he should rest and drink more water. After two days, Kevin felt stronger. Now he walks with his father every evening to stay healthy.',[
      ['Why did Kevin visit the hospital?',['He felt tired','He wanted to shop','He lost his phone','He was late'],0,'文章說 Kevin felt tired。'],['Who checked Kevin’s temperature?',['A nurse','His father','A cashier','A classmate'],0,'護士檢查體溫。'],['What should Kevin drink more of?',['Water','Milk tea','Coffee','Juice'],0,'醫生建議多喝水。'],['What does Kevin do every evening now?',['Walks with his father','Plays video games','Visits a temple','Watches fireworks'],0,'文章最後說 walks with his father。']]],
    [9,'The weather forecast said it would be sunny on Saturday, so Mia planned a picnic. On Friday night, however, a storm came with strong wind and rain. On Saturday morning, it was still cloudy and cool. Mia checked the forecast again and decided to stay home.',[
      ['What did the forecast first say?',['It would be sunny','It would snow','It would be hot','It would be windy'],0,'最初預報是 sunny。'],['What came on Friday night?',['A storm','A festival','A parade','A sale'],0,'文章說 a storm came。'],['What was the weather like Saturday morning?',['Cloudy and cool','Sunny and hot','Snowy and cold','Warm and windy'],0,'仍是 cloudy and cool。'],['What did Mia decide to do?',['Stay home','Have a picnic','Go shopping','Go jogging'],0,'她決定待在家。']]],
    [10,'David downloaded a new study app on his smartphone. The app sends him a message every day to remind him about homework. He can also watch videos and use a website to learn English. David thinks technology is helpful, but he never shares his password online.',[
      ['What did David download?',['A study app','A robot','A photo','A battery'],0,'第一句指出 study app。'],['What does the app send every day?',['A message','A gift','A ticket','A costume'],0,'app sends a message every day。'],['What does David use to learn English?',['Videos and a website','A map and a train','Fireworks and lanterns','Medicine and water'],0,'文章提到 videos 和 website。'],['What does David never share?',['His password','His homework','His phone','His photos'],0,'文章明說不分享 password。']]],
    [11,'Nina dreams of becoming a scientist. She plans to study hard and enter a good university. Next summer, she will join a science camp abroad. Nina knows her goal is not easy, but she believes that hard work can help her achieve it.',[
      ['What does Nina want to become?',['A scientist','A cashier','A nurse','An artist'],0,'第一句寫 becoming a scientist。'],['What does Nina plan to do?',['Study hard','Buy a bag','Watch a parade','Take medicine'],0,'她計畫努力讀書。'],['Where will Nina go next summer?',['A science camp abroad','A shopping mall','A hospital','A train station'],0,'文章說 science camp abroad。'],['What can help Nina achieve her goal?',['Hard work','A new app','A storm','A receipt'],0,'文章最後說 hard work。']]]
  );
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
    // Unit 13 是正式全冊模擬考：固定混合字彙、文法、克漏字與閱讀四種題型。
    const types=state.lessons.has(FULL_MOCK_LESSON)?Object.keys(TYPES):[...state.selected];
    if(!types.length) return alert('請至少選一種測驗。');
    const lessonIds=selectedLessonIds(state.lessons);
    let pool=BANK.filter(x=>types.includes(x.type)&&lessonIds.includes(x.lesson));
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
  function next(){ stopSpeech(); clearQuestionTimer(); clearAutoNext(); if(++state.index>=state.quiz.length) finish(); else renderQuestion(); }
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
    const text=rawText.replace(/[?？.。"“”]/g,'');
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
      if(part==='__option_pause__'){setTimeout(speakNext,220);return;}
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
    const lessonIds=selectedLessonIds(state.lessons);
    const items=BANK.filter(x=>state.selected.has(x.type)&&lessonIds.includes(x.lesson));
    document.getElementById('ps-app').innerHTML=`<section class="ps-card"><header><button class="ps-back" onclick="PrivateSchool.home()">← 回設定</button><span>私中專區 · 練習</span><b>${items.length} 題</b></header><div class="ps-hero"><div>📖</div><h1>範圍練習</h1><p>查看所選 Unit 的題目、選項與解析；按 🔊 可聽題目或答案解析。</p></div>${items.map((item,i)=>`<article class="ps-practice"><div class="ps-qtype">${i+1}. ${LESSONS[item.lesson]} · ${TYPES[item.type]}</div>${item.passage?`<div class="ps-passage">${esc(item.passage)}</div>`:''}<div class="ps-question-row"><h2>${esc(item.stem)}</h2><button class="ps-speak" onclick="PrivateSchool.speakItem('${item.id}')" title="朗讀題目">🔊</button></div><ol>${item.opts.map(o=>`<li>${esc(o)}</li>`).join('')}</ol><button class="ps-answer" onclick="PrivateSchool.toggleAnswer('${item.id}')">顯示答案與解析</button><div id="ps-a-${item.id}" class="ps-answer-box" hidden><b>答案：${'ABCD'[item.answer]}. ${esc(item.opts[item.answer])}</b><br>${esc(item.explain)}<button class="ps-answer-speak" onclick="PrivateSchool.speakExplanation('${item.id}')">🔊 朗讀答案與解析</button></div></article>`).join('')||'<p>請先選擇至少一種測驗與一個 Unit。</p>'}</section>`;
  }
  function toggleAnswer(id){const el=document.getElementById('ps-a-'+id);if(el)el.hidden=!el.hidden;}
  function home(){
    clearQuestionTimer(); clearAutoNext();
    const wrong=getWrong(), weak=Object.keys(wrong).length;
    document.getElementById('ps-app').innerHTML=`<section class="ps-card"><header><button class="ps-back" onclick="PrivateSchool.close()">← 回首頁</button><span>嘉駿的私中專區</span><b>目標 90+</b></header><div class="ps-hero"><div>🎯</div><h1>私中入學英語衝刺</h1><p>Unit 1–12 題庫 · Unit 13 全冊模擬 · 不重複出題與錯題加強</p></div><div class="ps-mode"><button class="${state.mode==='test'?'active':''}" onclick="PrivateSchool.setMode('test')">📝 直接考試</button><button class="${state.mode==='practice'?'active':''}" onclick="PrivateSchool.setMode('practice')">📖 範圍練習</button></div><h3>選擇測驗類型（可複選）</h3><div class="ps-types">${Object.entries(TYPES).map(([id,label])=>`<label class="${state.selected.has(id)?'chosen':''}"><input type="checkbox" ${state.selected.has(id)?'checked':''} onchange="PrivateSchool.type('${id}',this.checked)"><span>${({vocab:'🗂️',grammar:'🧩',cloze:'✍️',reading:'📖'})[id]}</span>${label}</label>`).join('')}</div><h3>選擇範圍</h3><div class="ps-lessons"><button class="${state.lessons.size===LESSONS.length?'active':''}" onclick="PrivateSchool.allLessons()">全部 Unit 1–12</button>${LESSONS.map((x,i)=>`<label class="${state.lessons.has(i)?'chosen':''}"><input type="checkbox" ${state.lessons.has(i)?'checked':''} onchange="PrivateSchool.lesson(${i},this.checked)">${i===FULL_MOCK_LESSON?'🏆 ':''}${x}</label>`).join('')}</div><div class="ps-ready"><span>${state.mode==='test'?'最多 ':'查看 '}<b>${state.mode==='test'?'20 題':'所選題目'}</b><small>${state.lessons.has(FULL_MOCK_LESSON)?'Unit 13 會從全冊題庫混合抽題；題目答熟後會持續換新情境。':state.mode==='test'?'題庫不足 20 題時，會減少題數，絕不重複。':'可顯示答案、解析與英文朗讀。'}</small></span><button class="ps-primary" onclick="PrivateSchool.${state.mode==='test'?'start()':'practice()'}">${state.mode==='test'?'開始測驗':'開始練習'}</button></div><button class="ps-weak" onclick="PrivateSchool.review()">🔥 常犯錯題庫 <b>${weak}</b> 題</button><p class="ps-note">題庫依掃描教材建立；Unit 13 為全冊私中入學模擬，會混合字彙、文法、克漏字與閱讀。</p></section>`;
  }
  const renderHome=home;
  home=function(){ renderHome(); renderLeaderboard(); renderTodayAttempts(); };
  function renderLeaderboard(){
    const anchor=document.querySelector('#ps-app .ps-note');
    if(!anchor) return;
    const wrong=getWrong();
    const rows=Object.entries(wrong)
      .map(([id,record])=>({id,record,item:BANK.find(x=>x.id===id)}))
      .filter(x=>x.item&&state.selected.has(x.item.type)&&selectedLessonIds(state.lessons).includes(x.item.lesson))
      .sort((a,b)=>(b.record.count||0)-(a.record.count||0)||(b.record.at||0)-(a.record.at||0))
      .slice(0,10);
    const masteredCount=Object.values(getMastered()).filter(record=>state.selected.has(record.type)&&selectedLessonIds(state.lessons).includes(record.lesson)).length;
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
  window.PrivateSchool={open,close,home,start,answer,next,review,reviewMastered,viewAttempt,reviewAttemptWrong,viewAttemptHistory,practice,speakItem,speakExplanation:id=>speakItem(id,'explanation'),stopSpeech,toggleAnswer,setMode:m=>{state.mode=m;home();},type:(x,on)=>{on?state.selected.add(x):state.selected.delete(x);home();},lesson:(x,on)=>{on?state.lessons.add(x):state.lessons.delete(x);home();},allLessons:()=>{state.lessons=new Set(Array.from({length:12},(_,i)=>i));home();}};
  const style=`<style>
  #ps-overlay{position:fixed;inset:0;z-index:9999;background:linear-gradient(135deg,#172554,#4f46e5);padding:18px;overflow:auto;display:none;font-family:Segoe UI,'Microsoft JhengHei',sans-serif}#ps-overlay.open{display:block}.ps-card{max-width:720px;margin:0 auto 20px;background:#fff;border-radius:24px;padding:22px;box-shadow:0 20px 70px #0006}.ps-card header{display:flex;justify-content:space-between;align-items:center;color:#4338ca;font-weight:800;gap:8px}.ps-back{border:0;background:#eef2ff;color:#4338ca;border-radius:10px;padding:8px 10px;font-weight:700;cursor:pointer}.ps-hero{text-align:center;padding:18px 4px}.ps-hero div{font-size:3rem}.ps-hero h1{margin:6px 0;color:#1e1b4b}.ps-hero p,.ps-note,.ps-tip{color:#64748b;font-size:.85rem;line-height:1.5}.ps-card h3{font-size:.9rem;color:#475569;margin:18px 0 8px}.ps-types{display:grid;grid-template-columns:1fr 1fr;gap:9px}.ps-types label,.ps-lessons label{border:2px solid #e2e8f0;border-radius:12px;padding:11px;cursor:pointer;font-weight:700;color:#334155}.ps-types label.chosen,.ps-lessons label.chosen{border-color:#6366f1;background:#eef2ff;color:#3730a3}.ps-types input,.ps-lessons input{display:none}.ps-types span{margin-right:6px}.ps-lessons{display:flex;flex-wrap:wrap;gap:7px}.ps-lessons button{width:100%;border:0;border-radius:10px;padding:9px;background:#f1f5f9;color:#475569;font-weight:700;cursor:pointer}.ps-lessons button.active{background:#312e81;color:#fff}.ps-lessons label{font-size:.8rem;padding:8px}.ps-ready{display:flex;justify-content:space-between;align-items:center;margin-top:20px;background:#f8fafc;padding:13px;border-radius:14px;color:#334155}.ps-ready small{display:block;color:#64748b;font-size:.72rem;margin-top:3px}.ps-primary,.ps-secondary,.ps-weak{border:0;border-radius:12px;padding:12px 18px;font-weight:800;cursor:pointer}.ps-primary{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff}.ps-secondary{background:#e2e8f0;color:#334155;margin-left:8px}.ps-weak{width:100%;margin-top:10px;background:#fff7ed;color:#c2410c;border:1px solid #fed7aa}.ps-mode{display:flex;gap:8px;margin:8px 0 18px}.ps-mode button{flex:1;border:2px solid #e2e8f0;border-radius:11px;padding:10px;background:#fff;color:#475569;font-weight:800;cursor:pointer}.ps-mode button.active{background:#4338ca;color:#fff;border-color:#4338ca}.ps-qtype{font-size:.76rem;color:#6366f1;font-weight:800;margin-top:18px}.ps-test h2,.ps-practice h2{font-size:1.2rem;line-height:1.5;color:#1e293b;margin:8px 0}.ps-question-row{display:flex;align-items:flex-start;gap:10px}.ps-question-row h2{flex:1}.ps-speak{flex:0 0 auto;border:0;background:#eef2ff;color:#4338ca;border-radius:10px;padding:8px;cursor:pointer;font-size:1.1rem}.ps-progress{height:7px;background:#e2e8f0;border-radius:8px;margin:14px 0}.ps-progress i{display:block;height:100%;background:#6366f1;border-radius:8px}.ps-passage{background:#f8fafc;border-left:4px solid #818cf8;padding:13px;line-height:1.7;color:#334155;font-size:.93rem}.ps-options{display:grid;gap:9px}.ps-options button{display:flex;text-align:left;align-items:center;gap:9px;border:2px solid #e2e8f0;background:#fff;border-radius:12px;padding:12px;cursor:pointer;font-size:.95rem}.ps-options button:hover{border-color:#818cf8}.ps-options b{background:#eef2ff;color:#4338ca;border-radius:7px;padding:3px 7px}.ps-options .ok{border-color:#22c55e;background:#f0fdf4}.ps-options .bad{border-color:#ef4444;background:#fef2f2}.ps-explain{margin-top:14px;padding:13px;border-radius:12px;line-height:1.55}.ps-explain.good{background:#f0fdf4;color:#166534}.ps-explain.wrong{background:#fff7ed;color:#9a3412}.ps-explain button{display:block;margin-top:9px;margin-left:auto;border:0;border-radius:9px;padding:8px 12px;background:#4338ca;color:#fff;font-weight:700;cursor:pointer}.ps-practice{border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin:12px 0}.ps-practice ol{padding-left:24px;color:#475569;line-height:1.65}.ps-answer{border:0;border-radius:9px;padding:8px 11px;background:#eef2ff;color:#4338ca;font-weight:700;cursor:pointer}.ps-answer-box{margin-top:9px;padding:10px;border-radius:9px;background:#f0fdf4;color:#166534;line-height:1.55}.ps-answer-speak{display:block;margin-top:9px;border:0;border-radius:8px;padding:7px 10px;background:#dcfce7;color:#166534;font-weight:800;cursor:pointer}.ps-attempt-ok{border-color:#86efac}.ps-attempt-bad{border-color:#fca5a5;background:#fffafa}.ps-correct-choice{font-weight:800;color:#15803d}.ps-attempts{margin-top:14px;padding:14px;border:1px solid #c7d2fe;border-radius:14px;background:#f8faff;color:#312e81}.ps-attempts p{margin:7px 0;font-size:.82rem;color:#64748b}.ps-attempt-row{display:flex;justify-content:space-between;align-items:center;width:100%;margin-top:8px;padding:10px;border:1px solid #dbeafe;border-radius:10px;background:#fff;color:#312e81;text-align:left;cursor:pointer}.ps-attempt-row small{display:block;margin-top:3px;color:#64748b}.ps-result{text-align:center;padding:40px 24px}.ps-result h1{font-size:3.2rem;color:#4f46e5;margin:4px}.ps-result h2{font-size:1.1rem;color:#334155}.ps-medal{font-size:4rem}.ps-summary{margin:18px 0;padding:12px;border-radius:12px;background:#fff7ed;color:#9a3412}.private-zone{margin:14px 0;background:linear-gradient(135deg,#1e1b4b,#4f46e5);border-radius:16px;padding:14px;color:#fff;box-shadow:0 8px 20px #4338ca40}.private-zone div{font-weight:800;font-size:1rem}.private-zone p{font-size:.75rem;margin:4px 0 10px;color:#e0e7ff}.private-zone button{width:100%;border:0;border-radius:10px;padding:10px;background:#fff;color:#3730a3;font-weight:800;cursor:pointer}@media(max-width:480px){#ps-overlay{padding:9px}.ps-card{padding:16px;border-radius:18px}.ps-types{grid-template-columns:1fr}.ps-ready{align-items:flex-start;gap:12px}.ps-ready .ps-primary{white-space:nowrap}}
  #ps-stop-speech{position:fixed;right:22px;bottom:22px;z-index:10001;border:0;border-radius:999px;padding:12px 16px;background:#dc2626;color:#fff;font-weight:900;box-shadow:0 6px 18px #7f1d1d88;cursor:pointer;font-size:.9rem}
  .ps-timer{float:right;background:#fff7ed;color:#c2410c;border-radius:999px;padding:4px 8px;font-size:.78rem}
  .ps-stop-inline{flex:0 0 auto;border:0;border-radius:10px;padding:8px 10px;background:#dc2626;color:#fff;font-weight:900;cursor:pointer;font-size:.75rem}
  </style>`;
  document.body.insertAdjacentHTML('beforeend',style+'<div id="ps-overlay"><button id="ps-stop-speech" hidden onclick="PrivateSchool.stopSpeech()">⏹ STOP 停止朗讀</button><main id="ps-app"></main></div>');
  // 私中入口由首頁的兩大專區版面提供，不再插入國小專區的設定頁。
})();
