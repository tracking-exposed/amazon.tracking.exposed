
const DATAFETCHSECONDS = 10;
const ANOMALYCHECKSECONDS = 60;
let lastUpdate = null;

function cutSegment(segment) {
    if(_.size(segment) > 24)
        return segment.substr(0, 23) + '…';
    return segment;
}

function prettifyHref(href) {
    const nodomain = href.replace(/https?:\/\/[a-z][a-z][a-z]?\.amazon\.[a-z][a-z][a-z]?/, '');
    const noparms = nodomain.replace(/\?.*/, '');

    if ( _.size(href) > _.size(nodomain) > _.size(noparms)) {
        console.log(_.size(href), _.size(nodomain), _.size(noparms));
    } else {
        console.log(href, "\n", nodomain, "\n", noparms);
    }
    return noparms;
}

function monitor() {
    $("#loader").fadeOut(DATAFETCHSECONDS * 1000);
    setTimeout(monitorUpdate, DATAFETCHSECONDS * 1000);
    setInterval(checkUpdates, ANOMALYCHECKSECONDS * 1000)
}

function checkUpdates() {
    if(!lastUpdate)
        console.error("can't check lastUpdate!");
    else {
        let d = (new Date() - lastUpdate) / 1000;
        console.log("checkUpdates", d);
        if(d > 60) {
            const randomId = "X-" + _.random(0, 0xffff);
            let elem = createE({
                template: 'client',
                relative: new Date(),
                id: randomId,
            }, 0);
            appendInfo(elem, {
                message: `excessive delay in refreshing, (${d}), consider manual F5`,
                id: randomId,
            });
        }
    }
}

function existingId(entry) {
    let exist = $("#" + entry.id);
    return !!exist.length;
}

function monitorUpdate() {

    const url = lastUpdate ?
        buildApiUrl('monitor', "1", 2) :
        buildApiUrl('monitor', null, 2);
    // at the first execution the server has a 5 minutes default,
    // further iteration consider the last 60 seconds.
    // duplication are stripped here: client-side

    $("#loader").finish();
    $("#loader").addClass('connecting');
    $("#loader").show();

    $.getJSON(url, (data) => {

        lastUpdate = new Date();

        if(!_.size(data.content)) {
            const randomId = "X-" + _.random(0, 0xffff);
            let elem = createE({
                template: 'client',
                relative: new Date(),
                id: randomId,
            }, 0);
            appendInfo(elem, {
                message: "Zero elements observed!",
                id: randomId,
            });
        } else {
            console.log("Received:", _.size(data.content),
                        "Objects:", _.countBy(data.content, 'template'));
        }

        const added = _.map(data.content, function(entry, i) {
            if(existingId(entry))
                return { mean: 'duplicated' };

            let render = _.get(templates, entry.template);
            if(!render) {
                console.warn("Invalid template name!", entry);
                return { mean: 'error' };
            }

            let elem = createE(entry, i);
            render(elem, entry);
            return { mean: entry.template };
        });

        if(_.size(added)) {
            let id = "U-" + _.random(0, 0xfffff);
            let countby = _.countBy(added, 'mean');
            let elem = createE({
                template: 'stat',
                relative: 0,
                id,
            }, 0);
            appendStat(elem, {
                countby,
                id,
                lastUpdate,
                start: data.start,
                end: data.end,
                duration: data.duration,
            });
        }

        $("#loader").removeClass('connecting');
        $("#loader").fadeOut(DATAFETCHSECONDS * 1000);
        setTimeout(monitorUpdate, DATAFETCHSECONDS * 1000);
    });
}

function createE(entry, incrementalNumber) {
    const elem = $("#master--" + entry.template).clone();
    elem.attr("id", entry.id);
    $("#fuffa").prepend(elem);

    if(entry.relative)
        $("#" + entry.id + " .relative").text(entry.relative + ' s.');

    let symbol = $("#" + entry.id + " .number").text();
    $("#" + entry.id + " .number").text(symbol + " " + incrementalNumber);

    elem.removeAttr('hidden');
    return elem;
}

function appendInfo(elem, o) {
    // expected: message, subject, id
    $("#" + o.id + " .message").text(o.message);
    $("#" + o.id + " .subject").text(o.subject);
}
function appendHtml(elem, o) {
    // 'id', 'metadataId', savingTime -> 'timevar', 'processed', 'selector', 'href', 'size', 'publicKey'
    let checkbox = o.processed ? "☑" : null;
    if(_.isNull(checkbox))
        checkbox = _.isUndefined(o.processed) ? "☐" : "☒";

    // $("#" + o.id + " .id").text(o.id.substr(0, 6));
    // TODO point to the direct evidence
    $("#" + o.id + " .timevar").text("↓" + o.printable);
    $("#" + o.id + " .selector").text(o.selector + " " + checkbox);
    $("#" + o.id + " .size").text(o.size);

    $("#" + o.id + " .publicKey").html('<a href="/personal/#' + o.publicKey +
        '" target=_blank>' + o.publicKey.substr(0, 4) + '</a>');

    $("#" + o.id + " .href").html('<a href="' + o.href + '" target=_blank>' +
            prettifyHref(o.href) + '</a>');

    elem.addClass(o.metadataId);
    elem.mouseover(() => {
        $("." + o.metadataId).toggleClass('bluizza');
    });
    elem.mouseout(() => {
        $("." + o.metadataId).toggleClass('bluizza');
    });
}
function appendProduct(elem, o) {
    // 'id', 'title', 'videoId', 'watcher', 'authorName', 'authorSource', 'viewInfo', savingTime -> timevar
    $("#" + o.id + " .id").text(o.id.substr(0, 6));
    $("#" + o.id + " .productId").html('<a href="/compare/#' + o.productId +
        '" target=_blank><i>compare</i></a>');
    $("#" + o.id + " .timevar").text(o.printable);
    $("#" + o.id + " .productName").text(o.productName);
    $("#" + o.id + " .sections").text(_.map(o.sections, 'category'));

    /* this mirror htmls.metadataId */
    elem.addClass(o.id);
    elem.mouseover(() => {
        $("." + o.id).toggleClass('bluizza');
    })
    elem.mouseout(() => {
        $("." + o.id).toggleClass('bluizza');
    });
}
function appendSearch(elem, o) {
    // [ 'id', 'title', 'videoId', 'type', 'publicKey', 'producer', 'categories', 'views', 'savingTime', 'sections'],
    const prices = _.compact(_.map(o.results, function(e) {
        return e.first ? _.parseInt(e.first) : null;
    }));
    console.log(prices, _.sum(prices), _.size(prices));
    const avg = _.round(_.sum(prices) / _.size(prices), 1);
    const disavg = ( _.size(o.results) && o.results[0].unit ) ?
        avg + " " + o.results[0].unit : 
        avg + '??';

    $("#" + o.id + " .sections").text(_.map(o.sections, 'display').join(','));
    $("#" + o.id + " .query").text(o.query);
    $("#" + o.id + " .average").text(disavg);
    $("#" + o.id + " .results").text(
        _.size(o.results) + " (" + _.size(prices) + ")"
    );
    $("#" + o.id + " .publicKey").html('<a href="/personal/#' + o.publicKey +
        '" target=_blank>' + o.publicKey.substr(0, 4) + '</a>'
    );
    $("#" + o.id + " .timevar").text(o.printable);
}
function appendSupporter(elem, o) {
    // 'publicKey', 'p', 'creationTime' -> timevar, 'version'
    $("#" + o.id + " .p").text(o.p);
    $("#" + o.id + " .publicKey").html('<a href="/personal/#' + o.publicKey +
        '" target=_blank>' + o.publicKey.substr(0, 4) + '</a>'
    );
    $("#" + o.id + " .timevar").text(o.printable);
    $("#" + o.id + " .version").text(o.version);
}
// the two below are not in 'templates' because invoked by this script ONLY
function appendClientInfo(elem, o) {
    // message, subject, id
    $("#" + o.id + " .message").text(o.message);
    $("#" + o.id + " .subject").text(o.subject);
}
function appendStat(elem, o) {
    // countby - object, lastUpdate, lastExecution, subject, id
    $("#" + o.id + " .countby").text(
        JSON.stringify(o.countby).replace(/[}{\"]/g, '')
    );
    $("#" + o.id + " .lastUpdate").text("c:" + o.lastUpdate.toISOString().substr(11,8) );
    $("#" + o.id + " .start").text("s:" + o.start);
    $("#" + o.id + " .end").text("e:" + o.end);
    $("#" + o.id + " .duration").text(o.duration);
}

/* the template names are defined in backend/routes/monitor.js,
   each of them point to a rendering function */
const templates = {
    'info': appendInfo,
    'htmls': appendHtml,
    'product': appendProduct,
    'search': appendSearch,
    'supporters': appendSupporter,
};
