import { shuffled } from './categories.js';

export class Game {
  constructor(){ this.reset(); }
  reset(){ this.category=null; this.deck=[]; this.index=0; this.results=[]; }
  prepare(category){ this.category=category; this.deck=shuffled(category.items); this.index=0; this.results=[]; }
  current(){
    if(!this.deck.length) return null;
    if(this.index >= this.deck.length){ this.deck=shuffled(this.category.items); this.index=0; }
    return this.deck[this.index];
  }
  answer(status){
    const item=this.current();
    if(!item) return;
    this.results.push({word:item[0],emoji:item[1],status});
    this.index += 1;
  }
  get correctCount(){ return this.results.filter(result=>result.status==='correct').length; }
}