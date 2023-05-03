import { Router } from "express";
// import path from "path";
// import CartManager from "../services/filesystem/controller/cartManager.js";
// import ProductManager from "../services/filesystem/controller/productManager.js";
import CartService from "../services/db/controllers/carts.service.js";
import ProductService from "../services/db/controllers/products.service.js";

const router = Router();

// const car = new CartManager(path.join(".", "files"));
const car = new CartService();

/***   Carga carrito ***/
router.post("/", async (req, res) => {
  await car.addCart();
  res.status(200).send({
    status: "Success",
    message: `Se cargo el carrito`,
  });
});

/***   Obtiene Todos los carritos ***/
router.get("/", async (req, res) => {
  let carts = await car.getCarts();
  let limit = req.query.limit;

  res.status(200).send({
    status: "Success",
    message: !limit ? carts : carts.slice(0, limit),
  });
});

/***   Obtiene carrito por ID ***/
router.get("/:cid", async (req, res) => {
  let carts = await car.getCartById(req.params.cid);

  if (carts.length === 0) {
    res.status(202).send({
      status: "info",
      error: `No se encontró el carrito con ID: ${req.params.cid}`,
    });
  } else {
    res.status(200).send({ status: "Success", message: carts });
  }
});

/***   Cargo Producto en Carrito ID ***/
router.post("/:cid/products/:pid", async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;

  let carts = await car.getCartById(cid);

  /* Verifico si existe el id del carrito */
  if (carts.length === 0) {
    res.status(202).send({
      status: "info",
      error: `No se encontró el carrito con Id: ${cid}`,
    });
  } else {
    let product = await new ProductService().getProductById(pid);
    /* Verifico si existe el id del producto en el maestro de productos  */
    if (product.length === 0) {
      res.status(202).send({
        status: "info",
        error: `Se encontró carrito con ID: ${cid} pero No se encontró el producto con Id: ${pid}`,
      });
    } else {
      /* Existe el id del carrito y el id del producto en el maestro de productos */
      car.addProductCar(cid, pid);

      res.status(200).send({
        status: "Success",
        message: `Se agrego-actualizó el producto Id: ${pid} en el carrito con Id: ${cid}`,
      });
    }
  }
});

/***    Borro todos los productos del carrito  ***/
router.delete("/:cid", async (req, res) => {
  let carts = await car.deleteProducts(req.params.cid);

  if (carts.length === 0) {
    res.status(202).send({
      status: "info",
      error: `No se encontró el carrito con ID: ${req.params.cid}`,
    });
  } else {
    res.status(200).send({ status: "Success", message: carts });
  }
});

/***    Borro del carrito el producto indicado   ***/
router.delete("/:cid/products/:pid", async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;

  let carts = await car.deleteProductById(cid, pid);

  if (carts.length === 0) {
    res.status(202).send({
      status: "info",
      error: `No se encontró el carrito con ID: ${req.params.cid}`,
    });
  } else {
    res.status(200).send({ status: "Success", message: carts });
  }
});

/***   Actualizo la cantidad de un producto pasandole por el body ***/
router.put("/:cid/product/:pid", async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;
  let qty = req.body.quantity;

  let carts = await car.getCartById(cid);

  /* Verifico si existe el id del carrito */
  if (carts.length === 0) {
    res.status(202).send({
      status: "info",
      error: `No se encontró el carrito con Id: ${cid}`,
    });
  } else {
    let product = await new ProductService().getProductById(pid);
    /* Verifico si existe el id del producto en el maestro de productos  */
    if (product.length === 0) {
      res.status(202).send({
        status: "info",
        error: `Se encontró carrito con ID: ${cid} pero No se encontró el producto con Id: ${pid}`,
      });
    } else {
      /* Existe el id del carrito y el id del producto en el maestro de productos */
      car.updateQuantityProduct(cid, pid, qty);

      res.status(200).send({
        status: "Success",
        message: `Se actualizó el producto Id: ${pid} en el carrito con Id: ${cid}`,
      });
    }
  }
});

/***   Agrego productos desde un array por el body  ***/
router.put("/:cid", async (req, res) => {
  let cid = req.params.cid;
  let arr = req.body;

  let carts = await car.getCartById(cid);

  /* Verifico si existe el id del carrito */
  if (carts.length === 0) {
    res.status(202).send({
      status: "info",
      error: `No se encontró el carrito con Id: ${cid}`,
    });
  } else {
    car.updateProductByArray(cid, arr);
    res.status(200).send({
      status: "Success",
      message: `Se actualizó  el carrito con Id: ${cid}`,
    });
  }
});

export default router;
