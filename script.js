// MENU LATERAL MOBILE
let btnMenu = document.getElementById("btn-menu");
let menu = document.getElementById("menu-mobile");
let overlay = document.getElementById("overlay-menu");

btnMenu.addEventListener("click", () => {
  menu.classList.add("abrir-menu");
});

menu.addEventListener("click", () => {
  menu.classList.remove("abrir-menu");
});

overlay.addEventListener("click", () => {
  menu.classList.remove("abrir-menu");
});

// FORMULÁRIO DE CONTATO
function enviarWhats(event) {
  event.preventDefault()

  const nome = document.getElementById("nome").value;
  const mensagem = document.getElementById("mensagem").value;
  const telefone = "5514996021767";

  const texto = `Olá! Me chamo ${nome}. ${mensagem}`;
  const msgFormatada = encodeURIComponent(texto);

  const url = `https://wa.me/${telefone}/?text=${msgFormatada}`;

  window.open(url, "_blank");
}
