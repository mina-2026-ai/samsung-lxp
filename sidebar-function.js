function toggleSidebar() {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');
    const logo = document.getElementById('sidebarLogo');
    
    body.classList.toggle('sidebar-collapsed');
    sidebar.classList.toggle('collapsed');
    toggleBtn.classList.toggle('collapsed');
    
    // 아이콘 변경
    if (body.classList.contains('sidebar-collapsed')) {
        toggleBtn.innerHTML = '▶';
        logo.src = '../imgs/amblem-white.png';
        logo.style.width = '30px';
    } else {
        toggleBtn.innerHTML = '◀';
        logo.src = '/logo-white.png';
        logo.style.width = '130px';
    }
}

function handleMenuClick(element, page) {
    const body = document.body;
    
    // 사이드바가 축소된 상태라면 페이지 이동
    if (body.classList.contains('sidebar-collapsed')) {
        event.stopPropagation(); // 이벤트 버블링 방지
        window.location.href = page;
    }
    // 사이드바가 펼쳐진 상태라면 서브메뉴가 있는 경우 아무 동작 안함
}