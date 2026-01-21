// 더미 데이터 예시 (실제 사용시 fetch로 대체)
const dummyNotices = [
  {
    id: 1,
    title: '2026년 1월 교육 일정 안내',
    date: '2026-01-10',
    content: '2026년 1월 교육 일정이 확정되었습니다. 자세한 내용은 첨부파일을 참고하세요.'
  },
  {
    id: 2,
    title: '시스템 점검 안내',
    date: '2026-01-05',
    content: '1월 15일(목) 00:00~06:00 시스템 점검이 예정되어 있습니다.'
  },
  {
    id: 3,
    title: '신규 과정 오픈',
    date: '2026-01-02',
    content: 'AI 엔지니어링 신규 과정이 오픈되었습니다.'
  }
];

// 공지사항 목록 렌더링 함수
function renderNotices(notices) {
  const main = document.querySelector('#spa-main');
  let listSection = document.getElementById('notice-list-section');
  if (!listSection) {
    listSection = document.createElement('section');
    listSection.id = 'notice-list-section';
    listSection.className = 'main-content';
    main.appendChild(listSection);
  }
  listSection.innerHTML = `
    <div class="main-wrap">
      <table class="basic-table" style="width:100%;margin-top:24px;">
        <thead>
          <tr>
            <th style="width:60%">제목</th>
            <th style="width:20%">등록일</th>
          </tr>
        </thead>
        <tbody>
          ${notices.map(n => `
            <tr class="notice-row" data-id="${n.id}">
              <td class="notice-title">${n.title}</td>
              <td>${n.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div id="notice-detail" style="margin-top:32px;"></div>
    </div>
  `;

  // 클릭 이벤트로 상세 표시
  listSection.querySelectorAll('.notice-row').forEach(row => {
    row.addEventListener('click', function() {
      const notice = notices.find(n => n.id == row.dataset.id);
      showNoticeDetail(notice);
    });
  });
}

// 상세 내용 표시 함수
function showNoticeDetail(notice) {
  const detailDiv = document.getElementById('notice-detail');
  if (!notice) {
    detailDiv.innerHTML = '';
    return;
  }
  detailDiv.innerHTML = `
    <div class="notice-detail-box" style="border:1px solid #eee;padding:24px 18px;border-radius:8px;">
      <h3 style="margin-bottom:8px;">${notice.title}</h3>
      <div style="color:#888;font-size:13px;margin-bottom:16px;">${notice.date}</div>
      <div style="font-size:15px;">${notice.content}</div>
    </div>
  `;
}

// SPA 라우터 환경에서 동작 보장: DOMContentLoaded 또는 라우터 삽입 후 호출 필요
function initNoticePage() {
  renderNotices(dummyNotices);
}

// 자동 실행 (SPA 라우터 환경이면 라우터에서 initNoticePage를 직접 호출해야 함)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNoticePage);
} else {
  initNoticePage();
}
