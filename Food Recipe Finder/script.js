// API credentials (Note: In production, these should be secured on the backend)
const APP_ID = 'YOUR_EDAMAM_APP_ID'; // Replace with your Edamam app ID
const APP_KEY = 'YOUR_EDAMAM_APP_KEY'; // Replace with your Edamam app key

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const healthFilters = document.querySelectorAll('.health-filter');
const recipeModal = document.getElementById('recipeModal');
const closeModal = document.getElementById('closeModal');

// Current search filters
let currentQuery = '';
let currentHealthFilter = '';

// Event listeners
searchBtn.addEventListener('click', searchRecipes);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchRecipes();
});

healthFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Toggle active state
        healthFilters.forEach(f => f.classList.remove('bg-amber-100', 'border-amber-400'));
        if (filter.classList.contains('bg-amber-100')) {
            filter.classList.remove('bg-amber-100', 'border-amber-400');
            currentHealthFilter = '';
        } else {
            filter.classList.add('bg-amber-100', 'border-amber-400');
            currentHealthFilter = filter.dataset.filter;
        }
        
        // If we have a current query, search again with the new filter
        if (currentQuery) {
            searchRecipes();
        }
    });
});

closeModal.addEventListener('click', () => {
    recipeModal.classList.add('hidden');
});

// Search for recipes
async function searchRecipes() {
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    currentQuery = query;
    
    try {
        // Show loading state
        resultsContainer.innerHTML = '';
        loadingSpinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        
        // Build API URL
        let url = `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&to=12`;
        
        if (currentHealthFilter) {
            url += `&health=${currentHealthFilter}`;
        }
        
        // Fetch recipes
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        
        const data = await response.json();
        
        // Hide loading state
        loadingSpinner.classList.add('hidden');
        
        if (data.hits.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-center py-12 col-span-full text-gray-500">
                    <i class="fas fa-search text-4xl mb-4"></i>
                    <p>No recipes found for "${query}"</p>
                </div>
            `;
            return;
        }
        
        // Display recipes
        displayRecipes(data.hits);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        loadingSpinner.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
}

// Display recipes in the UI
function displayRecipes(recipes) {
    resultsContainer.innerHTML = '';
    
    recipes.forEach(hit => {
        const recipe = hit.recipe;
        
        const recipeCard = document.createElement('div');
        recipeCard.className = 'bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200';
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2 text-gray-800 line-clamp-2">${recipe.label}</h3>
                <div class="flex justify-between text-sm text-gray-600 mb-3">
                    <span><i class="fas fa-clock mr-1"></i> ${Math.round(recipe.totalTime)} min</span>
                    <span><i class="fas fa-utensils mr-1"></i> ${Math.round(recipe.calories/servings)} cal/serving</span>
                </div>
                <div class="flex flex-wrap gap-1 mb-3">
                    ${recipe.healthLabels.slice(0, 3).map(label => `
                        <span class="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">${label}</span>
                    `).join('')}
                </div>
                <button 
                    class="view-recipe-btn w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded transition duration-200 mt-2"
                    data-recipe='${JSON.stringify(recipe).replace(/'/g, "\\'")}'
                >
                    View Recipe
                </button>
            </div>
        `;
        
        resultsContainer.appendChild(recipeCard);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const recipe = JSON.parse(btn.dataset.recipe);
            showRecipeModal(recipe);
        });
    });
}

// Show recipe details in modal
function showRecipeModal(recipe) {
    // Set modal content
    document.getElementById('modalRecipeTitle').textContent = recipe.label;
    document.getElementById('modalRecipeImage').src = recipe.image;
    document.getElementById('modalRecipeImage').alt = recipe.label;
    
    // Ingredients list
    const ingredientsList = document.getElementById('modalRecipeIngredients');
    ingredientsList.innerHTML = '';
    recipe.ingredientLines.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });
    
    // Nutrition info
    const nutritionDiv = document.getElementById('modalRecipeNutrition');
    nutritionDiv.innerHTML = `
        <p><strong>Calories:</strong> ${Math.round(recipe.calories)}</p>
        <p><strong>Servings:</strong> ${recipe.yield}</p>
        <p><strong>Diet Labels:</strong> ${recipe.dietLabels.join(', ') || 'None'}</p>
        <p><strong>Health Labels:</strong> ${recipe.healthLabels.slice(0, 5).join(', ')}</p>
    `;
    
    // Instructions (link to original source)
    const instructionsDiv = document.getElementById('modalRecipeInstructions');
    instructionsDiv.innerHTML = `
        <p>For detailed instructions, please visit the original recipe source.</p>
    `;
    
    // Original recipe URL
    const recipeUrl = document.getElementById('modalRecipeUrl');
    recipeUrl.href = recipe.url;
    
    // Show modal
    recipeModal.classList.remove('hidden');
}