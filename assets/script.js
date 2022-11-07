
//Var
const namejson = ["6-24.json", "7-24.json", "9-24.json", "10-25.json", "11-24.json", "12-1.json", "12-2.json", "12-3.json", "12-4.json", "12-5.json", "12-6.json", "12-7.json", "12-8.json", "12-9.json", "12-10.json", "12-11.json", "12-12.json", "12-13.json", "12-14.json", "12-15.json", "12-16.json", "12-17.json", "12-18.json", "12-19.json"];
const datastart = "data/";
const table = [];
let rank
let filtertable = "Win";
let legend = [];
let iteration = 0
let toptwenty = []
let fx=1

//Fetch
namejson.forEach(element => {
    const tabledata = []
    fetch(datastart + element)
        .then((response) => response.json())
        .then((json) => tabledata.push(json))



    table.push(tabledata)

});
//function de vérification de redondance
function redondance(e) {
    const check = legend.map(l => l.Nom + l.Rôle).indexOf(e)
    rank = check;
    return check
}
//function d'aggrégation des infos
function insertionlegend() {
    table.forEach((element, i) => {
        element.forEach(element => {
            element.forEach(element => {
                if (redondance(element.Nom + element.Rôle) > -1) {
                    legend[rank][filtertable][namejson[i]] = element[filtertable].replace('%', '')


                }
                else {
                    const champion = {
                        Nom: element.Nom,
                        Rôle: element.Rôle,
//Remplacer win par filtertable
                    }
                    champion[filtertable]=[]
                 
                    champion[filtertable][namejson[i]] = element[filtertable].replace('%', '')
                    legend.push(champion);

                }
            })

        }
        )

    })
    setTimeout(creationbarre, 30)
};
//Fonction Ranking
function ranking(i) {
    if (iteration > namejson.length - 1) {
        iteration = namejson.length - 1
        console.log("too high");
    }
    else if (iteration < 0) {
        iteration = 0

    }

    else { }
    console.log(i);
    legend.sort((a, b) => { return b[filtertable][namejson[i]] - a[filtertable][namejson[i]] })

    //Stockage uniquement du top 20
    toptwenty = []
    for (let index = 0; index < 20; index++) {
        toptwenty[index] = legend[index]

    }
    toptwenty.sort((a, b) => { return a[filtertable][namejson[iteration]] - b[filtertable][namejson[iteration]] })

    iteration++


}
//Fonction Largeur
function largeur() {
    if(filtertable=="Win"){
        
        d3.selectAll(".barre")
        .style('height', (d) => `${10*d.Win[namejson[iteration - 1]] - 480 }%`)
    }
    else if(filtertable=="Ban"){
        console.log("ban");
        fx=1.5
        d3.selectAll(".barre")
        .style('height', (d) => `${d[filtertable][namejson[iteration - 1]]*fx}%`)
    }
    else{
        fx=2.7
        d3.selectAll(".barre")
        .style('height', (d) => `${d[filtertable][namejson[iteration - 1]]*fx}%`)
    }

       
}

//Check d3
d3.select("body")
    .append("div")
    .text("Ok")
    .attr("class", "check")

//D3 barres
function creationbarre() {
    console.log(iteration);
    ranking(iteration)
    d3.selectAll(".barre")
        .remove()
    //temporary ranking for visualisation
    function createwait() {

        d3.select("#datachart")
            .selectAll("p")
            .data(toptwenty)
            .enter()
            .append("p")
            .attr("class", "barre")
            .html((d, i) => `<div class="nomlegend">Nom: ${d.Nom}</div> <div class="ranglegend"> Rang:${i + 1}</div> <div class="classlegend">${filtertable}:${d[filtertable][namejson[iteration - 1]]}% </div>   <img src="https://www.mobafire.com/images/champion/square/${d.Nom.replace(" ", "-").replace("'", "").toLowerCase()}.png" alt="">`)
        d3.select("#version")
            .html(namejson[iteration - 1])
        setTimeout(largeur, 300)
    }
    setTimeout(createwait, 10)
}

//Interval pour boucle d'update chart
//const creationbarreinterval=setInterval(function(){creationbarre()}, 5000)
document.addEventListener("DOMContentLoaded", function () {
    const url = window.location.href
    filtertable=url.slice(window.location.href.indexOf("=")+1, window.location.href.length)
   
    setTimeout(insertionlegend, 300)
    
    document.querySelector('#forward').addEventListener("click", function () {

        creationbarre();
    })
    document.querySelector('#backward').addEventListener("click", function () {
        iteration = iteration - 2
        creationbarre();
    })

})



//Fonction de mise à jour du graphique





//on pourrait améliorer l'efficacité et le fonctionnement avec des promises de async sur le fetch




//Pour chaque sort, on update les barres
//Les hautes sont définis par le rangs*quelques choses qui permettent de changer la valeur du style top
//Si on a pas de temps, entre chaque version on fait un opacity 0% width 0% puis suppresion et remplacement

//https://stackoverflow.com/questions/25168086/sorting-objects-based-on-property-value-in-d3
//https://observablehq.com/@d3/bar-chart-transitions
