const API_BASE = "https://cambo-gazetteer.manethpak.dev/api/v1";

async function fetchData(endpoint) {
  try {
    const url = "https://corsproxy.io/?" + encodeURIComponent(API_BASE + endpoint);
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
  } catch (e) {
    console.error(e);
    return [];
  }
}


function populateSelect(select, items, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id; // <-- numeric ID
    option.textContent = item.name_en; // or name_kh for Khmer
    select.appendChild(option);
  });
  select.disabled = false;
}

const provinceSelect = document.getElementById("province");
const districtSelect = document.getElementById("district");
const communeSelect = document.getElementById("commune");
const villageSelect = document.getElementById("village");

async function init() {
  const provinces = await fetchData("/provinces");
  populateSelect(provinceSelect, provinces, "Select Province");
  provinceSelect.disabled = false;   // ← Add this
}


provinceSelect.addEventListener("change", async () => {
  districtSelect.disabled = true;
  communeSelect.disabled = true;
  villageSelect.disabled = true;
  districtSelect.innerHTML = "<option value=''>Select District</option>";
  communeSelect.innerHTML = "<option value=''>Select Commune</option>";
  villageSelect.innerHTML = "<option value=''>Select Village</option>";

  const provinceId = provinceSelect.value;
  if (!provinceId) return;

  const districts = await fetchData(`/districts?province_id=${provinceId}`);
  populateSelect(districtSelect, districts, "Select District");
});

districtSelect.addEventListener("change", async () => {
  communeSelect.disabled = true;
  villageSelect.disabled = true;
  communeSelect.innerHTML = "<option value=''>Select Commune</option>";
  villageSelect.innerHTML = "<option value=''>Select Village</option>";

  const districtId = districtSelect.value;
  if (!districtId) return;

  const communes = await fetchData(`/communes?district_id=${districtId}`);
  populateSelect(communeSelect, communes, "Select Commune");
});

communeSelect.addEventListener("change", async () => {
  villageSelect.disabled = true;
  villageSelect.innerHTML = "<option value=''>Select Village</option>";

  const communeId = communeSelect.value;
  if (!communeId) return;

  const villages = await fetchData(`/villages?commune_id=${communeId}`);
  populateSelect(villageSelect, villages, "Select Village");
});

window.addEventListener("DOMContentLoaded", init);

const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

submitBtn.addEventListener("click", function () {

  if (!provinceSelect.value ||
      !districtSelect.value ||
      !communeSelect.value ||
      !villageSelect.value) {
    alert("Please select Province, District, Commune and Village.");
    return;
  }

  const provinceText = provinceSelect.options[provinceSelect.selectedIndex].text;
  const districtText = districtSelect.options[districtSelect.selectedIndex].text;
  const communeText = communeSelect.options[communeSelect.selectedIndex].text;
  const villageText = villageSelect.options[villageSelect.selectedIndex].text;

  alert(
    "Selected Location:\n\n" +
    "Province: " + provinceText + "\n" +
    "District: " + districtText + "\n" +
    "Commune: " + communeText + "\n" +
    "Village: " + villageText
  );
});


