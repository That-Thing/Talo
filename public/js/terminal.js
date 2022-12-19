var files = {
    "about.txt": "/static/about.txt"
}
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
        'echo': 'Prints the arguments [Usage: echo &lt;text&gt;]',
        'ls': 'Lists the files in the current directory',
        'cat': 'Prints the contents of a file [Usage: cat &lt;file&gt; ]',
        'help': 'Prints this help message',
        'register': 'Register a new account',
        'login': 'Login to your account',
        'motd': 'Prints the message of the day'
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
    for(file in files) {
        newLine(file);
    }
}
function cat(args) {
    if(!args) {
        newLine('cat: missing argument(s)');
    } else {
        var file = args[0];
        if(files[file]) {
            $.get(files[file], function(data) {
                let lines = data.split("\n");
                for(let i = 0; i < lines.length; i++) {
                    newLine(lines[i]);
                }
            });
        } else {
            newLine('cat: ' + file + ': No such file or directory');
        }
    }
}
function register() {
    window.location.href = "/auth/register";
}
function login() {
    window.location.href = "/auth/login";
}
function motd() {
    $.get('/cmd/motd', function(data) {
        newLine(data);
    });
}