
export function view(router) {

  // TODO: Redirigir a /weather.
  return router.redirectTo("/weather", {
    filter: 171,
    flux: "solar-wind"
  });


}
