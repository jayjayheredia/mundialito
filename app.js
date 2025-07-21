function seleccionarResultado(checkbox) {
    const partido = checkbox.closest('.partido');
    const fase = checkbox.closest('.fase');
    const resultadoTotal = fase.querySelector('.resultado-total');
    const estado = fase.querySelector('.estado');

    const g = partido.querySelector('.g');
    const e = partido.querySelector('.e');
    const p = partido.querySelector('.p');

    if (checkbox.checked) {
        g.disabled = checkbox !== g;
        e.disabled = checkbox !== e;
        p.disabled = checkbox !== p;
    } else {
        g.disabled = false;
        e.disabled = false;
        p.disabled = false;
    }

    // Calcular puntos
    let totalPuntos = 0;
    const partidos = fase.querySelectorAll('.partido');

    // 🚨 Verificamos que los 3 partidos tengan una selección
    let partidosCompletos = true;

    partidos.forEach(p => {
        const ganado = p.querySelector('.g').checked;
        const empatado = p.querySelector('.e').checked;
        const perdido = p.querySelector('.p').checked;

        if (!ganado && !empatado && !perdido) {
            partidosCompletos = false;
        }

        if (ganado) totalPuntos += 3;
        else if (empatado) totalPuntos += 1;
    });

    resultadoTotal.textContent = `Puntaje Total: ${totalPuntos}`;

    // Solo evaluar puntos si están completos los partidos
    if (!partidosCompletos) {
        estado.textContent = "Completá los 3 partidos";
        estado.style.color = "blue";
        bloquearFases();
        return;
    }

    if (totalPuntos >= 5) {
        estado.textContent = "¡Clasificado!";
        estado.style.color = "green";
        document.querySelectorAll('.fase-octavos input').forEach(input => input.disabled = false);
    } else if (totalPuntos === 4) {
        if (repechaje()) {
            estado.textContent = "¡Clasificado por repechaje!";
            estado.style.color = "orange";
            document.querySelectorAll('.fase-octavos input').forEach(input => input.disabled = false);
        } else {
            estado.textContent = "Eliminado en repechaje";
            estado.style.color = "red";
            bloquearFases();
            alert("Volvés a fase de grupos.");
            reiniciarTodo();
        }
    } else {
        estado.textContent = "Eliminado";
        estado.style.color = "red";
        bloquearFases();
    }
}

function eliminatoria(checkbox, siguienteFase = null) {
    const fase = checkbox.closest('div');
    const g = fase.querySelector('.g');
    const e = fase.querySelector('.e');
    const p = fase.querySelector('.p');

    if (checkbox.checked) {
        g.disabled = checkbox !== g;
        e.disabled = checkbox !== e;
        p.disabled = checkbox !== p;

        if (checkbox.classList.contains('p')) {
            alert("Perdiste, vuelves a fase de grupos.");
            reiniciarTodo();
            return;
        }

        if (checkbox.classList.contains('e')) {
            if (!repechaje()) {
                reiniciarTodo();
                return;
            }
        }

        if (siguienteFase) {
            document.querySelectorAll(`.fase-${siguienteFase} input`).forEach(input => input.disabled = false);
        }
    } else {
        g.disabled = false;
        e.disabled = false;
        p.disabled = false;
    }
}

function repechaje() {
    const numero = Math.floor(Math.random() * 10) + 1;
    let intentos = 3;

    while (intentos > 0) {
        const intento = parseInt(prompt(`Adiviná un número del 1 al 10. Te quedan ${intentos} intentos:`));

        if (isNaN(intento) || intento < 1 || intento > 10) {
            alert("Número inválido. Ingresá un número entre 1 y 10.");
            continue;
        }

        if (intento === numero) {
            alert(`¡Adivinaste! El número era ${numero}. Clasificás.`);
            return true;
        } else if (intento < numero) {
            alert("El número es más grande.");
        } else {
            alert("El número es más chico.");
        }

        intentos--;
    }

    alert(`No adivinaste. El número era ${numero}. Quedaste eliminado.`);
    return false;
}

function reiniciarTodo() {
    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.checked = false;
        input.disabled = false;
    });
    document.querySelector('.resultado-total').textContent = "Puntaje Total: 0";
    document.querySelector('.estado').textContent = "";
    document.querySelector('.resultado-final').textContent = "";
    bloquearFases();
}

function bloquearFases() {
    document.querySelectorAll('.fase-octavos input, .fase-cuartos input, .fase-semifinal input, .fase-final input')
        .forEach(input => input.disabled = true);
}

function ganasteFinal(checkbox) {
    if (checkbox.checked) {
        alert("¡Final jugada!");
        document.querySelectorAll('.fase-final input').forEach(input => input.disabled = checkbox !== input);

        if (checkbox.classList.contains('g')) {
            document.querySelector('.resultado-final').textContent = "¡Ganaste el torneo!";
        } else {
            document.querySelector('.resultado-final').textContent = "No lograste ganar la final.";
        }
    } else {
        document.querySelectorAll('.fase-final input').forEach(input => input.disabled = false);
        document.querySelector('.resultado-final').textContent = "";
    }
}

// Inicializamos bloqueando las fases posteriores
bloquearFases();