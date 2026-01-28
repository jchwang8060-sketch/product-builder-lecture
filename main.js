document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const recommendBtn = document.getElementById('recommend-btn');
    const status = document.getElementById('status');
    const featuredTitle = document.getElementById('featured-title');
    const featuredDesc = document.getElementById('featured-desc');
    const scheduleTable = document.getElementById('schedule-table');
    const altGrid = document.getElementById('alt-grid');
    const startDateInput = document.getElementById('start-date');
    const staffInput = document.getElementById('staff-input');
    const staffList = document.getElementById('staff-list');

    const staffNames = [];

    const today = new Date();
    if (startDateInput) {
        startDateInput.valueAsDate = today;
    }

    if (staffInput) {
        staffInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                addStaffFromInput();
            }
        });
        staffInput.addEventListener('blur', addStaffFromInput);
    }

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
            const config = getConfig();
            if (!config.valid) {
                status.textContent = config.message;
                return;
            }
            const schedule = buildSchedule(config);
            renderSchedule(schedule);
            renderSummary(schedule, config);
            status.textContent = `${config.days}일 스케줄을 생성했어요. (${config.wardLabel})`;
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

    function getConfig() {
        const ward = document.getElementById('ward');
        const startDate = document.getElementById('start-date').value;
        const nurseCount = Number(document.getElementById('nurse-count').value);
        const nightLimit = Number(document.getElementById('night-limit').value);
        const needDay = Number(document.getElementById('need-day').value);
        const needEvening = Number(document.getElementById('need-evening').value);
        const needNight = Number(document.getElementById('need-night').value);
        const needOff = Number(document.getElementById('need-off').value);
        const nightRest = document.getElementById('night-rest').checked;
        const weekendBalance = document.getElementById('weekend-balance').checked;

        const totalPerDay = needDay + needEvening + needNight + needOff;
        if (!startDate) {
            return { valid: false, message: '시작일을 선택해주세요.' };
        }
        if (nurseCount < totalPerDay) {
            return {
                valid: false,
                message: `하루 필요 인원(${totalPerDay}명)보다 간호사 수가 적어요.`
            };
        }
        return {
            valid: true,
            wardLabel: ward.options[ward.selectedIndex].textContent,
            startDate,
            nurseCount,
            staffNames: staffNames.length ? [...staffNames] : null,
            nightLimit,
            needDay,
            needEvening,
            needNight,
            needOff,
            nightRest,
            weekendBalance,
            days: 7
        };
    }

    function buildSchedule(config) {
        const namePool = config.staffNames || Array.from({ length: config.nurseCount }, (_, i) => `N${String(i + 1).padStart(2, '0')}`);
        const nurses = namePool.map((name) => ({
            name,
            assignments: 0,
            lastShift: null,
            consecutiveNights: 0,
            weekendCount: 0
        }));

        const start = new Date(config.startDate);
        const days = [];

        for (let d = 0; d < config.days; d += 1) {
            const current = new Date(start);
            current.setDate(start.getDate() + d);
            const dayOfWeek = current.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            const assigned = new Set();
            const shifts = {
                date: current,
                day: [],
                evening: [],
                night: [],
                off: []
            };

            assignShift(shifts.night, config.needNight, 'night');
            assignShift(shifts.evening, config.needEvening, 'evening');
            assignShift(shifts.day, config.needDay, 'day');
            assignOff(shifts.off, config.needOff);

            days.push(shifts);

            function assignShift(target, count, type) {
                for (let i = 0; i < count; i += 1) {
                    const candidate = pickNurse(type);
                    if (!candidate) break;
                    target.push(candidate.name);
                    assigned.add(candidate.name);
                    candidate.assignments += 1;
                    candidate.lastShift = type;
                    candidate.consecutiveNights = type === 'night' ? candidate.consecutiveNights + 1 : 0;
                    if (isWeekend) candidate.weekendCount += 1;
                }
            }

            function assignOff(target, count) {
                const available = nurses
                    .filter((n) => !assigned.has(n.name))
                    .sort((a, b) => a.assignments - b.assignments);
                for (let i = 0; i < count && i < available.length; i += 1) {
                    const nurse = available[i];
                    target.push(nurse.name);
                    assigned.add(nurse.name);
                    nurse.lastShift = 'off';
                    nurse.consecutiveNights = 0;
                }
            }

            function pickNurse(shiftType) {
                const pool = nurses.filter((n) => {
                    if (assigned.has(n.name)) return false;
                    if (shiftType === 'day' && config.nightRest && n.lastShift === 'night') return false;
                    if (shiftType === 'night' && n.consecutiveNights >= config.nightLimit) return false;
                    return true;
                });
                if (pool.length === 0) return null;
                return pool.sort((a, b) => {
                    if (config.weekendBalance && isWeekend) {
                        if (a.weekendCount !== b.weekendCount) {
                            return a.weekendCount - b.weekendCount;
                        }
                    }
                    if (a.assignments !== b.assignments) {
                        return a.assignments - b.assignments;
                    }
                    return Math.random() - 0.5;
                })[0];
            }
        }

        return days;
    }

    function renderSchedule(days) {
        if (!scheduleTable || !featuredTitle || !featuredDesc) return;
        featuredTitle.textContent = '3교대 스케줄 생성 완료';
        featuredDesc.textContent = 'Day / Evening / Night 배정을 확인하세요.';

        const header = `
            <div class="schedule-row schedule-head">
                <div class="schedule-date">날짜</div>
                <div>Day</div>
                <div>Evening</div>
                <div>Night</div>
            </div>
        `;

        const rows = days
            .map((day) => {
                const dateLabel = formatDate(day.date);
                return `
                    <div class="schedule-row">
                        <div class="schedule-date">${dateLabel}</div>
                        <div class="schedule-cell">${renderChips('D', day.day)}</div>
                        <div class="schedule-cell">${renderChips('E', day.evening)}</div>
                        <div class="schedule-cell">${renderChips('N', day.night)}</div>
                    </div>
                `;
            })
            .join('');

        scheduleTable.innerHTML = header + rows;
    }

    function renderSummary(days, config) {
        if (!altGrid) return;
        const totals = days.reduce(
            (acc, day) => {
                acc.day += day.day.length;
                acc.evening += day.evening.length;
                acc.night += day.night.length;
                acc.off += day.off.length;
                return acc;
            },
            { day: 0, evening: 0, night: 0, off: 0 }
        );

        altGrid.innerHTML = `
            <article class="alt-card">
                <div class="alt-card__emoji">📌</div>
                <div>
                    <h4>${config.wardLabel} 7일 배정</h4>
                    <p>Day ${totals.day} / Evening ${totals.evening} / Night ${totals.night}</p>
                </div>
            </article>
            <article class="alt-card">
                <div class="alt-card__emoji">✅</div>
                <div>
                    <h4>오프 배정</h4>
                    <p>총 ${totals.off}회 오프 배정</p>
                </div>
            </article>
        `;
    }

    function formatDate(date) {
        return `${date.getMonth() + 1}.${date.getDate()} (${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]})`;
    }

    function renderChips(label, names) {
        if (!names.length) return `<strong>${label}</strong>배정 없음`;
        return `<strong>${label}</strong>` + names.map((name) => `<span>${name}</span>`).join('');
    }

    function addStaffFromInput() {
        const raw = staffInput.value.trim();
        if (!raw) return;
        const parts = raw.split(',').map((name) => name.trim()).filter(Boolean);
        parts.forEach((name) => {
            if (!staffNames.includes(name)) {
                staffNames.push(name);
            }
        });
        staffInput.value = '';
        renderStaffList();
        const nurseCountInput = document.getElementById('nurse-count');
        if (nurseCountInput && staffNames.length) {
            nurseCountInput.value = staffNames.length;
        }
    }

    function removeStaff(name) {
        const index = staffNames.indexOf(name);
        if (index >= 0) {
            staffNames.splice(index, 1);
            renderStaffList();
            const nurseCountInput = document.getElementById('nurse-count');
            if (nurseCountInput) {
                nurseCountInput.value = staffNames.length || nurseCountInput.value;
            }
        }
    }

    function renderStaffList() {
        if (!staffList) return;
        staffList.innerHTML = staffNames
            .map((name) => {
                return `
                    <span class="staff-chip">
                        ${name}
                        <button type="button" data-name="${name}" aria-label="${name} 삭제">✕</button>
                    </span>
                `;
            })
            .join('');

        staffList.querySelectorAll('button[data-name]').forEach((button) => {
            button.addEventListener('click', () => {
                removeStaff(button.dataset.name);
            });
        });
    }
});
