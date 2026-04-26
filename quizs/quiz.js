// ============================================================
//  quiz.js  —  문제 데이터 + 타입 핸들러 레지스트리
//  이 파일만 교체하면 새 퀴즈 세트로 전환 가능
//  app.js 는 이 파일의 구조만 읽어서 동작함
// ============================================================

const QUIZ_CONFIG = {
  title: "Big Data / Distributed Systems",
  subtitle: "빅데이터 & 분산 시스템 전공 퀴즈",
  courseLevel: "대학교 4학년 전공",
  totalQuestions: 40,
  passingScore: 70,
  showExplanationImmediately: true,
};

// ──────────────────────────────────────────────
//  타입 핸들러 레지스트리
//  새 문제 유형 추가 시 여기에만 추가하면 됨
// ──────────────────────────────────────────────
const TYPE_HANDLERS = {
  // 객관식 (단일 선택)
  multiple: {
    render(q, container, onAnswer) {
      const list = document.createElement("ul");
      list.className = "options-list";
      q.options.forEach((opt, idx) => {
        const li = document.createElement("li");
        li.className = "option-item";
        li.dataset.idx = idx;
        li.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
        li.addEventListener("click", () => {
          if (container.dataset.answered) return;
          container.dataset.answered = "1";
          const correct = idx === q.answer;
          li.classList.add(correct ? "correct" : "wrong");
          if (!correct) {
            list.children[q.answer].classList.add("correct");
          }
          list.querySelectorAll(".option-item").forEach(el => el.classList.add("disabled"));
          onAnswer(correct, idx);
        });
        list.appendChild(li);
      });
      container.appendChild(list);
    },
    grade(q, userAnswer) {
      return userAnswer === q.answer;
    },
  },

  // 단답형 (텍스트 입력)
  short: {
    render(q, container, onAnswer) {
      const wrapper = document.createElement("div");
      wrapper.className = "short-answer-wrapper";
      const input = document.createElement("input");
      input.type = "text";
      input.className = "short-input";
      input.placeholder = "답을 입력하세요 / Enter your answer";
      const btn = document.createElement("button");
      btn.className = "submit-btn";
      btn.textContent = "제출";
      btn.addEventListener("click", () => {
        if (container.dataset.answered) return;
        const val = input.value.trim();
        if (!val) return;
        container.dataset.answered = "1";
        input.disabled = true;
        btn.disabled = true;
        const correct = TYPE_HANDLERS.short.grade(q, val);
        input.classList.add(correct ? "correct" : "wrong");
        onAnswer(correct, val);
      });
      input.addEventListener("keydown", e => { if (e.key === "Enter") btn.click(); });
      wrapper.appendChild(input);
      wrapper.appendChild(btn);
      container.appendChild(wrapper);
    },
    grade(q, userAnswer) {
      const normalize = s => s.toLowerCase().replace(/[\s\-_]/g, "");
      const accepted = Array.isArray(q.answer) ? q.answer : [q.answer];
      return accepted.some(a => normalize(userAnswer) === normalize(a));
    },
  },
};

// ──────────────────────────────────────────────
//  문제 목록 이 부분만 복사해서 클로드한테 주면 됨
// ──────────────────────────────────────────────
const questions = [
  // ── 기초 ──────────────────────────────────────────────
  {
    id: 1,
    type: "multiple",
    topic: "Big Data 정의",
    text: "Which of the following BEST defines when data qualifies as 'Big Data'? (다음 중 빅데이터를 가장 잘 정의한 것은?)",
    options: [
      "Data larger than 1 TB stored on a single server",
      "Data that exceeds RAM, storage, or single-core processing capacity per unit time",
      "Data that has more than 3 attributes (Volume, Variety, Velocity)",
      "Any dataset processed using a distributed framework like Hadoop",
    ],
    answer: 1,
    explanation: "빅데이터의 실질적 정의는 RAM을 초과하거나, 단일 스토리지를 초과하거나, 단일 코어의 단위시간 처리 능력을 초과하는 데이터입니다. 단순 크기(1TB)나 프레임워크 사용 여부가 기준이 아닙니다.",
  },
  {
    id: 2,
    type: "multiple",
    topic: "3V / Big Data 특성",
    text: "The original 3V model of Big Data consists of: (빅데이터 3V 모델을 구성하는 요소는?)",
    options: [
      "Volume, Velocity, Veracity",
      "Volume, Variety, Velocity",
      "Value, Variety, Velocity",
      "Volume, Validity, Velocity",
    ],
    answer: 1,
    explanation: "최초 3V는 Volume(양), Variety(다양성), Velocity(속도)입니다. Veracity는 4V, Value는 5V에서 추가됩니다.",
  },
  {
    id: 3,
    type: "short",
    topic: "Big Data 주요 해결책",
    text: "Name ONE of the four main solution categories for Big Data Systems discussed in the lecture. (강의에서 언급된 빅데이터 시스템의 4가지 주요 해결책 카테고리 중 하나를 쓰시오.)",
    answer: ["Distribution", "Scaling Up", "Optimization", "Cloud", "분산", "스케일 업", "최적화", "클라우드"],
    explanation: "강의에서 언급된 주요 해결책 4가지는 Distribution(분산), Scaling Up(스케일 업), Optimization(최적화), Cloud(클라우드)입니다.",
  },
  {
    id: 4,
    type: "multiple",
    topic: "HPC",
    text: "Why did the US Air Force use a PlayStation 3 cluster instead of a supercomputer? (미 공군이 슈퍼컴퓨터 대신 PS3 클러스터를 사용한 이유로 가장 적절한 것은?)",
    options: [
      "PlayStation 3 has faster single-core performance",
      "A cluster of low-capacity CPUs can handle big data more efficiently than a supercomputer",
      "Supercomputers cannot run parallel tasks",
      "PlayStation 3 supports GPU shader language natively",
    ],
    answer: 1,
    explanation: "강의 핵심: 저사양 CPU 다수가 병렬로 처리하면 슈퍼컴퓨터보다 효율적일 수 있습니다. 이것이 HPC의 핵심 아이디어입니다.",
  },
  {
    id: 5,
    type: "short",
    topic: "HPC / 병렬처리",
    text: "What term describes processing a collection of data gathered over time, all at once (as opposed to real-time)? (실시간이 아닌, 일정 기간 동안 모인 데이터를 한꺼번에 처리하는 방식을 무엇이라 하는가?)",
    answer: ["Batch", "배치", "batch processing", "배치 처리"],
    explanation: "Batch는 일정 기간 수집한 데이터를 묶어서 처리하는 방식, Streaming은 도착 즉시 실시간 처리하는 방식입니다.",
  },
];
