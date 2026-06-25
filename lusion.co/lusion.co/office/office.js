(function () {
  "use strict";

  const authWrap = document.getElementById("office-auth");
  const shell = document.getElementById("office-shell");
  const loginButton = document.getElementById("office-login");
  const passwordInput = document.getElementById("office-password");
  const loginStatus = document.getElementById("office-login-status");
  const saveStatus = document.getElementById("office-save-status");
  const rawJson = document.getElementById("raw-json");
  const siteDescription = document.getElementById("site-description");
  const legacyAssetIds = document.getElementById("legacy-asset-ids");
  const colorsList = document.getElementById("colors-list");
  const teamList = document.getElementById("team-list");
  const projectsList = document.getElementById("projects-list");
  const tokenKey = "bricks-office-token";

  let token = sessionStorage.getItem(tokenKey) || "";
  let state = null;

  async function api(path, options) {
    const headers = Object.assign(
      { "Content-Type": "application/json" },
      options && options.headers ? options.headers : {}
    );
    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    const response = await fetch(path, Object.assign({}, options, { headers }));
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.statusText);
    }
    return response;
  }

  function setStatus(target, message, isError) {
    target.textContent = message || "";
    target.style.color = isError ? "#ffb4c4" : "#cb94f7";
  }

  function makeField(label, value, className, multiline) {
    const wrapper = document.createElement("div");
    wrapper.className = className || "";
    const labelEl = document.createElement("label");
    labelEl.className = "form-label";
    labelEl.textContent = label;
    const input = multiline ? document.createElement("textarea") : document.createElement("input");
    input.className = "form-control";
    if (!multiline) input.type = "text";
    input.value = value || "";
    wrapper.append(labelEl, input);
    return { wrapper, input };
  }

  function renderColors() {
    colorsList.innerHTML = "";
    state.BRICKS_COLORS.forEach((color, index) => {
      const item = document.createElement("div");
      item.className = "office-item";
      item.innerHTML = `
        <div class="office-item-header">
          <strong>Color ${index + 1}</strong>
          <button class="btn btn-sm btn-outline-danger" type="button">Remove</button>
        </div>
        <div class="office-grid">
          <div><label class="form-label">Background</label><input class="form-control" data-key="bg" value="${color.bg || ""}" /></div>
          <div><label class="form-label">Text</label><input class="form-control" data-key="text" value="${color.text || ""}" /></div>
          <div class="office-grid-full"><label class="form-label">Shadow</label><input class="form-control" data-key="shadow" value="${color.shadow || ""}" /></div>
        </div>
      `;
      item.querySelector("button").addEventListener("click", function () {
        state.BRICKS_COLORS.splice(index, 1);
        renderAll();
      });
      item.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", function () {
          state.BRICKS_COLORS[index][input.dataset.key] = input.value;
          syncRawJson();
        });
      });
      colorsList.appendChild(item);
    });
  }

  function renderTeam() {
    teamList.innerHTML = "";
    state.TEAM.forEach((member, index) => {
      const item = document.createElement("div");
      item.className = "office-item";
      item.innerHTML = `
        <div class="office-item-header">
          <strong>${member.name || "New team member"}</strong>
          <button class="btn btn-sm btn-outline-danger" type="button">Remove</button>
        </div>
        <div class="office-grid"></div>
      `;
      item.querySelector("button").addEventListener("click", function () {
        state.TEAM.splice(index, 1);
        renderAll();
      });
      const grid = item.querySelector(".office-grid");
      [
        ["ID", "id"],
        ["Name", "name"],
        ["Role", "role"],
      ].forEach(([label, key]) => {
        const field = makeField(label, member[key], "");
        field.input.addEventListener("input", function () {
          state.TEAM[index][key] = field.input.value;
          renderTeam();
          syncRawJson();
        });
        grid.appendChild(field.wrapper);
      });
      const bioField = makeField("Bio", member.bio, "office-grid-full", true);
      bioField.input.addEventListener("input", function () {
        state.TEAM[index].bio = bioField.input.value;
        syncRawJson();
      });
      grid.appendChild(bioField.wrapper);
      teamList.appendChild(item);
    });
  }

  function renderProjects() {
    projectsList.innerHTML = "";
    state.PROJECTS.forEach((project, index) => {
      const item = document.createElement("div");
      item.className = "office-item";
      item.innerHTML = `
        <div class="office-item-header">
          <strong>${project.cardTitle || project.title || "New project"}</strong>
          <button class="btn btn-sm btn-outline-danger" type="button">Remove</button>
        </div>
        <div class="office-grid"></div>
      `;
      item.querySelector("button").addEventListener("click", function () {
        state.PROJECTS.splice(index, 1);
        renderAll();
      });
      const grid = item.querySelector(".office-grid");
      [
        ["Slug", "slug"],
        ["Card title", "cardTitle"],
        ["Title", "title"],
        ["Category", "category"],
      ].forEach(([label, key]) => {
        const field = makeField(label, project[key], "");
        field.input.addEventListener("input", function () {
          state.PROJECTS[index][key] = field.input.value;
          renderProjects();
          syncRawJson();
        });
        grid.appendChild(field.wrapper);
      });

      const servicesField = makeField(
        "Services (one per line)",
        (project.services || []).join("\n"),
        "office-grid-full",
        true
      );
      servicesField.input.addEventListener("input", function () {
        state.PROJECTS[index].services = servicesField.input.value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
        syncRawJson();
      });
      grid.appendChild(servicesField.wrapper);

      const videoField = makeField(
        "Video URLs (one per line)",
        (project.videoUrls || []).join("\n"),
        "office-grid-full",
        true
      );
      videoField.input.addEventListener("input", function () {
        state.PROJECTS[index].videoUrls = videoField.input.value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
        syncRawJson();
      });
      grid.appendChild(videoField.wrapper);

      const descriptionField = makeField("Description", project.description, "office-grid-full", true);
      descriptionField.input.addEventListener("input", function () {
        state.PROJECTS[index].description = descriptionField.input.value;
        syncRawJson();
      });
      grid.appendChild(descriptionField.wrapper);

      const creditsField = makeField(
        "Credits (one per line)",
        (project.credits || []).join("\n"),
        "office-grid-full",
        true
      );
      creditsField.input.addEventListener("input", function () {
        state.PROJECTS[index].credits = creditsField.input.value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
        syncRawJson();
      });
      grid.appendChild(creditsField.wrapper);
      projectsList.appendChild(item);
    });
  }

  function syncOverviewFields() {
    siteDescription.value = state.SITE_DESCRIPTION || "";
    legacyAssetIds.value = (state.LEGACY_ASSET_IDS || []).join("\n");
  }

  function syncRawJson() {
    rawJson.value = JSON.stringify(state, null, 2);
  }

  function renderAll() {
    syncOverviewFields();
    renderColors();
    renderTeam();
    renderProjects();
    syncRawJson();
  }

  async function loadContent() {
    const response = await api("/api/office/content");
    state = await response.json();
    renderAll();
  }

  function applyRawJson() {
    state = JSON.parse(rawJson.value);
    renderAll();
  }

  document.getElementById("office-tabs").addEventListener("click", function (event) {
    const button = event.target.closest("[data-tab]");
    if (!button) return;
    document.querySelectorAll("#office-tabs .nav-link").forEach((link) => link.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll("[data-panel]").forEach((panel) => panel.classList.add("d-none"));
    document.querySelector('[data-panel="' + button.dataset.tab + '"]').classList.remove("d-none");
  });

  loginButton.addEventListener("click", async function () {
    setStatus(loginStatus, "Signing in...");
    try {
      const response = await fetch("/api/office/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.value }),
      });
      if (!response.ok) throw new Error("Wrong password");
      const payload = await response.json();
      token = payload.token;
      sessionStorage.setItem(tokenKey, token);
      authWrap.classList.add("d-none");
      shell.classList.remove("d-none");
      await loadContent();
      setStatus(loginStatus, "");
    } catch (error) {
      setStatus(loginStatus, error.message || "Login failed", true);
    }
  });

  document.getElementById("office-refresh").addEventListener("click", async function () {
    setStatus(saveStatus, "Reloading content...");
    try {
      await loadContent();
      setStatus(saveStatus, "Reloaded.");
    } catch (error) {
      setStatus(saveStatus, error.message || "Reload failed", true);
    }
  });

  document.getElementById("office-save").addEventListener("click", async function () {
    try {
      applyRawJson();
      state.SITE_DESCRIPTION = siteDescription.value;
      state.LEGACY_ASSET_IDS = legacyAssetIds.value.split("\n").map((item) => item.trim()).filter(Boolean);
      setStatus(saveStatus, "Saving and rebuilding...");
      await api("/api/office/content", {
        method: "POST",
        body: JSON.stringify(state),
      });
      setStatus(saveStatus, "Saved. Site regenerated.");
      await loadContent();
    } catch (error) {
      setStatus(saveStatus, error.message || "Save failed", true);
    }
  });

  document.getElementById("add-team-member").addEventListener("click", function () {
    state.TEAM.push({ id: "new_member", name: "New team member", role: "", bio: "" });
    renderAll();
  });

  document.getElementById("add-project").addEventListener("click", function () {
    state.PROJECTS.push({
      slug: "new_project",
      title: "New Project",
      cardTitle: "New Project",
      category: "",
      services: [],
      videoUrls: [],
      description: "",
      credits: [],
    });
    renderAll();
  });

  document.getElementById("add-color").addEventListener("click", function () {
    state.BRICKS_COLORS.push({ bg: "#2a1f3d", text: "#E2E1FC", shadow: "0.9" });
    renderAll();
  });

  siteDescription.addEventListener("input", function () {
    state.SITE_DESCRIPTION = siteDescription.value;
    syncRawJson();
  });

  legacyAssetIds.addEventListener("input", function () {
    state.LEGACY_ASSET_IDS = legacyAssetIds.value.split("\n").map((item) => item.trim()).filter(Boolean);
    syncRawJson();
  });

  rawJson.addEventListener("input", function () {
    setStatus(saveStatus, "Raw JSON changed. Save to apply.");
  });

  if (token) {
    authWrap.classList.add("d-none");
    shell.classList.remove("d-none");
    loadContent().catch(function () {
      sessionStorage.removeItem(tokenKey);
      token = "";
      shell.classList.add("d-none");
      authWrap.classList.remove("d-none");
    });
  }
})();
