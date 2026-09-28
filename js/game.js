import { shuffled } from './categories.js';

export class Game {
  constructor(){ this.timerId=null; this.reset(); }
  reset(){ this.category=null; this.duration=60; this.remaining=60; this.deck=[]; this.index=0; this.results=[]; }
  prepare(category,duration){ this.stopTimer(); this.category=category; this.duration=duration; this.remaining=duration; this.deck=shuffled(category.items); this.index=0; this.results=[]; }
  current(){ if(!this.deck.length) return null; if(this.index >= this.deck.length){ this.deck=shuffled(this.category.items); this.index=0; } return this.deck[this.index]; }
  answer(status){ const item=this.current(); if(!item) return; this.results.push({word:item[0],emoji:item[1],status}); this.index += 1; }
  startTimer(onTick,onEnd){ this.stopTimer(); onTick(this.remaining); this.timerId=setInterval(()=>{ this.remaining -= 1; onTick(this.remaining); if(this.remaining <= 0){ this.stopTimer(); onEnd(); } },1000); }
  stopTimer(){ if(this.timerId){ clearInterval(this.timerId); this.timerId=null; } }
  get correctCount(){ return this.results.filter(result=>result.status==='correct').length; }
}