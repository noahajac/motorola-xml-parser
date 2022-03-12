function parse() {
    var mainTextbox = document.getElementById("input");
    var commandPrefix = document.getElementById("prefix");
    var md5Table = document.getElementById("md5");
    var reboot = document.getElementById("reboot");
    var relock = document.getElementById("relock");
    var parser = new DOMParser();
    var xml = parser.parseFromString(mainTextbox.value, "text/xml");
    var steps = xml.getElementsByTagName("step");
    var results = [];
    var md5file = [];
    var md5 = [];

    for (var current = 0; current < steps.length; current++) {
        var parsedCommand;
        var command = steps[current];
        var operation = command.getAttribute("operation");

        switch (operation) {
            case "oem":
                parsedCommand = commandPrefix.value + " oem " +
                    command.getAttribute("var");
                results.push(parsedCommand);
                break;
            case "flash":
                parsedCommand = commandPrefix.value + " flash " +
                    command.getAttribute("partition") + " " +
                    command.getAttribute("filename");
                md5file.push(command.getAttribute("filename"));
                md5.push(command.getAttribute("MD5"));
                results.push(parsedCommand);
                break;
            case "erase":
                parsedCommand = commandPrefix.value + " erase " +
                    command.getAttribute("partition");
                results.push(parsedCommand);
                break;
            default:
                parsedCommand = null;
        }
    }

    mainTextbox.value = "";

    // Add Beginning Relock Commands
    if (relock.checked) {
        mainTextbox.value += commandPrefix.value + " oem lock begin\n"
        mainTextbox.value += commandPrefix.value + " oem lock begin\n"
    }

    // Fill Commands
    for (var current = 0; current < results.length; current++) {
        mainTextbox.value += results[current] + "\n";
    }

    // Add Ending Relock Command
    if (relock.checked) {
        mainTextbox.value += commandPrefix.value + " oem lock\n"
    }

    // Add Reboot Command
    if (reboot.checked) {
        mainTextbox.value += commandPrefix.value + " reboot\n";
    }

    // Clear MD5 Table
    for (var current = md5Table.rows.length - 1; current > 0; current--) {
        md5Table.deleteRow(current);
    }

    // Fill MD5 Table
    for (var current = 0; current < md5.length; current++) {
        var row = md5Table.insertRow(-1);
        var fileName = row.insertCell(0);
        var fileMD5 = row.insertCell(1);
        fileName.innerHTML = md5file[current];
        fileMD5.innerHTML = md5[current];
    }
}
