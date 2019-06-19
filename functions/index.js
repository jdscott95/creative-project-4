const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();


// Create a new pokemon in the museum: takes a name and a path to an image.
var db = firebase.firestore();
var pokemonsRef = db.collection('pokemons');

app.post('/api/pokemons', async (req, res) => {
    try {
        let querySnapshot = await pokemonsRef.get();
        let numRecords = querySnapshot.docs.length;
        let pokemon = {
            id: numRecords + 1,
            name: req.body.name,
      //      path: req.body.path,
            description: req.body.type,
        };
        pokemonsRef.doc(pokemon.id.toString()).set(pokemon);
        res.send(pokemon);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

// Get a list of all of the pokemons in the museum.
app.get('/api/pokemons', async (req, res) => {
    try{
        let querySnapshot = await pokemonsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

app.delete('/api/pokemons/:id', async (req, res) => {
    console.log('id: ', req.params.id);
    try{
        let querySnapshot = await pokemonsRef.get();
        let records = querySnapshot.docs.length;
        let findId = req.params.id;
        pokemonsRef.doc(findId).delete();
       if (findID !== records)
        {
          for (let i = (findID + 1); i < records; i++)
          {
            pokemonsRef.docs(i.toString()).update({
              id: i - 1,
            })
          }
        }
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

app.put('/api/pokemons/:id', async (req, res) => {
    console.log('id: ', req.params.id);
    try{
        let newName = req.body.name;
        let newDescription = req.body.description;
        console.log(req.body.name);
        let findID = req.params.id;
        pokemonsRef.doc(findID.toString()).update({
            name: newName,
            description: newDescription,
        })
        let querySnapshot = await pokemonsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
