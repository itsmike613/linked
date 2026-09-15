const game = "LINKED";
const tones = ["red","yellow","blue","green"];
const colors = {
    red:{ hex:"#E74C3C", shape:"●" },
    yellow:{ hex:"#F1C40F", shape:"▲" },
    blue:{ hex:"#5B6EE1", shape:"■" },
    green:{ hex:"#2ECC71", shape:"◆" }
};

const deals = ["shuffled","matched"];
const orders = ["dealt","color","number"];
const paces = ["quick","standard","relaxed"];
const firsts = ["player","ai"];

const words = {
    en: {
        tagline:"Match it. Link it. Clear your hand.", play:"Play", settings:"Settings", help:"Help", home:"Home", back:"Back", setup:"Setup", start:"Start Game", replay:"Replay", newgame:"New Game",
        deal:"Deal", shuffled:"Shuffled", matched:"Matched", starting:"Starting Cards", time:"Time", moves:"Moves", you:"You", ai:"AI", draw:"Draw", discard:"Discard", cards:"cards", card:"card", endturn:"End Turn",
        yourturn:"Your Turn", aiturn:"AI Turn", choose:"Choose active color", active:"Active", red:"Red", yellow:"Yellow", blue:"Blue", green:"Green", block:"Block", plus2:"Plus 2", wild:"Wild", plus4:"Plus 4", activity:"Activity", lastthree:"Last 3 Turns", noactivity:"No activity yet.", drawlog:"Draw", passlog:"Pass",
        preferences:"Preferences", handorder:"Hand Order", orderhelp:"Choose how your cards are arranged visually.", dealt:"Dealt", color:"Color", number:"Number", aipace:"AI Pace", pacehelp:"Change only the visible timing of AI actions.", quick:"Quick", standard:"Standard", relaxed:"Relaxed", first:"Who Plays First", firsthelp:"Choose who receives the first turn of each new game.", player:"Player",
        complete:"Game complete", results:"Results", winner:"Winner", playerscore:"Player Score", aiscore:"AI Score", completion:"Time", dealmode:"Deal Mode", firstplayed:"Who Played First", lower:"Lower is better. A score of 0 wins.", playerwin:"Player wins", aiwin:"AI wins", configuration:"Game",
        guide:"Guide", how:"How to Play", deck:"The 96-Card Deck", renewable:"Renewable Deck", chains:"Chains", powers:"Power Cards", drawing:"Drawing", dealmodes:"Deal Modes", scoring:"Scoring", stats:"Time and Moves", fair:"Fair AI", controls:"Turn Flow", theme:"Theme", language:"Language", table:"Card table",
        badplay:"That card cannot be played now.", needcolor:"Choose an active color before ending your turn.", nodraw:"No card can be drawn right now.", forcedpass:"No legal play or draw is available. You may end the turn.",
        helpintro:"{game} is a two-player card game against a computer opponent. Match the discard, link same-number cards into chains, and be the first to clear your hand.",
        howtext:"On your turn, play one legal card or draw one card. A numbered card matches the active color or the visible number. BLOCK and +2 match the active color or the same visible power type. WILD and +4 are always playable. Finish every turn with End Turn. WILD and +4 let you choose the new active color unless that card empties your hand.",
        decktext:"Every game uses one fixed 96-card deck: 80 numbered cards, 4 BLOCK cards, 8 +2 cards, 2 WILD cards, and 2 +4 cards. Every exact color/number combination from 0 through 9 has two physical copies.",
        shapetext:"The four permanent color/shape identities are Red ●, Yellow ▲, Blue ■, and Green ◆. Shape always appears with color so color is never the only identifier.",
        renewtext:"Draw does not permanently run out. When it empties, the current top discard stays in place while all older discards are shuffled into a new Draw pile. If a WILD or +4 is on top, its chosen active color remains active.",
        chaintext:"If the first card you play is a number, that number becomes the chain number. You may then play additional cards with exactly that same number regardless of color. You decide when to stop by pressing End Turn. The chain stays locked to that number, so the final card's color cannot start a different matching sequence. Power cards cannot enter or create number chains.",
        powertext:"BLOCK makes the opponent lose the next turn. +2 makes the opponent draw two cards and lose that turn. WILD changes the active color. +4 changes the active color, makes the opponent draw four, and makes them lose that turn. Draw penalties cannot be stacked.",
        drawtext:"You may voluntarily draw at most one card per turn, even when another card is already playable. After drawing, only the newly drawn card may become that turn's first played card. You may instead keep it and end the turn. If the new card is a legal number and you play it, it may begin a normal same-number chain using matching numbers already in your hand.",
        dealtext:"Shuffled deals ordinary random starting hands. Matched gives both players the same starting card identities: one +4, one WILD, the same colored +2, and matching numbered cards filling the remaining spaces. All cards are genuine cards from the 96-card deck. Future draws are ordinary and are not matched.",
        scoretext:"Lower is better. The player who empties their hand scores 0 and wins. Remaining number cards are worth face value; BLOCK and +2 are 25 points each; WILD and +4 are 50 points each. A final +2 or +4 finishes its forced draw before the opponent's score is calculated.",
        timetext:"Time starts when the game becomes playable and runs through both players' turns and color selection. It stops permanently when the game ends.",
        movetext:"Moves counts only your actions: each card you play is one Move, including every card in a chain, and each voluntary draw is one Move. End Turn, color choices, AI actions, forced draws, recycling, and the opening deal do not add Moves.",
        fairtext:"The AI plays intelligently but fairly. It does not know the cards in your hand and does not know which cards are coming next from the draw pile. It bases decisions on its own hand and visible, public game information.",
        controltext:"At the untouched start of a turn, End Turn is disabled. After you play a card or voluntarily draw, it becomes available. BLOCK, +2, and +4 can give the player who used them another turn after their effect resolves. The game ends only after any final forced draw has finished."
    },
    es: {
        tagline:"Combina. Enlaza. Vacía tu mano.", play:"Jugar", settings:"Ajustes", help:"Ayuda", home:"Inicio", back:"Atrás", setup:"Configuración", start:"Iniciar partida", replay:"Repetir", newgame:"Nueva partida",
        deal:"Reparto", shuffled:"Barajado", matched:"Igualado", starting:"Cartas iniciales", time:"Tiempo", moves:"Movimientos", you:"Tú", ai:"IA", draw:"Robar", discard:"Descarte", cards:"cartas", card:"carta", endturn:"Terminar turno",
        yourturn:"Tu turno", aiturn:"Turno de la IA", choose:"Elige el color activo", active:"Activo", red:"Rojo", yellow:"Amarillo", blue:"Azul", green:"Verde", block:"Bloqueo", plus2:"Más 2", wild:"Comodín", plus4:"Más 4", activity:"Actividad", lastthree:"Últimos 3 turnos", noactivity:"Todavía no hay actividad.", drawlog:"Robo", passlog:"Pasa",
        preferences:"Preferencias", handorder:"Orden de la mano", orderhelp:"Elige cómo se ordenan visualmente tus cartas.", dealt:"Reparto", color:"Color", number:"Número", aipace:"Ritmo de la IA", pacehelp:"Cambia solo el tiempo visible de las acciones de la IA.", quick:"Rápido", standard:"Estándar", relaxed:"Relajado", first:"Quién juega primero", firsthelp:"Elige quién recibe el primer turno de cada partida nueva.", player:"Jugador",
        complete:"Partida completada", results:"Resultados", winner:"Ganador", playerscore:"Puntuación del jugador", aiscore:"Puntuación de la IA", completion:"Tiempo", dealmode:"Modo de reparto", firstplayed:"Quién jugó primero", lower:"Menor es mejor. Una puntuación de 0 gana.", playerwin:"Gana el jugador", aiwin:"Gana la IA", configuration:"Partida",
        guide:"Guía", how:"Cómo jugar", deck:"La baraja de 96 cartas", renewable:"Baraja renovable", chains:"Cadenas", powers:"Cartas de poder", drawing:"Robar", dealmodes:"Modos de reparto", scoring:"Puntuación", stats:"Tiempo y Movimientos", fair:"IA justa", controls:"Flujo del turno", theme:"Tema", language:"Idioma", table:"Mesa de cartas",
        badplay:"Esa carta no se puede jugar ahora.", needcolor:"Elige un color activo antes de terminar tu turno.", nodraw:"No se puede robar ninguna carta ahora.", forcedpass:"No hay jugada legal ni carta disponible para robar. Puedes terminar el turno.",
        helpintro:"{game} es un juego de cartas para dos contra un oponente controlado por computadora. Combina el descarte, enlaza cartas del mismo número y sé el primero en vaciar tu mano.",
        howtext:"En tu turno, juega una carta legal o roba una carta. Una carta numérica coincide con el color activo o con el número visible. BLOQUEO y +2 coinciden con el color activo o con el mismo tipo de poder visible. COMODÍN y +4 siempre se pueden jugar. Termina cada turno con Terminar turno. COMODÍN y +4 permiten elegir el nuevo color activo salvo que esa carta vacíe tu mano.",
        decktext:"Cada partida usa una baraja fija de 96 cartas: 80 numéricas, 4 BLOQUEO, 8 +2, 2 COMODÍN y 2 +4. Cada combinación exacta de color y número del 0 al 9 tiene dos copias físicas.",
        shapetext:"Las cuatro identidades permanentes de color y forma son Rojo ●, Amarillo ▲, Azul ■ y Verde ◆. La forma siempre acompaña al color para que el color nunca sea el único identificador.",
        renewtext:"Robar no se agota para siempre. Cuando se vacía, el descarte superior actual permanece en su sitio y todos los descartes anteriores se barajan para formar una nueva pila de Robar. Si arriba hay un COMODÍN o +4, su color activo elegido se conserva.",
        chaintext:"Si la primera carta que juegas es un número, ese número se convierte en el número de la cadena. Después puedes jugar cartas adicionales con exactamente ese mismo número sin importar el color. Tú decides cuándo parar con Terminar turno. La cadena sigue bloqueada a ese número, así que el color de la última carta no puede iniciar otra secuencia. Las cartas de poder no pueden entrar ni crear cadenas numéricas.",
        powertext:"BLOQUEO hace que el oponente pierda el siguiente turno. +2 hace que robe dos cartas y pierda ese turno. COMODÍN cambia el color activo. +4 cambia el color activo, hace robar cuatro cartas y hace perder ese turno. Las penalizaciones de robo no se pueden apilar.",
        drawtext:"Puedes robar voluntariamente como máximo una carta por turno, incluso si ya tienes otra carta jugable. Después de robar, solo la carta recién robada puede ser la primera jugada de ese turno. También puedes conservarla y terminar el turno. Si la nueva carta es un número legal y la juegas, puede iniciar una cadena normal del mismo número usando números coincidentes que ya estaban en tu mano.",
        dealtext:"Barajado reparte manos iniciales aleatorias normales. Igualado da a ambos jugadores las mismas identidades iniciales: un +4, un COMODÍN, el mismo +2 de color y cartas numéricas coincidentes para llenar los espacios restantes. Todas son cartas reales de la baraja de 96. Los robos posteriores son normales y no están igualados.",
        scoretext:"Menor es mejor. Quien vacía su mano obtiene 0 y gana. Las cartas numéricas valen su valor; BLOQUEO y +2 valen 25 puntos cada una; COMODÍN y +4 valen 50 cada una. Un +2 o +4 final completa el robo forzado antes de calcular la puntuación rival.",
        timetext:"El tiempo empieza cuando la partida está lista para jugar y continúa durante los turnos de ambos jugadores y la selección de color. Se detiene definitivamente cuando termina la partida.",
        movetext:"Movimientos cuenta solo tus acciones: cada carta jugada vale un Movimiento, incluidas todas las de una cadena, y cada robo voluntario cuenta como 1 Movimiento. Terminar turno, elegir color, las acciones de la IA, los robos forzados, el reciclaje y el reparto inicial no suman Movimientos.",
        fairtext:"La IA juega de forma inteligente pero justa. No conoce las cartas de tu mano ni sabe qué cartas vendrán después en la pila de robar. Decide usando su propia mano y la información visible y pública de la partida.",
        controltext:"Al inicio intacto de un turno, Terminar turno está desactivado. Después de jugar una carta o robar voluntariamente, queda disponible. BLOQUEO, +2 y +4 pueden dar otro turno a quien los usó después de resolver su efecto. La partida termina solo después de completar cualquier robo forzado final."
    },
    ru: {
        tagline:"Совпади. Свяжи. Освободи руку.", play:"Играть", settings:"Настройки", help:"Помощь", home:"Главная", back:"Назад", setup:"Настройка", start:"Начать игру", replay:"Повторить", newgame:"Новая игра",
        deal:"Раздача", shuffled:"Перемешанная", matched:"Одинаковая", starting:"Стартовые карты", time:"Время", moves:"Ходы", you:"Вы", ai:"ИИ", draw:"Колода", discard:"Сброс", cards:"карт", card:"карта", endturn:"Завершить ход",
        yourturn:"Ваш ход", aiturn:"Ход ИИ", choose:"Выберите активный цвет", active:"Активный", red:"Красный", yellow:"Жёлтый", blue:"Синий", green:"Зелёный", block:"Блок", plus2:"Плюс 2", wild:"Джокер", plus4:"Плюс 4", activity:"Активность", lastthree:"Последние 3 хода", noactivity:"Пока нет действий.", drawlog:"Добор", passlog:"Пропуск",
        preferences:"Параметры", handorder:"Порядок руки", orderhelp:"Выберите, как визуально упорядочивать ваши карты.", dealt:"Как получены", color:"По цвету", number:"По числу", aipace:"Темп ИИ", pacehelp:"Меняет только видимую скорость действий ИИ.", quick:"Быстрый", standard:"Обычный", relaxed:"Спокойный", first:"Кто ходит первым", firsthelp:"Выберите, кто получает первый ход в каждой новой игре.", player:"Игрок",
        complete:"Игра завершена", results:"Результаты", winner:"Победитель", playerscore:"Счёт игрока", aiscore:"Счёт ИИ", completion:"Время", dealmode:"Тип раздачи", firstplayed:"Кто ходил первым", lower:"Меньше — лучше. Счёт 0 означает победу.", playerwin:"Победил игрок", aiwin:"Победил ИИ", configuration:"Игра",
        guide:"Справка", how:"Как играть", deck:"Колода из 96 карт", renewable:"Возобновляемая колода", chains:"Цепочки", powers:"Карты действий", drawing:"Добор", dealmodes:"Типы раздачи", scoring:"Подсчёт очков", stats:"Время и Ходы", fair:"Честный ИИ", controls:"Ход игры", theme:"Тема", language:"Язык", table:"Игровой стол",
        badplay:"Эту карту сейчас нельзя сыграть.", needcolor:"Выберите активный цвет перед завершением хода.", nodraw:"Сейчас нельзя взять карту.", forcedpass:"Нет допустимого хода и нельзя взять карту. Можно завершить ход.",
        helpintro:"{game} — карточная игра один на один против компьютера. Совмещайте карты со сбросом, связывайте одинаковые числа в цепочки и первым избавьтесь от всех карт.",
        howtext:"В свой ход сыграйте одну допустимую карту или возьмите одну карту. Число подходит по активному цвету или видимому числу. БЛОК и +2 подходят по активному цвету или по такому же видимому типу карты действия. ДЖОКЕР и +4 допустимы всегда. Каждый ход завершается кнопкой «Завершить ход». ДЖОКЕР и +4 позволяют выбрать новый активный цвет, кроме случая, когда эта карта опустошает руку.",
        decktext:"В каждой игре используется фиксированная колода из 96 карт: 80 числовых, 4 БЛОК, 8 карт +2, 2 ДЖОКЕРА и 2 карты +4. Каждая точная комбинация цвета и числа от 0 до 9 существует в двух физических экземплярах.",
        shapetext:"Четыре постоянные пары цвета и формы: Красный ●, Жёлтый ▲, Синий ■ и Зелёный ◆. Форма всегда показывается вместе с цветом, поэтому цвет не является единственным обозначением.",
        renewtext:"Колода добора не заканчивается навсегда. Когда она пустеет, текущая верхняя карта сброса остаётся на месте, а все более старые карты сброса перемешиваются и становятся новой колодой. Если сверху ДЖОКЕР или +4, выбранный активный цвет сохраняется.",
        chaintext:"Если первой картой хода сыграно число, оно становится числом цепочки. После этого можно сыграть дополнительные карты ровно с тем же числом независимо от цвета. Вы сами решаете, когда остановиться, нажимая «Завершить ход». Цепочка остаётся привязана к этому числу, поэтому цвет последней карты не начинает новую последовательность. Карты действий нельзя добавлять в числовую цепочку и нельзя начинать ими цепочку.",
        powertext:"БЛОК лишает соперника следующего хода. +2 заставляет соперника взять две карты и пропустить ход. ДЖОКЕР меняет активный цвет. +4 меняет цвет, заставляет соперника взять четыре карты и пропустить ход. Штрафы за добор не складываются.",
        drawtext:"За ход можно добровольно взять не более одной карты, даже если у вас уже есть допустимая карта. После добора только новая карта может стать первой сыгранной картой этого хода. Её также можно оставить и завершить ход. Если новая карта — допустимое число и вы её сыграли, она может начать обычную цепочку того же числа с подходящими числами, уже находившимися в руке.",
        dealtext:"«Перемешанная» создаёт обычные случайные стартовые руки. «Одинаковая» даёт обоим игрокам одинаковые типы стартовых карт: одну +4, один ДЖОКЕР, одинаковую цветную +2 и совпадающие числовые карты для остальных мест. Все они являются реальными картами из колоды 96. Последующие доборы обычные и не совпадают.",
        scoretext:"Меньше — лучше. Игрок, избавившийся от всех карт, получает 0 и побеждает. Числовые карты стоят своё значение; БЛОК и +2 — по 25 очков; ДЖОКЕР и +4 — по 50. Последняя +2 или +4 сначала полностью выполняет обязательный добор соперника, и только затем считается его счёт.",
        timetext:"Время начинается, когда игра становится доступна для хода, и идёт во время ходов обоих игроков и выбора цвета. Оно окончательно останавливается после завершения игры.",
        movetext:"Ходы считают только ваши действия: каждая сыгранная карта — один Ход, включая каждую карту цепочки, и каждый добровольный добор — один Ход. Завершение хода, выбор цвета, действия ИИ, обязательный добор, переработка колоды и стартовая раздача Ходы не увеличивают.",
        fairtext:"ИИ играет разумно, но честно. Он не знает карт в вашей руке и не знает, какие карты следующими выйдут из колоды. Решения основаны только на его собственной руке и видимой общедоступной информации игры.",
        controltext:"В самом начале хода кнопка «Завершить ход» отключена. После сыгранной карты или добровольного добора она становится доступна. БЛОК, +2 и +4 после выполнения эффекта могут дать использовавшему их игроку ещё один ход. Игра заканчивается только после завершения любого финального обязательного добора."
    }
};

const topics = [
    { title:"how", text:["howtext"] },
    { title:"deck", text:["decktext","shapetext"] },
    { title:"renewable", text:["renewtext"] },
    { title:"chains", text:["chaintext"] },
    { title:"powers", text:["powertext"] },
    { title:"drawing", text:["drawtext"] },
    { title:"dealmodes", text:["dealtext"] },
    { title:"scoring", text:["scoretext"] },
    { title:"stats", text:["timetext","movetext"] },
    { title:"fair", text:["fairtext"] },
    { title:"controls", text:["controltext"] }
];