const STORAGE_KEY = "todo-app.todos";

let todos = load();
let filter = "all";

const $form = document.getElementById("add-form");
const $input = document.getElementById("new-todo");
const $list = document.getElementById("list");
const $count = document.getElementById("count");
const $filters = document.getElementById("filters");
const $clearDone = document.getElementById("clear-done");

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ストレージが使えない環境ではメモリ上のみで動作
  }
}

function update() {
  save();
  render();
}

function render() {
  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );

  $list.replaceChildren();
  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "タスクはありません";
    $list.append(empty);
  }
  for (const todo of visible) $list.append(renderItem(todo));

  const remaining = todos.filter((t) => !t.done).length;
  $count.textContent = `残り ${remaining} 件`;
  $clearDone.hidden = !todos.some((t) => t.done);
  for (const b of $filters.children) {
    b.classList.toggle("active", b.dataset.filter === filter);
  }
}

function renderItem(todo) {
  const li = document.createElement("li");
  li.className = todo.done ? "done" : "";

  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = todo.done;
  check.addEventListener("change", () => {
    todo.done = check.checked;
    update();
  });

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = todo.text;
  label.addEventListener("dblclick", () => startEdit(todo, label));

  const del = document.createElement("button");
  del.className = "delete";
  del.type = "button";
  del.textContent = "×";
  del.setAttribute("aria-label", "削除");
  del.addEventListener("click", () => {
    todos = todos.filter((t) => t.id !== todo.id);
    update();
  });

  li.append(check, label, del);
  return li;
}

function startEdit(todo, label) {
  const edit = document.createElement("input");
  edit.className = "label-edit";
  edit.value = todo.text;
  label.replaceWith(edit);
  edit.focus();

  let finished = false;
  const finish = (commit) => {
    if (finished) return;
    finished = true;
    const text = edit.value.trim();
    if (commit && text) todo.text = text;
    update();
  };
  edit.addEventListener("blur", () => finish(true));
  edit.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true);
    if (e.key === "Escape") finish(false);
  });
}

$form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = $input.value.trim();
  if (!text) return;
  todos.push({ id: crypto.randomUUID(), text, done: false });
  $input.value = "";
  update();
});

$filters.addEventListener("click", (e) => {
  const f = e.target.dataset.filter;
  if (!f) return;
  filter = f;
  render();
});

$clearDone.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  update();
});

render();
