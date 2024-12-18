const regionSelect = document.getElementById('region-select');
const departmentSelect = document.getElementById('department-select');
const showCommunesButton = document.getElementById('show-communes');
const communeList = document.getElementById('commune-list');


async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return null;
    }
}


async function loadRegions() {
    const regions = await fetchData('https://geo.api.gouv.fr/regions');
    if (regions) {
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region.code;
            option.textContent = region.nom;
            regionSelect.appendChild(option);
        });
    }
}


regionSelect.addEventListener('change', async () => {
    const regionCode = regionSelect.value;
    departmentSelect.innerHTML = '<option value="">-- Choisissez un département --</option>';
    departmentSelect.disabled = true;
    showCommunesButton.disabled = true;
    communeList.innerHTML = '';

    if (regionCode) {
        const departments = await fetchData(`https://geo.api.gouv.fr/regions/${regionCode}/departements`);
        if (departments) {
            departments.forEach(department => {
                const option = document.createElement('option');
                option.value = department.code;
                option.textContent = department.nom;
                departmentSelect.appendChild(option);
            });
            departmentSelect.disabled = false;
        }
    }
});


showCommunesButton.addEventListener('click', async () => {
    const departmentCode = departmentSelect.value;
    communeList.innerHTML = '';

    if (departmentCode) {
        const communes = await fetchData(`https://geo.api.gouv.fr/departements/${departmentCode}/communes`);
        if (communes) {
            const sortedCommunes = communes.sort((a, b) => b.population - a.population);
            sortedCommunes.forEach(commune => {
                const div = document.createElement('div');
                div.classList.add('commune');
                div.textContent = `${commune.nom} - ${commune.population.toLocaleString()} habitants`;
                communeList.appendChild(div);
            });
        }
    }
});


departmentSelect.addEventListener('change', () => {
    showCommunesButton.disabled = !departmentSelect.value;
});


loadRegions();