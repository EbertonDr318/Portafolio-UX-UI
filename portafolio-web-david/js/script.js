// Selecciona los elementos principales que JavaScript necesita controlar.
const cabecera = document.querySelector("[data-cabecera]");
const elementosParaRevelar = document.querySelectorAll(".revelar");
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

// Controla la ruleta de proyectos: tarjeta activa, anterior, siguiente y puntos inferiores.
if (ruleta) {
  const tarjetas = [...ruleta.querySelectorAll(".tarjeta-ruleta")];
  const puntos = [...ruleta.querySelectorAll("[data-punto-ruleta]")];
  const botonAnterior = ruleta.querySelector("[data-ruleta-anterior]");
  const botonSiguiente = ruleta.querySelector("[data-ruleta-siguiente]");
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

  // Flechas del teclado para cambiar de proyecto cuando la ruleta está en foco.
  ruleta.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") actualizarRuleta(indiceActivo - 1);
    if (evento.key === "ArrowRight") actualizarRuleta(indiceActivo + 1);
  });
}
