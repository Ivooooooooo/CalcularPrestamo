function Prestamo(capital, tasaAnual, plazo) {
    this.capital = capital;
    this.tasaAnual = tasaAnual;
    this.plazo = plazo;
    this.cuota = 0;
    this.totalAPagar = 0;
    this.amortizacion = [];

    this.calcularCuota = function () {
        const tasaMensual = this.tasaAnual / 12 / 100;
        this.cuota =
            (this.capital * tasaMensual) /
            (1 - Math.pow(1 + tasaMensual, -this.plazo));
    };

    this.calcularTotalAPagar = function () {
        this.totalAPagar = this.cuota * this.plazo;
    };

    this.generarAmortizacion = function () {
        this.amortizacion = [];
        let capitalRestante = this.capital;
        const tasaMensual = this.tasaAnual / 12 / 100;
        for (let mes = 1; mes <= this.plazo; mes++) {
            const intereses = capitalRestante * tasaMensual;
            const amortizacion = this.cuota - intereses;
            capitalRestante -= amortizacion;
            this.amortizacion.push({
                mes,
                capitalRestante,
                intereses,
                amortizacion,
                cuota: this.cuota,
            });
        }
    };
}

const capitalInput = document.getElementById("capital");
const tasaInput = document.getElementById("tasa");
const plazoInput = document.getElementById("plazo");
const calcularButton = document.getElementById("calcularButton");
const notification = document.getElementById("notification");

capitalInput.addEventListener("input", validarCampos);
tasaInput.addEventListener("input", validarCampos);
plazoInput.addEventListener("input", validarCampos);
calcularButton.addEventListener("mouseenter", mostrarNotificacion);

let prestamo = null;

function validarCampos() {
    const capital = parseFloat(capitalInput.value);
    const tasa = parseFloat(tasaInput.value);
    const plazo = parseInt(plazoInput.value);

    if (isNaN(capital) || isNaN(tasa) || isNaN(plazo) || capital < 25000) {
        calcularButton.disabled = true;
        notification.style.display = "block";
    } else {
        calcularButton.disabled = false;
        notification.style.display = "none";
    }
}

function mostrarNotificacion() {
    const capital = parseFloat(capitalInput.value);
    if (isNaN(capital) || capital < 25000) {
        notification.style.display = "block";
    }
}

function calcularAmortizacion() {
    const capital = parseFloat(capitalInput.value);
    const tasaAnual = parseFloat(tasaInput.value);
    const plazo = parseInt(plazoInput.value);

    prestamo = new Prestamo(capital, tasaAnual, plazo);
    prestamo.calcularCuota();
    prestamo.calcularTotalAPagar();
    prestamo.generarAmortizacion();

    document.getElementById("montoPrestamo").textContent = `$${prestamo.capital.toFixed(2)}`;
    document.getElementById("tasaInteres").textContent = `${prestamo.tasaAnual.toFixed(2)}%`;
    document.getElementById("meses").textContent = prestamo.plazo;
    document.getElementById("cuota").textContent = `$${prestamo.cuota.toFixed(2)}`;
    document.getElementById("total").textContent = `$${prestamo.totalAPagar.toFixed(2)}`;

    const tablaAmortizacion = document.getElementById("amortizacionTable");
    tablaAmortizacion.innerHTML = "<table><tr><th>Mes</th><th>Capital Restante</th><th>Intereses</th><th>Amortización de Capital</th><th>Cuota</th></tr>";

    prestamo.amortizacion.forEach((item) => {
        tablaAmortizacion.innerHTML += `<tr><td>${item.mes}</td><td>$${item.capitalRestante.toFixed(2)}</td><td>$${item.intereses.toFixed(2)}</td><td>$${item.amortizacion.toFixed(2)}</td><td>$${item.cuota.toFixed(2)}</td></tr>`;
    });

    tablaAmortizacion.innerHTML += "</table>";
}