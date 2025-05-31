// Inicialización de Datepickers y validación
$(document).ready(function () {
  // Establecer la localización en español
  $.datepicker.setDefaults($.datepicker.regional['es']);
  
  // Configuración común para datepickers
  const datepickerOptions = {
    dateFormat: 'dd/mm/yy',
    autoclose: true,
    todayHighlight: true,
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-10:c+10'
  };

  // Inicializar datepickers
  $('#fechaDVR, #fechaOficial, #nuevaFecha, #nuevaFecha2').datepicker(datepickerOptions);

  // Validación y formateo de campos de hora
  $('.timepicker').on('input', function () {
    const $this = $(this);
    let value = $this.val().replace(/\D/g, '');
    
    // Formatear automáticamente HH:mm:ss
    if (value.length > 2) value = value.substring(0, 2) + ':' + value.substring(2);
    if (value.length > 5) value = value.substring(0, 5) + ':' + value.substring(5, 7);
    
    $this.val(value);
    validateTimeField($this);
  }).on('blur', function () {
    const $this = $(this);
    const value = $this.val();
    
    if (validateTimeField($this)) {
      $this.val(formatTime(value));
      autocompleteDate($this.attr('id'));
    } else {
      $this.val('');
    }
  });

  // Iniciar animación del logo
  moveLogoRandomly();
});

// Función para validar campo de hora
function validateTimeField($field) {
  const value = $field.val();
  const isValid = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value);
  
  $field.toggleClass('invalid', !isValid && value.length > 0);
  return isValid;
}

// Función para formatear hora
function formatTime(value) {
  const parts = value.split(':');
  const hh = parts[0] ? parts[0].padStart(2, '0') : '00';
  const mm = parts[1] ? parts[1].padStart(2, '0') : '00';
  const ss = parts[2] ? parts[2].padStart(2, '00') : '00';
  return `${hh}:${mm}:${ss}`;
}

// Autocompletar fecha si está vacía
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

// Validar campos requeridos antes de calcular
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

// Sección 1: Calcular Diferencia entre DVR y Oficial
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

  // Validar formato de hora
  if (!validateTimeField($('#horaDVR')) || !validateTimeField($('#horaOficial'))) {
    $('#resultado').html('<span class="retraso">Formato de hora inválido (HH:mm:ss)</span>');
    $('#mensaje').html('');
    return;
  }

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

// Sección 2: Mostrar/Ocultar y Calcular Hora DVR
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

// Sección 3: Mostrar/Ocultar y Calcular Hora Oficial
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

// Función para limpiar el formulario
function resetForm() {
  $('input[type="text"]').val('');
  $('.result p').empty();
  $('#ingresoHoraOficial, #ingresoHoraOficial2').hide();
  $('input').removeClass('invalid');
}

// Configuración del logo
const logoConfig = {
  baseSpeed: 3,
  sizeVariation: true
};

// Estado del logo
let logo = {
  element: null,
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  animationId: null
};

// Iniciar movimiento
function initLogo() {
  logo.element = document.getElementById('floating-logo');
  if (!logo.element) return;

  placeLogoRandomly();
  setRandomVelocity();
  startAnimation();
  window.addEventListener('resize', handleResize);
}

function placeLogoRandomly() {
  const logoWidth = logo.element.offsetWidth;
  const logoHeight = logo.element.offsetHeight;
  logo.position = {
    x: Math.random() * (window.innerWidth - logoWidth),
    y: Math.random() * (window.innerHeight - logoHeight)
  };
  applyPosition();
}

function setRandomVelocity() {
  const angle = Math.random() * Math.PI * 2;
  const speed = logoConfig.baseSpeed * (0.8 + Math.random() * 0.4);
  logo.velocity = {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed
  };
}

function applyPosition() {
  logo.element.style.left = `${logo.position.x}px`;
  logo.element.style.top = `${logo.position.y}px`;
}

function updatePosition() {
  // Mover logo
  logo.position.x += logo.velocity.x;
  logo.position.y += logo.velocity.y;

  // Detectar colisiones
  checkWallCollisions();
  
  // Variaciones aleatorias
  if (Math.random() < 0.03) {
    logo.velocity.x *= (0.7 + Math.random() * 0.6);
    logo.velocity.y *= (0.7 + Math.random() * 0.6);
  }

  applyPosition();
  logo.animationId = requestAnimationFrame(updatePosition);
}

function checkWallCollisions() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const logoWidth = logo.element.offsetWidth;
  const logoHeight = logo.element.offsetHeight;

  // Horizontal
  if (logo.position.x + logoWidth >= windowWidth) {
    logo.position.x = windowWidth - logoWidth;
    logo.velocity.x = -Math.abs(logo.velocity.x) * (0.8 + Math.random() * 0.4);
  } else if (logo.position.x <= 0) {
    logo.position.x = 0;
    logo.velocity.x = Math.abs(logo.velocity.x) * (0.8 + Math.random() * 0.4);
  }

  // Vertical
  if (logo.position.y + logoHeight >= windowHeight) {
    logo.position.y = windowHeight - logoHeight;
    logo.velocity.y = -Math.abs(logo.velocity.y) * (0.8 + Math.random() * 0.4);
  } else if (logo.position.y <= 0) {
    logo.position.y = 0;
    logo.velocity.y = Math.abs(logo.velocity.y) * (0.8 + Math.random() * 0.4);
  }
}

function handleResize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const logoWidth = logo.element.offsetWidth;
  const logoHeight = logo.element.offsetHeight;

  // Ajustar posición si es necesario
  logo.position.x = Math.max(0, Math.min(logo.position.x, windowWidth - logoWidth));
  logo.position.y = Math.max(0, Math.min(logo.position.y, windowHeight - logoHeight));

  // Invertir velocidad si es necesario
  if (logo.position.x + logoWidth >= windowWidth) {
    logo.velocity.x = -Math.abs(logo.velocity.x);
  }
  if (logo.position.y + logoHeight >= windowHeight) {
    logo.velocity.y = -Math.abs(logo.velocity.y);
  }

  applyPosition();
}

function startAnimation() {
  if (logo.animationId) cancelAnimationFrame(logo.animationId);
  updatePosition();
}

// Inicialización
document.addEventListener('DOMContentLoaded', initLogo);
window.addEventListener('beforeunload', () => {
  if (logo.animationId) cancelAnimationFrame(logo.animationId);
});

// Deshabilitar clic derecho
document.addEventListener('contextmenu', e => e.preventDefault());
