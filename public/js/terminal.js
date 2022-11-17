$(function() {
    $('#terminal-input').keypress(function(e){
        if(e.which == 13) {
            var text = $(this).val();
            handleInput(text);
            $(this).val('');
        }
    });
});
function newLine(text=null) {
    if(text) {
        line = document.createElement('span');
        $(line).addClass('terminal-line').html(text);
        $('#display').append(line);
    }
}
function handleInput(input) {
    input = input.replace(/(<([^>]+)>)/gi, "");
    newLine("> "+input);
    if(/[a-zA-Z]/.test(input) == false) {
        newLine();
        return;
    }
    var command = input.split(' ')[0];
    var args = input.split(' ').slice(1);
    try {
        window[command](args);
    } catch(e) {
        if(e instanceof TypeError) {
            newLine("Command not found");
        } else {
            newLine(e);
        }
    }
}
function help() {
    commands = {
        'clear': 'Clears the terminal',
        'echo': 'Prints the arguments [Usage: echo {text}]',
        'ls': 'Lists the files in the current directory',
        'cat': 'Prints the contents of a file [Usage: {file} ]',
        'help': 'Prints this help message'
    }
    for(command in commands) {
        newLine(command + ' - ' + commands[command]);
    }
}
function clear() {
    $('.terminal-line').each(function() {
        $(this).remove();
    });
}
function echo(args) {
    if(!args) {
        newLine('echo: missing argument(s)');
    } else {
        newLine(args.join(' '));
    }
}
function ls() {
    // Do stuff with ls
}
function cat() {
    // Do stuff with cat
}
