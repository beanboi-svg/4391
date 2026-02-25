(() => {
  const STORAGE_KEY = "ft_lang";
  const SUPPORTED_LANGS = ["en", "es"];

  const translations = {
    en: {
      "meta.title": "Frederick Theatre",
      "nav.about": "About",
      "nav.menu": "Menu",
      "nav.close": "Close",
      "home.welcomeTo": "Welcome to",
      "home.mainText":
        "Frederick Theatre is a vibrant and welcoming community where students come together to create, perform, and grow. Through plays, musicals, and events, we celebrate storytelling, build lifelong skills, and make space for every voice to be heard, onstage and off.",
      "about.heading": "About",
      "about.mainText1":
        "Frederick Theatre is committed to creating a theatre environment where every student feels seen, valued, and welcome. Our mission is to ensure that theatre is accessible to all, regardless of race, religion, ability, experience level, gender identity, sexual orientation, economic background, or language. We believe that the stage should reflect the diversity of our community, and we strive to build a space where students can grow as artists, collaborators, and individuals.",
      "about.itsHeading": "International Thespian Society",
      "about.mainText2":
        "Troupe 4391 is a proud member of the International Thespian Society, an honor organization for high school theatre students. The International Thespian Society promotes excellence in theatre education and recognizes student achievement in all aspects of theatre production and performance. Their mission to celebrate student artists, support inclusive theatre programs, and develop leadership through the arts directly supports the values we uphold at Frederick High School. As part of ITS, we are committed to fostering a community where students can grow, collaborate, and find belonging through the transformative power of theatre.",
      "footer.index.prefix": "Frederick Theatre operates as a program under the ",
      "footer.about.prefix": "Frederick Theatre operates as a program under the ",
      "footer.foundation": "FHS Music Foundation",
      "footer.index.suffix":
        ", a registered 501(c)(3) nonprofit organization. 2026 All Rights Reserved.",
      "footer.about.suffix": ", a registered 501(c)(3) nonprofit organization.",
      "portal.title": "Frederick Theatre Online Portal",
      "portal.redirectText": "If you are not redirected automatically, ",
      "portal.clickHere": "click here",
      "portal.period": ".",
    },
    es: {
      "meta.title": "Frederick Theatre",
      "nav.about": "Acerca de",
      "nav.menu": "Menú",
      "nav.close": "Cerrar",
      "home.welcomeTo": "Bienvenidos a",
      "home.mainText":
        "Frederick Theatre es una comunidad vibrante y acogedora donde los estudiantes se reúnen para crear, actuar y crecer. A través de obras, musicales y eventos, celebramos la narración, desarrollamos habilidades para toda la vida y damos espacio para que todas las voces sean escuchadas, dentro y fuera del escenario.",
      "about.heading": "Acerca de",
      "about.mainText1":
        "Frederick Theatre se compromete a crear un ambiente teatral donde cada estudiante se sienta visto, valorado y bienvenido. Nuestra misión es garantizar que el teatro sea accesible para todos, independientemente de la raza, religión, capacidad, nivel de experiencia, identidad de género, orientación sexual, situación económica o idioma. Creemos que el escenario debe reflejar la diversidad de nuestra comunidad y nos esforzamos por construir un espacio donde los estudiantes puedan crecer como artistas, colaboradores e individuos.",
      "about.itsHeading": "International Thespian Society",
      "about.mainText2":
        "La Tropa 4391 es un orgulloso miembro de la International Thespian Society, una organización de honor para estudiantes de teatro de secundaria. La International Thespian Society promueve la excelencia en la educación teatral y reconoce los logros estudiantiles en todos los aspectos de la producción y la actuación. Su misión de celebrar a los artistas estudiantiles, apoyar programas de teatro inclusivos y desarrollar liderazgo a través de las artes apoya directamente los valores que defendemos en Frederick High School. Como parte de ITS, estamos comprometidos a fomentar una comunidad donde los estudiantes puedan crecer, colaborar y encontrar pertenencia a través del poder transformador del teatro.",
      "footer.index.prefix": "Frederick Theatre funciona como un programa bajo la ",
      "footer.about.prefix": "Frederick Theatre funciona como un programa bajo la ",
      "footer.foundation": "FHS Music Foundation",
      "footer.index.suffix":
        ", una organización sin fines de lucro registrada 501(c)(3). 2026 Todos los derechos reservados.",
      "footer.about.suffix":
        ", una organización sin fines de lucro registrada 501(c)(3).",
      "portal.title": "Portal en Línea de Frederick Theatre",
      "portal.redirectText": "Si no se redirige automáticamente, ",
      "portal.clickHere": "haga clic aquí",
      "portal.period": ".",
    },
  };

  function normalizeLang(lang) {
    if (!lang) return "en";
    const normalized = String(lang).toLowerCase().split("-")[0];
    return SUPPORTED_LANGS.includes(normalized) ? normalized : "en";
  }

  function getPathLang() {
    const path = window.location?.pathname || "/";
    if (path === "/es" || path.startsWith("/es/")) return "es";
    return null;
  }

  function getSavedLang() {
    try {
      return normalizeLang(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      return "en";
    }
  }

  function saveLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }

  function toLanguagePath(targetLang) {
    const normalizedTarget = normalizeLang(targetLang);
    const path = window.location?.pathname || "/";

    if (normalizedTarget === "es") {
      if (path === "/es" || path.startsWith("/es/")) return path;
      if (path === "/") return "/es/";
      return `/es${path}`;
    }

    // en
    if (path === "/es" || path === "/es/") return "/";
    if (path.startsWith("/es/")) return path.slice(3) || "/";
    return path;
  }

  function t(lang, key) {
    return translations[lang]?.[key] ?? translations.en[key] ?? "";
  }

  function applyTranslations(lang) {
    const nodes = document.querySelectorAll("[data-i18n]");
    for (const node of nodes) {
      const key = node.getAttribute("data-i18n");
      if (!key) continue;
      node.textContent = t(lang, key);
    }

    const html = document.documentElement;
    if (html) html.setAttribute("lang", lang);
  }

  function syncLanguageSelects(lang) {
    const selects = document.querySelectorAll('select[name="language-select"]');
    for (const select of selects) {
      select.value = lang;
    }
  }

  function setLanguage(lang) {
    const normalized = normalizeLang(lang);
    saveLang(normalized);
    applyTranslations(normalized);
    syncLanguageSelects(normalized);
  }

  function bindLanguageSelects() {
    const selects = document.querySelectorAll('select[name="language-select"]');
    for (const select of selects) {
      select.addEventListener("change", (e) => {
        const value = normalizeLang(e.target?.value);
        saveLang(value);

        const targetPath = toLanguagePath(value);
        const currentPath = window.location?.pathname || "/";
        if (targetPath !== currentPath) {
          const search = window.location?.search || "";
          const hash = window.location?.hash || "";
          window.location.assign(`${targetPath}${search}${hash}`);
          return;
        }

        setLanguage(value);
      });
    }
  }

  function init() {
    const pathLang = getPathLang();
    const lang = pathLang ?? "en";
    saveLang(lang);
    applyTranslations(lang);
    syncLanguageSelects(lang);
    bindLanguageSelects();
    window.setLanguage = setLanguage;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
