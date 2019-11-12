/* here the javascript functions used in 'last', 'compare' and 'related',
it is named 'public.js' because implement the usage of public APIs */

function newVideo(videoID) {
    window.location.assign('#' + videoID);
    console.log("XXX newVideo has been called"); // I'm debugging when this should happen
    location.reload();
}

function initCompare() {

    var compareId = null;
    if(_.size(window.location.href.split('/#')) == 2) {
        compareId = window.location.href.split('/#').pop();
    } 

    if(_.isNull(compareId)) {
        console.log("Not found any ID (returning without action) rif:", window.location.href);
        const nope = `
            <div class="error"><h3 class="text-center">Malformed URL!</h3></div>
        `;
        $("#error").append(nope);
        return;
    }

    const url = buildApiUrl('videoId', compareId);
    $.getJSON(url, function (results) {
        if (_.size(results) == 0) {
            const nope = `
                <h3 class="text-center">This product ID is not present in our database</h3>
            `;
            $("#error").append(nope);
            return;
        }
        console.log(results);

        const allrelated = _.flatten(_.map(results, 'recommended'));
        const csvVideoURL = buildApiUrl("videoCSV", results[0].videoId);

        $("#ifVideoExists").show();
        $("#title").text(results[0].productName);
        $("#relatedSize").text(_.size(allrelated));
        $("#resultSize").text(_.size(results));
        // $("#csvLink").attr('href', csvVideoURL);

        const counted = _.map(_.countBy(allrelated), function(amount, product) {
                return {
                    amount,
                    product
                }
            });
            
        const promotions = _.reverse(_.orderBy(counted, 'amount'));
        console.log(JSON.stringify(promotions, undefined, 2));

        let lastH = null;
        let tableBodyElement = null;
        let tableElement = null;
        _.each(promotions, function (e, i) {
            let currentRepetition = e.amount;
            // something was seen three times now is seen twice ..
            if (currentRepetition != lastH) {
                // when this happen, create a new table
                tableElement = $("#master").clone();
                let tableId = "table-" + currentRepetition;
                tableElement.attr('id', tableId);
                $('#comparison').append(tableElement);
                // this bodyElement would be updated by <tr> below
                tableBodyElement = $("#" + tableId + '> tbody');
                // the tableHeader is on top. we might filter if the table become too long.
                let tableHeader = $("#" + tableId + '> thead');
                // The text printed on top
                let printed = "Recommended " + (currentRepetition > 1 ? currentRepetition + " times" : "once");
                tableHeader.html(`<tr>
                    <th>
                        <h2>${printed}</h2>
                    </th>
                </tr>`);

                $("#" + tableId).append(tableHeader);
                // the table is display:none CSS until we don't display it
                $("#" + tableId).show();
            }
            // copy to spot if change in the next iterations
            lastH = currentRepetition;
            let anid = e.amount + '-' + i;
            const videoEntry = `
                <tr id="${anid}" class="step">
                     <td class="video">
                         ${e.product}
                    </td>
               </tr>
            `;
            tableBodyElement.append(videoEntry);
        });
    });
}

