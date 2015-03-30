
/* Original code modified from Free Keyboard Practice Typing Game for Kids obtained from http://www.learnjquery.org/about/free-keyboard-practice-typing-game-for-kids.html */

var typer = {
    difficulty: 'easy',
    paused: true,
    dead: false,
    width: 1,
    height: 2,
    fall_delay: 10,
    state: 'menu',
    level: 1,
    score: 0,
    words: [],
    all_words: [],
    words_n: 2,
    accuracy: 100,
    bulletsFired: 0,
    total: 0,
    cpm: 0,
    wpm: 0,
    init: function(w, h) {
        this.width = w;
        this.height = h;
        $('#mc,#v').css({
            width: w + 'px',
            height: h + 'px'
        });
        window.IX = (typer.width / 2) - 16;
        window.IY = (typer.height - 72);
        /* reinitialize variables */
        this.difficulty = 'easy';
        this.paused = true;
        this.dead = false;
        this.fall_delay = 10;
        this.state = 'menu';
        this.level = 1;
        this.score = 0;
        this.words = [];
        this.all_words = [];
        this.words_n = 2;
        this.accuracy = 100;
        this.bulletsFired = 0;
        this.total = 0;
        this.cpm = 0;
        this.wpm = 0;
    }
};

var sound_bullet = [];
var sound_hit = [];
var sound_atomic = [];
var GAME_TIMER = null;
var IX = 0;
var IY = 0;
var ladder = 0;

var game_logic_loop_counter = 0;
var game_loop_counter = 0;
var game_loop_speed_threshhold = 50;
var game_loop_speed_value = 5;
var game_loop_speed = 0;

var IX = (typer.width / 2) - 16;
var IY = (typer.height - 72);

var word_is_selected = false;
var selected_word_id = -1;

var sphere_explosion_angle = 0;
var current_bullet_id = 0;
var bullet = [];
var bullets = 0;
var bullet_velocity = 25;

var start = new Date().getTime();
var end = new Date().getTime();
var elapsed = 0;
var elapsedChars = 0;

var wordList = [];

$(document).ready(function () {
    /* bullet sound */
    sound_bullet[0] = document.getElementById("bullet");
    /* missile hit sound */
    sound_hit[0] = document.getElementById("hit");
    /* base hit sound */
    sound_atomic[0] = document.getElementById("atomic");

    /* set up the playground */
    initialize_playground();

    /* game over */
    game_over();

    /* add listener for the start button */
    $("#start_btn").click(function (e) {
        if ($(this).hasClass("disabled")) {
            e.preventDefault();
        } else {
            /* get the grade level */
            var gradeLevel = $("#grade_level_selector").val();
            /* get the difficulty level */
            var difficultyLevel = $("#difficulty_level_selector").val();
            /* get the interface type */
            var interfaceType = $("#interface_type_selector").val();
            start_game(gradeLevel, difficultyLevel, interfaceType);
            $(this).addClass("disabled");
        }
    });
});

function start_game(gradeLevel, difficultyLevel, interfaceType) {
    switch (interfaceType) {
        case 'data array':
            start_game_using_data_array(gradeLevel, difficultyLevel);
            break;
        case 'http file download':
            start_game_using_http_file_download(gradeLevel, difficultyLevel);
            break;
        case 'web page data':
            start_game_using_web_page(gradeLevel, difficultyLevel);
            break;
        case 'web service':
            start_game_using_webservice(gradeLevel, difficultyLevel);
            break;
    }
}

// HARD-CODED WORD LIST
var wordLists = [];
wordLists.push('[{"word":"dummy"}]');
wordLists.push('[{"word":"a"},{"word":"all"},{"word":"am"},{"word":"and"},{"word":"at"},{"word":"ball"},{"word":"be"},{"word":"bed"},{"word":"big"},{"word":"book"},{"word":"box"},{"word":"boy"},{"word":"but"},{"word":"came"},{"word":"can"},{"word":"car"},{"word":"cat"},{"word":"come"},{"word":"cow"},{"word":"dad"},{"word":"day"},{"word":"did"},{"word":"do"},{"word":"dog"},{"word":"fat"},{"word":"for"},{"word":"fun"},{"word":"get"},{"word":"go"},{"word":"good"},{"word":"got"},{"word":"had"},{"word":"hat"},{"word":"he"},{"word":"hen"},{"word":"here"},{"word":"him"},{"word":"his"},{"word":"home"},{"word":"hot"},{"word":"I"},{"word":"if"},{"word":"in"},{"word":"into"},{"word":"is"},{"word":"it"},{"word":"its"},{"word":"let"},{"word":"like"},{"word":"look"},{"word":"man"},{"word":"may"},{"word":"me"},{"word":"mom"},{"word":"my"},{"word":"no"},{"word":"not"},{"word":"of"},{"word":"oh"},{"word":"old"},{"word":"on"},{"word":"one"},{"word":"out"},{"word":"pan"},{"word":"pet"},{"word":"pig"},{"word":"play"},{"word":"ran"},{"word":"rat"},{"word":"red"},{"word":"ride"},{"word":"run"},{"word":"sat"},{"word":"see"},{"word":"she"},{"word":"sit"},{"word":"six"},{"word":"so"},{"word":"stop"},{"word":"sun"},{"word":"ten"},{"word":"the"},{"word":"this"},{"word":"to"},{"word":"top"},{"word":"toy"},{"word":"two"},{"word":"up"},{"word":"us"},{"word":"was"},{"word":"we"},{"word":"will"},{"word":"yes"},{"word":"you"}]');
wordLists.push('[{"word":"about"},{"word":"add"},{"word":"after"},{"word":"ago"},{"word":"an"},{"word":"any"},{"word":"apple"},{"word":"are"},{"word":"as"},{"word":"ask"},{"word":"ate"},{"word":"away"},{"word":"baby"},{"word":"back"},{"word":"bad"},{"word":"bag"},{"word":"base"},{"word":"bat"},{"word":"bee"},{"word":"been"},{"word":"before"},{"word":"being"},{"word":"best"},{"word":"bike"},{"word":"bill"},{"word":"bird"},{"word":"black"},{"word":"blue"},{"word":"boat"},{"word":"both"},{"word":"bring"},{"word":"brother"},{"word":"brown"},{"word":"bus"},{"word":"buy"},{"word":"by"},{"word":"cake"},{"word":"call"},{"word":"candy"},{"word":"change"},{"word":"child"},{"word":"city"},{"word":"clean"},{"word":"club"},{"word":"coat"},{"word":"cold"},{"word":"coming"},{"word":"corn"},{"word":"could"},{"word":"cry"},{"word":"cup"},{"word":"cut"},{"word":"daddy"},{"word":"dear"},{"word":"deep"},{"word":"deer"},{"word":"doing"},{"word":"doll"},{"word":"door"},{"word":"down"},{"word":"dress"},{"word":"drive"},{"word":"drop"},{"word":"dry"},{"word":"duck"},{"word":"each"},{"word":"eat"},{"word":"eating"},{"word":"egg"},{"word":"end"},{"word":"fall"},{"word":"far"},{"word":"farm"},{"word":"fast"},{"word":"father"},{"word":"feed"},{"word":"feel"},{"word":"feet"},{"word":"fell"},{"word":"find"},{"word":"fine"},{"word":"fire"},{"word":"first"},{"word":"fish"},{"word":"five"},{"word":"fix"},{"word":"flag"},{"word":"floor"},{"word":"fly"},{"word":"food"},{"word":"foot"},{"word":"four"},{"word":"fox"},{"word":"from"},{"word":"full"},{"word":"funny"},{"word":"game"},{"word":"gas"},{"word":"gave"},{"word":"girl"},{"word":"give"},{"word":"glad"},{"word":"goat"},{"word":"goes"},{"word":"going"},{"word":"gold"},{"word":"gone"},{"word":"grade"},{"word":"grass"},{"word":"green"},{"word":"grow"},{"word":"hand"},{"word":"happy"},{"word":"hard"},{"word":"has"},{"word":"have"},{"word":"hear"},{"word":"help"},{"word":"here"},{"word":"hill"},{"word":"hit"},{"word":"hold"},{"word":"hole"},{"word":"hop"},{"word":"hope "},{"word":"horse "},{"word":"house"},{"word":"how "},{"word":"ice "},{"word":"inch "},{"word":"inside"},{"word":"job "},{"word":"jump "},{"word":"just "},{"word":"keep "},{"word":"king "},{"word":"know "},{"word":"lake "},{"word":"land "},{"word":"last "},{"word":"late "},{"word":"lay"},{"word":"left "},{"word":"leg "},{"word":"light "},{"word":"line "},{"word":"little "},{"word":"live"},{"word":"lives "},{"word":"long"},{"word":"looking "},{"word":"lost "},{"word":"lot "},{"word":"love"},{"word":"mad "},{"word":"made "},{"word":"make "},{"word":"many "},{"word":"meat "},{"word":"men "},{"word":"met"},{"word":"mile "},{"word":"milk "},{"word":"mine"},{"word":"miss"},{"word":"moon"},{"word":"more"},{"word":"most"},{"word":"mother"},{"word":"move"},{"word":"much"},{"word":"must"},{"word":"myself"},{"word":"nail"},{"word":"name "},{"word":"need"},{"word":"new"},{"word":"next"},{"word":"nice"},{"word":"night"},{"word":"nine"},{"word":"north"},{"word":"now"},{"word":"nut"},{"word":"off"},{"word":"only"},{"word":"open"},{"word":"or"},{"word":"other"},{"word":"our"},{"word":"outside"},{"word":"over"},{"word":"page"},{"word":"park"},{"word":"part"},{"word":"pay"},{"word":"pick"},{"word":"plant"},{"word":"playing"},{"word":"pony"},{"word":"post"},{"word":"pull"},{"word":"put"},{"word":"rabbit"},{"word":"rain"},{"word":"read"},{"word":"rest"},{"word":"riding"},{"word":"road"},{"word":"rock"},{"word":"room"},{"word":"said"},{"word":"same"},{"word":"sang"},{"word":"saw"},{"word":"say"},{"word":"school"},{"word":"sea"},{"word":"seat"},{"word":"seem"},{"word":"seen"},{"word":"send"},{"word":"set"},{"word":"seven"},{"word":"sheep"},{"word":"ship"},{"word":"shoe"},{"word":"show"},{"word":"sick"},{"word":"side"},{"word":"sing"},{"word":"sky"},{"word":"sleep"},{"word":"small"},{"word":"snow"},{"word":"some"},{"word":"soon"},{"word":"spell"},{"word":"start"},{"word":"stay"},{"word":"still"},{"word":"store"},{"word":"story"},{"word":"take"},{"word":"talk"},{"word":"tall"},{"word":"teach"},{"word":"tell"},{"word":"than"},{"word":"thank"},{"word":"that"},{"word":"them"},{"word":"then"},{"word":"there"},{"word":"they"},{"word":"thing"},{"word":"think"},{"word":"three"},{"word":"time"},{"word":"today"},{"word":"told"},{"word":"too"},{"word":"took"},{"word":"train"},{"word":"tree"},{"word":"truck"},{"word":"try"},{"word":"use"},{"word":"very"},{"word":"walk"},{"word":"want"},{"word":"warm"},{"word":"wash"},{"word":"way"},{"word":"week"},{"word":"well"},{"word":"went"},{"word":"were"},{"word":"wet"},{"word":"what"},{"word":"when"},{"word":"while"},{"word":"white"},{"word":"who"},{"word":"why"},{"word":"wind"},{"word":"wish"},{"word":"with"},{"word":"woke"},{"word":"wood"},{"word":"work"},{"word":"yellow"},{"word":"yet"},{"word":"your"},{"word":"zoo"}]');
wordLists.push('[{"word":"able"},{"word":"above"},{"word":"afraid"},{"word":"afternoon"},{"word":"again"},{"word":"age"},{"word":"air"},{"word":"airplane"},{"word":"almost"},{"word":"alone"},{"word":"along"},{"word":"already"},{"word":"also"},{"word":"always"},{"word":"animal"},{"word":"another"},{"word":"anything"},{"word":"around"},{"word":"art"},{"word":"aunt"},{"word":"balloon"},{"word":"bark"},{"word":"barn"},{"word":"basket"},{"word":"beach"},{"word":"bear"},{"word":"because"},{"word":"become"},{"word":"began"},{"word":"begin"},{"word":"behind"},{"word":"believe"},{"word":"below"},{"word":"belt"},{"word":"better"},{"word":"birthday"},{"word":"body"},{"word":"bones"},{"word":"born"},{"word":"bought"},{"word":"bread"},{"word":"bright"},{"word":"broke"},{"word":"brought"},{"word":"busy"},{"word":"cabin"},{"word":"cage"},{"word":"camp"},{"word":"can\'t"},{"word":"care"},{"word":"carry"},{"word":"catch"},{"word":"cattle"},{"word":"cave"},{"word":"children"},{"word":"class"},{"word":"close"},{"word":"cloth"},{"word":"coal"},{"word":"color"},{"word":"corner"},{"word":"cotton"},{"word":"cover"},{"word":"dark"},{"word":"desert"},{"word":"didn\'t"},{"word":"dinner"},{"word":"dishes"},{"word":"does"},{"word":"done"},{"word":"don\'t"},{"word":"dragon"},{"word":"draw"},{"word":"dream"},{"word":"drink"},{"word":"early"},{"word":"earth"},{"word":"east"},{"word":"eight"},{"word":"even"},{"word":"ever"},{"word":"every"},{"word":"everyone"},{"word":"everything"},{"word":"eyes"},{"word":"face"},{"word":"family"},{"word":"feeling"},{"word":"felt"},{"word":"few"},{"word":"fight"},{"word":"fishing"},{"word":"flower"},{"word":"flying"},{"word":"follow"},{"word":"forest"},{"word":"forgot"},{"word":"form"},{"word":"found"},{"word":"fourth"},{"word":"free"},{"word":"Friday"},{"word":"friend"},{"word":"front"},{"word":"getting"},{"word":"given"},{"word":"grandmother"},{"word":"great"},{"word":"grew"},{"word":"ground"},{"word":"guess"},{"word":"hair"},{"word":"half"},{"word":"having"},{"word":"head"},{"word":"heard"},{"word":"he\'s"},{"word":"heat"},{"word":"hello"},{"word":"high"},{"word":"himself"},{"word":"hour"},{"word":"hundred"},{"word":"hurry"},{"word":"hurt"},{"word":"I\'d"},{"word":"I\'ll"},{"word":"I\'m"},{"word":"inches"},{"word":"isn\'t"},{"word":"it\'s"},{"word":"I\'ve"},{"word":"kept"},{"word":"kids"},{"word":"kind"},{"word":"kitten"},{"word":"knew"},{"word":"knife"},{"word":"lady"},{"word":"large"},{"word":"largest"},{"word":"later"},{"word":"learn"},{"word":"leave"},{"word":"let\'s"},{"word":"letter"},{"word":"life"},{"word":"list"},{"word":"living"},{"word":"lovely"},{"word":"loving"},{"word":"lunch"},{"word":"mail"},{"word":"making"},{"word":"maybe"},{"word":"mean"},{"word":"merry"},{"word":"might"},{"word":"mind"},{"word":"money"},{"word":"month"},{"word":"morning"},{"word":"mouse"},{"word":"mouth"},{"word":"Mr."},{"word":"Mrs."},{"word":"Ms."},{"word":"music"},{"word":"near"},{"word":"nearly"},{"word":"never"},{"word":"news"},{"word":"noise"},{"word":"nothing"},{"word":"number"},{"word":"o\'clock"},{"word":"often"},{"word":"oil"},{"word":"once"},{"word":"orange"},{"word":"order"},{"word":"own"},{"word":"pair"},{"word":"paint"},{"word":"paper"},{"word":"party"},{"word":"pass"},{"word":"past"},{"word":"penny"},{"word":"people"},{"word":"person"},{"word":"picture"},{"word":"place"},{"word":"plan"},{"word":"plane"},{"word":"please"},{"word":"pocket"},{"word":"point"},{"word":"poor"},{"word":"race"},{"word":"reach"},{"word":"reading"},{"word":"ready"},{"word":"real"},{"word":"rich"},{"word":"right"},{"word":"river"},{"word":"rocket"},{"word":"rode"},{"word":"round"},{"word":"rule"},{"word":"running"},{"word":"salt"},{"word":"says"},{"word":"sending"},{"word":"sent"},{"word":"seventh"},{"word":"sew"},{"word":"shall"},{"word":"short"},{"word":"shot"},{"word":"should"},{"word":"sight"},{"word":"sister"},{"word":"sitting"},{"word":"sixth"},{"word":"sled"},{"word":"smoke"},{"word":"soap"},{"word":"someone"},{"word":"something"},{"word":"sometime"},{"word":"song"},{"word":"sorry"},{"word":"sound"},{"word":"south"},{"word":"space"},{"word":"spelling"},{"word":"spent"},{"word":"sport"},{"word":"spring"},{"word":"stairs"},{"word":"stand"},{"word":"state"},{"word":"step"},{"word":"stick"},{"word":"stood"},{"word":"stopped"},{"word":"stove"},{"word":"street"},{"word":"strong"},{"word":"study"},{"word":"such"},{"word":"sugar"},{"word":"summer"},{"word":"Sunday"},{"word":"supper"},{"word":"table"},{"word":"taken"},{"word":"taking"},{"word":"talking"},{"word":"teacher"},{"word":"team"},{"word":"teeth"},{"word":"tenth"},{"word":"that\'s"},{"word":"their"},{"word":"these"},{"word":"thinking"},{"word":"third"},{"word":"those"},{"word":"thought"},{"word":"throw"},{"word":"tonight"},{"word":"trade"},{"word":"trick"},{"word":"trip"},{"word":"trying"},{"word":"turn"},{"word":"twelve"},{"word":"twenty"},{"word":"uncle"},{"word":"under"},{"word":"upon"},{"word":"wagon"},{"word":"wait"},{"word":"walking"},{"word":"wasn\'t"},{"word":"watch"},{"word":"water"},{"word":"weather"},{"word":"we\'re"},{"word":"west"},{"word":"wheat"},{"word":"where"},{"word":"which"},{"word":"wife"},{"word":"wild"},{"word":"win"},{"word":"window"},{"word":"winter"},{"word":"without"},{"word":"woman"},{"word":"won"},{"word":"won\'t"},{"word":"wool"},{"word":"word"},{"word":"working"},{"word":"world"},{"word":"would"},{"word":"write"},{"word":"wrong"},{"word":"yard"},{"word":"year"},{"word":"yesterday"},{"word":"you\'re"}]');
wordLists.push('[{"word":"against"},{"word":"angriest"},{"word":"attack"},{"word":"beauty"},{"word":"between"},{"word":"bounce"},{"word":"brought"},{"word":"button"},{"word":"caring"},{"word":"chance"},{"word":"choice"},{"word":"cities"},{"word":"common"},{"word":"couch"},{"word":"cover"},{"word":"crowd"},{"word":"danger"},{"word":"decide"},{"word":"disappear"},{"word":"drain"},{"word":"easier"},{"word":"enough"},{"word":"famous"},{"word":"few"},{"word":"forever"},{"word":"fruit"},{"word":"gentle"},{"word":"grandmother"},{"word":"happiest"},{"word":"hiking"},{"word":"hour"},{"word":"hurry"},{"word":"jacket"},{"word":"kitchen"},{"word":"listen"},{"word":"meant"},{"word":"moment"},{"word":"nickel"},{"word":"o\'clock"},{"word":"paper"},{"word":"pencil"},{"word":"pleasing"},{"word":"question"},{"word":"railroad"},{"word":"return"},{"word":"round"},{"word":"search"},{"word":"sharp"},{"word":"sigh"},{"word":"sixth"},{"word":"soften"},{"word":"steel"},{"word":"suppose"},{"word":"towel"},{"word":"uncle"},{"word":"visit"},{"word":"whether"},{"word":"worried"},{"word":"yourself"},{"word":"agree"},{"word":"alley"},{"word":"angry"},{"word":"aunt"},{"word":"become"},{"word":"blanket"},{"word":"breath"},{"word":"bubble"},{"word":"buying"},{"word":"carrying"},{"word":"charge"},{"word":"choose"},{"word":"clothing"},{"word":"copy"},{"word":"cough"},{"word":"crayon"},{"word":"crumb"},{"word":"dawn"},{"word":"degree"},{"word":"dislike"},{"word":"drawer"},{"word":"eighty"},{"word":"evening"},{"word":"fear"},{"word":"fifth"},{"word":"forgive"},{"word":"gain"},{"word":"giant"},{"word":"groceries"},{"word":"he\'ll"},{"word":"holiday"},{"word":"however"},{"word":"husband"},{"word":"jaw"},{"word":"kneel"},{"word":"lonely"},{"word":"medal"},{"word":"monkey"},{"word":"ninety"},{"word":"obeyed"},{"word":"parent"},{"word":"perfect"},{"word":"police"},{"word":"quiet"},{"word":"reach"},{"word":"ridge"},{"word":"ruler"},{"word":"season"},{"word":"she\'ll"},{"word":"sign"},{"word":"sixty"},{"word":"spare"},{"word":"strange"},{"word":"tennis"},{"word":"tube"},{"word":"understand"},{"word":"wait"},{"word":"wife"},{"word":"wrist"},{"word":"zebra"},{"word":"airport"},{"word":"alphabet"},{"word":"animal"},{"word":"banana"},{"word":"beggar"},{"word":"blood"},{"word":"bridge"},{"word":"building"},{"word":"calf"},{"word":"catch"},{"word":"cheer"},{"word":"chore"},{"word":"coast"},{"word":"corner"},{"word":"couldn\'t"},{"word":"crime"},{"word":"curl"},{"word":"deaf"},{"word":"deliver"},{"word":"divide"},{"word":"earlier"},{"word":"either"},{"word":"except"},{"word":"feather"},{"word":"fifty"},{"word":"forty"},{"word":"garden"},{"word":"glance"},{"word":"grown"},{"word":"he\'s"},{"word":"honey"},{"word":"howl"},{"word":"important"},{"word":"judge"},{"word":"knight"},{"word":"loyal"},{"word":"middle"},{"word":"movement"},{"word":"ninth"},{"word":"odd"},{"word":"paste"},{"word":"picture"},{"word":"powerful"},{"word":"quilt"},{"word":"ready"},{"word":"roast"},{"word":"safe"},{"word":"self"},{"word":"she\'s"},{"word":"simple"},{"word":"sleeve"},{"word":"special"},{"word":"studied"},{"word":"thirty"},{"word":"tuna"},{"word":"useful"},{"word":"weather"},{"word":"wonder"},{"word":"worse"},{"word":"zero"},{"word":"alarm"},{"word":"although"},{"word":"answer"},{"word":"battle"},{"word":"believe"},{"word":"bottle"},{"word":"broke"},{"word":"built"},{"word":"camera"},{"word":"center"},{"word":"chicken"},{"word":"chose"},{"word":"coin"},{"word":"cottage"},{"word":"couple"},{"word":"crooked"},{"word":"dairy"},{"word":"dear"},{"word":"didn\'t"},{"word":"double"},{"word":"earn"},{"word":"electric"},{"word":"faint"},{"word":"felt"},{"word":"final"},{"word":"fourth"},{"word":"gasoline"},{"word":"gold"},{"word":"guard"},{"word":"health"},{"word":"honor"},{"word":"hundred"},{"word":"interest"},{"word":"juice"},{"word":"libraries"},{"word":"machine"},{"word":"mirror"},{"word":"neighbor"},{"word":"no one"},{"word":"office"},{"word":"path"},{"word":"planet"},{"word":"proper"},{"word":"quit"},{"word":"reason"},{"word":"roof"},{"word":"sauce"},{"word":"seventh"},{"word":"shout"},{"word":"since"},{"word":"smooth"},{"word":"squirrel"},{"word":"studying"},{"word":"thumb"},{"word":"twenty"},{"word":"useless"},{"word":"weight"},{"word":"wood"},{"word":"wouldn\'t"},{"word":"zipper"},{"word":"alive"},{"word":"always"},{"word":"asleep"},{"word":"beautiful"},{"word":"belong"},{"word":"bought"},{"word":"broken"},{"word":"busy"},{"word":"cardboard"},{"word":"certain"},{"word":"chief"},{"word":"circle"},{"word":"comb"},{"word":"cotton"},{"word":"cousin"},{"word":"crow"},{"word":"damage"},{"word":"death"},{"word":"dirty"},{"word":"downstairs"},{"word":"earth"},{"word":"engine"},{"word":"FALSE"},{"word":"fever"},{"word":"follow"},{"word":"fright"},{"word":"gather"},{"word":"grandfather"},{"word":"handsome"},{"word":"heard"},{"word":"hospital"},{"word":"hungry"},{"word":"invite"},{"word":"kindness"},{"word":"library"},{"word":"mailbox"},{"word":"mistake"},{"word":"neither"},{"word":"nobody"},{"word":"often"},{"word":"peaceful"},{"word":"playground"},{"word":"public"},{"word":"quite"},{"word":"remember"},{"word":"rough"},{"word":"scrap"},{"word":"seventy"},{"word":"sidewalk"},{"word":"sink"},{"word":"sneeze"},{"word":"steal"},{"word":"style"},{"word":"tool"},{"word":"twice"},{"word":"village"},{"word":"whenever"},{"word":"world"},{"word":"written"},{"word":"zoo5"}]');
wordLists.push('[{"word":"action"},{"word":"allowed"},{"word":"annual"},{"word":"beginning"},{"word":"capitol"},{"word":"celebrate"},{"word":"climate"},{"word":"condition"},{"word":"continued"},{"word":"curtain"},{"word":"delicious"},{"word":"dictionary"},{"word":"disappoint"},{"word":"energy"},{"word":"exact"},{"word":"express"},{"word":"finished"},{"word":"future"},{"word":"grasp"},{"word":"happened"},{"word":"hoarse"},{"word":"increase"},{"word":"interesting"},{"word":"jungle"},{"word":"length"},{"word":"mammal"},{"word":"melody"},{"word":"million"},{"word":"natural"},{"word":"notebook"},{"word":"observe"},{"word":"oxygen"},{"word":"pause"},{"word":"phone"},{"word":"poison"},{"word":"president"},{"word":"program"},{"word":"puzzle"},{"word":"rarely"},{"word":"region"},{"word":"repeat"},{"word":"rhythm"},{"word":"scale"},{"word":"separate"},{"word":"shelter"},{"word":"similar"},{"word":"soar"},{"word":"split"},{"word":"stain"},{"word":"stomach"},{"word":"stretched"},{"word":"sure"},{"word":"syllable"},{"word":"terrible"},{"word":"toward"},{"word":"triangle"},{"word":"unknown"},{"word":"weigh"},{"word":"whoever"},{"word":"wonderful"},{"word":"actor"},{"word":"aloud"},{"word":"appointed"},{"word":"bruise"},{"word":"captain"},{"word":"century"},{"word":"climbed"},{"word":"consider"},{"word":"country"},{"word":"daughter"},{"word":"desert"},{"word":"difference"},{"word":"division"},{"word":"enjoyment"},{"word":"except"},{"word":"factory"},{"word":"forward"},{"word":"general"},{"word":"grease"},{"word":"happily"},{"word":"human"},{"word":"indicate"},{"word":"inventor"},{"word":"knives"},{"word":"limb"},{"word":"manufacture"},{"word":"members"},{"word":"minor"},{"word":"necessary"},{"word":"notice"},{"word":"opposite"},{"word":"paid"},{"word":"payment"},{"word":"phrase"},{"word":"position"},{"word":"probably"},{"word":"promise"},{"word":"quickly"},{"word":"rather"},{"word":"relax"},{"word":"report"},{"word":"rising"},{"word":"scent"},{"word":"service"},{"word":"shoulder"},{"word":"sincerely"},{"word":"soil"},{"word":"spoiled"},{"word":"state"},{"word":"stopping"},{"word":"suggest"},{"word":"surface"},{"word":"syrup"},{"word":"though"},{"word":"traffic"},{"word":"trouble"},{"word":"usually"},{"word":"weight"},{"word":"whole"},{"word":"wound"},{"word":"actually"},{"word":"amendment"},{"word":"arrange"},{"word":"business"},{"word":"carefully"},{"word":"chemical"},{"word":"collar"},{"word":"consonant"},{"word":"course"},{"word":"daytime"},{"word":"dessert"},{"word":"different"},{"word":"eighth"},{"word":"equal"},{"word":"expect"},{"word":"fault"},{"word":"fought"},{"word":"government"},{"word":"grown-ups"},{"word":"harvest"},{"word":"idea"},{"word":"information"},{"word":"island"},{"word":"known"},{"word":"located"},{"word":"material"},{"word":"memories"},{"word":"modern"},{"word":"neither"},{"word":"noun"},{"word":"orphan"},{"word":"paint"},{"word":"perhaps"},{"word":"pleasant"},{"word":"possible"},{"word":"problem"},{"word":"property"},{"word":"quietly"},{"word":"reached"},{"word":"remain"},{"word":"represent"},{"word":"ruin"},{"word":"schedule"},{"word":"settled"},{"word":"shouted"},{"word":"single"},{"word":"solution"},{"word":"sports"},{"word":"statement"},{"word":"straight"},{"word":"suitcase"},{"word":"surprise"},{"word":"tablet"},{"word":"thoughtful"},{"word":"trail"},{"word":"tunnel"},{"word":"value"},{"word":"weird"},{"word":"whose"},{"word":"wreck"},{"word":"addition"},{"word":"amount"},{"word":"attention"},{"word":"calves"},{"word":"caught"},{"word":"chocolate"},{"word":"column"},{"word":"constant"},{"word":"crystal"},{"word":"decided"},{"word":"details"},{"word":"difficult"},{"word":"election"},{"word":"equation"},{"word":"explain"},{"word":"favorite"},{"word":"fraction"},{"word":"graceful"},{"word":"guest"},{"word":"healthy"},{"word":"imagine"},{"word":"instrument"},{"word":"jewel"},{"word":"language"},{"word":"lumber"},{"word":"mayor"},{"word":"message"},{"word":"mountain"},{"word":"newspaper"},{"word":"numeral"},{"word":"ought"},{"word":"paragraph"},{"word":"period"},{"word":"pleasure"},{"word":"practice"},{"word":"process"},{"word":"protection"},{"word":"radio"},{"word":"receive"},{"word":"remove"},{"word":"respond"},{"word":"salad"},{"word":"science"},{"word":"several"},{"word":"shower"},{"word":"size"},{"word":"solve"},{"word":"square"},{"word":"station"},{"word":"straighten"},{"word":"sunset"},{"word":"surround"},{"word":"tasty"},{"word":"thrown"},{"word":"treasure"},{"word":"type"},{"word":"various"},{"word":"western"},{"word":"wives"},{"word":"x-ray"},{"word":"agreed"},{"word":"amusement"},{"word":"awhile"},{"word":"capital"},{"word":"cause"},{"word":"circle"},{"word":"company"},{"word":"continent"},{"word":"current"},{"word":"decimal"},{"word":"determine"},{"word":"direction"},{"word":"elements"},{"word":"errands"},{"word":"explode"},{"word":"finally"},{"word":"furniture"},{"word":"graph"},{"word":"guide"},{"word":"height"},{"word":"include"},{"word":"intention"},{"word":"journey"},{"word":"laughter"},{"word":"major"},{"word":"measure"},{"word":"method"},{"word":"music"},{"word":"northern"},{"word":"object"},{"word":"outside"},{"word":"pattern"},{"word":"permit"},{"word":"plural"},{"word":"prepared"},{"word":"produce"},{"word":"provide"},{"word":"raise"},{"word":"record"},{"word":"repay"},{"word":"result"},{"word":"sandal"},{"word":"section"},{"word":"shadow"},{"word":"signal"},{"word":"slippery"},{"word":"southern"},{"word":"squeeze"},{"word":"steer"},{"word":"stream"},{"word":"supply"},{"word":"sweater"},{"word":"teaspoon"},{"word":"tornado"},{"word":"treatment"},{"word":"understood"},{"word":"warn"},{"word":"whisper"},{"word":"women"},{"word":"yesterday"}]');
wordLists.push('[{"word":"accept"},{"word":"ancient"},{"word":"audience"},{"word":"blown"},{"word":"canyon"},{"word":"ceiling"},{"word":"combination"},{"word":"concentration"},{"word":"contagious"},{"word":"coupon"},{"word":"culture"},{"word":"demonstrate"},{"word":"depth"},{"word":"discussion"},{"word":"echoes"},{"word":"element"},{"word":"emptiness"},{"word":"entrance"},{"word":"establish"},{"word":"exercise"},{"word":"faucet"},{"word":"forgetting"},{"word":"frighten"},{"word":"gaze"},{"word":"grateful"},{"word":"hangar"},{"word":"heroes"},{"word":"hunger"},{"word":"immediate"},{"word":"ingredient"},{"word":"instruction"},{"word":"invitation"},{"word":"knowledge"},{"word":"liberty"},{"word":"location"},{"word":"manor"},{"word":"medicine"},{"word":"mistaken"},{"word":"multiple"},{"word":"mute"},{"word":"noisy"},{"word":"obtain"},{"word":"original"},{"word":"patient"},{"word":"performance"},{"word":"piano"},{"word":"policy"},{"word":"potatoes"},{"word":"prevent"},{"word":"pumpkins"},{"word":"radius"},{"word":"recently"},{"word":"regardless"},{"word":"relieve"},{"word":"replacement"},{"word":"rescue"},{"word":"review"},{"word":"rural"},{"word":"satisfy"},{"word":"selection"},{"word":"serious"},{"word":"shorten"},{"word":"skillful"},{"word":"sponge"},{"word":"strategy"},{"word":"studios"},{"word":"surrounded"},{"word":"television"},{"word":"therefore"},{"word":"tomatoes"},{"word":"underneath"},{"word":"variety"},{"word":"vein"},{"word":"waste"},{"word":"wrinkle"},{"word":"accidentally"},{"word":"appearance"},{"word":"autumn"},{"word":"bough"},{"word":"capable"},{"word":"champion"},{"word":"comfortable"},{"word":"concern"},{"word":"conversation"},{"word":"creative"},{"word":"curious"},{"word":"denominator"},{"word":"descendant"},{"word":"distance"},{"word":"edition"},{"word":"elevator"},{"word":"encouragement"},{"word":"envelope"},{"word":"example"},{"word":"experience"},{"word":"fierce"},{"word":"forgiveness"},{"word":"fuel"},{"word":"gesture"},{"word":"grief"},{"word":"hanger"},{"word":"history"},{"word":"hyphen"},{"word":"importance"},{"word":"injury"},{"word":"intermission"},{"word":"involve"},{"word":"lawyer"},{"word":"liquid"},{"word":"luggage"},{"word":"marriage"},{"word":"mention"},{"word":"misunderstand"},{"word":"muscle"},{"word":"myth"},{"word":"noticeable"},{"word":"occur"},{"word":"outline"},{"word":"penalty"},{"word":"personal"},{"word":"plumber"},{"word":"pollute"},{"word":"predict"},{"word":"principal"},{"word":"purchase"},{"word":"rapid"},{"word":"recycle"},{"word":"regular"},{"word":"remarkable"},{"word":"replied"},{"word":"resident"},{"word":"roam"},{"word":"safety"},{"word":"scarcely"},{"word":"senior"},{"word":"session"},{"word":"silent"},{"word":"solar"},{"word":"squawk"},{"word":"strength"},{"word":"success"},{"word":"sword"},{"word":"temperature"},{"word":"thicken"},{"word":"trophies"},{"word":"unite"},{"word":"vary"},{"word":"violence"},{"word":"who\'s"},{"word":"yield"},{"word":"acquire"},{"word":"appointment"},{"word":"beautifully"},{"word":"bows"},{"word":"capacity"},{"word":"choir"},{"word":"community"},{"word":"connection"},{"word":"cooperation"},{"word":"creature"},{"word":"dangerous"},{"word":"department"},{"word":"disagreement"},{"word":"distributed"},{"word":"educate"},{"word":"emergency"},{"word":"encyclopedia"},{"word":"equator"},{"word":"excellent"},{"word":"exterior"},{"word":"fireproof"},{"word":"fossil"},{"word":"further"},{"word":"governor"},{"word":"halves"},{"word":"happiness"},{"word":"honorable"},{"word":"ignore"},{"word":"improvement"},{"word":"inquire"},{"word":"interview"},{"word":"jealous"},{"word":"league"},{"word":"listening"},{"word":"manager"},{"word":"meant"},{"word":"minus"},{"word":"mixture"},{"word":"museum"},{"word":"nationality"},{"word":"novel"},{"word":"official"},{"word":"partial"},{"word":"penguin"},{"word":"persuade"},{"word":"poem"},{"word":"pollution"},{"word":"prefer"},{"word":"private"},{"word":"purse"},{"word":"ratio"},{"word":"reduce"},{"word":"rehearse"},{"word":"remind"},{"word":"reply"},{"word":"resources"},{"word":"routine"},{"word":"sailor"},{"word":"scientific"},{"word":"sentence"},{"word":"shampoo"},{"word":"simply"},{"word":"sought"},{"word":"storage"},{"word":"strive"},{"word":"suggestion"},{"word":"system"},{"word":"theme"},{"word":"thousand"},{"word":"tutor"},{"word":"vacuum"},{"word":"vault"},{"word":"visible"},{"word":"whose"},{"word":"ambulance"},{"word":"arithmetic"},{"word":"beliefs"},{"word":"calendar"},{"word":"caution"},{"word":"cleanse"},{"word":"complain"},{"word":"constitution"},{"word":"correct"},{"word":"crisis"},{"word":"decision"},{"word":"departure"},{"word":"disastrous"},{"word":"earliest"},{"word":"electricity"},{"word":"employer"},{"word":"entire"},{"word":"especially"},{"word":"excitement"},{"word":"familiar"},{"word":"following"},{"word":"freight"},{"word":"gallon"},{"word":"graduation"},{"word":"hamburger"},{"word":"headache"},{"word":"horizon"},{"word":"imagination"},{"word":"independence"},{"word":"instead"},{"word":"invisible"},{"word":"junior"},{"word":"legal"},{"word":"loaves"},{"word":"manner"},{"word":"mechanic"},{"word":"minute"},{"word":"mourn"},{"word":"musician"},{"word":"negative"},{"word":"numerator"},{"word":"operate"},{"word":"passenger"},{"word":"percent"},{"word":"physical"},{"word":"poet"},{"word":"positive"},{"word":"pressure"},{"word":"project"},{"word":"quote"},{"word":"realize"},{"word":"referred"},{"word":"relief"},{"word":"remote"},{"word":"requirement"},{"word":"respectful"},{"word":"rumor"},{"word":"salute"},{"word":"scissors"},{"word":"separately"},{"word":"shelves"},{"word":"sketch"},{"word":"spaghetti"},{"word":"strain"},{"word":"struggle"},{"word":"support"},{"word":"telephone"},{"word":"themselves"},{"word":"threat"},{"word":"unbelievable"},{"word":"vain"},{"word":"vegetable"},{"word":"vision"},{"word":"wrestle"}]');
wordLists.push('[{"word":"abandon"},{"word":"absorb"},{"word":"accomplishment"},{"word":"adequate"},{"word":"advice"},{"word":"alternative"},{"word":"ancestor"},{"word":"assistance"},{"word":"attendance"},{"word":"baggage"},{"word":"biscuit"},{"word":"bouquet"},{"word":"bureau"},{"word":"capable"},{"word":"celery"},{"word":"character"},{"word":"committed"},{"word":"competent"},{"word":"compliment"},{"word":"conductor"},{"word":"controlling"},{"word":"deceive"},{"word":"descendent"},{"word":"discourage"},{"word":"dreadful"},{"word":"embarrass"},{"word":"enclosing"},{"word":"environment"},{"word":"evident"},{"word":"expensive"},{"word":"extremely"},{"word":"fatigue"},{"word":"frequently"},{"word":"gossiping"},{"word":"grievance"},{"word":"heroic"},{"word":"humid"},{"word":"idle"},{"word":"imaginary"},{"word":"inconvenient"},{"word":"influence"},{"word":"innocence"},{"word":"interruption"},{"word":"irresistible"},{"word":"kettle"},{"word":"legibly"},{"word":"media"},{"word":"morale"},{"word":"musician"},{"word":"nuisance"},{"word":"obedient"},{"word":"ordinarily"},{"word":"panic"},{"word":"paralysis"},{"word":"phantom"},{"word":"popular"},{"word":"privilege"},{"word":"puny"},{"word":"raspberry"},{"word":"recipe"},{"word":"reddest"},{"word":"rotten"},{"word":"secretary"},{"word":"sincerely"},{"word":"slumber"},{"word":"spacious"},{"word":"statistics"},{"word":"supervisor"},{"word":"tongue"},{"word":"transferred"},{"word":"traveling"},{"word":"unnecessary"},{"word":"version"},{"word":"violation"},{"word":"wealthy"},{"word":"abbreviation"},{"word":"abundant"},{"word":"accurate"},{"word":"adjustable"},{"word":"advise"},{"word":"amusement"},{"word":"anniversary"},{"word":"association"},{"word":"authority"},{"word":"benefited"},{"word":"bizarre"},{"word":"brilliant"},{"word":"campaign"},{"word":"capital"},{"word":"cemetery"},{"word":"cinnamon"},{"word":"committee"},{"word":"competition"},{"word":"compressor"},{"word":"confetti"},{"word":"cringe"},{"word":"delayed"},{"word":"description"},{"word":"disgraceful"},{"word":"economics"},{"word":"emotion"},{"word":"encounter"},{"word":"episode"},{"word":"exchange"},{"word":"extinct"},{"word":"fabricate"},{"word":"flagrant"},{"word":"fundamental"},{"word":"gradual"},{"word":"guarantee"},{"word":"hesitate"},{"word":"humility"},{"word":"idol"},{"word":"immediately"},{"word":"incredible"},{"word":"informant"},{"word":"innocent"},{"word":"introduction"},{"word":"jealousy"},{"word":"knitting"},{"word":"liquidation"},{"word":"mileage"},{"word":"mortgage"},{"word":"mysterious"},{"word":"nurture"},{"word":"obstacle"},{"word":"ordinary"},{"word":"panicked"},{"word":"paralyze"},{"word":"pheasant"},{"word":"precipitation"},{"word":"procedure"},{"word":"qualified"},{"word":"reasonable"},{"word":"recognition"},{"word":"reprimand"},{"word":"sandwich"},{"word":"securing"},{"word":"sincerity"},{"word":"smudge"},{"word":"specific"},{"word":"subscription"},{"word":"supposedly"},{"word":"tournament"},{"word":"transferring"},{"word":"unfortunately"},{"word":"valuable"},{"word":"vertical"},{"word":"visualize"},{"word":"weapon"},{"word":"absence"},{"word":"accessible"},{"word":"achievement"},{"word":"admit"},{"word":"afghan"},{"word":"analysis"},{"word":"appreciate"},{"word":"athlete"},{"word":"bacteria"},{"word":"benefiting"},{"word":"boulevard"},{"word":"brochure"},{"word":"cancellation"},{"word":"capitol"},{"word":"changeable"},{"word":"civilize"},{"word":"commotion"},{"word":"complement"},{"word":"concentrate"},{"word":"congratulations"},{"word":"culminate"},{"word":"democracy"},{"word":"diameter"},{"word":"dismissal"},{"word":"economy"},{"word":"emphasize"},{"word":"endurance"},{"word":"erosion"},{"word":"executive"},{"word":"extinguish"},{"word":"failure"},{"word":"foreign"},{"word":"genuine"},{"word":"graffiti"},{"word":"harass"},{"word":"horrify"},{"word":"hygiene"},{"word":"illegal"},{"word":"immobilize"},{"word":"individual"},{"word":"inhabit"},{"word":"instructor"},{"word":"involvement"},{"word":"judgment"},{"word":"laboratory"},{"word":"management"},{"word":"miniature"},{"word":"movement"},{"word":"negotiate"},{"word":"oases"},{"word":"obviously"},{"word":"organization"},{"word":"panicky"},{"word":"penicillin"},{"word":"phrase"},{"word":"principal"},{"word":"pronunciation"},{"word":"qualifying"},{"word":"receipt"},{"word":"recommend"},{"word":"resigned"},{"word":"scarcity"},{"word":"significance"},{"word":"situation"},{"word":"solemn"},{"word":"stationary"},{"word":"substitute"},{"word":"threatening"},{"word":"tragedy"},{"word":"transmitted"},{"word":"uniform"},{"word":"various"},{"word":"victim"},{"word":"volcano"},{"word":"wheeze"},{"word":"absolutely"},{"word":"accompanied"},{"word":"acres"},{"word":"admittance"},{"word":"alternate"},{"word":"analyze"},{"word":"artificial"},{"word":"atmosphere"},{"word":"bagel"},{"word":"bicycle"},{"word":"boundary"},{"word":"bulletin"},{"word":"candidate"},{"word":"category"},{"word":"chaperone"},{"word":"commercial"},{"word":"companion"},{"word":"complex"},{"word":"concentration"},{"word":"consequently"},{"word":"culprit"},{"word":"deodorant"},{"word":"diamond"},{"word":"distinguished"},{"word":"elementary"},{"word":"encircle"},{"word":"engineer"},{"word":"eruption"},{"word":"exhibit"},{"word":"extraordinary"},{"word":"fascinating"},{"word":"forfeit"},{"word":"ghetto"},{"word":"grammar"},{"word":"havoc"},{"word":"hospital"},{"word":"identical"},{"word":"illustration"},{"word":"impossibility"},{"word":"infamous"},{"word":"inherit"},{"word":"intelligent"},{"word":"irate"},{"word":"juvenile"},{"word":"language"},{"word":"maneuver"},{"word":"misbehaved"},{"word":"murmur"},{"word":"nervous"},{"word":"oasis"},{"word":"occasion"},{"word":"pamphlet"},{"word":"parallel"},{"word":"pedestrian"},{"word":"politely"},{"word":"principle"},{"word":"psychology"},{"word":"quotation"},{"word":"receiving"},{"word":"recruit"},{"word":"restaurant"},{"word":"scenery"},{"word":"simile"},{"word":"skeptical"},{"word":"souvenir"},{"word":"stationery"},{"word":"superintendent"},{"word":"tolerate"},{"word":"traitor"},{"word":"traveled"},{"word":"university"},{"word":"vehicle"},{"word":"vigorously"},{"word":"voyage"},{"word":"wilderness"}]');
wordLists.push('[{"word":"accommodate"},{"word":"accustomed"},{"word":"acquisition"},{"word":"adolescent"},{"word":"amateur"},{"word":"annoyance"},{"word":"antidote"},{"word":"apology"},{"word":"applicant"},{"word":"architect"},{"word":"asterisk"},{"word":"bachelor"},{"word":"belligerent"},{"word":"biannual"},{"word":"brilliance"},{"word":"cameos"},{"word":"catastrophe"},{"word":"characteristic"},{"word":"circumference"},{"word":"colleague"},{"word":"confiscation"},{"word":"considerable"},{"word":"continuous"},{"word":"counsel"},{"word":"critique"},{"word":"deficiency"},{"word":"deterrent"},{"word":"dilemma"},{"word":"discrepancy"},{"word":"endeavor"},{"word":"equilibrium"},{"word":"excessive"},{"word":"extricate"},{"word":"fiasco"},{"word":"flamboyant"},{"word":"frostbitten"},{"word":"grotesque"},{"word":"hazardous"},{"word":"horrific"},{"word":"inconvenience"},{"word":"inevitable"},{"word":"insufficient"},{"word":"internally"},{"word":"legitimate"},{"word":"longevity"},{"word":"luncheon"},{"word":"malicious"},{"word":"mercenary"},{"word":"meticulous"},{"word":"miscellaneous"},{"word":"necessity"},{"word":"newsstand"},{"word":"obesity"},{"word":"obstinate"},{"word":"optimism"},{"word":"pageant"},{"word":"parliament"},{"word":"permeate"},{"word":"personification"},{"word":"plaintiff"},{"word":"potential"},{"word":"predecessor"},{"word":"procrastinate"},{"word":"protein"},{"word":"questionnaire"},{"word":"recurrent"},{"word":"religious"},{"word":"sacrificial"},{"word":"schedule"},{"word":"scholar"},{"word":"shrine"},{"word":"snobbery"},{"word":"studious"},{"word":"surmise"},{"word":"taboo"},{"word":"tyranny"},{"word":"undernourished"},{"word":"unique"},{"word":"unsanitary"},{"word":"vacillate"},{"word":"vessel"},{"word":"vitamin"},{"word":"voracious"},{"word":"withhold"},{"word":"abstain"},{"word":"acoustics"},{"word":"acquittal"},{"word":"advantageous"},{"word":"amnesty"},{"word":"anonymous"},{"word":"antiseptic"},{"word":"apostrophe"},{"word":"approximate"},{"word":"arrangement"},{"word":"asthma"},{"word":"bankruptcy"},{"word":"berserk"},{"word":"bimonthly"},{"word":"budge"},{"word":"capably "},{"word":"chameleon"},{"word":"chauffeur"},{"word":"collaborate"},{"word":"colonel"},{"word":"conscious"},{"word":"contagious"},{"word":"correlation"},{"word":"criticism"},{"word":"crypt"},{"word":"desirable"},{"word":"diagnosis"},{"word":"disbursement"},{"word":"dominance"},{"word":"envious"},{"word":"erroneous"},{"word":"existence"},{"word":"facade"},{"word":"fibrous"},{"word":"forgery"},{"word":"glamorous"},{"word":"gymnasium"},{"word":"headquarters"},{"word":"hospitality"},{"word":"indulgence"},{"word":"innumerable"},{"word":"integrity"},{"word":"interrogate"},{"word":"leisure"},{"word":"lucrative"},{"word":"luxurious"},{"word":"malignant"},{"word":"mesmerize"},{"word":"metropolitan"},{"word":"mischievous"},{"word":"negligence"},{"word":"nostalgia"},{"word":"obscure"},{"word":"occurred"},{"word":"optimistic"},{"word":"parachute"},{"word":"penitentiary"},{"word":"perseverance"},{"word":"persuade"},{"word":"pneumonia"},{"word":"precipice"},{"word":"preferably"},{"word":"propeller"},{"word":"pseudonym"},{"word":"radioactive"},{"word":"rehearsal"},{"word":"roommate"},{"word":"sanctuary"},{"word":"scheme"},{"word":"semester"},{"word":"shuddering"},{"word":"solitary"},{"word":"subtlety"},{"word":"susceptible"},{"word":"technically"},{"word":"unacceptable"},{"word":"unduly"},{"word":"universal"},{"word":"utopia"},{"word":"venom"},{"word":"vigilant"},{"word":"vivacious"},{"word":"voucher"},{"word":"accumulate"},{"word":"acquaintance"},{"word":"adolescence"},{"word":"aerial"},{"word":"anecdote"},{"word":"antecedent"},{"word":"anxious"},{"word":"appendixes"},{"word":"archeology"},{"word":"asphalt"},{"word":"awkward"},{"word":"barometer"},{"word":"besieged"},{"word":"biographical"},{"word":"burglary"},{"word":"caricature"},{"word":"chandelier"},{"word":"chrysanthemum"},{"word":"collateral"},{"word":"confiscate"},{"word":"consequence"},{"word":"controversy"},{"word":"council"},{"word":"criticize"},{"word":"cylinder"},{"word":"desolate"},{"word":"dialogue"},{"word":"discernible"},{"word":"embargo"},{"word":"epidemic"},{"word":"escalator"},{"word":"extremity"},{"word":"fashionable"},{"word":"fiery"},{"word":"frivolous"},{"word":"gorgeous"},{"word":"haphazard"},{"word":"honorary"},{"word":"incidentally"},{"word":"inept"},{"word":"insistent"},{"word":"intermittent"},{"word":"jewelry"},{"word":"lieutenant"},{"word":"lunar"},{"word":"malady"},{"word":"melodious"},{"word":"meteor"},{"word":"minimize"},{"word":"misdemeanor"},{"word":"neutral"},{"word":"noticeable"},{"word":"obsolete"},{"word":"ominous"},{"word":"outrageous"},{"word":"paralysis"},{"word":"perceive"},{"word":"personality"},{"word":"phenomenon"},{"word":"politician"},{"word":"precocious"},{"word":"prestigious"},{"word":"prosperous"},{"word":"psychiatrist"},{"word":"rampage"},{"word":"relevant"},{"word":"sacrifice"},{"word":"scandalized"},{"word":"schism"},{"word":"serviceable"},{"word":"sieve"},{"word":"sophomore"},{"word":"suburban"},{"word":"suspicious"},{"word":"technology"},{"word":"unconscious"},{"word":"unenforceable"},{"word":"unpredictable"},{"word":"vaccinate"},{"word":"vertigo"},{"word":"villain"},{"word":"vocalize"},{"word":"vulnerable"}]');
wordLists.push('[{"word":"absorption"},{"word":"accompaniment"},{"word":"accomplice"},{"word":"acquiesce"},{"word":"acquittal"},{"word":"affiliation"},{"word":"altercation"},{"word":"ambassador"},{"word":"ambiguous"},{"word":"animosity"},{"word":"apparatus"},{"word":"approximately"},{"word":"austerity"},{"word":"authentic"},{"word":"authenticate"},{"word":"auxiliary"},{"word":"benevolent"},{"word":"blasphemous"},{"word":"bravado"},{"word":"camouflage"},{"word":"capricious"},{"word":"carburetor"},{"word":"cavalcade"},{"word":"celestial"},{"word":"cerebral"},{"word":"chagrin"},{"word":"chaotic"},{"word":"chasm"},{"word":"chastise"},{"word":"chronic"},{"word":"citadel"},{"word":"clique"},{"word":"cocoon"},{"word":"conceivable"},{"word":"concurrent"},{"word":"conscientious"},{"word":"consciousness"},{"word":"contiguous"},{"word":"correspondence"},{"word":"corroborate"},{"word":"curriculum"},{"word":"defamation"},{"word":"deprivation"},{"word":"derelict"},{"word":"diffidence"},{"word":"disastrous"},{"word":"dissociate"},{"word":"distinction"},{"word":"diurnal"},{"word":"dominant"},{"word":"dormitory"},{"word":"drudgery"},{"word":"elicit"},{"word":"elimination"},{"word":"embroidery"},{"word":"equinox"},{"word":"escapade"},{"word":"espionage"},{"word":"etiquette"},{"word":"exaggeration"},{"word":"exemplary"},{"word":"expediency"},{"word":"expedient"},{"word":"expunge"},{"word":"facsimile"},{"word":"fallacy"},{"word":"feasibility"},{"word":"fictitious"},{"word":"finesse"},{"word":"fluorescent"},{"word":"fulfill"},{"word":"grammatically"},{"word":"gruesome"},{"word":"handkerchief"},{"word":"hideous"},{"word":"hindrance"},{"word":"homogenize"},{"word":"hypocrisy"},{"word":"idiosyncrasy"},{"word":"impasse"},{"word":"impropriety"},{"word":"incandescent"},{"word":"incessant"},{"word":"inconsolable"},{"word":"indelible"},{"word":"indispensable"},{"word":"indisputable"},{"word":"insufficient"},{"word":"interrogative"},{"word":"irreconcilable"},{"word":"irrelevant"},{"word":"irrevocable"},{"word":"judicious"},{"word":"justifiable"},{"word":"labyrinth"},{"word":"liaison"},{"word":"lustrous"},{"word":"magnanimous"},{"word":"magnificence"},{"word":"maintenance"},{"word":"malicious"},{"word":"martyr"},{"word":"melee"},{"word":"metamorphosis"},{"word":"molecular"},{"word":"monotony"},{"word":"morose"},{"word":"multiplicity"},{"word":"nausea"},{"word":"nonchalance"},{"word":"notoriety"},{"word":"oblique"},{"word":"occasionally"},{"word":"olfactory"},{"word":"omnipotent"},{"word":"onomatopoeia"},{"word":"palatable"},{"word":"pandemonium"},{"word":"panorama"},{"word":"partiality"},{"word":"pastime"},{"word":"patriarch"},{"word":"pediatrician"},{"word":"peril"},{"word":"perjury"},{"word":"philanthropist"},{"word":"picturesque"},{"word":"pittance"},{"word":"playwright"},{"word":"poignancy"},{"word":"poignant"},{"word":"potpourri"},{"word":"prejudice"},{"word":"premonition"},{"word":"primitive"},{"word":"proximity"},{"word":"quibble"},{"word":"quixotic"},{"word":"quizzical"},{"word":"recipient"},{"word":"redundant"},{"word":"reek"},{"word":"relevancy"},{"word":"remembrance"},{"word":"renegade"},{"word":"renovate"},{"word":"reservoir"},{"word":"respite"},{"word":"retaliate"},{"word":"retrieve"},{"word":"rococo"},{"word":"sabotage"},{"word":"salient"},{"word":"satisfactorily"},{"word":"saunter"},{"word":"scavenger"},{"word":"scourge"},{"word":"scuttle"},{"word":"seethe"},{"word":"significance"},{"word":"soliloquy"},{"word":"spasmodic"},{"word":"squalid"},{"word":"strenuous"},{"word":"stringent"},{"word":"subsequent"},{"word":"subsistence"},{"word":"succinct"},{"word":"summarize"},{"word":"supersede"},{"word":"surgeon"},{"word":"surveillance"},{"word":"swelter"},{"word":"synthesis"},{"word":"tantalize"},{"word":"technician"},{"word":"technique"},{"word":"tedious"},{"word":"tenuous"},{"word":"tirade"},{"word":"transcend"},{"word":"transient"},{"word":"transmutation"},{"word":"tremor"},{"word":"turbulence"},{"word":"ubiquitous"},{"word":"ulterior"},{"word":"unanimous"},{"word":"uncanny"},{"word":"uncouth"},{"word":"undoubtedly"},{"word":"unforgettable"},{"word":"upbraid"},{"word":"variegated"},{"word":"vengeance"},{"word":"versatile"},{"word":"volatile"},{"word":"vulnerable"},{"word":"vying"},{"word":"wary"}]');

function start_game_using_data_array(gradeLevel, difficultyLevel) {
    /* set up the playground */
    initialize_playground();
    /* set the game difficulty */
    typer.difficulty = difficultyLevel;
    /* convert the string to an array of words */
    var wordArray = JSON.parse(wordLists[parseInt(gradeLevel)]);
    /* get the wordlist from the array of word lists */
    $.each(wordArray, function (i, item) {
        wordList.push(item.word);
    });
    /* finsh up and start the game */
    initialize_and_start();
}

// JSON FILE HTTP DOWNLOAD
// TO ENABLE downloading of json files via IIS
//<?xml version="1.0"?>
//<configuration>
//  <system.web>
//    <compilation debug="true" targetFramework="4.0"/>
//  </system.web>
//  <system.webServer>
//    <staticContent>
//      <mimeMap fileExtension=".json" mimeType="application/json" />
//    </staticContent>
//  </system.webServer>
//</configuration>
//
//      OR IIS Express
//
// cd C:\Program Files\IIS Express
// appcmd set config /section:staticContent /+[fileExtension='JSON',mimeType='application/x-javascript']
//      OR
// edit the applicationhost.config in BOTH of the following folders
// cd C:\Program Files (x86)\IIS Express\AppServer
// cd C:\Users\username\Documents\IISExpress\config

function start_game_using_http_file_download(gradeLevel, difficultyLevel) {
    /* set up the playground */
    initialize_playground();
    /* set the game difficulty */
    typer.difficulty = difficultyLevel;
    /* get the file from the web server and load the word list */
    var wordlistApi = "../../Game/wordlists/0" + gradeLevel + ".json";
    $.getJSON(wordlistApi, {
    })
    .done(function (data) {
        $.each(data, function (i, item) {
            wordList.push(item.word);
        });
        /* finsh up and start the game */
        initialize_and_start();
    });
}

// GETTING JSON DATA VIA SIMPLE WEB PAGE
function start_game_using_web_page(gradeLevel, difficultyLevel) {
    /* set up the playground */
    initialize_playground();
    /* set the game difficulty */
    typer.difficulty = difficultyLevel;
   /* call the web sites webpage and load the word list */
    var wordlistApi = "http://localhost:15573?gradeLevel=" + gradeLevel;
    $.getJSON(wordlistApi, {
    })
    .done(function(data) {
        $.each(data, function(i, item) {
            wordList.push(item.word);
        });
        /* finsh up and start the game */
        initialize_and_start();
    });
}

// GETTING JSON DATA VIA SIMPLE WEB SERVICE
// YOU WILL NEED TO ADD THIS TO <systems.web> IN YOUR WEB.CONFIG
//<webServices>
//    <protocols>
//        <add name="HttpGet"/>
//        <add name="HttpPost"/>
//    </protocols>
//</webServices>
function start_game_using_webservice(gradeLevel, difficultyLevel) {
    /* set up the playground */
    initialize_playground();
    /* set the game difficulty */
    typer.difficulty = difficultyLevel;
    /* call the webservice and load the word list */
    var wordlistApi = "http://localhost:18268/Service1.asmx/GetWordList?gradeLevel=" + gradeLevel;
    $.getJSON(wordlistApi, {
    })
    .done(function(data) {
        $.each(data, function(i, item) {
            wordList.push(item.word);
        });
        /* finsh up and start the game */
        initialize_and_start();
    });
}

function initialize_and_start() {
    /* add the inital words to the playground */
    for (var i = 0; i < typer.words_n; i++) {
        add_word(i);
    }
    $(".word").each(function (index) {
        typer.all_words[index] = $(this).text();
    });

    // keypress handler
    $(document).on("keydown", function(event) {
        process_keypress(event);
    });

    // since game is initially paused, unpause it to play
    toggle_pause();
}

function initialize_playground() {
    // set the play ground size
    typer.init(480, 480);

    var banner = $("#banner");
    if (banner[0]) {
        banner.hide();
    }

    var cannon = $("#cannon");
    if (!cannon[0]) {
        var container = $("#v");
        $('<div id="cannon"></div>').appendTo(container);
        $('<div id="turret"></div>').appendTo(container);
        $('<div id="city1" class="city"></div>').appendTo(container);
        $('<div id="city2" class="city"></div>').appendTo(container);
        $('<div id="city3" class="city"></div>').appendTo(container);
        $('<div id="city4" class="city"></div>').appendTo(container);
    }

    /* place cannon */
    cannon = $("#cannon");
    cannon.css({
        left: ((typer.width / 2) - 16) + 'px',
        bottom: '32px'
    });
    // init cannon rotation for explosion
    cannon.attr("rotation", 0);
    /* place turret */
    var turret = $("#turret");
    turret.css({
        left: ((typer.width / 2) - 16) + 'px',
        bottom: '64px'
    });
    // init turret rotation for explosion
    turret.attr("rotation", 0);
    // init turret angle
    transform(turret, 0, 0, 1, 90, 0, 4, 0);
    /* place cities */
    $("#city1").css({
        left: ((typer.width / 8) - 16) + 'px',
        bottom: '32px'
    });
    $("#city1").attr("rotation", 0);
    $("#city2").css({
        left: ((typer.width / 3) - 16) + 'px',
        bottom: '32px'
    });
    $("#city2").attr("rotation", 0);
    $("#city3").css({
        right: ((typer.width / 8) - 16) + 'px',
        bottom: '32px'
    });
    $("#city3").attr("rotation", 0);
    $("#city4").css({
        right: ((typer.width / 3) - 16) + 'px',
        bottom: '32px'
    });
    $("#city4").attr("rotation", 0);
    /* place the ground */
    $("#ground").css({
        left: '0px',
        bottom: '0px'
    });
    /* set the initial score board */
    $("#score").html("<b>Words</b> " + typer.score + " <b>Accuracy</b> " + typer.accuracy + "% <b>WPM</b> " + typer.wpm + " <b>CPM</b> " + typer.cpm);
}

function add_word(i, top) {
    var copy_words = wordList;
    var id = random_to(copy_words.length);
    $("#v").append("<span id = 'wc" + i + "' class = 'word_container'><p class = 'word'>" + copy_words[id] + "</p></span>");
    var location = getAddLocation();
    $("#wc" + i).css({
        velocity: "10",
        left: location[0] + "px",
        top: location[1] + "px"
    });
}

function getAddLocation() {
    // NOTE: jquery also offers an offset method, but this is relative to the document and not our container
    var suggestedLeft = 480 / 2 - 150 + random_to(250);
    if (top != undefined) {
        ladder = 32;
    } else {
        ladder += 27;
    }
    var suggestedTop = ladder + 16;

    var wordElements = $(".word_container");
    wordElements.each( function(index) {
        var word = $(this);
        if (word) {
            var position = word.position();
            var width = word.width();
            var height = word.height();
            var left = word[0].style.left.replace("px", "");
            var top = word[0].style.top.replace("px", "");
            var right = word[0].style.right.replace("px", "");
            var bottom = word[0].style.bottom.replace("px", "");
            // left and top won't be defined for the current word
            // so if we know left and top for the others
            // we can calculate the new words position so that words won't overlap
            if (left && top && position.left > 0 && position.top > 0) {
                // calculate right and bottom since we only have left and top
                right = parseInt(left) + parseInt(width);
                bottom = parseInt(top) + parseInt(height);
                // alert("Width: " + width + " Height: " + height + " Left: " + left + " Top: " + top + " right: " + right + " bottom: " + bottom + " SugLeft: " + suggested_left + " SugTop: " + suggested_top);
                while (suggestedTop >= top && suggestedTop <= bottom + 10) {
                    // move word down
                    var adjustment = random_to(height);
                    suggestedTop = suggestedTop + adjustment;
                }
            }
        }
    });

    var x = suggestedLeft;
    var y = suggestedTop;
    return [x, y];
}

function remove_letter(id) {
    var word = $("#wc" + id + " p").text();
    if (word.length > 0) {
        elapsedChars += 1;
        word = word.substr(1, word.length);
        $("#wc" + id + " p").text(word);
    }
    if ($("#wc" + id + " p").text().length == 0) {
        $("#wc" + id + " p").fadeOut(300, function () {
            /* remove word from html */
            $("#wc" + id).remove();
        });
        typer.score += 1;
        add_word(typer.words_n++, 1);
    }
    return $("#wc" + id + " p").text().length;
}

function process_keypress(event) {
    var kc = event.which;
    if (!isValidKey(kc))
        return;
    if (kc == 27)
        toggle_pause(); // esc pause key
    if (kc != 27 && !typer.paused) {
        var missed = false;
        typer.total += 1;

        if (!word_is_selected) {
            // locate all words that begin with this letter, picking the closest one to the bottom
            var previousY = 0;
            var words = $("span[id^=" + "wc" + "]").filter(function(){ return $(this).text().toLowerCase().charAt(0) === String.fromCharCode(kc).toLowerCase();})
            words.each(function(index) {
                var word = $(this);
                var targetY = parseInt(word.css("top"));
                if (targetY > previousY) {
                    selected_word_id = parseInt(word[0].id.replace("wc",""));
                    previousY = targetY;
                }
            });

            var word = $("#wc" + selected_word_id);
            word.addClass("selected");
            if (remove_letter(selected_word_id) == 0) {
                word_is_selected = false;
                add_bullet(selected_word_id);
                selected_word_id = -1;
            } else {
                word_is_selected = true;
                add_bullet(selected_word_id);
            }
        } else {
            // word already selected, continue processing selected word
            var letter = $("#wc" + selected_word_id + " p").text().charAt(0);
            if (String.fromCharCode(kc).toLowerCase() == letter) {
                var rem = remove_letter(selected_word_id);
                if (rem == 0) {
                    $("#wd" + selected_word_id).fadeOut(1000);
                    word_is_selected = false;
                    add_bullet(selected_word_id);
                    selected_word_id = -1;
                } else {
                    word_is_selected = true;
                    add_bullet(selected_word_id);
                }
            }
        }
    } /* end if typer is paused */
}

function isValidKey(keycode) {
    var valid =
    (keycode == 27) ||
    (keycode > 64 && keycode < 91); // letter keys
    //(keycode > 47 && keycode < 58)   || // number keys
    // keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
    //(keycode > 95 && keycode < 112)  || // numpad keys
    //(keycode > 185 && keycode < 193) || // ;=,-./` (in order)
    //(keycode > 218 && keycode < 223);   // [\]' (in order)

    return valid;
}

function toggle_pause() {
    if (typer.paused) {
        typer.paused = false;
        GAME_TIMER = setInterval(process_game_logic, 100);
        BULLET_TIMER = setInterval(process_bullets, 10);
        HIT_TIMER = setInterval(process_hits, 10);
    } else {
        typer.paused = true;
        clearInterval(GAME_TIMER); GAME_TIMER = 0;
        clearInterval(BULLET_TIMER); BULLET_TIMER = 0;
        clearInterval(HIT_TIMER); HIT_TIMER = 0;
    }
}

function process_game_logic() {
    /* do this as long as we aren't paused or dead */
    if (!typer.paused && !typer.dead) {
        /* animate words */
        if (typer.all_words != undefined) {
            for (var i = 0; i < typer.words_n; i++) {
                var cur = $("#wc" + i);
                if (cur) {
                    cur.css({top: "+=" + 1 + "px"}); // increase word drop by 1 position
                    process_base_hits(cur);  // test if this one hit our base
                }
            }
        }
        /* increase game speed or word count */
        if (game_loop_counter++ > game_loop_speed_threshhold) {
            // in this block, we are increasing the game speed
            game_loop_counter = 0;
            clearInterval(GAME_TIMER);
            game_loop_speed += game_loop_speed_value;
            GAME_TIMER = setInterval(process_game_logic, 100 - game_loop_speed);
            // in this block, we'll slow the game back down for easy
            if (typer.difficulty == 'easy' && game_loop_speed >= 20) {
                game_loop_speed = 5;
            }
            // in this block, we are increasing the word count for hard and impossible
            if (typer.difficulty == 'hard' && $('.word_container').length < 5) {
                add_word(typer.words_n++, 1);
            }
            if (typer.difficulty == 'impossible' && $('.word_container').length < 15) {
                add_word(typer.words_n++, 1);
            }
            // just log some details to the javascript console window / debugger
            console.log("debug: increasing speed by " + game_loop_speed);
            console.log("debug: increasing words to " + typer.words_n);
        }
        /* calculate accuracy */
        if (typer.total == 0) {
            typer.accuracy = 100;
        } else {
            typer.accuracy = (100 / typer.total * typer.bulletsFired).toFixed(1);
        }
        /* calculate score and accuracy */
        end = new Date().getTime();
        var millis = end - start;
        var minutes = millis/1000/60;
        typer.wpm = ((elapsedChars / 5) / minutes).toFixed(1);
        typer.cpm = (elapsedChars / minutes).toFixed(1);
        /* display score and accuracy */
        $("#score").html("<b>Words</b> " + typer.score + " <b>Accuracy</b> " + typer.accuracy + "% <b>WPM</b> " + typer.wpm + " <b>CPM</b> " + typer.cpm);
    }
    if (typer.dead) {
        var wordsLeft = $(".word_container");
        if (wordsLeft.length <= 0) {
            stop_game();
        } else {
            // clean em up
            $.each(wordsLeft, function (index) {
                wordsLeft[index].remove();
            });
        }
        //if (game_logic_loop_counter > 50) {
        //    // if we are dead, and the game loop has run at least 50 more times, stop the game timers
        //    // otherwise, we could cause issues with someone's browser and the script would run forever
        //    stop_game();
        //}
        //else {
        //    // we are dead, but some things still need time to complete
        //    game_logic_loop_counter += 1;
        //}
    }
}

function add_bullet(target) {
    /* play bullet launch sound */
    var bs = sound_bullet[0];
    bs.cloneNode(true).play();
    /* increase bullets fired for accuracy calulation */
    typer.bulletsFired += 1;
    /* get the "center" x y point using the width and height of the playground */
    var inix = (typer.width / 2) - 16;
    var iniy = (typer.height - 72);
    /* create the html string for the bullet */
    var new_bullet = "<div class = 'bullet' id = 'bullet_" + current_bullet_id + "' purpose = '" + target + "'></div>";
    /* append the new bullet to the playground */
    $("#v").append(new_bullet);
    /* grab the new bullet DOM object */
    new_bullet = $("#bullet_" + current_bullet_id)
    /* position the bullet using css */
    new_bullet.css({
        left: inix + 'px',
        top: iniy + 'px'
    });
    var selectedWord = $('#wc' + selected_word_id);
    if (selectedWord && selectedWord.length > 0) {
        /* calculate bullet vector / angle of attack */
        var target_x = parseInt($("#wc" + target).css("left"));
        var target_y = parseInt($("#wc" + target).css("top"));
        var vec_x = (target_x - inix) / 20;
        var vec_y = (target_y - iniy) / 20;
        var v1x = 10;
        var v1y = 0;
        var v2x = vec_x;
        var v2y = vec_y;
        var ANGLE = Math.acos((v1x * v2x + v1y * v2y) / (Math.sqrt(v1x * v1x + v1y * v1y) * Math.sqrt(v2x * v2x + v2y * v2y))) * 180 / Math.PI;
        var vec = dist(selectedWord, new_bullet);
        new_bullet.attr("vecx", vec_x);
        new_bullet.attr("vecy", vec_y);
        new_bullet.attr("walk", 0);
        transform(new_bullet, 0, 0, 1, -ANGLE, 0, 0, 0);
        transform($("#turret"), 0, 0, 1, -ANGLE, 0, 0, 0);
    }
    current_bullet_id++;
}

function process_bullets() {
    /* don't process bullet if paused, but continue if we are dead */
    if (!typer.paused) {
        /* get all bullets from the DOM */
        var bullet = $(".bullet");
        bullet.each(function (index) {
            /* get all settings form the DOM bullet */
            var b = $(this);
            var vx = parseFloat(b.attr("vecx"));
            var vy = parseFloat(b.attr("vecy"));
            var target = parseInt(b.attr("purpose"));
            var walk = parseFloat(b.attr("walk"));
            if (b.attr("hit") != 1) // if the bullet hasn't already hit
                if (parseInt(b.css("top")) <= parseInt($("#wc" + target).css("top")) + 14) {
                    /* we scored a hit */
                    var x = parseInt(b.css("left")) + 10;
                    var y = parseInt(b.css("top")) + 10;
                    // animate the missile/bullet hit
                    add_missile_hit(x, y);
                    // update the DOM bullet and record the hit
                    b.attr("hit", 1);
                }
            if (walk > 10); {
                b.fadeOut(500, function() {
                    /* remove bullet from html */
                    $(this).remove();
                });
            }
            // update the bullets position
            b.attr("walk", walk + 1.0);
            b.css("left", IX + parseInt(vx * walk) + "px");
            b.css("top", IY + parseInt(vy * walk) + "px");
        });
    }
}

function add_missile_hit(x, y) {
    /* play bullet hit sound */
    var bs = sound_hit[0];5
    bs.cloneNode(true).play();
    for (var i = 0; i < 360; i += 36) {
        add_missile_hit_html(x, y, i + sphere_explosion_angle);
        sphere_explosion_angle += 1;
    }
}

function add_missile_hit_html(x, y, ang) {
    var direction = directionXY(ang);
    $("#v").append("<div class = 'hit' x = '" + x + "' y = '" + y + "' vecx = '" + direction[0] + "' vecy = '" + direction[1] + "' walk = '0'></div>");
}

function add_base_hit(x, y) {
    /* play atomic base hit sound */
    var bs = sound_atomic[0];
    bs.cloneNode(true).play();
    add_base_hit_html(x, y);
}

function add_base_hit_html(x, y) {
    /* simple explosion graphic explosion is 360 degrees around target x,y */
    for (var degree = 0; degree < 360; degree += 36) {
        // calculate the "slant"
        var direction = directionXY(degree + sphere_explosion_angle);
        $("#v").append("<div class = 'atomic' x = '" + x + "' y = '" + y + "' vecx = '" + direction[0] + "' vecy = '" + direction[1] + "' walk = '0'></div>");
        sphere_explosion_angle += 1;
    }
}

function process_base_hits(target) {
    var baseTop = parseInt($('#cannon').css("top"));
    var wordBottom = parseInt($(target.selector).css("top")) + parseInt($(target.selector).css("height"));

    if (!isNaN(wordBottom) && wordBottom > baseTop) {
        /* they hit our base */
        process_base_hit();
    }
}

function process_base_hit() {
    if (!typer.dead) {
        typer.dead = true;
        /* blow up cannon */
        var x = $('#cannon').position().left;
        var y = $('#cannon').position().top;
        add_base_hit(x, y);

        // blow up cities
        var citys = $(".city");
        citys.each(function (index) {
            var city = $(this);
            x = city.position().left;
            y = city.position().top;
            add_base_hit(x, y);
            animate_explosion(city);
            city.fadeOut(1500, function () {
                /* remove city from html */
                city.remove();
            });
        });

        // blow up turret
        var turret = $("#turret");
        animate_explosion(turret);
        $(turret.selector).fadeOut(1500, function() {
            /* remove turret from html */
            $(turret.selector).remove();
        });
        // blow up cannon
        var cannon = $("#cannon");
        animate_explosion(cannon);
        $(cannon.selector).fadeOut(1500, function() {
            /* remove cannon from html */
            $(cannon.selector).remove();
        });

        /* explode everything else on screen for effect */
        $(".word_container").each(function (index) {
            var cur = $(this);
            var target_x = parseInt(cur.css("left").replace("px"));
            var target_y = parseInt(cur.css("top").replace("px"));
            add_missile_hit(target_x, target_y);
            cur.fadeOut(500, function () {
                /* remove word from html */
                cur.remove();
            });
        });
    }
}

function process_hits() {
    if (!typer.paused) {
        var hit = $(".hit");
        hit.each(function(index) {
            var h = $(this);
            var x = parseFloat(h.attr("x"));
            var y = parseFloat(h.attr("y"));
            var vx = parseFloat(h.attr("vecx"));
            var vy = parseFloat(h.attr("vecy"));
            var walk = parseFloat(h.attr("walk"));
            h.fadeOut(500, function() {
                /* remove hit from html */
                $(this).remove();
            });
            h.attr("walk", walk + 1.0);
            h.css("left", x + parseInt(vx * walk) + "px");
            h.css("top", y + parseInt(vy * walk) + "px");
        });
        var atomic = $(".atomic");
        atomic.each(function(index) {
            var h = $(this);
            var x = parseFloat(h.attr("x"));
            var y = parseFloat(h.attr("y"));
            var vx = parseFloat(h.attr("vecx"));
            var vy = parseFloat(h.attr("vecy"));
            var walk = parseFloat(h.attr("walk"));
            h.fadeOut(1500, function() {
                /* remove atomic from html */
                $(this).remove();
            });
            h.attr("walk", walk + 1.0);
            h.css("background", random_color());
            h.css("left", x + parseInt(vx * walk) + "px");
            h.css("top", y + parseInt(vy * walk) + "px");
        });
    }
}

function game_over() {
    var banner = $("#banner");
    banner[0].innerHTML = "<span>Game Over</span>";
    banner.show();
    if ($("#start_btn").hasClass("disabled")) {
        $("#start_btn").removeClass("disabled");
    }
}

function stop_game() {
    // display game over
    game_over();
    // remove keypress handler
    $(document).unbind("keydown");
    // pause also stops all the timers
    toggle_pause();
    // reset all global variables
    reset_variables();
    // call window stop
    window.stop();
}

function resetElapsedCharacterCounter() {
    start = new Date().getTime();
    elapsedChars = 0;
}

function dist(e1, e2) {
    var pos1 = e1.position();
    var pos2 = e2.position();
    var w = pos1.left - pos2.left;
    var h = pos1.top - pos2.top;
    return [w, h];
}

function random_to(len) {
    return Math.floor((Math.random() * len));
}

function random_color() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

//function animate_explosion(element) {
//    if (element) {
//        element.rotation = parseFloat(element.attr("rotation"));
//        element.rotation+= 10;
//        transform(element, 0, 0, 1, element.rotation, 0, 0, 0);
//        element.attr("rotation", element.rotation);
//        setTimeout(function () {
//            animate_explosion(element);
//        }, 10);
//    }
//}

function animate_explosion(element) {
    if (element) {

        // For easy use
        var $t = element;
        // Like I said, we're using 5!
        var amount = 2;
        // Get the width of each clipped rectangle.
        var width = $t.width() / amount;
        var height = $t.height() / amount;
        // The total is the square of the amount
        var totalSquares = Math.pow(amount, 2);
        // The HTML of the content
        var html = $t.find(element.selector).html();
        var y = 0;
        for(var z = 0; z <= (amount*width); z = z+width) { 
            $('<div class="clipped" style="height: '+height+'px; width: '+width+'px; clip: rect('+y+'px, '+(z+width)+'px, '+(y+height)+'px, '+z+'px)">'+((html) ? html : "")+'</div>').appendTo($t);
            if(z === (amount*width)-width) {
                y = y + height;
                z = -width;
            }
            if(y === (amount*height)) {
                z = 9999999;
            }
        }

	
        // A quick random function for selecting random numbers
        function rand(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // A variable check for when the animation is mostly over
        var first = false,
            clicked = false;

        $(element.selector + ' .content').css({ 'display': 'none' });

        // Apply to each clipped-box div.
        $(element.selector + ' .clipped').each(function () {

            // So the speed is a random speed between 90m/s and 120m/s. I know that seems like a lot
            // But otherwise it seems too slow. That's due to how I handled the timeout.
            var v = rand(120, 90),
				angle = rand(80, 89), // The angle (the angle of projection) is a random number between 80 and 89 degrees.
				theta = (angle * Math.PI) / 180, // Theta is the angle in radians
				g = -9.8; // And gravity is -9.8. If you live on another planet feel free to change

            // $(this) as self
            var self = $(this);

            // time is initially zero, also set some random variables. It's higher than the total time for the projectile motion
            // because we want the squares to go off screen. 
            var t = 0,
				z, r, nx, ny,
				totalt = 15;

            // The direction can either be left (1), right (-1) or center (0). This is the horizontal direction.
            var negate = [1, -1, 0],
				direction = negate[Math.floor(Math.random() * negate.length)];

            // Some random numbers for altering the shapes position
            var randDeg = rand(-5, 10),
				randScale = rand(0.9, 1.1),
				randDeg2 = rand(30, 5);

            // apply position
            $(this).css({
                'transform': 'scale(' + randScale + ') skew(' + randDeg + 'deg) rotateZ(' + randDeg2 + 'deg)'
            });

            // Because box shadows are a bit laggy (by a bit I mean 'box shadows will not work on individual clipped divs at all') 
            // we're altering the background colour slightly manually, in order to give the divs differentiation when they are
            // hovering around in the air.
            if (element.css('backgroundColor').contains('rgb')) {
                var color = element.css('backgroundColor').split('rgb(')[1].split(')')[0].split(', '),
                    colorR = rand(-20, 20), // You might want to alter these manually if you change the color
                    colorGB = rand(-20, 20), // To get the right consistency.
                    newColor = 'rgb(' + (parseFloat(color[0]) + colorR) + ', ' + (parseFloat(color[1]) + colorGB) + ', ' + (parseFloat(color[2]) + colorGB) + ')';

                // And apply new color
                $(this).css({
                    'backgroundColor': newColor
                });
            }
            if (element.css('background-image').contains('url')) {
                var image = element.css('background-image').split("url");
                // And apply background
                $(this).css({
                    'background-image': "url" + image[1]
            });
            }

            // Set an interval
            z = setInterval(function () {
                // Horizontal speed is constant (no wind resistance on the internet)
                var ux = (Math.cos(theta) * v) * direction;
                // Vertical speed decreases as time increases before reaching 0 at its peak
                var uy = (Math.sin(theta) * v) - ((-g) * t);
                // The horizontal position
                nx = (ux * t);
                // s = ut + 0.5at^2
                ny = (uy * t) + (0.5 * (g) * Math.pow(t, 2));
                // Apply the positions	
                $(self).css({ 'bottom': (ny) + 'px', 'left': (nx) + 'px' });
                // Increase the time by 0.10
                t = t + 0.10;
                // If the time is greater than the total time clear the interval
                if (t > totalt) {
                    clicked = false;
                    first = true;
                    //$(element.selector).css({ 'top': '-1000px', 'transition': 'none' });
                    $(self).css({ 'left': '0', 'bottom': '0', 'opacity': '1', 'transition': 'none', 'transform': 'none' });
                    // Finally clear the interval
                    clearInterval(z);
                }
            }, 10); // Run this interval every 10ms. Changing this will change the pace of the animation
        });

        // apply explosion to original element
        element.css('background-image', 'url("images/explosion02.jpg")');

    }
}

function rotate(element, x, y, z) {
    var rotation = 'rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(' + y + 'deg)';
    element.css({
        "-webkit-transform": rotation,
        "-moz-transform": rotation,
        '-ms-transform': rotation,
        'transform': rotation
    });
}

function transform(element, x, y, z, degrees, tx, ty, tz) {
    var translate = "translate3d(" + tx + "px, " + ty + "px, " + tz + "px)";
    var rotate = "rotate3d(" + x + ", " + y + ", " + z + ", " + degrees + "deg)";
    var transrotation = translate + " " + rotate;
    var wt = {
        "-webkit-transform": transrotation,
        "-moz-transform": transrotation,
        '-ms-transform': transrotation,
        'transform': transrotation
    };
    element.css(wt);
}

function directionXY(angle) {
    var dirx = Math.sin(parseFloat(angle) * Math.PI / 180.0);
    var diry = -Math.cos(parseFloat(angle) * Math.PI / 180.0);
    return [dirx, diry];
}

function angle(dirX, dirY) { }

function reset_variables()
{
    GAME_TIMER = null;
    IX = 0;
    IY = 0;
    ladder = 0;

    game_logic_loop_counter = 0;
    game_loop_counter = 0;
    game_loop_speed_threshhold = 50;
    game_loop_speed_value = 5;
    game_loop_speed = 0;

    IX = (typer.width / 2) - 16;
    IY = (typer.height - 72);

    word_is_selected = false;
    selected_word_id = -1;

    sphere_explosion_angle = 0;
    current_bullet_id = 0;
    bullet = [];
    bullets = 0;
    bullet_velocity = 25;

    start = new Date().getTime();
    end = new Date().getTime();
    elapsed = 0;
    elapsedChars = 0;

    wordList = [];
}