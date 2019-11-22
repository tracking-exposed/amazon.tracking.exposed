/* here the javascript functions used in 'last', 'compare' and 'related',
it is named 'public.js' because implement the usage of public APIs */

function addSearchEntry(r) {

    const entry = $("#master").clone();
    const computedId = `r-${r.id}`;

    entry.attr("id", computedId);
    $("#report").append(entry);

    $("#" + computedId + " .title").text(r.query);

    console.log(r);
    $("#" + computedId + " .owner").attr('href', `/personal/#${r.publicKey}`);

    const blockos = _.map(r.results, function(sugg) {
        let closure = (sugg.unit == 'euro') ? '€)' : '$)';
        let x = '<span class="col-2" style="display:inline-block;border:1px #904242 solid;border-radius: 10px;">' +
                '<smaller>|' + sugg.index + '|</smaller>' +
                sugg.name + ' (' + _.first(sugg.price) + closure + 
                '</span>';
        console.log(x);
        return x;
    });
    $("#" + computedId + " .slots").html(blockos.join(''));
    
    entry.removeAttr('hidden');
} // 58b3

function initLast() {

    const url = buildApiUrl('last');
    $.getJSON(url, function (results) {
        if (_.size(results) == 0) {
            $("#error").append("error?");
            return;
        }
        console.log(results);

        _.each(results.content, addSearchEntry);
    });
}

