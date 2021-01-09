# SERVICIO SHOPIFY ALEGRA
Este es un servicio para unir procesos de shopify y Alegra por ahora

## Arrancar proyecto en modo desarrollo

1. crear archivo `.env` a partir del archivo `.env.example` y luego configurar las variables

las variables necesarias son: 
```
  ALEGRA_EMAIL=
  ALEGRA_TOKEN=

  SHOPIFY_API_KEY=
  SHOPIFY_SHOP=
```

2. despues se ejecuta el comando 

`npm run dev`

3. para hacer las pruebas del webhook de shopify se puede publicar el servicio local con [ngrok](https://ngrok.com/)
  al instalar **ngrok** se usa ejecutando el siguiente comando:

  `ngrok http [puerto]`

  camabiando `[puerto]` por el puerto asignado para correr en node el servicio

4. agregar la URL del webhook en shopify para recibir la data



