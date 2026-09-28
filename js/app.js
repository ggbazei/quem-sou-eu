import { categories, getCategory } from './categories.js';
import { Game } from './game.js';

const game=new Game();
let selectedCategory=null, acceptingAnswers=false;
const $=id=>document.getElementById(id);
const screens=[...document.querySelectorAll('.screen')];

function show(id){ screens.forEach(s=>s.classList.toggle('active',s.id===id)); }
function renderCategories(){ $('category-list').innerHTML=categories.map(c=>`<button class="category-card" data-category="${c.id}"><span>${c.icon}</span><strong>${c.name}</strong><small>${c.items.length} opções</small></button>`).join(''); }
function chooseCategory(id){ selectCategory(getCategory(id)); }
function selectCategory(category){ selectedCategory=category; $('selected-category-icon').textContent=category.icon; $('selected-category-name').textContent=category.name; $('selected-category-count').textContent=`${category.items.length} palavras disponíveis`; show('setup-screen'); }
function parseCustomWords(){ return [...new Set($('custom-words').value.split(',').map(word=>word.trim()).filter(Boolean))]; }
function updateCustomCount(){ const total=parseCustomWords().length; $('custom-count').textContent=`${total} ${total===1?'palavra':'palavras'}`; $('custom-error').hidden=true; }
function useCustomList(){ const words=parseCustomWords(); if(words.length<2){ $('custom-error').hidden=false; return; } selectCategory({id:'custom',name:'Minha lista',icon:'✏️',items:words.map(word=>[word,''])}); }
function renderCard(){ const item=game.current(); $('card-word').textContent=item?.[0]??''; $('card-emoji').textContent=item?.[1]??''; }
function flash(status){ const card=$('card'); card.style.background=status==='correct'?'#166534':'#991b1b'; setTimeout(()=>card.style.background='',260); }
function answer(status){ if(!acceptingAnswers) return; acceptingAnswers=false; game.answer(status); flash(status); setTimeout(()=>{ renderCard(); acceptingAnswers=true; },300); }
function start(){ game.prepare(selectedCategory); $('game-category').textContent=`${selectedCategory.icon} ${selectedCategory.name}`; show('ready-screen'); let count=3; $('countdown').textContent=count; const countdown=setInterval(()=>{ count--; if(count>0){$('countdown').textContent=count;}else{clearInterval(countdown); beginGame();}},1000); }
function beginGame(){ renderCard(); acceptingAnswers=true; show('play-screen'); }
function endGame(){ acceptingAnswers=false; $('correct-count').textContent=game.correctCount; $('result-list').innerHTML=game.results.length?game.results.map(r=>`<div class="result-item ${r.status}-result"><span>${r.emoji} ${r.word}</span><b>${r.status==='correct'?'✓':'→'}</b></div>`).join(''):'<p class="muted">Nenhuma resposta registrada.</p>'; show('result-screen'); }
function home(){ acceptingAnswers=false; show('home-screen'); }

document.addEventListener('click',e=>{ const category=e.target.closest('[data-category]'); if(category) chooseCategory(category.dataset.category); if(e.target.closest('[data-action="home"]')) home(); });
$('custom-category-button').addEventListener('click',()=>show('custom-screen'));
$('custom-words').addEventListener('input',updateCustomCount);
$('use-custom-button').addEventListener('click',useCustomList);
$('start-button').addEventListener('click',start);
$('correct-button').addEventListener('click',()=>answer('correct'));
$('skip-button').addEventListener('click',()=>answer('skip'));
$('finish-button').addEventListener('click',endGame);
$('play-again-button').addEventListener('click',start);
renderCategories();