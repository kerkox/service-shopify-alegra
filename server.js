require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const bodyParser = require('body-parser');

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({
    hola:"mundo"
  })
})

const shop = process.env.SHOPIFY_SHOP || 'shop' 
const hostname = `${shop}.myshopify.com`
const api_key = process.env.SHOPIFY_API_KEY || 'api_key'
const version = process.env.SHOPIFY_VERSION || '2021-01'
const password_api = process.env.PASSWORD_API || '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'
// const url_base = `https://${api_key}:${password}@${hostname}/admin/api/${version}/${resource}.json`
const url_base_shopify = `https://${api_key}:${password_api}@${hostname}/admin/api/${version}/`
const url_base_alegra = `https://api.alegra.com/api/v1/`

const alegra_email = process.env.ALEGRA_EMAIL || 'email@email.com';
const alegra_token = process.env.ALEGRA_TOKEN || 'token';

const alegra_authorization = (email, api_key) => {
  let str =  `${email}:${api_key}`;
  let buff = Buffer.from(str, 'utf-8');
  const base64 = buff.toString('base64');
  return base64;
}


// ======================================
// SHOPIFY
// ======================================
/**
 * 
 * @param {string} url 
 * base para hacer peticion a shopify
 */
const peiticion_shopify = (url) => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((result) => resolve(result))
      .catch(err => reject(err))
  })
}

app.get('/shopify/orders', (req, res) => {

  const url_ordenes = url_base_shopify + 'orders.json'
  peiticion_shopify(url_ordenes).then((result) => {
    res.json(result.data);
  }).catch(err => {
    console.log(err)
    res.json({
      error: err
    })
  })

})


app.get('/shopify/inventory', (req, res) => {
  const url_inventory = url_base_shopify + 'inventory_items.json'
  peiticion_shopify(url_inventory).then((result) => {
    res.json(result.data);
  }).catch(err => {
    console.log("===ERR============")
    console.log(err)
    console.log("===ERR============")
    console.log("======ERR.data=========")
    console.log(err.toJSON())
    console.log("======ERR.data=========")
    res.json({
      error: err.toJSON()
    })
  })
})

/**
 * aqui se recibe data que puede ser las URL que se forman 
 * para pedir informacion al API de shopify y asi lograr
 * dejarlo como un proxy, 
 * Aun esta en analisis porque se dejo para pruebas
 * ya que puede ser una puerta abierta para cualquier cosa
 */
app.get('/shopify/get/:data', (req, res) => {
  const data = req.params.data;
  const url_data = url_base_shopify + data
  peiticion_shopify(url_data).then((result) => {
    res.json(result.data);
  }).catch(err => {
    res.json(showErrorJson(err))
  })
})

app.post('/shopify/webhook', (req, res) => {
  const body = req.body;
  console.log("=========BODY SHOPIFY WEBHOOK - POST ===========")
  console.log(body)
  console.log("=========BODY SHOPIFY WEBHOOK ===========")
  res.json({ ok: true })
})


// ======================================
// END SHOPIFY
// ======================================


// ======================================
// ALEGRA 
// ======================================



/**
 * 
 * @param {string} url 
 * base para hacer peticion a Alegra
 */
const peticion_alegra = (url) => {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
        'Authorization': `Basic ${alegra_authorization(alegra_email,alegra_token)}`
      }
    }).then((result) => resolve(result))
    .catch(err => reject(err))
  })
}






app.get('/alegra/get/:data', (req, res ) => {
  const data = req.params.data;
  const url_data = url_base_alegra + data;
  peticion_alegra(url_data).then(result => {
    res.json(result.data);
  }).catch(err => {
    res.json(showErrorJson(err))
  })
})

// ======================================
// END ALEGRA 
// ======================================

// ======================================
// SHARED
// ======================================

showErrorJson = (err) => {
  console.log("===ERR============")
  console.log(err)
  console.log("===ERR============")
  console.log("======ERR.data=========")
  console.log(err.toJSON())
  console.log("======ERR.data=========")
  return {
    error: err.toJSON()
  };
}



const port = process.env.PORT || 3000;

app.listen(port,function(){
  console.log(`escuchando en el puerto: ${port}`);
})