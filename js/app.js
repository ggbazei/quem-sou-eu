import { categories, getCategory } from './categories.js';
import { Game } from './game.js';
import { MotionController } from './motion.js';

const game=new Game();
let selectedCategory=null, selectedTime=60, selectedControl='touch', acceptingAnswers=false;
const $=id=>document.getElementById(id);
const screens=[...document.querySelectorAll('.screen')];
const motion=new MotionController(()=>answer('correct'),()=>answer('skip'));

function show(id){ screens.forEach(s=>s.classList.toggle('active',s.id===id)); }
function renderCategories(){ $('category-list').innerHTML=categories.map(c=>`<button class="category-card" data-category="${c.id}"><span>${c.icon}</span><strong>${c.name}</strong><small>${c.items.length} opções</small></button>`).join(''); }
function chooseCategory(id){ selectedCategory=getCategory(id); $('selected-category-icon').textContent=selectedCategory.icon; $('selected-category-name').textContent=selectedCategory.name; $('selected-category-count').textContent=`${selectedCategory.items.length} opções disponíveis`; show('setup-screen'); }
function renderCard(){ const item=game.current(); $('card-word').textContent=item?.[0]??''; $('card-emoji').textContent=item?.[1]??''; }
function flash(status){ const card=$('card'); card.style.background=status==='correct'?'#166534':'#991b1b'; setTimeout(()=>card.style.background='',260); }
function answer(status){ if(!acceptingAnswers) return; acceptingAnswers=false; game.answer(status); flash(status); setTimeout(()=>{ renderCard(); acceptingAnswers=true; },300); }

async function start(){
  game.prepare(selectedCategory,selectedTime); $('game-category').textContent=`${selectedCategory.icon} ${selectedCategory.name}`; $('timer').textContent=selectedTime;
  if(selectedControl==='motion'){ const ok=await motion.enable(); if(!ok) selectedControl='touch'; }
  show('ready-screen'); let count=3; $('countdown').textContent=count;
  const countdown=setInterval(()=>{ count--; if(count>0){$('countdown').textContent=count;}else{clearInterval(countdown); beginRound();}},1000);
}
function beginRound(){ renderCard(); acceptingAnswers=true; show('play-screen'); try{screen.orientation?.lock?.('landscape').catch(()=>{});}catch{} game.startTimer(value=>$('timer').textContent=value,endRound); }
function endRound(){ acceptingAnswers=false; motion.disable(); game.stopTimer(); $('correct-count').textContent=game.correctCount; $('result-list').innerHTML=game.results.length?game.results.map(r=>`<div class="result-item ${r.status}-result"><span>${r.emoji} ${r.word}</span><b>${r.status==='correct'?'✓':'→'}</b></div>`).join(''):'<p class="muted">Nenhuma resposta registrada.</p>'; show('result-screen'); }
function home(){ motion.disable(); game.stopTimer(); show('home-screen'); }

document.addEventListener('click',e=>{
  const category=e.target.closest('[data-category]'); if(category) chooseCategory(category.dataset.category);
  const time=e.target.closest('[data-time]'); if(time){ selectedTime=Number(time.dataset.time); document.querySelectorAll('[data-time]').forEach(b=>b.classList.toggle('selected',b===time)); }
  const control=e.target.closest('[data-control]'); if(control){ selectedControl=control.dataset.control; document.querySelectorAll('[data-control]').forEach(b=>b.classList.toggle('selected',b===control)); }
  if(e.target.closest('[data-action="home"]')) home();
});
$('start-button').addEventListener('click',start);
$('correct-button').addEventListener('click',()=>answer('correct'));
$('skip-button').addEventListener('click',()=>answer('skip'));
$('play-again-button').addEventListener('click',start);
renderCategories();