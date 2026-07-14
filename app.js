const STORAGE_KEY = "victory-diary-mvp-v1";
const MAX_IMAGE_SIZE_BYTES = 1.8 * 1024 * 1024;

const roles = [
  "Я как человек",
  "Я как мужчина",
  "Я как сын",
  "Я как руководитель",
  "Я как практик",
  "Я как ученик",
  "Я как творец",
  "Я как друг",
];

const categories = [
  "Практики",
  "Вокал",
  "Питание",
  "Тело",
  "Дисциплина",
  "Бизнес",
  "Отношения",
  "Тень исправлена",
];

const JOURNEY_START_DATE = "2026-05-26";
const CORE_HABIT_IDS = ["wake-up", "padmasadana", "vocal", "breakfast", "vegetarian"];

const initialState = {
  activeTab: "today",
  activeDate: toDateInput(new Date()),
  victoryFilter: "Все",
  collapsedHabits: {},
  journeyStartDate: JOURNEY_START_DATE,
  coreHabitIds: CORE_HABIT_IDS,
  authMode: "login",
  localAccount: {
    email: "",
    isSignedIn: false,
  },
  profile: {
    displayName: "Илья",
    avatar: null,
    birthYear: "",
    city: "",
    bio: "",
    journeyStartDate: JOURNEY_START_DATE,
  },
  roles,
  categories,
  habits: [
    {
      id: "wake-up",
      name: "Подъем сразу с будильником",
      type: "simple",
      challenge: 90,
      color: "green",
    },
    {
      id: "padmasadana",
      name: "Подмасадана / духовные практики",
      type: "compound",
      challenge: 90,
      color: "green",
      children: [
        { id: "asanas", name: "Асаны" },
        { id: "pranayama-3", name: "Пранаяма 3-стадийная" },
        { id: "bhastrika", name: "Бхастрика" },
        { id: "kriya-small", name: "Крия малая" },
        { id: "bogar", name: "Богар пранаяма" },
        { id: "sahaj", name: "Медитация сахадж самадхи" },
        { id: "nadi", name: "Нади шодхана пранаяма" },
      ],
    },
    {
      id: "vocal",
      name: "Вокал",
      type: "simple",
      challenge: 120,
      color: "blue",
    },
    {
      id: "breakfast",
      name: "Завтрак",
      type: "simple",
      challenge: 90,
      color: "amber",
    },
    {
      id: "vegetarian",
      name: "Вегетарианство",
      type: "simple",
      challenge: 90,
      color: "green",
    },
    {
      id: "gym",
      name: "Тренажерный зал",
      type: "simple",
      challenge: 36,
      color: "blue",
    },
  ],
  checks: {},
  victories: [],
  shadows: [],
};

let state = loadState();
let pendingImage = null;
let draftHabitChildren = [];

const els = {
  activeDate: document.querySelector("#active-date"),
  todayWeekday: document.querySelector("#today-weekday"),
  todaySummary: document.querySelector("#today-summary"),
  habitList: document.querySelector("#habit-list"),
  victoryGrid: document.querySelector("#victory-grid"),
  victoryFilters: document.querySelector("#victory-filters"),
  progressCalendar: document.querySelector("#progress-calendar"),
  calendarTotal: document.querySelector("#calendar-total"),
  streakList: document.querySelector("#streak-list"),
  achievementList: document.querySelector("#achievement-list"),
  shadowList: document.querySelector("#shadow-list"),
  toast: document.querySelector("#toast"),
  victoryForm: document.querySelector("#victory-form"),
  shadowForm: document.querySelector("#shadow-form"),
  habitForm: document.querySelector("#habit-form"),
  imagePreview: document.querySelector("#image-preview"),
  habitCompound: document.querySelector("#habit-compound"),
  subtaskBuilder: document.querySelector("#subtask-builder"),
  habitChildInput: document.querySelector("#habit-child-input"),
  habitChildAdd: document.querySelector("#habit-child-add"),
  habitChildList: document.querySelector("#habit-child-list"),
  accountName: document.querySelector("#account-name"),
  accountMode: document.querySelector("#account-mode"),
  accountAvatar: document.querySelector("#account-avatar"),
  connectionStatus: document.querySelector("#connection-status"),
  authForm: document.querySelector("#auth-form"),
  authNameField: document.querySelector(".auth-name-field"),
  authName: document.querySelector("#auth-name"),
  authEmail: document.querySelector("#auth-email"),
  authPassword: document.querySelector("#auth-password"),
  authSubmit: document.querySelector("#auth-submit"),
  profileForm: document.querySelector("#profile-form"),
  profileAvatar: document.querySelector("#profile-avatar"),
  profileAvatarInput: document.querySelector("#profile-avatar-input"),
  profileDisplayName: document.querySelector("#profile-display-name"),
  profileBirthYear: document.querySelector("#profile-birth-year"),
  profileCity: document.querySelector("#profile-city"),
  profileJourneyStart: document.querySelector("#profile-journey-start"),
  profileBio: document.querySelector("#profile-bio"),
  exportData: document.querySelector("#export-data"),
};

boot();

function boot() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  document.querySelectorAll("[data-tab-jump]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tabJump));
  });

  document.querySelector("[data-shadow-add]").addEventListener("click", () => {
    switchTab("add");
    switchForm("shadow");
  });

  document.querySelectorAll("[data-form]").forEach((button) => {
    button.addEventListener("click", () => switchForm(button.dataset.form));
  });

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => switchAuthMode(button.dataset.authMode));
  });

  els.activeDate.value = state.activeDate;
  els.activeDate.addEventListener("change", (event) => {
    state.activeDate = event.target.value;
    saveAndRender();
  });

  setSelectOptions("#victory-category", state.categories);
  setSelectOptions("#victory-role", state.roles);
  document.querySelector("#victory-date").value = state.activeDate;

  document.querySelector("#victory-image").addEventListener("change", handleImageUpload);
  els.habitCompound.addEventListener("change", renderHabitChildBuilder);
  els.habitChildAdd.addEventListener("click", addDraftHabitChild);
  els.habitChildInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addDraftHabitChild();
    }
  });
  els.victoryForm.addEventListener("submit", handleVictorySubmit);
  els.shadowForm.addEventListener("submit", handleShadowSubmit);
  els.habitForm.addEventListener("submit", handleHabitSubmit);
  els.authForm.addEventListener("submit", handleLocalAuthSubmit);
  els.profileForm.addEventListener("submit", handleProfileSubmit);
  els.profileAvatarInput.addEventListener("change", handleAvatarUpload);
  els.exportData.addEventListener("click", exportLocalData);

  switchTab(state.activeTab || "today", false);
  switchAuthMode(state.authMode || "login", false);
  render();
}

function render() {
  renderAccount();
  renderToday();
  renderVictories();
  renderProgress();
  renderShadow();
  renderProfile();
}

function renderAccount() {
  const name = state.profile?.displayName || state.localAccount?.email || "Локальный режим";
  const signedIn = Boolean(state.localAccount?.isSignedIn);
  const connected = isSupabaseConfigured();

  els.accountName.textContent = signedIn ? name : "Локальный режим";
  els.accountMode.textContent = connected
    ? "Supabase настроен, можно подключать синхронизацию"
    : "Данные хранятся в этом браузере";
  setAvatar(els.accountAvatar, state.profile?.avatar, name);
}

function renderToday() {
  const date = state.activeDate;
  const completion = getDayCompletion(date);
  const completeHabits = state.habits.filter((habit) => habitStatus(habit, date).status === "done").length;
  const partialHabits = state.habits.filter((habit) => habitStatus(habit, date).status === "partial").length;

  els.todayWeekday.textContent = formatWeekday(date);
  els.todaySummary.innerHTML = [
    metric(`${completion}%`, "день закрыт"),
    metric(`${completeHabits}`, "выполнено"),
    metric(`${partialHabits}`, "частично"),
    metric(`${state.habits.length}`, "привычек"),
  ].join("");

  els.habitList.innerHTML = state.habits.map((habit) => renderHabit(habit, date)).join("");
  els.habitList.querySelectorAll("[data-toggle-habit]").forEach((button) => {
    button.addEventListener("click", () => toggleHabit(button.dataset.toggleHabit));
  });
  els.habitList.querySelectorAll("[data-toggle-child]").forEach((button) => {
    button.addEventListener("click", () => toggleChild(button.dataset.habitId, button.dataset.toggleChild));
  });
  els.habitList.querySelectorAll("[data-toggle-collapse]").forEach((button) => {
    button.addEventListener("click", () => toggleHabitCollapse(button.dataset.toggleCollapse));
  });
  els.habitList.querySelectorAll("[data-delete-habit]").forEach((button) => {
    button.addEventListener("click", () => deleteHabit(button.dataset.deleteHabit));
  });
}

function renderHabit(habit, date) {
  const result = habitStatus(habit, date);
  const streak = getStreak(habit.id);
  const collapsed = Boolean(state.collapsedHabits?.[habit.id]);
  const subtitle = habit.type === "compound"
    ? `${result.doneChildren}/${habit.children.length} пунктов`
    : result.status === "done" ? "Выполнено" : "Не отмечено";
  const collapseButton = habit.type === "compound"
    ? `<button class="collapse-toggle ${collapsed ? "collapsed" : ""}" data-toggle-collapse="${habit.id}" type="button" aria-label="${collapsed ? "Развернуть" : "Свернуть"} ${escapeHtml(habit.name)}">⌄</button>`
    : "";
  const children = habit.type === "compound" && !collapsed
    ? `<div class="children">${habit.children.map((child) => renderChild(habit.id, child, date)).join("")}</div>`
    : "";

  return `
    <article class="habit-card ${result.status}">
      <div class="habit-main">
        <button class="habit-check" data-toggle-habit="${habit.id}" type="button" aria-label="Отметить ${escapeHtml(habit.name)}">
          <span class="check">${result.status === "partial" ? result.doneChildren : "✓"}</span>
        </button>
        <button class="habit-label" data-toggle-habit="${habit.id}" type="button">
          <span class="habit-title">
            <strong>${escapeHtml(habit.name)}</strong>
            <span>${escapeHtml(subtitle)}</span>
          </span>
        </button>
        <span class="habit-streak">${streak} дн.</span>
        ${collapseButton}
        <button class="habit-delete" data-delete-habit="${habit.id}" type="button" aria-label="Удалить ${escapeHtml(habit.name)}">×</button>
      </div>
      ${children}
    </article>
  `;
}

function renderChild(habitId, child, date) {
  const done = Boolean(getDateChecks(date)[habitId]?.children?.[child.id]);
  return `
    <button class="child-row ${done ? "done" : ""}" data-habit-id="${habitId}" data-toggle-child="${child.id}" type="button">
      <span class="mini-check">✓</span>
      <span>${escapeHtml(child.name)}</span>
    </button>
  `;
}

function renderVictories() {
  const filters = ["Все", ...state.categories];
  els.victoryFilters.innerHTML = filters.map((filter) => `
    <button class="filter-chip ${state.victoryFilter === filter ? "active" : ""}" data-filter="${escapeHtml(filter)}" type="button">${escapeHtml(filter)}</button>
  `).join("");

  els.victoryFilters.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.victoryFilter = button.dataset.filter;
      saveAndRender();
    });
  });

  const victories = [...state.victories]
    .filter((victory) => state.victoryFilter === "Все" || victory.category === state.victoryFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!victories.length) {
    els.victoryGrid.innerHTML = `<div class="empty-state">Пока здесь пусто. Добавь первую победу с фото или текстом.</div>`;
    return;
  }

  els.victoryGrid.innerHTML = victories.map(renderVictoryCard).join("");
  els.victoryGrid.querySelectorAll("[data-delete-victory]").forEach((button) => {
    button.addEventListener("click", () => deleteVictory(button.dataset.deleteVictory));
  });
}

function renderVictoryCard(victory) {
  const media = victory.image
    ? `<img src="${victory.image}" alt="">`
    : `<span>${escapeHtml(victory.category)}</span>`;
  const tags = [victory.role, ...(victory.tags || [])].filter(Boolean);

  return `
    <article class="victory-card">
      <div class="victory-media">${media}</div>
      <div class="victory-body">
        <div class="victory-date">${formatDate(victory.date)} · ${escapeHtml(victory.category)}</div>
        <p>${escapeHtml(victory.text)}</p>
        <div class="tag-row">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="card-actions">
          <button class="danger-action" data-delete-victory="${victory.id}" type="button">Удалить</button>
        </div>
      </div>
    </article>
  `;
}

function renderProgress() {
  renderCalendar();

  els.streakList.innerHTML = state.habits.map((habit) => {
    const streak = getStreak(habit.id);
    const challenge = habit.challenge || 90;
    const percent = Math.min(100, Math.round((streak / challenge) * 100));
    return `
      <div class="streak-item">
        <div class="streak-head">
          <strong>${escapeHtml(habit.name)}</strong>
          <span class="status-pill">${streak}/${challenge}</span>
        </div>
        <div class="bar"><div class="bar-fill" style="width:${percent}%"></div></div>
        <div class="meta-line">${percent}% челленджа · рекорд ${getBestStreak(habit.id)} дн.</div>
      </div>
    `;
  }).join("");

  const achievements = buildAchievements();
  els.achievementList.innerHTML = achievements.length
    ? achievements.map((achievement) => `
      <div class="achievement-item">
        <strong>${escapeHtml(achievement.title)}</strong>
        <span class="meta-line">${escapeHtml(achievement.description)}</span>
        <button class="ghost-action" data-create-achievement="${achievement.habitId}" data-days="${achievement.days}" type="button">Создать победу</button>
      </div>
    `).join("")
    : `<div class="empty-state">Достижения появятся, когда серия дойдет до 7, 21, 40, 90 или 100 дней.</div>`;

  els.achievementList.querySelectorAll("[data-create-achievement]").forEach((button) => {
    button.addEventListener("click", () => createAchievementVictory(button.dataset.createAchievement, Number(button.dataset.days)));
  });
}

function renderCalendar() {
  const months = getCalendarMonths(state.journeyStartDate, getCalendarEndDate());
  const stats = getCalendarStats();
  els.calendarTotal.textContent = `${stats.full} зеленых дней`;

  els.progressCalendar.innerHTML = months.map((monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthLabel = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(monthDate);
    const days = getMonthDays(year, month);
    const blanks = firstDayOffset(monthDate);

    return `
      <section class="month-card">
        <h3>${escapeHtml(monthLabel)}</h3>
        <div class="weekdays">
          ${["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => `<span>${day}</span>`).join("")}
        </div>
        <div class="month-grid">
          ${Array.from({ length: blanks }, () => `<span class="day-cell blank"></span>`).join("")}
          ${days.map((date) => renderCalendarDay(date)).join("")}
        </div>
      </section>
    `;
  }).join("");

  els.progressCalendar.querySelectorAll("[data-calendar-date]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeDate = button.dataset.calendarDate;
      els.activeDate.value = state.activeDate;
      saveAndRender();
      switchTab("today");
    });
  });
}

function renderCalendarDay(date) {
  const dateKey = toDateInput(date);
  const score = getCoreDayScore(dateKey);
  const isToday = dateKey === state.activeDate;
  const isBeforeJourney = dateKey < state.journeyStartDate;
  const className = isBeforeJourney ? "muted" : score.status;
  const label = score.total ? `${score.done}/${score.total}` : "нет основных привычек";

  return `
    <button class="day-cell ${className} ${isToday ? "today" : ""}" data-calendar-date="${dateKey}" type="button" title="${formatDate(dateKey)} · ${label}">
      <span>${date.getDate()}</span>
    </button>
  `;
}

function renderShadow() {
  const shadows = [...state.shadows].sort((a, b) => b.date.localeCompare(a.date));
  if (!shadows.length) {
    els.shadowList.innerHTML = `<div class="empty-state">Тень пока пустая. Здесь можно честно записывать то, что хочется увидеть и исправить.</div>`;
    return;
  }

  els.shadowList.innerHTML = shadows.map((entry) => `
    <article class="shadow-card">
      <header>
        <div>
          <h3>${formatDate(entry.date)}</h3>
          <div class="meta-line">${(entry.tags || []).map(escapeHtml).join(" · ") || "без тегов"}</div>
        </div>
        <span class="status-pill">${escapeHtml(entry.status)}</span>
      </header>
      <div class="shadow-grid">
        ${shadowNote("Ситуация", entry.situation)}
        ${shadowNote("Моя тень", entry.pattern)}
        ${shadowNote("Страх", entry.fear)}
        ${shadowNote("Зрелый я", entry.mature)}
      </div>
      <div class="shadow-note" style="margin-top:10px">
        <strong>Шаг исправления</strong>
        ${escapeHtml(entry.repair || "Не задан")}
      </div>
      <div class="card-actions">
        <button class="ghost-action" data-shadow-status="${entry.id}" type="button">Сменить статус</button>
        <button class="primary-action" data-shadow-victory="${entry.id}" type="button">Превратить в победу</button>
        <button class="danger-action" data-shadow-delete="${entry.id}" type="button">Удалить</button>
      </div>
    </article>
  `).join("");

  els.shadowList.querySelectorAll("[data-shadow-status]").forEach((button) => {
    button.addEventListener("click", () => cycleShadowStatus(button.dataset.shadowStatus));
  });
  els.shadowList.querySelectorAll("[data-shadow-victory]").forEach((button) => {
    button.addEventListener("click", () => shadowToVictory(button.dataset.shadowVictory));
  });
  els.shadowList.querySelectorAll("[data-shadow-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteShadow(button.dataset.shadowDelete));
  });
}

function renderProfile() {
  const connected = isSupabaseConfigured();
  const signedIn = Boolean(state.localAccount?.isSignedIn);
  const profile = state.profile || {};

  els.connectionStatus.className = `connection-status ${connected ? "connected" : "local"}`;
  els.connectionStatus.innerHTML = connected
    ? `<strong>Supabase настроен</strong><span>Следующий шаг — включить настоящую синхронизацию таблиц и файлов.</span>`
    : `<strong>Локальный режим</strong><span>Профиль и дневник пока живут только в этом браузере.</span>`;

  els.authNameField.hidden = state.authMode !== "register";
  els.authSubmit.textContent = state.authMode === "register" ? "Создать локальный профиль" : "Войти локально";
  els.authEmail.value = state.localAccount?.email || "";
  els.authPassword.value = "";
  els.authName.value = profile.displayName || "";

  els.profileDisplayName.value = profile.displayName || "";
  els.profileBirthYear.value = profile.birthYear || "";
  els.profileCity.value = profile.city || "";
  els.profileJourneyStart.value = profile.journeyStartDate || state.journeyStartDate || JOURNEY_START_DATE;
  els.profileBio.value = profile.bio || "";
  setAvatar(els.profileAvatar, profile.avatar, profile.displayName || state.localAccount?.email || "ДП");

  if (signedIn) {
    els.authSubmit.textContent = "Обновить вход";
  }
}

function handleVictorySubmit(event) {
  event.preventDefault();
  const text = document.querySelector("#victory-text").value.trim();
  if (!text) {
    toast("Напиши текст победы.");
    return;
  }

  const victory = {
    id: uid(),
    date: document.querySelector("#victory-date").value || state.activeDate,
    text,
    category: document.querySelector("#victory-category").value,
    role: document.querySelector("#victory-role").value,
    tags: parseTags(document.querySelector("#victory-tags").value),
    image: pendingImage,
    source: "manual",
  };

  state.victories.push(victory);
  pendingImage = null;
  els.victoryForm.reset();
  document.querySelector("#victory-date").value = state.activeDate;
  els.imagePreview.textContent = "Фото появится здесь";
  saveAndRender();
  switchTab("victories");
  toast("Победа сохранена.");
}

function handleShadowSubmit(event) {
  event.preventDefault();
  const situation = document.querySelector("#shadow-situation").value.trim();
  if (!situation) {
    toast("Запиши ситуацию.");
    return;
  }

  state.shadows.push({
    id: uid(),
    date: state.activeDate,
    situation,
    pattern: document.querySelector("#shadow-pattern").value.trim(),
    fear: document.querySelector("#shadow-fear").value.trim(),
    mature: document.querySelector("#shadow-mature").value.trim(),
    repair: document.querySelector("#shadow-repair").value.trim(),
    status: "открыто",
    tags: inferShadowTags([situation, document.querySelector("#shadow-pattern").value, document.querySelector("#shadow-fear").value].join(" ")),
  });

  els.shadowForm.reset();
  saveAndRender();
  switchTab("shadow");
  toast("Запись добавлена в Тень.");
}

function handleHabitSubmit(event) {
  event.preventDefault();
  const name = document.querySelector("#habit-name").value.trim();
  if (!name) {
    toast("Назови привычку.");
    return;
  }

  const compound = document.querySelector("#habit-compound").checked;
  const children = draftHabitChildren.map((child, index) => ({
    id: uniqueChildId(child, index),
    name: child,
  }));

  if (compound && !children.length) {
    toast("Добавь хотя бы один подпункт через кнопку +.");
    return;
  }

  state.habits.push({
    id: uniqueHabitId(name),
    name,
    type: compound && children.length ? "compound" : "simple",
    challenge: 90,
    color: "green",
    children: compound ? children : undefined,
  });

  els.habitForm.reset();
  draftHabitChildren = [];
  renderHabitChildBuilder();
  saveAndRender();
  switchTab("today");
  toast("Привычка добавлена.");
}

function handleLocalAuthSubmit(event) {
  event.preventDefault();
  const email = els.authEmail.value.trim();
  const password = els.authPassword.value.trim();

  if (!email || !password) {
    toast("Укажи email и пароль.");
    return;
  }

  if (password.length < 6) {
    toast("Пароль должен быть минимум 6 символов.");
    return;
  }

  state.localAccount = {
    email,
    isSignedIn: true,
  };

  if (state.authMode === "register" && els.authName.value.trim()) {
    state.profile.displayName = els.authName.value.trim();
  }

  saveAndRender();
  toast(state.authMode === "register" ? "Локальный профиль создан." : "Вход выполнен локально.");
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const birthYear = els.profileBirthYear.value.trim();
  const journeyStartDate = els.profileJourneyStart.value || JOURNEY_START_DATE;

  state.profile = {
    ...(state.profile || {}),
    displayName: els.profileDisplayName.value.trim() || "Илья",
    birthYear,
    city: els.profileCity.value.trim(),
    bio: els.profileBio.value.trim(),
    journeyStartDate,
  };
  state.journeyStartDate = journeyStartDate;

  saveAndRender();
  toast("Профиль сохранен.");
}

function handleAvatarUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!validateImageFile(file)) {
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    state.profile = {
      ...(state.profile || {}),
      avatar: reader.result,
    };
    saveAndRender();
    toast("Аватарка обновлена.");
  };
  reader.readAsDataURL(file);
}

function exportLocalData() {
  const data = {
    exportedAt: new Date().toISOString(),
    app: "Дневник Побед",
    state,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dnevnik-pobed-${toDateInput(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast("Экспорт подготовлен.");
}

function addDraftHabitChild() {
  const value = els.habitChildInput.value.trim();
  if (!value) return;
  draftHabitChildren.push(value);
  els.habitChildInput.value = "";
  renderHabitChildBuilder();
}

function removeDraftHabitChild(index) {
  draftHabitChildren.splice(index, 1);
  renderHabitChildBuilder();
}

function renderHabitChildBuilder() {
  els.subtaskBuilder.hidden = !els.habitCompound.checked;
  if (!draftHabitChildren.length) {
    els.habitChildList.innerHTML = `<div class="subtask-empty">Подпунктов пока нет</div>`;
    return;
  }
  els.habitChildList.innerHTML = draftHabitChildren.map((child, index) => `
    <div class="subtask-pill">
      <span>${escapeHtml(child)}</span>
      <button class="remove-subtask" data-remove-child="${index}" type="button" aria-label="Удалить ${escapeHtml(child)}">×</button>
    </div>
  `).join("");
  els.habitChildList.querySelectorAll("[data-remove-child]").forEach((button) => {
    button.addEventListener("click", () => removeDraftHabitChild(Number(button.dataset.removeChild)));
  });
}

function handleImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!validateImageFile(file)) {
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    pendingImage = reader.result;
    els.imagePreview.innerHTML = `<img src="${pendingImage}" alt="">`;
  };
  reader.readAsDataURL(file);
}

function validateImageFile(file) {
  if (!file.type.startsWith("image/")) {
    toast("Можно загрузить только изображение.");
    return false;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    toast("Фото слишком большое. Пока загрузи изображение до 1.8 МБ.");
    return false;
  }
  return true;
}

function switchTab(tab, persist = true) {
  state.activeTab = tab;
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === tab);
  });
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  if (persist) saveState();
}

function switchForm(form) {
  document.querySelectorAll(".form-tab").forEach((tab) => {
    if (tab.dataset.form) tab.classList.toggle("active", tab.dataset.form === form);
  });
  document.querySelectorAll("[data-form-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.formPanel === form);
  });
}

function switchAuthMode(mode, persist = true) {
  state.authMode = mode;
  document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authMode === mode);
  });
  els.authNameField.hidden = mode !== "register";
  els.authSubmit.textContent = mode === "register" ? "Создать локальный профиль" : "Войти локально";
  if (persist) saveAndRender();
}

function toggleHabit(habitId) {
  const habit = state.habits.find((item) => item.id === habitId);
  const checks = getDateChecks(state.activeDate);
  const current = checks[habitId] || {};

  if (habit.type === "compound") {
    const allDone = habitStatus(habit, state.activeDate).status === "done";
    checks[habitId] = {
      children: Object.fromEntries(habit.children.map((child) => [child.id, !allDone])),
    };
  } else {
    checks[habitId] = { done: !current.done };
  }

  saveAndRender();
}

function toggleChild(habitId, childId) {
  const checks = getDateChecks(state.activeDate);
  const current = checks[habitId] || { children: {} };
  current.children = current.children || {};
  current.children[childId] = !current.children[childId];
  checks[habitId] = current;
  saveAndRender();
}

function toggleHabitCollapse(habitId) {
  state.collapsedHabits = state.collapsedHabits || {};
  state.collapsedHabits[habitId] = !state.collapsedHabits[habitId];
  saveAndRender();
}

function getDateChecks(date) {
  state.checks[date] = state.checks[date] || {};
  return state.checks[date];
}

function habitStatus(habit, date) {
  const entry = state.checks[date]?.[habit.id];
  if (habit.type === "compound") {
    const doneChildren = habit.children.filter((child) => entry?.children?.[child.id]).length;
    return {
      status: doneChildren === habit.children.length ? "done" : doneChildren > 0 ? "partial" : "empty",
      doneChildren,
    };
  }
  return { status: entry?.done ? "done" : "empty", doneChildren: entry?.done ? 1 : 0 };
}

function isHabitDoneOnDate(habitId, date) {
  const habit = state.habits.find((item) => item.id === habitId);
  if (!habit) return false;
  return habitStatus(habit, date).status === "done";
}

function getDayCompletion(date) {
  const coreIds = state.coreHabitIds || CORE_HABIT_IDS;
  const coreHabits = coreIds
    .map((id) => state.habits.find((habit) => habit.id === id))
    .filter(Boolean);
  if (!coreHabits.length) return 0;

  let score = 0;
  coreHabits.forEach((habit) => {
    const result = habitStatus(habit, date);
    if (result.status === "done") score += 1;
    if (result.status === "partial") score += 0.5;
  });
  return Math.round((score / coreHabits.length) * 100);
}

function getCoreDayScore(date) {
  const coreIds = state.coreHabitIds || CORE_HABIT_IDS;
  const coreHabits = coreIds
    .map((id) => state.habits.find((habit) => habit.id === id))
    .filter(Boolean);

  const total = coreHabits.length;
  const done = coreHabits.filter((habit) => habitStatus(habit, date).status === "done").length;
  const partial = coreHabits.filter((habit) => habitStatus(habit, date).status === "partial").length;

  return {
    total,
    done,
    partial,
    status: done === total && total > 0 ? "full" : done > 0 || partial > 0 ? "partial" : "empty",
  };
}

function getCalendarStats() {
  let full = 0;
  let partial = 0;
  let empty = 0;
  eachDate(state.journeyStartDate, getCalendarEndDate(), (date) => {
    const score = getCoreDayScore(date);
    if (score.status === "full") full += 1;
    if (score.status === "partial") partial += 1;
    if (score.status === "empty") empty += 1;
  });
  return { full, partial, empty };
}

function getStreak(habitId) {
  let streak = 0;
  let date = parseDate(state.activeDate);
  while (isHabitDoneOnDate(habitId, toDateInput(date))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function getBestStreak(habitId) {
  const dates = Object.keys(state.checks).sort();
  let best = 0;
  let run = 0;
  let previous = null;

  dates.forEach((date) => {
    const current = parseDate(date);
    const consecutive = previous && daysBetween(previous, current) === 1;
    if (isHabitDoneOnDate(habitId, date)) {
      run = consecutive ? run + 1 : 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
    previous = current;
  });

  return Math.max(best, getStreak(habitId));
}

function buildAchievements() {
  const marks = [7, 21, 40, 90, 100];
  return state.habits.flatMap((habit) => {
    const streak = getStreak(habit.id);
    return marks
      .filter((days) => streak >= days)
      .filter((days) => !state.victories.some((victory) => victory.source === `achievement:${habit.id}:${days}`))
      .map((days) => ({
        habitId: habit.id,
        days,
        title: `${days} дней: ${habit.name}`,
        description: "Можно превратить это достижение в карточку на стене побед.",
      }));
  });
}

function createAchievementVictory(habitId, days) {
  const habit = state.habits.find((item) => item.id === habitId);
  if (!habit) return;
  state.victories.push({
    id: uid(),
    date: state.activeDate,
    text: `Я сделал ${days} дней подряд: ${habit.name}.`,
    category: habit.name.includes("Вокал") ? "Вокал" : habit.name.includes("Вегетариан") ? "Питание" : "Дисциплина",
    role: habit.name.includes("Вокал") ? "Я как творец" : "Я как практик",
    tags: ["серия", `${days} дней`],
    image: null,
    source: `achievement:${habit.id}:${days}`,
  });
  saveAndRender();
  switchTab("victories");
  toast("Достижение стало победой.");
}

function shadowToVictory(id) {
  const entry = state.shadows.find((item) => item.id === id);
  if (!entry) return;
  entry.status = "превращено в победу";
  state.victories.push({
    id: uid(),
    date: state.activeDate,
    text: `Я увидел свою тень и сделал шаг исправления: ${entry.repair || entry.mature || entry.situation}`,
    category: "Тень исправлена",
    role: "Я как мужчина",
    tags: ["тень", "ответственность", ...(entry.tags || [])],
    image: null,
    source: `shadow:${entry.id}`,
  });
  saveAndRender();
  switchTab("victories");
  toast("Тень превращена в победу.");
}

function cycleShadowStatus(id) {
  const statuses = ["открыто", "осознал", "исправил", "превращено в победу"];
  const entry = state.shadows.find((item) => item.id === id);
  if (!entry) return;
  const next = (statuses.indexOf(entry.status) + 1) % statuses.length;
  entry.status = statuses[next];
  saveAndRender();
}

function deleteShadow(id) {
  if (!confirm("Вы уверены, что хотите удалить эту запись из Тени?")) return;
  state.shadows = state.shadows.filter((entry) => entry.id !== id);
  saveAndRender();
  toast("Запись удалена.");
}

function deleteVictory(id) {
  if (!confirm("Вы уверены, что хотите удалить эту победу?")) return;
  state.victories = state.victories.filter((victory) => victory.id !== id);
  saveAndRender();
  toast("Победа удалена.");
}

function deleteHabit(id) {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;
  if (!confirm(`Вы уверены, что хотите удалить привычку "${habit.name}"? Все отметки по ней тоже удалятся.`)) return;

  state.habits = state.habits.filter((item) => item.id !== id);
  state.coreHabitIds = (state.coreHabitIds || CORE_HABIT_IDS).filter((habitId) => habitId !== id);
  if (state.collapsedHabits) delete state.collapsedHabits[id];
  Object.values(state.checks || {}).forEach((dayChecks) => {
    delete dayChecks[id];
  });
  saveAndRender();
  toast("Привычка удалена.");
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createInitialState();
  try {
    const parsed = JSON.parse(raw);
    return migrateState({
      ...structuredClone(initialState),
      ...parsed,
      roles: parsed.roles || roles,
      categories: parsed.categories || categories,
      collapsedHabits: parsed.collapsedHabits || {},
      journeyStartDate: parsed.journeyStartDate || JOURNEY_START_DATE,
      coreHabitIds: parsed.coreHabitIds || CORE_HABIT_IDS,
    });
  } catch {
    return createInitialState();
  }
}

function migrateState(loaded) {
  loaded.journeyStartDate = loaded.journeyStartDate || JOURNEY_START_DATE;
  loaded.coreHabitIds = loaded.coreHabitIds || CORE_HABIT_IDS;
  loaded.checks = loaded.checks || {};
  loaded.authMode = loaded.authMode || "login";
  loaded.localAccount = loaded.localAccount || { email: "", isSignedIn: false };
  loaded.profile = {
    ...structuredClone(initialState.profile),
    ...(loaded.profile || {}),
    journeyStartDate: loaded.profile?.journeyStartDate || loaded.journeyStartDate || JOURNEY_START_DATE,
  };
  return loaded;
}

function createInitialState() {
  return structuredClone(initialState);
}

function saveAndRender() {
  saveState();
  render();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error(error);
    toast("Не получилось сохранить данные. Скорее всего, фото слишком большое.");
    return false;
  }
}

function setSelectOptions(selector, values) {
  document.querySelector(selector).innerHTML = values
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("");
}

function metric(value, label) {
  return `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;
}

function shadowNote(title, text) {
  return `<div class="shadow-note"><strong>${escapeHtml(title)}</strong>${escapeHtml(text || "Не заполнено")}</div>`;
}

function parseTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function inferShadowTags(text) {
  const lower = text.toLowerCase();
  const tags = [];
  if (lower.includes("подума") || lower.includes("увид")) tags.push("страх оценки");
  if (lower.includes("обид")) tags.push("обида");
  if (lower.includes("молч") || lower.includes("не сказал")) tags.push("молчание");
  if (lower.includes("деньг") || lower.includes("выплат")) tags.push("деньги");
  if (lower.includes("разговор") || lower.includes("диалог")) tags.push("диалог");
  if (lower.includes("оправд")) tags.push("оправдание");
  return tags.length ? tags : ["осознанность"];
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(parseDate(date));
}

function formatWeekday(date) {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(parseDate(date));
}

function parseDate(input) {
  const [year, month, day] = input.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(input, offset) {
  const date = parseDate(input);
  date.setDate(date.getDate() + offset);
  return toDateInput(date);
}

function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

function eachDate(startInput, endInput, callback) {
  const cursor = parseDate(startInput);
  const end = parseDate(endInput);
  while (cursor <= end) {
    callback(toDateInput(cursor), new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
}

function getCalendarMonths(startInput, endInput) {
  const start = parseDate(startInput);
  const end = parseDate(endInput);
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const months = [];
  while (cursor <= end) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

function getCalendarEndDate() {
  const today = toDateInput(new Date());
  return state.activeDate > today ? state.activeDate : today;
}

function getMonthDays(year, month) {
  const days = [];
  const cursor = new Date(year, month, 1);
  while (cursor.getMonth() === month) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function firstDayOffset(date) {
  return (date.getDay() + 6) % 7;
}

function slugify(value) {
  const fallback = `item-${Date.now()}`;
  return value
    .toLowerCase()
    .trim()
    .replaceAll("ё", "е")
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-|-$/g, "") || fallback;
}

function uniqueHabitId(name) {
  const base = slugify(name);
  const existing = new Set(state.habits.map((habit) => habit.id));
  if (!existing.has(base)) return base;
  let index = 2;
  while (existing.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function uniqueChildId(name, index) {
  const base = slugify(name);
  return `${base}-${index + 1}`;
}

function isSupabaseConfigured() {
  const config = window.DP_CONFIG || {};
  return Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY);
}

function setAvatar(element, image, name) {
  if (image) {
    element.innerHTML = `<img src="${image}" alt="">`;
    return;
  }
  element.textContent = getInitials(name);
}

function getInitials(name) {
  const words = String(name || "ДП")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "ДП";
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2200);
}
