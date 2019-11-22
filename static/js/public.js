/* here the javascript functions used in 'last', 'compare' and 'related',
it is named 'public.js' because implement the usage of public APIs */

function addSearchEntry(r) {

    const entry = $("#master").clone();
    const computedId = `video-${video.id}`;

    entry.attr("id", computedId);
    $("#report").append(entry);

    $("#" + computedId + " .compare").attr('href', `/compare/#${video.productId}`);
    let title = $("#" + computedId + " .compare").attr('title') + "«" + video.productName+ "»";
    $("#" + computedId + " .compare").attr('title', title);

}

function initLast() {

    const url = buildApiUrl('last', compareId);
    $.getJSON(url, function (results) {
        if (_.size(results) == 0) {
            $("#error").append("error?");
            return;
        }
        console.log(results);

        _.each(results, addSearchEntry);

    });
}

