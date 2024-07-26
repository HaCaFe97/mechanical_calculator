document.addEventListener('DOMContentLoaded', () => {
    populateSAENumbers();
    document.getElementById("sae_number").addEventListener("change", updateConditions);
    document.getElementById("condition").addEventListener("change", showMaterialProperties);
});

let materials = { carbon_and_alloy_steels: [] };

function populateSAENumbers() {
    fetch('carbon_and_alloy_steels.json')
        .then(response => response.json())
        .then(data => {
            materials = data;
            const saeNumberDropdown = document.getElementById("sae_number");
            const saeNumbers = [...new Set(materials.carbon_and_alloy_steels.map(material => material.sae_number))];

            saeNumbers.forEach(sae_number => {
                const option = document.createElement("option");
                option.value = sae_number;
                option.textContent = sae_number;
                saeNumberDropdown.appendChild(option);
            });
        });
}

function updateConditions() {
    const conditionDropdown = document.getElementById("condition");
    conditionDropdown.innerHTML = '';

    const selectedSAENumber = document.getElementById("sae_number").value;
    const conditions = materials.carbon_and_alloy_steels
        .filter(material => material.sae_number === selectedSAENumber)
        .map(material => material.condition);

    conditions.forEach(condition => {
        const option = document.createElement("option");
        option.value = condition;
        option.textContent = condition;
        conditionDropdown.appendChild(option);
    });

    showMaterialProperties();
}

function showMaterialProperties() {
    const selectedSAENumber = document.getElementById("sae_number").value;
    const selectedCondition = document.getElementById("condition").value;
    const material = materials.carbon_and_alloy_steels.find(
        material => material.sae_number === selectedSAENumber && material.condition === selectedCondition
    );

    const materialPropertiesDiv = document.getElementById("material-properties");
    materialPropertiesDiv.innerHTML = material ? `
        <h3>Material Properties</h3>
        <p><strong>Tensile Strength:</strong> ${material.tensile_strength.ksi} ksi | ${material.tensile_strength.mpa} MPa</p>
        <p><strong>Yield Strength:</strong> ${material.yield_strength.ksi} ksi | ${material.yield_strength.mpa} MPa</p>
        <p><strong>Ductility (2 in):</strong> ${material.ductility_percent_elongation_2in}%</p>
        <p><strong>Brinell Hardness:</strong> ${material.brinell_hardness_hb} HB</p>
    ` : `<p>No data available for selected material.</p>`;
}

function openTab(event, tabId) {
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(tabContent => {
        tabContent.style.display = "none";
    });

    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(tabButton => {
        tabButton.classList.remove("active");
    });

    document.getElementById(tabId).style.display = "block";
    event.currentTarget.classList.add("active");
}

// Set default tab
document.querySelector(".tab-button").click();
