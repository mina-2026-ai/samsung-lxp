// assignments.js - 과제 목록, 필터, 상세/제출 모달 제어

// 더미 데이터 예시 (실제 서비스에서는 서버에서 받아옴)
const ASSIGNMENTS = [
  {
    id: 'a01',
    name: 'React 실습 과제',
    course: '풀스택 웹 개발',
    session: '3차시',
    status: '진행중',
    deadline: '2026-01-30',
    type: '파일',
    retake: '가능',
    desc: 'React로 TODO 앱을 구현하세요.',
    myStatus: '미제출',
    submit: null,
    grade: null
  },
  {
    id: 'a02',
    name: '파이썬 데이터 분석',
    course: '데이터 분석 입문',
    session: '2차시',
    status: '마감',
    deadline: '2026-01-20',
    type: '텍스트',
    retake: '불가',
    desc: 'Pandas로 데이터 통계 분석 결과를 제출하세요.',
    myStatus: '제출/채점완료',
    submit: { text: 'Pandas로 분석 결과를 정리했습니다.' },
    grade: { meta: '100점', feedback: '아주 잘했습니다!' }
  },
  {
    id: 'a03',
    name: 'HTML/CSS 미니 프로젝트',
    course: '웹 퍼블리싱',
    session: '1차시',
    status: '예정',
    deadline: '2026-02-10',
    type: '파일',
    retake: '가능',
    desc: '간단한 개인 포트폴리오 페이지를 만드세요.',
    myStatus: '미제출',
    submit: null,
    grade: null
  },
  {
    id: 'a04',
    name: 'SQL 쿼리 작성',
    course: '데이터베이스 기초',
    session: '4차시',
    status: '진행중',
    deadline: '2026-01-28',
    type: '텍스트',
    retake: '가능',
    desc: '주어진 테이블에서 원하는 데이터를 추출하는 쿼리를 작성하세요.',
    myStatus: '미제출',
    submit: null,
    grade: null
  },
  {
    id: 'a05',
    name: 'Node.js 서버 실습',
    course: '풀스택 웹 개발',
    session: '5차시',
    status: '마감',
    deadline: '2026-01-15',
    type: '파일',
    retake: '불가',
    desc: '간단한 REST API 서버를 구현하세요.',
    myStatus: '제출/채점중',
    submit: { text: '서버 코드와 설명을 첨부합니다.' },
    grade: null
  },
  {
    id: 'a06',
    name: '통계 분석 보고서',
    course: '데이터 분석 입문',
    session: '3차시',
    status: '진행중',
    deadline: '2026-02-01',
    type: '파일',
    retake: '가능',
    desc: '주어진 데이터를 분석하여 보고서를 작성하세요.',
    myStatus: '미제출',
    submit: null,
    grade: null
  }
];

// DOM
const cardList = document.getElementById('cardList');
const listHint = document.getElementById('listHint');
const fCourse = document.getElementById('fCourse');
const fSession = document.getElementById('fSession');
const fStatus = document.getElementById('fStatus');
const fSort = document.getElementById('fSort');
const fKeyword = document.getElementById('fKeyword');
const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');

// 모달
const detailModal = document.getElementById('detailModal');
const submitModal = document.getElementById('submitModal');

// 필터/정렬/검색
function filterAssignments() {
  let filtered = [...ASSIGNMENTS];
  if (fCourse.value) filtered = filtered.filter(a => a.course === fCourse.value);
  if (fSession.value) filtered = filtered.filter(a => a.session === fSession.value);
  if (fStatus.value) filtered = filtered.filter(a => a.status === fStatus.value);
  if (fKeyword.value.trim()) {
    const kw = fKeyword.value.trim().toLowerCase();
    filtered = filtered.filter(a => a.name.toLowerCase().includes(kw) || a.course.toLowerCase().includes(kw));
  }
  // 정렬
  if (fSort.value === 'deadline_soon') filtered.sort((a,b)=>a.deadline.localeCompare(b.deadline));
  if (fSort.value === 'deadline_late') filtered.sort((a,b)=>b.deadline.localeCompare(a.deadline));
  if (fSort.value === 'recent') filtered.sort((a,b)=>b.id.localeCompare(a.id));
  if (fSort.value === 'title') filtered.sort((a,b)=>a.name.localeCompare(b.name));
  return filtered;
}

function renderList() {
  const list = filterAssignments();
  cardList.innerHTML = list.length ? list.map(a => `
    <div class="card" data-id="${a.id}">
      <div class="card-title">${a.name}</div>
      <div class="card-meta">${a.course} / ${a.session}</div>
      <div class="card-status">상태: ${a.status}</div>
      <div class="card-deadline">마감: ${a.deadline}</div>
      <button class="btn btn-primary btn-detail" data-id="${a.id}">상세보기</button>
      ${a.status === '진행중' ? 
        `<button type="button" class="btn primary" data-open-assignment-modal>
          과제 제출하기(모달 열기)
        </button>` 
        : ''}
    </div>
  `).join('') : '<div class="empty">과제가 없습니다.</div>';
  listHint.textContent = `전체 ${list.length}건`;
}

// 상세 모달 열기
function openDetailModal(id) {
  const a = ASSIGNMENTS.find(x => x.id === id);
  if (!a) return;
  document.getElementById('dName').textContent = a.name;
  document.getElementById('dMeta').textContent = `${a.course} / ${a.session}`;
  document.getElementById('dStatus').textContent = a.status;
  document.getElementById('dType').textContent = a.type;
  document.getElementById('dWindow').textContent = a.deadline;
  document.getElementById('dRetake').textContent = a.retake;
  document.getElementById('dMyStatus').textContent = a.myStatus;
  document.getElementById('dDesc').textContent = a.desc;
  // 제출/채점 정보
  document.getElementById('submitBox').hidden = !a.submit;
  document.getElementById('gradeBox').hidden = !a.grade;
  if (a.submit) {
    document.getElementById('dSubmitMeta').textContent = a.myStatus;
    document.getElementById('dSubmitTextWrap').hidden = !a.submit.text;
    document.getElementById('dSubmitText').textContent = a.submit.text || '';
  }
  if (a.grade) {
    document.getElementById('dGradeMeta').textContent = a.grade.meta;
    document.getElementById('dGradeFeedback').textContent = a.grade.feedback;
  }
  detailModal.style.display = 'flex';
  detailModal.setAttribute('aria-hidden', 'false');
}

// 모달 닫기
function closeModal(modal) {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

document.addEventListener('DOMContentLoaded', function() {
  renderList();
  // 카드 상세보기 버튼

  // 모달 닫기
  document.querySelectorAll('[data-close="detailModal"]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(detailModal));
  });
  // 필터/검색
  btnSearch.addEventListener('click', renderList);
  btnReset.addEventListener('click', () => {
    fCourse.value = '';
    fSession.value = '';
    fStatus.value = '';
    fSort.value = 'deadline_soon';
    fKeyword.value = '';
    renderList();
  });
});

 /**
   * 과제 제출 모달
   * - 지원 제출유형: FILE / LINK / TEXT / FILE_TEXT
   * - 네 페이지에서 openAssignmentSubmitModal(data)로 호출 가능
   */

  // ===== DOM =====
  const asModalBackdrop = document.getElementById("asModalBackdrop");
  const asBtnClose = document.getElementById("asBtnClose");
  const asBtnBrowse = document.getElementById("asBtnBrowse");
  const asFileInput = document.getElementById("asFileInput");
  const asDropzone = document.getElementById("asDropzone");
  const asFileList = document.getElementById("asFileList");

  const asTitle = document.getElementById("asTitle");
  const asBadges = document.getElementById("asBadges");
  const asDue = document.getElementById("asDue");
  const asStatus = document.getElementById("asStatus");
  const asResubmit = document.getElementById("asResubmit");
  const asDesc = document.getElementById("asDesc");
  const asModalSub = document.getElementById("asModalSub");

  const asBlockFile = document.getElementById("asBlockFile");
  const asBlockLink = document.getElementById("asBlockLink");
  const asBlockText = document.getElementById("asBlockText");

  const asLinkInput = document.getElementById("asLinkInput");
  const asTextInput = document.getElementById("asTextInput");
  const asTextCount = document.getElementById("asTextCount");

  const asAlert = document.getElementById("asAlert");
  const asBtnDraft = document.getElementById("asBtnDraft");
  const asBtnSubmit = document.getElementById("asBtnSubmit");

  // ===== State =====
  let asCurrent = null;
  let asFiles = []; // {id, file}
  const TEXT_LIMIT = 5000;

  // ===== Helpers =====
  function asEscapeHtml(str){
    return String(str ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function asFormatBytes(bytes){
    if (typeof bytes !== "number") return "-";
    const units = ["B","KB","MB","GB"];
    let i = 0; let v = bytes;
    while (v >= 1024 && i < units.length - 1){ v /= 1024; i++; }
    return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)}${units[i]}`;
  }

  function asTypeLabel(type){
    switch(type){
      case "FILE": return "문서 제출";
      case "LINK": return "링크 제출";
      case "TEXT": return "텍스트 입력";
      case "FILE_TEXT": return "문서+텍스트";
      default: return "-";
    }
  }

  function asStatusLabel(v){
    // 예시 상태값 (너 시스템에 맞춰 바꿔도 됨)
    // NOT_SUBMITTED / SUBMITTED / GRADED
    if (v === "SUBMITTED") return "제출완료";
    if (v === "GRADED") return "채점완료";
    return "제출전";
  }

  function asShowAlert(msg){
    asAlert.style.display = "block";
    asAlert.textContent = msg;
  }

  function asHideAlert(){
    asAlert.style.display = "none";
    asAlert.textContent = "";
  }

  function asSetBlocks(type){
    // reset visibility
    asBlockFile.style.display = "none";
    asBlockLink.style.display = "none";
    asBlockText.style.display = "none";

    if (type === "FILE") asBlockFile.style.display = "block";
    if (type === "LINK") asBlockLink.style.display = "block";
    if (type === "TEXT") asBlockText.style.display = "block";
    if (type === "FILE_TEXT"){
      asBlockFile.style.display = "block";
      asBlockText.style.display = "block";
    }
  }

  function asRenderBadges(data){
    const type = data.submitType;
    const resubmit = !!data.allowResubmit;
    const submitted = data.status === "SUBMITTED";

    const typeBadge = `<span class="as-badge type">${asEscapeHtml(asTypeLabel(type))}</span>`;
    const stateBadge = submitted
      ? `<span class="as-badge state">제출됨</span>`
      : `<span class="as-badge warn">미제출</span>`;
    const resubmitBadge = resubmit
      ? `<span class="as-badge type">재제출 가능</span>`
      : `<span class="as-badge warn">재제출 불가</span>`;

    asBadges.innerHTML = typeBadge + stateBadge + resubmitBadge;
  }

  function asRenderFiles(){
    if (!asFiles.length){
      asFileList.innerHTML = `<div class="as-file-item"><div class="as-file-name">업로드된 파일이 없어요.</div><div class="as-file-meta">-</div></div>`;
      return;
    }

    asFileList.innerHTML = asFiles.map(item => `
      <div class="as-file-item" data-file-id="${item.id}">
        <div style="min-width:0;">
          <div class="as-file-name">${asEscapeHtml(item.file.name)}</div>
          <div class="as-file-meta">${asFormatBytes(item.file.size)}</div>
        </div>
        <div class="as-file-actions">
          <button type="button" class="as-mini-btn" data-remove-file="${item.id}">삭제</button>
        </div>
      </div>
    `).join("");

    asFileList.querySelectorAll("[data-remove-file]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-remove-file");
        asFiles = asFiles.filter(f => f.id !== id);
        asRenderFiles();
      });
    });
  }

  function asAddFiles(fileList){
    const files = Array.from(fileList || []);
    if (!files.length) return;

    // 간단 중복 제거(이름+사이즈)
    for (const f of files){
      const exists = asFiles.some(x => x.file.name === f.name && x.file.size === f.size);
      if (exists) continue;
      asFiles.push({ id: crypto.randomUUID(), file: f });
    }
    asRenderFiles();
  }

  function asValidate(){
    asHideAlert();
    if (!asCurrent) return false;

    const type = asCurrent.submitType;

    // 링크
    if (type === "LINK"){
      const url = (asLinkInput.value || "").trim();
      if (!url) return asShowAlert("링크를 입력해주세요."), false;
      try { new URL(url); } catch { return asShowAlert("올바른 URL 형식으로 입력해주세요."), false; }
      return true;
    }

    // 텍스트
    if (type === "TEXT"){
      const text = (asTextInput.value || "").trim();
      if (!text) return asShowAlert("텍스트 내용을 입력해주세요."), false;
      return true;
    }

    // 파일
    if (type === "FILE"){
      if (!asFiles.length) return asShowAlert("제출할 파일을 업로드해주세요."), false;
      return true;
    }

    // 파일+텍스트
    if (type === "FILE_TEXT"){
      if (!asFiles.length) return asShowAlert("제출할 파일을 업로드해주세요."), false;
      const text = (asTextInput.value || "").trim();
      if (!text) return asShowAlert("텍스트 내용을 입력해주세요."), false;
      return true;
    }

    return true;
  }

  // ===== Public API =====
  window.openAssignmentSubmitModal = function(assignmentData){
    // assignmentData 예시:
    // {
    //   id: "A-01",
    //   title: "과제 1 - API 문서 작성",
    //   dueAt: "2026-02-01 23:59",
    //   status: "NOT_SUBMITTED" | "SUBMITTED" | "GRADED",
    //   allowResubmit: true,
    //   submitType: "FILE" | "LINK" | "TEXT" | "FILE_TEXT",
    //   description: "과제 설명...\n제출 형식...",
    // }
    asCurrent = assignmentData || null;

    // reset inputs
    asFiles = [];
    asLinkInput.value = "";
    asTextInput.value = "";
    asTextCount.textContent = "0";
    asHideAlert();

    if (asCurrent){
      asTitle.textContent = asCurrent.title ?? "-";
      asDue.textContent = asCurrent.dueAt ?? "-";
      asStatus.textContent = asStatusLabel(asCurrent.status);
      asResubmit.textContent = asCurrent.allowResubmit ? "가능" : "불가";
      asDesc.textContent = asCurrent.description ?? "-";
      asModalSub.textContent = `${asCurrent.id ?? "-"} · ${asTypeLabel(asCurrent.submitType)}`;

      asRenderBadges(asCurrent);
      asSetBlocks(asCurrent.submitType);
    } else {
      asTitle.textContent = "-";
      asDue.textContent = "-";
      asStatus.textContent = "-";
      asResubmit.textContent = "-";
      asDesc.textContent = "-";
      asBadges.innerHTML = "";
      asSetBlocks("FILE");
    }

    asRenderFiles();

    asModalBackdrop.style.display = "flex";
    asModalBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  window.closeAssignmentSubmitModal = function(){
    asModalBackdrop.style.display = "none";
    asModalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    asCurrent = null;
  };

  // ===== Events =====
  asBtnClose.addEventListener("click", window.closeAssignmentSubmitModal);
  asModalBackdrop.addEventListener("click", (e) => {
    if (e.target === asModalBackdrop) window.closeAssignmentSubmitModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && asModalBackdrop.style.display === "flex") window.closeAssignmentSubmitModal();
  });

  asBtnBrowse.addEventListener("click", (e) => {
    e.preventDefault();
    asFileInput.click();
  });

  asFileInput.addEventListener("change", (e) => {
    asAddFiles(e.target.files);
    asFileInput.value = ""; // 같은 파일 다시 선택 가능하게
  });

  // Drag & drop
  ["dragenter","dragover"].forEach(evt => {
    asDropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      asDropzone.classList.add("dragover");
    });
  });
  ["dragleave","drop"].forEach(evt => {
    asDropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      asDropzone.classList.remove("dragover");
    });
  });
  asDropzone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files) asAddFiles(dt.files);
  });

  // Text count
  asTextInput.addEventListener("input", () => {
    let v = asTextInput.value || "";
    if (v.length > TEXT_LIMIT){
      v = v.slice(0, TEXT_LIMIT);
      asTextInput.value = v;
    }
    asTextCount.textContent = String(v.length);
  });

  // Draft/Submit (예시 동작)
  asBtnDraft.addEventListener("click", () => {
    asHideAlert();
    if (!asCurrent) return;

    const payload = {
      assignmentId: asCurrent.id,
      type: asCurrent.submitType,
      link: (asLinkInput.value || "").trim(),
      text: (asTextInput.value || "").trim(),
      files: asFiles.map(f => ({ name: f.file.name, size: f.file.size }))
    };

    // TODO: API 연결
    console.log("[임시저장 payload]", payload);
    alert("임시저장 완료(예시)");
  });

  asBtnSubmit.addEventListener("click", () => {
    if (!asCurrent) return;

    // 재제출 불가인데 이미 제출됨이면 막기(예시)
    if (asCurrent.status === "SUBMITTED" && !asCurrent.allowResubmit){
      return asShowAlert("이미 제출된 과제이며 재제출이 불가합니다.");
    }

    if (!asValidate()) return;

    const payload = {
      assignmentId: asCurrent.id,
      type: asCurrent.submitType,
      link: (asLinkInput.value || "").trim(),
      text: (asTextInput.value || "").trim(),
      files: asFiles.map(f => f.file) // 실제로는 FormData로 업로드
    };

    // TODO: API 연결 (FormData 권장)
    console.log("[제출 payload]", payload);
    alert("제출 완료(예시)");

    // 예시: 상태 업데이트
    asCurrent.status = "SUBMITTED";
    asStatus.textContent = asStatusLabel(asCurrent.status);
    asRenderBadges(asCurrent);
    window.closeAssignmentSubmitModal();
  });

  // ===== Demo: 예시 버튼 클릭시 오픈 =====
  document.querySelectorAll("[data-open-assignment-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      openAssignmentSubmitModal({
        id: "ASSIGN-001",
        title: "과제 1 - 연산자와 표현식 요약",
        dueAt: "2026-02-01 23:59",
        status: "NOT_SUBMITTED",
        allowResubmit: true,
        submitType: "FILE_TEXT", // FILE | LINK | TEXT | FILE_TEXT
        description:
          "아래 조건에 맞춰 과제를 제출하세요.\n" +
          "- 문서: PDF 1개 이상\n" +
          "- 텍스트: 요약 5줄 이상\n" +
          "- 파일명: [이름]_[과정]_[과제명].pdf"
      });
    });
  });