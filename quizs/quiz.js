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
//  문제 목록  (40문제)
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

  // ── 기본 ──────────────────────────────────────────────
  {
    id: 6,
    type: "multiple",
    topic: "GPU vs CPU",
    text: "Regarding GPU vs CPU for Big Data workloads, which statement is MOST accurate? (빅데이터 연산에서 GPU vs CPU에 대한 설명 중 가장 정확한 것은?)",
    options: [
      "CPU is always faster because it has higher clock speed",
      "GPU is better for general-purpose branching logic",
      "CPU is designed for general operations; GPU excels at massive parallel computation",
      "GPU replaced CPU entirely for all Big Data tasks",
    ],
    answer: 2,
    explanation: "CPU는 범용 연산용, GPU는 대규모 병렬 연산에 특화. 강의에서 GPU는 원래 비디오 게임용이었으나 현재는 AI/빅데이터 연산에 핵심 도구로 사용됩니다.",
  },
  {
    id: 7,
    type: "multiple",
    topic: "Federated Learning",
    text: "Federated Learning differs from standard distributed training primarily because: (Federated Learning이 일반 분산 학습과 가장 다른 점은?)",
    options: [
      "It runs on a single powerful GPU server",
      "Raw data stays on edge devices; only model weights are shared",
      "It requires all data to be centralized before training",
      "It is only applicable to image classification tasks",
    ],
    answer: 1,
    explanation: "Federated Learning은 각 기기가 raw 데이터를 보내지 않고 로컬에서 학습한 가중치(weights)만 공유합니다. 포터블 GPU가 있는 엣지 디바이스 환경에서 사용됩니다.",
  },
  {
    id: 8,
    type: "short",
    topic: "분산 스토리지",
    text: "In distributed storage, what term describes maintaining multiple copies of data across nodes to ensure fault tolerance? (분산 스토리지에서 장애 허용을 위해 여러 노드에 데이터 사본을 유지하는 것을 무엇이라 하는가?)",
    answer: ["Replication", "레플리케이션", "복제", "replica"],
    explanation: "분산 시스템에서 Distribution은 스토리지 관점에서 Replication(복제)을 의미합니다. 일반적으로 3개 이상의 복제본을 유지합니다.",
  },
  {
    id: 9,
    type: "multiple",
    topic: "분산 스토리지 / CDN",
    text: "YouTube uses CDN with .m3u8 and .ts files. What does this approach represent in distributed storage terms? (YouTube가 .m3u8과 .ts 파일로 CDN을 사용하는 것은 분산 스토리지 관점에서 무엇에 해당하는가?)",
    options: [
      "Master-Slave Replication",
      "Decentralized splitting and chunking for streaming",
      "Hash sharding of video metadata",
      "Vertical scaling of a single storage server",
    ],
    answer: 1,
    explanation: ".m3u8은 인덱스, .ts는 작은 영상 청크(chunk). 이는 데이터를 쪼개어 분산 전달하는 Decentralized Splitting & Chunking 방식입니다. 토렌트 시스템도 동일한 원리.",
  },
  {
    id: 10,
    type: "short",
    topic: "분산 시스템 / 장애 탐지",
    text: "What mechanism does Hadoop use to detect dead/failed partitions in a distributed system? (Hadoop이 분산 시스템에서 죽은 파티션을 감지하는 메커니즘은?)",
    answer: ["Heartbeat", "하트비트", "heartbeat"],
    explanation: "Heartbeat는 주기적으로 노드가 살아있음을 알리는 신호입니다. Hadoop은 이를 통해 죽은 파티션을 탐지하고 자가 복구(self-recovery)를 수행합니다.",
  },

  // ── 이해 ──────────────────────────────────────────────
  {
    id: 11,
    type: "multiple",
    topic: "ACID",
    text: "A bank transfer involves debiting one account and crediting another. Which ACID property ensures BOTH operations happen or NEITHER does? (은행 이체에서 출금과 입금이 반드시 함께 성공하거나 둘 다 실패해야 함을 보장하는 ACID 속성은?)",
    options: [
      "Consistency",
      "Isolation",
      "Atomicity",
      "Durability",
    ],
    answer: 2,
    explanation: "Atomicity(원자성): 트랜잭션 내 모든 연산이 성공하거나, 하나라도 실패하면 전체가 롤백됩니다. 트랜잭션은 분리 불가능합니다.",
  },
  {
    id: 12,
    type: "multiple",
    topic: "BASE vs ACID",
    text: "Which statement CORRECTLY contrasts BASE with ACID? (BASE와 ACID를 올바르게 대조한 설명은?)",
    options: [
      "BASE guarantees immediate consistency; ACID allows eventual consistency",
      "BASE sacrifices strong consistency for availability and scalability; ACID guarantees strong consistency",
      "Both BASE and ACID are used exclusively in relational databases",
      "BASE requires all replicas to be identical at all times",
    ],
    answer: 1,
    explanation: "BASE(Basically Available, Soft state, Eventually consistent)는 강한 일관성 대신 가용성과 확장성을 택합니다. ACID는 강한 일관성을 보장합니다. 대부분의 NoSQL이 BASE를 채택합니다.",
  },
  {
    id: 13,
    type: "multiple",
    topic: "CAP 정리",
    text: "According to the CAP theorem, since network partition is unavoidable in distributed systems, a designer must choose between: (CAP 정리에 따라 네트워크 파티션이 불가피한 상황에서 설계자가 선택해야 하는 트레이드오프는?)",
    options: [
      "Consistency vs Availability",
      "Consistency vs Performance",
      "Availability vs Durability",
      "Partition Tolerance vs Scalability",
    ],
    answer: 0,
    explanation: "CAP: 분산 DB는 C(일관성), A(가용성), P(파티션 허용) 중 2개만 보장 가능. 네트워크 파티션은 현실에서 불가피하므로 P는 고정, 결국 C vs A 선택의 문제입니다.",
  },
  {
    id: 14,
    type: "multiple",
    topic: "샤딩",
    text: "In Hash Sharding, data placement is determined by: (해시 샤딩에서 데이터 배치는 무엇으로 결정되는가?)",
    options: [
      "The alphabetical order of the key",
      "hash(key) % N where N is the number of nodes",
      "The timestamp of data insertion",
      "The size of each shard",
    ],
    answer: 1,
    explanation: "해시 샤딩: hash(key) % N 연산으로 어떤 노드에 데이터를 저장할지 결정합니다. Range Sharding은 키 범위(예: 1~1000)로 노드를 분배합니다.",
  },
  {
    id: 15,
    type: "multiple",
    topic: "샤딩 단점",
    text: "Which operation becomes EXTREMELY expensive in a sharded database architecture? (샤딩된 데이터베이스 아키텍처에서 매우 비용이 큰 연산은?)",
    options: [
      "Single-key lookup on the primary shard",
      "Cross-shard JOIN operations",
      "INSERT on a single node",
      "Index scan within one shard",
    ],
    answer: 1,
    explanation: "Cross-shard JOIN은 여러 노드를 가로질러 데이터를 합쳐야 하므로 매우 비용이 큽니다. 또한 노드 추가/제거 시 Re-sharding도 복잡한 도전 과제입니다.",
  },
  {
    id: 16,
    type: "multiple",
    topic: "복제 / Master-Slave",
    text: "In Master-Slave Replication, what happens when the Master node fails? (Master-Slave 복제에서 마스터 노드가 장애 시 어떻게 되는가?)",
    options: [
      "All data is lost until the master restarts",
      "One of the slave nodes is promoted to become the new master",
      "The system stops accepting any requests",
      "A new slave is automatically created from backup",
    ],
    answer: 1,
    explanation: "Master-Slave: 마스터(쓰기) 장애 시 슬레이브 중 하나가 마스터로 승격(promote)됩니다. Multi-Master는 어느 노드든 쓰기가 가능하지만 일관성 유지가 어렵습니다.",
  },
  {
    id: 17,
    type: "multiple",
    topic: "NoSQL vs RDBMS",
    text: "Why is NoSQL NOT simply 'better' than RDBMS? (NoSQL이 단순히 RDBMS보다 '더 나은' 것이 아닌 이유는?)",
    options: [
      "NoSQL cannot store large amounts of data",
      "NoSQL lacks any form of indexing",
      "NoSQL trades ACID guarantees for scalability; RDBMS is better for structured relational data requiring strong consistency",
      "RDBMS supports horizontal scaling better than NoSQL",
    ],
    answer: 2,
    explanation: "강의 핵심: 'NoSQL is not better → it trades ACID for scalability'. 구조화된 관계형 데이터와 강한 일관성이 필요할 때는 RDBMS가 적합합니다.",
  },
  {
    id: 18,
    type: "short",
    topic: "메모리 최적화",
    text: "In Python, an integer occupies 28+ bytes due to being an object. What type of data types should be used instead to reduce memory in Big Data workloads? (Python에서 정수는 객체로 28바이트 이상을 차지한다. 빅데이터에서 메모리 최적화를 위해 사용해야 하는 데이터 타입 종류는?)",
    answer: ["compact primitive", "primitive", "int32", "int64", "compact", "원시 타입", "프리미티브"],
    explanation: "Python의 동적 int 대신 int32, int64 같은 compact primitive data type을 사용하면 메모리를 획기적으로 줄일 수 있습니다.",
  },
  {
    id: 19,
    type: "multiple",
    topic: "벡터화",
    text: "Vectorization improves computation speed primarily by: (벡터화가 연산 속도를 향상시키는 주된 이유는?)",
    options: [
      "Running the for-loop on multiple CPU cores simultaneously",
      "Converting iterative element-wise operations into a single vector operation, reducing iteration overhead",
      "Caching the loop result in Redis",
      "Converting data to binary format before the loop",
    ],
    answer: 1,
    explanation: "for-loop은 N번 연산, 벡터화(예: numpy.array)는 전체를 1번 연산으로 처리합니다. CPU 파이프라인을 효율적으로 사용해 속도를 높입니다.",
  },
  {
    id: 20,
    type: "multiple",
    topic: "Memory Mapping",
    text: "Memory Mapping is used in Big Data optimization when: (메모리 매핑을 사용하는 상황은?)",
    options: [
      "VRAM is overflowing during GPU training",
      "Data is too large to fit in RAM, so storage is mapped to memory addresses",
      "Network bandwidth is the bottleneck",
      "CPU cache miss rate is too high",
    ],
    answer: 1,
    explanation: "Memory Mapping: 데이터가 RAM보다 클 때 스토리지의 특정 부분을 메모리 주소로 매핑하여 RAM처럼 사용합니다. VRAM 부족 시도 동일 원리 적용 가능합니다.",
  },

  // ── 이해 심화 ──────────────────────────────────────────
  {
    id: 21,
    type: "multiple",
    topic: "Lazy Evaluation",
    text: "Which of the following BEST describes Lazy Evaluation in query optimization (e.g., Polars/Spark)? (Polars/Spark의 쿼리 최적화에서 Lazy Evaluation을 가장 잘 설명한 것은?)",
    options: [
      "Queries are executed immediately as soon as they are written",
      "The system evaluates all possible query paths and picks the fastest",
      "Evaluation of expressions is delayed until the result is actually needed",
      "Data is cached in Redis to avoid re-evaluation",
    ],
    answer: 2,
    explanation: "Lazy Evaluation: 결과가 실제로 필요한 시점까지 연산을 미룹니다. 이를 통해 불필요한 중간 연산을 제거하고 전체 쿼리 실행 계획을 최적화할 수 있습니다.",
  },
  {
    id: 22,
    type: "multiple",
    topic: "Columnar Memory Layout",
    text: "Columnar memory layout is MOST beneficial when: (컬럼형 메모리 레이아웃이 가장 유리한 상황은?)",
    options: [
      "Fetching all columns for a single row record",
      "Performing aggregations or analytics on a specific field across many rows",
      "Inserting new rows one at a time",
      "Running transactions that update multiple columns simultaneously",
    ],
    answer: 1,
    explanation: "컬럼형 레이아웃은 특정 필드(변수) 기준으로 메모리에 저장되므로, 특정 컬럼에 대한 집계/분석 연산 시 캐시 효율이 높습니다. 행 단위 CRUD에는 Row 레이아웃이 유리합니다.",
  },
  {
    id: 23,
    type: "multiple",
    topic: "Cloud Scaling",
    text: "A company adds more servers to handle increased load rather than upgrading existing hardware. This is an example of: (기존 하드웨어를 업그레이드하지 않고 서버를 추가해 부하를 처리하는 것은?)",
    options: [
      "Vertical Scaling",
      "Horizontal Scaling",
      "Functional Decomposition",
      "Sharding",
    ],
    answer: 1,
    explanation: "Horizontal Scaling(수평 확장)은 서버를 추가하는 방식입니다. Vertical Scaling(수직 확장)은 기존 서버의 사양을 높이는 방식으로, 상한선이 존재합니다.",
  },
  {
    id: 24,
    type: "multiple",
    topic: "IaaS / PaaS / SaaS",
    text: "Google Colab (a cloud-based Jupyter notebook environment) is BEST classified as: (Google Colab은 클라우드 서비스 중 무엇으로 분류되는가?)",
    options: [
      "IaaS — it provides raw virtual infrastructure",
      "PaaS — it provides a development/runtime platform over infrastructure",
      "SaaS — it is an end-user application like Gmail",
      "DaaS — it provides datasets as a service",
    ],
    answer: 1,
    explanation: "Google Colab은 Google App Engine처럼 플랫폼으로서의 서비스(PaaS)입니다. IaaS는 가상 서버/스토리지, SaaS는 Gmail·Office 365 같은 최종 사용자 앱입니다.",
  },
  {
    id: 25,
    type: "multiple",
    topic: "분산 vs 탈중앙화",
    text: "Blockchain is cited as an example of distributed system consensus. Which concept does it MOST closely represent? (블록체인은 분산 시스템 합의의 예로 언급된다. 이는 어떤 개념을 가장 잘 나타내는가?)",
    options: [
      "Centralized consensus with a single authority",
      "Decentralized consensus without a central authority",
      "Master-Slave replication model",
      "Range sharding across geographic regions",
    ],
    answer: 1,
    explanation: "블록체인은 Decentralized(탈중앙화) 합의 메커니즘의 대표 사례입니다. 강의에서 Distributed vs Decentralized를 구분하며 블록체인을 언급했습니다.",
  },

  // ── 활용 (연결·응용) ──────────────────────────────────
  {
    id: 26,
    type: "multiple",
    topic: "CAP + NoSQL 연결",
    text: "Cassandra, a NoSQL database, prioritizes Availability over Consistency under network partition. According to CAP theorem, what does this make Cassandra? (Cassandra는 네트워크 파티션 시 일관성보다 가용성을 우선한다. CAP 정리에 따르면 Cassandra는 어느 유형인가?)",
    options: [
      "CP system (Consistency + Partition Tolerance)",
      "CA system (Consistency + Availability)",
      "AP system (Availability + Partition Tolerance)",
      "Full CAP system",
    ],
    answer: 2,
    explanation: "P(파티션 허용)는 분산 시스템에서 불가피하므로 고정. Cassandra는 A(가용성)를 선택 → AP 시스템. CA 시스템은 실제 분산 환경에서 존재할 수 없습니다.",
  },
  {
    id: 27,
    type: "multiple",
    topic: "ACID + 샤딩 연결",
    text: "A financial application requires strict ACID transactions across multiple shards. Why is this problematic? (금융 애플리케이션이 여러 샤드에 걸쳐 엄격한 ACID 트랜잭션을 요구할 때 문제가 되는 이유는?)",
    options: [
      "Sharding inherently violates Isolation in RDBMS",
      "Cross-shard operations are expensive and maintaining atomicity across nodes requires complex distributed transaction protocols",
      "ACID transactions cannot be used with any form of horizontal scaling",
      "Shards cannot store relational data",
    ],
    answer: 1,
    explanation: "샤드 간 원자성(Atomicity) 보장은 2PC(Two-Phase Commit) 같은 복잡한 분산 트랜잭션 프로토콜이 필요하며, Cross-shard JOIN/트랜잭션은 매우 비용이 큽니다.",
  },
  {
    id: 28,
    type: "multiple",
    topic: "BASE + Eventually Consistent",
    text: "A user updates their profile picture on a social network. For the next 2 seconds, some users still see the old picture. This is an example of: (사용자가 프로필 사진을 변경했으나 2초간 일부 사용자에게 이전 사진이 보인다. 이는 무엇의 예인가?)",
    options: [
      "ACID Consistency violation",
      "CAP Partition Tolerance failure",
      "BASE — Eventually Consistent behavior with Soft State",
      "Master-Slave replication lag causing data loss",
    ],
    answer: 2,
    explanation: "BASE의 Soft State + Eventually Consistent: 복제 전파에 시간이 걸려 일시적으로 복제본들이 다를 수 있으나, 결국 동일한 값으로 수렴합니다. 데이터 손실이 아닙니다.",
  },
  {
    id: 29,
    type: "multiple",
    topic: "최적화 종합",
    text: "A data pipeline reads 500GB of CSV files in Python using a for-loop, stores intermediate results as Python int objects, and re-executes the same aggregation query each run. Which combination of optimizations would have the GREATEST impact? (Python for-loop으로 500GB CSV를 읽고, Python int 객체로 저장, 동일 집계 쿼리를 매번 재실행하는 파이프라인의 최적화 조합으로 가장 효과적인 것은?)",
    options: [
      "Vectorization + compact data types + query caching",
      "Master-Slave replication + CDN",
      "Hash sharding + Heartbeat monitoring",
      "Memory Mapping only",
    ],
    answer: 0,
    explanation: "① for-loop → 벡터화, ② Python int → compact primitive(int32/int64), ③ 반복 쿼리 → Redis 등 캐싱. 세 가지 최적화가 각각 연산·메모리·쿼리 병목을 해결합니다.",
  },
  {
    id: 30,
    type: "multiple",
    topic: "Cloud DB vs Traditional DB",
    text: "Which characteristic makes Cloud DB inherently more fault-tolerant than a traditional on-site DB? (Cloud DB가 전통적인 온사이트 DB보다 본질적으로 장애 허용성이 높은 이유는?)",
    options: [
      "Cloud DB uses faster SSDs",
      "Cloud DB has a dedicated DBA team",
      "Data is automatically replicated across geographically distributed nodes",
      "Cloud DB always uses ACID transactions",
    ],
    answer: 2,
    explanation: "Cloud DB는 지리적으로 분산된 노드에 데이터를 자동 복제하므로 단일 장애점(SPOF)이 없습니다. 전통 DB는 단일 서버 장애 시 전체가 멈출 수 있습니다.",
  },
  {
    id: 31,
    type: "multiple",
    topic: "Data Locality",
    text: "Data Locality in distributed computing refers to: (분산 컴퓨팅에서 Data Locality란?)",
    options: [
      "Storing all data in a single local server to minimize latency",
      "Calculating where data resides and moving computation close to data to optimize network usage",
      "Replicating data to the nearest geographic CDN node",
      "Compressing data locally before transmission",
    ],
    answer: 1,
    explanation: "Data Locality: 데이터가 있는 곳을 계산하고, 네트워크 자원을 최적화하기 위해 연산을 데이터 가까이로 이동시킵니다. 대용량 데이터를 네트워크로 이동시키는 것보다 효율적입니다.",
  },
  {
    id: 32,
    type: "multiple",
    topic: "Binary Serialization",
    text: "Binary serialization is preferred over text formats (e.g., JSON) in Big Data pipelines because: (빅데이터 파이프라인에서 JSON 같은 텍스트 형식보다 바이너리 직렬화를 선호하는 이유는?)",
    options: [
      "Binary is human-readable and easier to debug",
      "Binary is CPU-friendly and Network-friendly, reducing processing and transmission overhead",
      "Binary format is required by all distributed databases",
      "Binary data cannot be intercepted during network transfer",
    ],
    answer: 1,
    explanation: "Binary는 CPU가 직접 처리 가능한 형식이며 크기가 작아 네트워크 전송도 효율적입니다. JSON은 사람이 읽기 쉽지만 파싱 오버헤드가 크고 크기가 큽니다.",
  },
  {
    id: 33,
    type: "short",
    topic: "쿼리 최적화 / Cost-Based",
    text: "What Spark command triggers cost-based optimization by collecting table/column statistics? (Spark에서 테이블/컬럼 통계를 수집하여 비용 기반 최적화를 활성화하는 명령어는?)",
    answer: ["ANALYZE TABLE", "analyze table"],
    explanation: "ANALYZE TABLE in Spark는 테이블/컬럼 단위 통계를 수집하여 Cost-Based Optimizer(CBO)가 더 나은 실행 계획을 선택할 수 있게 합니다.",
  },
  {
    id: 34,
    type: "multiple",
    topic: "SETI@HOME / Grid Computing",
    text: "SETI@HOME is cited as an example of Grid Computing. What makes it Grid Computing rather than a private cluster? (SETI@HOME이 그리드 컴퓨팅의 예인 이유로 가장 적절한 것은?)",
    options: [
      "It uses a single supercomputer with many cores",
      "It distributes computation across geographically dispersed, heterogeneous volunteer devices over the internet",
      "It uses only GPU-based computing nodes",
      "It applies federated learning to space signal data",
    ],
    answer: 1,
    explanation: "Grid Computing은 인터넷을 통해 지리적으로 분산된 이질적 장치들을 연결해 대규모 연산을 수행합니다. SETI@HOME은 자원봉사 컴퓨터들로 우주 신호를 분석했습니다.",
  },
  {
    id: 35,
    type: "multiple",
    topic: "Streaming vs Batch",
    text: "A fraud detection system must flag suspicious transactions WITHIN MILLISECONDS of occurrence. Which processing paradigm is required? (사기 탐지 시스템이 수밀리초 내에 의심 거래를 감지해야 한다. 어떤 처리 패러다임이 필요한가?)",
    options: [
      "Batch processing — collect all day's transactions then analyze",
      "Streaming — process each transaction in real-time as it arrives",
      "Lazy evaluation — defer processing until needed",
      "Columnar processing — analyze per-column statistics",
    ],
    answer: 1,
    explanation: "Streaming은 데이터가 도착하는 즉시 실시간으로 처리합니다. Batch는 일정 기간 수집 후 처리하므로 수밀리초 내 응답이 불가능합니다.",
  },
  {
    id: 36,
    type: "multiple",
    topic: "Asynchronous / Bottleneck",
    text: "In HPC with multi-device clusters, why is excessive if-else branching problematic? (HPC 멀티 디바이스 클러스터에서 과도한 if-else 분기가 문제가 되는 이유는?)",
    options: [
      "if-else cannot be compiled in distributed environments",
      "Branching causes synchronization bottlenecks as devices with different speeds must wait at branch points",
      "if-else increases memory usage proportionally to the number of nodes",
      "Conditional logic is not supported in GPU shader languages",
    ],
    answer: 1,
    explanation: "HPC는 비동기 패러다임을 사용하며, 장치마다 처리 속도가 다릅니다. 분기(branching)는 느린 장치를 기다려야 하는 동기화 병목(bottleneck)을 유발합니다.",
  },
  {
    id: 37,
    type: "multiple",
    topic: "Horizontal Scaling 방법",
    text: "A database is sharded by grouping user data, order data, and product data into separate databases. This specific approach to horizontal scaling is called: (사용자 데이터, 주문 데이터, 상품 데이터를 각각 별도 DB로 분리하는 수평 확장 방식은?)",
    options: [
      "Hash Sharding",
      "Range Sharding",
      "Functional Scaling",
      "Multi-Master Replication",
    ],
    answer: 2,
    explanation: "Functional Scaling(기능적 확장): 기능/도메인 그룹별로 DB를 분리합니다. Sharding은 동일 유형 데이터를 여러 DB에 분산하는 것입니다. 둘은 다른 개념입니다.",
  },
  {
    id: 38,
    type: "multiple",
    topic: "ISO 16363",
    text: "ISO 16363 is referenced in the lecture in the context of: (강의에서 ISO 16363이 언급된 맥락은?)",
    options: [
      "Ensuring network partition tolerance in distributed systems",
      "Ensuring technical integrity for replicated storage",
      "Defining the 3V model of Big Data",
      "Standardizing GPU shader language for HPC",
    ],
    answer: 1,
    explanation: "ISO 16363은 복제 스토리지의 기술적 무결성(Technical Integrity)을 보장하는 표준입니다. 강의에서 Replica의 무결성 보장 맥락에서 언급되었습니다.",
  },
  {
    id: 39,
    type: "multiple",
    topic: "Cloud 종합",
    text: "Which statement is the MOST accurate regarding Cloud vs On-site infrastructure? (클라우드 vs 온사이트 인프라에 관한 가장 정확한 설명은?)",
    options: [
      "Cloud is always superior to on-site for every use case",
      "On-site is always cheaper long-term than cloud",
      "Cloud offers agility and low initial cost, but the optimal choice depends on use case, compliance, and long-term cost",
      "Cloud DB always guarantees stronger consistency than on-site RDBMS",
    ],
    answer: 2,
    explanation: "강의 결론: 'Cloud is always better than On-site?' — 상황에 따라 다릅니다. 클라우드는 초기 비용 절감·민첩성에 유리하지만, 규정 준수·장기 비용·특수 요구사항에 따라 온사이트가 나을 수도 있습니다.",
  },
  {
    id: 40,
    type: "multiple",
    topic: "전체 연결 / 종합",
    text: "A startup builds a real-time recommendation engine processing 10TB/day of clickstream data. They need fault tolerance, horizontal scalability, and can tolerate slight read inconsistencies. Which combination BEST fits? (클릭스트림 데이터 10TB/일을 처리하는 실시간 추천 엔진. 장애 허용, 수평 확장, 약간의 읽기 불일치 허용 가능. 가장 적합한 조합은?)",
    options: [
      "On-site PostgreSQL (ACID) + Vertical Scaling + Batch Processing",
      "Cloud NoSQL (BASE/AP) + Horizontal Scaling (Sharding) + Streaming + Caching",
      "Single Master RDBMS + Multi-Master Replication + Lazy Evaluation only",
      "IaaS only + Range Sharding + ISO 16363 compliance",
    ],
    answer: 1,
    explanation: "①Cloud NoSQL(BASE/AP): 가용성·확장성 우선, ②수평 확장+샤딩: 10TB 처리, ③Streaming: 실시간 처리, ④Caching(Redis): 반복 쿼리 최적화. 모든 요구사항을 충족하는 조합입니다.",
  },
];