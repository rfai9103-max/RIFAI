const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,"0");
const hm=m=>{m=((Math.round(m)%1440)+1440)%1440;return pad(Math.floor(m/60))+":"+pad(m%60)};
const dh=m=>{m=Math.round(m);const h=Math.floor(m/60),r=m%60;return h?h+" jam"+(r?" "+r+" menit":""):r+" menit"};
const jam=x=>x.toFixed(1).replace(".",",")+" jam";
const num=id=>{const v=$(id).value;return v===""?NaN:Number(v)};

/* Kalkulator tidur */
function c1(){
  const w=$("wake").value;
  if(!w){$("e1").textContent="Isi jam bangun terlebih dahulu.";$("o1").textContent=$("o2").textContent="--:--";$("o3").textContent="";return}
  $("e1").textContent="";
  const [h,m]=w.split(":").map(Number),d=+$("dur").value*60,j=+$("wd").value,bed=h*60+m-d;
  $("o1").textContent=hm(bed);$("o2").textContent=hm(bed-j);
  const bh=((bed%1440)+1440)%1440;
  let n=d>=480?"Durasi "+dh(d)+" sesuai kebutuhan remaja (sekitar 8–10 jam). Bangun pagi akan terasa lebih segar.":"Durasi "+dh(d)+" masih di bawah kebutuhan ideal remaja. Usahakan 8 jam bila bisa.";
  if(bh<240)n+=" Jam tidurnya sangat larut. Coba majukan jam bangun atau geser jadwal pelan-pelan.";
  $("o3").textContent=n+" Taruh gawai "+j+" menit sebelum tidur dan pasang alarm.";
}
/* Simulator */
function c2(){
  const m=num("sm"),n=num("sn");$("smv").textContent=m+" menit";
  const bad=isNaN(n)||!Number.isInteger(n)||n<1||n>7;
  $("e2").textContent=bad?"Jumlah malam harus bilangan bulat 1 sampai 7.":"";
  if(bad){["s1","s2","s3","s4","s5"].forEach(i=>$(i).textContent="");$("gb").style.width="0";return}
  const w=m*n;
  $("s1").textContent=dh(m);$("s2").textContent=dh(w);$("s3").textContent=jam(w/60)+" / minggu";
  const r=w<120?"Rendah":w<420?"Sedang":"Tinggi";
  $("s4").innerHTML='<span class="badge '+r+'">'+r+'</span>';
  $("gb").style.width=Math.min(100,w/840*100)+"%";
  $("s5").textContent={Rendah:"Dampaknya masih kecil. Pertahankan, dan coba berhenti scroll 30 menit sebelum tidur.",Sedang:"Kantuk di jam pelajaran pertama mulai mungkin terjadi. Kurangi menit scrolling bertahap (10 menit tiap beberapa hari) dan aktifkan mode senyap.",Tinggi:"Risiko mengantuk dan sulit fokus di kelas pagi tinggi. Taruh HP jauh dari kasur, pakai alarm biasa, dan tetapkan jam taruh gawai tetap. Bila terus lelah, bicarakan dengan orang tua atau guru."}[r];
}
/* Anggaran screen time */
function c3(){
  const a=num("st"),b=num("se"),r=num("sr");let e="";
  if([a,b,r].some(isNaN)||a<0||b<0||r<0)e="Isi semua kolom dengan angka 0 atau lebih.";
  else if(a+b>24)e="Total jam layar tidak boleh lebih dari 24 jam per hari.";
  else if(r>b*60)e="Pengurangan tidak boleh melebihi layar hiburan ("+Math.round(b*60)+" menit).";
  $("e3").textContent=e;
  if(e){["b1","b2","b3","b4"].forEach(i=>$(i).textContent="");return}
  const t=(a+b)*60;
  $("b1").textContent=dh(t);$("b2").textContent=dh(t-r);$("b3").textContent=dh(r)+" per hari";
  $("b4").textContent=r>0?"Pakai sekitar "+dh(r/2)+" dari waktu luang itu untuk tidur lebih awal, sisanya untuk istirahat, hobi, atau bergerak. Seminggu terkumpul "+dh(r*7)+".":"Isi target pengurangan untuk melihat waktu luang tambahanmu.";
}
["wake","dur","wd"].forEach(i=>$(i).addEventListener("input",c1));
["sm","sn"].forEach(i=>$(i).addEventListener("input",c2));
["st","se","sr"].forEach(i=>$(i).addEventListener("input",c3));

/* Checklist */
const steps=["Aktifkan mode senyap / Do Not Disturb","Letakkan HP jauh dari kasur (isi daya di seberang ruangan)","Siapkan perlengkapan sekolah dan seragam esok hari","Matikan notifikasi aplikasi media sosial","Peregangan ringan selama 5 menit","Redupkan lampu dan minum air putih","Pasang alarm biasa di luar jangkauan tangan"];
const cl=$("cl");
steps.forEach(s=>{const l=document.createElement("label");l.className="chk";l.innerHTML='<input type="checkbox"><span></span>';l.querySelector("span").textContent=s;l.querySelector("input").addEventListener("change",pr);cl.appendChild(l)});
function pr(){
  const bs=cl.querySelectorAll("input");let n=0;
  bs.forEach(b=>{b.parentNode.classList.toggle("done",b.checked);if(b.checked)n++});
  const p=n/bs.length;
  $("rg").style.strokeDashoffset=326.7*(1-p);$("rt").textContent=Math.round(p*100)+"%";
  $("pt").textContent=n===bs.length?"Mantap! Semua langkah selesai. Selamat tidur 🌙":n+" dari "+bs.length+" langkah selesai.";
}
$("rs").onclick=()=>{cl.querySelectorAll("input").forEach(b=>b.checked=false);pr()};

/* Navigasi */
$("menu").onclick=()=>{const o=$("links").classList.toggle("open");$("menu").setAttribute("aria-expanded",o)};
const ls=[...document.querySelectorAll(".links a")];
ls.forEach(a=>a.addEventListener("click",()=>$("links").classList.remove("open")));
const secs=[...document.querySelectorAll("section[id]")];
addEventListener("scroll",()=>{let c=secs[0].id;secs.forEach(s=>{if(s.getBoundingClientRect().top<140)c=s.id});ls.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+c))},{passive:true});

/* Reveal saat scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

/* Efek miring kartu */
document.querySelectorAll(".tilt").forEach(c=>{
  c.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse")return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform="perspective(700px) rotateY("+x*8+"deg) rotateX("+-y*8+"deg)"});
  c.addEventListener("pointerleave",()=>c.style.transform="");
});

/* Langit bintang */
(function(){
  const cv=$("stars"),x=cv.getContext("2d");let W,H,S=[],sh=null;
  const init=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight;S=Array.from({length:Math.min(160,W*H/9000|0)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.2,p:Math.random()*6.3,s:Math.random()*.02+.005}))};
  const draw=()=>{x.clearRect(0,0,W,H);
    S.forEach(s=>{s.p+=s.s;x.globalAlpha=.35+.65*Math.abs(Math.sin(s.p));x.fillStyle="#fff";x.beginPath();x.arc(s.x,s.y,s.r,0,6.3);x.fill()});
    if(!sh&&Math.random()<.004)sh={x:Math.random()*W,y:Math.random()*H*.4,l:0};
    if(sh){x.globalAlpha=1-sh.l/60;x.strokeStyle="#fde68a";x.lineWidth=1.5;x.beginPath();x.moveTo(sh.x,sh.y);x.lineTo(sh.x-60,sh.y-30);x.stroke();sh.x+=9;sh.y+=4.5;if(++sh.l>60)sh=null}
    requestAnimationFrame(draw)};
  addEventListener("resize",init);init();
  if(!matchMedia("(prefers-reduced-motion:reduce)").matches)draw();else{S.forEach(s=>{x.globalAlpha=.6;x.fillStyle="#fff";x.fillRect(s.x,s.y,s.r,s.r)})}
})();
c1();c2();c3();pr();
