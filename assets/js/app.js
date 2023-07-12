number_contact = 0, list_contact_empty = "";
const regNumber = /^([0-9])+$/,
  regEmail = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i,
  regNumbLet = /^([a-z A-Z 0-9])+$/,
  regNumbLetSim =
    /^([0-9 a-z \u00f1\u00d1 A-Z]|[!#\$%@.&'\*\+\-\=\?\^_`{\|}~])+$/,
  regLetras = /^([a-z A-Z])+$/,
  toggle_dark_mode = document.querySelector("#toggle-dark-mode"),
  text_dark_mode = document.querySelector("#toggle-dark-mode > a"),
  icon_dark_mode = document.querySelector("#toggle-dark-mode > a > i"),
  inp_modal_new_contact_1 = document.querySelector('#inp-modal-new-contact-1'),
  inp_modal_new_contact_2 = document.querySelector('#inp-modal-new-contact-2'),
  button_modal_new_contact_close = document.querySelector('#button-modal-new-contact-close'),
  save_new_contact = document.querySelector("#saveNewContact"),
  receptor_trash = document.querySelector(".receptor-trash"),
  recicle = document.querySelector(".recicle"),
  inp_name = document.querySelector("#name"),
  csrf = document.querySelector("[name=csrf]"),
  inp_search_clear = document.querySelector(".bx-x"),
  arrayLetrasExistentes = [],
  titles = {
    home: "Inicio | ",
    login: "Inicia Sesion para acceder a tu agenda | ",
    signup: "Registrate para poder guardar numeros telefonicos | ",
    recover: "Recupera el acceso a la agende | ",
    contact: "Contactos telefonicos | ",
    setting: "Configurar la App | ",
    acercade: "Informacion sobre la App | ",
  },
  msgError = {
    emailLock: "El Email es invalido o no coincide con el nuestro.",
    passwordLock: "La contrase\u00f1a no cumple con el nivel de seguridad requerido.",
    numberFormt: "El formato o logitud invalidos. minimo 10 maximo 11 numeros",
    numberNegtive: "Solo numeros positvos.",
    text: "Texto no permitido.",
  },
  dark_mode = function () {
    let a = document.documentElement.getAttribute("mode");
    a === "light"
      ? (document.documentElement.setAttribute("mode", "dark"),
        (text_dark_mode.lastChild.textContent = " Light mode"),
        icon_dark_mode_sun())
      : (document.documentElement.setAttribute("mode", "light"),
        (text_dark_mode.lastChild.textContent = " Dark mode"),
        icon_dark_mode_moon());
  },
  icon_dark_mode_sun = function () {
    icon_dark_mode.classList.add("bx-sun");
    icon_dark_mode.classList.remove("bx-moon");
  },
  icon_dark_mode_moon = function () {
    icon_dark_mode.classList.add("bx-moon");
    icon_dark_mode.classList.remove("bx-sun");
  },
  toggleBacktotop = function () {
    let entry = document.querySelector('.top-scroll');
    if (document.querySelector(".container-list").firstElementChild.scrollTop > 200) {
      entry.classList.add('active');
    }
    else {
      entry.classList.remove('active');
    }
  },
  insert_title = function (a) {
    let t = document.querySelector("title"),
      title_page = document.querySelector("title").childNodes;
    if (title_page.length == 2) {
      title_page[0].textContent = a;
      return false;
    }
    t.insertBefore(document.createTextNode(a), t.firstChild);
  },
  UUID4 = function () {
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0; i < uuid.length; i++) {
      if (uuid[i] === "x") {
        uuid[i] = Math.floor(Math.random() * 16).toString(16);
      } else if (uuid[i] === "y") {
        uuid[i] = (8 + Math.floor(Math.random() * 3)).toString(16);
      }
    }
    return uuid.join("");
  },
  errorForm = function (a, b) {
    let c;
    c = null != a && (a.nextElementSibling), null != c && (c.textContent = b, c.className = "validate active"), setTimeout(() => {
      null != c && (c.textContent = "", c.classList.remove("active"))
    }, 2000)
  },
  afterSend = function (a, b, c) {
    if (b.type === 'checkbox' || b.type === 'radio') {
      if (b.checked) {
        mode_local ? formData.set(b.getAttribute('name'), 'on') : formData.set(b.getAttribute('name'), 'on');
      }
      else {
        mode_local ? formData.set(b.getAttribute('name'), 'off') : formData.set(b.getAttribute('name'), 'off');
      }
      return false;
    }
    (a) ? (mode_local) ? formData.set(b.getAttribute('name'), b.value) : formData.set(b.getAttribute('name'), b.value) : errorForm(b, c);
  },
  petition_promise = function (method, url) {
    let onprogress = document.querySelector("#onprogress");
    new Promise((resolver, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      resolver();
      xhr.onprogress = e => {
        onprogress.style.width = Math.round(e.loaded / 100) + "%"
      };
      xhr.onload = () => {
        document.querySelector(".container-list").firstElementChild.innerHTML = xhr.response;
        onprogress.style.width = "0%";
        (null != document.querySelector(".container-list").querySelector("[name=csrf]")) && (
          document.querySelector(".container-list").querySelector("[name=csrf]").value = UUID4()
        );
        (null != document.querySelector(".container-list").querySelector(".not-contacts") && (null != localStorage.getItem(s.key) && localStorage.getItem(s.key) != "")
        && ( insert_items_contacts() ))
      };
      xhr.onerror = () => reject();
      xhr.responseType = "text";
      xhr.send();
    })
  },
  toggle_modal_new_contact = () => {
    inp_modal_new_contact_2.checked = (inp_modal_new_contact_2.checked) ? false : true;
    console.info('este modal funciona con CSS y el estado del element.checked = ' + inp_modal_new_contact_2.checked)
  },
  search = ev => {

    //document.querySelector('.container-list').style.display = 'none';

    let arr = new Set(arrayLetrasExistentes),
    arrayLetrasExistentesLocal = [... arr.values()];

    (ev.code === 'Backspace')&&(function () {
      arrayLetrasExistentesLocal.map( e=> (!ev.target.value.split('').includes(e)) ? (
        Object.values(document.getElementsByClassName(e)).map(e=>e.setAttribute('color', '#000'))
      ) : 0 );
    })();

    let
      a = Object.values(document.querySelectorAll("h3")),
      reg = new RegExp(`[${ev.target.value.at(-1)}]`, `i`),
      j = 1,
      index,
      list_name_search = [];

    Object.values(contacts[s.key]).forEach(e =>
      (e.name.includes(ev.target.value)) && list_name_search.push(e)
    );
    
    contacts['listSearch'] = [];
    for (const iterator of Object.values(list_name_search)) {
      contacts.listSearch.push(iterator);
    } 

    function b(o) {

      for (const iterator of o) {

        for (let k = 0, l = ev.target.value.length; k < iterator.textContent.length; k++, l++) {

          index = ([iterator.textContent.slice(k, l)].map(map => (
            (map.substring(0, ev.target.value.length) == ev.target.value.substring(0, ev.target.value.length)) &&
            (j++, map) |
            (!(map.substring(0, ev.target.value.length) == ev.target.value.substring(0, ev.target.value.length))) &&
            (false)
          )).includes(0)) ? (iterator.parentElement, true) : 0;

          if (index) {

            (null != iterator.firstElementChild) ? (f = f => {
              w = "";
              for (let m = 0; m < iterator.childNodes.length; m++) {

                if (iterator.childNodes[m].nodeName == "#text") {
                  for (let a of iterator.childNodes.values()) {
                    (undefined != a.length)
                      ? (w +=
                        iterator.childNodes[m].textContent.replace(reg, ev.target.value.at(-1).fontcolor("#369797"))
                      )
                      : (
                        w += a.outerHTML
                      );
                  }
                }
              }
              iterator.innerHTML = w;
              Object.values(document.getElementsByTagName('FONT')).map(e=>e.className = e.textContent),
              Object.values(document.getElementsByTagName('FONT')).map(e=>arrayLetrasExistentes.push(e.textContent))
            }, f()) :
              (
                iterator.innerHTML = iterator.lastChild.textContent.replace(reg, ev.target.value.fontcolor("#369797"))
              );

            break;
          }
        }
      }
    } (ev.target.value != "") && b(a);
    (function(){
      ev.target.value.split('').map(e=>{
        Object.values(document.getElementsByClassName(e)).map(e=>e.setAttribute('color', '#369797'))
      })
    }())
  },
  search_clear = ev => {
    ev.target.previousElementSibling.value = "",
    Object.values(document.getElementsByTagName('FONT')).map(e=>e.setAttribute('color','#000'))
  },
  goBack = () => {
    history.back(),
    toggle_button_new_contact(inp_modal_new_contact_1.previousElementSibling, false)
  },
  toggle_button_new_contact = (a,b) => {
    if(b) {
      a.classList.remove("bx-plus"),
      a.classList.add("bx-left-arrow-alt"),
      a.classList.remove("d-none"),
      a.addEventListener("click", goBack)
    } else {
      a.classList.remove("bx-left-arrow-alt"),
      a.classList.add("bx-plus"),
      a.classList.remove("d-none"),
      a.removeEventListener("click", goBack),
      active_boton()
    }
  },
  desactive_boton = () => {
    if (
      null != inp_modal_new_contact_2 && null != button_modal_new_contact_close && null != inp_modal_new_contact_1 && s.active &&
      (inp_modal_new_contact_1.classList.add("d-none"), inp_modal_new_contact_1.previousElementSibling.classList.add("d-none"), button_modal_new_contact_close.removeEventListener("click", toggle_modal_new_contact), true)
    ) {
      console.info(`boton de nuevo contacto NO disponible...`);
      console.info(`boton de nuevo contacto NO disponible desde una function javascript...`);

      toggle_button_new_contact(inp_modal_new_contact_1.previousElementSibling, true)
    }
  },
  active_boton = () => {
    if (
      null != inp_modal_new_contact_2 && null != button_modal_new_contact_close && null != inp_modal_new_contact_1 && s.active &&
      (inp_modal_new_contact_1.classList.remove("d-none"), inp_modal_new_contact_1.previousElementSibling.classList.remove("d-none"), button_modal_new_contact_close.addEventListener("click", toggle_modal_new_contact), true)
    ) {
      console.info(`boton de nuevo contacto disponible...`);
      console.info(`boton de nuevo contacto disponible desde una function javascript...`);
    }

    if ((null != document.querySelector("[name=search]") && null != document.querySelector(".search") && s.active) && (document.querySelector(".search").classList.remove("v-hidden"), document.querySelector("[name=search]").addEventListener("keyup", search), true)) {
      console.info(`busqueda activada...`)
    }

    if (
      null != inp_search_clear && s.active &&
      (inp_search_clear.addEventListener("click", search_clear), true)
    ) {
      console.info(`boton para limpiar el input search disponible...`);
    }

    if (null != receptor_trash) {
      receptor_trash.classList.remove("d-none")
      receptor_trash.classList.add("d-flex")
    }
  },
  valid_position_list = a => {
    if (null == a && "object" != typeof a) return "false";
    return (a.textContent.charCodeAt() >= 96 && a.textContent.charCodeAt() <= 122);
  },
  drag = e => {
    if (e.type !== "drag") return false;
    e.preventDefault()
    e.target.setAttribute("id", "huola");
    dataTransfer.setData('text', e.target.id)
    receptor_trash.classList.add("active")
  },
  dragend = e => {
    if (e.type !== "dragend") return false;
    e.preventDefault()
    receptor_trash.classList.remove(["active"], ["over"], ["leave"], ["enter"])
  },
  toggle_img_empty = () => {
    (number_contact)
      ? ((list_contact_empty == "") && (list_contact_empty = document.querySelector(".not-contacts").cloneNode(true), document.querySelector(".not-contacts").remove()))
      : (setTimeout(() => {
        document.querySelector(".container-list").firstElementChild.insertAdjacentElement("afterbegin", list_contact_empty);
        list_contact_empty = "";
      }, 300));
  },
  create_list_contact_json = () => {
    let objContact = [], j=0;
    for (let name of document.querySelector(".container-list").firstElementChild.querySelectorAll("section.contacts")) {
      objContact.push({"name":"", "phone":"", "country":""});
      i=0;
      for(let names of name.textContent.split("\t")) {
          i++;
          if(i == 1){objContact[j]["name"] = names}
          if(i == 2){objContact[j]["phone"] = names}
          if(i == 3){objContact[j]["country"] = names}
      }
      j++;
    }
    console.log(objContact);
  },
  delete_element_json = (elem) => {
    let i=0;
    if(objContactDelete.length == 0) {
      objContactDelete.push({"name":"", "phone":"", "country":"", "status": "activo"});
    }
    
    for(let name of elem.textContent.split("\t")) {
      i++;
      if(i == 1){objContactDelete[0]["name"] = name}
      if(i == 2){objContactDelete[0]["phone"] = name}
      if(i == 3){objContactDelete[0]["country"] = name}
    }
    if(contacts[s.key].indexOf(objContactDelete) == -1) {
      contacts[s.key].splice( contacts[s.key].findIndex( e => JSON.stringify(e) == JSON.stringify(objContactDelete[0]) ), 1 )
      return objContactDelete[0];
    }
    return false;
  },
  create_element_new_contact = obj => {
    let
      a,
      b,
      c,
      d,
      styleSpan = function (elem) {
        elem.style.display = "inline-block", elem.style.width = "50%", elem.style.fontSize = "0.9rem"
      },
      position_list,
      y = [],
      letter = document.createElement("span");

    a = document.createElement("section")
    a.className = "contacts active"
    a.setAttribute("draggable", "true")
    a.setAttribute("ondrag", "drag(event)")
    a.setAttribute("ondragend", "dragend(event)")
    a.style.opacity = "0"

    b = document.createElement("h3"),
      c = document.createElement("span"),
      d = c.cloneNode();

    [b.textContent, c.textContent, d.textContent] = Object.values(obj);
    b.textContent = b.textContent + "\t"
    c.textContent = c.textContent + "\t"

    d.style.textAlign = "right";
    letter.className = "letter";

    styleSpan(c)
    styleSpan(d)

    a.appendChild(b),
      a.appendChild(c),
      a.appendChild(d);

    if (valid_position_list(b) === "false") {

    } else if (valid_position_list(b) === true) {
      position_list = document.querySelector(".container-list").firstElementChild.querySelector('[aria-letter="' + b.textContent.charCodeAt() + '"]');
      (position_list.previousSibling.nodeName === "#text") ? (function () {
        letter.textContent = String.fromCharCode(b.textContent.charCodeAt()).toLocaleUpperCase();
        position_list.outerHTML = letter.outerHTML + position_list.outerHTML;

      }()) : (position_list.previousSibling.classList.add("active"))

      position_list = document.querySelector(".container-list").firstElementChild.querySelector('[aria-letter="' + b.textContent.charCodeAt() + '"]');

    } else {
      position_list = document.querySelector(".container-list").firstElementChild.querySelector('[aria-letter="96"');
      (position_list.previousSibling.nodeName === "#text") ? (function () {
        letter.textContent = "#";
        position_list.outerHTML = letter.outerHTML + position_list.outerHTML;
      }()) : (position_list.previousSibling.classList.add("active"))

      position_list = document.querySelector(".container-list").firstElementChild.querySelector('[aria-letter="96"');

    }

    function contador(a) {
      for (const iterator of a.keys()) {
        if (a.item(iterator).textContent.length > b.textContent.length) {
          y.push(a.item(iterator).textContent);
        }
        if (a.item(iterator).textContent.length == b.textContent.length) {
          y.push(a.item(iterator).textContent);
        }
        if (a.item(iterator).textContent.length < b.textContent.length) {
          y.push(a.item(iterator).textContent);
        }
      }
    }

    function insert_item(num) {

      (num)
        ? (position_list.childNodes.item(num - 1).outerHTML = position_list.childNodes.item(num - 1).outerHTML + a.outerHTML, number_contact++)
        : (position_list.innerHTML = a.outerHTML + position_list.innerHTML, number_contact++);

      toggle_img_empty();

      setTimeout(() => {
        let pl = position_list.previousElementSibling.classList;
        if (pl.length === 1) {
          pl.add("active")
        }
        position_list.querySelector("section.active").style.opacity = "1";
        position_list.querySelector("section.active").classList.remove("active");
      }, 300)

    }

    contador(position_list.querySelectorAll("h3"));
    y.sort();

    if (!(y.indexOf(b.textContent) == -1)) {
      num = y.indexOf(b.textContent);
      insert_item(num);
      return false;
    }

    y.push(b.textContent);
    y.sort();

    num = 0;
    if (!(y.indexOf(b.textContent) == -1)) {
      num = y.indexOf(b.textContent)
    }

    insert_item(num);

  },
  insert_items_contacts = () => {
    let z = JSON.parse(localStorage.getItem(s.key));
    number_contact = 0;
    list_contact_empty = "";
    z.map(item => create_element_new_contact(item))
  },
  mode_local = ('localStorage' in window),
  mode_local_session = ('sessionStorage' in window),
  popstate = ('onpopstate' in window),
  dataTransfer = new DataTransfer(),
  formData = new FormData(),
  objContactDelete = [];
contador_items = false;

function valid_simbolNumber_or_letter(a) {
  return (a.textContent.charCodeAt() >= 96 && a.textContent.charCodeAt() <= 122) || false;
}

function create_cont_list() {
  console.log('s');
}

function insert_cont_list() {
  console.log('s');
}

function verify_cont_list(a) {
  if (a) {
    insert_cont_list();
  } else {
    create_cont_list();
  }
}

class Sessions {
  active = false;

  constructor() {
    console.info('sessions')
  }

  session = (a, b) => {
    return sessionStorage.getItem(a) === b;
  }
};

class Contacts {

  listContact = [];
  _listSearch = [];
  #contListSearch = null;

  constructor () {
    this.contContact = '';
    this.#contListSearch = document.getElementById('listSearch');
    this._a = 'prueba';
  }

  /**
   * @param {any[]} value
   */
  set _a(value) {
    console.log(value);
  }
  
  update () {
    console.log(this.#contListSearch);
  }
}; 

const s = new Sessions();

if (mode_local) {
  sessionStorage.setItem("email", "usuario@ejemplo.com")
  sessionStorage.setItem("password", "1234567890")
  sessionStorage.setItem("x_key", "1da2a9e60faf62ae9699891ad454ebda90a5f8a9b8ddc22f3362cb0086657a37")
  console.info(`sessionStorage disponible...`);
}
if (
  null != toggle_dark_mode &&
  null != icon_dark_mode &&
  (toggle_dark_mode.addEventListener("click", dark_mode), true)
) {
  console.info(`dark mode disponible...`);
}
if (
  null != csrf && (console.info(`UUID en ejecucion...`), true)
) {
  csrf.value = UUID4();
}

document.querySelector(".container-list").firstElementChild.addEventListener("scroll", toggleBacktotop);

function stt(a, b, c, d) {
  history.pushState(a, b, c)
}

window.onload = function (e) {
  if (e.type !== "load") return false;
  let a = document.createElement("a");
  let i = document.createElement("i");
  a.className = "top-scroll";
  i.className = "bx bx-chevron-up";
  document.documentElement.lastElementChild
    .appendChild(a)
    .appendChild(i);
}

window.onsubmit = function (e) {
  if (e.type !== "submit") return false;
  e.preventDefault();

  /**
  * valida la longitud de un String.
  * @param a :string.
  * @param b :int es igual al minimo.
  * @param c :int es igual al maximo.
  * */
  const valueRegLongText = (a, b, c) => {
    if ("string" !== typeof a) return false;
    if (a.length < b || a.length > c) {
      return false;
    }
    return true;
  };

  (e.target) && (function () {
    let form = e.target, name, phone, country, email, password, x_Key, valid = true;

    for (let key in e.target) {
      if (Object.hasOwnProperty.call(e.target, key)) {
        let elems = e.target[key];

        (elems.id == "name") ? name = elems : 0;
        (elems.id == "phone") ? phone = elems : 0;
        (elems.id == "country") ? country = elems : 0;
        (elems.id == "email") ? email = elems : 0;
        (elems.id == "password") ? password = elems : 0;
        (elems.id == "x_Key") ? x_Key = elems : 0;


        a = null != elems.getAttribute('name') && function () {
          switch (elems.type) {
            case 'number':
              if (!valid) { return false }
              valid = valid && (regNumber.test(elems.value) && valueRegLongText(elems.value, 10, 11));
              afterSend(valid, elems, msgError.numberFormt);
              break;
            case 'email':
              if (!valid) { return false }
              valid = valid && (regEmail.test(elems.value) && valueRegLongText(elems.value, 8, 60));
              afterSend(valid, elems, msgError.emailLock);
              break;
            case 'text':
              if (!valid) { return false }
              valid = valid && (regNumbLetSim.test(elems.value) && valueRegLongText(elems.value, 4, 60));
              afterSend(valid, elems, msgError.text);
              break;
            case 'password':
              if (!valid) { return false }
              valid = valid && (regNumbLetSim.test(elems.value) && valueRegLongText(elems.value, 8, 20));
              afterSend(valid, elems, msgError.passwordLock);
              break;
            case 'checkbox':
              if (!valid) { return false }
              afterSend(valid, elems, 0);
              break;
            case 'hidden':
              if (!valid) { return false }
              if (elems.id === "id_user") {
                valid = valid && regEmail.test(elems.value);
                afterSend(valid, elems, 0);
                return false;
              }
              valid = valid && regNumbLetSim.test(elems.value);
              afterSend(valid, elems, 0);
              break;
          }
          return valid;
        }();

      }
    }

    if (valid) {

      console.info(`listo para el envio...`);

      (form.id === "signup" && null != email && null != password && null != x_Key) && function () {
        (mode_local) && (
          valid = (email.value != "") && (sessionStorage.setItem(email.value, x_Key.value), true),
          (valid) && (
            ('undefined' == typeof s.users) && (s.users = []),
            s.users.push({ "email": email.value, "key": x_Key.value }),
            petition_promise("GET", "./assets/layout/login.html"),
            insert_title(titles["login"]),
              (popstate)
                ? stt({"page-url": "./assets/layout/login.html", "list": {}}, titles["login"], "#page-login")
                : window.location.hash = "page-login",
            alert("Registro exitoso.")
          )
        )
      }(),

        (form.id === "login" && null != x_Key && null != email) && function () {
          (mode_local) && (a = x_Key.getAttribute("id") === "x_Key" ? x_Key.value : 0, function (a) {
            let b;
            b = (a) ? s.session(email.value, a) : false;
            (b) && (
              petition_promise("GET", "./assets/layout/list-contact.html"),
              document.getElementById("id_user").value = email.value,
              s.active = true,
              s.email = email.value,
              s.key = a,
              contacts = new Contacts,
              ('undefined' != typeof s.key) 
                && (contacts[s.key] = [],
                  null == localStorage.getItem(s.key)
                    && (localStorage.setItem(s.key, []))
                  ),
              (contacts[s.key].length == 0 && null != localStorage.getItem(s.key) && localStorage.getItem(s.key) != "" ) && (contacts[s.key] = JSON.parse(localStorage.getItem(s.key)) ),
              active_boton(),
              alert(`bienvenido! ${email.value}`),
              insert_title(titles["contact"]), 
              (popstate) 
                ? stt({"page-url": "./assets/layout/list-contact.html", "func": "toggle_button_new_contact(inp_modal_new_contact_1.previousElementSibling, false)", "list": s.key}, titles["contact"], "#page-listContact")
                : window.location.hash = "page-listContact"
              );
            (!b) && alert(`Email o Contrase\u00f1a incorecta.`)
          }(a))
        }(),

        (form.id === "newContact" && null != name && null != phone && null != country) && function () {
          (mode_local) && (a = name.value.trim() != "" ? name.value.trim() : 0, function (a) {
            (a && s.active) && (contacts[s.key].push({ "name": a, "phone": phone.value.trim(), "country": country.value.trim() }), toggle_modal_new_contact(), create_element_new_contact({ "name": a, "phone": phone.value.trim(), "country": country.value.trim() }), form.reset(), localStorage.setItem(s.key, JSON.stringify(contacts[s.key])) );
          }(a))
        }()
    }
  }())
}

window.onpopstate = function (e) {
  if (e.type !== "popstate") return false;
  (null != e.state) && (function() {
    petition_promise("GET", e.state["page-url"]),
    (null != e.state["func"]) && (
      function() {
        let f = new Function(e.state["func"]);
        f();
      }()
    );
  }());
}

window.onclick = function (e) {
  if (e.type !== "click") return false;
  (e.target.id === "page-login") && (insert_title(titles["login"]), petition_promise("GET", "./assets/layout/login.html"),
    (popstate) 
      ? stt({"page-url": "./assets/layout/login.html"}, titles["login"], "#page-login")
      : window.location.hash = "page-login"
    );
  (e.target.id === "page-signup") && (insert_title(titles["signup"]), petition_promise("GET", "./assets/layout/signup.html"),
    (popstate) 
      ? stt({"page-url": "./assets/layout/signup.html"}, titles["signup"], "#page-signup")
      : window.location.hash = "page-signup"
    );
  (e.target.id === "page-recover") && (insert_title(titles["recover"]), petition_promise("GET", "./assets/layout/forgotten.html"),
    (popstate) 
      ? stt({"page-url": "./assets/layout/forgotten.html"}, titles["recover"], "#page-recover")
      : window.location.hash = "page-recover"
    );
  (e.target.id === "page-settings") && (insert_title(titles["setting"]), petition_promise("GET", "./assets/layout/setting.html"), desactive_boton(),
    (popstate) 
      ? stt({"page-url": "./assets/layout/setting.html", "func": "desactive_boton()"}, titles["setting"], "#page-settings")
      : window.location.hash = "page-settings"
      );
  (e.target.id === "page-acercade") && (insert_title(titles["acercade"]), petition_promise("GET", "./assets/layout/documents.html"), desactive_boton(),
    (popstate) 
      ? stt({"page-url": "./assets/layout/documents.html", "func": "desactive_boton()"}, titles["acercade"], "#page-acercade")
      : window.location.hash = "page-acercade"
      );
}

window.onchange = function (e) {
  if (e.type !== "change") return false;
  (e.target) && (function () {
    if (e.target.id === "email" || e.target.id === "password") {
      document.getElementById("x_Key").value = SHA256(`${document.getElementById("email").value}` + ':' + `${document.getElementById("password").value}`)
    }
  }())

}

receptor_trash.ondragover = e => {
  if (e.type !== "dragover") return false;
  e.preventDefault()
  receptor_trash.classList.add("over")
}

receptor_trash.ondragenter = e => {
  if (e.type !== "dragenter") return false;
  e.preventDefault()
  receptor_trash.classList.add("enter")
}

receptor_trash.ondragleave = e => {
  if (e.type !== "dragleave") return false;
  e.preventDefault()
  receptor_trash.classList.remove("enter")
}

receptor_trash.ondrop = e => {
  if (e.type !== "drop") return false;
  e.preventDefault()
  if (!dataTransfer.items.length) return false;

  let elem = dataTransfer.getData("text"), valid;

  valid = (dataTransfer.items[0].type == "text/plain")
    && (document.querySelector("#recicle-contenetor").appendChild(document.getElementById(elem)), true);

  if (valid) {
    let itemContact = document.getElementById(elem);
    if (valid_position_list(itemContact.firstElementChild) === "false") {

    }
    else if (valid_position_list(itemContact.firstElementChild) === true) {
      if (!document.querySelector(".container-list").firstElementChild.querySelector('[aria-letter="' + itemContact.firstElementChild.textContent.charCodeAt() + '"]').childElementCount) {
        document.querySelector(".container-list").firstElementChild.querySelector('[aria-letter="' + itemContact.firstElementChild.textContent.charCodeAt() + '"]').previousElementSibling.className = "letter";
      }
    }
    else {
      if (!document.querySelector(".container-list").firstElementChild.querySelector('[aria-letter="96"').childElementCount) {
        document.querySelector(".container-list").firstElementChild.querySelector('[aria-letter="96"').previousElementSibling.className = "letter";
      }
    }

    for (let name of document.styleSheets[1].cssRules) {
      if (name.selectorText === ".recicle::after") name.style.content = '" ' + itemContact.parentElement.childElementCount + ' "';
    }

    let item = delete_element_json(document.getElementById(elem));
    if("object" === typeof item) {
      item["status"] = "delete";
      console.log(item);
      localStorage.setItem(s.key, JSON.stringify(contacts[s.key]))
    }

    document.getElementById(elem).removeAttribute("ondrag")
    document.getElementById(elem).removeAttribute("id")

    number_contact--;

    toggle_img_empty();
  }
}

insert_title(titles["home"])