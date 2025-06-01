// ========== EFECTO MATRIX ==========
const matrixChars = "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const matrixColumns = Math.floor(window.innerWidth / 20); // Una columna cada 20px
const matrixSpeed = {
  min: 3000, // 3 segundos (más lento)
  max: 8000  // 8 segundos (más rápido)
};

function initMatrix() {
  const container = document.getElementById('matrix-background');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Crear columnas distribuidas uniformemente
  for (let i = 0; i < matrixColumns; i++) {
    createMatrixColumn(container, i);
  }
  
  // Recrear columnas al redimensionar
  window.addEventListener('resize', () => {
    if (Date.now() - lastResize < 200) return;
    lastResize = Date.now();
    initMatrix();
  });
}

let lastResize = 0;

function createMatrixColumn(container, index) {
  const column = document.createElement('div');
  column.className = 'matrix-column';
  
  // Posición horizontal uniforme
  column.style.left = `${(index * 100 / matrixColumns)}%`;
  
  // Velocidad aleatoria para cada columna
  const speed = Math.random() * (matrixSpeed.max - matrixSpeed.min) + matrixSpeed.min;
  column.style.animationDuration = `${speed}ms`;
  
  // Crear caracteres en la columna (entre 20 y 40 caracteres)
  const charCount = 20 + Math.floor(Math.random() * 20);
  for (let i = 0; i < charCount; i++) {
    const char = document.createElement('div');
    char.className = 'matrix-char';
    char.textContent = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    
    // Efecto de desvanecimiento en la cola
    if (i > charCount - 10) {
      const opacity = 1 - (charCount - i) / 10;
      char.style.opacity = opacity.toFixed(2);
    }
    
    column.appendChild(char);
  }
  
  container.appendChild(column);
  
  // Actualizar caracteres periódicamente
  setInterval(() => {
    updateColumnChars(column);
  }, 100);
}

function updateColumnChars(column) {
  const chars = column.querySelectorAll('.matrix-char');
  chars.forEach(char => {
    if (Math.random() > 0.85) { // 15% de probabilidad de cambiar
      char.textContent = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    }
  });
}

// ========== CALCULADORA ==========
$(document).ready(function () {
  // Iniciar efecto Matrix
  initMatrix();
  
  // Inicialización de Datepickers
  $.datepicker.setDefaults($.datepicker.regional['es']);
  const datepickerOptions = {
    dateFormat: 'dd/mm/yy',
    autoclose: true,
    todayHighlight: true,
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-10:c+10'
  };

  $('#fechaDVR, #fechaOficial, #nuevaFecha, #nuevaFecha2').datepicker(datepickerOptions);

  // Validación de campos de hora
  $('.timepicker').on('input', function () {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length > 2) value = value.substring(0, 2) + ':' + value.substring(2);
    if (value.length > 5) value = value.substring(0, 5) + ':' + value.substring(5, 7);
    $(this).val(value);
  }).on('blur', function () {
    const value = $(this).val();
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value)) {
      $(this).val(formatTime(value));
      autocompleteDate($(this).attr('id'));
    } else {
      $(this).val('');
    }
  });
});

function formatTime(value) {
  const parts = value.split(':');
  const hh = parts[0] ? parts[0].padStart(2, '0') : '00';
  const mm = parts[1] ? parts[1].padStart(2, '0') : '00';
  const ss = parts[2] ? parts[2].padStart(2, '00') : '00';
  return `${hh}:${mm}:${ss}`;
}

function autocompleteDate(timepickerId) {
  const dateFields = {
    'horaDVR': 'fechaDVR',
    'horaOficial': 'fechaOficial',
    'nuevaHoraOficial': 'nuevaFecha',
    'nuevaHoraOficial2': 'nuevaFecha2'
  };
  const dateField = document.getElementById(dateFields[timepickerId]);
  if (dateField && !dateField.value) {
    dateField.value = moment().format('DD/MM/YYYY');
  }
}

function validateRequiredFields() {
  let isValid = true;
  const requiredFields = ['fechaDVR', 'horaDVR', 'fechaOficial', 'horaOficial'];
  
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field.value) {
      field.classList.add('invalid');
      isValid = false;
    }
  });
  
  return isValid;
}

function calcularDiferencia() {
  if (!validateRequiredFields()) {
    $('#resultado').html('<span class="retraso">Complete todos los campos requeridos</span>');
    $('#mensaje').html('');
    return;
  }

  const fechaDvr = $('#fechaDVR').val();
  const horaDvr = $('#horaDVR').val();
  const fechaOficial = $('#fechaOficial').val();
  const horaOficial = $('#horaOficial').val();

  try {
    const fechaHoraDvr = moment.utc(`${fechaDvr} ${horaDvr}`, 'DD/MM/YYYY HH:mm:ss');
    const fechaHoraOficial = moment.utc(`${fechaOficial} ${horaOficial}`, 'DD/MM/YYYY HH:mm:ss');
    const diferencia = moment.duration(fechaHoraDvr.diff(fechaHoraOficial));

    const anos = Math.abs(diferencia.years());
    const meses = Math.abs(diferencia.months());
    const dias = Math.abs(diferencia.days());
    const horas = Math.abs(diferencia.hours());
    const minutos = Math.abs(diferencia.minutes());
    const segundos = Math.abs(diferencia.seconds());

    const componentes = [];
    if (anos > 0) componentes.push(`${anos} año${anos > 1 ? 's' : ''}`);
    if (meses > 0) componentes.push(`${meses} mes${meses > 1 ? 'es' : ''}`);
    if (dias > 0) componentes.push(`${dias} día${dias > 1 ? 's' : ''}`);
    if (horas > 0) componentes.push(`${horas} hora${horas > 1 ? 's' : ''}`);
    if (minutos > 0) componentes.push(`${minutos} minuto${minutos > 1 ? 's' : ''}`);
    if (segundos > 0) componentes.push(`${segundos} segundo${segundos > 1 ? 's' : ''}`);

    let resultadoTexto = '';
    if (componentes.length > 0) {
      resultadoTexto = componentes.length > 1
        ? `${componentes.slice(0, -1).join(', ')} y ${componentes.slice(-1)}`
        : componentes[0];
      resultadoTexto = `El desfase de horario es: <span class='difference'>${resultadoTexto}</span>`;
    } else {
      resultadoTexto = 'Sin desfase de horario';
    }

    const mensaje = diferencia.asSeconds() > 0 
      ? "<span class='adelanto'>Adelanto</span> con respecto a la hora oficial." 
      : diferencia.asSeconds() < 0 
        ? "<span class='retraso'>Retraso</span> con respecto a la hora oficial." 
        : "Sin desfase de horario";

    $('#resultado').html(resultadoTexto);
    $('#mensaje').html(mensaje);
  } catch (error) {
    $('#resultado').html('<span class="retraso">Error en el cálculo. Verifique los datos.</span>');
    $('#mensaje').html('');
    console.error('Error al calcular diferencia:', error);
  }
}

function mostrarIngresoHoraOficial() {
  $('#ingresoHoraOficial').toggle();
  $('#ingresoHoraOficial2').hide();
}

function calcularNuevaHoraDvr() {
  if (!validateRequiredFields()) {
    $('#nuevoResultado').html('<span class="retraso">Complete primero los campos principales</span>');
    return;
  }

  const nuevaFecha = $('#nuevaFecha').val();
  const nuevaHoraOficial = $('#nuevaHoraOficial').val();

  if (!nuevaFecha || !nuevaHoraOficial) {
    $('#nuevoResultado').html('<span class="retraso">Complete fecha y hora</span>');
    return;
  }

  try {
    const fechaDvr = $('#fechaDVR').val();
    const horaDvr = $('#horaDVR').val();
    const fechaOficial = $('#fechaOficial').val();
    const horaOficial = $('#horaOficial').val();

    const fechaHoraDvr = moment(`${fechaDvr} ${horaDvr}`, 'DD/MM/YYYY HH:mm:ss');
    const fechaHoraOficial = moment(`${fechaOficial} ${horaOficial}`, 'DD/MM/YYYY HH:mm:ss');
    const nuevaFechaHoraOficial = moment(`${nuevaFecha} ${nuevaHoraOficial}`, 'DD/MM/YYYY HH:mm:ss');
    const diferenciaSegundos = fechaHoraDvr.diff(fechaHoraOficial, 'seconds');

    const nuevaFechaHoraDvr = nuevaFechaHoraOficial.clone().add(diferenciaSegundos, 'seconds');

    $('#nuevoResultado').html(`La hora para buscar en DVR es: <span class='difference'>${nuevaFechaHoraDvr.format('DD/MM/YYYY HH:mm:ss')}</span>`);
  } catch (error) {
    $('#nuevoResultado').html('<span class="retraso">Error en el cálculo</span>');
    console.error('Error al calcular nueva hora DVR:', error);
  }
}

function mostrarIngresoHoraOficial2() {
  $('#ingresoHoraOficial2').toggle();
  $('#ingresoHoraOficial').hide();
}

function calcularNuevaHora2() {
  if (!validateRequiredFields()) {
    $('#nuevoResultado2').html('<span class="retraso">Complete primero los campos principales</span>');
    return;
  }

  const nuevaFecha2 = $('#nuevaFecha2').val();
  const nuevaHoraOficial2 = $('#nuevaHoraOficial2').val();

  if (!nuevaFecha2 || !nuevaHoraOficial2) {
    $('#nuevoResultado2').html('<span class="retraso">Complete fecha y hora</span>');
    return;
  }

  try {
    const fechaDvr = $('#fechaDVR').val();
    const horaDvr = $('#horaDVR').val();
    const fechaOficial = $('#fechaOficial').val();
    const horaOficial = $('#horaOficial').val();

    const fechaHoraDvr = moment(`${fechaDvr} ${horaDvr}`, 'DD/MM/YYYY HH:mm:ss');
    const fechaHoraOficial = moment(`${fechaOficial} ${horaOficial}`, 'DD/MM/YYYY HH:mm:ss');
    const nuevaFechaHoraDvr = moment(`${nuevaFecha2} ${nuevaHoraOficial2}`, 'DD/MM/YYYY HH:mm:ss');
    const diferenciaSegundos = fechaHoraDvr.diff(fechaHoraOficial, 'seconds');

    const nuevaFechaHoraOficial = nuevaFechaHoraDvr.clone().subtract(diferenciaSegundos, 'seconds');

    $('#nuevoResultado2').html(`La hora Oficial es: <span class='difference'>${nuevaFechaHoraOficial.format('DD/MM/YYYY HH:mm:ss')}</span>`);
  } catch (error) {
    $('#nuevoResultado2').html('<span class="retraso">Error en el cálculo</span>');
    console.error('Error al calcular nueva hora oficial:', error);
  }
}

function resetForm() {
  $('input[type="text"]').val('');
  $('.result p').empty();
  $('#ingresoHoraOficial, #ingresoHoraOficial2').hide();
  $('input').removeClass('invalid');
}

document.addEventListener('contextmenu', e => e.preventDefault());
