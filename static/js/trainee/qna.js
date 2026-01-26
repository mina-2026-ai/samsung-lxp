


        // <!-- =========================
        //     JS 1) qna.js
        //     - store, 리스트/필터/페이지네이션
        //     - 제목 클릭 시 상세 오픈 이벤트 발행
        // ========================= -->
        
        (function () {
        const PAGE_SIZE = 8;

        const mockCourses = [
            { id: 'c01', name: '풀스택 웹 개발 (React & Node.js)', sessions: [
            { id:'s01', name:'1차시' }, { id:'s02', name:'2차시' }, { id:'s03', name:'3차시' }, { id:'s04', name:'4차시' }
            ]},
            { id: 'c02', name: '데이터 분석 입문 (Python)', sessions: [
            { id:'s11', name:'1차시' }, { id:'s12', name:'2차시' }, { id:'s13', name:'3차시' }
            ]}
        ];

        window.QNA_STORE = window.QNA_STORE || {
            courses: mockCourses,
            items: [
            {
                id:'q24', no:24, status:'answered', category:'학습내용',
                title:'for문 조건이 헷갈려요', body:'for문에서 조건식이 언제 평가되는지 헷갈립니다.\n예시로 설명 부탁드려요.',
                courseId:'c01', courseName:'풀스택 웹 개발 (React & Node.js)',
                sessionId:'s03', sessionName:'3차시',
                createdAt:'2026-01-25', views:18, visibility:'course',
                answer:{ body:'for문은 (초기화 → 조건 검사 → 본문 → 증감 → 조건 검사…) 순서로 반복돼요.\n조건식은 “반복 진입 전” 매 회차마다 평가됩니다.', author:'튜터', createdAt:'2026-01-25' }
            },
            {
                id:'q23', no:23, status:'pending', category:'기술',
                title:'node 설치 오류가 나요', body:'node 설치 후 터미널에서 node -v 입력하면 인식이 안됩니다.\n윈도우 환경입니다.',
                courseId:'c01', courseName:'풀스택 웹 개발 (React & Node.js)',
                sessionId:'s01', sessionName:'1차시',
                createdAt:'2026-01-24', views:7, visibility:'private',
                answer:null
            },
            {
                id:'q22', no:22, status:'answered', category:'과제',
                title:'과제 제출 링크가 어디있나요?', body:'과제 제출 버튼 위치를 못 찾겠어요.\n어디서 제출하나요?',
                courseId:'c02', courseName:'데이터 분석 입문 (Python)',
                sessionId:'s12', sessionName:'2차시',
                createdAt:'2026-01-23', views:11, visibility:'course',
                answer:{ body:'“학습 > 과제” 탭에서 해당 과제를 선택한 뒤, 하단의 “제출하기” 버튼으로 진행해요.', author:'담당자', createdAt:'2026-01-23' }
            }
            ]
        };

        const fCourse = document.getElementById('fCourse');
        const fSession = document.getElementById('fSession');
        const fStatus = document.getElementById('fStatus');
        const fCategory = document.getElementById('fCategory');
        const fKeyword = document.getElementById('fKeyword');

        const btnSearch = document.getElementById('btnSearch');
        const btnReset = document.getElementById('btnReset');
        const filterHint = document.getElementById('filterHint');

        const tbody = document.getElementById('qnaTbody');
        const pagination = document.getElementById('pagination');

        let currentPage = 1;
        let filtered = [];

        function escapeText(s) {
            return String(s)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
        }
        function statusLabel(status) {
            return status === 'answered' ? '답변완료' : '답변대기';
        }

        function renderCourseSelect(selectEl, includeAll) {
            const base = includeAll ? `<option value="">전체</option>` : `<option value="">선택</option>`;
            const opts = window.QNA_STORE.courses
            .map(c => `<option value="${c.id}">${escapeText(c.name)}</option>`)
            .join('');
            selectEl.innerHTML = base + opts;
        }

        function renderSessionSelect(selectEl, courseId, includeAll) {
            const course = window.QNA_STORE.courses.find(c => c.id === courseId);
            const base = includeAll ? `<option value="">전체</option>` : `<option value="">선택(선택)</option>`;
            if (!course) {
            selectEl.innerHTML = base;
            selectEl.disabled = true;
            return;
            }
            const opts = course.sessions.map(s => `<option value="${s.id}">${escapeText(s.name)}</option>`).join('');
            selectEl.innerHTML = base + opts;
            selectEl.disabled = false;
        }

        function applyFilters() {
            const courseId = fCourse.value;
            const sessionId = fSession.value;
            const status = fStatus.value;
            const category = fCategory.value;
            const keyword = fKeyword.value.trim().toLowerCase();

            filtered = window.QNA_STORE.items.filter(item => {
            if (courseId && item.courseId !== courseId) return false;
            if (sessionId && item.sessionId !== sessionId) return false;
            if (status && item.status !== status) return false;
            if (category && item.category !== category) return false;

            if (keyword) {
                const hay = (item.title + ' ' + item.body).toLowerCase();
                if (!hay.includes(keyword)) return false;
            }
            return true;
            });

            filtered.sort((a, b) => b.no - a.no);
            currentPage = 1;

            renderTable();
            renderPagination();
            filterHint.textContent = `전체 ${filtered.length}건`;
        }

        function renderTable() {
            const start = (currentPage - 1) * PAGE_SIZE;
            const pageItems = filtered.slice(start, start + PAGE_SIZE);

            if (!pageItems.length) {
            tbody.innerHTML = `
                <tr>
                <td colspan="7" style="padding:28px;text-align:center;color:#777;">
                    검색 결과가 없어요.
                </td>
                </tr>
            `;
            return;
            }

            tbody.innerHTML = pageItems.map(item => `
            <tr>
                <td>${item.no}</td>
                <td><span class="status ${item.status}">${statusLabel(item.status)}</span></td>
                <td>${escapeText(item.category)}</td>
                <td>
                <a href="javascript:void(0)" class="title-link" data-open-detail="${item.id}">
                    ${escapeText(item.title)}
                </a>
                </td>
                <td>${escapeText(item.courseName)} / ${escapeText(item.sessionName || '-')}</td>
                <td>${escapeText(item.createdAt)}</td>
                <td>${item.views}</td>
            </tr>
            `).join('');
        }

        function renderPagination() {
            const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
            if (totalPages === 1) {
            pagination.innerHTML = '';
            return;
            }

            const btns = [];
            const maxShow = 7;
            let start = Math.max(1, currentPage - 3);
            let end = Math.min(totalPages, start + (maxShow - 1));
            start = Math.max(1, end - (maxShow - 1));

            btns.push(`<button class="page-btn" data-page="${Math.max(1, currentPage - 1)}">‹</button>`);
            for (let p = start; p <= end; p++) {
            btns.push(`<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`);
            }
            btns.push(`<button class="page-btn" data-page="${Math.min(totalPages, currentPage + 1)}">›</button>`);

            pagination.innerHTML = btns.join('');
        }

        function bindEvents() {
            fCourse.addEventListener('change', () => {
            renderSessionSelect(fSession, fCourse.value, true);
            fSession.value = '';
            applyFilters();
            });
            fSession.addEventListener('change', applyFilters);
            fStatus.addEventListener('change', applyFilters);
            fCategory.addEventListener('change', applyFilters);

            btnSearch.addEventListener('click', applyFilters);
            fKeyword.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') applyFilters();
            });

            btnReset.addEventListener('click', () => {
            fCourse.value = '';
            renderSessionSelect(fSession, '', true);
            fSession.value = '';
            fStatus.value = '';
            fCategory.value = '';
            fKeyword.value = '';
            applyFilters();
            });

            // ✅ 제목 클릭 시에만 상세 모달 오픈 이벤트 발행
            tbody.addEventListener('click', (e) => {
            const a = e.target.closest('[data-open-detail]');
            if (!a) return;
            const id = a.getAttribute('data-open-detail');
            window.dispatchEvent(new CustomEvent('qna:openDetail', { detail: { id } }));
            });

            pagination.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-page]');
            if (!btn) return;
            const p = Number(btn.getAttribute('data-page'));
            if (!Number.isFinite(p)) return;
            currentPage = p;
            renderTable();
            renderPagination();
            });

            // Ask 모달에서 새 글 생성됨
            window.addEventListener('qna:created', (e) => {
            const item = e.detail?.item;
            if (!item) return;
            window.QNA_STORE.items.unshift(item);
            applyFilters();
            window.dispatchEvent(new CustomEvent('qna:openDetail', { detail: { id: item.id } }));
            });

            // 상세 모달에서 조회수 증가 등 -> 리스트 갱신
            window.addEventListener('qna:dataUpdated', () => {
            renderTable();
            });
        }

        function init() {
            renderCourseSelect(fCourse, true);
            renderSessionSelect(fSession, '', true);
            filtered = [...window.QNA_STORE.items].sort((a, b) => b.no - a.no);
            applyFilters();
            bindEvents();
        }

        init();
        })();
        


        // <!-- =========================
        //     JS 2) qna-ask-modal.js
        //     - 질문하기 모달 오픈/닫기/등록
        // ========================= -->
        
        (function () {
        const askModal = document.getElementById('askModal');
        const btnOpenAsk = document.getElementById('btnOpenAsk');

        const aCourse = document.getElementById('aCourse');
        const aSession = document.getElementById('aSession');
        const aCategory = document.getElementById('aCategory');
        const aVisibility = document.getElementById('aVisibility');
        const aTitle = document.getElementById('aTitle');
        const aBody = document.getElementById('aBody');
        const titleCount = document.getElementById('titleCount');
        const askError = document.getElementById('askError');
        const btnSubmitAsk = document.getElementById('btnSubmitAsk');

        function escapeText(s) {
            return String(s)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
        }

        function openModal(el) {
            el.classList.add('open');
            el.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
        function closeModal(el) {
            el.classList.remove('open');
            el.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function renderCourseSelect() {
            const opts = window.QNA_STORE.courses
            .map(c => `<option value="${c.id}">${escapeText(c.name)}</option>`)
            .join('');
            aCourse.innerHTML = `<option value="">선택</option>` + opts;
        }

        function renderSessionSelect(courseId) {
            const course = window.QNA_STORE.courses.find(c => c.id === courseId);
            if (!course) {
            aSession.innerHTML = `<option value="">선택(선택)</option>`;
            aSession.disabled = true;
            return;
            }
            const opts = course.sessions.map(s => `<option value="${s.id}">${escapeText(s.name)}</option>`).join('');
            aSession.innerHTML = `<option value="">선택(선택)</option>` + opts;
            aSession.disabled = false;
        }

        function resetAskForm() {
            aCourse.value = '';
            renderSessionSelect('');
            aSession.value = '';
            aCategory.value = '학습내용';
            aVisibility.value = 'private';
            aTitle.value = '';
            aBody.value = '';
            titleCount.textContent = '0 / 80';
            askError.hidden = true;
            askError.textContent = '';
            btnSubmitAsk.disabled = false;
        }

        function showAskError(msg) {
            askError.hidden = false;
            askError.textContent = msg;
        }

        function makeNewItem() {
            const courseId = aCourse.value;
            const sessionId = aSession.value;
            const category = aCategory.value;
            const visibility = aVisibility.value;
            const title = aTitle.value.trim();
            const body = aBody.value.trim();

            if (!courseId) return { error: '과정을 선택해주세요.' };
            if (!title) return { error: '제목을 입력해주세요.' };
            if (!body) return { error: '내용을 입력해주세요.' };

            const course = window.QNA_STORE.courses.find(c => c.id === courseId);
            const session = course?.sessions.find(s => s.id === sessionId);

            const nextNo = (window.QNA_STORE.items.reduce((max, x) => Math.max(max, x.no), 0) || 0) + 1;

            const today = new Date();
            const createdAt = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

            return {
            item: {
                id: 'q' + nextNo,
                no: nextNo,
                status: 'pending',
                category,
                title,
                body,
                courseId,
                courseName: course ? course.name : '-',
                sessionId: sessionId || '',
                sessionName: session ? session.name : '-',
                createdAt,
                views: 0,
                visibility,
                answer: null
            }
            };
        }

        function submitAsk() {
            askError.hidden = true;

            const { item, error } = makeNewItem();
            if (error) return showAskError(error);

            closeModal(askModal);
            window.dispatchEvent(new CustomEvent('qna:created', { detail: { item } }));
        }

        function bindClose() {
            askModal.addEventListener('click', (e) => {
            if (e.target === askModal) closeModal(askModal);
            });
            askModal.querySelectorAll('[data-close="askModal"]').forEach(btn => {
            btn.addEventListener('click', () => closeModal(askModal));
            });
        }

        function bindEvents() {
            btnOpenAsk.addEventListener('click', () => {
            resetAskForm();
            openModal(askModal);
            aCourse.focus();
            });

            aCourse.addEventListener('change', () => {
            renderSessionSelect(aCourse.value);
            aSession.value = '';
            });

            aTitle.addEventListener('input', () => {
            titleCount.textContent = `${aTitle.value.length} / 80`;
            });

            btnSubmitAsk.addEventListener('click', submitAsk);

            document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && askModal.classList.contains('open')) closeModal(askModal);
            });
        }

        function init() {
            renderCourseSelect();
            renderSessionSelect('');
            bindClose();
            bindEvents();
        }

        init();
        })();
        


        // <!-- =========================
        //     JS 3) qna-detail-modal.js
        //     - 상세 모달 오픈/닫기/렌더링
        // ========================= -->
        
        (function () {
        const detailModal = document.getElementById('detailModal');

        const dTitle = document.getElementById('dTitle');
        const dStatus = document.getElementById('dStatus');
        const dCategory = document.getElementById('dCategory');
        const dVisibility = document.getElementById('dVisibility');
        const dMeta = document.getElementById('dMeta');
        const dBody = document.getElementById('dBody');

        const answerCard = document.getElementById('answerCard');
        const pendingCard = document.getElementById('pendingCard');
        const dAnswerMeta = document.getElementById('dAnswerMeta');
        const dAnswerBody = document.getElementById('dAnswerBody');

        function statusLabel(status) {
            return status === 'answered' ? '답변완료' : '답변대기';
        }
        function visibilityLabel(v) {
            return v === 'course' ? '과정공유' : '나만보기';
        }

        function openModal(el) {
            el.classList.add('open');
            el.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
        function closeModal(el) {
            el.classList.remove('open');
            el.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function paintStatus(status) {
            dStatus.textContent = statusLabel(status);
            if (status === 'answered') {
            dStatus.style.background = '#eaf2ff';
            dStatus.style.borderColor = '#cfe0ff';
            dStatus.style.color = '#1f4aa8';
            } else {
            dStatus.style.background = '#fff2e6';
            dStatus.style.borderColor = '#ffd9b3';
            dStatus.style.color = '#9a4b00';
            }
        }

        function openDetailById(id) {
            const item = window.QNA_STORE.items.find(x => x.id === id);
            if (!item) return;

            item.views += 1; // 조회수 증가

            dTitle.textContent = item.title;
            paintStatus(item.status);
            dCategory.textContent = item.category;
            dVisibility.textContent = visibilityLabel(item.visibility);
            dMeta.textContent = `${item.courseName} · ${item.sessionName || '-'} · 작성일 ${item.createdAt} · 조회 ${item.views}`;
            dBody.textContent = item.body;

            if (item.answer) {
            pendingCard.hidden = true;
            answerCard.hidden = false;
            dAnswerMeta.textContent = `${item.answer.author} · ${item.answer.createdAt}`;
            dAnswerBody.textContent = item.answer.body;
            } else {
            answerCard.hidden = true;
            pendingCard.hidden = false;
            dAnswerMeta.textContent = '';
            dAnswerBody.textContent = '';
            }

            window.dispatchEvent(new CustomEvent('qna:dataUpdated')); // 리스트 갱신 요청
            openModal(detailModal);
        }

        function bindClose() {
            detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) closeModal(detailModal);
            });
            detailModal.querySelectorAll('[data-close="detailModal"]').forEach(btn => {
            btn.addEventListener('click', () => closeModal(detailModal));
            });
        }

        function bindEvents() {
            // ✅ qna.js가 발행한 이벤트를 받아 모달 오픈
            window.addEventListener('qna:openDetail', (e) => {
            const id = e.detail?.id;
            if (!id) return;
            openDetailById(id);
            });

            document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && detailModal.classList.contains('open')) closeModal(detailModal);
            });
        }

        bindClose();
        bindEvents();
        })();
