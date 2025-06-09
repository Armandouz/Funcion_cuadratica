// Se optiene el canvas y el contexto 2d pa dibujar la grafica
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
let scale = 30; // Escala pa la grafica, si la cambias se ve mas grande o mas chikito

// Esta funcion calcula y dibuja la parabola segun los coefisientes que mete el usuario
function calculateAndGraph() {
    // Se optienen los valores de los coefisientes desde los inputs del html
    const a = parseFloat(document.getElementById('a').value) || 0;
    const b = parseFloat(document.getElementById('b').value) || 0;
    const c = parseFloat(document.getElementById('c').value) || 0;

    // Se calcula el discriminante y el vertice de la parabola
    const discriminant = b * b - 4 * a * c;
    const vertexX = a !== 0 ? -b / (2 * a) : 0;
    const vertexY = a !== 0 ? c - (b * b) / (4 * a) : c;
    const roots = calculateRoots(a, b, discriminant); // Se calculan las raices
    const direction = a > 0 ? "Hacia arriba ∪" : "Hacia abajo ∩"; // Direccion de la parabola

    // Se actualizan los resultados en el html pa que el usuario los vea
    document.getElementById('equation').innerHTML = 
        `<strong>Función:</strong> f(x) = ${formatTerm(a, 'x²')} ${formatTerm(b, 'x', true)} ${formatConstant(c)}`;

    document.getElementById('vertex').innerHTML = 
        `<strong>Vértice:</strong> (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`;

    document.getElementById('axis').innerHTML = 
        `<strong>Eje de simetría:</strong> x = ${vertexX.toFixed(2)}`;

    document.getElementById('discriminant').innerHTML = 
        `<strong>Discriminante:</strong> Δ = ${discriminant.toFixed(2)}`;

    document.getElementById('roots').innerHTML = 
        `<strong>Raíces:</strong> ${roots.text}`;

    document.getElementById('direction').innerHTML = 
        `<strong>Dirección:</strong> ${direction}`;

    // Se muestran los procedimientos paso a paso pa que el usuario aprenda
    showVertexProcedure(a, b, c, vertexX, vertexY);
    showRootsProcedure(a, b, c, discriminant, roots);

    // Se dibuja la grafica de la funcion cuadratica
    drawQuadraticFunction(a, b, c, vertexX, vertexY);
}

// Esta funcion calcula las raices de la ecuacion cuadratica
function calculateRoots(a, b, discriminant) {
    if (a === 0) return { text: "No es función cuadrática", type: "linear" };
    
    // Si el discriminante es menor que cero, las raices son complejas (imajinarias)
    if (discriminant < 0) {
        const realPart = -b / (2 * a);
        const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);
        
        const imagPartFormatted = imaginaryPart.toFixed(2);
        const imagDisplay = imagPartFormatted === "1.00" ? "" : 
                         imagPartFormatted === "-1.00" ? "-" : imagPartFormatted;
        
        return {
            text: `Raíces complejas: ${realPart.toFixed(2)} ${imaginaryPart > 0 ? '+' : '-'} ${imagDisplay}i`.replace(" 1.00i", " i").replace(" -1.00i", " -i"),
            type: "complex",
            realPart: realPart,
            imaginaryPart: imaginaryPart
        };
    }
    
    // Si el discriminante es cero o positivo, las raices son reales
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const x1 = (-b + sqrtDiscriminant) / (2 * a);
    const x2 = (-b - sqrtDiscriminant) / (2 * a);
    
    return discriminant === 0 ? 
        { text: `Raíz única: x = ${x1.toFixed(2)}`, type: "single" } : 
        { text: `x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`, type: "double" };
}

// Da formato a los terminos de la funcion pa que se vea bonito
function formatTerm(coeff, term, includeSign = false) {
    if (coeff === 0) return '';
    const sign = includeSign ? (coeff >= 0 ? '+' : '-') : '';
    const absCoeff = Math.abs(coeff);
    return `${sign} ${absCoeff !== 1 || term === '' ? absCoeff : ''}${term}`;
}

// Da formato al termino constante
function formatConstant(c) {
    if (c === 0) return '';
    return `${c >= 0 ? '+ ' : '- '}${Math.abs(c)}`;
}

// Da formato a la raiz cuadrada, si es negativa pone la i de imajinario
function formatSqrt(value) {
    if (value < 0) {
        const absValue = Math.abs(value);
        return `√${absValue} = ${Math.sqrt(absValue).toFixed(2)}i`;
    }
    return `√${value} = ${Math.sqrt(value).toFixed(2)}`;
}

// Muestra el procedimiento pa calcular el vertice paso a paso
function showVertexProcedure(a, b, c, vertexX, vertexY) {
    let procedureHTML = `
        <h4>Cálculo del Vértice</h4>
        <div class="procedure-step">
            <strong>Fórmula del vértice:</strong> V = (-b/(2a), f(-b/(2a)))
        </div>
        <div class="procedure-step">
            <strong>1. Coordenada x del vértice:</strong><br>
            x<sub>v</sub> = -b / (2a) = -(${b}) / (2 × ${a}) = ${vertexX.toFixed(2)}
        </div>
        <div class="procedure-step">
            <strong>2. Coordenada y del vértice:</strong><br>
            y<sub>v</sub> = f(x<sub>v</sub>) = ${a.toFixed(2)}(${vertexX.toFixed(2)})² ${formatTerm(b, `(${vertexX.toFixed(2)})`, true)} ${formatConstant(c)}<br>
            = ${a.toFixed(2)}(${(vertexX * vertexX).toFixed(2)}) ${formatTerm(b * vertexX, '', true)} ${formatConstant(c)}<br>
            = ${(a * vertexX * vertexX).toFixed(2)} ${formatTerm(b * vertexX, '', true)} ${formatConstant(c)}<br>
            = ${vertexY.toFixed(2)}
        </div>
        <div class="procedure-step">
            <strong>Resultado:</strong> V = (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})
        </div>
    `;
    
    document.getElementById('vertexProcedure').innerHTML = procedureHTML;
}

// Muestra el procedimiento pa calcular las raices paso a paso
function showRootsProcedure(a, b, c, discriminant, roots) {
   
    const aVal = parseFloat(a) || 0;
    const bVal = parseFloat(b) || 0;
    const cVal = parseFloat(c) || 0;
    
    let procedureHTML = `
        <h4>Cálculo de las Raíces</h4>
        <div class="procedure-step">
            <strong>Fórmula cuadrática:</strong> x = [-b ± √(b² - 4ac)] / (2a)
        </div>
        <div class="procedure-step">
            <strong>1. Cálculo del discriminante (Δ):</strong><br>
            Δ = b² - 4ac = (${bVal})² - 4 × ${aVal} × ${cVal} = ${(bVal*bVal).toFixed(2)} ${formatTerm(-4*aVal*cVal, '', true)} = ${discriminant.toFixed(2)}
        </div>
    `;
    
    if (aVal === 0) {
        procedureHTML += `
            <div class="procedure-step">
                <strong>No es una ecuación cuadrática (a = 0)</strong>
            </div>
        `;
    } else if (roots.type === "complex") {
        procedureHTML += `
            <div class="procedure-step">
                <strong>2. Como Δ < 0, las raíces son complejas:</strong><br>
                Parte real = -b / (2a) = -(${bVal}) / (2 × ${aVal}) = ${roots.realPart.toFixed(2)}<br>
                Parte imaginaria = √|Δ| / (2a) = ${formatSqrt(discriminant)} / (2 × ${aVal}) = ${roots.imaginaryPart.toFixed(2)}i<br>
                <span class="complex-root">(donde <span class="imaginary-unit">i</span> es la unidad imajinaria, <span class="imaginary-unit">i</span>² = -1)</span>
            </div>
            <div class="procedure-step">
                <strong>Raíces complejas conjugadas:</strong><br>
                x₁ = ${roots.realPart.toFixed(2)} + ${roots.imaginaryPart === 1 ? '' : roots.imaginaryPart.toFixed(2)}<span class="imaginary-unit">i</span><br>
                x₂ = ${roots.realPart.toFixed(2)} - ${roots.imaginaryPart === 1 ? '' : roots.imaginaryPart.toFixed(2)}<span class="imaginary-unit">i</span>
            </div>
        `;
    } else if (roots.type === "single") {
        const x = (-bVal) / (2 * aVal);
        procedureHTML += `
            <div class="procedure-step">
                <strong>2. Como Δ = 0, hay una raíz real repetida:</strong><br>
                x = -b / (2a) = -(${bVal}) / (2 × ${aVal}) = ${x.toFixed(2)}
            </div>
        `;
    } else {
        const sqrtDiscriminant = Math.sqrt(discriminant);
        procedureHTML += `
            <div class="procedure-step">
                <strong>2. Como Δ > 0, hay dos raíces reales:</strong><br>
                x₁ = [-b + √Δ] / (2a) = [${-bVal} + ${sqrtDiscriminant.toFixed(2)}] / ${2*aVal} = ${((-bVal + sqrtDiscriminant)/(2*aVal)).toFixed(2)}<br>
                x₂ = [-b - √Δ] / (2a) = [${-bVal} - ${sqrtDiscriminant.toFixed(2)}] / ${2*aVal} = ${((-bVal - sqrtDiscriminant)/(2*aVal)).toFixed(2)}
            </div>
        `;
    }
    
    document.getElementById('rootsProcedure').innerHTML = procedureHTML;
}

// Dibuja la funcion cuadratica en el canvas
function drawQuadraticFunction(a, b, c, vertexX, vertexY) {
    // Se ajusta el tamaño del canvas segun el tamaño del contenedor
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Se limpia el canvas antes de dibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Se traslada el origen al centro y se invierte el eje Y pa que sea como en matematicas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, -1);

    // Se dibujan los ejes coordenados
    drawAxes();

    // Se dibuja la parabola punto por punto
    ctx.beginPath();
    ctx.strokeStyle = '#e91e63';
    ctx.lineWidth = 2;

    for (let x = -canvas.width / (2 * scale); x <= canvas.width / (2 * scale); x += 0.1) {
        const y = a * x * x + b * x + c;
        const screenX = x * scale;
        const screenY = y * scale;

        if (x === -canvas.width / (2 * scale)) {
            ctx.moveTo(screenX, screenY);
        } else {
            ctx.lineTo(screenX, screenY);
        }
    }
    ctx.stroke();

    // Se dibuja el vertice como un punto verde
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(vertexX * scale, vertexY * scale, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// Dibuja los ejes X y Y y sus marcas
function drawAxes() {
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    
    // Eje X
    ctx.beginPath();
    ctx.moveTo(-canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, 0);
    
    // Eje Y
    ctx.moveTo(0, -canvas.height / 2);
    ctx.lineTo(0, canvas.height / 2);
    
    // Flechas pa los ejes
    ctx.fillStyle = '#999';
    
    // Flecha eje X
    ctx.moveTo(canvas.width / 2 - 10, 5);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2 - 10, -5);
    
    // Flecha eje Y
    ctx.moveTo(5, canvas.height / 2 - 10);
    ctx.lineTo(0, canvas.height / 2);
    ctx.lineTo(-5, canvas.height / 2 - 10);
    
    ctx.stroke();
    ctx.fill();

    // Se dibujan las marcas de escala en los ejes
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    
    // Marcas eje X
    for (let x = -Math.floor(canvas.width / (2 * scale)); x <= Math.floor(canvas.width / (2 * scale)); x++) {
        if (x !== 0) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
            ctx.fillText(x.toString(), x * scale, 15);
            ctx.restore();
        }
    }

    // Marcas eje Y
    for (let y = -Math.floor(canvas.height / (2 * scale)); y <= Math.floor(canvas.height / (2 * scale)); y++) {
        if (y !== 0) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
            ctx.fillText(y.toString(), -15, -y * scale); // Nota el -y aquí
            ctx.restore();
        }
    }
}

// Configuracion inicial cuando se carga la pagina
window.onload = () => {
    // Se ponen valores por defecto pa que el usuario vea una parabola de ejemplo
    document.getElementById('a').value = 1;
    document.getElementById('b').value = 0;
    document.getElementById('c').value = 1;
    calculateAndGraph();
    
    // Se recalcula y redibuja la grafica si el usuario cambia el tamaño de la ventana
    window.addEventListener('resize', calculateAndGraph);
};