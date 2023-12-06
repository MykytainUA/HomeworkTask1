//?&hours=7&minutes=27&seconds=24&autoStart=1&autoRepeat=1

// Global variables
var secondsLeft = 0;                     // Interval in seconds
var timeArr = [0,0,0];                   // Array of raw interval (seconds, minutes, hours)
var isStopButtonPressed = false;      // Continue button (the same as start button)
var isRepeatButtonPressed = false;       // Repeat option (default:false)
var isShowNotification = false;          // Show notification (default:false)
var notificationStatus = "undefined";
var notification;
//

AskForNotificationPermission();

// Set input variables on page to default:0
document.getElementById("secondsInput").value = 5;
document.getElementById("minutesInput").value = 0;
document.getElementById("hoursInput").value = 0;
//

// event functions
setIntervalButton.onclick = GetInterval; // Reads input from the page and then saves it to the array of raw interval
stopButton.onclick = StopButtonPressed; 
repeatButton.onclick = RepeatButtonPressed;                                    // continue button listener

GetParametersFromURL();

SetButtonsColors();

setInterval(DecrementTime,1000);         // Calls every second
//

function GetInterval(){ // Get raw input from the page input (Calls only when button start is pressed)
    timeArr[0] = document.getElementById("secondsInput").value;
    timeArr[1] = document.getElementById("minutesInput").value;
    timeArr[2] = document.getElementById("hoursInput").value;

    ConvertIntervalIntoSeconds(); // Subfunction, turns data from the array of raw interval into seconds
}

function ConvertIntervalIntoSeconds(){ // Convert raw data from the array into seconds
    secondsLeft = timeArr[0] * 1;
    secondsLeft += timeArr[1] * 60;
    secondsLeft += timeArr[2] * 3600;
    isShowNotification = true;
}

function DecrementTime(){ // Calls every second

    if(secondsLeft == 0 && isShowNotification){
        ShowNotification();
        isShowNotification = false;
    }

    if(isRepeatButtonPressed && secondsLeft == 0){
        ConvertIntervalIntoSeconds();
    } 

    if(!isStopButtonPressed){
        if(secondsLeft > 0){
            secondsLeft--;
            PrintTimer();
        } else if (secondsLeft < 0) {
            console.log("Error: secondsLeft < 0");
        }
    }

    if(secondsLeft < 60){
        document.getElementById('timeOutput').style.color = 'rgb(209, 9, 9)';
    } else {
        document.getElementById('timeOutput').style.color = 'rgb(9, 180, 9)';
    }

    return 0;
}

function PrintTimer(){ // Outputs data from secondsLeft on page
    
    var seconds = secondsLeft % 60;
    var minutes = Math.floor((secondsLeft - (Math.floor(secondsLeft/3600) * 3600))/60);
    var hours = Math.floor(secondsLeft/3600);

    if(seconds > 9){
        document.getElementById("secondsOutput").innerHTML = seconds + " секунд ";
    } else {
        document.getElementById("secondsOutput").innerHTML = '0' + seconds + " секунд ";
    }

    if(minutes > 9){
        document.getElementById("minutesOutput").innerHTML = minutes + " хвилин ";
    } else {
        document.getElementById("minutesOutput").innerHTML = '0' + minutes + " хвилин ";
    }

    if(hours > 9){
        document.getElementById("hoursOutput").innerHTML = hours + " годин ";
    } else {
        document.getElementById("hoursOutput").innerHTML = '0' + hours + " годин ";
    }

}

function AskForNotificationPermission(){
    if ('Notification' in window) {
        notificationStatus = Notification.requestPermission().then(function(permission){
            notificationStatus = permission;
        });
    }
}

function ShowNotification(){
    notification = new Notification('Привет!', {
        body: 'Это пример уведомления.',
        icon: 'Red_clock.png' // Путь к изображению для иконки уведомления
    });
    notification.onshow = function() { setTimeout(notification.close, 15000) };
}

function StopButtonPressed(){
    isStopButtonPressed = !isStopButtonPressed;
    SetButtonsColors();
}

function RepeatButtonPressed(){
    isRepeatButtonPressed = !isRepeatButtonPressed;
    SetButtonsColors();
}

function GetParametersFromURL(){
    var currentUrl = window.location.href;
    var searchParams = new URLSearchParams(currentUrl);

    if(searchParams.get('hours') != null){
        document.getElementById("hoursInput").value = searchParams.get('hours');
    }

    if(searchParams.get('minutes') != null){
        document.getElementById("minutesInput").value = searchParams.get('minutes');
    }

    if(searchParams.get('seconds') != null){
        document.getElementById("secondsInput").value = searchParams.get('seconds');
    }

    if(searchParams.get('autoStart') != null && searchParams.get('autoStart') != '0'){
        document.getElementById('setIntervalButton').click();
    }

    if(searchParams.get('autoRepeat') != null && searchParams.get('autoRepeat') != '0'){
        isRepeatButtonPressed = Boolean(searchParams.get('autoRepeat'));
    }

}

function SetButtonsColors(){
    document.getElementById('setIntervalButton').style.backgroundColor = '#3498db';
    if(!isStopButtonPressed){
        document.getElementById('stopButton').style.backgroundColor = 'rgb(209, 9, 9)';
    } else {
        document.getElementById('stopButton').style.backgroundColor = 'rgb(9, 209, 9)';
    }

    if(isRepeatButtonPressed){
        document.getElementById('repeatButton').style.backgroundColor = 'rgb(209, 9, 9)';
    } else {
        document.getElementById('repeatButton').style.backgroundColor = 'rgb(9, 209, 9)';
    }
}