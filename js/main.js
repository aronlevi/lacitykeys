
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
function toggleMenu(btn){const nav=document.getElementById('navlinks');const open=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(open))}
document.querySelectorAll('#navlinks a').forEach(a=>a.addEventListener('click',()=>{document.getElementById('navlinks').classList.remove('open');document.querySelector('.menu').setAttribute('aria-expanded','false')}));
function submitInquiry(e){e.preventDefault();const val=id=>document.getElementById(id).value.trim();const subject='LA City Keys — Property inquiry: '+val('address');const body=['Name: '+val('name'),'Contact: '+val('contact'),'Property: '+val('address'),'Vacant units: '+val('units'),'Approx. rent: '+val('rent'),'Details: '+val('details')].join('\n');navigator.clipboard?.writeText(subject+'\n\n'+body).then(()=>alert('Inquiry copied. Please send it to LA City Keys via Instagram until direct email is connected.')).catch(()=>alert('Please contact @lacitykeys on Instagram to submit your inquiry.'));return false}

async function loadProperties(){
 const el=document.getElementById('property-grid');if(!el)return;
 try{
  const r=await fetch('data/properties.json',{cache:'no-store'});if(!r.ok)throw new Error('Unable to load properties');
  const items=await r.json();el.textContent='';
  const node=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
  for(const p of items){
   const card=node('article','rental-card');
   if(p.images&&p.images.length){
    const gallery=node('div','property-gallery');const main=node('img','property-main-photo');main.src=p.images[0];main.alt=p.name+' property photo';main.loading='lazy';gallery.appendChild(main);
    const controls=node('div','gallery-controls');const prev=node('button','gallery-arrow','‹');const next=node('button','gallery-arrow','›');prev.type=next.type='button';prev.setAttribute('aria-label','Previous property photo');next.setAttribute('aria-label','Next property photo');const count=node('span','gallery-count');controls.append(prev,count,next);gallery.appendChild(controls);
    let idx=0;function show(i){idx=(i+p.images.length)%p.images.length;main.src=p.images[idx];main.alt=p.name+' photo '+(idx+1)+' of '+p.images.length;count.textContent=(idx+1)+' / '+p.images.length}prev.addEventListener('click',()=>show(idx-1));next.addEventListener('click',()=>show(idx+1));show(0);
    const thumbs=node('div','gallery-thumbs');p.images.forEach((src,i)=>{const b=node('button','gallery-thumb');b.type='button';b.setAttribute('aria-label','View photo '+(i+1));const img=node('img');img.src=src;img.alt='';img.loading='lazy';b.appendChild(img);b.addEventListener('click',()=>show(i));thumbs.appendChild(b)});gallery.appendChild(thumbs);card.appendChild(gallery);
   }else{const visual=node('div','listing-placeholder');const logo=node('img');logo.src='images/city-keys-logo.png';logo.alt='';visual.append(logo,node('span','', 'Photos coming soon'));card.appendChild(visual)}
   const content=node('div','listing-content');content.appendChild(node('span','tag',p.status||'Details pending'));content.appendChild(node('h3','',p.name));content.appendChild(node('p','address',p.address||'Address to be confirmed'));
   if(p.bedrooms&&p.bathrooms)content.appendChild(node('p','property-facts',p.bedrooms+' Bedrooms  ·  '+p.bathrooms+' Bathrooms'+(p.parking?'  ·  '+p.parking:'')));
   content.appendChild(node('p','price-note',p.price||'Contact for current rental pricing'));content.appendChild(node('p','',p.description||'Property details and availability are being confirmed.'));
   if(p.highlights){content.appendChild(node('h4','property-subheading','Property Highlights'));const ul=node('ul','property-highlights');p.highlights.forEach(h=>ul.appendChild(node('li','',h)));content.appendChild(ul)}
   if(p.yardNote){content.appendChild(node('h4','property-subheading','Important Property Information'));content.appendChild(node('p','',p.yardNote))}
   if(p.disclaimer)content.appendChild(node('p','property-disclaimer',p.disclaimer));
   const a=node('a','btn btn-dark',p.zillowUrl?'View on Zillow ↗':'Ask About This Property ↗');a.href=p.zillowUrl||'contact.html';if(p.zillowUrl){a.target='_blank';a.rel='noopener noreferrer'}content.appendChild(a);
   card.appendChild(content);el.appendChild(card);
  }
 }catch(e){el.textContent='Listings could not be loaded. Please check back soon.'}
}
loadProperties();
