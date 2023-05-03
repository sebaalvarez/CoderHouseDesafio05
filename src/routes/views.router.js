import { Router } from "express";

import CartService from "../services/db/controllers/carts.service.js";
import ProductService from "../services/db/controllers/products.service.js";

const router = Router();

const cartService = new CartService();
const productService = new ProductService();

function auth(req, res, next) {
  // console.log(req.session.user);
  if (req.session.user) {
    return next();
  } else {
    return (
      res
        // .status(403)
        // .send(`El usuario no tiene permisos para ingresar a esta página`)
        .render("sinAcceso", {})
    );
  }
}

router.get("/", async (req, res) => {
  res.render("home", {});
});

/*********************/
/*        SESSION         */
/*********************/

// router.get("/session", (req, res) => {
//   if (req.session.counter) {
//     req.session.counter++;
//     res.send(
//       `Bienvenido nuevamente, usted ingreso: ${req.session.counter} veces.`
//     );
//   } else {
//     req.session.counter = 1;
//     res.send(`Bienvenido, es la primera vez que usted ingresa.`);
//   }
// });

// router.get("/login", (req, res) => {
//   const { username, pass } = req.query;

//   if (username !== "pepe" && pass !== "123") {
//     res.send("Usuario o contraseña incorrecta");
//   } else {
//     req.session.user = username;
//     req.session.admin = true;
//     res.send(`Bienvenido: ${username}`);
//   }

// });

// router.get("/logout", (req, res) => {
//   const user = req.session.user;
//   req.session.destroy((err) => {
//     if (err) {
//       return res.json({ status: "Error", body: err });
//     }
//     res
//       .clearCookie("connect.sid")
//       .send(`session finalizada correctamente ${user}.`);
//   });
// });

// router.get("/private", auth, (req, res) => {
//   res.send(
//     `Puedes acceder al sector privado porque ya te logueaste ${req.session.user}`
//   );
// });

/*********************/
/*    FIN   SESSION    */
/*********************/

/***  Obtiene Todos los productos y los muestra por navegador  ***/
router.get("/products", auth, async (req, res) => {
  let limit = req.query.limit;
  let page = req.query.page;
  let sort = req.query.sort;
  let query = req.query.query;

  let usr = req.session.user;
  // console.log(
  //   `Limite: ${limit} || Pagina: ${page} || Orden: ${sort} || Query: ${query} `
  // );
  let prod = await productService.getProducts(limit, page, sort, query);

  prod.prevLink = prod.hasPrevPage
    ? `http://localhost:8080/products?page=${prod.prevPage}`
    : "";
  prod.nextLink = prod.hasNextPage
    ? `http://localhost:8080/products?page=${prod.nextPage}`
    : "";
  prod.isValid = !(page <= 0 || page > prod.totalPages);
  // let products = prod.docs.map((p) => p.toObject());
  res.render("products", { ...prod, usr });
});

/***  Obtiene Todos los productos del Carrito indicado y los muestra por navegador  ***/
router.get("/carts/:cid", auth, async (req, res) => {
  let usr = req.session.user;
  let carts = await cartService.getCartById(req.params.cid);

  res.render("productsByCart", { ...carts, usr });
});

export default router;
