document.addEventListener("DOMContentLoaded", ()=>{

        const date = document.getElementById('date');
        const year = new Date().getFullYear();

        date.innerHTML = year;


})