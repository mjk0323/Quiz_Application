// ============================================================
//  app.js  —  순수 퀴즈 엔진
//  quiz.js의 QUIZ_CONFIG, TYPE_HANDLERS, questions만 읽음
//  문제 타입이 추가돼도 이 파일은 수정 불필요
// ============================================================

(function () {
  "use strict";

  // ── 상태 ──────────────────────────────────────────────
  const state = {
    current: 0,
    answers: [], // { questionId, correct, userAnswer }
    startTime: null,
    endTime: null,
    timerInterval: null,
  };

  // ── DOM 참조 ──────────────────────────────────────────
  const dom = {
    get screen()      { return document.getElementById("screen"); },
    get quizMeta()    { return document.getElementById("quiz-meta"); },
  };

  // ── 유틸 ──────────────────────────────────────────────
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function getHandler(type) {
    const h = TYPE_HANDLERS[type];
    if (!h) throw new Error(`Unknown question type: "${type}". Register it in quiz.js TYPE_HANDLERS.`);
    return h;
  }

  // ── 화면 전환 ──────────────────────────────────────────
  function clearScreen() {
    dom.screen.innerHTML = "";
  }

  // ── 인트로 화면 ───────────────────────────────────────
  function showIntro() {
    clearScreen();
    const wrap = el("div", "intro-wrap");

    const badge = el("div", "intro-badge", "전공 퀴즈");
    const title = el("h1", "intro-title", QUIZ_CONFIG.title);
    const sub   = el("p",  "intro-sub",   QUIZ_CONFIG.subtitle);

    const stats = el("div", "intro-stats");
    const s1 = el("div", "stat-card");
    s1.innerHTML = `<span class="stat-num">${QUIZ_CONFIG.totalQuestions}</span><span class="stat-label">문제</span>`;
    const s2 = el("div", "stat-card");
    s2.innerHTML = `<span class="stat-num">${QUIZ_CONFIG.passingScore}%</span><span class="stat-label">합격선</span>`;
    const s3 = el("div", "stat-card");
    s3.innerHTML = `<span class="stat-num">2</span><span class="stat-label">유형</span>`;
    stats.append(s1, s2, s3);

    const info = el("p", "intro-info",
      "객관식: 선택지 클릭 즉시 채점  |  단답형: 입력 후 제출\n정답·해설이 즉시 표시됩니다.");

    const btn = el("button", "btn-primary", "퀴즈 시작");
    btn.addEventListener("click", startQuiz);

    wrap.append(badge, title, sub, stats, info, btn);
    dom.screen.appendChild(wrap);
  }

  // ── 퀴즈 시작 ─────────────────────────────────────────
  function startQuiz() {
    state.current = 0;
    state.answers = [];
    state.startTime = Date.now();
    showQuestion();
  }

  // ── 문제 렌더 ─────────────────────────────────────────
  function showQuestion() {
    clearScreen();
    const q = questions[state.current];
    const total = questions.length;

    // 진행 바
    const progressWrap = el("div", "progress-wrap");
    const progressBar  = el("div", "progress-bar");
    const progressFill = el("div", "progress-fill");
    progressFill.style.width = `${((state.current) / total) * 100}%`;
    progressBar.appendChild(progressFill);
    const progressText = el("div", "progress-text",
      `${state.current + 1} / ${total}`);
    progressWrap.append(progressBar, progressText);

    // 상단 메타
    const meta = el("div", "q-meta");
    const topicTag = el("span", "topic-tag", q.topic);
    const typeTag  = el("span", `type-tag type-${q.type}`,
      q.type === "multiple" ? "객관식" : "단답형");
    meta.append(topicTag, typeTag);

    // 문제 번호 + 텍스트
    const qNum  = el("div", "q-number", `Q${q.id}`);
    const qText = el("div", "q-text", q.text);

    // 답변 영역
    const answerArea = el("div", "answer-area");
    answerArea.dataset.answered = "";

    // 해설 영역 (초기 숨김)
    const explanationArea = el("div", "explanation-area hidden");

    // 타입 핸들러에 렌더링 위임
    const handler = getHandler(q.type);
    handler.render(q, answerArea, (correct, userAnswer) => {
      recordAnswer(q, correct, userAnswer);
      showExplanation(q, correct, explanationArea);
    });

    // 다음 버튼 (해설 후 나타남)
    const nextBtn = el("button", "btn-next hidden",
      state.current < total - 1 ? "다음 문제 →" : "결과 보기");
    nextBtn.addEventListener("click", () => {
      state.current++;
      if (state.current < total) {
        showQuestion();
      } else {
        showResult();
      }
    });

    // 해설 표시 시 다음 버튼 노출
    const origShow = showExplanation;
    answerArea.addEventListener("answered", () => {
      nextBtn.classList.remove("hidden");
    });

    const card = el("div", "q-card");
    card.append(meta, qNum, qText, answerArea, explanationArea, nextBtn);

    const wrap = el("div", "question-wrap");
    wrap.append(progressWrap, card);
    dom.screen.appendChild(wrap);
  }

  // ── 해설 표시 ─────────────────────────────────────────
  function showExplanation(q, correct, area) {
    const icon = correct ? "✓" : "✗";
    const cls  = correct ? "result-correct" : "result-wrong";
    const label = correct ? "정답!" : "오답";

    area.innerHTML = "";
    area.classList.remove("hidden");

    const header = el("div", `explanation-header ${cls}`);
    header.innerHTML = `<span class="result-icon">${icon}</span><span>${label}</span>`;

    // 정답 표시 (단답형만 — 객관식은 선택지에서 표시됨)
    let answerLine = null;
    if (q.type === "short") {
      answerLine = el("div", "answer-line");
      const accepted = Array.isArray(q.answer) ? q.answer[0] : q.answer;
      answerLine.innerHTML = `<strong>정답:</strong> ${accepted}`;
    }

    const expText = el("div", "explanation-text", q.explanation);

    area.append(header);
    if (answerLine) area.append(answerLine);
    area.append(expText);

    // 다음 버튼 노출 트리거
    area.parentElement.querySelector(".btn-next")?.classList.remove("hidden");
  }

  // ── 답변 기록 ─────────────────────────────────────────
  function recordAnswer(q, correct, userAnswer) {
    state.answers.push({ questionId: q.id, correct, userAnswer, topic: q.topic });
  }

  // ── 결과 화면 ─────────────────────────────────────────
  function showResult() {
    clearScreen();
    state.endTime = Date.now();
    const total   = questions.length;
    const correct = state.answers.filter(a => a.correct).length;
    const wrong   = total - correct;
    const score   = Math.round((correct / total) * 100);
    const passed  = score >= QUIZ_CONFIG.passingScore;
    const elapsed = Math.round((state.endTime - state.startTime) / 1000);
    const mins    = Math.floor(elapsed / 60);
    const secs    = elapsed % 60;

    const wrap = el("div", "result-wrap");

    // 헤더
    const resultHeader = el("div", `result-header ${passed ? "passed" : "failed"}`);
    resultHeader.innerHTML = `
      <div class="result-icon-big">${passed ? "🎉" : "📚"}</div>
      <div class="result-label">${passed ? "합격" : "불합격"}</div>
      <div class="score-display">${score}<span class="score-unit">점</span></div>
      <div class="score-sub">${correct}/${total} 정답 · ${mins}분 ${secs}초</div>
    `;

    // 통계 카드
    const statsRow = el("div", "result-stats");
    statsRow.innerHTML = `
      <div class="result-stat correct-stat">
        <span class="rs-num">${correct}</span>
        <span class="rs-label">정답</span>
      </div>
      <div class="result-stat wrong-stat">
        <span class="rs-num">${wrong}</span>
        <span class="rs-label">오답</span>
      </div>
      <div class="result-stat">
        <span class="rs-num">${score}%</span>
        <span class="rs-label">득점률</span>
      </div>
    `;

    // 오답 분석
    const wrongAnswers = state.answers.filter(a => !a.correct);
    let reviewSection = null;

    if (wrongAnswers.length > 0) {
      reviewSection = el("div", "review-section");
      const reviewTitle = el("h3", "review-title", "📌 틀린 문제 & 복습 가이드");

      // 틀린 번호 한눈에
      const wrongNums = el("div", "wrong-nums");
      wrongNums.innerHTML = "<strong>틀린 문항:</strong> " +
        wrongAnswers.map(a => `<span class="wrong-num-badge">Q${a.questionId}</span>`).join(" ");

      // 주제별 그룹
      const topicCount = {};
      wrongAnswers.forEach(a => {
        topicCount[a.topic] = (topicCount[a.topic] || 0) + 1;
      });

      const topicList = el("div", "topic-review-list");
      const topicTitle = el("p", "topic-review-header", "📖 복습이 필요한 주제:");
      topicList.appendChild(topicTitle);

      Object.entries(topicCount)
        .sort((a, b) => b[1] - a[1])
        .forEach(([topic, cnt]) => {
          const item = el("div", "topic-item");
          item.innerHTML = `<span class="topic-name">${topic}</span><span class="topic-cnt">${cnt}문제 오답</span>`;
          topicList.appendChild(item);
        });

      // 상세 오답 목록
      const detailTitle = el("p", "topic-review-header", "🔍 오답 상세:");
      const detailList  = el("div", "detail-list");
      wrongAnswers.forEach(a => {
        const q = questions.find(q => q.id === a.questionId);
        const item = el("div", "detail-item");
        item.innerHTML = `
          <div class="detail-q"><strong>Q${q.id}</strong> — ${q.text.substring(0, 60)}...</div>
          <div class="detail-exp">${q.explanation}</div>
        `;
        detailList.appendChild(item);
      });

      reviewSection.append(reviewTitle, wrongNums, topicList, detailTitle, detailList);
    } else {
      reviewSection = el("div", "perfect-msg", "🏆 모든 문제를 맞혔습니다! 완벽합니다.");
    }

    // 다시 풀기 버튼
    const retryBtn = el("button", "btn-primary", "다시 풀기");
    retryBtn.addEventListener("click", showIntro);

    wrap.append(resultHeader, statsRow, reviewSection, retryBtn);
    dom.screen.appendChild(wrap);
  }

  // ── 초기화 ────────────────────────────────────────────
  function init() {
    // 퀴즈 제목 메타 설정
    document.title = QUIZ_CONFIG.title;
    const metaEl = document.getElementById("quiz-meta");
    if (metaEl) metaEl.textContent = QUIZ_CONFIG.courseLevel;

    showIntro();
  }

  document.addEventListener("DOMContentLoaded", init);
})();