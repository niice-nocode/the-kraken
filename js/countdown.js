function initCountdown(){
  var reg={items:[],timer:null};

  function parseIso(root){
    var s=root.getAttribute('data-countdown-date')||'';
    var m=s.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{1,2}):(\d{2})$/);
    if(!m) return null;
    var y=+m[1],mo=+m[2]-1,d=+m[3],h=+m[4],mi=+m[5];
    var t=Date.UTC(y,mo,d,h,mi,0,0);
    var off=+(root.getAttribute('data-countdown-timezone-offset')||0);
    if(off) t-=off*3600000;
    var dt=new Date(t);
    if(dt.getUTCFullYear()!==y||dt.getUTCMonth()!==mo||dt.getUTCDate()!==d) return null;
    return t;
  }

  function splitByUnits(ms,u){
    var secs=Math.max(0,Math.floor(ms/1000));
    var out={years:0,months:0,weeks:0,days:0,hours:0,minutes:0,seconds:0,done:ms<=0};
    var seq=[['years',31536000],['months',2592000],['weeks',604800],['days',86400],['hours',3600],['minutes',60],['seconds',1]];
    for(var i=0;i<seq.length;i++){
      var k=seq[i][0],len=seq[i][1];
      if(u[k]){ out[k]=Math.floor(secs/len); secs%=len; }
    }
    return out;
  }

  var sing={years:'year',months:'month',weeks:'week',days:'day',hours:'hour',minutes:'minute',seconds:'second'};
  var abbr={years:['yr.','yrs.'],months:['mo.','mos.'],weeks:['wk.','wks.'],days:['day','days'],hours:['hr.','hrs.'],minutes:['min.','mins.'],seconds:['sec.','secs.']};
  function lab(k,v,f){
    if(f==='plain') return ''+v;
    if(f==='short') return v+(k==='months'?'mo':k[0]);
    if(f==='abbr'){ var a=abbr[k]; return v+' '+a[v===1?0:1]; }
    return v+' '+(v===1?sing[k]:k);
  }

  function make(root){
    var u={}, order=['years','months','weeks','days','hours','minutes','seconds'];
    root.querySelectorAll('[data-countdown-update]').forEach(function(n){
      var k=(n.getAttribute('data-countdown-update')||'').toLowerCase();
      if(order.indexOf(k)>-1) u[k]=n;
    });
    var tgt=parseIso(root);
    if(tgt==null){
      root.setAttribute('data-countdown-status','error');
      var first=null; for(var i=0;i<order.length;i++){ if(u[order[i]]){ first=u[order[i]]; break; } }
      if(first) first.textContent='Invalid Date, use: 2026-03-21 11:36';
      order.forEach(function(k){ var n=u[k]; if(n&&n!==first) n.textContent=''; });
      return null;
    }
    var f=(root.getAttribute('data-countdown-format')||'plain').toLowerCase();

    var inst={
      root:root,tgt:tgt,f:f,u:u,st:null,done:false,
      render:function(ms){
        var d=splitByUnits(ms,this.u);
        this.done=d.done;
        this.root.setAttribute('data-countdown-status', d.done?'finished':'active');
        if(this.u.years)   this.u.years.textContent   = lab('years',d.years,this.f);
        if(this.u.months)  this.u.months.textContent  = lab('months',d.months,this.f);
        if(this.u.weeks)   this.u.weeks.textContent   = lab('weeks',d.weeks,this.f);
        if(this.u.days)    this.u.days.textContent    = lab('days',d.days,this.f);
        if(this.u.hours)   this.u.hours.textContent   = lab('hours',d.hours,this.f);
        if(this.u.minutes) this.u.minutes.textContent = lab('minutes',d.minutes,this.f);
        if(this.u.seconds) this.u.seconds.textContent = lab('seconds',d.seconds,this.f);
      },
      tickMin:function(nowMs){
        if(this.done) return;
        this.render(this.tgt-nowMs);
        if(this.u.seconds && !this.done && !this.st) this.startSec();
        if(this.done) this.stopSec();
      },
      startSec:function(){
        var self=this;
        function t(){
          if(self.done) return self.stopSec();
          var ms=self.tgt-Date.now();
          if(ms<=0){ self.render(0); return self.stopSec(); }
          self.render(ms);
        }
        t(); self.st=setInterval(t,1000);
      },
      stopSec:function(){ if(this.st){ clearInterval(this.st); this.st=null; } }
    };
    root.__cd=inst;
    return inst;
  }

  function startMinTimer(){
    if(reg.timer) return;
    reg.timer=setInterval(function(){
      var now=Date.now();
      for(var i=0;i<reg.items.length;i++) reg.items[i].tickMin(now);
    },60000);
    var now=Date.now();
    for(var j=0;j<reg.items.length;j++) reg.items[j].tickMin(now);
  }

  document.querySelectorAll('[data-countdown-date]').forEach(function(root){
    var inst=make(root);
    if(inst) reg.items.push(inst);
  });
  if(reg.items.length) startMinTimer();
}

// Initialize Countdown
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
});