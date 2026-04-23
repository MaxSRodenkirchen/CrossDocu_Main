
export default {
  layout: "layouts/web.njk",
  eleventyComputed: {
    title: (data) => {
      // Wenn bereits ein Titel gesetzt ist (und er nicht der Standard "Homepage / Index" ist), 
      // könnten wir ihn behalten. Aber da der Wunsch war "immer der Dateiname", 
      // nehmen wir den Pfad-Stamm (Dateiname ohne Endung).
      if (data.page.filePathStem) {
        const name = data.page.filePathStem.split('/').pop();
        return name;
      }
      return data.title;
    }
  }
};
