let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function goSlide(idx){
  slides.forEach(s=>s.classList.remove('active'));
  slides[idx].classList.add('active');
  currentSlide = idx;
}

function nextSlide(){ goSlide(Math.min(currentSlide+1, slides.length-1)); }
function prevSlide(){ goSlide(Math.max(currentSlide-1,0)); }

// Quiz 15 ข้อ พร้อมตัวเลือกกวนๆ
const quizData = [
  {q:'การเลือกพันธุ์พืชควรพิจารณาอะไร?', choices:['สีของผลไม้','ความสวยงามของใบ','สภาพอากาศและฤดูกาล','เพราะเพื่อนบอกว่าใช่'], a:2},
  {q:'พืชผักให้ประโยชน์หลักต่อร่างกายอย่างไร?', choices:['ให้พลังงานสูง','วิตามินและไฟเบอร์','เพิ่มความอ้วน','ทำให้ขำเวลาเห็น'], a:1},
  {q:'การรดน้ำมากเกินไปอาจเกิดผลเสียอะไร?', choices:['รากเน่า','ต้นไม้โตเร็ว','ผลผลิตเพิ่ม','ต้นไม้บ่นใส่คุณ'], a:0},
  {q:'เก็บเกี่ยวพืชเมื่อใด?', choices:['พืชสุกและพร้อมบริโภค','ทันทีที่ปลูก','ตอนหน้าหนาวเสมอ','รอให้ฝนตก'], a:0},
  {q:'ขั้นตอนใดสำคัญที่สุดก่อนปลูก?', choices:['รดน้ำทุกวัน','เก็บเกี่ยวทันที','เตรียมดินและใส่ปุ๋ย','ดูทีวีรอ'], a:2},
  {q:'ทำไมควรสังเกตพืชทุกวัน?', choices:['ตรวจสอบโรคและศัตรูพืช','ให้สีใบสวย','เพื่อลดค่าใช้จ่าย','เพราะสนุก'], a:0},
  {q:'วิธีใดช่วยป้องกันศัตรูพืชได้ดีที่สุด?', choices:['รดน้ำอย่างเดียว','ใส่ปุ๋ยและดูแลความสะอาด','เก็บเกี่ยวเร็ว','ตะโกนไล่แมลง'], a:1},
  {q:'การปลูกชิดกันเกินไปทำให้เกิดอะไร?', choices:['ผลผลิตมากขึ้น','ต้นเติบโตไม่เต็มที่','รดน้ำง่ายขึ้น','ต้นไม้ทะเลาะกัน'], a:1},
  {q:'การปลูกพืชช่วยสิ่งแวดล้อมอย่างไร?', choices:['ลดขยะบรรจุภัณฑ์','เพิ่มความร้อน','สร้างมลพิษ','ให้แมลงมาบ่น'], a:0},
  {q:'การใส่ปุ๋ยช่วยอะไร?', choices:['เปลี่ยนสีใบ','ลดน้ำหนักต้นไม้','เพิ่มสารอาหารให้ดิน','ทำให้พูดได้'], a:2},
  {q:'การเก็บผลไม้ตอนเช้าดีอย่างไร?', choices:['สดที่สุด','ไม่สดเลย','ทำให้ผักร้องเพลง','ช่วยให้ต้นไม้เลิกงอน'], a:0},
  {q:'ทำไมควรปลูกผักผลไม้ที่บ้าน?', choices:['เพราะสนุก','เพื่อสุขภาพ','ลดค่าใช้จ่าย','ทุกข้อถูกหมด'], a:3},
  {q:'การเลือกที่ดินควรสังเกตอะไร?', choices:['แดด','น้ำ','ดิน','สิ่งของรอบๆ'], a:2},
  {q:'การใส่ปุ๋ยเคมีมากเกินไปทำให้?', choices:['ต้นไม้พูดได้','รากเน่า','ผลผลิตเพิ่ม','ดินสวย'], a:1},
  {q:'ระยะห่างระหว่างต้นควรเป็นเท่าไร?', choices:['ชิดกัน','ปล่อยให้ห่างพอเหมาะ','ไม่ต้องสนใจ','ขึ้นอยู่กับอารมณ์'], a:1},
];

let userAnswers = Array(quizData.length).fill(null);
const quizContainer = document.getElementById('quiz');

// ฟังก์ชันสุ่มตัวเลือก
function shuffleChoices(arr){
  return arr.map(a => [Math.random(), a]).sort((a,b)=>a[0]-b[0]).map(a=>a[1]);
}

function renderQuiz(){
  quizContainer.innerHTML = '';
  quizData.forEach((item,i)=>{
    const qDiv = document.createElement('div');
    qDiv.classList.add('quiz-question');
    qDiv.dataset.locked = "false";
    qDiv.innerHTML = `<strong>${i+1}. ${item.q}</strong>`;

    const choicesContainer = document.createElement('div'); // สร้าง container ครอบ
    choicesContainer.classList.add('choices-container');

    let choices = shuffleChoices(item.choices.map((c,j)=>({text:c, index:j})));
    choices.forEach(ch=>{
      const chDiv = document.createElement('div');
      chDiv.classList.add('choice');
      chDiv.textContent = ch.text;
      chDiv.addEventListener('click', ()=>{
        if (qDiv.dataset.locked === "true") return; 
        userAnswers[i] = ch.index;
        choicesContainer.querySelectorAll('.choice').forEach(s=>s.classList.remove('selected'));
        chDiv.classList.add('selected');
      });
      choicesContainer.appendChild(chDiv); // append เข้า container
    });

    qDiv.appendChild(choicesContainer); // append container เข้า qDiv
    quizContainer.appendChild(qDiv);
  });
}

renderQuiz();

function checkQuiz(){
  let score = 0;

  quizData.forEach((item,i)=>{
    const choices = quizContainer.children[i].querySelectorAll('.choice');

    // lock คำถาม
    quizContainer.children[i].dataset.locked = "true";

    choices.forEach(ch=>{
      ch.classList.remove('correct','wrong');
    });

    choices.forEach(ch=>{
      const choiceText = ch.textContent;
      const correctText = item.choices[item.a];
      if(choiceText === correctText) ch.classList.add('correct');
      if(userAnswers[i] !== null && choiceText === choices[userAnswers[i]].text && choiceText !== correctText) ch.classList.add('wrong');
    });

    if(userAnswers[i] === item.a) score++;
  });

  document.getElementById('score').textContent = `คะแนน: ${score} / ${quizData.length}`;
  document.getElementById('celebrateBtn').style.display = 'inline-block';
  
  // ปิดปุ่มตรวจสอบ ไม่ให้กดซ้ำ
  document.querySelector('.btn-next[onclick="checkQuiz()"]').disabled = true;
}

function celebrate(){
  for(let i=0;i<80;i++){
    const conf = document.createElement('div');
    conf.className='confetti';
    conf.textContent='🍌';
    conf.style.left=Math.random()*window.innerWidth+'px';
    conf.style.top=window.innerHeight+'px';
    conf.style.fontSize=(12+Math.random()*30)+'px';
    conf.style.animationDuration=(1+Math.random()*2)+'s';
    document.body.appendChild(conf);
    setTimeout(()=> conf.remove(),3000);
  }
  goSlide(4);
}

function resetQuiz(){
  userAnswers.fill(null);
  renderQuiz();
  document.getElementById('score').textContent='';
  document.getElementById('celebrateBtn').style.display='none';
  goSlide(0);
}

// Accordion toggle — เปิดทีละข้อ
document.querySelectorAll('.accordion-header').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const content = btn.nextElementSibling;
    const open = content.classList.contains('open');

    // ปิดทั้งหมดก่อน
    document.querySelectorAll('.accordion-content').forEach(c=>c.classList.remove('open'));
    document.querySelectorAll('.accordion-header').forEach(h=>h.classList.remove('active'));

    // ถ้าอันนี้ยังไม่เปิด ให้เปิด
    if(!open){
      content.classList.add('open');
      btn.classList.add('active');
    }
  });
});