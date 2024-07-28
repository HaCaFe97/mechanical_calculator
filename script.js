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

// script.js

document.getElementById('unit-system').addEventListener('change', updateUnits);
document.getElementById('sub-unit-system').addEventListener('change', updateSubUnits);

function updateUnits() {
    const unitSystem = document.getElementById('unit-system').value;
    const subUnitSystem = document.getElementById('sub-unit-system');
    const forceUnit = document.getElementById('force-unit');
    const areaUnit = document.getElementById('area-unit');

    if (unitSystem === 'imperial') {
        subUnitSystem.innerHTML = `
            <option value="lbf/in^2">lbf/in²</option>
            <option value="kips/in^2">kips/in²</option>
        `;
        forceUnit.textContent = 'lbf';
        areaUnit.textContent = 'in²';
    } else {
        subUnitSystem.innerHTML = `
            <option value="N/m^2">N/m²</option>
            <option value="N/mm^2">N/mm²</option>
        `;
        forceUnit.textContent = 'N';
        areaUnit.textContent = 'm²';
    }
    updateSubUnits();
}

function updateSubUnits() {
    const subUnitSystem = document.getElementById('sub-unit-system').value;
    const forceUnit = document.getElementById('force-unit');
    const areaUnit = document.getElementById('area-unit');
    
    if (subUnitSystem === 'lbf/in^2') {
        forceUnit.textContent = 'lbf';
        areaUnit.textContent = 'in²';
    } else if (subUnitSystem === 'kips/in^2') {
        forceUnit.textContent = 'kips';
        areaUnit.textContent = 'in²';
    } else if (subUnitSystem === 'N/m^2') {
        forceUnit.textContent = 'N';
        areaUnit.textContent = 'm²';
    } else if (subUnitSystem === 'N/mm^2') {
        forceUnit.textContent = 'N';
        areaUnit.textContent = 'mm²';
    }
}

function calculateStress() {
    const force = parseFloat(document.getElementById('force').value);
    const area = parseFloat(document.getElementById('area').value);
    const subUnitSystem = document.getElementById('sub-unit-system').value;

    if (!isNaN(force) && !isNaN(area) && area > 0) {
        let stress = force / area;
        let unitLabel = subUnitSystem;

        // Convert stress to appropriate sub-unit
        if (subUnitSystem === 'kips/in^2') {
            stress ; // 1 kip = 1000 lbf
            unitLabel = 'ksi';
        } else if (subUnitSystem === 'N/mm^2') {
            stress ; // 1 N/mm² = 1e6 N/m²
            unitLabel = 'MPa';
        } else if (subUnitSystem === 'N/m^2') {
            unitLabel = 'Pa';
        } else if (subUnitSystem === 'lbf/in^2') {
            unitLabel = 'psi';
        }

        document.getElementById('stress-result').textContent = `Stress: ${stress.toFixed(2)} ${unitLabel}`;
    } else {
        document.getElementById('stress-result').textContent = 'Stress: Invalid input';
    }
}

// Inicializar unidades
updateUnits();




// Set default tab
document.querySelector(".tab-button").click();
