var Keys = (function() {
    var adornRows = function() {
        // Add event handlers to all checkboxes
        $("#key-table-body tr td :checkbox").click(function() {
            if ($(this).prop("checked")) {
                $("#delete-selected-button").prop('disabled', false);
                $("#export-selected-button").prop('disabled', false);
            } else {
                if ($("#key-table-body tr td :checkbox:checked")
                    .length == 0) {
                    $("#delete-selected-button")
                        .prop('disabled', true);
                    $("#export-selected-button")
                        .prop('disabled', true);
                }
            }
        });
    };

    var createRow = function(key) {
        var row =
            ml("tr", {},
               [ml("td", {},
                   ml("input", {class: "uk-checkbox", type: "checkbox"})),
                ml("td", {}, key.nym),
                ml("td", {class: "uk-table-link"},
                   ml("a", {href: "#show-key",
                            "uk-toggle": "",
                            class: "uk-link-reset",
                            "data-nym": key.nym,
                            "data-public-key": key["public-key"],
                            onclick: function(event) {
                                Keys.showKey(event);
	                    }},
                      Keys.truncate(
                          key["public-key"], 16, "..."))),,
                ml("td", {},
                   ml("span", {
                       class: "clickable uk-align-right",
                       "uk-icon": "trash",
                       onclick: function(event) {
                           Keys.deleteKey(event, key.nym);
	               }}))]);
        return row;
    };
    
    return {
        deleteKey: function(event, nym) {
            Mixmesh.post(
                "/dj/key/delete",
                [nym],
                function(data, textStatus, _jqXHR) {
                    console.log("/dj/key/delete (POST) succeeded");
                    console.log(nym + " has been deleted");
                    $(event.target).closest("tr").remove();
                },
                function(_jqXHR, textStatus, errorThrown) {
                    console.log("/dj/key/delete (POST) failed");
                    console.log("textStatus: " + textStatus);
                    console.log("errorThrown: " + errorThrown);
                });
        },
        showKey: function(event) {
            $("#qrcode").empty();
            $("#qrcode-title").text($(event.target).attr("data-nym"));
            new QRCode($("#qrcode").get(0), {
	        text: $(event.target).attr("data-public-key"),
	        width: 600,
	        height: 600,
	        colorDark : "#000000",
	        colorLight : "#ffffff",
	        correctLevel : QRCode.CorrectLevel.H
            });
        },
        refreshRows: function() {
            Mixmesh.get(
                "/dj/key",
                function(data, status) {
                    if (status == "success") {
                        $("#delete-selected-button").prop('disabled', true);
                        $("#export-selected-button").prop('disabled', true);
                        $.each(data, function(_index, key) {
                            var row = createRow(key);
                            render($("#key-table-body")[0], row);
                        });
                        adornRows();
                    } else {
                        console.log("/dj/key (GET) failed");
                        console.log(data);
                    }
                });
        },
        filterRows: function(subStringNym) {
            Mixmesh.post(
                "/dj/key/filter",
                [subStringNym],
                function(data, textStatus, _jqXHR) {
                    console.log("/dj/key/filter (POST) succeeded");
                    console.log(data + " keys was found");
                    $("#delete-selected-button").prop('disabled', true);
                    $("#export-selected-button").prop('disabled', true);
                    $("#key-table-body").empty();
                    $.each(data, function(_index, key) {
                        var row = createRow(key);
                        render($("#key-table-body")[0], row);
                    });
                    adornRows();
                },
                function(_jqXHR, textStatus, errorThrown) {
                    console.log("/dj/key/filter (POST) failed");
                    console.log("textStatus: " + textStatus);
                    console.log("errorThrown: " + errorThrown);
                });
        },
        truncate: function(fullStr, strLen, separator) {
            if (fullStr.length <= strLen) {
                return fullStr;
            }
            separator = separator || '...';
            var sepLen = separator.length;
            var charsToShow = strLen - sepLen;
            var frontChars = Math.ceil(charsToShow/2);
            var backChars = Math.floor(charsToShow/2);
            return fullStr.substr(0, frontChars) +
                separator + fullStr.substr(fullStr.length - backChars);
        }
    };
})();

$(document).ready(function() {
    Mixmesh.setHeight("#key-table",
                      ["#navigation", "#search", "#key-table-buttons"]);

    // Select-all checkbox
    $("#select-all").click(function() {
        var checkedStatus = this.checked;
        $("#delete-selected-button").prop('disabled', !checkedStatus);
        $("#export-selected-button").prop('disabled', !checkedStatus);
        $("#key-table-body tr").find("td:first :checkbox").each(function() {
            $(this).prop("checked", checkedStatus);
        });
    });

    // Add handler to delete button
    $("#delete-selected-button").click(function() {
        var selectedRows = [];
        var selectedNyms = [];
        $("#key-table-body tr").each(function() {
            if ($(this).find("td input:checked").length == 1) {
                selectedRows.push(this);
                selectedNyms.push($(this).find("td a").data("nym"));
            }
        });
        $("#delete-selected-button").prop('disabled', true);
        $("#export-selected-button").prop('disabled', true);
        Mixmesh.post(
            "/dj/key/delete",
            selectedNyms,
            function(data, textStatus, _jqXHR) {
                console.log("/dj/key/delete (POST) succeeded");
                console.log(selectedNyms + " has been deleted");
                for (i = 0; i < selectedRows.length; i++) {
                    $(selectedRows[i]).remove();
                }
            },
            function(_jqXHR, textStatus, errorThrown) {
                console.log("/dj/key/delete (POST) failed");
                console.log("textStatus: " + textStatus);
                console.log("errorThrown: " + errorThrown);
                $("#delete-selected-button").prop('disabled', false);
                $("#export-selected-button").prop('disabled', false);
            });
    });

    // Add handler to filter input
    $("#filter").keyup(function() {
        if ($(this).val().length == 0) {
            Keys.refreshRows();
        } else {
            Keys.filterRows($(this).val());
        }
    });

    Keys.refreshRows();
});