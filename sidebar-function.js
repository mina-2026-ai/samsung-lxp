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
    const submenu = element.querySelector('ul');
    
    // 서브메뉴가 있는 경우 토글
    if (submenu) {
        event.stopPropagation();
        
        // 다른 열린 서브메뉴 닫기
        const allMenuItems = document.querySelectorAll('.menu > ul > li');
        allMenuItems.forEach(item => {
            if (item !== element && item.querySelector('ul')) {
                item.classList.remove('open');
            }
        });
        
        // 현재 서브메뉴 토글
        element.classList.toggle('open');
    } else {
        // 서브메뉴가 없으면 페이지 이동
        event.stopPropagation();
        window.location.href = page;
    }
}