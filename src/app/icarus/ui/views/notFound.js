
export function view(router) {

  // TODO: Redirigir a /weather.
  return router.redirectTo("/weather", {
    filter: 1,
    flux: "solar-wind"
  });


}
