const API_URL = "https://gestor-de-notas.onrender.com"; // Cambia esto por la URL de tu backend

// Función para obtener las notas desde el servidor
async function obtenerNotas() {
  try {
    // Hacer una solicitud GET a /notas para obtener las notas
    const response = await fetch(`${API_URL}/notas`); // Usar la URL base
    if (!response.ok) {
      throw new Error(`Error al obtener las notas: ${response.statusText}`);
    }
    const notas = await response.json();

    // Obtener el elemento donde vamos a mostrar las notas
    const listaNotas = document.getElementById('listaNotas');
    if (!listaNotas) {
      console.error('Elemento "listaNotas" no encontrado en el DOM.');
      return;
    }

    // Limpiar la lista antes de agregar las nuevas notas
    listaNotas.innerHTML = '';

    // Mostrar las notas en la lista
    notas.forEach((nota) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${nota.titulo}</strong>
        <p>${nota.contenido}</p>
        <small>${new Date(nota.fecha.seconds * 1000).toLocaleString()}</small>
      `;
      listaNotas.appendChild(li);
    });
  } catch (error) {
    console.error('Error al obtener las notas:', error);
    alert('No se pudieron cargar las notas. Intenta nuevamente más tarde.');
  }
}

// Enviar una nueva nota al servidor
const formNota = document.getElementById('formNota');
if (formNota) {
  formNota.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const contenido = document.getElementById('contenido').value.trim();

    if (!titulo || !contenido) {
      alert('Por favor, completa todos los campos antes de enviar.');
      return;
    }

    try {
      // Enviar la nueva nota al backend
      const response = await fetch(`${API_URL}/guardar-nota`, { // Usar la URL base
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titulo, contenido }),
      });

      if (!response.ok) {
        throw new Error(`Error al guardar la nota: ${response.statusText}`);
      }

      // Limpiar formulario y volver a obtener las notas
      formNota.reset();
      alert('Nota guardada exitosamente.');
      obtenerNotas(); // Recargar las notas después de enviar una nueva
    } catch (error) {
      console.error('Error al guardar la nota:', error);
      alert('No se pudo guardar la nota. Intenta nuevamente más tarde.');
    }
  });
} else {
  console.error('Formulario "formNota" no encontrado en el DOM.');
}

// Cargar las notas cuando se carga la página
window.onload = function () {
  obtenerNotas(); // Debemos llamar a la función, no solo referenciarla
};
