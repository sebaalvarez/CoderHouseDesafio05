import express, { urlencoded } from "express";
import exphbs from "express-handlebars";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";

import _dirname from "./utils.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.router.js";
import usersViewRouter from "./routes/users.views.router.js";
import sessionsRouter from "./routes/sessions.router.js";

// const fileStorage = FileStore(session);
const app = express();
const PORT = 8080;
const MONGO_URL =
  "mongodb://localhost:27017/ecommerce?retryWrites=true&w=majority";

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(_dirname, "public")));

app.use(cookieParser());
app.use(
  session({
    // store: fileStorage({ path: "./sessions", ttl: 100, retries: 0 }),
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 100,
    }),
    secret: "S3cr3t",
    resave: false,
    saveUninitialized: true,
  })
);

// motor de plantillas
app.set("views", path.join(_dirname, "views"));

app.engine(
  ".hbs",
  exphbs.engine({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", ".hbs");

// endpoints
app.use("/", viewsRouter);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/sessions", sessionsRouter);
app.use("/users", usersViewRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Conectado con exito a MongoDB usando Moongose.");

    /*let nuevoEstudiante = await studentsModel.create({
            name: "Luis",
            lastName : "Munar",
            age : "20",
        });*/

    /*let nuevoCurso = await coursesModel.create(
            {
                title: "Curso Backend",
                description: "Curso backend de NodeJS",
                teacherName: "Juan Torres"
            }
        );*/

    // let student = await studentsModel.findOne({
    //   _id: "640a705f72d18c48ca6f6741",
    // });
    // console.log(JSON.stringify(student, null, "\t"));

    //student.courses.push({course: "640a719de27c256369c70d15"});
    //console.log(JSON.stringify(student));

    //let result = await studentsModel.updateOne(student);
    //console.log(result);
  } catch (error) {
    console.error("No se pudo conectar a la BD usando Moongose: " + error);
    process.exit();
  }
};
connectMongoDB();
