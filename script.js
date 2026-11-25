// ==============================
// 1. Page Navigation
// ==============================

const pages = document.querySelectorAll(".page");

const btnAll = document.getElementById("btn-all");
const btnImp = document.getElementById("btn-important");
const btnPlan = document.getElementById("btn-planned");
const btnList = document.getElementById("btn-lists");

function showPage(n) {
  pages.forEach((page) => {
    page.style.display = "none";
  });

  const selectedPage = document.querySelector(`.page${n}`);

  if (selectedPage) {
    selectedPage.style.display = "block";
  }
}

btnAll?.addEventListener("click", () => showPage(1));
btnImp?.addEventListener("click", () => showPage(2));
btnPlan?.addEventListener("click", () => showPage(3));
btnList?.addEventListener("click", () => showPage(4));

showPage(4);

// ==============================
// 2. Modal
// ==============================

const openBtns = document.querySelectorAll(".openModalBtn");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".closeBtn");
const modal = document.querySelector(".model");

let currentPage = null;

function openModal() {
  if (overlay) {
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  if (overlay) {
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

openBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    currentPage = e.currentTarget.closest(".page");
    openModal();
  });
});

closeBtn?.addEventListener("click", closeModal);

overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) {
    closeModal();
  }
});

// ==============================
// 3. Task Helpers
// ==============================

let taskCounter = 0;

function getTaskTitle(taskRow) {
  return (
    taskRow.querySelector(".task-title, .larger")?.textContent.trim() || ""
  );
}

function updateTaskAppearance(taskRow) {
  const checkbox = taskRow.querySelector('input[type="checkbox"]');
  const taskText = taskRow.querySelector(".larger, .task-title");

  if (!checkbox || !taskText) return;

  taskText.style.textDecoration = checkbox.checked ? "line-through" : "none";

  taskText.style.opacity = checkbox.checked ? "0.6" : "1";
}

function assignTaskIds() {
  document.querySelectorAll(".task-row").forEach((taskRow) => {
    if (!taskRow.dataset.taskId) {
      taskCounter++;
      taskRow.dataset.taskId = `task-${taskCounter}`;
    }
  });
}

assignTaskIds();

// ==============================
// 4. Important Tasks
// ==============================

const importantSection = document.querySelector(".page2 .impo-sec");

function getOriginalTask(taskId) {
  return [...document.querySelectorAll(".task-row")].find((task) => {
    return (
      task.dataset.taskId === taskId &&
      !task.classList.contains("important-task")
    );
  });
}

function addToImportant(taskRow) {
  if (!importantSection) return;

  const taskId = taskRow.dataset.taskId;

  const alreadyExists = [
    ...importantSection.querySelectorAll(".important-task"),
  ].some((task) => task.dataset.taskId === taskId);

  if (alreadyExists) return;

  const clonedTask = taskRow.cloneNode(true);

  clonedTask.classList.add("important-task");

  // Remove favorite buttons from the cloned task.
  clonedTask.querySelectorAll(".nocolor, .filled").forEach((btn) => {
    btn.remove();
  });

  importantSection.appendChild(clonedTask);
}

function removeFromImportant(taskId) {
  if (!importantSection) return;

  importantSection.querySelectorAll(".important-task").forEach((task) => {
    if (task.dataset.taskId === taskId) {
      task.remove();
    }
  });
}

// Use event delegation instead of attaching duplicate listeners.

document.body.addEventListener("click", (e) => {
  const emptyBtn = e.target.closest(".nocolor");
  const filledBtn = e.target.closest(".filled");

  if (!emptyBtn && !filledBtn) return;

  const clickedBtn = emptyBtn || filledBtn;
  const taskRow = clickedBtn.closest(".task-row");

  if (!taskRow || taskRow.classList.contains("important-task")) return;

  const taskId = taskRow.dataset.taskId;

  const empty = taskRow.querySelector(".nocolor");
  const filled = taskRow.querySelector(".filled");

  if (!empty || !filled) return;

  if (emptyBtn) {
    empty.style.display = "none";
    filled.style.display = "inline-block";

    const filledImg = filled.querySelector("img");

    if (filledImg) {
      filledImg.style.display = "block";
    }

    addToImportant(taskRow);
  }

  if (filledBtn) {
    filled.style.display = "none";
    empty.style.display = "inline-block";

    const filledImg = filled.querySelector("img");

    if (filledImg) {
      filledImg.style.display = "none";
    }

    removeFromImportant(taskId);
  }

  updateAllProgress();
});

// ==============================
// 5. Progress Tracking
// ==============================

function updateProgress(sectionSelector) {
  const section = document.querySelector(sectionSelector);

  if (!section) return;

  const tasks = section.querySelectorAll(".task-row");

  const completed = section.querySelectorAll(
    '.task-row input[type="checkbox"]:checked',
  );

  const progress = section.querySelector(".progress");

  if (!progress) return;

  const span = progress.querySelector("span");
  const bar = progress.querySelector(".progress-bar");

  const total = tasks.length;
  const done = completed.length;

  const percent = total === 0 ? 0 : (done / total) * 100;

  if (span) {
    span.textContent = `${done} of ${total} completed`;
  }

  if (bar) {
    bar.style.width = `${percent}%`;
  }
}

function updateAllProgress() {
  updateProgress(".page2 .impo-sec");
  updateProgress(".page4 .impo-sec");
}

updateAllProgress();

// ==============================
// 6. Task Completion
// ==============================

document.body.addEventListener("change", (e) => {
  if (!e.target.matches('.task-row input[type="checkbox"]')) return;

  const checkbox = e.target;
  const taskRow = checkbox.closest(".task-row");

  if (!taskRow) return;

  // If the checkbox belongs to an Important task,
  // update the original task as well.

  if (taskRow.classList.contains("important-task")) {
    const originalTask = getOriginalTask(taskRow.dataset.taskId);

    const originalCheckbox = originalTask?.querySelector(
      'input[type="checkbox"]',
    );

    if (originalCheckbox) {
      originalCheckbox.checked = checkbox.checked;
      updateTaskAppearance(originalTask);
    }
  } else {
    updateTaskAppearance(taskRow);
  }

  // Hide completed tasks in the Planned page.

  if (
    taskRow.closest(".page3") &&
    !taskRow.classList.contains("important-task") &&
    checkbox.checked
  ) {
    taskRow.style.display = "none";
  }

  updateAllProgress();
});

// ==============================
// 7. Add New Task
// ==============================

const titleInput = modal?.querySelector(".title");
const desInput = modal?.querySelector(".des");
const dueInput = modal?.querySelector(".due");

const modalButtons = [...(modal?.querySelectorAll("button") || [])];

const addTaskBtn =
  modal?.querySelector(".addTaskBtn") ||
  modalButtons.find((btn) => /add|save/i.test(btn.textContent)) ||
  modalButtons[0];

const cancelBtn =
  modal?.querySelector(".cancelBtn") ||
  modalButtons.find((btn) => /cancel/i.test(btn.textContent)) ||
  modalButtons[modalButtons.length - 1];

function createTask(title, description, dueDate) {
  const task = document.createElement("div");

  task.className = "task-row";

  taskCounter++;
  task.dataset.taskId = `task-${taskCounter}`;

  const checkbox = document.createElement("input");

  checkbox.type = "checkbox";

  const emptyBtn = document.createElement("button");

  emptyBtn.type = "button";
  emptyBtn.className = "nocolor";
  emptyBtn.textContent = "☆";
  emptyBtn.setAttribute("aria-label", "Add to important tasks");

  const filledBtn = document.createElement("button");

  filledBtn.type = "button";
  filledBtn.className = "filled";
  filledBtn.style.display = "none";
  filledBtn.textContent = "★";
  filledBtn.setAttribute("aria-label", "Remove from important tasks");

  const taskTitle = document.createElement("span");

  taskTitle.className = "larger task-title";
  taskTitle.textContent = title;

  task.append(checkbox, emptyBtn, filledBtn, taskTitle);

  if (description) {
    const desc = document.createElement("p");

    desc.className = "desc";
    desc.textContent = description;

    task.appendChild(desc);
  }

  if (dueDate) {
    const due = document.createElement("small");

    due.className = "due";
    due.textContent = `Due: ${dueDate}`;

    task.appendChild(due);
  }

  return task;
}

addTaskBtn?.addEventListener("click", (e) => {
  e.preventDefault();

  if (!titleInput || !currentPage) return;

  const title = titleInput.value.trim();
  const description = desInput?.value.trim() || "";
  const dueDate = dueInput?.value || "";

  if (!title) {
    alert("Please enter a task title.");
    titleInput.focus();
    return;
  }

  const section = currentPage.querySelector(".impo-sec");

  if (!section) {
    alert("Could not find the task section.");
    return;
  }

  const task = createTask(title, description, dueDate);

  section.appendChild(task);

  updateAllProgress();

  closeModal();

  titleInput.value = "";

  if (desInput) desInput.value = "";
  if (dueInput) dueInput.value = "";
});

cancelBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});
