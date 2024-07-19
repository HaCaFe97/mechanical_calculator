document.addEventListener('DOMContentLoaded', function () {
    fetch('materials.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Materials loaded:', data); // Agrega esta línea para depuración
            const materialSelect = document.getElementById('material');
            materialSelect.innerHTML = ''; // Clear the loading message
            data.materials.forEach(material => {
                let option = document.createElement('option');
                option.value = material.name;
                option.text = material.name;
                materialSelect.add(option);
            });
        })
        .catch(error => {
            console.error('Error fetching the materials:', error);
            const materialSelect = document.getElementById('material');
            materialSelect.innerHTML = '<option value="">Error cargando materiales</option>';
        });

    document.getElementById('calculateStressButton').addEventListener('click', calculateStress);
    document.getElementById('calculateTorsionButton').addEventListener('click', calculateTorsion);
});

function calculateStress() {
    const force = parseFloat(document.getElementById('force').value);
    const area = parseFloat(document.getElementById('area').value);
    if (isNaN(force) || isNaN(area) || area === 0) {
        document.getElementById('stressResult').innerText = 'Por favor, ingrese valores válidos.';
    } else {
        const stress = force / area;
        document.getElementById('stressResult').innerText = `Esfuerzo: ${stress.toFixed(2)} N/mm²`;
    }
}

function calculateTorsion() {
    const torque = parseFloat(document.getElementById('torque').value);
    const radius = parseFloat(document.getElementById('radius').value);
    if (isNaN(torque) || isNaN(radius) || radius === 0) {
        document.getElementById('torsionResult').innerText = 'Por favor, ingrese valores válidos.';
    } else {
        const torsion = torque / radius;
        document.getElementById('torsionResult').innerText = `Torsión: ${torsion.toFixed(2)} N/mm`;
    }
}
