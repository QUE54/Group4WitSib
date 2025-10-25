let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function goSlide(idx){
  slides.forEach(s=>s.classList.remove('active'));
  slides[idx].classList.add('active');
  currentSlide = idx;
}

function nextSlide(){ goSlide(Math.min(currentSlide+1, slides.length-1)); }
function prevSlide(){ goSlide(Math.max(currentSlide-1,0)); }

/* Quiz */
const quizData = [
  {q:'การเลือกพันธุ์พืชควรพิจารณาอะไร?', choices:['สีของผลไม้','ความสวยงามของใบ','สภาพอากาศและฤดูกาล'], a:2},
  {q:'พืชผักให้ประโยชน์หลักต่อร่างกายอย่างไร?', choices:['ให้พลังงานสูง','วิตามินและไฟเบอร์','เพิ่มความอ้วน'], a:1},
  {q:'การรดน้ำมากเกินไปอาจเกิดผลเสียอะไร?', choices:['รากเน่า','ต้นไม้โตเร็ว','ผลผลิตเพิ่ม'], a:0},
  {q:'เก็บเกี่ยวพืชเมื่อใด?', choices:['พืชสุกและพร้อมบริโภค','ทันทีที่ปลูก','ตอนหน้าหนาวเสมอ'], a:0},
  {q:'ขั้นตอนใดสำคัญที่สุดก่อนปลูก?', choices:['รดน้ำทุกวัน','เก็บเกี่ยวทันที','เตรียมดินและใส่ปุ๋ย'], a:2},
  {q:'ทำไมควรสังเกตพืชทุกวัน?', choices:['ตรวจสอบโรคและศัตรูพืช','ให้สีใบสวย','เพื่อลดค่าใช้จ่าย'], a:0},
  {q:'วิธีใดช่วยป้องกันศัตรูพืชได้ดีที่สุด?', choices:['รดน้ำอย่างเดียว','ใส่ปุ๋ยและดูแลความสะอาด','เก็บเกี่ยวเร็ว'], a:1},
  {q:'การปลูกชิดกันเกินไปทำให้เกิดอะไร?', choices:['ผลผลิตมากขึ้น','ต้นเติบโตไม่เต็มที่','รดน้ำง่ายขึ้น'], a:1},
  {q:'การปลูกพืชช่วยสิ่งแวดล้อมอย่างไร?', choices:['ลดขยะบรรจุภัณฑ์','เพิ่มความร้อน','สร้างมลพิษ'], a:0},
  {q:'การใส่ปุ๋ยช่วยอะไร?', choices:['เปลี่ยนสีใบ','ลดน้ำหนักต้นไม้','เพิ่มสารอาหารให้ดิน'], a:2}
];

let userAnswers = Array(quizData.length).fill(null);
const quizContainer = document.getElementById('quiz');

function renderQuiz(){
  quizContainer.innerHTML = '';
  quizData.forEach((item,i)=>{
    const qDiv = document.createElement('div');
    qDiv.classList.add('quiz-question');
    qDiv.innerHTML = `<strong>${i+1}. ${item.q}</strong>`;
    item.choices.forEach((ch,j)=>{
      const chDiv = document.createElement('div');
      chDiv.classList.add('choice');
      chDiv.textContent = ch;
      chDiv.addEventListener('click', ()=>{
        userAnswers[i] = j;
        const siblings = chDiv.parentElement.querySelectorAll('.choice');
        siblings.forEach(s=>s.classList.remove('selected'));
        chDiv.classList.add('selected');
      });
      qDiv.appendChild(chDiv);
    });
    quizContainer.appendChild(qDiv);
  });
}

renderQuiz();

function checkQuiz(){
  let score=0;
  quizData.forEach((item,i)=>{
    const choices = quizContainer.children[i].querySelectorAll('.choice');
    choices.forEach((ch,j)=>{
      ch.classList.remove('correct','wrong');
      if(j===item.a) ch.classList.add('correct');
      if(userAnswers[i]===j && j!==item.a) ch.classList.add('wrong');
    });
    if(userAnswers[i]===item.a) score++;
  });
  document.getElementById('score').textContent=`คะแนน: ${score} / ${quizData.length}`;
  document.getElementById('celebrateBtn').style.display='inline-block';
}

function celebrate(){
  for(let i=0;i<80;i++){
    const conf = document.createElement('div');
    conf.className='confetti';
    conf.textContent='🎉';
    conf.style.left=Math.random()*window.innerWidth+'px';
    conf.style.top=window.innerHeight+'px';
    conf.style.fontSize=(12+Math.random()*20)+'px';
    conf.style.animationDuration=(1+Math.random()*2)+'s';
    document.body.appendChild(conf);
    setTimeout(()=> conf.remove(),3000);
  }
  goSlide(4);
}

// ฟังก์ชันเริ่มใหม่
function resetQuiz(){
  userAnswers.fill(null);
  renderQuiz();
  document.getElementById('score').textContent='';
  document.getElementById('celebrateBtn').style.display='none';
  goSlide(0);
}