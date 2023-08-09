document.addEventListener("DOMContentLoaded", function () {
    const activateCheckbox = document.getElementById("activateCheckbox");
    chrome.storage.sync.get("active", (result) => {
        activateCheckbox.checked = result.active;
    });

    const excludeList = document.getElementById("excludeList");
    chrome.storage.sync.get("excludedSites", (result) => {
        const excludedSites = result.excludedSites || [];
        excludedSites.forEach((site) => {
            addExcludeItem(site);
        });
    });

    const addExcludeButton = document.getElementById("addExcludeButton");
    addExcludeButton.addEventListener("click", () => {
        const excludeInput = document.getElementById("excludeInput");
        const site = excludeInput.value.trim();
        if (site) {
            excludeInput.value = "";
            addExcludeItem(site);
            saveExcludedSites();
        }
    });

    activateCheckbox.addEventListener("change", () => {
        const active = activateCheckbox.checked;
        chrome.storage.sync.set({ active });
    });

    function addExcludeItem(site) {
        const item = document.createElement("div");
        item.classList.add("item");
        const itemText = document.createElement("div");
        itemText.classList.add("item-text");
        itemText.textContent = site;
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
            item.remove();
            saveExcludedSites();
        });
        item.appendChild(itemText);
        item.appendChild(removeButton);
        excludeList.appendChild(item);
    }

    function saveExcludedSites() {
        const excludedSites = Array.from(excludeList.getElementsByClassName("item-text")).map((element) => element.textContent);
        chrome.storage.sync.set({ excludedSites });
    }
});
