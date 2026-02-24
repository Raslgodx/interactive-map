document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('mapContainer');
    const overlay = document.getElementById('overlay');
    const tooltip = document.getElementById('tooltip');
    const zones = document.querySelectorAll('.zone');

    let isActive = false;

    // Активация при наведении на любую зону
    zones.forEach(zone => {
        zone.addEventListener('mouseenter', (e) => {
            activateHighlight();
            positionTooltip(e);
        });

        zone.addEventListener('mousemove', (e) => {
            positionTooltip(e);
        });

        zone.addEventListener('mouseleave', (e) => {
            // Проверяем, не перешли ли мы на другую зону
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && relatedTarget.classList && relatedTarget.classList.contains('zone')) {
                return; // Перешли на другую зону — не деактивируем
            }
            deactivateHighlight();
        });
    });

    // Для тач-устройств
    zones.forEach(zone => {
        zone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (isActive) {
                deactivateHighlight();
            } else {
                activateHighlight();
                const touch = e.touches[0];
                positionTooltip(touch);
            }
        });
    });

    // Тап вне зон — закрыть
    container.addEventListener('touchstart', (e) => {
        if (!e.target.classList.contains('zone') && isActive) {
            deactivateHighlight();
        }
    });

    function activateHighlight() {
        isActive = true;
        overlay.classList.add('active');
        tooltip.classList.add('visible');
        zones.forEach(z => z.classList.add('highlighted'));
    }

    function deactivateHighlight() {
        isActive = false;
        overlay.classList.remove('active');
        tooltip.classList.remove('visible');
        zones.forEach(z => z.classList.remove('highlighted'));
    }

    function positionTooltip(e) {
        const containerRect = container.getBoundingClientRect();

        let x, y;
        if (e.clientX !== undefined) {
            x = e.clientX - containerRect.left;
            y = e.clientY - containerRect.top;
        } else {
            x = e.pageX - containerRect.left - window.scrollX;
            y = e.pageY - containerRect.top - window.scrollY;
        }

        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        // Смещение от курсора
        let posX = x + 15;
        let posY = y + 15;

        // Не выходить за правый край
        if (posX + tooltipWidth > containerRect.width) {
            posX = x - tooltipWidth - 15;
        }

        // Не выходить за нижний край
        if (posY + tooltipHeight > containerRect.height) {
            posY = y - tooltipHeight - 15;
        }

        // Не выходить за левый/верхний край
        posX = Math.max(5, posX);
        posY = Math.max(5, posY);

        tooltip.style.left = posX + 'px';
        tooltip.style.top = posY + 'px';
    }
});
