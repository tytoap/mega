// admin-script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, push, get, update, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const loginSection = document.getElementById("login-section");
const adminPanel = document.getElementById("admin-panel");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginError = document.getElementById("login-error");

const categorySelect = document.getElementById("category-select");
const newCategoryInput = document.getElementById("new-category-input");
const addCategoryBtn = document.getElementById("add-category-btn");
const itemForm = document.getElementById("item-form");
const itemsTableBody = document.getElementById("items-table-body");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const formTitle = document.getElementById("form-title");

let currentCategory = "";

loginBtn.onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginError.textContent = "";
  } catch (error) {
    loginError.textContent = "Erro: " + error.message;
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    loadCategories();
  } else {
    loginSection.classList.remove("hidden");
    adminPanel.classList.add("hidden");
  }
});

logoutBtn.onclick = () => signOut(auth);

function loadCategories() {
  categorySelect.innerHTML = "";
  get(ref(db)).then(snapshot => {
    const data = snapshot.val();
    if (!data) return;
    for (const cat in data) {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    }
    categorySelect.selectedIndex = 0;
    currentCategory = categorySelect.value;
    loadCategoryData();
  });
}

categorySelect.onchange = () => {
  currentCategory = categorySelect.value;
  loadCategoryData();
};

addCategoryBtn.onclick = () => {
  const newCat = newCategoryInput.value.trim();
  if (newCat) {
    set(ref(db, newCat), { price: "", items: [] })
  .then(() => {
    console.log("Categoria criada com sucesso!");
    newCategoryInput.value = "";
    loadCategories();
    const alert = document.getElementById("success-alert");
    alert.classList.remove("hidden");
    alert.classList.add("opacity-100");

    setTimeout(() => {
      alert.classList.add("opacity-0");
      setTimeout(() => alert.classList.add("hidden"), 300);
    }, 2000);
  })
  .catch((error) => {
    console.error("Erro ao criar categoria:", error);
  });

  }
  console.log("Categoria a ser salva:", newCat);
};








function loadCategoryData() {
  get(ref(db, currentCategory + "/items")).then(snapshot => {
    const items = snapshot.val() || [];
    itemsTableBody.innerHTML = "";
    items.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-4 py-2">${item.id}</td>
        <td class="px-4 py-2"><img src="${item.image}" class="w-16 h-12 object-cover"></td>
        <td class="px-4 py-2">${item.name}</td>
        <td class="px-4 py-2">${item.descricao}</td>
        <td class="px-4 py-2">R$ ${item.price.toFixed(2)}</td>
        <td class="px-4 py-2">
          <button onclick="editItem(${index})" class="text-blue-600">Editar</button> |
          <button onclick="deleteItem(${index})" class="text-red-600">Excluir</button>
        </td>
      `;
      itemsTableBody.appendChild(row);
    });
  });
}

window.editItem = (index) => {
  get(ref(db, `${currentCategory}/items/${index}`)).then(snapshot => {
    const item = snapshot.val();
    document.getElementById("item-key").value = index;
    document.getElementById("item-name").value = item.name;
    document.getElementById("item-image").value = item.image;
    document.getElementById("item-price").value = item.price;
    document.getElementById("item-descricao").value = item.descricao;
    cancelEditBtn.classList.remove("hidden");
    formTitle.textContent = "Editar Item";
  });
};

window.deleteItem = (index) => {
  get(ref(db, `${currentCategory}/items`)).then(snapshot => {
    const items = snapshot.val();
    items.splice(index, 1);
    set(ref(db, `${currentCategory}/items`), items).then(loadCategoryData);
  });
};

itemForm.onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById("item-name").value;
  const image = document.getElementById("item-image").value;
  const price = parseFloat(document.getElementById("item-price").value);
  const descricao = document.getElementById("item-descricao").value;
  const key = document.getElementById("item-key").value;

  get(ref(db, `${currentCategory}/items`)).then(snapshot => {
    const items = snapshot.val() || [];

    if (key === "") {
      const id = Math.floor(100 + Math.random() * 900); // 3 dígitos
      const newItem = { id, name, image, descricao, price };
      items.push(newItem);
      const alert = document.getElementById("success-alert1");
    alert.classList.remove("hidden");
    alert.classList.add("opacity-100");

    setTimeout(() => {
      alert.classList.add("opacity-0");
      setTimeout(() => alert.classList.add("hidden"), 300);
    }, 2000);
    } else {
      const id = items[key].id;
      items[key] = { id, name, image, descricao, price };
      const alert = document.getElementById("success-alert1");
    alert.classList.remove("hidden");
    alert.classList.add("opacity-100");

    setTimeout(() => {
      alert.classList.add("opacity-0");
      setTimeout(() => alert.classList.add("hidden"), 300);
    }, 2000);
    }

    set(ref(db, `${currentCategory}/items`), items).then(() => {
      itemForm.reset();
      document.getElementById("item-key").value = "";
      cancelEditBtn.classList.add("hidden");
      formTitle.textContent = "Adicionar Novo Item";
      loadCategoryData();
      const alert = document.getElementById("success-alert1");
    alert.classList.remove("hidden");
    alert.classList.add("opacity-100");

    setTimeout(() => {
      alert.classList.add("opacity-0");
      setTimeout(() => alert.classList.add("hidden"), 300);
    }, 2000);
    });
  });
};

cancelEditBtn.onclick = () => {
  itemForm.reset();
  document.getElementById("item-key").value = "";
  cancelEditBtn.classList.add("hidden");
  formTitle.textContent = "Adicionar Novo Item";
};
