const pages = document.querySelectorAll('.page');
    const btnAll = document.getElementById('btn-all');
    const btnImp = document.getElementById('btn-important');
    const btnPlan = document.getElementById('btn-planned');
    const btnList = document.getElementById('btn-lists');


    function showPage(n){
      pages.forEach(p => p.style.display = 'none');
      document.querySelector('.page' + n).style.display = 'block';
    }
    btnAll.onclick = ()=>showPage(1);
    btnImp.onclick = ()=>showPage(2);
    btnPlan.onclick = ()=>showPage(3);
    btnList.onclick = ()=>showPage(4);
    showPage(4);


const openBtns = document.querySelectorAll('.openModalBtn');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.closeBtn');
openBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    overlay.style.display = 'flex';
  });
});

closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.style.display = 'none';
  }
});


const filledBtns = document.querySelectorAll('.filled');
const nocolorBtns = document.querySelectorAll('.nocolor');
nocolorBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    filledBtns[index].style.display = 'inline-block';
    const filledImg = filledBtns[index].querySelector('img');
    filledImg.style.display = 'block';
  });
});


filledBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    nocolorBtns[index].style.display = 'inline-block';
    const filledImg = btn.querySelector('img');
    filledImg.style.display = 'none';
  });
});


const importantSection = document.querySelector('.page2 .impo-sec');
nocolorBtns.forEach((btn, index) => {
  const filledBtn = filledBtns[index];
  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    filledBtn.style.display = 'inline-block';
    const filledImg = filledBtn.querySelector('img');
    filledImg.style.display = 'block';
    const taskRow = btn.closest('.task-row');
    const clonedTask = taskRow.cloneNode(true);
    clonedTask.classList.add('important-task');
    importantSection.appendChild(clonedTask);
  });

  filledBtn.addEventListener('click', () => {
    filledBtn.style.display = 'none';
    btn.style.display = 'inline-block';
    const taskRow = btn.closest('.task-row');
    const taskContent = taskRow.querySelector('.task-title')?.textContent?.trim();
    const tasksInImportant = document.querySelectorAll('.page2 .impo-sec .important-task');
    tasksInImportant.forEach(t => {
      const title = t.querySelector('.task-title')?.textContent?.trim();
      if (title === taskContent) {
        t.remove();
      }
    });
  });
});

function updateProgress(sectionSelector) {
  const section = document.querySelector(sectionSelector);
  if (!section) return; 
  const tasks = section.querySelectorAll('.task-row');
  const completed = section.querySelectorAll('.task-row input[type="checkbox"]:checked');
  const progress = section.querySelector('.progress');
  if (!progress) return; 
  const span = progress.querySelector('span');
  const bar = progress.querySelector('.progress-bar');
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
  try {
    updateProgress('.page2 .impo-sec');
    updateProgress('.page4 .impo-sec');
  } catch (err) {
    console.error('Progress update error:', err);
  }
}

updateAllProgress();

document.body.addEventListener('change', e => {
  if (e.target.matches('input[type="checkbox"]')) {
    updateAllProgress();
  }
});

const observerProgress = new MutationObserver(() => {
  clearTimeout(window.progressTimer);
  window.progressTimer = setTimeout(updateAllProgress, 150);
});

observerProgress.observe(document.body, { childList: true, subtree: true });


document.body.addEventListener('change', e => {
  if (e.target.matches('.task-row input[type="checkbox"]')) {
    const taskRow = e.target.closest('.task-row');

    if (taskRow.closest('.page3')) {
      if (e.target.checked) {
        taskRow.style.display = 'none';
      }
      return; 
    }

    const taskText = taskRow.querySelector('.larger'); 
    if (taskText) {
      if (e.target.checked) {
        taskText.style.textDecoration = 'line-through';
        taskText.style.opacity = '0.6'; 
      } else {
        taskText.style.textDecoration = 'none';
        taskText.style.opacity = '1';
      }
    }
  }
});

const modal = document.querySelector('.model');
const addTaskBtn = modal.querySelector('button[style*="#22c55e"]');
const cancelBtn = modal.querySelector('button[style*="color: gray"]'); 

let currentPage = null;

document.querySelectorAll('.openModalBtn').forEach(btn => {
  btn.addEventListener('click', e => {
    currentPage = e.target.closest('.page');
  });
});

addTaskBtn.addEventListener('click', e => {
  e.preventDefault();

  const titleInput = modal.querySelector('.title');
  const desInput = modal.querySelector('.des');
  const dueInput = modal.querySelector('.due');

  const title = titleInput.value.trim();
  const des = desInput.value.trim();
  const due = dueInput.value;

  if (!title) {
    alert('Please enter a task title.');
    return;
  }

  const task = document.createElement('div');
  task.className = 'task-row';
  task.innerHTML = `
    <input type="checkbox">
    <span class="larger">${title}</span>
    ${des ? `<p class="desc">${des}</p>` : ''}
    ${due ? `<small class="due">Due: ${due}</small>` : ''}
  `;

  const section = currentPage.querySelector('.impo-sec');
  section.appendChild(task);


  document.querySelector('.overlay').style.display = 'none';
  document.body.style.overflow = 'auto';

  titleInput.value = '';
  desInput.value = '';
  dueInput.value = '';
});

cancelBtn.addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('.overlay').style.display = 'none';
  document.body.style.overflow = 'auto';
});
