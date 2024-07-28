document.addEventListener('DOMContentLoaded', () => {
    populateMaterialTypes();
    document.getElementById("material_type").addEventListener("change", () => {
        clearMaterialProperties();
        populateSAENumbers();
    });
    document.getElementById("sae_number").addEventListener("change", () => {
        clearMaterialProperties();
        updateConditions();
    });
    document.getElementById("condition").addEventListener("change", () => {
        clearMaterialProperties();
        showMaterialProperties();
    });
    document.getElementById("common-properties").style.display = 'none'; // Ocultar propiedades comunes al inicio
});

let materials = { carbon_and_alloy_steels: [] };

function populateMaterialTypes() {
    const materialTypeDropdown = document.getElementById("material_type");
    materialTypeDropdown.innerHTML = '<option value="">Select Material Type</option>';
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
    saeNumberDropdown.innerHTML = '<option value="">Select SAE Number</option>';
    if (!materialType) {
        document.getElementById("common-properties").style.display = 'none';
        return;
    }
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
            if (materialType === "carbon_and_alloy_steels") {
                showCommonProperties();
            } else {
                document.getElementById("common-properties").style.display = 'none';
            }
        });
}

function updateConditions() {
    const conditionDropdown = document.getElementById("condition");
    const materialType = document.getElementById("material_type").value;
    const selectedSAENumber = document.getElementById("sae_number").value;
    conditionDropdown.innerHTML = '<option value="">Select Condition</option>';
    if (!selectedSAENumber) {
        return;
    }
    const conditions = [...new Set(materials[materialType]
        .filter(material => material.sae_number === selectedSAENumber)
        .map(material => material.condition))];
    conditions.forEach(condition => {
        const option = document.createElement("option");
        option.value = condition;
        option.textContent = condition;
        conditionDropdown.appendChild(option);
    });
}

function showMaterialProperties() {
    const materialType = document.getElementById("material_type").value;
    const selectedSAENumber = document.getElementById("sae_number").value;
    const selectedCondition = document.getElementById("condition").value;

    const material = materials[materialType].find(
        material => material.sae_number === selectedSAENumber && material.condition === selectedCondition
    );

    const materialPropertiesDiv = document.getElementById("material-properties");
    materialPropertiesDiv.innerHTML = `
        <h3>Material Properties</h3>
        ${material ? `
            <p><strong>Tensile Strength:</strong><br> ${material.tensile_strength.ksi} ksi | ${material.tensile_strength.mpa} MPa</p>
            <p><strong>Yield Strength:</strong><br> ${material.yield_strength.ksi} ksi | ${material.yield_strength.mpa} MPa</p>
            <p><strong>Ductility (2 in):</strong><br> ${material.ductility_percent_elongation_2in}%</p>
            <p><strong>Brinell Hardness:</strong><br> ${material.brinell_hardness_hb} HB</p>
        ` : `<p>No data available for selected material.</p>`}`;
}

function showCommonProperties() {
    const commonPropertiesDiv = document.getElementById("common-properties");
    commonPropertiesDiv.style.display = 'block';
    commonPropertiesDiv.innerHTML = `
        <h3>Properties common to all carbon and alloy steels</h3>
        <p><strong>Poisson's ratio:</strong><br> 0.27</p>
        <p><strong>Shear modulus:</strong><br> 11.5 x 10<sup>6</sup> psi | 80 GPa</p>
        <p><strong>Coefficient of thermal expansion:</strong><br> 6.5 x 10<sup>-6</sup> °F<sup>-1</sup></p>
        <p><strong>Density:</strong><br> 0.283 lb/in<sup>3</sup> | 7680 kg/m<sup>3</sup></p>
        <p><strong>Modulus of elasticity:</strong><br> 30 x 10<sup>6</sup> psi | 207 GPa</p>
    `;
}

function clearMaterialProperties() {
    document.getElementById("material-properties").innerHTML = `
        <h3>Material Properties</h3>
        <p>Select a material to see its properties.</p>
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
