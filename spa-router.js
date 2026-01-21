// spa-router.js
// 삼성LXP 트레이니 SPA 라우터

const routes = {
  '/dashboard': 'trainee-01-dashboard/dashboard.html',
  '/myCourse': 'trainee-02-myCourse/myCourse.html',
  '/continue-learning': 'trainee-02-myCourse/continue-learning.html',
  '/learning-report': 'trainee-02-myCourse/learning-report.html',
  '/theory-learning': 'trainee-03-learningContents/theory-learning.html',
  '/learning': 'trainee-03-learningContents/learning-video.html',
  '/practice-ide': 'trainee-03-learningContents/practice-ide.html',
  '/coding-setup': 'trainee-03-learningContents/coding-setup.html',
  '/online-test': 'trainee-04-test/online-test.html',
  '/assignments': 'trainee-04-test/assignments.html',
  '/ai-assistant': 'trainee-05-learningSupport/ai-assistant.html',
  '/tutoring-qna': 'trainee-05-learningSupport/tutoring-qna.html',
  '/notices': 'trainee-06-notice/notices.html',
  '/chat': 'trainee-06-notice/chat.html',
  '/attendance': 'trainee-07-attendance/attendance.html',
  '/completion-management': 'trainee-07-attendance/completion-management.html',
  '/surveys': 'trainee-07-attendance/surveys.html',
  
};

function navigate(path) {
  const file = routes[path];
  if (file) {
    fetch(file)
      .then(res => res.text())
      .then(html => {
        document.querySelector('#spa-main').innerHTML = html;
        window.history.pushState({}, '', path);
        // 페이지별 추가 스크립트 로드 및 초기화
        if (path === '/myCourse') {
          if (typeof initMyCourse === 'function') {
            initMyCourse();
          }
        }
        // 필요시 다른 페이지별 스크립트도 여기에 추가
        if (path === '/continue-learning') {
          if (typeof initContinueLearning === 'function') {
            initContinueLearning();
          }
        }
        if (path === '/notices') {
          if (typeof initNoticePage === 'function') {
            initNoticePage();
          }
        }
        if (path === '/practice-ide') {
          if (typeof initPracticeIDEPage === 'function') {
            initPracticeIDEPage();
          }
        }  
    })
        
      .catch(() => {
        document.querySelector('#spa-main').innerHTML = '<h2>페이지를 찾을 수 없습니다.</h2>';
      });
  } else {
    document.querySelector('#spa-main').innerHTML = '<h2>페이지를 찾을 수 없습니다.</h2>';
  }
}

function loadScript(src, callback) {
  // 이미 로드된 경우 중복 로드 방지
  if (document.querySelector('script[data-dynamic="' + src + '"]')) {
    if (callback) callback();
    return;
  }
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.setAttribute('data-dynamic', src);
  script.onload = () => { if (callback) callback(); };
  document.body.appendChild(script);
}

window.addEventListener('popstate', () => {
  navigate(window.location.pathname);
});

// 예시: 메뉴 클릭 시 navigate('/myCourse') 호출
// <div onclick="navigate('/myCourse')">나의 과정</div>
