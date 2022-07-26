import {
    buildRecipeCard,
    combineIdsToString,
    checkLocalStorageData,
    clickFavoriteIcon,
    buildFavRecipesList
} from '../functions/functions.js';
import { getSearchedRecipes, getRecipesByIdInBulk, getRandomRecipes } from '../model/home-model';


let recipeContainer = document.getElementById("random-container");
let searchInput = document.getElementById("search-input");
let heartContainer = [...document.getElementsByClassName("heart-container")];


//CHECK TO SEE IF WE HAVE RECIPE DATA IN THE LOCAL STORAGE
//IF WE DON'T, WE ADD AN EMPTY ARRAY
checkLocalStorageData();



//SEARCH BUTTON
//WHEN YOU PUT IN THE INGREDIENTS & CLICK ENTER
searchInput.addEventListener('keypress', e => {
    if (e.key == 'Enter') {
        //let's get the comma separated list of ingredients
        let ingredients = e.target.value.trim();
        buildSearchedRecipes(ingredients);
        e.preventDefault();
    }
})





//BUILD THE VIEW FOR THE RECIPES 
//WHEN USER ENTERS INGREDIENTS
async function buildSearchedRecipes(ingredients) {

    // let formattedIngredientList = buildIngredientsList(ingredients);


    //get recipes based on ingredients entered
    let searchedRecipes = await getSearchedRecipes(ingredients);

    //now, get more information about those recipes 
    //by passing in their id's as a string separated by a comma
    let idsCommaSeparated = combineIdsToString(searchedRecipes);


    let fullInformationRecipes = await getRecipesByIdInBulk(idsCommaSeparated);


    console.log(fullInformationRecipes + "hello");
    //let's empty the recipe container
    recipeContainer.innerHTML = "";

    //Now, lets add recipes to the container
    fullInformationRecipes.forEach(recipe => {
        let name = recipe.title;
        let img = recipe.image;
        let time = recipe.readyInMinutes;
        let servings = recipe.servings;
        let id = recipe.id;

        ;

        let card = buildRecipeCard(name, time, servings, img, id);

        let div = document.createElement("div");

        div.innerHTML = card;

        recipeContainer.appendChild(div);

    });


    //get all the recipe cards that have been built
    //we want to add event listeners to the cards favorite icon
    heartContainer = [...document.getElementsByClassName("heart-container")];
    heartContainer.forEach(icon => {
        icon.addEventListener("click", (e) => {
            clickFavoriteIcon(icon.firstElementChild);


            //add or remove the recipe from a favoripe recipes view
            buildFavRecipesList()

            e.preventDefault();
        })
    })

}



//BUILD VIEW FOR RANDOM RECIPES
async function buildRandomRecipes() {
    let randomRecipes = await getRandomRecipes();

    randomRecipes.recipes.forEach(recipe => {
        let name = recipe.title;
        let img = recipe.image;
        let time = recipe.readyInMinutes;
        let servings = recipe.servings;
        let id = recipe.id;

        let card = buildRecipeCard(name, time, servings, img, id);

        let div = document.createElement("div");
        div.innerHTML = card;

        recipeContainer.appendChild(div);

    });

    //get all the recipe cards that have been built
    //we want to add event listeners to the cards favorite icon
    heartContainer = [...document.getElementsByClassName("heart-container")];
    heartContainer.forEach(icon => {
        icon.addEventListener("click", (e) => {

            clickFavoriteIcon(icon.firstElementChild)
                //add or remove the recipe from a favoripe recipes view
            buildFavRecipesList();
            e.preventDefault();
        })
    })


}


//EXPAND THE FAVORITE RECIPES VIEW
function expandFavRecipesView() {
    //Exanding a block to show favorite recipes on clicking a button
    let expandingBlock = document.getElementById('expanding-block');
    let expandBtn = document.getElementById('expand-btn');

    expandBtn.addEventListener('click', () => {
        expandingBlock.classList.toggle('expandable');
    })
}




buildRandomRecipes();
buildFavRecipesList();
expandFavRecipesView();