/* here the javascript functions used in 'last', 'compare' and 'related',
it is named 'public.js' because implement the usage of public APIs */

/* duplicated code */
function computeAverage(returned) {
    USDEUR = 1.14;
    const sequence = _.reduce(returned, function(memo, q) {
        let ready;
        if(q.unit == 'dollar')  {
            ready = _.map(q.price, function(value) {
                return value * USDEUR;
            });
        } else ready = q.price;

        return _.concat(memo, ready);
    }, []);
    
    if(_.size(sequence) > 0) {
        return _.round(_.sum(sequence) / _.size(sequence), 1);
    } else {
        return 'N/A'
    }
}
/* duplicated code */

function addSearchEntry(r) {

    const entry = $("#master").clone();
    const computedId = `r-${r.id}`;

    entry.attr("id", computedId);
    $("#report").append(entry);

    console.log(r);
    $("#" + computedId + " .title").text(r.query);
    $("#" + computedId + " .average").text(computeAverage(r.results) + ' €');
    $("#" + computedId + " .individual").text(r.pseudo);
    $("#" + computedId + " .owner").attr('href', `/personal/#${r.publicKey}`);
    $("#" + computedId + " .individual").attr('href', `/personal/#${r.publicKey}`);

    const blockos = _.map(r.results, function(sugg) {
        let closure = (sugg.unit == 'euro') ? '€)' : '$)';
        let x = '<span class="col-2" style="display:inline-block;border:1px #904242 solid;border-radius: 10px;">' +
                '<smaller>|' + sugg.index + '|</smaller>' +
                sugg.name + ' (' + _.first(sugg.price) + closure + 
                '</span>';
        return x;
    });
    $("#" + computedId + " .slots").html(blockos.join(''));
    
    entry.removeAttr('hidden');
}

function initLast() {

    let url = null;
    if (window.location.origin.match(/localhost/)) {
        url='http://localhost:11000/api/v1/last';
        console.log("Development URL", url);
    } else {
        url='/api/v1/last';
        console.log("Production URL", url);
    }

    $.getJSON(url, function (results) {
        if (_.size(results) == 0) {
            $("#error").append("error?");
            return;
        }
        _.each(results.content, addSearchEntry);
    });
}

function searchCSV() {

    let csvurl =null;
    if (window.location.origin.match(/localhost/)) {
        csvurl='http://localhost:11000/api/v1/searchcsv';
        console.log("Development URL", csvurl);
    } else {
        csvurl='/api/v1/searchcsv';
        console.log("Production URL", csvurl);
    }
    window.open(csvurl);
}

function initCompare() {

    const productId = window.location.href.split('/#').pop();
    if(_.size(productId) < 6) {
        const nope = `<h3 class="text-center">Error: URL should contain a valid-look-alike Amazon product Id</h3>`;
        $("#error").html(nope);
        return console.log("error N#1 (validation)");
    }

    const url = buildApiUrl('product', productId);
    $.getJSON(url, function(data) {
        console.log(data);
    })



}