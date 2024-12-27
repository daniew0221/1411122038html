// 取得按鈕
const backToTopButton = document.getElementById('back-to-top');

// 當頁面滾動時，顯示或隱藏按鈕 //400是像素
window.onscroll = function() {
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        backToTopButton.style.display = 'block';  // 顯示按鈕
    } else {
        backToTopButton.style.display = 'none';   // 隱藏按鈕
    }
};

// 當按鈕被點擊時，滾動到頁面的最上方
backToTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});