const searchBox = document.getElementById('search_box');
const button = document.querySelector('.btn--search');
const div = document.querySelector('.information--area');



async function weatherData(url){
    const request = await fetch(url);
    const res = await request.json();

    // populate the document with this data...

    const em = document.createElement('div');
    em.classList.add("details--box");

    em.innerHTML = `
            <div class="location">
               <h5 class="location--name">
               <i class="fa fa-location-pin"></i>
                ${res.name}</h5> 
              <p class="desc">${res.weather[0].description}</p>  
            </div>
            <h5 class="temperature">${(res.main.temp - 273.15).toFixed(2)}<sup>o</sup>C</h5>
            <div class="img--box">
                <img src="http://openweathermap.org/img/w/${res.weather[0].icon}.png" alt="">
            </div>

            <button class="refresh--btn" onclick="location.reload()">
                <i class="fa-solid fa-arrows-rotate"></i>
            </button>

    `
     div.appendChild(em);


}

async function  main(value) {
    // get the key from file....
    const file = await fetch('./api.json');
    const res = await file.json();
    weatherData(`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${res.key}`);

}





button.addEventListener('click', (e)=>{
    e.preventDefault();

    div.innerHTML = "";

    const city_name = searchBox.value;

        main(city_name);
})


