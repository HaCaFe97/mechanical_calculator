document.addEventListener('DOMContentLoaded', function() {
    const saeSelect = document.getElementById('sae-select');
    const conditionSelect = document.getElementById('condition-select');
    const infoDiv = document.getElementById('material-info');

    // Fetch JSON data
    fetch('carbon_and_alloy_steels.json')
        .then(response => response.json())
        .then(data => {
            const materials = data.carbon_and_alloy_steels;

            // Populate SAE select
            const saeNumbers = [...new Set(materials.map(material => material.sae_number))];
            saeNumbers.forEach(sae => {
                const option = document.createElement('option');
                option.value = sae;
                option.textContent = sae;
                saeSelect.appendChild(option);
            });

            // Populate condition select based on selected SAE number
            saeSelect.addEventListener('change', function() {
                const selectedSAE = this.value;
                conditionSelect.innerHTML = ''; // Clear previous options
                const conditions = materials
                    .filter(material => material.sae_number === selectedSAE)
                    .map(material => material.condition);

                conditions.forEach(condition => {
                    const option = document.createElement('option');
                    option.value = condition;
                    option.textContent = condition;
                    conditionSelect.appendChild(option);
                });

                displayMaterialInfo(); // Update display after populating conditions
            });

            // Handle condition selection
            conditionSelect.addEventListener('change', displayMaterialInfo);

            function displayMaterialInfo() {
                const selectedSAE = saeSelect.value;
                const selectedCondition = conditionSelect.value;
                const selectedMaterial = materials.find(material => material.sae_number === selectedSAE && material.condition === selectedCondition);

                if (selectedMaterial) {
                    infoDiv.innerHTML = `
                        <h2>Material Information</h2>
                        <p><strong>SAE Number:</strong> ${selectedMaterial.sae_number}</p>
                        <p><strong>Condition:</strong> ${selectedMaterial.condition}</p>
                        <p><strong>Tensile Strength (ksi):</strong> ${selectedMaterial.tensile_strength.ksi}</p>
                        <p><strong>Tensile Strength (MPa):</strong> ${selectedMaterial.tensile_strength.mpa}</p>
                        <p><strong>Yield Strength (ksi):</strong> ${selectedMaterial.yield_strength.ksi}</p>
                        <p><strong>Yield Strength (MPa):</strong> ${selectedMaterial.yield_strength.mpa}</p>
                        <p><strong>Ductility (% Elongation in 2 in):</strong> ${selectedMaterial.ductility_percent_elongation_2in}</p>
                        <p><strong>Brinell Hardness (HB):</strong> ${selectedMaterial.brinell_hardness_hb}</p>
                    `;
                } else {
                    infoDiv.innerHTML = '';
                }
            }

            // Initial population of SAE select
            saeSelect.dispatchEvent(new Event('change'));
        })
        .catch(error => console.error('Error loading JSON:', error));
});
