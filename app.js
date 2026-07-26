const STORAGE_KEY = "victory-diary-mvp-v1";
const MAX_IMAGE_SIZE_BYTES = 6 * 1024 * 1024;

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

const quickVictoryTags = [
  "7 дней",
  "21 день",
  "40 дней",
  "50 дней",
  "90 дней",
  "108 дней",
  "подъем",
  "подмасадана",
  "вокал",
  "тело",
  "спорт",
  "питание",
  "дисциплина",
  "бизнес",
  "деньги",
  "отношения",
  "смелость",
  "первый огонь",
  "новая привычка",
  "сила дисциплины",
  "знак мастерства",
  "вершина пути",
  "большой обет",
];

const awards = [
  {
    id: "first-fire",
    title: "Первый огонь",
    milestone: "7 дней подряд",
    days: 7,
    rank: "Bronze",
    image: "assets/award-bronze-7.svg",
    tags: ["первый огонь", "7 дней"],
    description: "Первый настоящий рубеж. Ты доказал себе, что можешь держать серию.",
  },
  {
    id: "new-habit-21",
    title: "Новая привычка",
    milestone: "21 день подряд",
    days: 21,
    rank: "Silver",
    image: "assets/award-silver-21.svg",
    tags: ["новая привычка", "21 день"],
    description: "Ритм уже держится. Привычка начинает становиться частью твоего дня.",
  },
  {
    id: "discipline-40",
    title: "Сила дисциплины",
    milestone: "40 дней подряд",
    days: 40,
    rank: "Gold",
    image: "assets/award-gold-40.svg",
    tags: ["сила дисциплины", "40 дней"],
    description: "Серьезный рубеж. Здесь уже видна не мотивация, а характер.",
  },
  {
    id: "master-50",
    title: "Знак мастерства",
    milestone: "50 дней подряд",
    days: 50,
    rank: "Master",
    image: "assets/award-master-50.svg",
    tags: ["знак мастерства", "50 дней"],
    description: "Ты не просто начал. Ты построил опору, на которую можно положиться.",
  },
  {
    id: "summit-90",
    title: "Вершина пути",
    milestone: "90 дней подряд",
    days: 90,
    rank: "Platinum",
    image: "assets/award-platinum-90.svg",
    tags: ["вершина пути", "90 дней"],
    description: "Большой челлендж закрыт. Это редкая награда за долгую верность пути.",
  },
  {
    id: "vow-108",
    title: "Большой обет",
    milestone: "108 дней подряд",
    days: 108,
    rank: "Kailash",
    image: "assets/award-kailash-108.svg",
    tags: ["большой обет", "108 дней"],
    description: "Особая награда для тех, кто прошел дальше обычного рубежа.",
  },
];

const awardPathLevels = [
  { days: 1, title: "Старт" },
  { days: 3, title: "Искра" },
  { days: 7, title: "Bronze" },
  { days: 14, title: "Ритм" },
  { days: 21, title: "Silver" },
  { days: 30, title: "Опора" },
  { days: 40, title: "Gold" },
  { days: 50, title: "Мастер" },
  { days: 90, title: "Platinum" },
  { days: 108, title: "Kailash" },
];

const JOURNEY_START_DATE = "2026-05-26";
const CORE_HABIT_IDS = [];
const starterHabits = [
  {
    id: "wake-up",
    name: "Подъем сразу с будильником",
    type: "simple",
    challenge: 90,
    color: "green",
  },
  {
    id: "padmasadana",
    name: "Подмасадана",
    type: "compound",
    challenge: 90,
    color: "green",
    children: [
      { id: "asanas", name: "Асаны" },
      { id: "pranayama-3", name: "Пранаяма 3х стадийная" },
      { id: "bhastrika", name: "Бхастрика" },
      { id: "kriya", name: "Крия малая" },
      { id: "bogar", name: "Богар пранаяма" },
      { id: "sahaj", name: "Медитация Сахадж Самадхи" },
      { id: "nadi-shodhana", name: "Нади Шодхана пранаяма" },
    ],
  },
  {
    id: "vocal",
    name: "Вокал",
    type: "simple",
    challenge: 90,
    color: "green",
  },
  {
    id: "breakfast",
    name: "Завтрак",
    type: "simple",
    challenge: 90,
    color: "green",
  },
  {
    id: "vegetarian",
    name: "Вегетарианство",
    type: "simple",
    challenge: 90,
    color: "green",
  },
];

const initialState = {
  activeTab: "victories",
  activeDate: toDateInput(new Date()),
  victoryFilter: "Все",
  victoryCategoryFilters: [],
  victoryTagFilters: [],
  victoryFilterOpen: false,
  victoryView: "tile",
  collapsedHabits: {},
  onboardingDismissed: false,
  onboardingPromptSeen: false,
  journeyStartDate: JOURNEY_START_DATE,
  coreHabitIds: CORE_HABIT_IDS,
  authMode: "login",
  localAccount: {
    email: "",
    isSignedIn: false,
    supabaseUserId: "",
  },
  profile: {
    displayName: "",
    avatar: null,
    birthYear: "",
    city: "",
    bio: "",
    journeyStartDate: JOURNEY_START_DATE,
  },
  roles,
  categories,
  habits: [],
  checks: {},
  victories: [],
  shadows: [],
};

let state = loadState();
let pendingImage = null;
let editingVictoryId = null;
let draftHabitChildren = [];
let supabaseClient = null;
let supabaseUser = null;
let hasSyncedHabits = false;
let hasSyncedJournal = false;
let onboardingMode = null;

const els = {
  appShell: document.querySelector("#app-shell"),
  authGate: document.querySelector("#auth-gate"),
  gateAuthForm: document.querySelector("#gate-auth-form"),
  gateAuthNameField: document.querySelector(".gate-auth-name-field"),
  gateAuthName: document.querySelector("#gate-auth-name"),
  gateAuthEmail: document.querySelector("#gate-auth-email"),
  gateAuthPassword: document.querySelector("#gate-auth-password"),
  gateAuthSubmit: document.querySelector("#gate-auth-submit"),
  activeDate: document.querySelector("#active-date"),
  todayWeekday: document.querySelector("#today-weekday"),
  todaySummary: document.querySelector("#today-summary"),
  habitList: document.querySelector("#habit-list"),
  victoryGrid: document.querySelector("#victory-grid"),
  victoryFilterToggle: document.querySelector("#victory-filter-toggle"),
  victoryFilterPanel: document.querySelector("#victory-filter-panel"),
  victoryTagFilters: document.querySelector("#victory-tag-filters"),
  victoryDetailModal: document.querySelector("#victory-detail-modal"),
  victoryDetailDialog: document.querySelector("#victory-detail-dialog"),
  progressCalendar: document.querySelector("#progress-calendar"),
  calendarTotal: document.querySelector("#calendar-total"),
  streakList: document.querySelector("#streak-list"),
  achievementList: document.querySelector("#achievement-list"),
  awardsHeroCard: document.querySelector("#awards-hero-card"),
  awardsStats: document.querySelector("#awards-stats"),
  awardsTrack: document.querySelector("#awards-track"),
  awardsGrid: document.querySelector("#awards-grid"),
  shadowList: document.querySelector("#shadow-list"),
  toast: document.querySelector("#toast"),
  victoryForm: document.querySelector("#victory-form"),
  victorySubmit: document.querySelector("#victory-submit"),
  victoryEditCancel: document.querySelector("#victory-edit-cancel"),
  victoryTagSuggestions: document.querySelector("#victory-tag-suggestions"),
  victoryAwards: document.querySelector("#victory-awards"),
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
  onboardingModal: document.querySelector("#onboarding-modal"),
  onboardingKicker: document.querySelector("#onboarding-kicker"),
  onboardingTitle: document.querySelector("#onboarding-modal-title"),
  onboardingText: document.querySelector("#onboarding-modal-text"),
  onboardingGuide: document.querySelector("#onboarding-guide"),
  onboardingLearn: document.querySelector("#onboarding-learn"),
  onboardingSkip: document.querySelector("#onboarding-skip"),
  connectionStatus: document.querySelector("#connection-status"),
  authForm: document.querySelector("#auth-form"),
  authNameField: document.querySelector(".auth-name-field"),
  authName: document.querySelector("#auth-name"),
  authEmail: document.querySelector("#auth-email"),
  authPassword: document.querySelector("#auth-password"),
  authSubmit: document.querySelector("#auth-submit"),
  profileForm: document.querySelector("#profile-form"),
  profileAvatar: document.querySelector("#profile-avatar"),
  profileAwardShowcase: document.querySelector("#profile-award-showcase"),
  profileAvatarInput: document.querySelector("#profile-avatar-input"),
  profileDisplayName: document.querySelector("#profile-display-name"),
  profileBirthYear: document.querySelector("#profile-birth-year"),
  profileCity: document.querySelector("#profile-city"),
  profileJourneyStart: document.querySelector("#profile-journey-start"),
  profileBio: document.querySelector("#profile-bio"),
  startOnboarding: document.querySelector("#start-onboarding"),
  exportData: document.querySelector("#export-data"),
  authSignOut: document.querySelector("#auth-sign-out"),
  imageLightbox: document.querySelector("#image-lightbox"),
  lightboxImage: document.querySelector("#lightbox-image"),
  lightboxClose: document.querySelector("#lightbox-close"),
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

  document.querySelectorAll("[data-gate-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => switchAuthMode(button.dataset.gateAuthMode));
  });

  document.querySelectorAll("[data-victory-view]").forEach((button) => {
    button.addEventListener("click", () => switchVictoryView(button.dataset.victoryView));
  });
  els.victoryFilterToggle.addEventListener("click", () => {
    state.victoryFilterOpen = !state.victoryFilterOpen;
    saveAndRender();
  });

  els.activeDate.value = state.activeDate;
  els.activeDate.addEventListener("change", (event) => {
    state.activeDate = event.target.value;
    saveAndRender();
  });

  setSelectOptions("#victory-category", state.categories);
  setSelectOptions("#victory-role", state.roles);
  document.querySelector("#victory-date").value = state.activeDate;
  renderVictoryTagSuggestions();
  renderVictoryAwards();

  document.querySelector("#victory-image").addEventListener("change", handleImageUpload);
  els.victoryEditCancel.addEventListener("click", resetVictoryForm);
  els.lightboxClose.addEventListener("click", closeImageLightbox);
  els.imageLightbox.addEventListener("click", (event) => {
    if (event.target === els.imageLightbox) closeImageLightbox();
  });
  els.victoryDetailModal.addEventListener("click", (event) => {
    if (event.target === els.victoryDetailModal) closeVictoryDetail();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.imageLightbox.hidden) closeImageLightbox();
    if (event.key === "Escape" && !els.victoryDetailModal.hidden) closeVictoryDetail();
  });
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
  els.gateAuthForm.addEventListener("submit", handleGateAuthSubmit);
  els.authForm.addEventListener("submit", handleLocalAuthSubmit);
  els.profileForm.addEventListener("submit", handleProfileSubmit);
  els.profileAvatarInput.addEventListener("change", handleAvatarUpload);
  els.startOnboarding.addEventListener("click", startOnboarding);
  els.onboardingLearn.addEventListener("click", acceptOnboardingPrompt);
  els.onboardingSkip.addEventListener("click", skipOnboardingPrompt);
  els.exportData.addEventListener("click", exportLocalData);
  els.authSignOut.addEventListener("click", handleSignOut);

  state.activeTab = "victories";
  switchTab("victories", false);
  switchAuthMode(state.authMode || "login", false);
  render();
  initializeSupabaseAuth();
}

function render() {
  renderAuthGate();
  renderAccount();
  renderOnboardingModal();
  renderToday();
  renderVictories();
  renderProgress();
  renderAwards();
  renderShadow();
  renderProfile();
}

function renderAuthGate() {
  const signedIn = Boolean(state.localAccount?.isSignedIn);
  els.authGate.hidden = signedIn;
  els.appShell.hidden = !signedIn;
  els.gateAuthNameField.hidden = state.authMode !== "register";
  els.gateAuthEmail.value = state.localAccount?.isSignedIn ? state.localAccount?.email || "" : els.gateAuthEmail.value;
  els.gateAuthPassword.value = "";
  if (state.authMode !== "register") {
    els.gateAuthName.value = "";
  }
  els.gateAuthSubmit.textContent = state.authMode === "register" ? "Зарегистрироваться" : "Войти";
}

function shouldPromptOnboarding() {
  const hasProfile = Boolean(state.profile?.displayName || state.profile?.city || state.profile?.bio);
  const hasHabit = state.habits.length > 0;
  const hasVictory = state.victories.length > 0;
  return Boolean(state.localAccount?.isSignedIn)
    && !hasHabit
    && !hasVictory
    && !state.onboardingPromptSeen
    && !state.onboardingDismissed
    && !hasProfile;
}

function renderOnboardingModal() {
  if (!els.onboardingModal) return;
  if (!onboardingMode && shouldPromptOnboarding()) {
    onboardingMode = "prompt";
  }

  els.onboardingModal.hidden = !onboardingMode;
  if (!onboardingMode) return;

  const isGuide = onboardingMode === "guide";
  els.onboardingKicker.textContent = isGuide ? "Обучение" : "Первый вход";
  els.onboardingTitle.textContent = isGuide ? "С чего начать" : "Показать короткое обучение?";
  els.onboardingText.textContent = isGuide
    ? "Три спокойных шага, чтобы дневник стал твоим, а не пустой страницей."
    : "Я проведу тебя по первым шагам: профиль, первая привычка, первая победа и шаблон привычек, если он нужен.";
  els.onboardingGuide.hidden = !isGuide;
  els.onboardingGuide.innerHTML = isGuide ? renderOnboardingGuide() : "";
  els.onboardingLearn.textContent = isGuide ? "Закончить" : "Пройти обучение";
  els.onboardingSkip.textContent = isGuide ? "Закрыть" : "Пропустить";

  els.onboardingGuide.querySelectorAll("[data-onboarding-action]").forEach((button) => {
    button.onclick = () => handleOnboardingAction(button.dataset.onboardingAction);
  });
}

function renderOnboardingGuide() {
  const hasProfile = Boolean(state.profile?.displayName || state.profile?.city || state.profile?.bio);
  const hasHabit = state.habits.length > 0;
  const hasVictory = state.victories.length > 0;
  const steps = [
    { done: hasProfile, number: "1", title: "Заполни профиль", text: "Имя, город, цель и дата старта пути.", action: "profile", button: "Открыть профиль" },
    { done: hasHabit, number: "2", title: "Добавь привычку", text: "Простую галочку или составную практику с подпунктами.", action: "habit", button: "Добавить привычку" },
    { done: hasVictory, number: "3", title: "Сохрани победу", text: "Фото, скрин или короткий текст на стену побед.", action: "victory", button: "Добавить победу" },
  ];

  return `
    <div class="guide-card-list">
      ${steps.map((step) => `
        <article class="guide-card ${step.done ? "done" : ""}">
          <span class="step-number">${step.done ? "✓" : step.number}</span>
          <div>
            <strong>${escapeHtml(step.title)}</strong>
            <p>${escapeHtml(step.text)}</p>
            <button class="ghost-action" data-onboarding-action="${step.action}" type="button">${escapeHtml(step.button)}</button>
          </div>
        </article>
      `).join("")}
    </div>
    <button class="template-card" data-onboarding-action="template" type="button">
      <span>
        <strong>Шаблон Ильи</strong>
        <small>Подъем, подмасадана, вокал, завтрак и вегетарианство. Добавляется только если сам нажмешь.</small>
      </span>
      <b>Добавить шаблон</b>
    </button>
  `;
}

function acceptOnboardingPrompt() {
  state.onboardingPromptSeen = true;
  state.onboardingDismissed = false;
  onboardingMode = onboardingMode === "guide" ? null : "guide";
  saveAndRender();
}

function skipOnboardingPrompt() {
  state.onboardingPromptSeen = true;
  state.onboardingDismissed = true;
  onboardingMode = null;
  saveAndRender();
}

function startOnboarding() {
  state.onboardingPromptSeen = true;
  state.onboardingDismissed = false;
  onboardingMode = "guide";
  saveAndRender();
}

async function handleOnboardingAction(action) {
  onboardingMode = null;
  if (action === "profile") {
    state.onboardingPromptSeen = true;
    saveState();
    switchTab("profile");
    return;
  }
  if (action === "habit") {
    state.onboardingPromptSeen = true;
    saveState();
    switchTab("add");
    switchForm("habit");
    document.querySelector("#habit-name").focus();
    return;
  }
  if (action === "victory") {
    state.onboardingPromptSeen = true;
    saveState();
    switchTab("add");
    switchForm("victory");
    document.querySelector("#victory-text").focus();
    return;
  }
  if (action === "template") {
    state.onboardingPromptSeen = true;
    await installStarterTemplate();
    return;
  }
  if (action === "dismiss") {
    state.onboardingDismissed = true;
    saveAndRender();
  }
}

async function installStarterTemplate() {
  if (state.habits.length && !confirm("Добавить шаблон к уже созданным привычкам?")) {
    return;
  }

  const createdHabits = starterHabits.map((habit) => ({
    ...habit,
    id: uniqueHabitId(habit.name),
    children: habit.children?.map((child, index) => ({
      ...child,
      id: uniqueChildId(child.name, index),
    })),
  }));

  state.habits.push(...createdHabits);
  state.coreHabitIds = [
    ...(state.coreHabitIds || []),
    ...createdHabits.map((habit) => habit.id),
  ];
  saveAndRender();

  if (supabaseClient && supabaseUser) {
    for (const habit of createdHabits) {
      await createHabitInSupabase(habit, state.habits.indexOf(habit));
    }
  }

  toast("Шаблон привычек добавлен.");
}

function renderAccount() {
  const name = state.profile?.displayName || state.localAccount?.email || "Локальный режим";
  const signedIn = Boolean(state.localAccount?.isSignedIn);
  const connected = isSupabaseConfigured();

  els.accountName.textContent = signedIn ? name : connected ? "Supabase подключен" : "Локальный режим";
  els.accountMode.textContent = connected
    ? signedIn ? `Вход: ${state.localAccount?.email}` : "Supabase настроен, войди или зарегистрируйся"
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

  if (!state.habits.length) {
    els.habitList.innerHTML = `<div class="empty-state">Привычек пока нет. Открой вкладку "Добавить" и создай первую привычку.</div>`;
    return;
  }

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
  document.querySelectorAll("[data-victory-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.victoryView === getVictoryView());
  });

  const tagFilters = getKnownVictoryTags();
  const categoryFilters = getSelectedCategories();
  const tagSelections = getSelectedTags();
  const filterCount = categoryFilters.length + tagSelections.length;
  els.victoryFilterToggle.textContent = filterCount ? `Фильтр ${filterCount}` : "Фильтр";
  els.victoryFilterToggle.classList.toggle("active", Boolean(filterCount));
  els.victoryFilterPanel.hidden = !state.victoryFilterOpen;
  els.victoryFilterPanel.innerHTML = `
    <div class="filter-panel-head">
      <strong>Категории</strong>
      <button class="ghost-action compact-action" data-clear-victory-filters type="button">Все</button>
    </div>
    <div class="filter-checks">
      ${state.categories.map((category) => `
        <label class="filter-check">
          <input type="checkbox" data-category-filter="${escapeHtml(category)}" ${categoryFilters.includes(category) ? "checked" : ""}>
          <span>${escapeHtml(category)}</span>
        </label>
      `).join("")}
    </div>
  `;
  els.victoryTagFilters.innerHTML = tagFilters.map((tag) => {
    const value = `tag:${tag}`;
    return `<button class="filter-chip tag-chip ${tagSelections.includes(tag) ? "active" : ""}" data-tag-filter="${escapeHtml(tag)}" type="button">#${escapeHtml(tag)}</button>`;
  }).join("");

  els.victoryFilterPanel.querySelectorAll("[data-category-filter]").forEach((input) => {
    input.addEventListener("change", () => toggleCategoryFilter(input.dataset.categoryFilter));
  });
  els.victoryFilterPanel.querySelector("[data-clear-victory-filters]").addEventListener("click", clearVictoryFilters);
  els.victoryTagFilters.querySelectorAll("[data-tag-filter]").forEach((button) => {
    button.addEventListener("click", () => toggleTagFilter(button.dataset.tagFilter));
  });

  const victories = [...state.victories]
    .filter(matchesVictoryFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!victories.length) {
    els.victoryGrid.className = "victory-grid";
    els.victoryGrid.innerHTML = `<div class="empty-state">Пока здесь пусто. Добавь первую победу с фото или текстом.</div>`;
    return;
  }

  const view = getVictoryView();
  els.victoryGrid.className = `victory-grid ${view}-view`;
  els.victoryGrid.innerHTML = victories.map((victory) => renderVictoryCard(victory, view)).join("");
  els.victoryGrid.querySelectorAll("[data-open-victory]").forEach((button) => {
    button.addEventListener("click", () => openVictoryDetail(button.dataset.openVictory));
  });
  els.victoryGrid.querySelectorAll("[data-edit-victory]").forEach((button) => {
    button.addEventListener("click", () => editVictory(button.dataset.editVictory));
  });
  els.victoryGrid.querySelectorAll("[data-delete-victory]").forEach((button) => {
    button.addEventListener("click", () => deleteVictory(button.dataset.deleteVictory));
  });
  els.victoryGrid.querySelectorAll("[data-view-victory-image]").forEach((button) => {
    button.addEventListener("click", () => openImageLightbox(button.dataset.viewVictoryImage));
  });
}

function renderVictoryCard(victory, view = getVictoryView()) {
  const media = victory.image
    ? `<button class="victory-image-button" data-view-victory-image="${escapeHtml(victory.image)}" type="button" aria-label="Открыть фото победы"><img src="${escapeHtml(victory.image)}" alt=""></button>`
    : `<span>${escapeHtml(victory.category)}</span>`;
  const tags = [victory.role, ...(victory.tags || [])].filter(Boolean);

  if (view === "tile") {
    const title = victory.text.length > 58 ? `${victory.text.slice(0, 58)}...` : victory.text;
    const tileMedia = victory.image
      ? `<img src="${escapeHtml(victory.image)}" alt="">`
      : `<span>${escapeHtml(victory.category)}</span>`;
    return `
      <button class="victory-card victory-tile" data-open-victory="${victory.id}" type="button">
        <span class="victory-media">${tileMedia}</span>
        <span class="victory-body">
          <span class="victory-date">${formatDate(victory.date)} · ${escapeHtml(victory.category)}</span>
          <strong>${escapeHtml(title)}</strong>
        </span>
      </button>
    `;
  }

  return `
    <article class="victory-card">
      <div class="victory-media">${media}</div>
      <div class="victory-body">
        <div class="victory-date">${formatDate(victory.date)} · ${escapeHtml(victory.category)}</div>
        <p>${escapeHtml(victory.text)}</p>
        <div class="tag-row">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="card-actions">
          <button class="ghost-action" data-edit-victory="${victory.id}" type="button">Редактировать</button>
          <button class="danger-action" data-delete-victory="${victory.id}" type="button">Удалить</button>
        </div>
      </div>
    </article>
  `;
}

function getVictoryFilterValue() {
  if (!state.victoryFilter || state.victoryFilter === "Все") return "Все";
  if (state.victoryFilter.startsWith("category:") || state.victoryFilter.startsWith("tag:")) return state.victoryFilter;
  if (state.categories.includes(state.victoryFilter)) return `category:${state.victoryFilter}`;
  return state.victoryFilter;
}

function getSelectedCategories() {
  return (state.victoryCategoryFilters || []).filter((category) => state.categories.includes(category));
}

function getSelectedTags() {
  const known = new Set(getKnownVictoryTags());
  return (state.victoryTagFilters || []).map(normalizeTag).filter((tag) => known.has(tag));
}

function toggleCategoryFilter(category) {
  const selected = new Set(getSelectedCategories());
  if (selected.has(category)) {
    selected.delete(category);
  } else {
    selected.add(category);
  }
  state.victoryCategoryFilters = [...selected];
  state.victoryFilter = "Все";
  saveAndRender();
}

function toggleTagFilter(tag) {
  const normalized = normalizeTag(tag);
  const selected = new Set(getSelectedTags());
  if (selected.has(normalized)) {
    selected.delete(normalized);
  } else {
    selected.add(normalized);
  }
  state.victoryTagFilters = [...selected];
  state.victoryFilter = "Все";
  saveAndRender();
}

function clearVictoryFilters() {
  state.victoryCategoryFilters = [];
  state.victoryTagFilters = [];
  state.victoryFilter = "Все";
  state.victoryFilterOpen = false;
  saveAndRender();
}

function getVictoryView() {
  return state.victoryView === "list" ? "list" : "tile";
}

function switchVictoryView(view) {
  state.victoryView = view === "list" ? "list" : "tile";
  saveAndRender();
}

function matchesVictoryFilter(victory) {
  const selectedCategories = getSelectedCategories();
  const selectedTags = getSelectedTags();
  const categoryMatches = !selectedCategories.length || selectedCategories.includes(victory.category);
  const tagMatches = !selectedTags.length || (victory.tags || []).some((item) => selectedTags.includes(normalizeTag(item)));
  if (selectedCategories.length || selectedTags.length) return categoryMatches && tagMatches;

  const filter = getVictoryFilterValue();
  if (filter === "Все") return true;
  if (filter.startsWith("category:")) return victory.category === filter.slice("category:".length);
  if (filter.startsWith("tag:")) {
    const tag = normalizeTag(filter.slice("tag:".length));
    return (victory.tags || []).some((item) => normalizeTag(item) === tag);
  }
  return true;
}

function getKnownVictoryTags() {
  const tags = new Set(quickVictoryTags.map(normalizeTag));
  state.victories.forEach((victory) => {
    (victory.tags || []).forEach((tag) => tags.add(normalizeTag(tag)));
  });
  return [...tags].filter(Boolean).sort((a, b) => a.localeCompare(b, "ru"));
}

function renderVictoryTagSuggestions() {
  els.victoryTagSuggestions.innerHTML = quickVictoryTags.map((tag) => `
    <button class="quick-chip" data-victory-tag="${escapeHtml(tag)}" type="button">#${escapeHtml(tag)}</button>
  `).join("");
  els.victoryTagSuggestions.querySelectorAll("[data-victory-tag]").forEach((button) => {
    button.addEventListener("click", () => toggleVictoryTag(button.dataset.victoryTag));
  });
}

function renderVictoryAwards() {
  els.victoryAwards.innerHTML = awards.map((award) => `
    <button class="award-chip" data-award-id="${escapeHtml(award.id)}" type="button">
      <img src="${escapeHtml(award.image)}" alt="">
      <span><strong>${escapeHtml(award.title)}</strong><small>${escapeHtml(award.milestone)}</small></span>
    </button>
  `).join("");
  els.victoryAwards.querySelectorAll("[data-award-id]").forEach((button) => {
    button.addEventListener("click", () => applyVictoryAward(button.dataset.awardId));
  });
}

function getVictoryTagsInput() {
  return parseTags(document.querySelector("#victory-tags").value);
}

function setVictoryTagsInput(tags) {
  document.querySelector("#victory-tags").value = [...new Set(tags.map(normalizeTag).filter(Boolean))].join(", ");
}

function toggleVictoryTag(tag) {
  const normalized = normalizeTag(tag);
  const tags = getVictoryTagsInput();
  const exists = tags.some((item) => normalizeTag(item) === normalized);
  setVictoryTagsInput(exists ? tags.filter((item) => normalizeTag(item) !== normalized) : [...tags, normalized]);
}

function applyVictoryAward(awardId) {
  const award = awards.find((item) => item.id === awardId);
  if (!award) return;
  pendingImage = { preview: award.image };
  els.imagePreview.innerHTML = `<img src="${escapeHtml(award.image)}" alt="${escapeHtml(award.title)}">`;
  setVictoryTagsInput([...getVictoryTagsInput(), ...award.tags]);
  toast(`Награда "${award.title}" добавлена.`);
}

function getAwardForMilestone(days) {
  return awards.find((award) => award.days === days) || null;
}

function openVictoryDetail(id) {
  const victory = state.victories.find((item) => item.id === id);
  if (!victory) return;

  const tags = [victory.role, ...(victory.tags || [])].filter(Boolean);
  const media = victory.image
    ? `<button class="detail-media-button" data-view-victory-image="${escapeHtml(victory.image)}" type="button" aria-label="Открыть фото"><img src="${escapeHtml(victory.image)}" alt=""></button>`
    : `<div class="detail-media-placeholder">${escapeHtml(victory.category)}</div>`;

  els.victoryDetailDialog.innerHTML = `
    <button class="detail-close" data-close-victory-detail type="button" aria-label="Закрыть">×</button>
    <div class="victory-detail-media">${media}</div>
    <div class="victory-detail-body">
      <div class="victory-date">${formatDate(victory.date)} · ${escapeHtml(victory.category)}</div>
      <h2>${escapeHtml(victory.text)}</h2>
      <div class="tag-row">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="card-actions">
        <button class="ghost-action" data-edit-victory="${victory.id}" type="button">Редактировать</button>
        <button class="danger-action" data-delete-victory="${victory.id}" type="button">Удалить</button>
      </div>
    </div>
  `;

  els.victoryDetailModal.hidden = false;
  document.body.classList.add("modal-open");
  els.victoryDetailDialog.querySelector("[data-close-victory-detail]").addEventListener("click", closeVictoryDetail);
  els.victoryDetailDialog.querySelectorAll("[data-view-victory-image]").forEach((button) => {
    button.addEventListener("click", () => openImageLightbox(button.dataset.viewVictoryImage));
  });
  els.victoryDetailDialog.querySelectorAll("[data-edit-victory]").forEach((button) => {
    button.addEventListener("click", () => {
      closeVictoryDetail();
      editVictory(button.dataset.editVictory);
    });
  });
  els.victoryDetailDialog.querySelectorAll("[data-delete-victory]").forEach((button) => {
    button.addEventListener("click", async () => {
      const deleted = await deleteVictory(button.dataset.deleteVictory);
      if (deleted) closeVictoryDetail();
    });
  });
}

function closeVictoryDetail() {
  els.victoryDetailModal.hidden = true;
  els.victoryDetailDialog.innerHTML = "";
  document.body.classList.remove("modal-open");
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

function renderAwards() {
  if (!els.awardsGrid) return;
  const bestStreak = getBestOverallStreak();
  const unlocked = getUnlockedAwards(bestStreak);
  const topAward = unlocked.at(-1) || awards[0];
  const nextAward = awards.find((award) => bestStreak < award.days);

  els.awardsHeroCard.innerHTML = `
    <img src="${escapeHtml(topAward.image)}" alt="${escapeHtml(topAward.title)}">
    <strong>${escapeHtml(unlocked.length ? topAward.title : "Первая награда ждет")}</strong>
    <span>${escapeHtml(unlocked.length ? topAward.milestone : "начни серию и открой Bronze")}</span>
  `;

  els.awardsStats.innerHTML = [
    { value: unlocked.length, label: "открыто" },
    { value: awards.length, label: "всего" },
    { value: bestStreak, label: "лучшая серия" },
    { value: nextAward ? nextAward.days - bestStreak : "✓", label: nextAward ? "дней до следующей" : "все рубежи" },
  ].map((item) => `
    <article class="award-stat-card">
      <strong>${escapeHtml(String(item.value))}</strong>
      <span>${escapeHtml(item.label)}</span>
    </article>
  `).join("");

  els.awardsTrack.innerHTML = awardPathLevels.map((level) => {
    const award = awards.find((item) => item.days === level.days);
    const isUnlocked = bestStreak >= level.days;
    return `
      <div class="award-level ${isUnlocked ? "unlocked" : "locked"}">
        ${award ? `<img src="${escapeHtml(award.image)}" alt="">` : `<span>${level.days}</span>`}
        <strong>${escapeHtml(level.title)}</strong>
        <small>${level.days} дн.</small>
      </div>
    `;
  }).join("");

  els.awardsGrid.innerHTML = awards.map((award) => {
    const isUnlocked = bestStreak >= award.days;
    const remaining = Math.max(0, award.days - bestStreak);
    return `
      <article class="award-collection-card ${isUnlocked ? "unlocked" : "locked"}">
        <img src="${escapeHtml(award.image)}" alt="${escapeHtml(award.title)}">
        <strong>${escapeHtml(award.title)}</strong>
        <span>${escapeHtml(award.rank)} · ${escapeHtml(award.milestone)}</span>
        <p>${escapeHtml(award.description)}</p>
        <small>${isUnlocked ? "Открыто" : `Осталось ${remaining} дн.`}</small>
      </article>
    `;
  }).join("");
}

function renderProfileAwards() {
  if (!els.profileAwardShowcase) return;
  const bestStreak = getBestOverallStreak();
  const unlocked = getUnlockedAwards(bestStreak);
  const topAward = unlocked.at(-1);

  if (!topAward) {
    els.profileAwardShowcase.innerHTML = `
      <div class="profile-rank-card empty">
        <strong>Награды ждут</strong>
        <span>Закрой 7 дней подряд, чтобы открыть первый знак.</span>
      </div>
    `;
    return;
  }

  els.profileAwardShowcase.innerHTML = `
    <div class="profile-rank-card">
      <img src="${escapeHtml(topAward.image)}" alt="${escapeHtml(topAward.title)}">
      <div>
        <strong>${escapeHtml(topAward.rank)} · ${escapeHtml(topAward.title)}</strong>
        <span>Лучший рубеж: ${bestStreak} дн.</span>
      </div>
    </div>
    <div class="profile-award-mini-row">
      ${unlocked.slice(-5).map((award) => `
        <span class="profile-award-mini" title="${escapeHtml(award.title)}">
          <img src="${escapeHtml(award.image)}" alt="">
        </span>
      `).join("")}
    </div>
  `;
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
  els.connectionStatus.innerHTML = connected && signedIn
    ? `<strong>Вход выполнен</strong><span>Профиль, привычки, галочки, победы и Тень сохраняются в Supabase. Фото подключим следующим шагом.</span>`
    : connected
    ? `<strong>Supabase настроен</strong><span>Можно зарегистрироваться или войти через настоящий аккаунт.</span>`
    : `<strong>Локальный режим</strong><span>Профиль и дневник пока живут только в этом браузере.</span>`;

  els.authNameField.hidden = state.authMode !== "register";
  els.authSubmit.textContent = connected
    ? state.authMode === "register" ? "Зарегистрироваться" : "Войти"
    : state.authMode === "register" ? "Создать локальный профиль" : "Войти локально";
  els.authEmail.value = state.localAccount?.email || "";
  els.authPassword.value = "";
  if (state.authMode !== "register") {
    els.authName.value = "";
  }

  els.profileDisplayName.value = profile.displayName || "";
  els.profileBirthYear.value = profile.birthYear || "";
  els.profileCity.value = profile.city || "";
  els.profileJourneyStart.value = profile.journeyStartDate || state.journeyStartDate || JOURNEY_START_DATE;
  els.profileBio.value = profile.bio || "";
  setAvatar(els.profileAvatar, profile.avatar, profile.displayName || state.localAccount?.email || "ДП");
  renderProfileAwards();

  if (signedIn) {
    els.authSubmit.textContent = connected ? "Войти под другим email" : "Обновить вход";
  }
  els.authSignOut.hidden = !signedIn;
}

async function handleVictorySubmit(event) {
  event.preventDefault();
  const text = document.querySelector("#victory-text").value.trim();
  if (!text) {
    toast("Напиши текст победы.");
    return;
  }

  let image = pendingImage;
  if (pendingImage?.file && supabaseClient && supabaseUser) {
    const uploaded = await uploadMediaFile(pendingImage.file, "victories");
    if (!uploaded) return;
    image = uploaded;
  } else if (pendingImage?.preview) {
    image = pendingImage.preview;
  }

  if (editingVictoryId) {
    const existing = state.victories.find((item) => item.id === editingVictoryId);
    if (!existing) {
      resetVictoryForm();
      toast("Победа не найдена.");
      return;
    }

    const updatedVictory = {
      ...existing,
      date: document.querySelector("#victory-date").value || state.activeDate,
      text,
      category: document.querySelector("#victory-category").value,
      role: document.querySelector("#victory-role").value,
      tags: getVictoryTagsInput(),
      image: image || existing.image || null,
    };

    if (supabaseClient && supabaseUser) {
      const remoteVictory = await updateVictoryInSupabase(updatedVictory);
      if (!remoteVictory) return;
      const index = state.victories.findIndex((item) => item.id === editingVictoryId);
      state.victories[index] = remoteVictory;
    } else {
      const index = state.victories.findIndex((item) => item.id === editingVictoryId);
      state.victories[index] = updatedVictory;
    }

    resetVictoryForm();
    saveAndRender();
    switchTab("victories");
    toast("Победа обновлена.");
    return;
  }

  const victory = {
    id: uid(),
    date: document.querySelector("#victory-date").value || state.activeDate,
    text,
    category: document.querySelector("#victory-category").value,
    role: document.querySelector("#victory-role").value,
    tags: getVictoryTagsInput(),
    image,
    source: "manual",
  };

  state.victories.push(victory);
  if (supabaseClient && supabaseUser) {
    await createVictoryInSupabase(victory);
  }

  resetVictoryForm();
  saveAndRender();
  switchTab("victories");
  toast("Победа сохранена.");
}

function editVictory(id) {
  const victory = state.victories.find((item) => item.id === id);
  if (!victory) return;

  editingVictoryId = id;
  pendingImage = null;
  switchTab("add");
  switchForm("victory");

  document.querySelector("#victory-text").value = victory.text || "";
  document.querySelector("#victory-date").value = victory.date || state.activeDate;
  document.querySelector("#victory-category").value = victory.category || state.categories[0];
  document.querySelector("#victory-role").value = victory.role || state.roles[0];
  document.querySelector("#victory-tags").value = (victory.tags || []).join(", ");
  els.imagePreview.innerHTML = victory.image
    ? `<img src="${escapeHtml(victory.image)}" alt="">`
    : "Фото появится здесь";
  els.victorySubmit.textContent = "Сохранить изменения";
  els.victoryEditCancel.hidden = false;
  document.querySelector("#victory-text").focus();
}

function resetVictoryForm() {
  editingVictoryId = null;
  pendingImage = null;
  els.victoryForm.reset();
  document.querySelector("#victory-date").value = state.activeDate;
  els.imagePreview.textContent = "Фото появится здесь";
  els.victorySubmit.textContent = "Сохранить победу";
  els.victoryEditCancel.hidden = true;
}

function openImageLightbox(imageUrl) {
  if (!imageUrl) return;
  els.lightboxImage.src = imageUrl;
  els.imageLightbox.hidden = false;
  document.body.classList.add("lightbox-open");
}

function closeImageLightbox() {
  els.imageLightbox.hidden = true;
  els.lightboxImage.src = "";
  document.body.classList.remove("lightbox-open");
}

async function handleShadowSubmit(event) {
  event.preventDefault();
  const situation = document.querySelector("#shadow-situation").value.trim();
  if (!situation) {
    toast("Запиши ситуацию.");
    return;
  }

  const shadow = {
    id: uid(),
    date: state.activeDate,
    situation,
    pattern: document.querySelector("#shadow-pattern").value.trim(),
    fear: document.querySelector("#shadow-fear").value.trim(),
    mature: document.querySelector("#shadow-mature").value.trim(),
    repair: document.querySelector("#shadow-repair").value.trim(),
    status: "открыто",
    tags: inferShadowTags([situation, document.querySelector("#shadow-pattern").value, document.querySelector("#shadow-fear").value].join(" ")),
  };

  state.shadows.push(shadow);
  if (supabaseClient && supabaseUser) {
    await createShadowInSupabase(shadow);
  }

  els.shadowForm.reset();
  saveAndRender();
  switchTab("shadow");
  toast("Запись добавлена в Тень.");
}

async function handleHabitSubmit(event) {
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

  const habit = {
    id: uniqueHabitId(name),
    name,
    type: compound && children.length ? "compound" : "simple",
    challenge: 90,
    color: "green",
    children: compound ? children : undefined,
  };

  state.habits.push(habit);

  els.habitForm.reset();
  draftHabitChildren = [];
  renderHabitChildBuilder();
  saveAndRender();
  switchTab("today");

  if (supabaseClient && supabaseUser) {
    await createHabitInSupabase(habit);
  }

  toast("Привычка добавлена.");
}

async function handleGateAuthSubmit(event) {
  event.preventDefault();
  const email = els.gateAuthEmail.value.trim();
  const password = els.gateAuthPassword.value.trim();
  const name = els.gateAuthName.value.trim();
  await submitAuth(email, password, name);
}

async function handleLocalAuthSubmit(event) {
  event.preventDefault();
  const email = els.authEmail.value.trim();
  const password = els.authPassword.value.trim();
  const name = els.authName.value.trim();
  await submitAuth(email, password, name);
}

async function submitAuth(email, password, name = "") {
  if (!email || !password) {
    toast("Укажи email и пароль.");
    return;
  }

  if (password.length < 6) {
    toast("Пароль должен быть минимум 6 символов.");
    return;
  }

  if (supabaseClient) {
    await handleSupabaseAuth(email, password, name);
    return;
  }

  state.localAccount = {
    email,
    isSignedIn: true,
  };

  if (state.authMode === "register" && name) {
    state.profile.displayName = name;
  }

  saveAndRender();
  toast(state.authMode === "register" ? "Локальный профиль создан." : "Вход выполнен локально.");
}

async function handleProfileSubmit(event) {
  event.preventDefault();
  const birthYear = els.profileBirthYear.value.trim();
  const journeyStartDate = els.profileJourneyStart.value || JOURNEY_START_DATE;

  state.profile = {
    ...(state.profile || {}),
    displayName: els.profileDisplayName.value.trim(),
    birthYear,
    city: els.profileCity.value.trim(),
    bio: els.profileBio.value.trim(),
    journeyStartDate,
  };
  state.journeyStartDate = journeyStartDate;

  if (supabaseClient && supabaseUser) {
    const saved = await saveProfileToSupabase();
    if (!saved) return;
  }

  saveAndRender();
  toast(supabaseClient && supabaseUser ? "Профиль сохранен в Supabase." : "Профиль сохранен.");
}

async function handleAvatarUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!validateImageFile(file)) {
    event.target.value = "";
    return;
  }

  if (supabaseClient && supabaseUser) {
    const uploaded = await uploadMediaFile(file, "avatars");
    if (!uploaded) return;
    state.profile = {
      ...(state.profile || {}),
      avatar: uploaded,
    };
    await saveProfileToSupabase();
    saveAndRender();
    toast("Аватарка загружена в Supabase.");
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
    pendingImage = {
      file,
      preview: reader.result,
    };
    els.imagePreview.innerHTML = `<img src="${pendingImage.preview}" alt="">`;
  };
  reader.readAsDataURL(file);
}

async function initializeSupabaseAuth() {
  if (!isSupabaseConfigured()) return;
  if (!window.supabase?.createClient) {
    toast("Supabase SDK не загрузился. Проверь интернет и обнови страницу.");
    return;
  }

  const config = window.DP_CONFIG;
  supabaseClient = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    toast(error.message);
    return;
  }

  await applySupabaseSession(data.session);

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    applySupabaseSession(session);
  });
}

async function handleSupabaseAuth(email, password, displayName = "") {
  if (state.authMode === "register") {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || state.profile?.displayName || "",
        },
      },
    });

    if (error) {
      toast(friendlyAuthError(error.message));
      return;
    }

    if (displayName) {
      state.profile.displayName = displayName;
    }

    await applySupabaseSession(data.session);
    if (data.session) {
      await saveProfileToSupabase();
      toast("Регистрация готова. Профиль создан.");
    } else {
      state.localAccount = { email, isSignedIn: false };
      saveAndRender();
      toast("Аккаунт создан, но Supabase пока требует подтверждение email. Сейчас отключаем это в настройках.");
    }
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    toast(friendlyAuthError(error.message));
    return;
  }
  await applySupabaseSession(data.session);
  toast("Вход выполнен через Supabase.");
}

async function applySupabaseSession(session) {
  const nextUser = session?.user || null;
  const previousUserId = state.localAccount?.supabaseUserId || "";
  const nextUserId = nextUser?.id || "";
  const changedUser = previousUserId && nextUserId && previousUserId !== nextUserId;

  if (changedUser) {
    hasSyncedHabits = false;
    hasSyncedJournal = false;
    state.onboardingDismissed = false;
    state.onboardingPromptSeen = false;
    state.profile = {
      displayName: "",
      avatar: null,
      birthYear: "",
      city: "",
      bio: "",
      journeyStartDate: JOURNEY_START_DATE,
    };
    state.habits = [];
    state.checks = {};
    state.victories = [];
    state.shadows = [];
    state.coreHabitIds = [];
  }

  supabaseUser = nextUser;
  state.localAccount = {
    email: supabaseUser?.email || state.localAccount?.email || "",
    isSignedIn: Boolean(supabaseUser),
    supabaseUserId: nextUserId,
  };

  if (supabaseUser) {
    await loadProfileFromSupabase();
    await syncHabitsAndChecksWithSupabase();
    await syncJournalWithSupabase();
  } else {
    hasSyncedHabits = false;
    hasSyncedJournal = false;
  }

  saveAndRender();
}

async function loadProfileFromSupabase() {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("display_name, avatar_url, birth_year, city, bio, journey_start_date")
    .eq("id", supabaseUser.id)
    .maybeSingle();

  if (error) {
    toast(error.message);
    return;
  }

  if (!data) {
    await saveProfileToSupabase();
    return;
  }

  state.profile = {
    ...(state.profile || {}),
    displayName: data.display_name || state.profile?.displayName || "",
    avatar: data.avatar_url || state.profile?.avatar || null,
    birthYear: data.birth_year || "",
    city: data.city || "",
    bio: data.bio || "",
    journeyStartDate: data.journey_start_date || JOURNEY_START_DATE,
  };
  state.journeyStartDate = state.profile.journeyStartDate;
}

async function saveProfileToSupabase() {
  if (!supabaseClient || !supabaseUser) {
    toast("Сначала войди или зарегистрируйся.");
    return false;
  }

  const profile = state.profile || {};
  const payload = {
    id: supabaseUser.id,
    display_name: profile.displayName || null,
    avatar_url: profile.avatar?.startsWith("http") ? profile.avatar : null,
    birth_year: profile.birthYear ? Number(profile.birthYear) : null,
    city: profile.city || null,
    bio: profile.bio || null,
    journey_start_date: profile.journeyStartDate || state.journeyStartDate || JOURNEY_START_DATE,
  };

  const { error } = await supabaseClient.from("profiles").upsert(payload);
  if (error) {
    toast(error.message);
    return false;
  }
  return true;
}

async function syncHabitsAndChecksWithSupabase() {
  if (hasSyncedHabits || !supabaseClient || !supabaseUser) return;

  const remote = await loadHabitsFromSupabase();
  if (remote === null) return;

  if (remote.length) {
    state.habits = remote;
    state.coreHabitIds = remote.filter((habit) => habit.isCore).map((habit) => habit.id);
    state.habits.forEach((habit) => delete habit.isCore);
    await loadChecksFromSupabase();
  } else {
    state.habits = [];
    state.coreHabitIds = [];
    state.checks = {};
  }

  hasSyncedHabits = true;
  saveState();
  render();
}

async function loadHabitsFromSupabase() {
  const { data: habits, error } = await supabaseClient
    .from("habits")
    .select("id, name, type, challenge_days, color, is_core, sort_order")
    .eq("user_id", supabaseUser.id)
    .order("sort_order", { ascending: true });

  if (error) {
    toast(error.message);
    return null;
  }

  const { data: children, error: childError } = await supabaseClient
    .from("habit_children")
    .select("id, habit_id, name, sort_order")
    .eq("user_id", supabaseUser.id)
    .order("sort_order", { ascending: true });

  if (childError) {
    toast(childError.message);
    return null;
  }

  const childrenByHabit = (children || []).reduce((groups, child) => {
    groups[child.habit_id] = groups[child.habit_id] || [];
    groups[child.habit_id].push({ id: child.id, name: child.name });
    return groups;
  }, {});

  return (habits || []).map((habit) => ({
    id: habit.id,
    name: habit.name,
    type: habit.type,
    challenge: habit.challenge_days,
    color: habit.color,
    isCore: habit.is_core,
    children: habit.type === "compound" ? childrenByHabit[habit.id] || [] : undefined,
  }));
}

async function createHabitInSupabase(habit, sortOrder = state.habits.indexOf(habit), replaceLocal = true) {
  if (!supabaseClient || !supabaseUser) return null;

  const oldHabitId = habit.id;
  const oldChildren = habit.children || [];
  const { data, error } = await supabaseClient
    .from("habits")
    .insert({
      user_id: supabaseUser.id,
      name: habit.name,
      type: habit.type,
      challenge_days: habit.challenge || 90,
      color: habit.color || "green",
      is_core: (state.coreHabitIds || []).includes(oldHabitId),
      sort_order: sortOrder < 0 ? state.habits.length : sortOrder,
    })
    .select("id, name, type, challenge_days, color, is_core")
    .single();

  if (error) {
    toast(error.message);
    return null;
  }

  const remoteHabit = {
    id: data.id,
    name: data.name,
    type: data.type,
    challenge: data.challenge_days,
    color: data.color,
    children: data.type === "compound" ? [] : undefined,
  };

  if (data.type === "compound" && oldChildren.length) {
    const rows = oldChildren.map((child, index) => ({
      habit_id: data.id,
      user_id: supabaseUser.id,
      name: child.name,
      sort_order: index,
    }));
    const { data: children, error: childError } = await supabaseClient
      .from("habit_children")
      .insert(rows)
      .select("id, name, sort_order")
      .order("sort_order", { ascending: true });

    if (childError) {
      toast(childError.message);
      return null;
    }

    remoteHabit.children = (children || []).map((child) => ({ id: child.id, name: child.name }));
  }

  if (replaceLocal) {
    const habitIndex = state.habits.findIndex((item) => item.id === oldHabitId);
    const childIdMap = {};
    oldChildren.forEach((child, index) => {
      childIdMap[`${oldHabitId}:${child.id}`] = remoteHabit.children?.[index]?.id;
    });

    if (habitIndex >= 0) state.habits[habitIndex] = remoteHabit;
    state.coreHabitIds = (state.coreHabitIds || []).map((id) => id === oldHabitId ? remoteHabit.id : id);
    remapCheckIds({ [oldHabitId]: remoteHabit.id }, childIdMap);
    saveAndRender();
  }

  return remoteHabit;
}

function remapCheckIds(habitIdMap, childIdMap) {
  Object.entries(state.checks || {}).forEach(([date, dayChecks]) => {
    Object.entries(dayChecks).forEach(([oldHabitId, entry]) => {
      const newHabitId = habitIdMap[oldHabitId];
      if (!newHabitId) return;

      const nextEntry = { ...entry };
      if (entry.children) {
        nextEntry.children = {};
        Object.entries(entry.children).forEach(([oldChildId, done]) => {
          const newChildId = childIdMap[`${oldHabitId}:${oldChildId}`];
          if (newChildId) nextEntry.children[newChildId] = done;
        });
      }

      dayChecks[newHabitId] = nextEntry;
      delete dayChecks[oldHabitId];
    });
    state.checks[date] = dayChecks;
  });
}

async function loadChecksFromSupabase() {
  const { data, error } = await supabaseClient
    .from("habit_checks")
    .select("habit_id, child_id, check_date, done")
    .eq("user_id", supabaseUser.id)
    .eq("done", true);

  if (error) {
    toast(error.message);
    return false;
  }

  state.checks = {};
  (data || []).forEach((row) => {
    state.checks[row.check_date] = state.checks[row.check_date] || {};
    const day = state.checks[row.check_date];
    if (row.child_id) {
      day[row.habit_id] = day[row.habit_id] || { children: {} };
      day[row.habit_id].children[row.child_id] = true;
    } else {
      day[row.habit_id] = { done: true };
    }
  });
  return true;
}

async function pushAllChecksToSupabase() {
  for (const date of Object.keys(state.checks || {})) {
    for (const habitId of Object.keys(state.checks[date] || {})) {
      await saveHabitCheckToSupabase(habitId, date);
    }
  }
}

async function saveHabitCheckToSupabase(habitId, date) {
  if (!supabaseClient || !supabaseUser || !hasSyncedHabits) return true;

  const habit = state.habits.find((item) => item.id === habitId);
  if (!habit) return false;

  const { error: deleteError } = await supabaseClient
    .from("habit_checks")
    .delete()
    .eq("user_id", supabaseUser.id)
    .eq("habit_id", habitId)
    .eq("check_date", date);

  if (deleteError) {
    toast(deleteError.message);
    return false;
  }

  const entry = state.checks[date]?.[habitId];
  const rows = [];
  if (habit.type === "compound") {
    (habit.children || []).forEach((child) => {
      if (entry?.children?.[child.id]) {
        rows.push({
          user_id: supabaseUser.id,
          habit_id: habit.id,
          child_id: child.id,
          check_date: date,
          done: true,
        });
      }
    });
  } else if (entry?.done) {
    rows.push({
      user_id: supabaseUser.id,
      habit_id: habit.id,
      child_id: null,
      check_date: date,
      done: true,
    });
  }

  if (!rows.length) return true;

  const { error } = await supabaseClient.from("habit_checks").insert(rows);
  if (error) {
    toast(error.message);
    return false;
  }
  return true;
}

async function syncJournalWithSupabase() {
  if (hasSyncedJournal || !supabaseClient || !supabaseUser) return;

  const [remoteVictories, remoteShadows] = await Promise.all([
    loadVictoriesFromSupabase(),
    loadShadowsFromSupabase(),
  ]);

  if (remoteVictories === null || remoteShadows === null) return;

  if (remoteVictories.length) {
    state.victories = remoteVictories;
  } else {
    state.victories = [];
  }

  if (remoteShadows.length) {
    state.shadows = remoteShadows;
  } else {
    state.shadows = [];
  }

  hasSyncedJournal = true;
  saveState();
  render();
}

async function loadVictoriesFromSupabase() {
  const { data, error } = await supabaseClient
    .from("victories")
    .select("id, victory_date, text, category, role, tags, image_url, source, created_at")
    .eq("user_id", supabaseUser.id)
    .order("victory_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    toast(error.message);
    return null;
  }

  return (data || []).map((victory) => ({
    id: victory.id,
    date: victory.victory_date,
    text: victory.text,
    category: victory.category || "Дисциплина",
    role: victory.role || "",
    tags: victory.tags || [],
    image: victory.image_url || null,
    source: victory.source || "manual",
  }));
}

async function loadShadowsFromSupabase() {
  const { data, error } = await supabaseClient
    .from("shadow_entries")
    .select("id, entry_date, situation, pattern, fear, mature_action, repair_step, status, tags, converted_victory_id, created_at")
    .eq("user_id", supabaseUser.id)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    toast(error.message);
    return null;
  }

  return (data || []).map((entry) => ({
    id: entry.id,
    date: entry.entry_date,
    situation: entry.situation,
    pattern: entry.pattern || "",
    fear: entry.fear || "",
    mature: entry.mature_action || "",
    repair: entry.repair_step || "",
    status: entry.status || "открыто",
    tags: entry.tags || [],
    convertedVictoryId: entry.converted_victory_id || null,
  }));
}

async function createVictoryInSupabase(victory, replaceLocal = true) {
  if (!supabaseClient || !supabaseUser) return null;
  const localId = victory.id;
  let imageUrl = getPersistableImageUrl(victory.image);
  if (!imageUrl && victory.imageFile) {
    imageUrl = await uploadMediaFile(victory.imageFile, "victories");
  }
  const payload = {
    user_id: supabaseUser.id,
    victory_date: victory.date || state.activeDate,
    text: victory.text,
    category: victory.category || null,
    role: victory.role || null,
    tags: normalizeTags(victory.tags || []),
    image_url: imageUrl,
    source: victory.source || "manual",
  };

  const { data, error } = await supabaseClient
    .from("victories")
    .insert(payload)
    .select("id, victory_date, text, category, role, tags, image_url, source")
    .single();

  if (error) {
    toast(error.message);
    return null;
  }

  const remoteVictory = {
    id: data.id,
    date: data.victory_date,
    text: data.text,
    category: data.category || "Дисциплина",
    role: data.role || "",
    tags: data.tags || [],
    image: data.image_url || victory.image || null,
    source: data.source || "manual",
  };

  if (replaceLocal) {
    const index = state.victories.findIndex((item) => item.id === localId);
    if (index >= 0) {
      state.victories[index] = remoteVictory;
      saveState();
      render();
    }
  }

  return remoteVictory;
}

async function updateVictoryInSupabase(victory) {
  if (!supabaseClient || !supabaseUser) return victory;

  const payload = {
    victory_date: victory.date || state.activeDate,
    text: victory.text,
    category: victory.category || null,
    role: victory.role || null,
    tags: normalizeTags(victory.tags || []),
    image_url: getPersistableImageUrl(victory.image),
    source: victory.source || "manual",
  };

  const { data, error } = await supabaseClient
    .from("victories")
    .update(payload)
    .eq("id", victory.id)
    .eq("user_id", supabaseUser.id)
    .select("id, victory_date, text, category, role, tags, image_url, source")
    .single();

  if (error) {
    toast(error.message);
    return null;
  }

  return {
    id: data.id,
    date: data.victory_date,
    text: data.text,
    category: data.category || "Дисциплина",
    role: data.role || "",
    tags: data.tags || [],
    image: data.image_url || victory.image || null,
    source: data.source || "manual",
  };
}

async function uploadMediaFile(file, folder) {
  if (!supabaseClient || !supabaseUser) {
    toast("Сначала войди в аккаунт.");
    return null;
  }

  const extension = getFileExtension(file.name, file.type);
  const path = `${supabaseUser.id}/${folder}/${Date.now()}-${uid()}.${extension}`;
  const { error } = await supabaseClient.storage
    .from("victory-media")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    toast(error.message);
    return null;
  }

  const { data } = supabaseClient.storage
    .from("victory-media")
    .getPublicUrl(path);

  return data.publicUrl;
}

async function createShadowInSupabase(shadow, replaceLocal = true) {
  if (!supabaseClient || !supabaseUser) return null;
  const localId = shadow.id;
  const payload = shadowToSupabasePayload(shadow);

  const { data, error } = await supabaseClient
    .from("shadow_entries")
    .insert(payload)
    .select("id, entry_date, situation, pattern, fear, mature_action, repair_step, status, tags, converted_victory_id")
    .single();

  if (error) {
    toast(error.message);
    return null;
  }

  const remoteShadow = shadowFromSupabaseRow(data);
  if (replaceLocal) {
    const index = state.shadows.findIndex((item) => item.id === localId);
    if (index >= 0) {
      state.shadows[index] = remoteShadow;
      saveState();
      render();
    }
  }

  return remoteShadow;
}

async function updateShadowInSupabase(shadow, convertedVictoryId = shadow.convertedVictoryId || null) {
  if (!supabaseClient || !supabaseUser) return false;
  const payload = {
    ...shadowToSupabasePayload(shadow),
    converted_victory_id: convertedVictoryId,
  };

  const { error } = await supabaseClient
    .from("shadow_entries")
    .update(payload)
    .eq("id", shadow.id)
    .eq("user_id", supabaseUser.id);

  if (error) {
    toast(error.message);
    return false;
  }
  shadow.convertedVictoryId = convertedVictoryId;
  return true;
}

function shadowToSupabasePayload(shadow) {
  return {
    user_id: supabaseUser.id,
    entry_date: shadow.date || state.activeDate,
    situation: shadow.situation,
    pattern: shadow.pattern || null,
    fear: shadow.fear || null,
    mature_action: shadow.mature || null,
    repair_step: shadow.repair || null,
    status: shadow.status || "открыто",
    tags: shadow.tags || [],
    converted_victory_id: shadow.convertedVictoryId || null,
  };
}

function shadowFromSupabaseRow(entry) {
  return {
    id: entry.id,
    date: entry.entry_date,
    situation: entry.situation,
    pattern: entry.pattern || "",
    fear: entry.fear || "",
    mature: entry.mature_action || "",
    repair: entry.repair_step || "",
    status: entry.status || "открыто",
    tags: entry.tags || [],
    convertedVictoryId: entry.converted_victory_id || null,
  };
}

async function handleSignOut() {
  if (supabaseClient) {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      toast(error.message);
      return;
    }
  }
  supabaseUser = null;
  state.localAccount = { email: "", isSignedIn: false };
  saveAndRender();
  toast("Выход выполнен.");
}

function validateImageFile(file) {
  if (!file.type.startsWith("image/")) {
    toast("Можно загрузить только изображение.");
    return false;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    toast("Фото слишком большое. Пока загрузи изображение до 6 МБ.");
    return false;
  }
  return true;
}

function getFileExtension(name, type) {
  const fromName = name.split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
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
  document.querySelectorAll("[data-gate-auth-mode]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.gateAuthMode === mode);
  });
  els.authNameField.hidden = mode !== "register";
  els.gateAuthNameField.hidden = mode !== "register";
  els.gateAuthSubmit.textContent = mode === "register" ? "Зарегистрироваться" : "Войти";
  els.authSubmit.textContent = isSupabaseConfigured()
    ? mode === "register" ? "Зарегистрироваться" : "Войти"
    : mode === "register" ? "Создать локальный профиль" : "Войти локально";
  if (persist) saveAndRender();
}

async function toggleHabit(habitId) {
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
  await saveHabitCheckToSupabase(habitId, state.activeDate);
}

async function toggleChild(habitId, childId) {
  const checks = getDateChecks(state.activeDate);
  const current = checks[habitId] || { children: {} };
  current.children = current.children || {};
  current.children[childId] = !current.children[childId];
  checks[habitId] = current;
  saveAndRender();
  await saveHabitCheckToSupabase(habitId, state.activeDate);
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

function getBestOverallStreak() {
  if (!state.habits.length) return 0;
  return Math.max(...state.habits.map((habit) => getBestStreak(habit.id)), 0);
}

function getUnlockedAwards(bestStreak = getBestOverallStreak()) {
  return awards.filter((award) => bestStreak >= award.days);
}

function buildAchievements() {
  const marks = awards.map((award) => award.days);
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

async function createAchievementVictory(habitId, days) {
  const habit = state.habits.find((item) => item.id === habitId);
  if (!habit) return;
  const award = getAwardForMilestone(days);
  const victory = {
    id: uid(),
    date: state.activeDate,
    text: `Я сделал ${days} дней подряд: ${habit.name}.`,
    category: habit.name.includes("Вокал") ? "Вокал" : habit.name.includes("Вегетариан") ? "Питание" : "Дисциплина",
    role: habit.name.includes("Вокал") ? "Я как творец" : "Я как практик",
    tags: [...new Set(["серия", `${days} дней`, ...(award?.tags || [])])],
    image: award?.image || null,
    source: `achievement:${habit.id}:${days}`,
  };
  state.victories.push(victory);
  if (supabaseClient && supabaseUser) {
    await createVictoryInSupabase(victory);
  }
  saveAndRender();
  switchTab("victories");
  toast("Достижение стало победой.");
}

async function shadowToVictory(id) {
  const entry = state.shadows.find((item) => item.id === id);
  if (!entry) return;
  entry.status = "превращено в победу";
  const victory = {
    id: uid(),
    date: state.activeDate,
    text: `Я увидел свою тень и сделал шаг исправления: ${entry.repair || entry.mature || entry.situation}`,
    category: "Тень исправлена",
    role: "Я как мужчина",
    tags: ["тень", "ответственность", ...(entry.tags || [])],
    image: null,
    source: `shadow:${entry.id}`,
  };
  state.victories.push(victory);

  if (supabaseClient && supabaseUser) {
    const remoteVictory = await createVictoryInSupabase(victory);
    await updateShadowInSupabase(entry, remoteVictory?.id);
  }

  saveAndRender();
  switchTab("victories");
  toast("Тень превращена в победу.");
}

async function cycleShadowStatus(id) {
  const statuses = ["открыто", "осознал", "исправил", "превращено в победу"];
  const entry = state.shadows.find((item) => item.id === id);
  if (!entry) return;
  const next = (statuses.indexOf(entry.status) + 1) % statuses.length;
  entry.status = statuses[next];
  if (supabaseClient && supabaseUser) {
    await updateShadowInSupabase(entry);
  }
  saveAndRender();
}

async function deleteShadow(id) {
  if (!confirm("Вы уверены, что хотите удалить эту запись из Тени?")) return;
  if (supabaseClient && supabaseUser) {
    const { error } = await supabaseClient
      .from("shadow_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", supabaseUser.id);
    if (error) {
      toast(error.message);
      return;
    }
  }
  state.shadows = state.shadows.filter((entry) => entry.id !== id);
  saveAndRender();
  toast("Запись удалена.");
}

async function deleteVictory(id) {
  if (!confirm("Вы уверены, что хотите удалить эту победу?")) return false;
  if (supabaseClient && supabaseUser) {
    const { error } = await supabaseClient
      .from("victories")
      .delete()
      .eq("id", id)
      .eq("user_id", supabaseUser.id);
    if (error) {
      toast(error.message);
      return false;
    }
  }
  state.victories = state.victories.filter((victory) => victory.id !== id);
  saveAndRender();
  toast("Победа удалена.");
  return true;
}

async function deleteHabit(id) {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;
  if (!confirm(`Вы уверены, что хотите удалить привычку "${habit.name}"? Все отметки по ней тоже удалятся.`)) return;

  if (supabaseClient && supabaseUser) {
    const { error } = await supabaseClient
      .from("habits")
      .delete()
      .eq("id", id)
      .eq("user_id", supabaseUser.id);
    if (error) {
      toast(error.message);
      return;
    }
  }

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
  loaded.victoryView = loaded.victoryView === "list" ? "list" : "tile";
  loaded.victoryCategoryFilters = Array.isArray(loaded.victoryCategoryFilters) ? loaded.victoryCategoryFilters : [];
  loaded.victoryTagFilters = Array.isArray(loaded.victoryTagFilters) ? loaded.victoryTagFilters : [];
  loaded.victoryFilterOpen = Boolean(loaded.victoryFilterOpen);
  if (loaded.victoryFilter?.startsWith?.("category:")) {
    loaded.victoryCategoryFilters = [loaded.victoryFilter.slice("category:".length)];
    loaded.victoryFilter = "Все";
  } else if (loaded.victoryFilter?.startsWith?.("tag:")) {
    loaded.victoryTagFilters = [normalizeTag(loaded.victoryFilter.slice("tag:".length))];
    loaded.victoryFilter = "Все";
  }
  loaded.onboardingPromptSeen = Boolean(loaded.onboardingPromptSeen);
  loaded.onboardingDismissed = Boolean(loaded.onboardingDismissed);
  loaded.localAccount = {
    email: "",
    isSignedIn: false,
    supabaseUserId: "",
    ...(loaded.localAccount || {}),
  };
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
  return normalizeTags(value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean));
}

function normalizeTag(tag) {
  return String(tag || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeTags(tags) {
  return [...new Set((tags || []).map(normalizeTag).filter(Boolean))];
}

function getPersistableImageUrl(image) {
  if (!image || typeof image !== "string") return null;
  if (image.startsWith("http") || image.startsWith("assets/")) return image;
  return null;
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

function friendlyAuthError(message = "") {
  const lower = message.toLowerCase();
  if (lower.includes("email rate limit")) {
    return "Supabase уперся в лимит писем. Для теста отключаем подтверждение email.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Неверный email или пароль.";
  }
  if (lower.includes("email not confirmed")) {
    return "Email не подтвержден. Для тестового режима отключаем подтверждение email.";
  }
  if (lower.includes("user already registered") || lower.includes("already")) {
    return "Такой email уже зарегистрирован. Попробуй войти.";
  }
  if (lower.includes("password")) {
    return "Проверь пароль: минимум 6 символов.";
  }
  return message || "Не получилось выполнить вход или регистрацию.";
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
