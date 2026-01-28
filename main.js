document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const recommendBtn = document.getElementById('recommend-btn');
    const status = document.getElementById('status');
    const featuredCard = document.getElementById('featured-card');
    const featuredTitle = document.getElementById('featured-title');
    const featuredDesc = document.getElementById('featured-desc');
    const featuredMeta = document.getElementById('featured-meta');
    const altGrid = document.getElementById('alt-grid');

    const menuItems = [
        {
            title: '김치찌개 & 따끈한 밥',
            desc: '얼큰하면서도 포근한 국물로 하루 피로를 싹 풀어줘요.',
            emoji: '🍜',
            time: 30,
            budget: 'mid',
            spice: 'hot',
            vegetarian: false,
            seafood: false,
            moods: ['cozy', 'hearty']
        },
        {
            title: '버터 갈릭 새우 덮밥',
            desc: '짭짤 고소한 풍미로 기분 전환.',
            emoji: '🍤',
            time: 20,
            budget: 'mid',
            spice: 'mild',
            vegetarian: false,
            seafood: true,
            moods: ['light', 'crispy']
        },
        {
            title: '연어 포케',
            desc: '가볍고 산뜻한 한 그릇.',
            emoji: '🥗',
            time: 15,
            budget: 'mid',
            spice: 'mild',
            vegetarian: false,
            seafood: true,
            moods: ['light']
        },
        {
            title: '치킨 스테이크',
            desc: '겉바속촉, 단백질 든든.',
            emoji: '🍳',
            time: 30,
            budget: 'mid',
            spice: 'mild',
            vegetarian: false,
            seafood: false,
            moods: ['hearty', 'crispy']
        },
        {
            title: '두부 강된장 비빔밥',
            desc: '채소와 단백질을 한 번에.',
            emoji: '🥬',
            time: 25,
            budget: 'low',
            spice: 'medium',
            vegetarian: true,
            seafood: false,
            moods: ['cozy', 'light']
        },
        {
            title: '고추장 불고기',
            desc: '매콤달콤, 밥도둑 한 접시.',
            emoji: '🥩',
            time: 35,
            budget: 'mid',
            spice: 'medium',
            vegetarian: false,
            seafood: false,
            moods: ['hearty']
        },
        {
            title: '버섯 들깨탕',
            desc: '고소하고 포근한 따뜻함.',
            emoji: '🍲',
            time: 40,
            budget: 'low',
            spice: 'mild',
            vegetarian: true,
            seafood: false,
            moods: ['cozy']
        },
        {
            title: '핫윙 & 샐러드',
            desc: '바삭함과 상큼함의 조합.',
            emoji: '🍗',
            time: 25,
            budget: 'high',
            spice: 'hot',
            vegetarian: false,
            seafood: false,
            moods: ['crispy']
        },
        {
            title: '명란 크림 파스타',
            desc: '짭짤한 크림과 부드러운 면.',
            emoji: '🍝',
            time: 45,
            budget: 'high',
            spice: 'mild',
            vegetarian: false,
            seafood: true,
            moods: ['cozy']
        }
    ];

    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme') || 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    if (recommendBtn) {
        recommendBtn.addEventListener('click', () => {
            const filtered = filterMenus(menuItems);
            if (filtered.length === 0) {
                status.textContent = '조건에 맞는 메뉴가 없어요. 다른 조건으로 다시 골라주세요.';
                return;
            }

            const shuffled = [...filtered].sort(() => Math.random() - 0.5);
            updateFeatured(shuffled[0]);
            updateAlternatives(shuffled.slice(1, 3));
            status.textContent = `${filtered.length}개 중에서 추천했어요!`;
        });
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (!themeToggle) return;
        const label = themeToggle.querySelector('.theme-toggle__label');
        const icon = themeToggle.querySelector('.theme-toggle__icon');
        if (label) label.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
        if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }

    function filterMenus(items) {
        const mood = document.getElementById('mood').value;
        const time = document.getElementById('time').value;
        const budget = document.getElementById('budget').value;
        const spice = document.getElementById('spice').value;
        const vegetarian = document.getElementById('vegetarian').checked;
        const noSeafood = document.getElementById('no-seafood').checked;

        return items.filter((item) => {
            if (mood !== 'any' && !item.moods.includes(mood)) return false;
            if (budget !== 'any' && item.budget !== budget) return false;
            if (spice !== 'any' && item.spice !== spice) return false;
            if (vegetarian && !item.vegetarian) return false;
            if (noSeafood && item.seafood) return false;
            if (time !== 'any') {
                const limit = Number(time);
                if (limit === 45 && item.time < 45) return false;
                if (limit === 30 && item.time > 30) return false;
                if (limit === 15 && item.time > 15) return false;
            }
            return true;
        });
    }

    function updateFeatured(item) {
        if (!featuredCard || !featuredTitle || !featuredDesc || !featuredMeta) return;
        const emoji = featuredCard.querySelector('.featured__emoji');
        if (emoji) emoji.textContent = item.emoji;
        featuredTitle.textContent = item.title;
        featuredDesc.textContent = item.desc;
        featuredMeta.innerHTML = `
            <span>${formatTime(item.time)}</span>
            <span>${formatBudget(item.budget)}</span>
            <span>${formatSpice(item.spice)}</span>
        `;
    }

    function updateAlternatives(items) {
        if (!altGrid) return;
        altGrid.innerHTML = items
            .map((item) => {
                return `
                    <article class="alt-card">
                        <div class="alt-card__emoji">${item.emoji}</div>
                        <div>
                            <h4>${item.title}</h4>
                            <p>${item.desc}</p>
                        </div>
                    </article>
                `;
            })
            .join('');
    }

    function formatTime(minutes) {
        if (minutes >= 45) return '45분 이상';
        return `${minutes}분 이내`;
    }

    function formatBudget(level) {
        if (level === 'low') return '가벼운 예산';
        if (level === 'high') return '플렉스 예산';
        return '보통 예산';
    }

    function formatSpice(level) {
        if (level === 'mild') return '안 매운';
        if (level === 'hot') return '얼큰';
        return '적당히';
    }
});
