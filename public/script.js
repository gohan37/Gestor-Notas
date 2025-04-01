const API_URL = "https://gestor-de-notas.onrender.com/"; 

// Función para obtener las notas desde el servidor
async function obtenerNotas() {
    try {
      // Hacer una solicitud GET a /notas para obtener las notas
      const response = await fetch('https://gestor-de-notas.onrender.com');
      const notas = await response.json();  // Asegúrate de que "notas" esté definida aquí
  
      // Obtener el elemento donde vamos a mostrar las notas
      const listaNotas = document.getElementById('listaNotas');
      console.log(listaNotas);
      // Limpiar la lista antes de agregar las nuevas notas
      listaNotas.innerHTML = '';
    
      // Mostrar las notas en la lista
      notas.forEach(nota => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${nota.titulo}</strong><p>${nota.contenido}</p>`;
        listaNotas.appendChild(li);
      });
    } catch (error) {
      console.error('Error al obtener las notas:', error);
    }
  }
  
  // Enviar una nueva nota al servidor
  const formNota = document.getElementById('formNota');
  formNota.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const titulo = document.getElementById('titulo').value;
    const contenido = document.getElementById('contenido').value;
  
    // Enviar la nueva nota al backend
    await fetch('https://gestor-de-notas.onrender.com/guardar-nota', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ titulo, contenido }),
    });
  
    // Limpiar formulario y volver a obtener las notas
    formNota.reset();
    obtenerNotas();  // Recargar las notas después de enviar una nueva
  });
  
  // Cargar las notas cuando se carga la página
  window.onload = function() {
    obtenerNotas();  // Debemos llamar a la función, no solo referenciarla
  };
