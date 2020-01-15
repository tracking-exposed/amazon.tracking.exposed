
async function activate() {
    console.log("activation begin: fetching all the HREFs");
    const step1 = _.first(window.location.href.split("/#"))
    const testName = _.last(step1.split('/'));
    const activadat = _.map($(".experiment"), function(node) {
        return {
            id: node.getAttribute('id'),
            href: node.getAttribute('link'),
            test: testName
        };
    })
    console.log(activadat);

    const options = {
        method: 'POST',
        body: JSON.stringify(activadat),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const r = await fetch(buildApiUrl('experiments', 'register', 2), options)
        .then(res => res.json())
        .then(res => console.log(res));

    console.log("Activation: ", r);
}

function loadActivation() {
    console.log("Load activation sections");
    $("#actions").text("Experiment activation");
    $("#actions + p").text("This is the sequence you'll make repeat to all the test participants:");
    $(".experiment").addClass('experiment-muted');
    $("#activator--form").removeAttr('hidden');
    $("#activation-button").click(activate);
}



function loadAccess() {
    console.log("Loading: access sections");
    $("#actions").text("Action: You want to participate in the experiment");
    $("#actions + p").text("- actions TODO -");
}

function dynamicTestPage() {
    const chunks = window.location.href.split("/#");
    console.log(chunks);
    if(_.size(chunks) == 2 && _.last(chunks) == 'activate') {
        loadActivation();
    }
    else if(_.size(chunks) == 2 && _.last(chunks) == 'access') {
        loadAccess();
    } else {
        $("#actions").hide();
        $("#experiments").hide();

        $("#conclusion").hide();
        $("#conclusion + p").hide();
    }
};