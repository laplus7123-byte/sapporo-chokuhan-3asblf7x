(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro=document.querySelector('.opening');
if(intro&&!reduced){try{if(!sessionStorage.getItem('sc-opening')){intro.classList.add('is-active');sessionStorage.setItem('sc-opening','1');}}catch{}setTimeout(()=>intro.remove(),2000);}
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-nav');
const closeMenu=()=>{toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('is-open');};
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
const hero=document.querySelector('[data-hero-slides]');
if(hero){
 const slides=[...hero.querySelectorAll('.hero-main-photo')],motion=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,timer=0;
 const show=index=>{current=index;slides.forEach((slide,i)=>{slide.classList.toggle('is-current',i===index);slide.setAttribute('aria-hidden',String(i!==index));});};
 const schedule=()=>{clearInterval(timer);if(slides.length>1&&!motion.matches&&!document.hidden)timer=setInterval(()=>show((current+1)%slides.length),6500);};
 document.addEventListener('visibilitychange',schedule);
 motion.addEventListener('change',schedule);
 schedule();
}
const business=document.querySelector('.business-scroll');
if(business){
 const stage=business.querySelector('.business-stage'),windowEl=business.querySelector('.business-window'),track=business.querySelector('.business-track'),panels=[...business.querySelectorAll('.business-panel')],buttons=[...business.querySelectorAll('[data-business]')];
 const eligible=matchMedia('(max-width: 760px), (min-height: 650px)'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let pinned=false,distance=0,offset=0,pinTop=0,frame=0;
 const active=(x)=>{let nearest=0,best=Infinity;panels.forEach((panel,i)=>{const d=Math.abs(Math.min(panel.offsetLeft-panels[0].offsetLeft,distance)-x);if(d<best){best=d;nearest=i;}});buttons.forEach((b,i)=>{if(i===nearest)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});};
 const update=()=>{frame=0;if(!pinned)return;offset=Math.max(0,Math.min(distance,-business.getBoundingClientRect().top+pinTop));track.style.transform=`translate3d(${-offset}px,0,0)`;active(offset);};
 const request=()=>{if(!frame)frame=requestAnimationFrame(update);};
 const measure=()=>{
  pinned=eligible.matches&&!motion.matches;
  business.classList.toggle('is-pinned',pinned);
  track.style.transform='';windowEl.scrollLeft=0;
  distance=Math.max(0,track.scrollWidth+parseFloat(getComputedStyle(windowEl).paddingLeft)*2-windowEl.clientWidth);
  // A short screen may first scroll the tall panel upward, then traverse horizontally.
  const viewport=parseFloat(getComputedStyle(stage).minHeight)||stage.offsetHeight;
  pinTop=pinned?Math.min(0,viewport-stage.offsetHeight):0;
  stage.style.setProperty('--business-pin-top',`${pinTop}px`);
  business.style.height=pinned?`${stage.offsetHeight+distance}px`:'';
  windowEl.setAttribute('aria-label',pinned?'札幌直販の5つの事業。縦スクロールで横に切り替わります':'札幌直販の5つの事業。左右にスクロールしてご覧ください');
  if(pinned)update();else active(windowEl.scrollLeft);
 };
 const go=(index)=>{const x=Math.min(panels[index].offsetLeft-panels[0].offsetLeft,distance);if(pinned){window.scrollTo({top:window.scrollY+business.getBoundingClientRect().top+x-pinTop,behavior:motion.matches?'instant':'smooth'});}else windowEl.scrollTo({left:x,behavior:motion.matches?'instant':'smooth'});};
 buttons.forEach((button,i)=>button.addEventListener('click',()=>go(i)));
 windowEl.addEventListener('keydown',e=>{if(e.target!==windowEl||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const current=Math.max(0,buttons.findIndex(b=>b.getAttribute('aria-current')==='true'));go(e.key==='Home'?0:e.key==='End'?4:Math.max(0,Math.min(4,current+(e.key==='ArrowRight'?1:-1))));});
 windowEl.addEventListener('focusin',e=>{if(!pinned)return;const panel=e.target.closest('.business-panel');if(panel)go(panels.indexOf(panel));});
 windowEl.addEventListener('scroll',()=>{if(!pinned)active(windowEl.scrollLeft);},{passive:true});
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',measure);eligible.addEventListener('change',measure);motion.addEventListener('change',measure);measure();document.fonts?.ready.then(measure);
}
// Play the delivery introduction only on its first appearance.
const deliveryMap=document.querySelector('.delivery-map');
if(deliveryMap&&!reduced){
 const playMap=()=>{
  if(deliveryMap.dataset.played)return;
  deliveryMap.dataset.played='true';deliveryMap.classList.add('is-active');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  deliveryMap.querySelectorAll('.traveler').forEach((dot,i)=>dot.querySelectorAll('animateMotion,animate').forEach(animation=>animation.beginElementAt?.(i*.15)));
 };
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){playMap();observer.disconnect();}},{threshold:.3});observer.observe(deliveryMap);}else playMap();
}
const voice=document.querySelector('[data-voice-marquee]');
if(voice&&!reduced){
 const track=voice.querySelector('.voice-track'),toggle=document.querySelector('.voice-toggle');
 [...track.children].forEach(card=>{const copy=card.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.inert=true;track.append(copy);});
 voice.classList.add('is-auto');
 if(toggle){toggle.hidden=false;toggle.addEventListener('click',()=>{const paused=voice.classList.toggle('is-paused');toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'再生':'一時停止';});}
}
const service=document.querySelector('.bz-service');
if(service&&'IntersectionObserver' in window){
 const photos=[...service.querySelectorAll('.bz-service-sticky img')],count=service.querySelector('.bz-service-count b');
 const show=step=>{photos.forEach(img=>img.classList.toggle('is-current',img.dataset.step===step));if(count)count.textContent=step;};
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)show(e.target.dataset.step);}),{rootMargin:'-45% 0px -45% 0px'});
 service.querySelectorAll('.bz-service-item').forEach(item=>io.observe(item));
}
const form=document.querySelector('#contact-form');if(!form)return;
const params=new URLSearchParams(location.search),type=form.elements.inquiry_type,item=params.get('item');if([...type.options].some(o=>o.value===params.get('type')))type.value=params.get('type');
if(item==='seafood')form.elements.message.value='海産物について相談したいです。\nご希望の商品：\n数量：\nお届け先の都道府県：\n希望時期：';if(item==='produce')form.elements.message.value='青果について相談したいです。\nご希望の商品：\n数量：\nお届け先の都道府県：\n希望時期：';
const dialog=document.querySelector('.confirm-dialog'),error=form.querySelector('.form-error'),send=dialog.querySelector('.confirm-send');
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;if(!form.elements.customer_name.value.trim()||!form.elements.message.value.trim()){error.textContent='お名前とお問い合わせ詳細を入力してください。';error.hidden=false;return;}error.hidden=true;const target=dialog.querySelector('.confirm-details');target.replaceChildren();const fields=[['お問い合わせ内容',type.selectedOptions[0].textContent],['お名前',form.elements.customer_name.value],['会社名・店舗名',form.elements.company_name.value||'—'],['メールアドレス',form.elements.email.value],['電話番号',form.elements.phone.value||'—'],['お問い合わせ詳細',form.elements.message.value]];fields.forEach(([label,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);target.append(row);});send.disabled=false;send.textContent=form.dataset.preview==='true'?'確認を完了する（送信なし） →':'この内容で送信する →';dialog.showModal();});
dialog.querySelector('.confirm-back').addEventListener('click',()=>dialog.close());
send.addEventListener('click',()=>{if(form.dataset.preview==='true'){dialog.close();form.hidden=true;const result=document.querySelector('#preview-result');result.hidden=false;result.focus();result.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});return;}send.disabled=true;send.textContent='送信しています…';HTMLFormElement.prototype.submit.call(form);});
document.querySelector('.preview-reset')?.addEventListener('click',()=>{document.querySelector('#preview-result').hidden=true;form.hidden=false;type.focus();});
})();
