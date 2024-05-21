document.addEventListener('DOMContentLoaded', function() {
    const timerInput = document.getElementById('timer');
    const startButton = document.getElementById('start');
    
    let countdownInterval;
    
    function startCountdown() {
        let time = timerInput.value.split(':');
        let hours = parseInt(time[0], 10);
        let minutes = parseInt(time[1], 10);
        let seconds = parseInt(time[2], 10);
        
        let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        countdownInterval = setInterval(function() {
            totalSeconds--;
            if (totalSeconds < 0) {
                clearInterval(countdownInterval);
                alert('Time is up!');
                return;
            }

            let h = Math.floor(totalSeconds / 3600);
            let m = Math.floor((totalSeconds % 3600) / 60);
            let s = totalSeconds % 60;

            timerInput.value = 
                (h > 9 ? h : "0" + h) + ":" + 
                (m > 9 ? m : "0" + m) + ":" + 
                (s > 9 ? s : "0" + s);
        }, 1000);
    }

    startButton.addEventListener('click', function() {
        clearInterval(countdownInterval); // Clear any existing interval
        startCountdown();
    });
});
