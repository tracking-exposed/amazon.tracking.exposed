/* functions used in 'personal' visualization */

function getPubKey() {
    const t = window.location.href.split('/#').pop();
    if(t.length != 44 ) console.log("Wrong token length in the URL", t.length);
    return t;
}

function personal(pages, profile) {

    if(!pages) pagestr = '10-0';
    else {
        $("#report").empty();
        pagestr = 10 + '-' + (pages - 10);
    }
    const pk = getPubKey();
    const url = buildApiUrl('personal', pk + '/' + pagestr); // `/personal/${pk}/`);
    $.getJSON(url, (data) => {
        _.each(data.recent, function(e, i) {
            if(e.type == 'product') 
                addProductRow(e, i);
            if(e.type == 'search')
                addSearchRow(e, i);
        });
        addPages(data.total, pagestr);
        if(!profile) updateProfileInfo(data.supporter);
    });
}

function updateProfileInfo(profile) {
    const publicKey = `${profile.publicKey}`;
    const userName = `${profile.p}`;
    const createdAt = new Date(`${profile.creationTime}`);
    const lastActivity = new Date(`${profile.lastActivity}`);
    const createdAtFormatted = createdAt.toUTCString();
    const lastActivityFormatted = lastActivity.toUTCString();

    $('#createdAtFormatted').text(createdAtFormatted);
    $('#accessToken').text(publicKey);
    $('#lastActivityFormatted').text(lastActivityFormatted);
    $('#user-name').text(userName);

    if (profile.tag) {
        $("#tag-name").text(profile.tag.name);
        $("#tag-badge").removeAttr('hidden');
        console.log('tag only ---', profile.tag);
    }
    console.log("profile display", JSON.stringify(profile, undefined, 2));
}


function printMessage(element, text, type) {
    if(!type) var type = 'danger';
    element.html('<p class="alert alert-' + type + ' mb-3">' + text + '</p>');
}

function createTag() { return manageTag('create'); }
function joinTag() { return manageTag('join'); }
function manageTag(action) {
    const pk = getPubKey();
    const error = $('#error');
    const resultDiv = $('#result');
    error.empty();
    resultDiv.empty();

    console.log("manageTag", action)

    const tag = $('#tag').val();
    const password = $("#password").val();
    const description = $("#description").val();
    const private = $("#private").is(':checked')

    /* in data we add the tag info to be sent */
    let data = {
        tag: _.trim(tag),
        password,
        description,
        accessibility: private ? 'private': 'public'
    };

    /* this was happening in development, maybe never happen in production */
    if( _.size(password) > 0 && data.accessibility == 'private')
        $("#group-password-wrapper").show();
    if( _.size(description) >  0 && action == 'create' )
        $("#description-block").show();

    /* validation */
    if(_.size(tag) == 0) {
        printMessage(error, 'Please, enter a tag name.');
        return;
    }

    if(action == 'create') {
        $("#description-block").show();
        if(_.size(description) == 0) {
            printMessage(error, 'Please add a description to the new tag');
            return;
        }
    } else {
        $("#description-block").hide();
        _.unset(data, 'description');
    }

    if(private) {
        $("#group-password-wrapper").show();
        if(_.size(password) < 8) {
            printMessage(error, 'Private tag require a password longer than 8 keys.');
            return;
        }
    } else {
        data.password = "";
        $("#group-password-wrapper").hide();
    }

    /* XHR section */
    let url = null;
    if(action == 'create')
        url = buildApiUrl(`profile/${pk}/tag`, null, 2);
    else /* action == 'update' */
        url = buildApiUrl(`profile/${pk}`, null, 2);

    console.log("Ready to ", action, tag, "via", url);

    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(function(response) {
        return response.json();
    }).then(function(result) {
        if(result.error == true) {
            console.log("Server side error:", result);
            printMessage(resultDiv, result.message);
        }
        else {
            updateProfileInfo(result);
            printMessage(resultDiv, 'You are now tagging as "<b>' + result.tag.name + '</b>"', 'success');
        }
        return result;
    })
    .catch(function(e) {
        printMessage(error, "fail to communicate with the server");
        console.log(e.message);
    });
}

function downloadCSV() {
    const pk = getPubKey();
    const csvurl = `/api/v1/personal/${pk}/csv`;
    console.log("downloadCSV from: ", csvurl);
    window.open(csvurl);
}

function addPages(total, pages) {
    const ul = $('#pagination').find('ul');
    const pageString = pages.split('-').shift();
    const actualPage = pageString.slice(0, -1);

    ul.empty();
    if(total > 10) {
        var page;
        const pagesNumber = _.round(total / 10);
        const description = `There are <b>${total}</b> evidences. Page <b>${actualPage}</b> of <b>${pagesNumber}</b>`;
        $('#total-evidence').html(description);
        for (page = 1; page < pagesNumber + 1; page++) {
            let liStyle = '';
            let pageValue =  page + '0';
            if (pageValue == actualPage + '0')  liStyle = ' red';
            ul.append('<li class="page-item"><a class="page-link' + liStyle + '" onclick="personal(' + pageValue + ', true)">'+ page +'</a></li>');
        }
    }
}

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

function addSearchRow(result, i) {
    const entry = $("#masterResults").clone();
    const computedId = `search-${result.id}`;

    entry.attr("id", computedId);
    $("#report").append(entry);

    $("#" + computedId + " .search").attr('href', `/search/`);
    $("#" + computedId + " .title").text(result.query);
    $("#" + computedId + " .results").text(_.size(result.results));
    $("#" + computedId + " .average").text(computeAverage(result.results) + ' €');
    $("#" + computedId + " .relative").text(result.relative + " - " + result.savingTime);

    entry.removeAttr('hidden');
}

function addProductRow(video, i) {
    const entry = $("#master").clone();
    const computedId = `video-${video.id}`;

    entry.attr("id", computedId);
    $("#report").append(entry);

    $("#" + computedId + " .compare").attr('href', `/compare/#${video.productId}`);
    let title = $("#" + computedId + " .compare").attr('title') + "«" + video.productName+ "»";
    $("#" + computedId + " .compare").attr('title', title);

    $("#" + computedId + " .relative").text(video.relative + " - " + video.savingTime);

    $("#" + computedId + " .relative").on('click', function(e) {
        $("#" + computedId + " .relative").text(video.id);
          // devo far apparire l'id al posto della data,
          // così da poter recuperare l'evidenza specifica
    });
    $("#" + computedId + " .productName").text(video.productName);
    $("#" + computedId + " .productName").attr('href', "https://www.amazon.com/dp/" + video.productId);
    $("#" + computedId + " .order").text(`${i+ 1}`);
    $("#" + computedId + " .categories").html(_.map(video.sections, function(s) {
        return s.category + " (" + _.size(s.related) + ")";
    }).join('<br>'));

    entry.removeAttr('hidden');
}

function removeEvidence(e) {
    const id = $(this).attr('yttrex-id');
    const pk = getPubKey();
    const deleteURL = buildApiUrl(`personal/${pk}/selector/id/${id}`, null, 2);
    console.log(deleteURL);
    return fetch(deleteURL, {
        method: 'DELETE',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer' // no-referrer, *client
    }).then(function(response) {
        console.log(response);
        return response.json();
    }).then(function(result) {
        const selectorId = `#video-${id}`;
        $(selectorId).fadeOut(300);
        console.log(result);
    });
}

function showPassword(status) {
    if( status == 'private') $('#group-password-wrapper').show();
    else $('#group-password-wrapper').hide();
}
