export class MotionController {
  constructor(onCorrect,onSkip){ this.onCorrect=onCorrect; this.onSkip=onSkip; this.enabled=false; this.locked=false; this.handle=this.handle.bind(this); }
  async enable(){
    try{
      if(typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function'){
        const permission=await DeviceOrientationEvent.requestPermission();
        if(permission !== 'granted') return false;
      }
      window.addEventListener('deviceorientation',this.handle);
      this.enabled=true; return true;
    }catch{ return false; }
  }
  disable(){ window.removeEventListener('deviceorientation',this.handle); this.enabled=false; this.locked=false; }
  handle(event){
    if(this.locked || event.beta == null) return;
    const beta=event.beta;
    if(beta > 55){ this.trigger(this.onCorrect); }
    else if(beta < -35){ this.trigger(this.onSkip); }
  }
  trigger(callback){ this.locked=true; callback(); setTimeout(()=>{this.locked=false;},900); }
}