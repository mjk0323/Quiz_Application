// ============================================================
//  quiz.js  —  문제 세트 2 (40문제)
//  틀린 토픽 보강 + 선지 길이/디테일 균일화
// ============================================================

const QUIZ_CONFIG = {
  title: "Big Data / Distributed Systems",
  subtitle: "빅데이터 & 분산 시스템 전공 퀴즈 — 세트 2",
  courseLevel: "대학교 4학년 전공",
  totalQuestions: 40,
  passingScore: 70,
  showExplanationImmediately: true,
};

const TYPE_HANDLERS = {
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
          if (!correct) list.children[q.answer].classList.add("correct");
          list.querySelectorAll(".option-item").forEach(el => el.classList.add("disabled"));
          onAnswer(correct, idx);
        });
        list.appendChild(li);
      });
      container.appendChild(list);
    },
    grade(q, userAnswer) { return userAnswer === q.answer; },
  },

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
//  문제 목록 (40문제) — 선지 길이/디테일 균일화
// ──────────────────────────────────────────────
const questions = [

  // ── 1~8: 기초 ───────────────────────────────
  {
    id: 1,
    type: "multiple",
    topic: "Big Data 정의",
    text: "Which threshold BEST defines when data becomes 'Big Data' in a practical engineering context? (실용적 엔지니어링 관점에서 빅데이터를 정의하는 기준으로 가장 적절한 것은?)",
    options: [
      "Data that cannot fit into a single spreadsheet application",
      "Data exceeding RAM, storage, or single-core processing capacity per unit time",
      "Data that requires more than one developer to manage and maintain",
      "Data stored in a format that standard databases cannot read directly",
    ],
    answer: 1,
    explanation: "빅데이터의 실질적 기준은 RAM 초과, 단일 스토리지 초과, 또는 단일 코어의 단위시간 처리 한계 초과입니다. 개발자 수나 파일 포맷은 정의와 무관합니다.",
  },
  {
    id: 2,
    type: "multiple",
    topic: "Big Data 3V",
    text: "Which set of properties makes up the ORIGINAL 3V model of Big Data? (빅데이터 최초 3V 모델의 구성 요소는?)",
    options: [
      "Volume, Validity, Velocity",
      "Value, Variety, Veracity",
      "Volume, Variety, Velocity",
      "Velocity, Veracity, Value",
    ],
    answer: 2,
    explanation: "최초 3V는 Volume(양), Variety(다양성), Velocity(속도)입니다. Veracity는 4V, Value는 5V에서 추가됩니다. Validity는 7V 논의에서 일부 포함되는 개념입니다.",
  },
  {
    id: 3,
    type: "multiple",
    topic: "Big Data 해결책",
    text: "The lecture identifies four main solution categories for Big Data. Which option lists ALL four correctly? (강의에서 제시된 빅데이터의 4가지 주요 해결책 범주를 모두 올바르게 나열한 것은?)",
    options: [
      "Replication, Sharding, Caching, Indexing",
      "Distribution, Scaling Up, Optimization, Cloud",
      "HPC, NoSQL, CDN, Federated Learning",
      "Streaming, Batch, Vectorization, Memory Mapping",
    ],
    answer: 1,
    explanation: "강의에서 제시한 4가지 주요 해결책은 Distribution, Scaling Up, Optimization, Cloud입니다. 나머지 선지들은 각 범주 안에 포함되는 세부 기술들입니다.",
  },
  {
    id: 4,
    type: "multiple",
    topic: "Batch Processing",
    text: "A log aggregation system collects server logs every hour and runs analysis at midnight. This is an example of: (서버 로그를 1시간마다 수집하여 자정에 분석하는 시스템은 어떤 처리 방식인가?)",
    options: [
      "Streaming, because data continuously flows into the pipeline",
      "Batch, because data is collected over a period and processed together",
      "Lazy Evaluation, because processing is deferred until explicitly triggered",
      "Vectorization, because operations are applied to collections of data",
    ],
    answer: 1,
    explanation: "Batch는 일정 기간 데이터를 모아 한꺼번에 처리하는 방식입니다. Streaming은 데이터가 도착하는 즉시 실시간으로 처리합니다.",
  },
  {
    id: 5,
    type: "multiple",
    topic: "Streaming Processing",
    text: "Which scenario REQUIRES streaming processing rather than batch? (반드시 스트리밍 처리가 필요한 시나리오는?)",
    options: [
      "Generating monthly sales summary reports from a data warehouse",
      "Training a machine learning model on last quarter's collected data",
      "Detecting fraudulent transactions and flagging them within milliseconds",
      "Nightly ETL pipeline that transfers data between two databases",
    ],
    answer: 2,
    explanation: "수밀리초 내 실시간 탐지는 Streaming이 필요합니다. 월간 보고서, 모델 학습, 야간 ETL은 지연 처리가 허용되므로 Batch로 충분합니다.",
  },
  {
    id: 6,
    type: "multiple",
    topic: "HPC / GPU",
    text: "Why has GPU become the preferred hardware for Big Data and AI workloads over CPU? (CPU보다 GPU가 빅데이터·AI 연산에 선호되는 이유는?)",
    options: [
      "GPU achieves higher clock speeds than modern server CPUs",
      "GPU handles branching logic more efficiently than CPU pipelines",
      "GPU contains thousands of cores optimized for parallel computation",
      "GPU provides larger on-chip cache memory than CPU designs",
    ],
    answer: 2,
    explanation: "GPU는 수천 개의 코어로 병렬 연산에 특화되어 있습니다. CPU는 범용 직렬 연산에 최적화되어 있으며, 클럭 속도나 캐시 크기에서 GPU가 절대적 우위인 것은 아닙니다.",
  },
  {
    id: 7,
    type: "multiple",
    topic: "Distributed vs Decentralized",
    text: "Which system BEST illustrates decentralized consensus rather than distributed computing? (분산 컴퓨팅이 아닌 탈중앙화 합의를 가장 잘 보여주는 시스템은?)",
    options: [
      "Hadoop cluster managed by a central NameNode coordinator",
      "Master-Slave database with a single primary node routing writes",
      "Blockchain network operating without any central authority",
      "CDN with a central origin server routing all client requests",
    ],
    answer: 2,
    explanation: "블록체인은 중앙 관리자 없이 노드들이 합의하는 탈중앙화(Decentralized) 시스템입니다. Hadoop, Master-Slave, CDN은 중앙 조정자가 존재하는 분산(Distributed) 시스템입니다.",
  },
  {
    id: 8,
    type: "short",
    topic: "Grid Computing",
    text: "SETI@HOME distributes computation across volunteer devices worldwide over the internet. What type of distributed computing does this represent? (SETI@HOME처럼 인터넷을 통해 전 세계 자원봉사 장치에 연산을 분산하는 방식을 무엇이라 하는가?)",
    answer: ["Grid Computing", "그리드 컴퓨팅", "grid computing", "Grid"],
    explanation: "Grid Computing은 인터넷을 통해 지리적으로 분산된 이질적 장치들을 연결해 대규모 연산을 수행합니다. SETI@HOME이 대표적인 사례입니다.",
  },

  // ── 9~17: 기본 ──────────────────────────────
  {
    id: 9,
    type: "multiple",
    topic: "분산 스토리지 / Replication",
    text: "In distributed storage, 'distribution' is primarily achieved through which mechanism? (분산 스토리지에서 '분산'은 주로 어떤 메커니즘으로 구현되는가?)",
    options: [
      "Sharding data by key range across multiple physical disks",
      "Replication of data copies across multiple storage nodes",
      "Compressing data to reduce the number of physical drives needed",
      "Caching frequently accessed files in high-speed memory tiers",
    ],
    answer: 1,
    explanation: "강의에서 스토리지 관점의 Distribution은 Replication(복제)을 의미합니다. 일반적으로 3개 이상의 복제본을 유지하며 트레이드오프가 존재합니다.",
  },
  {
    id: 10,
    type: "multiple",
    topic: "Replica 수",
    text: "What is the generally recommended minimum number of replicas in a distributed storage system? (분산 스토리지에서 일반적으로 권장되는 최소 복제본 수는?)",
    options: [
      "1 — the original is sufficient with a reliable backup schedule",
      "2 — one primary node and one secondary standby node",
      "3 or more — to tolerate node failure while remaining available",
      "10 or more — required to meet enterprise reliability standards",
    ],
    answer: 2,
    explanation: "강의에서 일반적으로 복제본은 3개 이상을 권장합니다. 2개는 하나가 죽으면 여분이 하나뿐이라 위험하며, 3개 이상부터 실질적인 장애 허용이 가능합니다.",
  },
  {
    id: 11,
    type: "multiple",
    topic: "CDN / 청크 스트리밍",
    text: "YouTube streams video using .m3u8 index files and small .ts chunk files via CDN. Which distributed storage concept does this apply? (YouTube가 .m3u8 인덱스와 .ts 청크로 CDN 스트리밍하는 것은 어떤 분산 스토리지 개념인가?)",
    options: [
      "Master-Slave replication distributing read load across nodes",
      "Hash sharding of video segments across geographic clusters",
      "Decentralized splitting and chunking for distributed delivery",
      "Lazy evaluation of video metadata to defer transcode jobs",
    ],
    answer: 2,
    explanation: ".m3u8은 인덱스, .ts는 작은 영상 청크입니다. 데이터를 쪼개어 분산 전달하는 Decentralized Splitting & Chunking이며, 토렌트 시스템도 같은 원리입니다.",
  },
  {
    id: 12,
    type: "short",
    topic: "장애 탐지",
    text: "What periodic signal does each node send in a distributed system (e.g., Hadoop) to indicate it is still operational? (Hadoop 등 분산 시스템에서 각 노드가 살아있음을 알리기 위해 주기적으로 보내는 신호는?)",
    answer: ["Heartbeat", "하트비트", "heartbeat"],
    explanation: "Heartbeat는 분산 시스템에서 노드가 주기적으로 생존 신호를 보내는 메커니즘입니다. 신호가 끊기면 해당 파티션을 죽은 것으로 간주하고 자가 복구를 수행합니다.",
  },
  {
    id: 13,
    type: "multiple",
    topic: "ACID — Atomicity",
    text: "A transaction decrements inventory and inserts an order record. The server crashes after the inventory update but before the order insert. Atomicity ensures: (재고 감소 후 주문 생성 전 크래시 발생 시 원자성이 보장하는 것은?)",
    options: [
      "The completed inventory update is saved and the order is skipped",
      "Both operations are rolled back so neither change persists",
      "The transaction resumes from the crash point after system restart",
      "The failed order insert is automatically retried without rollback",
    ],
    answer: 1,
    explanation: "Atomicity(원자성): 트랜잭션 내 모든 연산이 성공하거나, 하나라도 실패하면 전체가 롤백됩니다. 부분 성공 상태는 허용되지 않습니다.",
  },
  {
    id: 14,
    type: "multiple",
    topic: "BASE — Soft State",
    text: "In BASE, 'Soft State' means: (BASE에서 'Soft State'가 의미하는 것은?)",
    options: [
      "The system uses in-memory storage that resets on every restart",
      "Data is stored in a mutable compressed format on persistent disk",
      "System state may change over time without new input as replicas converge",
      "The schema is flexible and can be altered at runtime without migration",
    ],
    answer: 2,
    explanation: "Soft State: 새로운 입력이 없어도 복제본들이 수렴(convergence)하는 과정에서 시스템 상태가 변할 수 있습니다. 인메모리 스토리지나 스키마 유연성과는 무관합니다.",
  },
  {
    id: 15,
    type: "multiple",
    topic: "CAP 정리",
    text: "A distributed database rejects write requests during a network partition rather than risk serving stale data. Which CAP trade-off does this represent? (네트워크 파티션 시 오래된 데이터 제공을 피하려고 쓰기를 거부하는 DB의 CAP 선택은?)",
    options: [
      "AP system — availability is chosen over consistency",
      "CP system — consistency is chosen over availability",
      "CA system — both consistency and availability are maintained",
      "Full CAP — all three properties are achieved simultaneously",
    ],
    answer: 1,
    explanation: "쓰기를 거부하는 것은 가용성(A)을 포기하고 일관성(C)을 지키는 선택입니다 → CP 시스템. AP 시스템은 불일치를 허용하더라도 응답을 제공합니다.",
  },
  {
    id: 16,
    type: "multiple",
    topic: "Master-Slave Replication",
    text: "In Master-Slave replication, which node is solely responsible for handling write operations? (Master-Slave 복제에서 쓰기 연산을 전담하는 노드는?)",
    options: [
      "The slave node with the lowest current replication lag",
      "The master node, which exclusively handles all write operations",
      "Both master and slave nodes share write operations by round-robin",
      "A dedicated coordinator node that routes writes to available replicas",
    ],
    answer: 1,
    explanation: "Master-Slave: 마스터가 쓰기(write)를 전담하고, 슬레이브는 읽기(read)를 담당합니다. 마스터 장애 시 슬레이브 하나가 마스터로 승격(promote)됩니다.",
  },
  {
    id: 17,
    type: "multiple",
    topic: "Multi-Master Replication",
    text: "Multi-Master replication allows any node to accept writes, but introduces a fundamental challenge. What is it? (Multi-Master에서 어느 노드든 쓰기를 받을 수 있지만 발생하는 근본적인 문제는?)",
    options: [
      "Storage capacity becomes unevenly distributed across master nodes",
      "Read latency increases because clients must query all masters",
      "Maintaining consistency is difficult when concurrent writes conflict across nodes",
      "Network bandwidth requirements double for each additional master node",
    ],
    answer: 2,
    explanation: "Multi-Master의 핵심 도전: 여러 노드가 동시에 쓰기를 받으면 충돌이 발생할 수 있어 일관성 유지가 어렵습니다(Hard to keep consistency).",
  },

  // ── 18~26: 이해 ─────────────────────────────
  {
    id: 18,
    type: "multiple",
    topic: "메모리 최적화 / 데이터 타입",
    text: "A pipeline loads 50GB of integer data using Python's default int type, but RAM usage far exceeds expectations. What is the DIRECT cause? (Python 기본 int로 50GB 정수 데이터를 로드했을 때 RAM이 예상보다 훨씬 많이 소모되는 직접적 원인은?)",
    options: [
      "Python allocates a 64-byte fixed header for each numeric variable it stores",
      "Python int is a full object with properties and methods, using 28+ bytes instead of 4–8",
      "Python loads each integer twice to support its garbage collection mechanism",
      "Python stores integers as linked list nodes instead of contiguous array elements",
    ],
    answer: 1,
    explanation: "Python의 int는 동적 객체(속성, 메서드 포함)로 28바이트 이상을 사용합니다. int32/int64 같은 compact primitive type은 4~8바이트로 메모리를 대폭 절약합니다.",
  },
  {
    id: 19,
    type: "short",
    topic: "메모리 최적화 / 데이터 타입",
    text: "To reduce memory in Big Data pipelines, Python's default int objects should be replaced with what category of data types? (빅데이터 파이프라인 메모리 최적화를 위해 Python 기본 int 대신 사용해야 하는 데이터 타입 종류는?)",
    answer: ["compact primitive", "primitive", "compact", "int32", "int64", "원시 타입", "프리미티브"],
    explanation: "int32, int64 같은 compact primitive data type을 사용하면 Python 기본 객체 대비 메모리를 수 배 절약할 수 있습니다.",
  },
  {
    id: 20,
    type: "multiple",
    topic: "Vectorization",
    text: "Replacing a Python for-loop with a NumPy vectorized operation on a 10-million-element array reduces iteration from N steps to 1. The performance gain is primarily because: (Python for-loop을 NumPy 벡터화로 교체하면 N번 반복이 1번으로 줄어드는 이유는?)",
    options: [
      "NumPy runs the loop in a background thread to avoid blocking the main process",
      "NumPy automatically distributes the array across available GPU cores",
      "Element-wise iteration overhead is eliminated by a single CPU-level array instruction",
      "NumPy caches intermediate results in a Redis instance for reuse",
    ],
    answer: 2,
    explanation: "벡터화는 N번의 반복 오버헤드를 제거하고 단일 CPU 수준 명령으로 배열 전체에 연산을 적용합니다. 멀티스레딩이나 GPU, 캐싱과는 별개의 최적화입니다.",
  },
  {
    id: 21,
    type: "multiple",
    topic: "Vertical Scaling",
    text: "A startup upgrades its single database server from 64GB RAM to 256GB RAM to handle growing traffic. This approach is: (DB 서버 RAM을 64→256GB로 업그레이드하는 방식은?)",
    options: [
      "Horizontal Scaling — adding additional nodes to the existing cluster",
      "Functional Scaling — separating workloads across domain-specific servers",
      "Vertical Scaling — increasing the capacity of a single existing node",
      "Sharding — splitting data partitions across upgraded server instances",
    ],
    answer: 2,
    explanation: "Vertical Scaling(수직 확장)은 기존 서버의 사양을 높이는 방식입니다. 상한선이 존재하며 비용이 급격히 증가합니다. Horizontal Scaling은 서버를 추가하는 방식입니다.",
  },
  {
    id: 22,
    type: "multiple",
    topic: "Horizontal Scaling",
    text: "A platform adds five new database servers to distribute load instead of upgrading existing hardware. This strategy is: (기존 서버 업그레이드 대신 DB 서버 5대를 추가해 부하를 분산하는 전략은?)",
    options: [
      "Vertical Scaling — moving workloads to a more powerful single machine",
      "Functional Scaling — grouping workloads by feature domain across servers",
      "Horizontal Scaling — expanding capacity by adding more nodes to the pool",
      "Replication — copying data to offload read traffic from the primary node",
    ],
    answer: 2,
    explanation: "Horizontal Scaling(수평 확장)은 서버(노드)를 추가해 용량을 늘리는 방식입니다. 이론적으로 확장 상한이 없으며 클라우드 환경에서 주로 사용됩니다.",
  },
  {
    id: 23,
    type: "multiple",
    topic: "Functional Scaling",
    text: "A company splits its monolithic database into three separate databases: one for users, one for orders, one for products. This horizontal scaling technique is called: (단일 DB를 사용자·주문·상품 DB로 분리하는 수평 확장 기법을 무엇이라 하는가?)",
    options: [
      "Hash Sharding — rows are distributed using a hash function on a key",
      "Range Sharding — rows are partitioned by contiguous key value ranges",
      "Functional Scaling — data is separated by domain or functional group",
      "Replication — data is duplicated to separate read and write traffic",
    ],
    answer: 2,
    explanation: "Functional Scaling(기능적 확장)은 기능/도메인별로 DB를 분리합니다. Sharding은 동일 유형의 데이터를 여러 DB에 분산하는 것으로 서로 다른 개념입니다.",
  },
  {
    id: 24,
    type: "multiple",
    topic: "Hash Sharding vs Range Sharding",
    text: "Sequential user IDs are inserted continuously. Which sharding strategy is MORE prone to hotspot issues? (순차적 사용자 ID가 계속 삽입될 때 핫스팟 문제가 더 발생하기 쉬운 샤딩 전략은?)",
    options: [
      "Hash Sharding — the hash function clusters recent keys on the last node",
      "Range Sharding — all new sequential IDs concentrate on the highest-range shard",
      "Functional Scaling — all inserts target the user domain database exclusively",
      "Multi-Master — all masters compete for the same sequential ID writes",
    ],
    answer: 1,
    explanation: "Range Sharding에서 순차 ID는 가장 높은 범위의 샤드에 집중되어 핫스팟이 발생합니다. Hash Sharding은 해시 함수로 균등 분산하므로 이 문제를 완화합니다.",
  },
  {
    id: 25,
    type: "multiple",
    topic: "NoSQL vs RDBMS 선택",
    text: "An e-commerce platform has products with highly varying attributes (3 to 30 per product) and expects to scale to billions of records. Which approach fits BETTER? (속성 수가 3~30개로 다양한 상품 데이터를 수십억 건 저장할 e-commerce 플랫폼에 적합한 DB는?)",
    options: [
      "RDBMS with strict schema enforcement and vertical scaling strategy",
      "RDBMS with normalized relational tables and full ACID transaction support",
      "NoSQL with flexible schema designed for horizontal scaling from the start",
      "NoSQL with strong ACID guarantees enforced across all document collections",
    ],
    answer: 2,
    explanation: "스키마 유연성과 수평 확장이 필요한 경우 NoSQL이 적합합니다. RDBMS는 구조화된 관계형 데이터와 강한 일관성이 필요한 환경에 적합합니다.",
  },
  {
    id: 26,
    type: "multiple",
    topic: "Data Locality",
    text: "A Hadoop job sends computation tasks to the nodes where the data already resides, rather than copying data to a central processing node. This principle is: (Hadoop이 데이터를 중앙으로 이동하는 대신 데이터가 있는 노드에 연산을 보내는 원칙은?)",
    options: [
      "Caching — frequently accessed data blocks are stored near the CPU",
      "Data Locality — computation is scheduled where data already resides",
      "Sharding — data is distributed across nodes for parallel access patterns",
      "Replication — data copies are placed close to each processing node",
    ],
    answer: 1,
    explanation: "Data Locality: 데이터가 있는 위치에서 연산을 수행해 네트워크 전송 비용을 최소화합니다. 대용량 데이터를 네트워크로 이동시키는 것은 매우 비효율적입니다.",
  },

  // ── 27~34: 이해 심화 ────────────────────────
  {
    id: 27,
    type: "multiple",
    topic: "Memory Mapping",
    text: "Memory Mapping is used when a dataset exceeds available RAM. What does this technique actually do? (데이터셋이 RAM을 초과할 때 사용하는 Memory Mapping이 실제로 하는 것은?)",
    options: [
      "Compresses data in RAM so more records fit within available memory",
      "Distributes data across multiple RAM modules on different server nodes",
      "Maps storage addresses into the memory address space so storage acts like RAM",
      "Caches the most recently accessed data pages into the CPU L2 cache tier",
    ],
    answer: 2,
    explanation: "Memory Mapping은 스토리지의 특정 부분을 메모리 주소 공간에 매핑하여 마치 RAM처럼 사용합니다. 실제 RAM보다 느리지만 RAM 한계를 넘는 데이터 처리가 가능합니다.",
  },
  {
    id: 28,
    type: "multiple",
    topic: "Columnar Memory Layout",
    text: "A query computes the average salary across 10 million employee records. Which memory layout processes this FASTER, and why? (1천만 건 직원 레코드에서 평균 급여를 계산할 때 더 빠른 메모리 레이아웃과 이유는?)",
    options: [
      "Row layout — records are stored contiguously, enabling efficient sequential scans",
      "Row layout — all fields load together, reducing the total number of I/O calls",
      "Columnar layout — only the salary column is loaded, improving cache utilization",
      "Columnar layout — row-level locking is bypassed, reducing transaction overhead",
    ],
    answer: 2,
    explanation: "Columnar layout은 특정 컬럼(급여)만 메모리에 올리므로 불필요한 다른 필드를 읽지 않습니다. 분석/집계 쿼리에서 캐시 효율이 높습니다.",
  },
  {
    id: 29,
    type: "multiple",
    topic: "Binary Serialization",
    text: "Why is binary serialization preferred over JSON in high-throughput Big Data pipelines? (고처리량 빅데이터 파이프라인에서 JSON보다 바이너리 직렬화를 선호하는 이유는?)",
    options: [
      "Binary format is self-describing, making schema inference straightforward",
      "Binary format is human-readable, simplifying debugging and log inspection",
      "Binary is smaller and CPU-friendly, reducing parsing and transmission overhead",
      "Binary enforces strict type validation at write time, unlike JSON",
    ],
    answer: 2,
    explanation: "Binary는 JSON보다 크기가 작고 CPU가 직접 처리 가능한 형식이라 파싱 오버헤드와 네트워크 전송 비용이 낮습니다. 사람이 읽기 어렵다는 단점은 있습니다.",
  },
  {
    id: 30,
    type: "multiple",
    topic: "Lazy Evaluation",
    text: "In Spark, `df.filter(...).groupBy(...).agg(...)` does not execute until `.collect()` is called. This deferred execution strategy is: (Spark에서 .collect() 호출 전까지 실행되지 않는 지연 실행 전략은?)",
    options: [
      "Caching — intermediate results are stored until explicitly retrieved by the client",
      "Lazy Evaluation — execution is deferred until the result is actually needed",
      "Cost-Based Optimization — the engine waits to gather runtime statistics first",
      "Streaming — operations are queued and processed as micro-batches arrive",
    ],
    answer: 1,
    explanation: "Lazy Evaluation: 결과가 실제로 필요한 시점까지 실행을 미룹니다. 전체 쿼리 실행 계획을 미리 최적화하고 불필요한 중간 연산을 제거할 수 있습니다.",
  },
  {
    id: 31,
    type: "multiple",
    topic: "Cloud Services — IaaS",
    text: "A team rents virtual machines, storage volumes, and network components from a cloud provider to host their own application stack. This service model is: (가상 머신·스토리지·네트워크를 클라우드에서 빌려 자체 앱 스택을 올리는 서비스 모델은?)",
    options: [
      "SaaS — the provider delivers a fully managed end-user application",
      "PaaS — the provider manages the runtime environment and development tools",
      "IaaS — the provider supplies raw virtualized infrastructure components",
      "DaaS — the provider delivers managed data pipelines as a packaged service",
    ],
    answer: 2,
    explanation: "IaaS(Infrastructure as a Service): 가상 서버·스토리지·네트워크 등 인프라를 제공합니다. PaaS는 런타임/플랫폼, SaaS는 완성된 최종 사용자 앱입니다.",
  },
  {
    id: 32,
    type: "multiple",
    topic: "Cloud DB 장애 허용",
    text: "Which property makes Cloud DB fundamentally more fault-tolerant than a traditional on-site database? (Cloud DB가 전통적인 온사이트 DB보다 장애 허용성이 근본적으로 높은 이유는?)",
    options: [
      "Cloud DB uses faster NVMe storage installed on dedicated physical hardware",
      "Cloud DB runs a more stable OS kernel with fewer potential failure points",
      "Cloud DB automatically replicates data across geographically distributed nodes",
      "Cloud DB enforces stricter access controls that prevent most data corruption",
    ],
    answer: 2,
    explanation: "Cloud DB는 지리적으로 분산된 노드에 데이터를 자동 복제하므로 단일 장애점(SPOF)이 없습니다. 스토리지 종류나 OS 신뢰성은 본질적 차이가 아닙니다.",
  },
  {
    id: 33,
    type: "short",
    topic: "쿼리 최적화 — Cost-Based",
    text: "What Spark SQL command collects table and column-level statistics for the Cost-Based Optimizer? (비용 기반 최적화기가 사용하는 테이블·컬럼 통계를 수집하는 Spark SQL 명령어는?)",
    answer: ["ANALYZE TABLE", "analyze table"],
    explanation: "ANALYZE TABLE은 테이블·컬럼 단위 통계를 수집하여 Cost-Based Optimizer(CBO)가 더 효율적인 실행 계획을 선택할 수 있도록 합니다.",
  },
  {
    id: 34,
    type: "multiple",
    topic: "ISO 16363",
    text: "ISO 16363 is mentioned in the context of distributed storage. Its primary purpose is: (분산 스토리지 맥락에서 언급된 ISO 16363의 주요 목적은?)",
    options: [
      "Defining the minimum shard count for distributed database deployments",
      "Standardizing node-to-node communication protocols in clustered systems",
      "Ensuring technical integrity for replicated digital storage systems",
      "Certifying cloud providers meet data residency compliance requirements",
    ],
    answer: 2,
    explanation: "ISO 16363은 복제 스토리지의 기술적 무결성(Technical Integrity)을 보장하는 표준입니다. 강의에서 Replica 무결성 보장 맥락에서 언급되었습니다.",
  },

  // ── 35~40: 활용 (연결·응용) ─────────────────
  {
    id: 35,
    type: "multiple",
    topic: "CAP + 설계 선택",
    text: "A banking system must never display an outdated balance, even if it means rejecting requests during a network partition. Which CAP configuration applies? (잔액 오표시를 절대 허용하지 않으며 파티션 시 요청을 거부하는 뱅킹 시스템의 CAP 설정은?)",
    options: [
      "AP system — availability and partition tolerance take priority over consistency",
      "CA system — consistency and availability are both maintained without partition concern",
      "CP system — consistency and partition tolerance take priority over availability",
      "Full CAP — all three properties are simultaneously satisfied by design",
    ],
    answer: 2,
    explanation: "일관성이 최우선이고 파티션 시 가용성을 포기하는 것이 CP 시스템입니다. CA 시스템은 실제 분산 환경에서 파티션 허용을 무시할 수 없어 이론적으로만 존재합니다.",
  },
  {
    id: 36,
    type: "multiple",
    topic: "ACID + Cross-Shard 트랜잭션",
    text: "A transaction must atomically debit Account A on Shard 1 and credit Account B on Shard 2. Why is this architecturally difficult? (샤드 1의 계좌 A 출금과 샤드 2의 계좌 B 입금을 원자적으로 처리하기 어려운 이유는?)",
    options: [
      "Hash sharding cannot store financial account data by its design constraints",
      "Shard 1 and Shard 2 use incompatible storage engines in most deployments",
      "Ensuring atomicity across separate nodes requires complex distributed transaction protocols",
      "Cross-shard network latency exceeds the maximum allowed transaction timeout window",
    ],
    answer: 2,
    explanation: "Cross-shard 원자성 보장은 2PC(Two-Phase Commit) 같은 복잡한 분산 트랜잭션 프로토콜이 필요합니다. 단순히 네트워크 지연이나 스토리지 엔진 차이의 문제가 아닙니다.",
  },
  {
    id: 37,
    type: "multiple",
    topic: "BASE + Eventually Consistent",
    text: "After posting a tweet, the user refreshes their feed and it does not appear for 3 seconds. Which BASE properties explain this behavior? (트윗 게시 후 3초간 피드에 안 보이는 현상을 설명하는 BASE 속성은?)",
    options: [
      "Basically Available only — the system remains responsive despite the temporary gap",
      "Soft State only — the replica has not yet received the update and lags behind",
      "Eventually Consistent only — all replicas will converge to the latest value",
      "Soft State and Eventually Consistent — the replica lags but will converge over time",
    ],
    answer: 3,
    explanation: "복제본이 아직 업데이트를 받지 못한 상태(Soft State)이며, 시간이 지나면 모든 복제본이 동일한 값으로 수렴(Eventually Consistent)합니다. 두 속성이 함께 이 현상을 설명합니다.",
  },
  {
    id: 38,
    type: "multiple",
    topic: "최적화 비교",
    text: "Which change has the LEAST impact on performance when processing 1TB of numeric data in Python? (Python으로 1TB 수치 데이터를 처리할 때 성능 향상에 기여가 가장 작은 변경은?)",
    options: [
      "Replacing Python int objects with int32 compact primitive types throughout",
      "Converting for-loops to vectorized NumPy array operations",
      "Renaming all variable names to shorter single-character identifiers",
      "Using Memory Mapping to handle data that exceeds available RAM capacity",
    ],
    answer: 2,
    explanation: "변수명 변경은 성능에 영향을 주지 않습니다. int32 타입 변환(메모리 최적화), 벡터화(연산 최적화), Memory Mapping(용량 최적화)은 모두 실질적 성능 향상을 가져옵니다.",
  },
  {
    id: 39,
    type: "multiple",
    topic: "분산 시스템 전체 설계",
    text: "A global social platform processes 5TB of posts per day, needs 99.99% uptime, and can tolerate a 2-second propagation delay. Which architecture is MOST appropriate? (일 5TB, 99.99% 가동률, 2초 전파 지연 허용 소셜 플랫폼에 가장 적합한 아키텍처는?)",
    options: [
      "Single on-site RDBMS with ACID transactions and vertical scaling to handle load",
      "Cloud NoSQL with AP configuration, horizontal sharding, and streaming ingestion",
      "On-site CP database with synchronous replication enforced across all regions",
      "Cloud IaaS with a single master database and read-only regional slave replicas",
    ],
    answer: 1,
    explanation: "①Cloud NoSQL(AP): 고가용성·확장성, ②수평 샤딩: 5TB 처리, ③Streaming: 실시간 수집. 2초 지연 허용은 Eventually Consistent(BASE)와 일치합니다. 단일 마스터나 온사이트는 99.99% SLA 달성이 어렵습니다.",
  },
  {
    id: 40,
    type: "multiple",
    topic: "전범위 종합",
    text: "A team migrates from on-site PostgreSQL to a cloud-based distributed NoSQL system. Which trade-off must they explicitly accept? (온사이트 PostgreSQL에서 클라우드 분산 NoSQL로 마이그레이션 시 명시적으로 감수해야 하는 트레이드오프는?)",
    options: [
      "Higher long-term hardware costs in exchange for greater query expressiveness",
      "Loss of horizontal scalability in exchange for simpler day-to-day operations",
      "Weaker ACID guarantees in exchange for higher scalability and availability",
      "Increased network latency in exchange for stronger per-record consistency",
    ],
    answer: 2,
    explanation: "NoSQL로의 전환은 ACID(강한 일관성)를 BASE(약한 일관성)로 교환하고 대신 확장성·가용성을 얻는 트레이드오프입니다. 'NoSQL is not better — it trades ACID for scalability'가 핵심입니다.",
  },
];