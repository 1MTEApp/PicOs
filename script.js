class WindowManager {
    static openApp(appId) {
        const window = document.getElementById(`${appId}-window`);
        window.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    static initCloseHandlers() {
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const window = e.target.closest('.app-window');
                window.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

class ClockSystem {
    constructor() {
        this.updateClocks();
        setInterval(() => this.updateClocks(), 1000);
    }

    updateClocks() {
        const now = new Date();
        
        // Обновление цифровых часов
        document.querySelectorAll('.digital-clock').forEach(clock => {
            clock.textContent = now.toLocaleTimeString();
        });

        // Обновление аналоговых часов
        document.querySelectorAll('.analog-clock').forEach(clock => {
            const hours = now.getHours() % 12;
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            clock.querySelector('.hour-hand').style.transform = 
                `rotate(${(hours * 30) + (minutes * 0.5)}deg)`;
            clock.querySelector('.minute-hand').style.transform = 
                `rotate(${(minutes * 6) + (seconds * 0.1)}deg)`;
            clock.querySelector('.second-hand').style.transform = 
                `rotate(${seconds * 6}deg)`;
        });
    }
}

class AlarmSystem {
    static alarms = JSON.parse(localStorage.getItem('alarms')) || [];

    static init() {
        setInterval(() => this.checkAlarms(), 1000);
    }

    static setAlarm() {
        const timeInput = document.getElementById('alarm-time');
        if (!timeInput.value) return;

        this.alarms.push({
            time: timeInput.value,
            active: true
        });
        localStorage.setItem('alarms', JSON.stringify(this.alarms));
        this.updateAlarmsList();
    }

    static checkAlarms() {
        const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        this.alarms.forEach(alarm => {
            if (alarm.active && alarm.time === now) {
                new Audio('notification.mp3').play();
                alert('Будильник! Время: ' + alarm.time);
            }
        });
    }
}

// Полная реализация других систем (TimerSystem, StopwatchSystem)

document.addEventListener('DOMContentLoaded', () => {
    WindowManager.initCloseHandlers();
    new ClockSystem();
    AlarmSystem.init();
    
    // Инициализация виджетов
    const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
    savedWidgets.forEach(widget => createWidget(widget));
});