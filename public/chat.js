$(function () {  
    var socket = io.connect();
    
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat'); 

    $messageForm.submit(function (e) { 
        e.preventDefault();
        socket.emit('send message', $message.val());
        $message.val('');
    });
});