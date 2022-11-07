
//Var
const namejson = ["6-24.json", "7-24.json", "8-24.json", "9-24.json", "10-25.json", "11-24.json", "12-1.json", "12-2.json", "12-3.json", "12-4.json", "12-5.json", "12-6.json", "12-7.json", "12-8.json", "12-9.json", "12-10.json", "12-11.json", "12-12.json", "12-13.json", "12-14.json", "12-15.json", "12-16.json", "12-17.json", "12-18.json", "12-19.json"];
const datastart = "data/";

let rank;
let filtertable = "Win";
let legend = [];
let iteration = 0;
let toptwenty = [];

//Fetch

async function getJson(){
const table = [];

    namejson.forEach(element => {
        const tabledata = []
        fetch(datastart + element)
            .then((response) => response.json())
            .then((json) => tabledata.push(json))
    
    
    
        table.push(tabledata)
    
    });

return table;
}

getJson().then(table=>{
    console.log(table);
})

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
                        Win: []
                    }
                    champion[filtertable][namejson[i]] = element[filtertable].replace('%', '')
                    legend.push(champion);

                }
            })

        }
        )

    })

};
//Fonction Ranking
function ranking(i) {
    if (iteration > namejson.length-1) {
        iteration=0
    }
    else if (iteration<0) {
        iteration=namejson.length-2
    
    }
    
    else { }
  
        (legend.sort((a, b) => { return b[filtertable][namejson[i]] - a[filtertable][namejson[i]] }))
 
//Stockage uniquement du top 20
        toptwenty=[]
    for (let index = 0; index < 20; index++) {
        toptwenty[index] = legend[index]
        
    }
    

    iteration++
    

}
//Fonction Largeur
function largeur() {
    d3.selectAll(".barre")
        .style('height', (d) => `${3.4 * d.Win[namejson[iteration - 1]] - 104}%`)
}

//Check d3
d3.select("body")
    .append("div")
    .text("Ok")
    .attr("class", "check")

//D3 barres
function creationbarre() {
    console.log(iteration);
    d3.selectAll(".barre")
        .remove()
    console.log("hello");
    //temporary ranking for visualisation
    ranking(iteration)
    d3.select("#datachart")
        .selectAll("p")
        .data(toptwenty)
        .enter()
        .append("p")
        .attr("class", "barre")

        // -1 temporaire
        .html((d, i) => `Nom: ${d.Nom} Rang:${i + 1} ${filtertable}:${d.Win[namejson[iteration-1]]}`)
    setTimeout(largeur, 500)
}

//Interval pour boucle d'update chart
//const creationbarreinterval=setInterval(function(){creationbarre()}, 5000)
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(creationbarre, 100)
    document.querySelector('#forward').addEventListener("click", function () {
        
        creationbarre();
    })
    document.querySelector('#backward').addEventListener("click", function () {
        iteration=iteration-2
        creationbarre();
    })
})

setTimeout(insertionlegend, 30)



//Fonction de mise à jour du graphique





//on pourrait améliorer l'efficacité et le fonctionnement avec des promises de async sur le fetch