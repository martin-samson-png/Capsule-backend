import app from "./app";
import { env } from "./config/env";


app.listen(env.PORT, () => {console.log(`Server lancé sur le port ${env.PORT}`);
})
