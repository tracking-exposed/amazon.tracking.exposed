function API(ids) {
    let url =null;
    if (window.location.origin.match(/localhost/)) {
        url='http://localhost:11000/api/v1/views/' + ids;
        console.log("Development URL", url);
    } else {
        url='/api/v1/searchcsv/' + ids;
        console.log("Production URL", url);
    }
    return url;
}

function pickIds() {
    console.log(window.location.href);
    let x = window.location.href.split('/#').pop();
    console.log(x);
    return x;
}

function initView() {
    let ids = pickIds();
    let url = API(ids);

    $.getJSON(url, function (results) {
        $("#title").text(results.title);
        console.log(results);
        appendProductTable1(results.byId, $("#results"), results.averages);
    });
}

function header(color, name, media) {
    return `
      <div class="card ${color.replace("border", "bg")}">
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <p class="card-text">Prezzo medio: ${media} €</p>
        </div>
      </div>
    `;
}

function productEntry(answer, individualColor, personName) {

    if(!answer) {
        return `
        <div class="card text-white bg-dark text-center">
          <div class="card-body">
            <div class="card-header" style="font-size:5em;">🚫</div>
            <h5 class="card-title">Oggetto NON offerto a <b>${personName}</b></h5>
          </div>
        </div>
        `;
    }

    return `
    <div class="card ${individualColor}">
      <div class="card-body">
        <h5 class="card-title">Prezzo: ${answer.first}€</h5>
        <img class="card-img-top" src="${answer.thumbnail}" alt="Card image cap" />
        <p class="card-text">${answer.name}</p>
        <p class="card-text"><small class="text-muted">Apparso in posizione: ${answer.order}</small></p>
      </div>
    </div>
    `;
}

function appendProductTable1(map, jdiv, averages) {
    // we're lucky because we consider the experiments results with 4 user 
    // but otherwise the results.users would be handy to craft the row-col-size 

    constPersonalColors = {
        "Silvia": "border-primary",
        "Salvatore": "border-danger",
        "Claudio": "border-light",
        "Giulia": "border-success",
        "Riccardo": "border-secondary"
    };

    let opening = '<div class="card-deck">';
    opening += header(constPersonalColors.Silvia, 'Silvia', averages[0]);
    opening += header(constPersonalColors.Salvatore, 'Salvatore', averages[1]);
    opening += header(constPersonalColors.Claudio, 'Claudio', averages[2]);
    opening += header(constPersonalColors.Giulia, 'Giulia', averages[3]);
    opening += header(constPersonalColors.Riccardo, 'Riccardo', averages[4]);
    opening += '</div>';
    jdiv.append(opening);

    _.each(map, function(infos) {
        const matchlist = _.values(infos);
        let line = '<div class="card-deck">' +
            productEntry(matchlist[0], constPersonalColors.Silvia, 'Silvia') +
            productEntry(matchlist[1], constPersonalColors.Salvatore, 'Salvatore') +
            productEntry(matchlist[2], constPersonalColors.Claudio, 'Claudio') +
            productEntry(matchlist[3], constPersonalColors.Giulia, 'Giulia') +
            productEntry(matchlist[4], constPersonalColors.Riccardo, 'Riccardo') +
        '</div>';
        jdiv.append(line);
    });
}