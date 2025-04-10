function redirectTo(page) {
    window.location.href = page + ".html";
}

//sidebar javascript fucntions
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const body = document.body;
const menuItems = document.querySelectorAll('.menu-item');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    body.classList.toggle('sidebar-collapsed');
});

menuItems.forEach(item => {
    item.addEventListener('click', function () {
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});
