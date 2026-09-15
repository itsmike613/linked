const langs = ["en","es","ru"];

const state = {
    page:"home",
    lang:"en",
    theme:"light",
    set:{ order:"dealt", pace:"standard", first:"player" },
    form:{ deal:"shuffled", cards:7 },
    human:[],
    ai:[],
    draw:[],
    discard:[],
    active:null,
    turn:"player",
    acted:false,
    drawn:null,
    chain:null,
    played:[],
    effect:null,
    busy:false,
    ready:false,
    done:false,
    moves:0,
    start:0,
    elapsed:0,
    timer:null,
    run:null,
    note:null,
    token:0,
    log:[]
};

const el = id => document.getElementById(id);
const text = key => words[state.lang][key] || key;
const fill = (key, vars = {}) => Object.entries(vars).reduce((value, pair) => value.replace(`{${pair[0]}}`, pair[1]), text(key));

function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function load() {
    try {
        const order = localStorage.getItem("linked-order");
        const pace = localStorage.getItem("linked-pace");
        const first = localStorage.getItem("linked-first");
        if (orders.includes(order)) state.set.order = order;
        if (paces.includes(pace)) state.set.pace = pace;
        if (firsts.includes(first)) state.set.first = first;
    } catch (error) {
        return;
    }
}

function store() {
    try {
        localStorage.setItem("linked-order", state.set.order);
        localStorage.setItem("linked-pace", state.set.pace);
        localStorage.setItem("linked-first", state.set.first);
    } catch (error) {
        return;
    }
}

function clear() {
    if (state.timer !== null) cancelAnimationFrame(state.timer);
    state.timer = null;
}

function reset() {
    clear();
    state.token++;
    state.human = [];
    state.ai = [];
    state.draw = [];
    state.discard = [];
    state.active = null;
    state.turn = "player";
    state.acted = false;
    state.drawn = null;
    state.chain = null;
    state.played = [];
    state.effect = null;
    state.busy = false;
    state.ready = false;
    state.done = false;
    state.moves = 0;
    state.start = 0;
    state.elapsed = 0;
    state.run = null;
    state.note = null;
    state.log = [];
}

function show(page) {
    if (page !== "play") clear();
    state.page = page;
    document.querySelectorAll(".page").forEach(node => node.classList.toggle("active", node.id === page));
    window.scrollTo({ top:0, behavior:"auto" });
    paint();
}

function theme() {
    document.documentElement.dataset.theme = state.theme;
    const dark = state.theme === "dark";
    el("theme").querySelector("i").className = dark ? "ph ph-moon" : "ph ph-sun";
    el("theme").querySelector("span").textContent = dark ? "DM" : "LM";
    document.querySelector('meta[name="theme-color"]').content = dark ? "#151715" : "#88413A";
}

function menus() {
    const handorder = el("handorder");
    handorder.innerHTML = orders.map(value => `<option value="${value}">${text(value)}</option>`).join("");
    handorder.value = state.set.order;
    const aipace = el("aipace");
    aipace.innerHTML = paces.map(value => `<option value="${value}">${text(value)}</option>`).join("");
    aipace.value = state.set.pace;
    const first = el("first");
    first.innerHTML = firsts.map(value => `<option value="${value}">${text(value)}</option>`).join("");
    first.value = state.set.first;
}

function translate() {
    document.documentElement.lang = state.lang;
    document.title = game;
    document.querySelectorAll("[data-title]").forEach(node => node.textContent = game);
    document.querySelectorAll("[data-logo]").forEach(node => node.innerHTML = `<span>${game.slice(0, 2)}</span>${game.slice(2)}`);
    document.querySelectorAll("[data-t]").forEach(node => node.textContent = text(node.dataset.t));
    el("lang").querySelector("span").textContent = state.lang.toUpperCase();
    el("theme").setAttribute("aria-label", text("theme"));
    el("lang").setAttribute("aria-label", text("language"));
    document.querySelectorAll("[data-go='home']").forEach(node => node.setAttribute("aria-label", text("home")));
    el("quit").setAttribute("aria-label", text("home"));
    el("table").setAttribute("aria-label", text("table"));
    el("colorpick").setAttribute("aria-label", text("choose"));
    menus();
}

function paint() {
    translate();
    theme();
    if (state.page === "setup") setup();
    if (state.page === "play") render();
    if (state.page === "results") scores();
    if (state.page === "help") guide();
}

function setup() {
    const box = el("options");
    box.innerHTML = `<label class="cat selectcat"><span>${text("deal")}</span><select id="deal">${deals.map(value => `<option value="${value}">${text(value)}</option>`).join("")}</select></label>`;
    box.innerHTML += `<div class="cat"><span>${text("starting")}</span><div class="stepper"><button data-step="-1" aria-label="-"${state.form.cards <= 4 ? " disabled" : ""}>−</button><b>${state.form.cards}</b><button data-step="1" aria-label="+"${state.form.cards >= 9 ? " disabled" : ""}>+</button></div></div>`;
    el("deal").value = state.form.deal;
    el("deal").addEventListener("change", event => { state.form.deal = event.target.value; });
}

function deck() {
    const list = [];
    tones.forEach(color => {
        for (let value = 0; value <= 9; value++) {
            list.push({ id:`n-${color}-${value}-a`, kind:"number", color, value });
            list.push({ id:`n-${color}-${value}-b`, kind:"number", color, value });
        }
        list.push({ id:`b-${color}`, kind:"block", color, value:null });
        list.push({ id:`p2-${color}-a`, kind:"plus2", color, value:null });
        list.push({ id:`p2-${color}-b`, kind:"plus2", color, value:null });
    });
    list.push({ id:"w-a", kind:"wild", color:null, value:null });
    list.push({ id:"w-b", kind:"wild", color:null, value:null });
    list.push({ id:"p4-a", kind:"plus4", color:null, value:null });
    list.push({ id:"p4-b", kind:"plus4", color:null, value:null });
    return list;
}

function take(list, test) {
    const index = list.findIndex(test);
    if (index < 0) return null;
    return list.splice(index, 1)[0];
}

function opening(list) {
    const pool = list.filter(card => card.kind === "number");
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    return take(list, card => card.id === chosen.id);
}

function shuffled(count) {
    const list = shuffle(deck());
    const human = [];
    const ai = [];
    for (let i = 0; i < count; i++) {
        human.push(list.pop());
        ai.push(list.pop());
    }
    const first = opening(list);
    return { human, ai, discard:[first], draw:shuffle(list) };
}

function matched(count) {
    const list = deck();
    const human = [];
    const ai = [];
    const tone = tones[Math.floor(Math.random() * tones.length)];
    const pair = (test) => {
        const one = take(list, test);
        const two = take(list, test);
        human.push(one);
        ai.push(two);
    };
    pair(card => card.kind === "plus4");
    pair(card => card.kind === "wild");
    pair(card => card.kind === "plus2" && card.color === tone);
    const identities = shuffle(tones.flatMap(color => Array.from({ length:10 }, (_, value) => ({ color, value }))));
    for (let i = 0; i < count - 3; i++) {
        const pick = identities[i];
        pair(card => card.kind === "number" && card.color === pick.color && card.value === pick.value);
    }
    const mixed = shuffle(list);
    const first = opening(mixed);
    return { human:shuffle(human), ai:shuffle(ai), discard:[first], draw:shuffle(mixed) };
}

function audit() {
    if (!state.run || state.done) return true;
    const all = [...state.human, ...state.ai, ...state.draw, ...state.discard];
    const ids = new Set(all.map(card => card.id));
    const valid = all.length === 96 && ids.size === 96;
    if (!valid) console.error("LINKED card-state invariant failed", all.length, ids.size);
    return valid;
}

function format(value) {
    const time = Math.max(0, Math.floor(value));
    const min = String(Math.floor(time / 60000)).padStart(2, "0");
    const sec = String(Math.floor(time / 1000) % 60).padStart(2, "0");
    const ms = String(time % 1000).padStart(3, "0");
    return `${min}:${sec}.${ms}`;
}

function tick() {
    if (!state.ready || state.done || state.page !== "play") return;
    state.elapsed = performance.now() - state.start;
    el("time").textContent = format(state.elapsed);
    state.timer = requestAnimationFrame(tick);
}

function clock() {
    state.elapsed = 0;
    el("time").textContent = format(0);
    requestAnimationFrame(() => {
        if (state.page !== "play" || state.done) return;
        state.ready = true;
        state.start = performance.now();
        render();
        tick();
        if (state.turn === "ai") aiturn();
    });
}

function topcard() {
    return state.discard[state.discard.length - 1] || null;
}

function baselegal(card) {
    const top = topcard();
    if (!top) return true;
    if (card.kind === "wild" || card.kind === "plus4") return true;
    if (card.color === state.active) return true;
    if (card.kind === "number") return top.kind === "number" && card.value === top.value;
    if (card.kind === "block") return top.kind === "block";
    if (card.kind === "plus2") return top.kind === "plus2";
    return false;
}

function playable(card) {
    if (!state.played.length) {
        if (state.drawn && card.id !== state.drawn) return false;
        return baselegal(card);
    }
    return state.chain !== null && card.kind === "number" && card.value === state.chain;
}

function canplay(hand) {
    return hand.some(card => baselegal(card));
}

function canpull() {
    return state.draw.length > 0 || state.discard.length > 1;
}

function recycle() {
    if (state.draw.length || state.discard.length <= 1) return false;
    const top = state.discard.pop();
    state.draw = shuffle(state.discard);
    state.discard = [top];
    audit();
    return state.draw.length > 0;
}

function onecard() {
    if (!state.draw.length) recycle();
    return state.draw.length ? state.draw.pop() : null;
}

function pull(hand, count) {
    const got = [];
    for (let i = 0; i < count; i++) {
        const card = onecard();
        if (!card) break;
        hand.push(card);
        got.push(card);
    }
    audit();
    return got;
}

function plural(count) {
    if (state.lang === "ru") {
        const tens = count % 100;
        const ones = count % 10;
        if (ones === 1 && tens !== 11) return "карта";
        if (ones >= 2 && ones <= 4 && (tens < 12 || tens > 14)) return "карты";
        return "карт";
    }
    if (state.lang === "en" && count === 1) return text("card");
    return text("cards");
}

function countlabel(label, count) {
    return `${label} · ${count} ${plural(count).toUpperCase()}`;
}

function cardname(card) {
    if (card.kind === "number") return `${text(card.color)} ${card.value}`;
    if (card.kind === "block") return `${text(card.color)} ${text("block")}`;
    if (card.kind === "plus2") return `${text(card.color)} ${text("plus2")}`;
    if (card.kind === "wild") return text("wild");
    return text("plus4");
}

function symbols() {
    return tones.map(color => `<span class="sig ${color}">${colors[color].shape}</span>`).join("");
}

function cardhtml(card) {
    const tone = card.color ? ` ${card.color}` : " special";
    if (card.kind === "number") return `<span class="cardface${tone}"><span class="corner left">${card.value}</span><span class="corner right">${colors[card.color].shape}</span><strong>${card.value}</strong></span>`;
    if (card.kind === "plus2") return `<span class="cardface${tone}"><span class="corner left">+2</span><span class="corner right">${colors[card.color].shape}</span><strong>+2</strong></span>`;
    if (card.kind === "block") return `<span class="cardface${tone}"><span class="corner left">⊘</span><span class="corner right">${colors[card.color].shape}</span><strong>⊘</strong></span>`;
    if (card.kind === "wild") return `<span class="cardface special"><span class="corner left">✦</span><span class="multis">${symbols()}</span></span>`;
    return `<span class="cardface special"><span class="corner left">+4</span><strong>+4</strong><span class="multis small">${symbols()}</span></span>`;
}

function rank(card, mode) {
    const tone = card.color ? tones.indexOf(card.color) : 9;
    if (mode === "color") {
        if (!card.color) return card.kind === "wild" ? 900 : 910;
        if (card.kind === "number") return tone * 100 + (9 - card.value);
        return tone * 100 + (card.kind === "block" ? 20 : 21);
    }
    if (card.kind === "number") return (9 - card.value) * 10 + tone;
    if (card.kind === "block") return 200 + tone;
    if (card.kind === "plus2") return 210 + tone;
    if (card.kind === "wild") return 300;
    return 310;
}

function ordered() {
    const list = [...state.human];
    if (state.set.order === "dealt") return list;
    return list.sort((a, b) => rank(a, state.set.order) - rank(b, state.set.order));
}

function activehtml() {
    if (!state.active) return "";
    return `<span class="dot" style="--tone:${colors[state.active].hex}">${colors[state.active].shape}</span><span>${text("active")}: ${text(state.active)}</span>`;
}

function activitytext(item) {
    const parts = [item.actor === "player" ? text("you").toUpperCase() : text("ai").toUpperCase()];
    if (item.pass) {
        parts.push(text("passlog").toUpperCase());
        return parts.join(" · ");
    }
    if (item.draw) parts.push(`${text("drawlog").toUpperCase()} +1`);
    if (item.cards.length) {
        let cards = item.cards.map(cardname).join(" → ");
        if (item.color) cards += ` → ${colors[item.color].shape} ${text(item.color)}`;
        parts.push(cards);
    }
    return parts.join(" · ");
}

function activity() {
    const box = el("activitylog");
    if (!state.log.length) {
        box.innerHTML = `<p class="activityempty">${text("noactivity")}</p>`;
        return;
    }
    box.innerHTML = state.log.map(item => `<div class="activityrow">${activitytext(item)}</div>`).join("");
}

function record(who) {
    const cards = state.played.map(id => state.discard.find(card => card.id === id)).filter(Boolean).map(card => ({ kind:card.kind, color:card.color, value:card.value }));
    state.log.push({
        actor:who,
        draw:state.drawn !== null,
        cards,
        color:["wild","plus4"].includes(state.effect) ? state.active : null,
        pass:state.played.length === 0 && state.drawn === null
    });
    if (state.log.length > 3) state.log.shift();
}

function controls() {
    const human = state.turn === "player" && state.ready && !state.busy && !state.done;
    const locked = state.played.length > 0 && state.chain === null;
    document.querySelectorAll("#hand [data-card]").forEach(button => { button.disabled = !human || locked; });
    el("draw").disabled = !human || state.acted || !canpull();
    let end = human && state.acted;
    if (state.effect && ["wild","plus4"].includes(state.effect) && state.human.length && !state.active) end = false;
    el("endturn").disabled = !end;
    el("colorpick").querySelectorAll("button").forEach(button => { button.disabled = !human; });
}

function colorpick() {
    const box = el("colorpick");
    const need = state.turn === "player" && !state.busy && state.played.length === 1 && ["wild","plus4"].includes(state.effect) && state.human.length > 0 && !state.active;
    if (!need) {
        box.innerHTML = "";
        box.classList.remove("show");
        return;
    }
    box.classList.add("show");
    box.innerHTML = `<b>${text("choose")}</b><div>${tones.map(color => `<button data-color="${color}" aria-label="${text(color)}"><span class="dot" style="--tone:${colors[color].hex}">${colors[color].shape}</span>${text(color)}</button>`).join("")}</div>`;
}

function render() {
    if (!state.run) return;
    el("status").textContent = state.turn === "player" ? text("yourturn") : text("aiturn");
    el("time").textContent = format(state.elapsed);
    el("moves").textContent = state.moves;
    el("youcount").textContent = countlabel(text("you").toUpperCase(), state.human.length);
    el("aicount").textContent = countlabel(text("ai").toUpperCase(), state.ai.length);
    el("drawcount").textContent = `${text("draw").toUpperCase()} · ${state.draw.length}`;
    el("discardcount").textContent = `${text("discard").toUpperCase()} · ${state.discard.length}`;
    el("activecolor").innerHTML = activehtml();
    el("message").textContent = state.note ? text(state.note) : "";

    const aicards = el("aicards");
    aicards.innerHTML = state.ai.map(() => `<span class="backcard"><b>L</b></span>`).join("");

    const draw = el("draw");
    draw.innerHTML = `<span class="backcard"><b>L</b></span>`;
    draw.setAttribute("aria-label", `${text("draw")}, ${state.draw.length} ${plural(state.draw.length)}`);

    const top = topcard();
    el("discard").innerHTML = top ? cardhtml(top) : "";
    el("discard").setAttribute("aria-label", top ? cardname(top) : text("discard"));

    const hand = el("hand");
    hand.innerHTML = "";
    ordered().forEach(card => {
        const button = document.createElement("button");
        button.className = "card";
        button.dataset.card = card.id;
        button.setAttribute("aria-label", cardname(card));
        button.innerHTML = cardhtml(card);
        hand.append(button);
    });
    colorpick();
    controls();
    activity();
}

function reject(id, note = "badplay") {
    state.note = note;
    const button = id ? document.querySelector(`[data-card="${id}"]`) : null;
    if (button) {
        button.classList.remove("bad");
        void button.offsetWidth;
        button.classList.add("bad");
        setTimeout(() => button.classList.remove("bad"), 260);
    }
    render();
}

function place(hand, card, who) {
    const index = hand.findIndex(item => item.id === card.id);
    if (index < 0) return false;
    hand.splice(index, 1);
    state.discard.push(card);
    state.played.push(card.id);
    state.acted = true;
    state.effect = card.kind === "number" ? null : card.kind;
    if (card.kind === "number") {
        if (state.chain === null) state.chain = card.value;
        state.active = card.color;
    } else if (card.color) {
        state.active = card.color;
    } else {
        state.active = null;
    }
    if (who === "player") state.moves++;
    state.note = null;
    audit();
    return true;
}

function choose(id) {
    if (!state.ready || state.done || state.busy || state.turn !== "player") return;
    const card = state.human.find(item => item.id === id);
    if (!card) return;
    if (!playable(card)) {
        reject(id);
        return;
    }
    if (!place(state.human, card, "player")) return;
    render();
}

function drawone() {
    if (!state.ready || state.done || state.busy || state.turn !== "player" || state.acted) return;
    if (!canpull()) {
        reject(null, "nodraw");
        return;
    }
    const got = pull(state.human, 1);
    if (!got.length) {
        reject(null, "nodraw");
        return;
    }
    state.moves++;
    state.acted = true;
    state.drawn = got[0].id;
    state.note = null;
    render();
}

function setcolor(color) {
    if (state.turn !== "player" || state.busy || !tones.includes(color)) return;
    if (!state.played.length || !["wild","plus4"].includes(state.effect) || !state.human.length) return;
    state.active = color;
    state.note = null;
    render();
}

function score(hand) {
    return hand.reduce((sum, card) => {
        if (card.kind === "number") return sum + card.value;
        if (card.kind === "block" || card.kind === "plus2") return sum + 25;
        return sum + 50;
    }, 0);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pace(kind = "first") {
    const first = { quick:1000, standard:1250, relaxed:1750 }[state.set.pace];
    const gap = { quick:350, standard:500, relaxed:700 }[state.set.pace];
    return kind === "first" ? first : gap;
}

function other(who) {
    return who === "player" ? "ai" : "player";
}

function handof(who) {
    return who === "player" ? state.human : state.ai;
}

function forced(who, count) {
    const got = pull(handof(who), count);
    render();
    return got.length;
}

function turnbegin(who) {
    state.turn = who;
    state.acted = false;
    state.drawn = null;
    state.chain = null;
    state.played = [];
    state.effect = null;
    state.busy = false;
    state.note = null;
    if (who === "player" && !canpull() && !canplay(state.human)) {
        state.acted = true;
        state.note = "forcedpass";
    }
    render();
    if (who === "ai" && state.ready && !state.done) aiturn();
}

function finish(who) {
    if (state.done) return;
    state.elapsed = performance.now() - state.start;
    clear();
    state.ready = false;
    state.done = true;
    state.busy = true;
    state.run.time = state.elapsed;
    state.run.moves = state.moves;
    state.run.winner = who;
    state.run.player = who === "player" ? 0 : score(state.human);
    state.run.ai = who === "ai" ? 0 : score(state.ai);
    show("results");
    if (who === "player") burst();
}

async function commit(who) {
    if (state.done) return;
    record(who);
    const effect = state.effect;
    const empty = handof(who).length === 0;
    if (effect === "plus2") forced(other(who), 2);
    if (effect === "plus4") forced(other(who), 4);
    if (empty) {
        finish(who);
        return;
    }
    if (effect === "block" || effect === "plus2" || effect === "plus4") {
        turnbegin(who);
        return;
    }
    turnbegin(other(who));
}

function endturn() {
    if (!state.ready || state.done || state.busy || state.turn !== "player" || !state.acted) return;
    if (state.effect && ["wild","plus4"].includes(state.effect) && state.human.length && !state.active) {
        reject(null, "needcolor");
        return;
    }
    state.busy = true;
    controls();
    commit("player");
}

function strength(color, hand) {
    return hand.filter(card => card.color === color).length;
}

function aichain(first) {
    const same = state.ai.filter(card => card.kind === "number" && card.value === first.value && card.id !== first.id);
    const removed = new Set([first.id, ...same.map(card => card.id)]);
    const remain = state.ai.filter(card => !removed.has(card.id));
    return [first, ...same.sort((a, b) => strength(a.color, remain) - strength(b.color, remain))];
}

function aiscore(card) {
    const close = state.human.length <= 2;
    if (card.kind === "number") {
        const chain = aichain(card);
        if (chain.length === state.ai.length) return 10000;
        const remain = state.ai.filter(item => !chain.some(link => link.id === item.id));
        const last = chain[chain.length - 1];
        return chain.length * 35 + card.value + strength(last.color, remain) * 4;
    }
    if (state.ai.length === 1) return 10000;
    if (card.kind === "plus4") return close ? 240 : 32;
    if (card.kind === "plus2") return close ? 210 : 58 + strength(card.color, state.ai) * 2;
    if (card.kind === "block") return close ? 190 : 48 + strength(card.color, state.ai) * 2;
    return close ? 130 : 26;
}

function aipick() {
    const legal = state.ai.filter(card => baselegal(card));
    if (!legal.length) return null;
    const ordinary = legal.filter(card => card.kind !== "wild" && card.kind !== "plus4");
    const ranked = [...legal].sort((a, b) => aiscore(b) - aiscore(a));
    if (!ordinary.length && state.ai.length > 3 && state.human.length > 2 && Math.random() < .45) return null;
    const best = ranked[0];
    const tied = ranked.filter(card => Math.abs(aiscore(card) - aiscore(best)) < 3);
    return tied[Math.floor(Math.random() * tied.length)];
}

function aicolor() {
    const counts = tones.map(color => ({ color, count:state.ai.filter(card => card.color === color).length }));
    const max = Math.max(...counts.map(item => item.count));
    const best = counts.filter(item => item.count === max);
    return best[Math.floor(Math.random() * best.length)].color;
}

function aikeep(card) {
    if (!["wild","plus4"].includes(card.kind)) return false;
    return state.ai.length > 3 && state.human.length > 3 && Math.random() < .35;
}

async function aiplay(first, token) {
    if (token !== state.token || state.done || state.turn !== "ai") return;
    place(state.ai, first, "ai");
    render();
    if (state.ai.length && ["wild","plus4"].includes(first.kind)) {
        await sleep(Math.min(350, pace("gap")));
        if (token !== state.token || state.done || state.turn !== "ai") return;
        state.active = aicolor();
        render();
    }
    if (first.kind === "number") {
        const chain = aichain(first).slice(1);
        for (const card of chain) {
            await sleep(pace("gap"));
            if (token !== state.token || state.done || state.turn !== "ai") return;
            place(state.ai, card, "ai");
            render();
        }
    }
    await sleep(Math.min(300, pace("gap")));
    if (token !== state.token || state.done || state.turn !== "ai") return;
    await commit("ai");
}

async function aiturn() {
    const token = state.token;
    state.busy = true;
    render();
    await sleep(pace("first"));
    if (token !== state.token || state.done || state.turn !== "ai") return;
    let card = aipick();
    if (!card) {
        if (!canpull()) {
            await commit("ai");
            return;
        }
        const got = pull(state.ai, 1);
        render();
        if (!got.length) {
            await commit("ai");
            return;
        }
        card = got[0];
        state.acted = true;
        state.drawn = card.id;
        if (!baselegal(card) || aikeep(card)) {
            await sleep(Math.min(350, pace("gap")));
            if (token !== state.token || state.done || state.turn !== "ai") return;
            await commit("ai");
            return;
        }
        await sleep(pace("gap"));
        if (token !== state.token || state.done || state.turn !== "ai") return;
    }
    await aiplay(card, token);
}

function begin(config = null) {
    clear();
    state.token++;
    const source = config || { deal:state.form.deal, cards:state.form.cards };
    const item = source.deal === "matched" ? matched(source.cards) : shuffled(source.cards);
    state.human = item.human;
    state.ai = item.ai;
    state.draw = item.draw;
    state.discard = item.discard;
    state.active = item.discard[0].color;
    state.turn = state.set.first;
    state.acted = false;
    state.drawn = null;
    state.chain = null;
    state.played = [];
    state.effect = null;
    state.busy = state.turn === "ai";
    state.ready = false;
    state.done = false;
    state.moves = 0;
    state.start = 0;
    state.elapsed = 0;
    state.note = null;
    state.log = [];
    state.run = { deal:source.deal, cards:source.cards, first:state.set.first, time:0, moves:0, winner:null, player:0, ai:0 };
    audit();
    show("play");
    clock();
}

function fresh() {
    if (!state.run) return;
    begin({ deal:state.run.deal, cards:state.run.cards });
}

function scores() {
    if (!state.run) return;
    const run = state.run;
    el("resultnote").textContent = text("lower");
    const rows = [
        ["winner",run.winner === "player" ? text("playerwin") : text("aiwin")],
        ["playerscore",run.player],
        ["aiscore",run.ai],
        ["completion",format(run.time)],
        ["moves",run.moves]
    ];
    const config = [["dealmode",text(run.deal)],["starting",run.cards],["firstplayed",text(run.first)]];
    const box = el("scores");
    box.innerHTML = rows.map(row => `<div class="score"><div><b>${text(row[0])}</b></div><strong>${row[1]}</strong></div>`).join("");
    box.innerHTML += `<div class="score config"><div><b>${text("configuration")}</b></div></div>`;
    box.innerHTML += config.map(row => `<div class="score config"><div><b>${text(row[0])}</b></div><strong>${row[1]}</strong></div>`).join("");
}

function burst() {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof confetti !== "function") return;
    confetti({ particleCount:65, angle:270, spread:80, startVelocity:22, gravity:1.1, ticks:60, origin:{ y:.02 } });
}

function guide() {
    const box = el("helpcopy");
    box.innerHTML = `<div class="topic"><p>${fill("helpintro", { game })}</p></div>` + topics.map(topic => `<div class="topic"><h3>${text(topic.title)}</h3>${topic.text.map(key => `<p${key === topic.text[0] ? "" : ' class="gap"'}>${text(key)}</p>`).join("")}</div>`).join("");
}

function settings() {
    state.set.order = el("handorder").value;
    state.set.pace = el("aipace").value;
    state.set.first = el("first").value;
    store();
    if (state.page === "play") render();
}

document.addEventListener("click", event => {
    const go = event.target.closest("[data-go]");
    if (go) {
        const page = go.dataset.go;
        if (page === "home" && state.page !== "home") reset();
        show(page);
        return;
    }

    const step = event.target.closest("[data-step]");
    if (step) {
        const change = Number(step.dataset.step);
        state.form.cards = Math.max(4, Math.min(9, state.form.cards + change));
        setup();
        return;
    }

    const card = event.target.closest("#hand [data-card]");
    if (card) {
        choose(card.dataset.card);
        return;
    }

    const color = event.target.closest("[data-color]");
    if (color) setcolor(color.dataset.color);
});

el("theme").addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    theme();
});

el("lang").addEventListener("click", () => {
    state.lang = langs[(langs.indexOf(state.lang) + 1) % langs.length];
    paint();
});

el("handorder").addEventListener("change", settings);
el("aipace").addEventListener("change", settings);
el("first").addEventListener("change", settings);
el("start").addEventListener("click", () => begin());
el("quit").addEventListener("click", () => { reset(); show("home"); });
el("draw").addEventListener("click", drawone);
el("endturn").addEventListener("click", endturn);
el("replay").addEventListener("click", fresh);

load();
paint();