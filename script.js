document.addEventListener('DOMContentLoaded', () => {
    populateMaterialTypes();
    document.getElementById("material_type").addEventListener("change", populateSAENumbers);
    document.getElementById("sae_number").addEventListener("change", updateConditions);
    document.getElementById("condition").addEventListener("change", showMaterialProperties);
});

let materials = { carbon_and_alloy_steels: [] };

function populateMaterialTypes() {
    // Clear previous options and add default option
    const materialTypeDropdown = document.getElementById("material_type");
    materialTypeDropdown.innerHTML = '<option value="">Select Material Type</option>';

    // Future material types can be added here
    const materialTypes = [
        { value: "carbon_and_alloy_steels", text: "Carbon and Alloy Steels" }
    ];

    materialTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type.value;
        option.textContent = type.text;
        materialTypeDropdown.appendChild(option);
    });
}

function populateSAENumbers() {
    const saeNumberDropdown = document.getElementById("sae_number");
    const materialType = document.getElementById("material_type").value;

    saeNumberDropdown.innerHTML = '<option value="">Select SAE Number</option>'; // Clear previous options
    if (!materialType) return;

    fetch(`${materialType}.json`)
        .then(response => response.json())
        .then(data => {
            materials = data;
            const saeNumbers = [...new Set(materials[materialType].map(material => material.sae_number))];

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
    const materialType = document.getElementById("material_type").value;
    const selectedSAENumber = document.getElementById("sae_number").value;

    conditionDropdown.innerHTML = '<option value="">Select Condition</option>'; // Clear previous options

    if (!selectedSAENumber) return;

    const conditions = materials[materialType]
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
    const materialType = document.getElementById("material_type").value;
    const selectedSAENumber = document.getElementById("sae_number").value;
    const selectedCondition = document.getElementById("condition").value;

    const material = materials[materialType].find(
        material => material.sae_number === selectedSAENumber && material.condition === selectedCondition
    );

    const materialPropertiesDiv = document.getElementById("material-properties");
    materialPropertiesDiv.innerHTML = material ? `
        <h3>Material Properties</h3>
        <p><strong>Tensile Strength:</strong> ${material.tensile_strength.ksi} ksi | ${material.tensile_strength.mpa} MPa</p>
        <p><strong>Yield Strength:</strong> ${material.yield_strength.ksi} ksi | ${material.yield_strength.mpa} MPa</p>
        <p><strong>Ductility (2 in):</strong> ${material.ductility_percent_elongation_2in}%</p>
        <p><strong>Brinell Hardness:</strong> ${material.brinell_hardness_hb} HB</p>
    ` : `
        <h3>Material Properties</h3>
        <p>No data available for selected material.</p>
    `;
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
