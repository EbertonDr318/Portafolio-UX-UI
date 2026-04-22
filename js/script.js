// Selecciona los elementos principales que JavaScript necesita controlar.
const cabecera = document.querySelector("[data-cabecera]");
const botonMenu = document.querySelector("[data-boton-menu]");
const menuNavegacion = document.querySelector("[data-menu]");
const elementosParaRevelar = document.querySelectorAll(".revelar");
const galerias = document.querySelectorAll("[data-galeria]");
const pistaCinta = document.querySelector(".pista-cinta");
const ruleta = document.querySelector("[data-ruleta]");

// Duplica los textos de la cinta para que el movimiento horizontal se vea continuo.
if (pistaCinta) {
  pistaCinta.innerHTML = `${pistaCinta.innerHTML}${pistaCinta.innerHTML}`;
}

// Cambia el estilo de la cabecera cuando la página baja o cuando estamos en una página de proyecto.
const actualizarEstadoCabecera = () => {
  const esPaginaProyecto = document.body.classList.contains("pagina-proyecto");
  cabecera?.classList.toggle("esta-desplazada", esPaginaProyecto || window.scrollY > 24);
};

actualizarEstadoCabecera();
window.addEventListener("scroll", actualizarEstadoCabecera, { passive: true });

// Menú móvil: abre y cierra la navegación cuando no cabe en formato horizontal.
if (botonMenu && menuNavegacion) {
  const alternarMenu = () => {
    const estaAbierto = menuNavegacion.classList.toggle("esta-abierta");
    botonMenu.setAttribute("aria-expanded", String(estaAbierto));
  };

  botonMenu.addEventListener("click", alternarMenu);

  // Cierra el menú al tocar cualquier enlace interno.
  menuNavegacion.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => {
      menuNavegacion.classList.remove("esta-abierta");
      botonMenu.setAttribute("aria-expanded", "false");
    });
  });

  // Si la pantalla vuelve a escritorio, limpia el estado abierto del menú.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 880) {
      menuNavegacion.classList.remove("esta-abierta");
      botonMenu.setAttribute("aria-expanded", "false");
    }
  });
}

// Muestra los elementos con animación cuando entran en pantalla.
const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("esta-visible");
        observador.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.12 }
);

elementosParaRevelar.forEach((elemento) => observador.observe(elemento));

// Controla cada galería de proyecto: botones, puntos y gesto de deslizamiento en móvil.
galerias.forEach((galeria) => {
  const slides = [...galeria.querySelectorAll(".slide-galeria")];
  const puntos = [...galeria.querySelectorAll("[data-punto-galeria]")];
  const botonAnterior = galeria.querySelector("[data-galeria-anterior]");
  const botonSiguiente = galeria.querySelector("[data-galeria-siguiente]");
  let indiceActivo = 0;
  let inicioToqueX = 0;
  let inicioToqueY = 0;

  // Activa una sola imagen a la vez y sincroniza el estado visual de los puntos.
  const actualizarGaleria = (siguienteIndice) => {
    indiceActivo = (siguienteIndice + slides.length) % slides.length;

    slides.forEach((slide, indice) => {
      const indiceAnterior = (indiceActivo - 1 + slides.length) % slides.length;
      const indiceSiguiente = (indiceActivo + 1) % slides.length;
      slide.classList.toggle("esta-visible", indice === indiceActivo);
      slide.classList.toggle("esta-anterior", indice === indiceAnterior);
      slide.classList.toggle("esta-siguiente", indice === indiceSiguiente);
    });

    puntos.forEach((punto, indice) => {
      punto.classList.toggle("esta-activa", indice === indiceActivo);
    });
  };

  // Navegación principal de la galería con botones laterales.
  botonAnterior?.addEventListener("click", () => actualizarGaleria(indiceActivo - 1));
  botonSiguiente?.addEventListener("click", () => actualizarGaleria(indiceActivo + 1));

  // Navegación directa: cada punto inferior salta a una captura concreta.
  puntos.forEach((punto) => {
    punto.addEventListener("click", () => actualizarGaleria(Number(punto.dataset.puntoGaleria)));
  });

  // Deslizamiento táctil: cambia de imagen cuando el gesto horizontal es claro.
  galeria.addEventListener(
    "touchstart",
    (evento) => {
      const toque = evento.touches[0];
      inicioToqueX = toque.clientX;
      inicioToqueY = toque.clientY;
    },
    { passive: true }
  );

  // Evalúa el gesto y evita cambiar de imagen cuando el movimiento fue más vertical que horizontal.
  galeria.addEventListener(
    "touchend",
    (evento) => {
      const toque = evento.changedTouches[0];
      const distanciaX = toque.clientX - inicioToqueX;
      const distanciaY = toque.clientY - inicioToqueY;
      const umbralCambio = 45;

      if (Math.abs(distanciaX) > Math.abs(distanciaY) && Math.abs(distanciaX) > umbralCambio) {
        if (distanciaX < 0) actualizarGaleria(indiceActivo + 1);
        if (distanciaX > 0) actualizarGaleria(indiceActivo - 1);
      }
    },
    { passive: true }
  );

  // Estado inicial: al cargar la página deja una captura central y dos laterales con menor opacidad.
  actualizarGaleria(0);
});

// Controla la ruleta de proyectos: tarjeta activa, anterior, siguiente y puntos inferiores.
if (ruleta) {
  const tarjetas = [...ruleta.querySelectorAll(".tarjeta-ruleta")];
  const puntos = [...ruleta.querySelectorAll("[data-punto-ruleta]")];
  const botonAnterior = ruleta.querySelector("[data-ruleta-anterior]");
  const botonSiguiente = ruleta.querySelector("[data-ruleta-siguiente]");
  let inicioToqueX = 0;
  let inicioToqueY = 0;
  let indiceActivo = 0;

  // Calcula qué tarjeta queda al centro y qué tarjetas quedan a los lados.
  const actualizarRuleta = (siguienteIndice) => {
    indiceActivo = (siguienteIndice + tarjetas.length) % tarjetas.length;

    tarjetas.forEach((tarjeta, indice) => {
      const indiceAnterior = (indiceActivo - 1 + tarjetas.length) % tarjetas.length;
      const indiceSiguiente = (indiceActivo + 1) % tarjetas.length;
      tarjeta.classList.toggle("esta-activa", indice === indiceActivo);
      tarjeta.classList.toggle("esta-anterior", indice === indiceAnterior);
      tarjeta.classList.toggle("esta-siguiente", indice === indiceSiguiente);
    });

    puntos.forEach((punto, indice) => {
      punto.classList.toggle("esta-activa", indice === indiceActivo);
    });
  };

  // Botones laterales de la ruleta.
  botonAnterior?.addEventListener("click", () => actualizarRuleta(indiceActivo - 1));
  botonSiguiente?.addEventListener("click", () => actualizarRuleta(indiceActivo + 1));

  // Puntos inferiores para saltar directamente a un proyecto.
  puntos.forEach((punto) => {
    punto.addEventListener("click", () => actualizarRuleta(Number(punto.dataset.puntoRuleta)));
  });

  // Click en tarjetas: la activa abre el proyecto; las laterales solo pasan al centro.
  tarjetas.forEach((tarjeta, indice) => {
    tarjeta.addEventListener("click", (evento) => {
      if (indice !== indiceActivo) {
        evento.preventDefault();
        actualizarRuleta(indice);
      }
    });
  });

  // Flechas del teclado para cambiar de proyecto cuando la ruleta está en foco.
  ruleta.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") actualizarRuleta(indiceActivo - 1);
    if (evento.key === "ArrowRight") actualizarRuleta(indiceActivo + 1);
  });

  // Deslizamiento táctil: en móvil permite cambiar de tarjeta moviendo el dedo de izquierda a derecha.
  ruleta.addEventListener(
    "touchstart",
    (evento) => {
      const toque = evento.touches[0];
      inicioToqueX = toque.clientX;
      inicioToqueY = toque.clientY;
    },
    { passive: true }
  );

  // Evalúa el gesto táctil y solo cambia de proyecto si el movimiento horizontal es claro.
  ruleta.addEventListener(
    "touchend",
    (evento) => {
      const toque = evento.changedTouches[0];
      const distanciaX = toque.clientX - inicioToqueX;
      const distanciaY = toque.clientY - inicioToqueY;
      const umbralCambio = 45;

      if (Math.abs(distanciaX) > Math.abs(distanciaY) && Math.abs(distanciaX) > umbralCambio) {
        if (distanciaX < 0) actualizarRuleta(indiceActivo + 1);
        if (distanciaX > 0) actualizarRuleta(indiceActivo - 1);
      }
    },
    { passive: true }
  );
}
